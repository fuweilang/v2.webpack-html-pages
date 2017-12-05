var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env
  
var prodConfig = {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.build.productionSourceMap, extract: true })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('[name].js?time=[chunkhash]'),
    chunkFilename: utils.assetsPath('[id].js?time=[chunkhash]')
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery"
    }),
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // extract css into its own file
    new ExtractTextPlugin(utils.assetsPath('[name].css?time=[contenthash]'))
  ]
}

var pages = utils.getHtmlEntry(config.build.pages, 'production')
for (var key in pages) {
  var page = pages[key]
  var conf = {
    filename: process.env.NODE_ENV === 'testing'
      ? page.filename
      : config.build[`${page.pathname}/${page.basename}`],
    template: page.template,
    chunks: [page.chunk],
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
  }
  // generate dist index.html with correct asset hash for caching.
  // you can customize output by editing /index.html
  // see https://github.com/ampedandwired/html-webpack-plugin
  prodConfig.plugins.push(new HtmlWebpackPlugin(conf))
}

var webpackConfig = merge(baseWebpackConfig, prodConfig)

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

module.exports = webpackConfig
