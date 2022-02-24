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
/* eslint-disable no-console */
/* eslint-disable no-async-promise-executor */ // TODO re-enable this
import { StreamingInvocationClient, MethodInvocationContext } from '@plexus-interop/client';
import { ConnectionProvider } from '../common/ConnectionProvider';
import { ClientsSetup } from '../common/ClientsSetup';
import { BaseEchoTest } from './BaseEchoTest';
import * as plexus from '../../src/echo/gen/plexus-messages';
import { ClientStreamingHandler } from './ClientStreamingHandler';

export class ClientStreamingTests extends BaseEchoTest {

    public constructor(
        private connectionProvider: ConnectionProvider,
        private clientsSetup: ClientsSetup = new ClientsSetup()) {
        super();
    }

    public testClientCanSendStreamToServer(): Promise<void> {
        // TODO no-async-promise-executor
        return new Promise<void>(async (resolve, reject) => {
            const serverHandler = new ClientStreamingHandler((context: MethodInvocationContext, hostClient: StreamingInvocationClient<plexus.plexus.interop.testing.IEchoRequest>) => ({
                    next: async clientRequest => {
                        hostClient.next(clientRequest);
                        hostClient.complete();
                    },
                    complete: () => { },
                    error: (e) => {
                        reject(e);
                    },
                    streamCompleted: () => { }
                }));
            const [client, server] = await this.clientsSetup.createEchoClients(this.connectionProvider, serverHandler);
            let remoteCompleted = false;
            const streamingClient = await client.getEchoServiceProxy().clientStreaming({
                next: () => { },
                error: (e) => {
                    console.error('Error received by client', e);
                    reject(e);
                },
                complete: async () => {
                    remoteCompleted = true;
                },
                streamCompleted: () => { }
            });
            streamingClient.next(this.clientsSetup.createSimpleRequestDto('Hey'));
            await streamingClient.complete();
            if (!remoteCompleted) { reject(new Error('Server stream not completed')); }
            await this.clientsSetup.disconnect(client, server);
            resolve();
        });
    }

    public testServerReceivesClientCompletionBeforeResponse(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const serverHandler = new ClientStreamingHandler((context: MethodInvocationContext, hostClient: StreamingInvocationClient<plexus.plexus.interop.testing.IEchoRequest>) => {
                let lastRequest: plexus.plexus.interop.testing.IEchoRequest | null = null;
                return {
                    next: clientRequest => {
                        lastRequest = clientRequest;
                    },
                    complete: () => { },
                    error: e => reject(e),
                    streamCompleted: () => {
                        if (!lastRequest) {
                            reject(new Error('Request not received'));
                        } else {
                            hostClient.next(lastRequest);
                            hostClient.complete();
                        }
                    }
                };
            });
            const [client, server] = await this.clientsSetup.createEchoClients(this.connectionProvider, serverHandler);
            let serverCompleted = false;
            let serverStreamCompleted = false;
            const streamingClient = await client.getEchoServiceProxy().clientStreaming({
                next: () => { },
                error: e => reject(e),
                complete: () => {
                    serverCompleted = true;
                },
                streamCompleted: () => {
                    serverStreamCompleted = true;
                }
            });
            streamingClient.next(this.clientsSetup.createSimpleRequestDto('Hey'));
            await streamingClient.complete();
            if (!serverCompleted) { reject(new Error('Server not completed')); }
            if (!serverStreamCompleted) { reject(new Error('Server stream not completed')); }
            await this.clientsSetup.disconnect(client, server);
            resolve();
        });
    }

}