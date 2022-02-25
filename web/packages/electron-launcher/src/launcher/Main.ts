/**
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
// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron';

import { LoggerFactory, LogLevel, PrefixedLogger } from '@plexus-interop/common';

import { ElectronAppLauncher } from './ElectronAppLauncher';
import { FileLogger } from './logger/FileLogger';

declare let global: any;
// eslint-disable-next-line global-require
global.WebSocket = global.WebSocket || require('ws');
const argv = require('minimist')(process.argv.slice(1));

LoggerFactory.setLogLevel(LogLevel.TRACE);
const log = new FileLogger(LoggerFactory.getLogger('ElectronLauncherMain'));

// substitute logger implementation with simple file logger
LoggerFactory.getLogger = (name: string) => new PrefixedLogger(log, name);

log.info('Started');

const appsToLaunch = argv.apps ? argv.apps.split(';') : [];
const brokerDefaultDir = argv.brokerDir || '../..';

app.on('ready', () => {
  log.info('Connecting to Broker');
  const electronAppLauncher = new ElectronAppLauncher(log, appsToLaunch, brokerDefaultDir);
  electronAppLauncher
    .start()
    .then(() => {
      log.info('Connected to Broker');
    })
    .catch((e) => {
      log.error('Connection to broker failed', e);
      app.quit();
    });
});
