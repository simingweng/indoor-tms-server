/**
 * Created by simingweng on 18/3/14.
 */

var User = require('../models/user');
var bcrypt = require('bcrypt');

exports.obtain = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        res.send(500, {error: 'invalid argument'});
    }
    User.find({'username': username}, function (err, users) {
        if (err) {
            res.send(500, err);
        } else if (!users || users.length == 0) {
            res.send(500, {error: 'user does not exist'});
        } else {
            var user = users[0];
            bcrypt.hash(password, user.salt, function (err, hash) {
                if (err) {
                    res.send(500);
                } else if (user.password == hash) {
                    res.json({'token': user.token});
                } else {
                    res.send(500, {error: 'wrong password'});
                }
            });
        }
    });
};