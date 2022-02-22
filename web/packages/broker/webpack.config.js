const path = require('path');
const OptimizePlugin = require('optimize-plugin');

module.exports = {
  mode: 'production',
  entry: './dist/main/src/api/CrossDomainHostEntryPoint.js',
  output: {
    path: path.resolve(__dirname, 'dist', 'main', 'src'),
    filename: 'CrossDomainHostBuilder.bundle.js',
    library: {
      name: 'proxyHost',
      type: 'umd',
    },
  },
  stats: 'minimal',
  plugins: [
    new OptimizePlugin({
      modernize: false,
    }),
  ],
};
