/**
 * Created by simingweng on 18/3/14.
 */

var Building = require('../models/building');

exports.list = function (req, res) {
    Building.find({userid: req.userid}, function (err, buildings) {
        if (err) {
            sendDatabaseError(res);
        } else {
            res.json(buildings);
        }
    });
};

exports.get = function (req, res) {
    Building.findById(req.params.bid, function (err, building) {
        if (err) {
            sendDatabaseError(res);
        } else {
            res.json(building);
        }
    });
    res.json({});
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
            sendDatabaseError(res);
        } else {
            res.json(newbuilding);
        }
    });
};

exports.remove = function (req, res) {

};

exports.modify = function (req, res) {

};

function sendDatabaseError(res) {
    res.send(500, {error: 'error occurred when accessing database'});
}