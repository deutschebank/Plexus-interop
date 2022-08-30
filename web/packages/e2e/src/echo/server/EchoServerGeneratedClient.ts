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
import {
  ClientApiBuilder,
  ClientConnectRequest,
  Completion,
  GenericClientApi,
  GenericClientApiBase,
  GenericRequest,
  InternalGenericClientApi,
  InvocationClient,
  InvocationRequestInfo,
  MethodInvocationContext,
  StreamingInvocationClient,
} from '@plexus-interop/client';
import {
  GenericClientApiBuilder,
  MethodDiscoveryRequest,
  MethodDiscoveryResponse,
  ProvidedMethodReference,
  ServiceDiscoveryRequest,
  ServiceDiscoveryResponse,
  ValueHandler,
} from '@plexus-interop/client';
import {
  ContainerAwareClientAPIBuilder,
  InvocationObserver,
  InvocationObserverConverter,
} from '@plexus-interop/client';
import { Arrays, Observer } from '@plexus-interop/common';
import { TransportConnection, UniqueId } from '@plexus-interop/transport-common';

import * as plexus from './plexus-messages';

export interface CancellableUnaryResponse<T> {
  invocation: InvocationClient;
  response: Promise<T>;
}

/**
 * Main client API
 */
export interface EchoServerClient extends GenericClientApi {}

/**
 * Client's API internal implementation
 */
class EchoServerClientImpl extends GenericClientApiBase implements EchoServerClient {
  public constructor(private readonly genericClient: GenericClientApi) {
    super(genericClient);
  }
}

/**
 * Client invocation handler for EchoService, to be implemented by Client
 */
export abstract class EchoServiceInvocationHandler {
  public abstract onUnary(
    invocationContext: MethodInvocationContext,
    request: plexus.plexus.interop.testing.IEchoRequest
  ): Promise<plexus.plexus.interop.testing.IEchoRequest>;

  public abstract onServerStreaming(
    invocationContext: MethodInvocationContext,
    request: plexus.plexus.interop.testing.IEchoRequest,
    hostClient: StreamingInvocationClient<plexus.plexus.interop.testing.IEchoRequest>
  ): void;

  public abstract onClientStreaming(
    invocationContext: MethodInvocationContext,
    hostClient: StreamingInvocationClient<plexus.plexus.interop.testing.IEchoRequest>
  ): InvocationObserver<plexus.plexus.interop.testing.IEchoRequest>;

  public abstract onDuplexStreaming(
    invocationContext: MethodInvocationContext,
    hostClient: StreamingInvocationClient<plexus.plexus.interop.testing.IEchoRequest>
  ): InvocationObserver<plexus.plexus.interop.testing.IEchoRequest>;
}

/**
 * Client API builder
 */
export class EchoServerClientBuilder implements ClientApiBuilder<EchoServerClient, EchoServerClientBuilder> {
  protected genericBuilder: GenericClientApiBuilder = new ContainerAwareClientAPIBuilder().withApplicationId(
    'plexus.interop.testing.EchoServer'
  );

  private echoServiceHandler: EchoServiceInvocationHandler;

  public withEchoServiceInvocationsHandler(invocationsHandler: EchoServiceInvocationHandler): EchoServerClientBuilder {
    this.echoServiceHandler = invocationsHandler;
    return this;
  }

  public withClientApiDecorator(
    clientApiDecorator: (client: InternalGenericClientApi) => Promise<GenericClientApi>
  ): EchoServerClientBuilder {
    this.genericBuilder.withClientApiDecorator(clientApiDecorator);
    return this;
  }

  public withClientExtension(
    extension: (builder: ClientApiBuilder<EchoServerClient, EchoServerClientBuilder>) => void
  ): EchoServerClientBuilder {
    extension(this);
    return this;
  }

  public withTransportConnectionProvider(provider: () => Promise<TransportConnection>): EchoServerClientBuilder {
    this.genericBuilder.withTransportConnectionProvider(provider);
    return this;
  }

  public withAppInstanceId(appInstanceId: UniqueId): EchoServerClientBuilder {
    this.genericBuilder.withAppInstanceId(appInstanceId);
    return this;
  }

  public withAppId(appId: string): EchoServerClientBuilder {
    this.genericBuilder.withApplicationId(appId);
    return this;
  }

  public connect(): Promise<EchoServerClient> {
    if (!this.echoServiceHandler) {
      return Promise.reject('Invocation handler for EchoService is not provided');
    }
    return this.genericBuilder
      .withTypeAwareUnaryHandler(
        {
          serviceInfo: {
            serviceId: 'plexus.interop.testing.EchoService',
          },
          methodId: 'Unary',
          handle: this.echoServiceHandler.onUnary.bind(this.echoServiceHandler),
        },
        plexus.plexus.interop.testing.EchoRequest,
        plexus.plexus.interop.testing.EchoRequest
      )
      .withTypeAwareServerStreamingHandler(
        {
          serviceInfo: {
            serviceId: 'plexus.interop.testing.EchoService',
          },
          methodId: 'ServerStreaming',
          handle: this.echoServiceHandler.onServerStreaming.bind(this.echoServiceHandler),
        },
        plexus.plexus.interop.testing.EchoRequest,
        plexus.plexus.interop.testing.EchoRequest
      )
      .withTypeAwareBidiStreamingHandler(
        {
          serviceInfo: {
            serviceId: 'plexus.interop.testing.EchoService',
          },
          methodId: 'ClientStreaming',
          handle: this.echoServiceHandler.onClientStreaming.bind(this.echoServiceHandler),
        },
        plexus.plexus.interop.testing.EchoRequest,
        plexus.plexus.interop.testing.EchoRequest
      )
      .withTypeAwareBidiStreamingHandler(
        {
          serviceInfo: {
            serviceId: 'plexus.interop.testing.EchoService',
          },
          methodId: 'DuplexStreaming',
          handle: this.echoServiceHandler.onDuplexStreaming.bind(this.echoServiceHandler),
        },
        plexus.plexus.interop.testing.EchoRequest,
        plexus.plexus.interop.testing.EchoRequest
      )
      .connect()
      .then((genericClient) => new EchoServerClientImpl(genericClient));
  }
}
