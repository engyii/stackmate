var express = require('express');
var fs = require('fs-extra');
var path = require("path");

var app = express();
var rootDir = path.join(__dirname,'screenshots');

app.set('views', './views');
app.set('view engine', 'jade');


app.get('/', function (req, res) {
   var screenshotSessions = fs.readdirSync(rootDir)
  .filter(function (file) {
      var p = path.join(rootDir, file);
        return fs.statSync(p).isDirectory();
    }).map(function(dir) {
      var p = path.join(rootDir, dir);
      var pages = fs.readdirSync(p).filter(function(file) {
         var p = path.join(rootDir,dir, file);
          return fs.statSync(p).isFile() && path.extname(p) === '.json';
      });
      return { session:dir, pages: pages };
    });
   res.render('index', { sessions: screenshotSessions });
});

app.get('/screenshots/:session([0-9]+)/:page([0-9]+)', function (req, res) {
  var dir = req.params.session;
  var page = req.params.page;
   var f = path.join(rootDir, dir, page + '.json');
  var browserstackScreenshots = fs.readJsonSync(f);
  res.render('screenshots', browserstackScreenshots);
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);

});
