var gulp = require ('gulp'),
	browserify = require('browserify'),
	cssmin = require('gulp-cssmin'),
	concat = require('gulp-concat'),
	del = require('del'),
	fs = require('fs'),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint')
	less = require('gulp-less'),
	rename = require('gulp-rename'),
	rimraf = require('rimraf'),
	streamify = require('gulp-streamify'),
	source = require('vinyl-source-stream'),
	uglify = require('gulp-uglify');

var paths = {
	bower: ["./bower_components/"],
	styles: ["./assets/styles/*"],
	fonts: ["./assets/fonts/*"],
	images: ["./assets/images/**/*"],
	misc: ['./assets/misc/*'],
	scripts: ["./assets/scripts/"],
	libs: {
			browserify: ["./assets/scripts/*.js"],
			vendor: ["./assets/scripts/vendor/*.js"]
		},
	lintables: ["./assets/scripts/**/*.js"]	
};

gulp.task('clean', function (cb) {
	rimraf("./assets/scripts/vendor", cb);	
});

gulp.task('watch', function() {
	gulp.watch(paths.fonts, ['fonts']);
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.libs.browserify, ['browserify']);
	gulp.watch(paths.libs.vendor, ['concat']);
});

gulp.task('styles', function() {
	return function() {
	gulp.src('./assets/styles/index.less')
		.pipe(less())
		.on('error', function(err) {
			gutil.log('Error in less build:');
			gutil.log(err.stack);
		})
		.pipe(cssmin())
		.pipe(gulp.dest('static/css/'));
	}	
});

gulp.task('browserify', function() {
	browserify("./assets/index.js")
	.bundle()
	.pipe(source('index.js'))
	.pipe(gulp.dest('static/js/'))
	.pipe(rename('index.min.js'))
	.pipe(streamify(uglify()))
	.pipe(gulp.dest('static/js/'));
});

gulp.task('concat', function() {
	gulp.src(paths.libs.vendor)
	.pipe(uglify())
	.pipe(concat('vendor.min.js'))
	.pipe(gulp.dest('static/js/'));
});

gulp.task('fonts', function() {
	gulp.src(paths.fonts)
	.pipe(gulp.dest('static/fonts'));
});

gulp.task('images', function() {
	gulp.src(paths.images)
	.pipe(gulp.dest('static/images'));
});

gulp.task('misc', function() {
	gulp.src(paths.misc)
	.pipe(gulp.dest('static/misc'));
});

gulp.task('copy', ['clean'], function(cb) {
	var bower = {
		"bootstrap": "bootstrap/dist/**/*.{js,map}",
		"jquery": "jquery/dist/*.{js,map}",
		"angular": "angular/*.{js,map}",
		"angular-animate": "angular-animate/*.{js,map}",
		"angular-aria": "angular-aria/*.{js,map}",
		"angular-cookies": "angular-cookies/*.{js,map}",
		"angular-loader": "angular-loader/*.{js,map}",
		"angular-material": "angular-material/*.{js,map,css}",
		"angular-message-format": "angular-message-format/*.{js,map}",
		"angular-messages": "angular-messages/*.{js,map}",
		"angular-moment": "angular-moment/*.{js,map}",
		"angular-resource": "angular-resource/*.{js,map}",
		"angular-route": "angular-route/*.{js,map}",
		"angular-sanitize": "angular-sanitize/*.{js,map}",
		"angular-signalr": "angular-signalr/*.{js,map}",
		"angular-signalr-hub": "angular-signalr-hub/*.{js,map}",
		"angular-touch": "angular-touch/*.{js,map}",
		"angular-uuid2": "angular-uuid2/*.{js,map}",
		"masonry": "masonry/*.{js,map}",
        "eventEmitter": "EventEmitter/*.{js,map}",
        "eventie": "eventie/*.{js,map}",
        "doc-ready": "doc-ready/*.{js,map}",
        "get-style-property": "get-style-property/*.{js,map}",
        "get-size": "get-size/*.{js,map}",
        "matches-selector": "matches-selector/*.{js,map}",
        "outlayer": "outlayer/*.{js,map}",
        "fizzy-ui-utils": "fizzy-ui-utils/*.{js,map}",
        "ngstorage": "ngstorage/*.{js,map}",
        "signalr": "signalr/*.{js.map}",
        "toastr": "toastr/*.{js,map}",
        "typeahead.js": "typeahead.js/dist/*.{js,map}"
	}

	for (var destinationDir in bower) {
		gulp.src(paths.bower + bower[destinationDir])
		.pipe(gulp.dest(paths.scripts + "vendor"));
	}
	cb();
});

gulp.task('move-js', function(cb){
	gulp.src(paths.scripts + 'vendor/js/*.js')
	.pipe(gulp.dest(paths.scripts + "vendor"));
});

gulp.task('remove', function() {
	del("assets/scripts/vendor/js/npm.js");
});

gulp.task('less', function() {
	return gulp.src(paths.styles + '*.less')
	.pipe(less().on('error', function (err) {
		console.log(err);
	}))
	.pipe(cssmin().on('error', function (err) {
		console.log(err);
	}))
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest("static/css"))
});

gulp.task('lint', function() {
	gulp.src(paths.lintables)
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('build', ['fonts', 'images', 'copy', 'browserify','concat', 'less', 'styles']);
gulp.task('dev', ['build', 'watch']);
gulp.task('default', ['build']);