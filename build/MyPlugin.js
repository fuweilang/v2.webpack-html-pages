var fs = require('fs')
var path = require('path')

function MyPlugin(options) {
  this.options = options;
  console.log(this.options)
}

MyPlugin.prototype.apply = function(compiler) {

    compiler.plugin('compilation', function(compilation, options) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
            console.log(htmlPluginData.html)
            console.log(htmlPluginData.assets.js)
            callback(null, htmlPluginData)
        })
    })
}

module.exports = MyPlugin;