process.env.NODE_ENV = 'production'

var shell = require('shelljs')
var argv = process.argv[2]
var reg = /[^\w\/]/

if (!argv) {
  console.log(`
    npm run build all: all compile
    npm run build [name]: [name] is the path whose is build
  `)
  return
}
if (argv.match(reg)) {
  console.log('warning: type the right src argument')
  return
}

if (argv == 'all') {
  console.log(`build all`)
  shell.rm('-rf', 'dist')
  shell.mkdir('-p', 'dist')
  require('./build-server.js')

} else {
  var src = `./src/page/${argv}`
  if (shell.test('-d', src)) {
    console.log(`build ${src}`)
    require('./build-server.js')

  } else {
    console.log(`${src} is not existed`)
    return
  }
}
