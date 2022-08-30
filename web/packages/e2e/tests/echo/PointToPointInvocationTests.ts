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

/* eslint-disable no-promise-executor-return */
import { expect } from 'chai';

import { MethodInvocationContext } from '@plexus-interop/client';
import { AsyncHelper } from '@plexus-interop/common';
import { ClientError } from '@plexus-interop/protocol';

import * as plexus from '../../src/echo/server/plexus-messages';
import { ClientsSetup } from '../common/ClientsSetup';
import { ConnectionProvider } from '../common/ConnectionProvider';
import { BaseEchoTest } from './BaseEchoTest';
import { NopServiceHandler } from './NopServiceHandler';
import { UnaryServiceHandler } from './UnaryServiceHandler';

export class PointToPointInvocationTests extends BaseEchoTest {
  public constructor(
    private connectionProvider: ConnectionProvider,
    private clientsSetup: ClientsSetup = new ClientsSetup()
  ) {
    super();
  }

  public testMessageSent(): Promise<void> {
    const echoRequest = this.clientsSetup.createRequestDto();
    return this.testMessageSentInternal(echoRequest);
  }

  public testAliasedServiceInvoked(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const echoRequest = this.clientsSetup.createRequestDto();
      return this.clientsSetup
        .createEchoClients(this.connectionProvider, new NopServiceHandler())
        .then((clients) =>
          clients[0]
            .getServiceAliasProxy()
            .unary(echoRequest)
            .then((echoResponse) => {
              this.assertEqual(echoRequest, echoResponse);
              return this.clientsSetup.disconnect(clients[0], clients[1]);
            })
        )
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }

  public testHugeMessageSent(): Promise<void> {
    const echoRequest = this.clientsSetup.createHugeRequestDto(10 * 1024 * 1024);
    return this.testMessageSentInternal(echoRequest);
  }

  public testHostExecutionExceptionReceived(): Promise<void> {
    const errorText = 'Host error';
    return this.testHostsExecutionErrorReceivedInternal(new Error(errorText), errorText, false);
  }

  public testHostsExecutionClientErrorReceived(): Promise<void> {
    const errorText = 'Host error';
    return this.testHostsExecutionErrorReceivedInternal(new ClientError(errorText), errorText);
  }

  public testHostsExecutionErrorReceived(): Promise<void> {
    const errorText = 'Host error';
    return this.testHostsExecutionErrorReceivedInternal(new Error(errorText), errorText);
  }

  public testHostsExecutionStringErrorReceived(): Promise<void> {
    const errorText = 'Host error';
    return this.testHostsExecutionErrorReceivedInternal(errorText, errorText);
  }

  public async testGeneratedClientCanCancelUnaryInvocation(): Promise<void> {
    const echoRequest = this.clientsSetup.createRequestDto();
    let serverReceivedCancel = false;
    const handler = new UnaryServiceHandler(
      (context) =>
        new Promise<plexus.plexus.interop.testing.IEchoRequest>(() => {
          context.cancellationToken.onCancel(() => {
            serverReceivedCancel = true;
          });
          // "long running operation" do not return any result
        })
    );
    const [echoClient, echoServer] = await this.clientsSetup.createEchoClients(this.connectionProvider, handler);
    const cancellableResponse = await echoClient.getEchoServiceProxy().unaryWithCancellation(echoRequest);
    await cancellableResponse.invocation.cancel();
    await this.clientsSetup.disconnect(echoClient, echoServer);
    await AsyncHelper.waitFor(() => serverReceivedCancel === true, undefined, 10, 500);
  }

  public async testGeneratedClientCanGetResponseFromCancellableUnaryInvocation(): Promise<void> {
    const echoRequest = this.clientsSetup.createRequestDto();
    const handler = new UnaryServiceHandler(async () => echoRequest);
    const [echoClient, echoServer] = await this.clientsSetup.createEchoClients(this.connectionProvider, handler);
    const cancellableResponse = await echoClient.getEchoServiceProxy().unaryWithCancellation(echoRequest);
    const echoResponse = await cancellableResponse.response;
    await this.clientsSetup.disconnect(echoClient, echoServer);
    this.assertEqual(echoRequest, echoResponse);
  }

  public testFewMessagesSent(): Promise<void> {
    const echoRequest = this.clientsSetup.createRequestDto();
    return new Promise<void>((resolve, reject) => {
      const handler = new UnaryServiceHandler(async (context: MethodInvocationContext, request) => request);
      return this.clientsSetup
        .createEchoClients(this.connectionProvider, handler)
        .then((clients) =>
          (async () => {
            let echoResponse = await clients[0].getEchoServiceProxy().unary(echoRequest);
            this.assertEqual(echoRequest, echoResponse);
            echoResponse = await clients[0].getEchoServiceProxy().unary(echoRequest);
            this.assertEqual(echoRequest, echoResponse);
            echoResponse = await clients[0].getEchoServiceProxy().unary(echoRequest);
            this.assertEqual(echoRequest, echoResponse);
          })().then(() => this.clientsSetup.disconnect(clients[0], clients[1]))
        )
        .then(() => resolve())
        .catch((error) => {
          reject(error);
        });
    });
  }

  private testMessageSentInternal(echoRequest: plexus.plexus.interop.testing.IEchoRequest): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const handler = new UnaryServiceHandler(async (context: MethodInvocationContext, request) => {
        try {
          this.verifyInvocationContext(context);
          this.assertEqual(request, echoRequest);
        } catch (error) {
          reject(error);
        }
        return request;
      });
      return this.clientsSetup
        .createEchoClients(this.connectionProvider, handler)
        .then((clients) =>
          clients[0]
            .getEchoServiceProxy()
            .unary(echoRequest)
            .then((echoResponse) => {
              this.assertEqual(echoRequest, echoResponse);
              return this.clientsSetup.disconnect(clients[0], clients[1]);
            })
        )
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }

  private testHostsExecutionErrorReceivedInternal(
    errorObj: any,
    errorText: string,
    isPromise: boolean = true
  ): Promise<void> {
    const echoRequest = this.clientsSetup.createRequestDto();
    return new Promise<void>((resolve, reject) => {
      const handler = new UnaryServiceHandler(() => {
        if (isPromise) {
          return Promise.reject(errorObj);
        }
        throw errorObj;
      });
      this.clientsSetup
        .createEchoClients(this.connectionProvider, handler)
        .then((clients) =>
          clients[0]
            .getEchoServiceProxy()
            .unary(echoRequest)
            .then(() => {
              reject(new Error('Should not happen'));
            })
            .catch((error) => {
              expect(error.message).to.eq(errorText);
              return this.clientsSetup.disconnect(clients[0], clients[1]);
            })
        )
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }
}
