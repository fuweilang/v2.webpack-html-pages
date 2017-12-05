var path = require('path')
var express = require('express')
var glob = require('glob')
var webpack = require('webpack')
var config = require('../config')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

var argv = process.argv[2]

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var filenames = glob.sync(config.dev.files)
var reg = /^\.\/src\/page\/(.+)\/(js|css|img|images|image).*$/
var filearr = []
for (var name of filenames) {
  if (name.match(reg)) {
    var file = name.match(reg)[1] + '/' + name.match(reg)[2]
    if (filearr.indexOf(file) < 0) {
      filearr.push(file)
      // 解决css和js相对路径的问题
      app.use(`/${file}`, express.static(path.resolve(__dirname, `../src/page/${file}`)))
      // app.use(`/${name.match(reg)[2]}`, express.static(path.resolve(__dirname, `../src/page/${file}`)))
    }
  }
}

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  if (argv == 'all') {
    var uri = 'http://localhost:' + port + '/index/index.html'
  } else {
    var uri = `http://localhost:${port}/${argv}/index.html`
  }
  console.log('Listening at ' + uri + '\n')
  // opn(uri)
})
