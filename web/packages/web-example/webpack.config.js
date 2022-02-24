const path = require('path');

module.exports = {
  mode: 'production',
  target: 'electron-renderer',
  entry: './dist/main/src/greeting/server/Main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'greetingServer.bundle.js'
  },
  stats: 'minimal',
  performance: {
    hints: false,
  },
};