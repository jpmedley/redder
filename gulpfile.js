'use strict';

var gulp = require('gulp');
var path = require('path');
var swPrecache = require('sw-precache');

gulp.task('make-service-worker', function(callback) {
	var rootDir = 'app';

	swPrecache.write(path.join(rootDir, 'serviceworker.js'), {
		staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif}'],
		stripPrefix: rootDir,
		importScripts: ['sync.js'],
		runtimeCaching: [
		{
			urlPattern: /https:\/\/www\.reddit\.com\/r\/javascript\/comments\/\w{6}\/[\w]{0,255}\.json/,
			handler: 'cacheFirst',
			options: {
			  	cache: {
			    	maxEntries: 3,
			     	name: 'articles-cache'
			    }
			  }
		},
		{
			urlPattern: /https:\/\/www\.reddit\.com\/r\/javascript\.json/,
			handler: 'networkFirst'
		}],
		verbose: true
	}, callback);
});