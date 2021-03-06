/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 'use strict';

var gulp = require('gulp');
var path = require('path');
var swPrecache = require('sw-precache');
var webserver = require('gulp-webserver');

var rootDir = 'app';
var version = '102';

gulp.task('serve', function(callback) {
	gulp.src(rootDir)
		.pipe(webserver({
			livereload: true,
			directoryListing: true,
			port: 8001,
			fallback: 'index.html'
		}))
});

gulp.task('msw', ['make-service-worker'], function(callback){
	//Task alias
})

gulp.task('make-service-worker', function(callback) {

	swPrecache.write(path.join(rootDir, 'serviceworker.js'), {
		cacheId: 'redder' + version,
		staticFileGlobs: [rootDir + '/**/*.{html,css,png,jpg,gif}',
		                  rootDir + '/js/*.js'],
		stripPrefix: rootDir,
		importScripts: ['config.js', 'sync.js'],
		navigateFallback: 'message.html',
		runtimeCaching: [
		{
			urlPattern: /https:\/\/www\.reddit\.com\/api\/subreddits_by_topic.json?query=javascript/,
			handler: 'cacheOnly',
			options: {
				cache: {
					name: 'subreddits' + version
				}
			}
		},
		{
			urlPattern: /https:\/\/www\.reddit\.com\/r\/\w{1,255}\.json/,
			handler: 'networkFirst',
			options: {
				cache: {
					name: 'titles' + version
				}
			}
		},
		{
			urlPattern: /https:\/\/www\.reddit\.com\/r\/javascript\/comments\/\w{6}\/[\w]{0,255}\.json/,
			handler: 'cacheFirst',
			options: {
			  	cache: {
			     	name: 'articles' + version
			    }
			  }
		}],
		verbose: true
	}, callback);
});