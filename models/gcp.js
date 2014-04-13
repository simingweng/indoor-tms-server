/**
 * Created by simingweng on 27/3/14.
 */
var mongoose = require('mongoose');

var gcp_schema = new mongoose.Schema({
    x: {type: Number, min: 0, max: 1, required: true},
    y: {type: Number, min: 0, max: 1, required: true},
    lng: {type: Number, min: -180, max: 180, required: true},
    lat: {type: Number, min: -90, max: 90, required: true}
});

mongoose.model('GCP', gcp_schema);
module.exports = mongoose.model('GCP');