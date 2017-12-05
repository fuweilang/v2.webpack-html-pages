process.env.NODE_ENV = 'production'

var shell = require('shelljs')
var argv = process.argv[2]
var reg = /[^\w\/]/

if (!argv) {
  console.log(`
    npm run rm all: all are removed
    npm run rm [name]: [name] is the path whose is removed
  `)
  return
}
if (argv.match(reg)) {
  console.log('warning: type the right src argument')
  return
}

if (argv == 'all' || argv == 'dist') {
  console.log(`romove all`)
  shell.rm('-rf', 'dist')

} else {
  var buildsrc = `./dist/page/${argv}`
  var buildjs = `./dist/static/${argv}`

  if (shell.test('-d', buildsrc)) {
    console.log(`${buildsrc} is removed`)
    shell.rm('-rf', buildsrc)
    shell.rm('-rf', buildjs)

  } else {
    console.log(`${buildsrc} is not existed`)
  }
}
