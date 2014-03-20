/**
 * Created by simingweng on 18/3/14.
 */

var mongoose = require('mongoose');

var API_User_Schema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String
});
mongoose.model('API_User', API_User_Schema);

module.exports = mongoose.model('API_User');