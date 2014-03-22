/**
 * Created by simingweng on 18/3/14.
 */

var mongoose = require('mongoose');

var API_User_Schema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    salt: {type: String, required: true}
});
mongoose.model('API_User', API_User_Schema);

module.exports = mongoose.model('API_User');