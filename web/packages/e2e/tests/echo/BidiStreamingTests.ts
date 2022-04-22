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
import { MethodInvocationContext, StreamingInvocationClient } from '@plexus-interop/client';
import { AsyncHelper } from '@plexus-interop/common';

import { EchoClientClient } from '../../src/echo/client/EchoClientGeneratedClient';
import * as plexus from '../../src/echo/gen/plexus-messages';
import { EchoServerClient } from '../../src/echo/server/EchoServerGeneratedClient';
import { ClientsSetup } from '../common/ClientsSetup';
import { ConnectionProvider } from '../common/ConnectionProvider';
import { BaseEchoTest } from './BaseEchoTest';
import { ClientStreamingHandler } from './ClientStreamingHandler';

export class BidiStreamingInvocationTests extends BaseEchoTest {
  public constructor(
    private connectionProvider: ConnectionProvider,
    private clientsSetup: ClientsSetup = new ClientsSetup()
  ) {
    super();
  }

  public testClientCanCancelInvocation(): Promise<void> {
    let invocationCompletedReceivedByServer = false;
    let clientReceivedCompletion = false;
    let serverReceivedMessage = false;
    return new Promise<void>((resolve, reject) => {
      const serverHandler = new ClientStreamingHandler(() => ({
        next: () => {
          serverReceivedMessage = true;
        },
        complete: () => {
          invocationCompletedReceivedByServer = true;
        },
        error: () => {},
        streamCompleted: () => {},
      }));
      try {
        (async () => {
          const [client, server] = await this.clientsSetup.createEchoClients(this.connectionProvider, serverHandler);
          const streamingClient = await client.getEchoServiceProxy().duplexStreaming({
            next: () => {},
            error: () => {},
            complete: () => {
              clientReceivedCompletion = true;
            },
            streamCompleted: () => {},
          });
          streamingClient.next(this.clientsSetup.createRequestDto());
          await AsyncHelper.waitFor(() => serverReceivedMessage === true);
          streamingClient.cancel();
          await AsyncHelper.waitFor(() => invocationCompletedReceivedByServer === true);
          await AsyncHelper.waitFor(() => clientReceivedCompletion === true);
          await this.waitForClientConnectionCleared(this.clientsSetup);
          await this.waitForServerConnectionCleared(this.clientsSetup);
          await this.clientsSetup.disconnect(client as EchoClientClient, server as EchoServerClient);
          resolve();
        })();
      } catch (error) {
        reject(error);
      }
    });
  }

  public testClientAndServerCanSendMessages(): Promise<void> {
    let client: EchoClientClient | null = null;
    let server: EchoServerClient | null = null;
    return new Promise<void>((resolve, reject) => {
      const serverHandler = new ClientStreamingHandler(
        (
          context: MethodInvocationContext,
          hostClient: StreamingInvocationClient<plexus.plexus.interop.testing.IEchoRequest>
        ) => ({
          next: async (clientRequest) => {
            if (clientRequest.stringField === 'Hey') {
              hostClient.next(this.clientsSetup.createSimpleRequestDto('Hey'));
            } else if (clientRequest.stringField === 'Ping') {
              hostClient.next(this.clientsSetup.createSimpleRequestDto('Pong'));
              await hostClient.complete();
              this.verifyServerChannelsCleared(this.clientsSetup).catch((e) => reject(e));
            }
          },
          complete: () => {},
          error: (e) => {
            reject(e);
          },
          streamCompleted: () => {},
        })
      );
      (async () => {
        [client, server] = await this.clientsSetup.createEchoClients(this.connectionProvider, serverHandler);
        const streamingClient = await client.getEchoServiceProxy().duplexStreaming({
          next: (serverResponse) => {
            if (serverResponse.stringField === 'Hey') {
              streamingClient.next(this.clientsSetup.createSimpleRequestDto('Ping'));
            } else if (serverResponse.stringField === 'Pong') {
              streamingClient
                .complete()
                .then(() => {
                  this.verifyClientChannelsCleared(this.clientsSetup).catch((e) => reject(e));
                  return this.clientsSetup.disconnect(client as EchoClientClient, server as EchoServerClient);
                })
                .then(() => resolve())
                .catch((e) => reject(e));
            }
          },
          error: (e) => {
            reject(e);
          },
          complete: () => {},
          streamCompleted: () => {},
        });
        streamingClient.next(this.clientsSetup.createSimpleRequestDto('Hey'));
      })();
    });
  }
}
