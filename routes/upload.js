/**
 * Created by simingweng on 27/3/14.
 */
var formidable = require('formidable');

exports.upload = function (req, res) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.send(500, err);
        } else {
            res.json(files);
        }
    });
};