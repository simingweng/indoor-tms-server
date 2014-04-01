/**
 * Created by simingweng on 18/3/14.
 */

var Building = require('../models/building');
var rimraf = require('rimraf');
var path = require('path');

var ngnixroot = '/var/indoortmsdata';

exports.list = function (req, res) {
    Building.find({userid: req.userid}, function (err, buildings) {
        if (err) {
            res.send(500, err);
        } else {
            res.json(buildings);
        }
    });
};

exports.get = function (req, res) {
    Building.findById(req.params.bid, function (err, building) {
        if (err) {
            res.send(500, err);
        } else {
            res.json(building);
        }
    });
};

exports.add = function (req, res) {
    var building = new Building();
    building.name = req.body.bname;
    building.formatted_address = req.body.formatted_address;
    building.iconurl = req.body.iconurl;
    building.created = new Date();
    building.userid = req.userid;
    building.save(function (err, newbuilding) {
        if (err) {
            res.send(500, err);
        } else {
            res.json(newbuilding);
        }
    });
};

exports.remove = function (req, res) {
    Building.findByIdAndRemove(req.params.bid, function (err, removedbuilding) {
        if (err) {
            res.send(500, err);
        } else {
            res.json(removedbuilding);
            rimraf(path.join(ngnixroot, req.params.bid), function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
};

exports.modify = function (req, res) {
    Building.findById(req.params.bid, function (err, building) {
        if (err) {
            res.send(500, err);
        } else {
            building.name = req.body.bname;
            building.formatted_address = req.body.formatted_address;
            building.iconurl = req.body.iconurl;
            building.save(function (err, newbuilding) {
                if (err) {
                    res.send(500, err);
                } else {
                    res.json(newbuilding);
                }
            });
        }
    });
};