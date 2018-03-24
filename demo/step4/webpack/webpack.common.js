const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 获取根目录的favicon，如果没有就出个提醒
let favicon = path.join(process.cwd(), 'favicon.ico')

if (!require('fs').existsSync(favicon)) {
  favicon = undefined
  console.info('missing favicon')
}

module.exports = {
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.join(process.cwd(), 'dist'),
  },
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
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon,
      title: 'Output Management',
      template: path.join(process.cwd(), 'index.template.ejs'),
    })
  ],
  resolve: {
    alias: {
      'src': path.join(process.cwd(), 'src')
    }
  }
};