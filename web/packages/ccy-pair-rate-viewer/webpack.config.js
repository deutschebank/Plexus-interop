const path = require('path');

module.exports = {
  mode: 'production',
  target: 'electron-renderer',
  entry: './dist/main/src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  stats: 'minimal',
  performance: {
    hints: false,
  },
};