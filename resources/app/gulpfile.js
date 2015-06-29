var gulp = require ('gulp'),
	rimraf = require('rimraf'),
	fs = require('fs'),
	less = require('gulp-less'),
	csmin = require('gulp-cssmin'),
	rename = require('gulp-rename');

var paths = {
	bower: "./bower_components/",
	scripts: "./scripts/",
	css: "./styles/"
};

gulp.task('clean', function (cb) {
	rimraf(paths.scripts, cb)	
});

gulp.task('copy', ['clean'], function() {
	var bower = {
		"bootstrap": "bootstrap/dist/**/*.{js,map,css}",
		"jquery": "jquery/dist/*.{js,map}"
	}

	for (var destinationDir in bower) {
		gulp.src(paths.bower + bower[destinationDir])
		.pipe(gulp.dest(paths.scripts + destinationDir));
	}
});

gulp.task('less', function() {
	return gulp.src(paths.css + '*.less')
	.pipe(less().on('error', function (err) {
		console.log(err);
	}))
	.pipe(cssmin().on('error', function (err) {
		console.log(err);
	}))
	.pipe(rename({
		suffis: '.min'
	}))
	.pipe(gulp.dest(paths.css))
});

gulp.task('default', function() {
	
});