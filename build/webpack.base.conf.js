var path = require('path')
var glob = require('glob')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')

var entry = utils.getEntry(process.env.NODE_ENV === 'production' ? config.build.js : config.dev.js)
module.exports = {
  entry: entry,
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      path.join(__dirname, '../node_modules')
    ],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'page': path.resolve(__dirname, '../src/page'),
      'widget': path.resolve(__dirname, '../src/widget'),
      'jquery': 'jquery'
    },
  },
  resolveLoader: {
    modules: [path.join(__dirname, '../node_modules')]
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: projectRoot,
      //   exclude: /node_modules/
      // },
      {
        test: /\.html$/,
        loader: 'html-loader',
        include: projectRoot,
        exclude: /node_modules/,
        options: {
          interpolate: 'require',

          ignoreCustomFragments: [/\{\{.*?}}/],
          root: path.resolve(__dirname, 'src/page'),
          attrs: ['img:src', 'link:href']
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: function (path) {
            return utils.imagesPath(path, '[name].[hash:7].[ext]')
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
