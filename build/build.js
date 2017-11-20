// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

var fs = require('fs')
var src = process.argv[2]
var reg = /[^\w\/]/
if (!src) {
  console.log(`
    npm run build all: all compile
    npm run build [name]: [name] is the path whose is build
  `)
  return
}
if (src.match(reg)) {
  console.log('warning: type the right src argument')
  return
}

if (src == 'all') {
  console.log(`build all`)
  rm('-rf', 'dist')
  mkdir('-p', 'dist')
  require('./build-server.js')

} else {
  src = `./src/page/${src}`
  fs.exists(`${src}/index.js`, function (exists) {
    if (!exists) {
      console.log(`${src} is not existed`)
      return
      
    } else {
      console.log(`build ${src}`)
      require('./build-server.js')
    }
  })
}
