var _ = require('lodash');
var ScreenshotClient = require('./screenshotclient');
var fs = require('fs-extra');
var path = require("path");

var browsers = require('./conf.browsers');
var urls = require('./conf.urls');
var api = require('./conf.api');

//init a screenshotclient with browserstack credentials
var screenshotClient = new ScreenshotClient(api.user, api.key);

var rootDir = path.join(__dirname,'screenshots', '' + (new Date()).getTime());

var createScreenshotJob = function(index) {
	if(index === urls.length) {
		console.log('all done !');
	} else {
		var url = urls[index];

		var data = {
		win_res: "1280x1024",
  		mac_res: "1280x960",
		url: url.url,
		wait_time:10,
		browsers: browsers
	};
	screenshotClient.createWorker(data, function(response, err) {
		if(err){
			console.error('ERROR: ' + url.name + ' : ' + JSON.stringify(err));
		} else if(response.statusCode && response.statusCode===422) {
			console.log( 'WAITING: ' + url.name + ' : ' + JSON.stringify(response));
			//try again in 1s
			setTimeout(function() {
				createScreenshotJob(index);
			}, 1000);
		} else if(response.body && response.body.job_id) {
			console.log('JOB CREATED: ' + url.name + ' : ' + response.body.job_id + ' : ');
			getScreenshots(response.body.job_id, index);
		} else {
			console.error('UNEXPECTED RESPONSE: ' + url.name + ' : '+ JSON.stringify(response));
		}
	});
	}
}

var getScreenshots = function(jobId, index) {
	var url = urls[index];

	screenshotClient.getWorker(jobId, function(response, err) {
		if(err) {
			console.error('ERROR: ' + url.name + ' : ' + jobId + ' : '+ JSON.stringify(err));
		}
		else if(response.body && response.body.state && response.body.state !== 'done') {
			console.log('WAITING:' + url.name + ' : ' + response.body.state + '('+ _(response.body.screenshots).filter({state: 'done'}).value().length + '/' + response.body.screenshots.length + ')');
			//try again in 5s
			setTimeout(function() {
				getScreenshots(jobId, index);
			}, 5000);
		} else if(response.body && response.body.state && response.body.state === 'done') {
			console.log('JOB DONE: ' + url.name + ' : ' + jobId);

			//saving json file
			var p = path.join(rootDir, '' + index + '.json');
			//fs.writeFileSync(p, 'fff');
			response.body.app_url = url;
			fs.writeJsonSync(p, response.body);
			console.log('screenshots json saved to ' + p);

			//launching next job
			createScreenshotJob(index+1);
		} else {
			console.error('UNEXPECTED RESPONSE: ' + url.name + ' : '+ JSON.stringify(response));
		}
	});
};

//go !
fs.ensureDirSync(rootDir);
createScreenshotJob(0);
