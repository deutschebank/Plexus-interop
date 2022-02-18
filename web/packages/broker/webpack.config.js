const path = require('path');

module.exports = {
  target: ['web', 'es5'],
  mode: 'production',
  entry: './dist/main/src/api/CrossDomainHostEntryPoint.js',
  output: {
    path: path.resolve(__dirname, 'dist', 'main', 'src'),
    filename: 'CrossDomainHostBuilder.bundle.js',
    library: {
      name: 'proxyHost',
      type: 'umd'
    },
  },
  stats: 'minimal'
};