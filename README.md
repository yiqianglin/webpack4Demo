# 说明
- webpack4 demo，加入了常用loader，eslint，babel，用vue做了个例子
- css文件独立的插件已经换为mini-css-extract-plugin，使用更简单，但配置项过少，还有待进一步优化
- 根据整个研究过程写了几个小demo，在`demo`目录

## install

```bash
npm i
```

## 常用命令

- 启动服务
`配置webpack/webpack.dev.js`

```bash
npm start
```

- 修复eslint
`eslint配置在.eslintrc.js文件中`

```bash
npm run lint-fix
```

- build
`配置webpack/webpack.prod.js`

```bash
npm run build
```

## 附加配置

- babel
- eslint
- postcss
- stylus
- vue
- vue-router

## 目录
```bash
├──  demo                          demo目录，每个文件夹中都有步骤的说明
│     ├──  step1                   从头开始
│     ├──  step2                   附件的引入（Asset Management）
│     ├──  step3                   打包输出（Output Management）
│     ├──  step4                   开发（Development）
│     └──  step5                   完成webpack配置
│
├──  src                           vue目录
│     ├──  assets                  图片，样式等
│     ├──  components              组件
│     ├──  view                    页面
│     ├──  app.vue                 底层模版
│     ├──  index.js                开发入口
│     └──  routes.js               路由总入口
│
├──  webpack                       webpack配置信息
│     ├──  webpack.common.js       公共配置
│     ├──  webpack.dev.js          开发模式配置
│     └──  webpack.prod.js         生产模式配置
│
├──  .babelrc                      babel配置
├──  .eslintrc.js                  eslint配置
├──  .gitignore                    git忽略文件
├──  favicon.ico                   网站图标
├──  index.template.ejs            页面模版
├──  package-lock.json             依赖包版本锁定文件
├──  package.json                  基础信息
├──  postcss.config.js             postcss配置
└──  README.md                     看看
```

## 结合vue开发

```bash
npm i vue vue-router
npm i vue-loader vue-style-loader vue-template-compiler -D
npm i stylus stylus-loader -D
```

需要为`.vue`和`.styl`文件增加`loader`设置
vue推荐用单文件模式开发，就是`.vue`文件中包含了`script`和`css`等
开发模式，优先于`postcss-loader`加载的规则如`stylus-loader`需要设置`sourceMap`

webpack.dev.js
```js
+  {
+    test: /\.styl$/,
+    use: [
+      'style-loader',
+      'css-loader',
+      'postcss-loader',
+      { loader: 'stylus-loader', options: { sourceMap: false } },
+    ]
+  },
+  {
+    test: /\.vue$/,
+    loader: 'vue-loader',
+    options: {
+      loaders: {
+        js: ['babel-loader', 'eslint-loader'],
+        css: [
+          'vue-style-loader',
+          'css-loader',
+          'postcss-loader',
+        ],
+        stylus: [
+          'vue-style-loader',
+          'css-loader',
+          'postcss-loader',
+          { loader: 'stylus-loader', options: { sourceMap: false } },
+        ],
+      },
+    },
+  },
```

生产环境需要抽离`css`和`stylus`
webpack.prod.js
```js
+  {
+    test: /\.styl$/,
+    use: [
+      MiniCssExtractPlugin.loader,
+      'css-loader',
+      'postcss-loader',
+      'stylus-loader'
+    ],
+  },
+  {
+    test: /\.vue$/,
+    loader: 'vue-loader',
+    options: {
+      loaders: {
+        js: [
+          'babel-loader',
+          'eslint-loader'
+        ],
+        css: [
+          'vue-style-loader',
+          MiniCssExtractPlugin.loader,
+          'css-loader',
+          'postcss-loader'
+        ],
+        stylus: [
+          'vue-style-loader',
+          MiniCssExtractPlugin.loader,
+          'css-loader',
+          'postcss-loader',
+          'stylus-loader'
+        ],
+      },
+    },
+  },
```

增加`eslint`插件
```bash
npm i eslint-plugin-vue -D
```

更新eslint规则
.eslintrc.js
```js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  // add your custom rules here
  rules: {
  },
}
```

增加`babel`插件
```bash
npm i babel-preset-stage-2 -D
```

更新babel配置
.babelrc
```js
{
  "presets": ["env", "stage-2"]
}
```