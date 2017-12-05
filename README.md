## Build Setup

``` bash
# install dependencies (安装依赖)
npm install
(安装node依赖包)

# serve with hot reload at localhost:8080 (开发指令)
npm run dev [name]
(用于前端开发。[name]是参数)。例：
1.npm run dev all: 所有的项目编译开发
2.npm run dev wap/help: 只编译'src/page/wap/help'文件夹下的页面开发，如果无此文件夹，会自动创建模板并编译

# build for production with minification (打包压缩发布指令)
npm run build [name]
(执行指令后会生成一个dist文件，用于发布到服务器。[name]是参数)。例：
1.npm run build all: 所有的项目打包压缩到dist文件夹
2.npm run build wap/help: 只打包压缩'src/page/wap/help'下的文件到dist里

# run unit tests
npm run unit

# run all tests
npm test


PS:该框架支持多页面开发，只需在'src/page'下新建一个新页面的文件夹，里面包含2个基本文件
1.index.html (此为该页面的HTML模板)
2.index.js (此为该页面js入口文件，会自动注入到index.HTML页面中)
该文件下的less,css,image文件，随项目开发，自己require就好。

举个例子:
我想做一个'help.html'页面，按如下步骤：
1.npm run dev help (此命令会在'src/page'下自动生成help文件)
2.浏览器输入'localhost:8080/help/index.html'
或者：
1.'src/page'下新建一个'help'文件夹
2.'help'文件夹下分别新建index.html和index.js文件。
3.执行npm run dev help或者npm run dev all后在浏览器输入'localhost:8080/help/index.html'

如果要考虑发布到cdn的绝对路径，可改'config/index.js'中的'config.build.assetsPublicPath'的值。

特别提示，该框架对HTML模板中link标签的href和script标签中的src同样支持，但是只支持相对路径，故可以根据需求不一定非要在js文件中以import的方式引入CSS和JS，但是建议还是以import的方式来引入CSS和JS等静态资源会更好。

```

