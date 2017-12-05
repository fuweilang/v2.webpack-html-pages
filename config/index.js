// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var merge = require('webpack-merge')
var glob = require('glob')
var argv = process.argv[2]

var fileconfig = {}
if (argv == 'all') {
  fileconfig = {
    files: './src/page/**',
    pages: './src/page/**/*.html',
    entry: './src/page/**/*.js',
    js: './src/page/**/js/**',
    css: './src/page/**/css/**'
  }
} else {
  fileconfig = {
    files: `./src/page/${argv}/**`,
    pages: `./src/page/${argv}/**/*.html`,
    entry: `./src/page/${argv}/**/*.js`,
    js: `./src/page/${argv}/js/**`,
    css: `./src/page/${argv}/css/**`
  }
}

var config = {
  build: {
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

config.build = merge(fileconfig, config.build)
config.dev = merge(fileconfig, config.dev)

var setBuildHTML = function (globPath) {
  var files, entry, reg, pathname, basename
  files = glob.sync(globPath)
  reg = /^\.\/src\/page\/([\w\/]+)\/(\w+)\.html$/
  for (var i = 0; i < files.length; i++) {
    entry = files[i]
    if (entry.match(reg)) {
      pathname = entry.match(reg)[1]
      basename = entry.match(reg)[2]
      var key = `${pathname}/${basename}`
      config.build[key] = path.resolve(__dirname, `../dist/page/${pathname}/${basename}.html`)
    }
  }
  return config
}
setBuildHTML(fileconfig.pages)

module.exports = config