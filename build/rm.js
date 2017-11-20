// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

var fs = require('fs')
var src = process.argv[2]
var reg = /[^\w\/]/
if (!src) {
  console.log(`
    npm run rm all: all are removed
    npm run rm [name]: [name] is the path whose is removed
  `)
  return
}
if (src.match(reg)) {
  console.log('warning: type the right src argument')
  return
}

if (src == 'all' || src == 'dist') {
  console.log(`romove all`)
  rm('-rf', 'dist')

} else {
  var buildsrc = `./dist/page/${src}`
  var buildjs = `./dist/static/${src}`
  fs.exists(buildsrc, function (exists) {
    if (exists) {
      console.log(`${buildsrc} is removed`)
      rm('-rf', buildsrc)
      rm('-rf', buildjs)
    } else {
      console.log(`${buildsrc} is not existed`)
    }
  })
}
