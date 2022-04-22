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
import { expect } from 'chai';

import * as plexus from '../../src/echo/gen/plexus-messages';
import { ClientsSetup } from '../common/ClientsSetup';
import { ConnectionProvider } from '../common/ConnectionProvider';
import { BaseEchoTest } from './BaseEchoTest';
import { ClientStreamingHandler } from './ClientStreamingHandler';
import { UnaryServiceHandler } from './UnaryServiceHandler';

export class DynamicInvocationTests extends BaseEchoTest {
  public constructor(
    private connectionProvider: ConnectionProvider,
    private clientsSetup: ClientsSetup = new ClientsSetup()
  ) {
    super();
  }

  public async testClientCanSendDynamicPointToPointRequest(): Promise<void> {
    const echoRequest = this.clientsSetup.createRequestDto();
    const handler = new UnaryServiceHandler(async (context, request) => request);
    const [client, server] = await this.clientsSetup.createEchoClients(this.connectionProvider, handler);
    return new Promise<void>((resolve, reject) => {
      client.sendUnaryRequest(
        {
          methodId: 'Unary',
          serviceId: 'plexus.interop.testing.EchoService',
        },
        echoRequest,
        {
          value: async (response) => {
            this.assertEqual(echoRequest, response);
            await this.clientsSetup.disconnect(client, server);
            resolve();
          },
          error: (e) => reject(e),
        },
        plexus.plexus.interop.testing.EchoRequest,
        plexus.plexus.interop.testing.EchoRequest
      );
    });
  }

  public async testClientCanSendDynamicStreamingRequest(): Promise<void> {
    const echoRequest = this.clientsSetup.createRequestDto();
    const handler = new ClientStreamingHandler((context, hostClient) => ({
      next: async (clientRequest) => {
        this.assertEqual(echoRequest, clientRequest);
        hostClient.next(clientRequest);
        hostClient.complete();
      },
      complete: () => {},
      error: () => {},
      streamCompleted: () => {},
    }));
    const [client, server] = await this.clientsSetup.createEchoClients(this.connectionProvider, handler);
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      let remoteCompleted = false;
      let remoteStreamCompleted = false;
      const invocationClient = await client.sendBidirectionalStreamingRequest(
        {
          methodId: 'DuplexStreaming',
          serviceId: 'plexus.interop.testing.EchoService',
        },
        {
          next: (serverResponse) => {
            try {
              this.assertEqual(echoRequest, serverResponse);
            } catch (error) {
              reject(error);
            }
          },
          error: (e) => reject(e),
          complete: () => {
            remoteCompleted = true;
          },
          streamCompleted: () => {
            remoteStreamCompleted = true;
          },
        },
        plexus.plexus.interop.testing.EchoRequest,
        plexus.plexus.interop.testing.EchoRequest
      );

      invocationClient.next(echoRequest);
      await invocationClient.complete();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(remoteCompleted).to.be.true;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(remoteStreamCompleted).to.be.true;
      await this.clientsSetup.disconnect(client, server);
      resolve();
    });
  }
}
