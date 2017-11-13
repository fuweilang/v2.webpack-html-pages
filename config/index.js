// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var merge = require('webpack-merge')
var glob = require('glob')

var getFilenames = function (globPath) {
  var files, entry, filenames, reg
  files = glob.sync(globPath)
  filenames = {
    build: {}
  }
  reg= /^\.\/src\/page\/(\w+)\/index\.jade$/
  for (var i = 0; i < files.length; i++) {
    entry = files[i]
    if (entry.match(reg)) {
      basename = entry.match(reg)[1]
      filenames.build[basename] = path.resolve(__dirname, '../dist/' + basename + '.html')
    }
  }
  return filenames
}

var filenames = getFilenames('./src/page/**/*.jade')

var config = {
  build: {
    env: require('./prod.env'),
    // index: path.resolve(__dirname, '../dist/index.html'),
    // about: path.resolve(__dirname, '../dist/about.html'),
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

module.exports = merge(config, filenames)