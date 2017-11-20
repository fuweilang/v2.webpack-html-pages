// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var merge = require('webpack-merge')
var glob = require('glob')

var src = process.argv[2]
var pages, js
if (src == 'all') {
  pages = './src/page/**/index.html'
  js = './src/page/**/index.js'
} else {
  pages = `./src/page/${src}/index.html`
  js = `./src/page/${src}/index.js`
}

var config = {
  build: {
    pages: pages,
    js: js,
    env: require('./prod.env'),
    // index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    pages: pages,
    js: js,
    env: require('./dev.env'),
    port: 8080,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}

var setBuildHTML = function (globPath) {
  var files, entry, reg
  files = glob.sync(globPath)
  reg = /^\.\/src\/page\/([\w\/]+)\/index\.html$/
  for (var i = 0; i < files.length; i++) {
    entry = files[i]
    if (entry.match(reg)) {
      basename = entry.match(reg)[1]
      config.build[basename] = path.resolve(__dirname, '../dist/page/' + basename + '/index.html')
    }
  }
  return config
}
setBuildHTML(pages)

module.exports = config