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

/* eslint-disable no-async-promise-executor */
// TODO re-enable this
import { MethodInvocationContext } from '@plexus-interop/client';
import { AsyncHelper } from '@plexus-interop/common';

import { EchoClientClient, EchoClientClientBuilder } from '../../src/echo/client/EchoClientGeneratedClient';
import { EchoServerClient } from '../../src/echo/server/EchoServerGeneratedClient';
import { ClientsSetup } from '../common/ClientsSetup';
import { ConnectionProvider } from '../common/ConnectionProvider';
import { BaseEchoTest } from './BaseEchoTest';
import { ServerStreamingHandler } from './ServerStreamingHandler';

export class ClientConnectivityTests extends BaseEchoTest {
  public constructor(
    private connectionProvider: ConnectionProvider,
    private clientsSetup: ClientsSetup = new ClientsSetup()
  ) {
    super();
  }

  public testInvocationClientReceiveErrorOnClientDisconnect(): Promise<void> {
    return this.testAllInvocationClientReceiveErrorOnDisconnect(true, false);
  }

  public async testClientReceiveErrorIfProvideWrongId(): Promise<void> {
    const preparedBuilder = new EchoClientClientBuilder()
      .withAppId('plexus.interop.testing.DoNotExist')
      .withTransportConnectionProvider(() => this.connectionProvider().then((c) => c.getConnection()));
    try {
      await preparedBuilder.connect();
    } catch (error) {
      return Promise.resolve();
    }
    throw new Error('Expect to fail to receive connection');
  }

  public async testServerReceivesErrorIfClientDroppedConnection(): Promise<void> {
    return this.testRemoteSideReceivedErrorWhenConnectionDropped(true);
  }

  public async testClientReceivesErrorIfServerDroppedConnection(): Promise<void> {
    return this.testRemoteSideReceivedErrorWhenConnectionDropped(false);
  }

  private async testRemoteSideReceivedErrorWhenConnectionDropped(isDroppedByClient: boolean): Promise<void> {
    const echoRequest = this.clientsSetup.createRequestDto();
    let client: EchoClientClient | null = null;
    let server: EchoServerClient | null = null;
    let serverInvocationContext: MethodInvocationContext | null = null;
    // TODO no-async-promise-executor
    return new Promise<void>(async (testResolve) => {
      let handler: ServerStreamingHandler | null = null;
      let clientInvocationErrorReceived: Promise<void> | null = null;

      const serverRequestReceived = new Promise<void>(async (serverRequestResolve) => {
        handler = new ServerStreamingHandler(async (context) => {
          serverInvocationContext = context;
          serverRequestResolve();
        });
        [client, server] = await this.clientsSetup.createEchoClients(
          this.connectionProvider,
          handler as ServerStreamingHandler
        );
        clientInvocationErrorReceived = new Promise<void>((clientComplete) => {
          (client as EchoClientClient).getEchoServiceProxy().serverStreaming(echoRequest, {
            next: () => {},
            // client receives 'cancel' completion
            complete: () => {
              if (!isDroppedByClient) {
                clientComplete();
              }
            },
            error: () => {
              if (isDroppedByClient) {
                clientComplete();
              }
            },
            streamCompleted: () => {},
          });
        });
      });

      // wait for server to receive request to ensure invocation established
      await serverRequestReceived;

      if (isDroppedByClient) {
        this.clientsSetup.getClientConnectionSetup().dropConnection();
      } else {
        this.clientsSetup.getServerConnectionSetup().dropConnection();
      }

      // server's context must be cancelled
      await AsyncHelper.waitFor(() =>
        (serverInvocationContext as MethodInvocationContext).cancellationToken.isCancelled()
      );

      await clientInvocationErrorReceived;

      if (isDroppedByClient) {
        await (server as EchoServerClient).disconnect();
      } else {
        await (client as EchoClientClient).disconnect();
      }

      testResolve();
    });
  }

  private testAllInvocationClientReceiveErrorOnDisconnect(
    isForcedByClient: boolean,
    isForcedByServer: boolean
  ): Promise<void> {
    const echoRequest = this.clientsSetup.createRequestDto();
    let client: EchoClientClient | null = null;
    let server: EchoServerClient | null = null;

    return new Promise<void>(async (testResolve) => {
      let handler: ServerStreamingHandler | null = null;
      let clientInvocationErrorReceived: Promise<void> | null = null;

      const serverRequestReceived = new Promise<void>(async (serverRequestResolve) => {
        handler = new ServerStreamingHandler(async () => {
          serverRequestResolve();
        });
        [client, server] = await this.clientsSetup.createEchoClients(
          this.connectionProvider,
          handler as ServerStreamingHandler
        );
        clientInvocationErrorReceived = new Promise<void>((clientErrorResolve, clientErrorReject) => {
          (client as EchoClientClient).getEchoServiceProxy().serverStreaming(echoRequest, {
            next: () => {
              clientErrorReject(new Error('Not expected to receive update'));
            },
            complete: () => {},
            error: () => {
              clientErrorResolve();
            },
            streamCompleted: () => {},
          });
        });
      });

      await serverRequestReceived;

      if (isForcedByClient) {
        (client as EchoClientClient).disconnect();
      }

      if (isForcedByServer) {
        (server as EchoServerClient).disconnect();
      }

      await clientInvocationErrorReceived;

      if (!isForcedByServer) {
        await (server as EchoServerClient).disconnect();
      }

      if (!isForcedByClient) {
        await (client as EchoClientClient).disconnect();
      }

      testResolve();
    });
  }
}
