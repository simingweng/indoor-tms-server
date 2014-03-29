/**
 * Created by simingweng on 25/3/14.
 */
var fs = require('fs');
var Floor = require('../models/floor');
var Building = require('../models/building');
var path = require('path');
var mkdirp = require('mkdirp');

exports.add = function (req, res) {
    var imagetTempPath = req.body.image;
    var buildingid = req.params.bid;
    var floorImageLocation = path.join(__dirname, '..', 'public', buildingid, path.basename(imagetTempPath));
    //move the file to public web folder
    mkdirp(path.dirname(floorImageLocation), function (err) {
        if (err) {
            res.send(500, err);
        } else {
            fs.renameSync(imagetTempPath, floorImageLocation);
            //rewrite the image URL to be saved in the database
            req.body.image = path.basename(imagetTempPath);
            req.body.created = new Date();
            var floor = new Floor(req.body);
            Building.findById(buildingid, function (err, building) {
                if (err) {
                    res.send(500, err);
                } else {
                    building.floors.push(floor);
                    building.save(function (err, newBuilding) {
                        if (err) {
                            res.send(500, err);
                        } else {
                            res.json(newBuilding);
                        }
                    });
                }
            });
        }
    });
};

exports.remove = function (req, res) {

};

exports.modify = function (req, res) {

};