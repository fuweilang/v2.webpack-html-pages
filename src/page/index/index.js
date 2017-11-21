import './css/index.less'

import Out from "./js/out"

import ajpg from "./img/a.jpg"

var print = ()=> {
  console.log(444444444)
}
print()

var out = new Out()
out.print()

console.log($.fn)
$('#wrap').css({
  fontSize: '50px'
})

var img = document.createElement('img')
img.src = ajpg
img.width = 160;
$('.img1-con').append(img)

