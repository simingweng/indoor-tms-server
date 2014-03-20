/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var building = require('./routes/building');
var token = require('./routes/token');
var signup = require('./routes/signup');
var authentication = require('./lib/middleware/authentication');
var https = require('https');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use('/api', authentication.apiauth);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

//sign up a new user
app.post('/api/signup', signup);

//obtain the user access token
app.post('/api/user_token', token.obtain);

//get all the buildings
app.get('/api/buildings', authentication.userauth, building.list);
//get a single building
app.get('/api/buildings/:bid', authentication.userauth, building.get);
//add a building
app.post('/api/buildings', authentication.userauth, building.add);
//remove a building
app.delete('/api/buildings/:bid', authentication.userauth, building.remove);
//update a building
app.put('/api/buildings/:bid', authentication.userauth, building.modify);

//establish the database connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/indoortms');

//configuration for https
var server_opt = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./key-cert.pem')
};

//ensure db connection closed upon server shutdown
process.on('SIGINT', function () {
    mongoose.disconnect();
    process.exit(0);
});

//start up the server
https.createServer(server_opt, app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
