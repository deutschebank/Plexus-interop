const path = require('path');
const OptimizePlugin = require('optimize-plugin');

module.exports = {
  mode: 'production',
  entry: './dist/main/src/api/InteropPlatformFactory.js',
  output: {
    path: path.resolve(__dirname, 'dist', 'main', 'src'),
    filename: 'platform-factory.bundle.js',
    library: {
      name: 'PlexusPlatformFactor',
      type: 'umd',
    },
  },
  stats: 'minimal',
  externals: ['websocket'],
  plugins: [
    new OptimizePlugin({
      modernize: false,
    }),
  ],
};
