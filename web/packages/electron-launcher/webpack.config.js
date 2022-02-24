const path = require('path');
const webpack = require('webpack');

const ignorePackages = ['bufferutil', 'utf-8-validate'];

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './dist/main/src/launcher/Main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'electronLauncher.bundle.js',
  },
  stats: 'minimal',
  externals: ['electron'],
  plugins: ignorePackages.map(ignorePackage => new webpack.IgnorePlugin({
    resourceRegExp: new RegExp("^" + ignorePackage + "$")
  }))
};