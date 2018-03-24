## 从step3开始
先把step3的代码完整拷贝到step4

```bash
cp -r step3 step4
cd step4
```

## 开发（Development）

### Using source maps
有很多种 `devtool`,[官方](https://webpack.js.org/configuration/devtool/)好像比较推崇`cheap-module-eval-source-map`
加入一条新配置
webpack.config.js
```js
+   devtool: 'cheap-module-eval-source-map',
```

### 使用 webpack-dev-server
```bash
npm i webpack-dev-server -D
```

加一个启动脚本
package.json
```json
"start": "webpack-dev-server --open",
```

[具体配置](https://doc.webpack-china.org/configuration/dev-server)

## 优化配置
- 重新整理配置文件,原有的文件改为`webpack.common.js`并放入新建的`webpack`目录

```bash
mkdir webpack
mv webpack.config.js webpack/webpack.common.js
```

去掉`webpack.common.js`中的`mode`和`devtool`因为开发模式不需要清理打包目录，也要去掉`CleanWebpackPlugin`,同时因为目录结构变了，`output`的目录也要改为`path: path.join(process.cwd(), 'dist'),`

- 一般情况都是单入口文件，所以把`entry`和`output`也优化下
```js
  entry: {
    app: './src/index.js',
-   print: './src/print.js',
  },


  output: {
    filename: '[name].bundle.js',
+   chunkFilename: '[name].bundle.js',
    path: path.join(process.cwd(), 'dist'),
  },
```

- 因为抽出了公共配置在`webpack.common.js`，需要再装个`webpack-merge`用于合并配置内容，本地开发最好把host设置为本地ip，需要一个`ip`包

```bash
npm i webpack-merge ip -D
```

- 新建开发环境配置文件,加入`devServer`配置，顺手根据习惯配置了一些，比如打包信息隐藏，打开浏览器，热更新，本地ip

webpack.dev.js

```js
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const ip = require('ip')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 9000,
    useLocalIp: true,
    host: ip.address(),
    hot: true,
    noInfo: true,
    open: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
})
```
- 因为配置文件的目录变了， `package.json`也要改改

```json
-    "start": "webpack-dev-server --open",
+    "start": "webpack-dev-server --config webpack/webpack.dev.js",

```

再次执行`npm start`，打开控制台，会看到`Hot Module Replacement enabled.`，说明热更新已经生效

- 新建打包需要的配置文件`webpack.prod.js`

生产环境肯定是要压缩代码的，需要加`uglifyjs-webpack-plugin`

```bash
npm i uglifyjs-webpack-plugin -D
```

- 新建生产环境配置文件

webpack.prod.js

```js
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = merge(common, {
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: process.cwd()
    }),
    new UglifyJSPlugin(),
  ],
  mode: 'production',
})
```

- 修改打包命令中配置文件的路径

package.json

```json
-    "build": "webpack --config webpack.config.js"
+    "build": "webpack --config webpack/webpack.prod.js"
```

- 最后再优化一下html模版，webpack默认的打包模版太简单了，我们自己做一个ejs模版文件

index.template.ejs

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title><%= htmlWebpackPlugin.options.title %></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="renderer" content="webkit">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="address=no">
  </head>
  <body>
    <div id="app"><!-- APP --></div>
  </body>
</html>
```

- 顺便再加个`favicon`,一起加到配置里

webpack/webpack.common.js
```js
// 获取根目录的favicon，如果没有就出个提醒
+ let favicon = path.join(process.cwd(), 'favicon.ico')
+
+ if (!require('fs').existsSync(favicon)) {
+   favicon = undefined
+   console.info('missing favicon')
+ }

  module.exports = {
    ...
+   plugins: [
+     new HtmlWebpackPlugin({
+       favicon,
+       title: 'webpack-demo',
+       template: path.join(process.cwd(), 'index.template.ejs'),
+     })
+   ]
  }
```

再次运行`npm run build`会发现js代码被压缩了,html模版和favicon也出来了

- 别名
当开发一步步深入后，目录结构会非常复杂，引入某些文件时，路径就变成很多`./../`类似的，可以在webpack配置别名，让引用更方便

直接在`webpack.common.js`加入参数即可
webpack.common.js
```js
  module.exports = {
    ...
+   resolve: {
+     alias: {
+       'src': path.join(process.cwd(), 'src')
+     }
+   }
  }
```