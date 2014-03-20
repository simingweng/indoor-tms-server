/**
 * Created by simingweng on 18/3/14.
 */

var auth = require('basic-auth');
var bcrypt = require('bcrypt');
var API_User = require('../../models/apiuser');
var User = require('../../models/user');

exports.apiauth = function (req, res, next) {
    var credentials = auth(req);
    if (!credentials) {
        next(new Error('basic authorization is missing'));
    } else {
        API_User.find({'name': credentials.name}, function (err, users) {
            if (err) {
                next(err);
            } else if (!users || users.length == 0) {
                next(new Error('user does not exist'));
            } else {
                var user = users[0];
                bcrypt.hash(credentials.pass, user.salt, function (err, hash) {
                    if (err) {
                        next(err);
                    } else if (hash == user.password) {
                        next()
                    } else {
                        next(new Error('wrong password'));
                    }
                });
            }
        });
    }
};

exports.userauth = function (req, res, next) {
    if (!req.query.usertoken) {
        next(new Error('user token is missing'));
    } else {
        User.find({'token': req.query.usertoken}, function (err, users) {
            if (users.length != 1) {
                next(new Error('invalid user token'));
            } else {
                req.userid = users[0]._id;
                next();
            }
        });
    }
};