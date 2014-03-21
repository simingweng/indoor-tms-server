/**
 * Created by simingweng on 20/3/14.
 */

var mongoose = require('mongoose');

var gcp_schema = new mongoose.Schema({
    x: {type: Number, min: 0},
    y: {type: Number, min: 0},
    lng: {type: Number, min: -180, max: 180},
    lat: {type: Number, min: -90, max: 90}
});

var floor_schema = new mongoose.Schema({
    name: String,
    level: Number,
    created: Date,
    imageid: mongoose.Schema.Types.ObjectId,
    gcps: [gcp_schema]
});

var building_schema = new mongoose.Schema({
    name: String,
    formatted_address: String,
    iconurl: String,
    reference: String,
    created: Date,
    userid: mongoose.Schema.Types.ObjectId,
    location: {lng: {type: Number, min: -180, max: 180}, lat: {type: Number, min: -90, max: 90}},
    floors: [floor_schema]
});


mongoose.model('Building', building_schema);

module.exports = mongoose.model('Building');