## Build Setup

``` bash
# install dependencies 
npm install
(安装node依赖包)

# serve with hot reload at localhost:8080 
npm run dev
(用于前端开发)

# build for production with minification
npm run build
(执行指令后会生成一个dist文件，用于发布到服务器)

# run unit tests
npm run unit

# run all tests
npm test
```

PS:该框架支持多页面开发，只需在'src/page'下新建一个新页面的文件夹，里面包含2个基本文件
1.index.html (此为该页面的HTML模板)
2.index.js (此为该页面js入口文件，会自动注入到HTML页面中)
该文件下的less,css,image文件，随项目开发，自己require就好。

举个例子:
我想做一个'help.html'页面，npm run dev后在浏览器输入'localhost:8080/help.html'。按如下步骤：
1.'src/page'下新家一个'help'文件夹
2.'help'文件夹下分别新建index.html和index.js文件。
完成。

如果要考虑发布到cdn的绝对路径，可改'config/index.js'中的'config.build.assetsPublicPath'的值。