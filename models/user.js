/**
 * Created by simingweng on 18/3/14.
 */
var mongoose = require('mongoose');

var User_Schema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    salt: {type: String, required: true},
    token: {type: String, required: true}
});
mongoose.model('User', User_Schema);

module.exports = mongoose.model('User');