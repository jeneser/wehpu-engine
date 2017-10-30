var logger = require('./common/logger');
var config = require('./config');
var path = require('path');
var fs = require('fs');

var news = require('./schedulers/news.hpu.edu.cn/index');
var logistics = require('./schedulers/houqin.hpu.edu.cn/index');
var notices = require('./schedulers/vpn.hpu.edu.cn/index');

// 新闻网
// news.getNews();

// 后勤
// logistics.getNews();

// 最新公告
// notices.getNews();

// var OSS = require('ali-oss').Wrapper;

// var client = new OSS(config.aliOSS);

// client
//   .put('feedback/1.png', path.join(__dirname, '/we.png'))
//   .then(function (val) {
//     console.log(val.res.requestUrls);
//   })
//   .catch(err => {
//     console.log(err);
//   })

var formidable = require('formidable'),
  http = require('http'),
  util = require('util');

http.createServer(function (req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      res.writeHead(200, {
        'content-type': 'text/plain'
      });
      res.write('received upload:\n\n');

      console.log(files.upload.path);
      res.end(util.inspect({
        fields: fields,
        files: files
      }));
    });

    return;
  }

  // show a file upload form
  res.writeHead(200, {
    'content-type': 'text/html'
  });
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">' +
    '<input type="text" name="title"><br>' +
    '<input type="file" name="upload" multiple="multiple"><br>' +
    '<input type="submit" value="Upload">' +
    '</form>'
  );
}).listen(8080);