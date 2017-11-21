var path = require('path')
var glob = require('glob')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    if (options.extract) {
      return ExtractTextPlugin.extract('style-loader', sourceLoader)
    } else {
      return ['style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus']),
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}

// 获取HTML模板对象
exports.getHtmlEntry = function (globPath) {
  var files = glob.sync(globPath)
  var entries = {}, entry, key
  var reg= /^\.\/src\/page\/([\w\/]+)\/index\.html$/
  for (var i = 0; i < files.length; i++) {
    entry = files[i]
    if (entry.match(reg)) {
      basename = entry.match(reg)[1]
      entries[basename] = {
        basename: basename,
        // filename: basename + '.html',
        filename: basename + '/index.html',
        template: entry,
        chunk: basename
      }
    }
  }
  return entries
}

// 获取entry入口对象
exports.getEntry = function (globPath) {
  var files = glob.sync(globPath)
  var entries = {}, entry, key
  var reg= /^\.\/src\/page\/([\w\/]+)\/index\.js$/
  for (var i = 0; i < files.length; i++) {
    entry = files[i]
    key = entry.match(reg)
    if (key) {
      key = entry.match(reg)[1]
      entries[key] = entry
    }
  }
  return entries
}