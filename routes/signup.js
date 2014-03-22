/**
 * Created by simingweng on 18/3/14.
 */

var User = require('../models/user');
var bcrypt = require('bcrypt');

module.exports = function (req, res) {
    if (!req.body.username || !req.body.password) throw new Error('invalid arguments');
    User.find({'username': req.body.username}, function (err, users) {
        if (err) {
            res.send(500, err);
        } else if (users.length != 0) {
            res.send(500, {error: 'user has existed'});
        } else {
            var newuser = new User();
            newuser.username = req.body.username;
            bcrypt.genSalt(12, function (err, salt) {
                if (err) {
                    res.send(500);
                } else {
                    newuser.salt = salt;
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if (err) {
                            res.send(500);
                        } else {
                            newuser.password = hash;
                            bcrypt.hash(newuser.username + ':' + newuser.password, salt, function (err, hash) {
                                if (err) {
                                    res.send(500);
                                } else {
                                    newuser.token = hash;
                                    newuser.save(function (err) {
                                        if (err) {
                                            res.send(500, err);
                                        } else {
                                            res.json({'token': newuser.token});
                                        }
                                    });
                                }
                            })
                        }
                    });
                }
            });
        }
    });
};