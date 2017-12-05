var shell = require('shelljs')
var path = require('path')
var argv = process.argv[2]
var utils = require('./utils')
var config = require('../config')

var reg = /[^\w\/]/
if (!argv) {
  console.log(`
    npm run dev all: all compile
    npm run dev [name]: [name] is the path whose is compiled
  `)
  return
}
if (argv.match(reg)) {
  console.log('warning: type the right src argument')
  return
}

if (argv == 'all') {
  console.log(`run all`)
  
  utils.setDevEntry(config.dev.pages)
  require('./dev-server.js')
} else {
  var src = path.resolve(__dirname, `../src/page/${argv}`);
  if (shell.test('-d', src)) {
    console.log(`run ${src}`)

    utils.setDevEntry(config.dev.pages)
    require('./dev-server.js')
  } else {
    console.log(`create ${src}`)
    
    shell.mkdir('-p', `./src/page/${argv}`)
    shell.cp('-R', './src/static/layout/*', src)
    
    require('./dev-server.js')
  }
}