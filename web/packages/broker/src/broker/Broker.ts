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
import { ServerConnectionFactory } from '@plexus-interop/transport-common';
import { Logger, LoggerFactory } from '@plexus-interop/common';
import { InteropRegistryProvider , InteropRegistryService , AppRegistryService } from '@plexus-interop/metadata';
import { AppLifeCycleManager } from '../lifecycle/AppLifeCycleManager';
import { ClientConnectionProcessor } from './ClientConnectionProcessor';
import { AuthenticationHandler } from './AuthenticationHandler';
import { InvocationRequestHandler } from './InvocationRequestHandler';
import { ClientRequestProcessor } from './ClientRequestProcessor';
import { DiscoveryRequestHandler } from './DiscoveryRequestHandler';

export class Broker {

    private readonly log: Logger = LoggerFactory.getLogger('Broker');

    private readonly connectionProcessor: ClientConnectionProcessor;

    constructor(
        private readonly appLifeCycleManager: AppLifeCycleManager,
        private readonly connectionFactory: ServerConnectionFactory,
        private readonly registryProvider: InteropRegistryProvider,
        private readonly appService: AppRegistryService
    ) {
        const authHandler = new AuthenticationHandler(this.appService);
        const registryService = new InteropRegistryService(this.registryProvider);
        const invocationRequestHandler = new InvocationRequestHandler(registryService, this.appLifeCycleManager);
        const discoveryRequestHandler = new DiscoveryRequestHandler(appLifeCycleManager, appService, registryService);
        const clientRequestProcessor = new ClientRequestProcessor(invocationRequestHandler, discoveryRequestHandler);
        this.connectionProcessor = new ClientConnectionProcessor(authHandler, clientRequestProcessor, this.appLifeCycleManager);
        this.log.trace('Created');
    }

    public start(): void {
        this.log.debug('Starting to listen for incoming connections');
        this.connectionFactory.acceptConnections({
            next: connection => {
                const connectionGuid = connection.uuid().toString();
                if (this.log.isDebugEnabled()) {
                    this.log.debug(`Accepted new connection [${connectionGuid}]`);
                }
                this.connectionProcessor.handle(connection)
                    .then(() => this.log.info(`Finished processing of [${connectionGuid}] connection`))
                    .catch(e => this.log.error(`Error while processing of [${connectionGuid}] connection`, e));
            },
            error: e => this.log.error('Error on receiving new connection', e),
            complete: () => this.log.info('No more connections')
        });
    }

}