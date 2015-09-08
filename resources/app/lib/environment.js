var fs = require('fs');
var path = require('path');

module.exports = function() {

	require("dotenv").load();

	var missing = fs.readFileSync(path.resolve(__dirname, "..", ".env"), "uft-8")
	.match(/^(\w+)/gm)
	.filter(function(varr){
		return !process.env[varr];
	});

	if (missing.length) {
		console.error("\missing: " + missing.join(", "));
		console.error("please update your .env or service.json");
		process.exit(1);
	}
};