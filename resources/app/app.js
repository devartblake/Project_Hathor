var app = require('app');
var ipc = require('ipc');
var server = require('./server');
var BrowserWindow = require('browser-window');

var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
  	title: 'Hathor',
    width: 800,
    height: 600,
    'auto-hide-menu-bar': false,
    'use-content-size': true,
  });
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.focus();
});


ipc.on('close', function() {
  app.quit()
});

ipc.on('minimize', function() {
	mainWindow.minimize();
});

server(function(port) {
    window.serverPort = port;
});