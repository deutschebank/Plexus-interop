/* eslint-disable max-classes-per-file */
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
import { ClientApiBuilder, ContainerAwareClientAPIBuilder, GenericClientApi, GenericClientApiBase, GenericClientApiBuilder, InternalGenericClientApi, InvocationClient, InvocationObserver, InvocationRequestInfo, StreamingInvocationClient } from '@plexus-interop/client';
import { TransportConnection, UniqueId } from '@plexus-interop/transport-common';
import * as plexus from '../gen/plexus-messages';


export interface CancellableUnaryResponse<T> {
    invocation: InvocationClient;
    response: Promise<T>;
}

/**
 *  Proxy interface of EchoService service, to be consumed by Client API
 */
export abstract class EchoServiceProxy {

    public abstract unary(request: plexus.plexus.interop.testing.IEchoRequest): Promise<plexus.plexus.interop.testing.IEchoRequest>;

    public abstract unaryWithCancellation(request: plexus.plexus.interop.testing.IEchoRequest): Promise<CancellableUnaryResponse<plexus.plexus.interop.testing.IEchoRequest>>;
    
    public abstract serverStreaming(request: plexus.plexus.interop.testing.IEchoRequest, responseObserver: InvocationObserver<plexus.plexus.interop.testing.IEchoRequest>): Promise<InvocationClient>;
    
    public abstract clientStreaming(responseObserver: InvocationObserver<plexus.plexus.interop.testing.IEchoRequest>): Promise<StreamingInvocationClient<plexus.plexus.interop.testing.IEchoRequest>>;
    
    public abstract duplexStreaming(responseObserver: InvocationObserver<plexus.plexus.interop.testing.IEchoRequest>): Promise<StreamingInvocationClient<plexus.plexus.interop.testing.IEchoRequest>>;

}

/**
 *  Proxy interface of ServiceAlias service, to be consumed by Client API
 */
export abstract class ServiceAliasProxy {

    public abstract unary(request: plexus.plexus.interop.testing.IEchoRequest): Promise<plexus.plexus.interop.testing.IEchoRequest>;

}

/**
 *  Internal Proxy implementation for EchoService service
 */
export class EchoServiceProxyImpl implements EchoServiceProxy {

    constructor(private readonly genericClient: GenericClientApi) { }

    public unaryWithCancellation(request: plexus.plexus.interop.testing.IEchoRequest): Promise<CancellableUnaryResponse<plexus.plexus.interop.testing.IEchoRequest>> {
        const invocationInfo: InvocationRequestInfo = {
            methodId: 'Unary',
            serviceId: 'plexus.interop.testing.EchoService'
        };
        return new Promise<CancellableUnaryResponse<plexus.plexus.interop.testing.IEchoRequest>>((resolveInvocation, rejectInvocation) => {
            const responsePromise = new Promise<plexus.plexus.interop.testing.IEchoRequest>((resolveResponse, rejectResponse) => {
                this.genericClient.sendUnaryRequest(invocationInfo, request, {
                    value: responsePayload => resolveResponse(responsePayload),
                    error: e => rejectResponse(e)
                }, plexus.plexus.interop.testing.EchoRequest, plexus.plexus.interop.testing.EchoRequest)
                .then(invocationClient => resolveInvocation({ invocation: invocationClient, response: responsePromise }))
                .catch(rejectInvocation);
            });
        });
    }

    public unary(request: plexus.plexus.interop.testing.IEchoRequest): Promise<plexus.plexus.interop.testing.IEchoRequest> {
        const invocationInfo: InvocationRequestInfo = {
            methodId: 'Unary',
            serviceId: 'plexus.interop.testing.EchoService'
        };
        return new Promise((resolve, reject) => {
            this.genericClient.sendUnaryRequest(invocationInfo, request, {
                value: responsePayload => resolve(responsePayload),
                error: e => reject(e)
            }, plexus.plexus.interop.testing.EchoRequest, plexus.plexus.interop.testing.EchoRequest);
        });
    }
    
    public serverStreaming(request: plexus.plexus.interop.testing.IEchoRequest, responseObserver: InvocationObserver<plexus.plexus.interop.testing.IEchoRequest>): Promise<InvocationClient> {
        const invocationInfo: InvocationRequestInfo = {
            methodId: 'ServerStreaming',
            serviceId: 'plexus.interop.testing.EchoService'
        };
        return this.genericClient.sendServerStreamingRequest(
            invocationInfo,
            request,
            responseObserver,
            plexus.plexus.interop.testing.EchoRequest, plexus.plexus.interop.testing.EchoRequest
        );
    }
    
