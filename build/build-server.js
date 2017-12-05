process.env.NODE_ENV = 'production'
var path = require('path')
var config = require('../config')
var utils = require('./utils')

utils.deleteBuildEntry(config.build.pages)
utils.setBuildEntry(config.build.pages)

var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

var assetsRoot = config.build.assetsRoot
var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')

  // 编译完成后删除_build文件
  utils.deleteBuildEntry(config.build.pages)
})