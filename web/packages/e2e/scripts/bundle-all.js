/*
 * Copyright 2017-2020 Plexus Interop Deutsche Bank AG
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
const path = require("path");
const glob = require('glob');
const argv = require('minimist')(process.argv.slice(2));
const webpack = require('webpack');
const globToRegExp = require('glob-to-regexp');

console.log('Passed arguments' + JSON.stringify(argv));
const resultOutFile = path.join(process.cwd(), argv.outputFile);
console.log('Output file:' + resultOutFile);
const resultInputGlob = path.join(process.cwd(), argv.inputGlob);
console.log('Input files pattern:' + resultInputGlob);
if (argv.standalone) {
    console.log(`Building UMD module [${argv.standalone}]`);
}
const testFiles = glob.sync(resultInputGlob);

console.log('Processing files: ' + JSON.stringify(testFiles));


const coverageIgnorePatterns =  [
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
    '**/*.spec.js'];

if (argv.clientCoverage) {
    // skip web broker to have better picture    
    coverageIgnorePatterns.push('**/broker/**');
}

let excludePaths = /node_modules/;
if (argv.clientCoverage || argv.brokerCoverage) {
    excludePaths = coverageIgnorePatterns.map(pattern => globToRegExp(pattern));
}


const compiler = webpack({
    entry: testFiles,
    mode: 'production',
    externals: ['websocket'],
    devtool: 'source-map',
    ...(argv.clientCoverage || argv.brokerCoverage ? 
        {
            module: {
                rules: [
                    {
                        test: /\.js/,
                        exclude: excludePaths,
                        use: {
                            loader: "@jsdevtools/coverage-istanbul-loader",
                            options: {
                                compact: true,
                                esModules: true
                            }
                        }
                    }
                ]
            }
        } : {}),
    output: {
        path: path.resolve(__dirname, 'dist', 'main', 'tests'),
        filename: argv.outputFile,
        ...(argv.standalone ? {
            library: {
                name: argv.standalone,
                type: 'umd'
            }
        } : {})
    }
})

compiler.run((err, stats) => { // [Stats Object](#stats-object)
    if (err) throw new Error(err);
    console.log('...done');

    compiler.close((closeErr) => {
        if (closeErr) throw new Error(closeErr);
    });
});