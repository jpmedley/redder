/**
 * Copyright 2015 Google Inc. All rights reserved.
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

 self.addEventListener('sync', function(event) {
 	if (event.tag == 'prefetch') {
 		//event.waitUntil(function() {
 			console.log("Inside wait.");
 			clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function(clients){
 				for (var i = 0; i < clients.length; i++) {
 					var anchorLocation = clients[i].url.indexOf('#');
 					if (anchorLocation != -1) {
 						fetch('https://www.reddit.com/r/' + clients[i].url.slice(anchorLocation + 1) + '.json')
 							.then(function(response) {
 								return response.json();
 							}).then(function(json) {
 								//ToDo: Do something with the response.
 								console.log(json);
 								self.registration.showNotification('Json available.');
 							})
 					}
 				}
 			}).catch(function(err){
 				console.log("Didn't work. Here's what happened: " + err);
 			})
 		//})
 	}
 });

