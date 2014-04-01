/**
 * Created by simingweng on 1/4/14.
 */
var floor = require('../routes/floor');

exports.test_geo_reference = function (test) {
    var buildingid = 'testbuilding';
    var dummy_floor = {
        gcps: [
            {x: 259, y: 568, lng: 103.84452123194933, lat: 1.286879711908067},
            {x: 2825, y: 173, lng: 103.84505398571491, lat: 1.2865803858247906},
            {x: 2825, y: 2151, lng: 103.84470161050558, lat: 1.2861935746864295}
        ],
        image: 'IMG_1419.jpg'
    };
    floor.georeference(buildingid, dummy_floor, function (error, tiff) {
        floor.tile(buildingid, 'testfloor', tiff, function (error) {
            test.ok(!error, 'image has been successfully geo referenced and tiled');
            test.done();
        });
    });
};