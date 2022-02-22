/**
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
import { InteropRegistryProvider } from '../InteropRegistryProvider';
import { Observable, throttleTime, throwError } from 'rxjs';
import { InteropRegistry } from '../model/InteropRegistry';
import { Logger, LoggerFactory } from '@plexus-interop/common';
import { HttpDataLoader } from '@plexus-interop/remote';
import { JsonInteropRegistryProvider } from './JsonInteropRegistryProvider';
import { WebSocketDataProvider } from '@plexus-interop/remote';


export class UrlInteropRegistryProvider implements InteropRegistryProvider {

    private readonly log: Logger = LoggerFactory.getLogger('UrlInteropRegistryProvider');

    private urlDataLoader: HttpDataLoader = new HttpDataLoader();
    
    private jsonInteropRegistryProvider: JsonInteropRegistryProvider;

    private started: boolean = false;

    public constructor(
        private readonly url: string,
        private readonly interval: number = -1,
        private webSocketDataProvider: WebSocketDataProvider = new WebSocketDataProvider()) { }

    public getRegistry(): Observable<InteropRegistry> {
        return this.started ? this.jsonInteropRegistryProvider.getRegistry() : throwError(() => new Error('Not started'));
    }

    public getCurrent(): InteropRegistry {
        if (!this.started) {
            throw new Error('Not started');
        }
        return this.jsonInteropRegistryProvider.getCurrent();
    }

    public async start(): Promise<void> {
        if (this.started) {
            return Promise.reject('Already started');
        }
        this.log.debug(`Starting to load metadata from [${this.url}] with ${this.interval} interval`);
        const isWebSocket = this.url.startsWith('ws');
        if (isWebSocket) {
            await this.startWithWebSocket();
        } else {
            await this.startWithHttp();
        }
    }

    private async startWithHttp(): Promise<void> {
        const response = await this.urlDataLoader.fetchData(this.url);
        if (this.interval > 0) {
            this.jsonInteropRegistryProvider = new JsonInteropRegistryProvider(response, this.urlDataLoader.fetchWithInterval(this.url, this.interval));
        } else {
            this.jsonInteropRegistryProvider = new JsonInteropRegistryProvider(response);
        }
        this.started = true;
    }

    private async startWithWebSocket(): Promise<void> {
        const response = await this.webSocketDataProvider.getSingleMessage(this.url);
        if (this.interval > 0) {
            this.jsonInteropRegistryProvider = new JsonInteropRegistryProvider(response, this.webSocketDataProvider.getData(this.url).pipe(throttleTime(this.interval)));
        } else {
            this.jsonInteropRegistryProvider = new JsonInteropRegistryProvider(response);
        }
        this.started = true;
    }

}