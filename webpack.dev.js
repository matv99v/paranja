const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');


module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  entry: [
    path.resolve(__dirname, 'src', 'entry.js'),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    // filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new UnusedFilesWebpackPlugin({
      failOnUnused: true,
      patterns: ['src/**/*.*'],
      globOptions: {
        ignore: [
          'node_modules/**/*',
        ],
      },
    }),
    // new MiniCssExtractPlugin({
    //   filename: '[name].css',
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(process.env.API_URL),
      },
    }),
    new HtmlWebpackPlugin({
      template: 'src/indexSrc.html',
      inject: 'body',
    }),
  ],

});
