/**
 * Created by simingweng on 20/3/14.
 */
var mongoose = require('mongoose');
var Floor = require('./floor');

var building_schema = new mongoose.Schema({
    name: {type: String, required: true},
    formatted_address: String,
    iconurl: String,
    reference: String,
    created: Date,
    userid: {type: mongoose.Schema.Types.ObjectId, required: true},
    location: {lng: {type: Number, min: -180, max: 180}, lat: {type: Number, min: -90, max: 90}},
    floors: [Floor.schema]
});

mongoose.model('Building', building_schema);
module.exports = mongoose.model('Building');