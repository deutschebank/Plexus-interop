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
const baseReadline = require('readline');
const chokidar = require('chokidar');

function readline(filePath, callBack) {
    var lineReader = baseReadline.createInterface({
        input: require('fs').createReadStream(filePath)
    });
    lineReader.on('line', function (line) {
        callBack(line);
    });
};

function onFileAdded(dir, fileName, callback) {
    var wsAddressWatcher = chokidar.watch(dir, {
        ignored: /(^|[\/\\])\../,
        persistent: true
    });
    wsAddressWatcher
        .on('add', path => {
            if (path.endsWith(fileName)) {
                console.log(`File ${path} has been added`);
                callback(path);
            }
        })
        .on('change', path => {
            if (path.endsWith(fileName)) {
                console.log(`File ${path} has been changed`)
            }
        });
}

module.exports = {
    readline,
    onFileAdded
};