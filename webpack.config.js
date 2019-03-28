const path = require("path");
const webpack = require("webpack");
const clearWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['./src/App'],
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: "bundle.js", //"bundle.[hash].js",
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  plugins: [
    new clearWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/templates/index.html'
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    port: 9000,
    contentBase: 'dist',
    historyApiFallback: true
  },
};