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
const fs = require("fs");
const path = require("path");
const glob = require('glob');
const browserify = require("browserify");
const istanbul = require('browserify-istanbul');
const argv = require('minimist')(process.argv.slice(2));
const webpack = require('webpack');

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

// const browserifyBundle = browserify({ 
//     entries: testFiles, 
//     standalone: argv.standalone
// })
// .external('websocket');


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

// if (argv.clientCoverage || argv.brokerCoverage) {
//     console.log('Coverage enabled, instrumenting sources');
//     bundle = browserifyBundle.transform(istanbul({
//         ignore: coverageIgnorePatterns,
//         defaultIgnore: true
//     }), { global: true });
// } else if (argv.broker) {
//     coverageIgnorePatterns.push('**/broker/**');
// }

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
                        // include: /src/,
                        // exclude: coverageIgnorePatterns,
                        exclude: /node_modules/,
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
        filename: argv.outputFile,
        ...(argv.standalone ? {
            library: {
                name: argv.standalone,
                type: 'umd'
            }
        } : {})
    }
})


// browserifyBundle.bundle()
//     .pipe(fs.createWriteStream(argv.outputFile));

compiler.run((err, stats) => { // [Stats Object](#stats-object)
    if (err) throw new Error(err);
    console.log('...done');

    compiler.close((closeErr) => {
        if (closeErr) throw new Error(closeErr);
    });
});