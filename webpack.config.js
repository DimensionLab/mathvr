const path = require('path');
const webpack = require('webpack');
require('babel-polyfill');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const ENTRY_POINTS = [
  './src/js/app',
];

const JS_LOADERS = [
  'babel?cacheDirectory&presets[]=react,presets[]=es2015,presets[]=stage-0',
];

const PLUGINS = [];
if (IS_PRODUCTION) {
  // Uglify in production.
  PLUGINS.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$super', '$', 'exports', 'require'],
      },
      sourcemap: false,
    })
  );
}

module.exports = {
  entry: ENTRY_POINTS,
  output: {
    // Bundle will be served at /bundle.js locally.
    filename: 'bundle.js',
    // Bundle will be built at ./src/media/js.
    path: './build',
    publicPath: '/',
  },
  module: {
    noParse: [
      /node_modules\/aframe\/dist\/aframe.js/,
      /node_modules\/cannon\/build\/cannon.js/,
    ],
    loaders: [
      {
        // JS.
        exclude: /(node_modules|bower_components)/,
        loaders: JS_LOADERS,
        test: /\.js$/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
    ],
  },
  plugins: PLUGINS,
  resolve: {
    extensions: ['', '.js', '.json'],
    fallback: path.join(__dirname, 'node_modules'),
    modulesDirectories: [
      'src/js',
      'node_modules',
    ],
  },
  resolveLoader: {
    fallback: [path.join(__dirname, 'node_modules')],
  },
};
