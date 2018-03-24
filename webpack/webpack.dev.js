const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const ip = require('ip')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 9000,
    useLocalIp: false,
    host: 'localhost',
    hot: true,
    noInfo: false,
    open: true,
    stats: {
      // modules: true,
      modules: false,
      version: true,
      colors: true,
      warnings: false,
      timings: true
    }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      // ignoreOrder: false,
      // allChunks: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,          
          'css-loader',
          'postcss-loader',
          { loader: 'stylus-loader', options: { sourceMap: false } },
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // extractCSS: true,   // extractCSS: true requires extract-text-webpack-plugin as a peer dependency
          loaders: {
            js: [
              'babel-loader',
              // 'eslint-loader'
            ],
            css: [
              'vue-style-loader',
              MiniCssExtractPlugin.loader,              
              'css-loader',
              'postcss-loader',
            ],
            stylus: [
              'vue-style-loader',
              MiniCssExtractPlugin.loader,              
              'css-loader',
              'postcss-loader',
              { loader: 'stylus-loader', options: { sourceMap: false } },
            ],
          },
        },
      },
    ]
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     automaticNameDelimiter: "-",
	// 		minSize: 1
  //     // cacheGroups: {
  //     //   default: false,
  //     //   // Custom common chunk
  //     //   // bundle: {
  //     //   //   name: 'commons',
  //     //   //   chunks: 'all',
  //     //   //   minChunks: 3,
  //     //   //   reuseExistingChunk: false,
  //     //   // },
  //     //   // Merge all the CSS into one file
  //     //   // styles: {
  //     //   //   name: 'styles',
  //     //   //   test: /\.s?css$/,
  //     //   //   chunks: 'all',
  //     //   //   minChunks: 1,
  //     //   //   reuseExistingChunk: true,
  //     //   //   enforce: true,
  //     //   // },
  //     // },
  //   },
  // },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
})
