var config = require('../config')
var glob = require('glob')
var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

const devConfig = {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery"
    }),
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
  ]
}

var pages = utils.getHtmlEntry(config.dev.pages)
for (var key in pages) {
  var page = pages[key]
  var conf = {
    filename: page.filename,
    template: page.template,
    chunks: [page.chunk],
    inject: true,
    chunksSortMode: 'dependency'
  }
  devConfig.plugins.push(new HtmlWebpackPlugin(conf))
}


module.exports = merge(baseWebpackConfig, devConfig)