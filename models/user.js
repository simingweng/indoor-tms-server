/**
 * Created by simingweng on 18/3/14.
 */
var mongoose = require('mongoose');

var User_Schema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    token: String
});
mongoose.model('User', User_Schema);

module.exports = mongoose.model('User');