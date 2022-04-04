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
  externals: ['electron', 'websocket'],
  plugins: ignorePackages.map(
    (ignorePackage) =>
      new webpack.IgnorePlugin({
        resourceRegExp: new RegExp(`^${ignorePackage}$`),
      })
  ),
};
