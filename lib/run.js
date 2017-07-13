'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');

//rewrite promise, bluebird is more faster
require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');

var babelCompileDirectory = require('babel-d');

var matmanServer = require('./server');

var logger = require('./server/logger');
var matmanLog = logger.matmanLog();

// 暴露一个全局log变量
global.matmanLog = matmanLog;

module.exports = function (opts) {
  var configOpts = void 0;

  if (typeof opts === 'string' && fs.existsSync(opts)) {
    configOpts = require(opts);
  } else if ((typeof opts === 'undefined' ? 'undefined' : (0, _typeof3.default)(opts)) === 'object') {
    configOpts = opts;
  }

  if (!configOpts || !configOpts.ROOT_PATH) {
    console.error('Params error!', opts, configOpts);
    return;
  }

  // 设置默认值
  configOpts.SRC_PATH = configOpts.SRC_PATH || path.join(configOpts.ROOT_PATH, './src');
  configOpts.APP_PATH = configOpts.APP_PATH || path.join(configOpts.ROOT_PATH, './app');
  configOpts.MOCKER_RELATIVE_PATH = configOpts.MOCKER_RELATIVE_PATH || './mocker';
  configOpts.LOG_PATH = configOpts.LOG_PATH || path.join(configOpts.ROOT_PATH, 'logs');
  configOpts.port = configOpts.port || 3000;

  // 确认 MOCKER_PATH 的值
  if (configOpts.SRC_PATH === configOpts.APP_PATH) {
    // 如果源文件目录和运行目录一致，就不进行babel编译了
    configOpts.MOCKER_PATH = path.join(configOpts.SRC_PATH, configOpts.MOCKER_RELATIVE_PATH);
  } else {
    // babel 编译
    babelCompileDirectory(configOpts.SRC_PATH, configOpts.APP_PATH);
    configOpts.MOCKER_PATH = path.join(configOpts.APP_PATH, configOpts.MOCKER_RELATIVE_PATH);
  }

  logger.init(configOpts.LOG_PATH);

  matmanLog.info(configOpts);

  var routerMocker = matmanServer.routerMocker(configOpts);
  var server = matmanServer.create();
  var middlewares = matmanServer.mockServer();

  // Set default middlewares (logger, static, cors and no-cache)
  server.use(middlewares);

  // GET /admin，跳转到 /
  server.get('/admin', function (req, res) {
    res.redirect('/');
  });

  // GET /admin/mockers/mocker/:mockerName/static/* 静态资源
  // http://localhost:3000/admin/mockers/mocker/standard_cgi/static/1.png
  server.get('/admin/mockers/mocker/:mockerName/static/*', function (req, res) {
    // req.params[0] = 'subdir/3.png'
    // req.params.mockerName = 'standard_cgi'
    var imageFilePath = path.join(configOpts.MOCKER_PATH, req.params.mockerName, 'static', req.params[0]);
    res.sendfile(imageFilePath);
  });

  // GET /admin/*
  server.get('/admin/*', function (req, res) {
    // res.jsonp({ url2: req.url });
    res.sendFile(path.join(__dirname, '../www/static', 'index.html'));
  });

  server.use(logger.connectLogger());

  // To handle POST, PUT and PATCH you need to use a body-parser
  // You can use the one used by JSON Server
  server.use(matmanServer.bodyParser);
  server.use(function (req, res, next) {
    if (req.method === 'POST') {
      req.body.createdAt = Date.now();
    }
    // Continue to JSON Server router
    next();
  });

  // Use default router
  server.use(routerMocker);

  server.listen(configOpts.port || 3000, function () {
    console.log('matman server is running');
    matmanLog.info('matman server is running');
  });
};
//# sourceMappingURL=run.js.map