    public clientStreaming(responseObserver: InvocationObserver<plexus.plexus.interop.testing.IEchoRequest>): Promise<StreamingInvocationClient<plexus.plexus.interop.testing.IEchoRequest>> {
        const invocationInfo: InvocationRequestInfo = {
            methodId: 'ClientStreaming',
            serviceId: 'plexus.interop.testing.EchoService'
        };
        return this.genericClient.sendBidirectionalStreamingRequest(
            invocationInfo,
            responseObserver,
            plexus.plexus.interop.testing.EchoRequest, plexus.plexus.interop.testing.EchoRequest);
    }
    
    public duplexStreaming(responseObserver: InvocationObserver<plexus.plexus.interop.testing.IEchoRequest>): Promise<StreamingInvocationClient<plexus.plexus.interop.testing.IEchoRequest>> {
        const invocationInfo: InvocationRequestInfo = {
            methodId: 'DuplexStreaming',
            serviceId: 'plexus.interop.testing.EchoService'
        };
        return this.genericClient.sendBidirectionalStreamingRequest(
            invocationInfo,
            responseObserver,
            plexus.plexus.interop.testing.EchoRequest, plexus.plexus.interop.testing.EchoRequest);
    }

}

/**
 *  Internal Proxy implementation for ServiceAlias service
 */
export class ServiceAliasProxyImpl implements ServiceAliasProxy {

    constructor(private readonly genericClient: GenericClientApi) { }

    public unary(request: plexus.plexus.interop.testing.IEchoRequest): Promise<plexus.plexus.interop.testing.IEchoRequest> {
        const invocationInfo: InvocationRequestInfo = {
            methodId: 'Unary',
            serviceId: 'plexus.interop.testing.EchoService',
            serviceAlias: 'ServiceAlias'
        };
        return new Promise((resolve, reject) => {
            this.genericClient.sendUnaryRequest(invocationInfo, request, {
                value: responsePayload => resolve(responsePayload),
                error: e => reject(e)
            }, plexus.plexus.interop.testing.EchoRequest, plexus.plexus.interop.testing.EchoRequest);
        });
    }

}

/**
 * Main client API
 */
export interface EchoClientClient extends GenericClientApi  {

    getEchoServiceProxy(): EchoServiceProxy;
    
    getServiceAliasProxy(): ServiceAliasProxy;

}

/**
 * Client's API internal implementation
 */
class EchoClientClientImpl extends GenericClientApiBase implements EchoClientClient {

    public constructor(
        private readonly genericClient: GenericClientApi,
        private readonly echoServiceProxy: EchoServiceProxy,
        private readonly serviceAliasProxy: ServiceAliasProxy
    ) {
        super(genericClient);
    }

    public getEchoServiceProxy(): EchoServiceProxy {
        return this.echoServiceProxy;
    }
    
    public getServiceAliasProxy(): ServiceAliasProxy {
        return this.serviceAliasProxy;
    }

}


/**
 * Client API builder
 */
export class EchoClientClientBuilder implements ClientApiBuilder<EchoClientClient, EchoClientClientBuilder> {

    protected genericBuilder: GenericClientApiBuilder =
        new ContainerAwareClientAPIBuilder()
            .withApplicationId('plexus.interop.testing.EchoClient');



    public withClientApiDecorator(clientApiDecorator: (client: InternalGenericClientApi) => Promise<GenericClientApi>): EchoClientClientBuilder {
        this.genericBuilder.withClientApiDecorator(clientApiDecorator);
        return this;
    }

    public withClientExtension(extension: (builder: ClientApiBuilder<EchoClientClient, EchoClientClientBuilder>) => void): EchoClientClientBuilder {
        extension(this);
        return this;
    }

    public withTransportConnectionProvider(provider: () => Promise<TransportConnection>): EchoClientClientBuilder {
        this.genericBuilder.withTransportConnectionProvider(provider);
        return this;
    }

    public withAppInstanceId(appInstanceId: UniqueId): EchoClientClientBuilder {
        this.genericBuilder.withAppInstanceId(appInstanceId);
        return this;
    }

    public withAppId(appId: string): EchoClientClientBuilder {
        this.genericBuilder.withApplicationId(appId);
        return this;
    }

    public connect(): Promise<EchoClientClient> {
        return this.genericBuilder
            .connect()
            .then(genericClient => new EchoClientClientImpl(
                genericClient,
                new EchoServiceProxyImpl(genericClient),
                                new ServiceAliasProxyImpl(genericClient)
                ));
    }
}
