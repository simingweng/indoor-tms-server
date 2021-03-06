/**
 * Created by simingweng on 27/3/14.
 */
var mongoose = require('mongoose');
var GCP = require('./gcp');

var floor_schema = new mongoose.Schema({
    name: {type: String, required: true},
    level: Number,
    created: Date,
    image: {type: String, required: true},
    gcps: [GCP.schema]
});

mongoose.model('Floor', floor_schema);
module.exports = mongoose.model('Floor');