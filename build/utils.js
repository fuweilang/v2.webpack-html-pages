var shell = require('shelljs')
var path = require('path')
var fs = require('fs')
var glob = require('glob')
var config = require('../config')
var cheerio = require('cheerio')

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
      return ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: sourceLoader.split('!')
      })
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
    styl: generateLoaders(['css', 'stylus'])
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

exports.imagesPath = function (_path, name) {
  _path = _path.split(path.sep).join('/')
  let reg = /^(.+)\/src\/page\/([\w\/]+)\/(img|images|image)\/([\w\.]+)$/
  if (_path.match(reg)) {
    let filename = _path.match(reg)[2] + '/' + _path.match(reg)[3]
    return exports.assetsPath(filename + '/' + name)
  } else {
    return exports.assetsPath('img/' + name)
  }
}

// 获取HTML模板对象
exports.getHtmlEntry = function (globPath, NODE_ENV) {
  var files = glob.sync(globPath)
  var entries = {}
  var entry, basename, pathname
  if (NODE_ENV == 'production') {
    reg= /^\.\/src\/page\/([\w\/]+)\/(\w+)_build\.html$/
  } else {
    reg= /^\.\/src\/page\/([\w\/]+)\/(\w+)\.html$/
  }
  for (var i = 0; i < files.length; i++) {
    entry = files[i]
    if (entry.match(reg)) {
      pathname = entry.match(reg)[1]
      basename = entry.match(reg)[2]
      entries[`${pathname}/${basename}`] = {
        pathname: pathname,
        basename: basename,
        filename: `${pathname}/${basename}.html`,
        template: entry,
        chunk: `${pathname}/${basename}`
      }
    }
  }
  return entries
}

// 获取entry入口对象
exports.getEntry = function (globPath, NODE_ENV) {
  var files = glob.sync(globPath)
  var entries = {}
  var entry, key, reg
  if (NODE_ENV == 'production') {
    reg= /^\.\/src\/page\/([\w\/]+)\/(\w+)_build\.js$/
  } else {
    reg= /^\.\/src\/page\/([\w\/]+)\/(\w+)\.js$/
  }
  for (var i = 0; i < files.length; i++) {
    entry = files[i]
    key = entry.match(reg)
    if (key && key[1].indexOf('/js') < 0) {
      var basename = `${key[1]}/${key[2]}`
      entries[basename] = entry
    }
  }
  return entries
}

// 获取entry入口对象
exports.setDevEntry = function (globPath) {
  var files = glob.sync(globPath)
  var key, pathname, basename, js
  var reg= /^\.\/src\/page\/([\w\/]+)\/([^<>]+)\.html$/
  for (var i = 0; i < files.length; i++) {
    key = files[i].match(reg)
    if (key) {
      pathname = key[1]
      basename = key[2]
      js = `./src/page/${pathname}/${basename}.js`
      if (!shell.test('-e', js)) {
        shell.touch(js)
      }
    }
  }
}

// build的时候生成_build模板
exports.setBuildEntry = function (globPath) {
  var files = glob.sync(globPath)
  var key, pathname, basename, js
  var reg= /^\.\/src\/page\/([\w\/]+)\/([^<>]+)\.html$/
  for (var i = 0; i < files.length; i++) {
    key = files[i].match(reg)
    if (key) {
      pathname = key[1]
      basename = key[2]
      
      js = `./src/page/${pathname}/${basename}.js`
      if (!shell.test('-e', js)) {
        shell.touch(js)
      }

      let _buildjs = `./src/page/${pathname}/${basename}_build.js`
      let _buildhtml = `./src/page/${pathname}/${basename}_build.html`

      shell.touch(_buildjs)
      shell.touch(_buildhtml)

      var file = fs.readFileSync(files[i],'utf-8')
      var $ = cheerio.load(file)
      var requiecss = ''
      var requiejs = ''
      var srcReg = /^\.[^<>]+/gi

      for (var j = 0; j < $('link').length; j++) {
        var href = $('link')[j].attribs.href
        if (href.match(srcReg)) {
          requiecss += `import '${href}' \n`
          $($('link')[j]).removeAttr('href')
        }
      }
    
      for (var j = 0; j < $('script').length; j++) {
        var src = $('script')[j].attribs.src
        if (src.match(srcReg)) {
          requiejs += `import '${src}' \n`
          $($('script')[j]).removeAttr('src')
        }
      }

      var jsdata = fs.readFileSync(js,'utf-8')
      jsdata = requiecss + requiejs + '\n' + jsdata
      fs.writeFileSync(_buildjs, jsdata)
      fs.writeFileSync(_buildhtml, $('html').html())
    }
  }
}

// build编译完成之后删除_build文件
exports.deleteBuildEntry = function (globPath) {
  var files = glob.sync(globPath)
  var key, pathname, basename, js
  var reg= /^\.\/src\/page\/([\w\/]+)\/([^<>]+)_build\.html$/
  for (var i = 0; i < files.length; i++) {
    key = files[i].match(reg)
    if (key) {
      pathname = key[1]
      basename = key[2]
      let html = `./src/page/${pathname}/${basename}_build.html`
      let js = `./src/page/${pathname}/${basename}_build.js`
      shell.rm('-rf', html)
      shell.rm('-rf', js)
    }
  }
}