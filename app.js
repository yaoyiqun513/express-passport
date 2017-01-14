var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var index = require('./routes/index');
var users = require('./routes/users');
var mong = require('./mongodbApi');
var app = express();
var tableName = 'newtable';
//网络访问日志配置
log4js.configure({
  appenders: [{
    type: 'console'
  }, {
    type: 'file',
    filename: 'logs/net.log',
    maxLogSize: 1024,
    backups: 4,
    category: 'normal'
  }],
  replaceConsole: true
});
var logger = log4js.getLogger("normal");

//mongodb连接头文件
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

//连接地址
var dburl = 'mongodb://localhost:27017/express-passport-db';

//尝试连接数据库
MongoClient.connect(dburl, function (err, db) {
  assert.equal(null, err);
  console.log("数据库连接成功!");
  mong.findDocuments(db,tableName,function () {
    mong.indexCollection(db,tableName, function (){ 
      db.close();
    });
  });
});

// 渲染网页模版路径设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/title.ico')));
//配置日志
app.use(log4js.connectLogger(logger, {
  level: log4js.levels.INFO
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
//设定静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;