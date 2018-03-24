## 从step4开始
先把step4的代码完整拷贝到step5

```bash
cp -r step4 step5
cd step5
```

## 加入babel-loader
```bash
npm i babel-loader babel-core babel-preset-env -D
```

加入新配置
webpack/webpack.common.js
```js
+      {
+        test: /\.js$/,
+        exclude: /node_modules/,
+        use: [
+          'babel-loader',
+        ],
+      }
```

根目录新建一个`.babelrc`文件，用于配置babel
.babelrc
```
{
  "presets": ["env"]
}
```


## 加入eslint-loader
```bash
ni eslint-loader eslint -D
```

初始化`eslint`配置
```bash
./node_modules/.bin/eslint --init
```
根据问题简单选择就好了, 我选了Airbnb，然后自动给装了2个插件并自动生成了.eslintrc.js
```bash
? How would you like to configure ESLint? Use a popular style guide
? Which style guide do you want to follow? Airbnb
? Do you use React? No
? What format do you want your config file to be in? JavaScript

+ eslint-plugin-import@2.9.0
+ eslint-config-airbnb-base@12.1.0
```

根目录会自动生成一个配置文件，再加入一些常用的设置
.eslintrc.js
```js
module.exports = {
  root: true, // 确保当前目录都用这个规则，不去遍历父级目录，可以给每个目录单独设置eslint规则
  env: {      // 环境设置
    browser: true,
    node: true,
    es6: true,
  },
  extends: 'airbnb-base', // 就是刚才初始化选择的验证包咯
}
```

加入新配置,因为`webpack`是`从下往上`加载loader，所以要把`eslint-loader`放在最下面，保证校验的是未编译过的js代码
webpack/webpack.common.js
```js
     {
       test: /\.js$/,
       exclude: /node_modules/,
       use: [
         'babel-loader',
+        'eslint-loader',
       ],
     }
```

启动开发模式`npm start`,就会发现打印信息里很多错误，因为示例代码都是随便写写的啦，好吧，提示说可以用`--fix`来修复部分错误，那就再加个修复脚本
```json
  "lint-fix": "eslint src --ext .js,.vue --fix",
```
运行`npm run lint-fix`，发现大部分问题修复了，然而还有1个错误是多余的后缀名`Unexpected use of file extension "js" for "./print.js"`,把.js去掉就好啦，还有1个`no-console`的警告，这个问题不大，平时调试时候用到，记得要去掉

## 加入postcss-loader
```bash
npm i postcss-loader -D
```

新建`postcss`配置文件
postcss.config.js
```js
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {}
  }
}
```

新增配置信息
webpack/webpack.common.js
```js
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
+     'postcss-loader'
    ]
  },
```

## 生产环境，分离,压缩css文件
- 很多原有插件对webpack4的支持都不好，mini-css-extract-plugin是个分离css的新插件，使用简单

```bash
npm i mini-css-extract-plugin -D
npm i optimize-css-assets-webpack-plugin -D
```

修改配置，开发和生产的配置分开写
把原来`webpack.common.js`中css的rule放在`webpack.dev.js`里
```js
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader'
    ]
  },
```

生产环境的配置增加
webpack.prod.js
```js
+ const MiniCssExtractPlugin = require('mini-css-extract-plugin')
+ const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

  module.exports = merge(common, {
    plugins: [
+     new MiniCssExtractPlugin({
+       // Options similar to the same options in webpackOptions.output
+       // both options are optional
+       filename: '[name].css',
+       chunkFilename: '[id].css',
+     }),
+     new OptimizeCssAssetsPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
+           MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ],
        },
      ]
    }
  }
```

执行`npm run build`，会发现css被单独打包并压缩了

## 再优化一点点
控制chunk最小值，让代码分割不过于碎片化
```js
  plugins: [
+   new webpack.optimize.MinChunkSizePlugin({
+     minChunkSize: 50000 // Minimum number of characters
+   })
  ]
```