/**
 * Created by simingweng on 25/3/14.
 */
var fs = require('fs');
var Building = require('../models/building');
var path = require('path');
var mkdirp = require('mkdirp');
var child_process = require('child_process');
var rimraf = require('rimraf');
var sizeof = require('image-size');
var Floor = require('../models/floor');

var ngnixroot = '/var/indoortmsdata';

exports.add = function (req, res) {
    var imagetTempPath = req.body.image;
    var buildingid = req.params.bid;
    var floorImageLocation = path.join(ngnixroot, buildingid, path.basename(imagetTempPath));
    //move the file to public web folder
    mkdirp(path.dirname(floorImageLocation), function (err) {
        if (err) {
            res.send(500, err);
        } else {
            fs.renameSync(imagetTempPath, floorImageLocation);
            //rewrite the image property to be saved in the database
            req.body.image = path.basename(imagetTempPath);
            req.body.created = new Date();
            Building.findById(buildingid, function (err, building) {
                if (err) {
                    res.send(500, err);
                } else {
                    var floor = new Floor(req.body);
                    building.floors.push(floor);
                    building.save(function (err, newBuilding) {
                        if (err) {
                            res.send(500, err);
                        } else {
                            res.json(floor);
                            //geo reference and tile the floor plan
                            exports.georeference(buildingid, floor, function (err, tiff) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    exports.tile(buildingid, floor._id.toString(), tiff, function (err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.remove = function (req, res) {
    Building.findById(req.params.bid, function (err, building) {
        if (err) {
            res.send(500, err);
        } else {
            building.floors.id(req.params.fid).remove();
            building.save(function (err, savedbuilding) {
                if (err) {
                    res.send(500, err);
                } else {
                    res.json(savedbuilding);
                    rimraf(path.join(ngnixroot, req.params.bid, req.params.fid), function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        }
    });
};

exports.modify = function (req, res) {

};

exports.georeference = function (buildingid, floor, callback) {
    var imagepath = path.join(ngnixroot, buildingid, floor.image);
    var imageDimension = sizeof(imagepath);
    var command = ['gdal_translate', '-of', 'GTiff', '-a_srs', 'EPSG:4326'];
    for (var i = 0; i < floor.gcps.length; i++) {
        command.push('-gcp', Math.round(floor.gcps[i].x * imageDimension.width).toString(), Math.round(floor.gcps[i].y * imageDimension.height).toString(), floor.gcps[i].lng.toString(), floor.gcps[i].lat.toString());
    }
    command.push(imagepath);
    command.push(imagepath + '.tiff');
    child_process.exec(command.join(' '), function (error, stdout, stderr) {
        if (error) {
            console.log('gdal_translate: ' + stderr);
        } else {
            console.log('gdal_translate: ' + stdout);
        }
        if (callback) {
            callback(error, imagepath + '.tiff');
        }
    });
};

exports.tile = function (buildingid, floorid, tiff, callback) {
    var command = ['gdal2tiles.py', '-s', 'EPSG:4326', '-z 16-20', tiff];
    var destination = path.join(ngnixroot, buildingid, floorid);
    command.push(destination);
    child_process.exec(command.join(' '), function (error, stdout, stderr) {
        if (error) {
            console.log('gdal2tiles: ' + stderr);
        } else {
            console.log('gdal2tiles: ' + stdout);
        }
        if (callback) {
            callback(error);
        }
    });
};