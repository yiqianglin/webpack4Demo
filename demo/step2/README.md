## 从step1开始
先把step1的代码完整拷贝到step2

```bash
cp -r step1 step2
cd step2
```

## 附件的引入（Asset Management）

### 模版的标题要改1改

dist/index.html
```html
  <!doctype html>
  <html>
    <head>
-    <title>Getting Started</title>
+    <title>Asset Management</title>
    </head>
    <body>
      <script src="bundle.js"></script>
    </body>
  </html>
```

### 加入样式
- 依赖包加起来
```bash
npm i style-loader css-loader -D
```

基本的文件目录，`新增一个样式`
```
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- index.html
  |- /src
+   |- style.css
    |- index.js
```

新建样式文件
src/style.css
```css
.hello {
  color: red;
}
```

修改入口文件
src/index.js
```js
+ import './style.css';

  function component() {
    var element = document.createElement('div');
    element.innerHTML = 'Hello, webpack';
+   element.classList.add('hello');
    return element;
  }

  document.body.appendChild(component());
```

修改配置文件,新增`module`配置

```js
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [
+           'style-loader',
+           'css-loader'
+         ]
+       }
+     ]
+   }
  };
```

执行命令
```bash
npm run build
```
webpack会打包一个`bundle.js`到dist目录，然后打开`index.html`就可以看到红色的`Hello, webpack`

### 加入图片
- 依赖包加起来
```bash
npm i file-loader -D
```

找个logo图片呗，就用webpack的logo
目录结构
```
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- index.html
  |- /src
+   |- webpack.png
    |- style.css
    |- index.js
```

入口文件又要改了
src/index.js
```js
  import './style.css';
+ import Icon from './webpack.png';

  function component() {
    var element = document.createElement('div');
    element.innerHTML = 'Hello, webpack';
    element.classList.add('hello');

+   var myIcon = new Image();
+   myIcon.src = Icon;
+   element.appendChild(myIcon);
    return element;
  }

  document.body.appendChild(component());
```

配置文件加条load规则
webpack.config.js
```js
  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
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
+       {
+         test: /\.(png|svg|jpg|gif)$/,
+         use: [
+           'file-loader'
+         ]
+       }
      ]
    }
  };
```

执行命令
```bash
npm run build
```
webpack会打包一个`bundle.js`和一个`svg`到dist目录，然后打开`index.html`就可以看到红色的`Hello, webpack`和webpack的icon图片


### 加入更多附件,仅做说明，demo中就不一一展开

- 加载`font`不用新装依赖

webpack.config.js增加规则
```js
+       {
+         test: /\.(woff|woff2|eot|ttf|otf)$/,
+         use: [
+           'file-loader'
+         ]
+       }
```

- 加载csv和xml需要安装新的loader
```bash
npm i csv-loader xml-loader -D
```

webpack.config.js增加规则
```js
+       {
+         test: /\.(csv|tsv)$/,
+         use: [
+           'csv-loader'
+         ]
+       },
+       {
+         test: /\.xml$/,
+         use: [
+           'xml-loader'
+         ]
+       }
```
