/*Copyright (c) 2014 Scott González http://scottgonzalez.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


var request = require('request');
var url = require('url-template');


var parseResponse = function(callback) {
  return function (err, res, body) {
    if (err) {
      callback(null, err);
    } else {
      callback( {
        statusCode: res.statusCode,
        body: JSON.parse(body.toString())
      }, err);
    }
  };
};


function ScreenshotClient(username, password) {
  this.request = request.defaults({
    auth: {
      username: username,
      password: password
    }
  });
}

ScreenshotClient.API_URL = 'http://www.browserstack.com/screenshots/';
ScreenshotClient.API_SCREENSHOTS_URL = url.parse(ScreenshotClient.API_URL + '{jobid}.json');
ScreenshotClient.API_BROWSERS_URL = ScreenshotClient.API_URL + 'browsers.json';

ScreenshotClient.prototype.createWorker = function (options, callback) {
  this.request.post({
    url: ScreenshotClient.API_URL,
    body: JSON.stringify(options),
    headers: {
      'Content-Type': 'application/json'
    }
  }, parseResponse(callback));
};

ScreenshotClient.prototype.getWorker = function (identifier, callback) {
  this.request.get({
    url: ScreenshotClient.API_SCREENSHOTS_URL.expand({
      jobid: identifier
    })
  }, parseResponse(callback));
};

ScreenshotClient.prototype.getBrowsers = function (callback) {
  this.request.get({
    url: ScreenshotClient.API_BROWSERS_URL
  }, parseResponse(callback));
};

module.exports = ScreenshotClient;
