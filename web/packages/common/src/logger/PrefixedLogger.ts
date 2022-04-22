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
import { Logger } from './Logger';
import { LogLevel } from './LogLevel';

export class PrefixedLogger implements Logger {
  public constructor(private readonly base: Logger, private readonly prefix: string = '') {}

  public trace(msg: string, ...args: any[]): void {
    this.base.trace(`${this.prefix} ${msg}`, args);
  }

  public warn(msg: string, ...args: any[]): void {
    this.base.trace(`${this.prefix} ${msg}`, args);
  }

  public error(msg: string, ...args: any[]): void {
    this.base.error(`${this.prefix} ${msg}`, args);
  }

  public info(msg: string, ...args: any[]): void {
    this.base.info(`${this.prefix} ${msg}`, args);
  }

  public debug(msg: string, ...args: any[]): void {
    this.base.debug(`${this.prefix} ${msg}`, args);
  }

  public getLogLevel(): LogLevel {
    return this.base.getLogLevel();
  }

  public isDebugEnabled(): boolean {
    return this.base.getLogLevel() <= LogLevel.DEBUG;
  }

  public isTraceEnabled(): boolean {
    return this.base.getLogLevel() <= LogLevel.TRACE;
  }
}
