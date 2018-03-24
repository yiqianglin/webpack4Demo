## 从step2开始
先把step2的代码完整拷贝到step3

```bash
cp -r step2 step3
cd step3
```

## 打包输出（Output Management）

### 多入口输出
基本的文件目录，`新增一个入口文件`
```
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- index.html
  |- /src
    |- webpack.png
    |- style.css
    |- index.js
+   |- print.js
```

新增src/print.js
```js
export default function printMe() {
  console.log('I get called from print.js!');
}
```

修改入口文件,引入`print.js`
src/index.js
```js
  import './style.css';
  import Icon from './webpack.png';
+ import printMe from './print.js';

  function component() {
    var element = document.createElement('div');
    element.innerHTML = 'Hello, webpack';
    element.classList.add('hello');

+   var btn = document.createElement('button');
+   btn.innerHTML = 'Click me and check the console!';
+   btn.onclick = printMe;
+   element.appendChild(btn);

    var myIcon = new Image();
    myIcon.src = Icon;
    element.appendChild(myIcon);

    return element;
  }

  document.body.appendChild(component());
```

### 模版的标题要改1改

dist/index.html
```html
  <!doctype html>
  <html>
    <head>
-    <title>Asset Management</title>
+    <title>Output Management</title>
+    <script src="./print.bundle.js"></script>
    </head>
    <body>
-     <script src="./bundle.js"></script>
+     <script src="./app.bundle.js"></script>
    </body>
  </html>
```

修改配置文件,修改`entry`,`output`配置

```js
  const path = require('path');

  module.exports = {
-   entry: './src/index.js',
+   entry: {
+     app: './src/index.js',
+     print: './src/print.js'
+   },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    }
  };
```

执行命令
```bash
npm run build
```
webpack会打包`app.bundle.js`和`print.bundle.js`到dist目录，然后打开`index.html`就可以看到红色的`Hello, webpack`后面跟了一个按钮，点击后控制台出现了`I get called from print.js!`

### 加入HtmlWebpackPlugin

每次改模版文件好麻烦额，加个插件，让webpack自动生成文件

```bash
npm i html-webpack-plugin -D
```

修改配置webpack.config.js
```js
  const path = require('path');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    },
+   plugins: [
+     new HtmlWebpackPlugin({
+       title: 'Output Management'
+     })
+   ],
  };
```

执行命令
```bash
npm run build
```
这会儿再看看`dist/index.html`,里面代码肯定和之前写的不太一样了,这是webpack自动生成的了
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Output Management</title>
  </head>
  <body>
  <script type="text/javascript" src="app.bundle.js"></script><script type="text/javascript" src="print.bundle.js"></script></body>
</html>
```

### 清理打包目录
已经经历多次打包了，发现最早的那个bundle.js没有用了但还在目录，需要1个工具能在每次打包前先把原来的代码删除，webpack官方建议用`clean-webpack-plugin`
```bash
npm i clean-webpack-plugin -D
```

用起来也挺方便,默认的打包目录是`dist`
修改webpack.config.js

```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
+ const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    plugins: [
+     new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

再次执行命令
```bash
npm run build
```
仔细观察会发现`dist`目录被删除了，然后又新出来1个`dist`,说明打包出来的肯定都是全新的有用的代码
