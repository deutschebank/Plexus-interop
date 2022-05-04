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
import 'core-js/es/array';
import 'core-js/es/array/find';
import 'core-js/es/date';
import 'core-js/es/function';
import 'core-js/es/map';
import 'core-js/es/math';
import 'core-js/es/number';
import 'core-js/es/object';
import 'core-js/es/parse-float';
import 'core-js/es/parse-int';
import 'core-js/es/promise';
import 'core-js/es/reflect';
import 'core-js/es/regexp';
import 'core-js/es/set';
import 'core-js/es/string';
import 'core-js/es/symbol';

import { CrossDomainHostBuilder } from '@plexus-interop/broker';
import { Logger, LoggerFactory, LogLevel } from '@plexus-interop/common';

LoggerFactory.setLogLevel(LogLevel.TRACE);

export class TestCrossDomainHost {
  public start(): void {
    const logger: Logger = LoggerFactory.getLogger('CrossDomainHostPage');
    new CrossDomainHostBuilder()
      .withCrossDomainConfig({ whiteListedUrls: ['*'] })
      .build()
      .then(() => logger.info('Created'))
      .catch((e) => logger.error('Failed', e));
  }
}
const globalObject: any = window || global;
// eslint-disable-next-line no-multi-assign
const host = (globalObject.proxyHostVar = new TestCrossDomainHost());

host.start();
