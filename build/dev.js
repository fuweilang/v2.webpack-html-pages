require('shelljs/global')

var fs = require('fs')
var src = process.argv[2]
var reg = /[^\w\/]/
if (!src) {
  console.log(`
    npm run dev all: all compile
    npm run dev [name]: [name] is the path whose is compiled
  `)
  return
}
if (src.match(reg)) {
  console.log('warning: type the right src argument')
  return
}

if (src == 'all') {
  console.log(`run all`)
  require('./dev-server.js')
} else {
  src = `./src/page/${src}`
  fs.exists(`${src}/index.js`, function (exists) {
    if (!exists) {
      console.log(`create ${src}`)
      mkdir('-p', src)
      cp('-R', './src/static/layout/*', src)
      
      require('./dev-server.js')
    } else {
      console.log(`run ${src}`)
      require('./dev-server.js')
    }
  })
}