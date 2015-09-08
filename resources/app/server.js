var getport = require('./getport');
var express = require('express.io');
app = express().http().io();

module.exports = function(callback) {
	app.use(express.static(__dirname + '/static'));
	// Cookie Session
	app.use(express.cookieParser());
	app.use(express.session({secret: 'CookieMonster'}));

	// Session is automatically setup on initial request.
	app.get('/', function(req, res) {
		req.session.loginDate = new Date().toString()
		res.sendfile(__dirname + '/index.html')
	});

	// Setup a route for the ready event, and add session data.
	app.io.route('ready', function(req) {
		req.session.name = req.data
		req.session.save(function() {
			req.io.emit('get-feelings')
		});
	});

	// Send back the session data.
	app.io.route('send-feelings', function(req) {
		req.session.feelings = req.data
		req.session.save(function() {
			req.io.emit('session', req.session)
		});
	});

	// Socket.io server setup
	app.io.on('connection', function() {
		socket.on('event', function(data) {

		});
		socket.on('disconnect', function() {

		});
	});
	var server = app.listen(7076);	
}