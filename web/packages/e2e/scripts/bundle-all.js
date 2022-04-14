/*
 * Copyright 2017-2022 Plexus Interop Deutsche Bank AG
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const path = require('path');
const glob = require('glob');
const argv = require('minimist')(process.argv.slice(2));
const webpack = require('webpack');
const globToRegExp = require('glob-to-regexp');

const log = console.log.bind(console);
const logError = console.error.bind(console);

log(`Passed arguments${JSON.stringify(argv, null, 2)}`);
log();
const resultOutFile = path.join(__dirname, '..', argv.outputFile);
log(`Output file:${resultOutFile}`);
log();
const resultInputGlob = path.join(__dirname, '..', argv.inputGlob);
log(`Input files pattern:${resultInputGlob}`);
log();
if (argv.standalone) {
  log(`Building UMD module [${argv.standalone}]`);
  log();
}

const testFiles = glob.sync(resultInputGlob);
log(`Processing files: ${JSON.stringify(testFiles)}`);
log();

const coverageIgnorePatterns = [
  // skip all node modules, except our
  '**/node_modules/!(@plexus-interop)/**',
  // skip all generated proto messages
  '**/*-messages.js',
  '**/*-protocol.js',
  '**/index.js',
  '**/bower_components/**',
  '**/test/**',
  '**/tests/**',
  '**/*.json',
  '**/*.spec.js',
];

if (argv.clientCoverage) {
  // skip web broker to have better picture
  coverageIgnorePatterns.push('**/broker/**');
}

const useCoverage = argv.clientCoverage || argv.brokerCoverage;

let excludePaths = /node_modules/;
if (useCoverage) {
  excludePaths = coverageIgnorePatterns.map((pattern) => globToRegExp(pattern));
}

const compiler = webpack({
  entry: testFiles,
  mode: 'production',
  target: ['electron-renderer'],
  externals: ['websocket'],
  devtool: 'inline-source-map',
  ...(useCoverage
    ? {
        module: {
          rules: [
            {
              test: /\.js/,
              exclude: excludePaths,
              use: {
                loader: '@jsdevtools/coverage-istanbul-loader',
                options: {
                  compact: true,
                  esModules: true,
                },
              },
            },
          ],
        },
      }
    : {}),
  output: {
    path: path.resolve(__dirname, '..'),
    filename: argv.outputFile,
    ...(argv.standalone
      ? {
          library: {
            name: argv.standalone,
            type: 'umd',
          },
        }
      : {}),
  },
});

compiler.run((err, stats) => {
  if (stats.compilation.errors.length) {
    logError(stats.compilation.errors);
    process.exitCode = 1;
  }
  // [Stats Object](#stats-object)
  if (err) {
    logError(err);
    process.exitCode = 1;
  }
  log('...done');

  compiler.close((closeErr) => {
    if (closeErr) {
      logError(closeErr);
      process.exitCode = 1;
    }
  });
});
