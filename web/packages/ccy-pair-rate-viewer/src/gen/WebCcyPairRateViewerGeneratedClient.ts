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
import { ClientConnectRequest, ContainerAwareClientAPIBuilder, GenericClientApi, GenericClientApiBase, InvocationRequestInfo } from "@plexus-interop/client";
import { TransportConnection, UniqueId } from "@plexus-interop/transport-common";
import * as plexus from "./plexus-messages";


/**
 *  Proxy interface of CcyPairRateService service, to be consumed by Client API
 */
export abstract class CcyPairRateServiceProxy {

    public abstract getRate(request: plexus.fx.ICcyPair): Promise<plexus.fx.ICcyPairRate>;

}

/**
 *  Internal Proxy implementation for CcyPairRateService service
 */
export class CcyPairRateServiceProxyImpl implements CcyPairRateServiceProxy {

    constructor(private readonly genericClient: GenericClientApi) { }

    public getRate(request: plexus.fx.ICcyPair): Promise<plexus.fx.ICcyPairRate> {
        const invocationInfo: InvocationRequestInfo = {
            methodId: "GetRate",
            serviceId: "fx.CcyPairRateService"
        };
        return new Promise((resolve, reject) => {
            this.genericClient.sendUnaryRequest(invocationInfo, request, {
                value: responsePayload => resolve(responsePayload),
                error: e => reject(e)
            }, plexus.fx.CcyPair, plexus.fx.CcyPairRate);
        });
    }

}

/**
 * Main client API
 */
export interface WebCcyPairRateViewerClient extends GenericClientApi  {

    getCcyPairRateServiceProxy(): CcyPairRateServiceProxy;

}

/**
 * Client's API internal implementation
 */
class WebCcyPairRateViewerClientImpl extends GenericClientApiBase implements WebCcyPairRateViewerClient {

    public constructor(
        private readonly genericClient: GenericClientApi,
        private readonly ccyPairRateServiceProxy: CcyPairRateServiceProxy
    ) {
        super(genericClient);
    }

    public getCcyPairRateServiceProxy(): CcyPairRateServiceProxy {
        return this.ccyPairRateServiceProxy;
    }

}


/**
 * Client API builder
 */
export class WebCcyPairRateViewerClientBuilder {

    private clientDetails: ClientConnectRequest = {
        applicationId: "vendor_b.fx.WebCcyPairRateViewer"
    };

    private transportConnectionProvider: () => Promise<TransportConnection>;


    public withClientDetails(clientId: ClientConnectRequest): WebCcyPairRateViewerClientBuilder {
        this.clientDetails = clientId;
        return this;
    }

    public withAppInstanceId(appInstanceId: UniqueId): WebCcyPairRateViewerClientBuilder {
        this.clientDetails.applicationInstanceId = appInstanceId;
        return this;
    }

    public withAppId(appId: string): WebCcyPairRateViewerClientBuilder {
        this.clientDetails.applicationId = appId;
        return this;
    }


    public withTransportConnectionProvider(provider: () => Promise<TransportConnection>): WebCcyPairRateViewerClientBuilder {
        this.transportConnectionProvider = provider;
        return this;
    }

    public connect(): Promise<WebCcyPairRateViewerClient> {
        return new ContainerAwareClientAPIBuilder()
            .withTransportConnectionProvider(this.transportConnectionProvider)
            .withClientDetails(this.clientDetails)
            .connect()
            .then((genericClient: GenericClientApi) => new WebCcyPairRateViewerClientImpl(
                genericClient,
                new CcyPairRateServiceProxyImpl(genericClient)
                ));
    }
}
