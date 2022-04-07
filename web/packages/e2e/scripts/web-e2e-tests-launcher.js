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
const argv = require('minimist')(process.argv.slice(2));
const { exec } = require('child_process');
const killP = require('kill-port');
const fs = require('fs');

const log = console.log.bind(console);

let httpServerProcess;

async function main() {
  log(`Passed arguments${JSON.stringify(argv)}`);

  const port = argv.port || 3001;
  const baseDir = argv.baseUrl || `${__dirname}/../dist`;
  const proxyPagePath = argv.path || `main/src/views/proxyHost.html`;

  const proxyHostUrl = `http://localhost:${port}/${proxyPagePath}`;

  log(`Killing anything on port ${port}...`);
  await killP(port);

  log(`Starting http-server in ${baseDir}, listening on port ${port}`);

  httpServerProcess = exec(
    `http-server ${baseDir} -p ${port}`,
    {
      cwd: process.cwd(),
    },
    (error, stdout, stderr) => {
      log('http-server stopped');
      if ((error && error?.signal !== 'SIGKILL') || stderr) {
        console.error('http-server std Error:', stderr);
        console.error('http-server error: ', error);
      }
      killHttpServerProcess();
    }
  );

  setTimeout(() => {
    const { browser } = argv;
    switch (browser) {
      case 'ie':
        runIETest(proxyHostUrl);
        break;
      case 'chrome':
        runChromeTest(proxyHostUrl);
        break;
      case 'electron':
      default:
        runElectronTest(proxyHostUrl);
        break;
    }
  }, 1000);
}

function killHttpServerProcess() {
  if (httpServerProcess) {
    log('Killing http-server broker process ...');
    killP(argv.port || 3001);
    log('Kill signal sent');
  }
}

function runChromeTest(path) {
  log('Starting Web Broker Chrome Tests ...');
  exec(
    `karma start --hostPath=${path} --browsers=Chrome`,
    {
      cwd: process.cwd(),
    },
    testsFinishedHandler
  );
}

function runIETest(path) {
  log('Starting Web Broker IE Tests ...');
  exec(
    `karma start --hostPath=${path} --browsers=IE_no_addons`,
    {
      cwd: process.cwd(),
    },
    testsFinishedHandler
  );
}

function testsFinishedHandler(error, stdout, stderr) {
  log('Tests exection process completed, killing HTTP Server');
  if (error || stderr) {
    console.error('karma std Error:', stderr);
    console.error('karma error: ', error);
    process.exitCode = 1;
  }
  log('karma stdOut', stdout);
  killHttpServerProcess();
}

function runElectronTest(path) {
  log(`Starting Web Broker Electron Tests on ${path} ...`);
  if (!fs.existsSync(argv.file)) {
    throw new Error(`${argv.file} does not exist`);
  }
  exec(
    `electron-mocha --require scripts/coverage ${argv.file} ${
      argv.debug ? '--debug' : ''
    } --renderer --reporter spec --colors --window-config scripts/window-config.json`,
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PLEXUS_BROKER_HOST_URL: path,
      },
    },
    testsFinishedHandler
  );
}

main();
