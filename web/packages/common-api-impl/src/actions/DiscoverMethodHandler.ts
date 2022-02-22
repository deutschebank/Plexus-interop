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
import { GenericRequest } from '@plexus-interop/client-api';
import { Application, InteropRegistryService } from '@plexus-interop/metadata';
import { GenericClientApi, DiscoveryMode, UniqueId, ProvidedMethodReference } from '@plexus-interop/client';
import { clientProtocol as plexus } from '@plexus-interop/protocol';
import { getProvidedMethodByAlias, toConsumedMethodRef } from '../metadata';
import { Method } from '../api';
import { isMethod } from '../types';

export class DiscoverMethodHandler {

    public constructor(
        private readonly registryService: InteropRegistryService,
        private readonly genericClienApi: GenericClientApi,
        private readonly app: Application
    ) { }

    public async findOnlineRequestInfo(method: string | Method): Promise<GenericRequest> {
        return this.findRequestInfo(method, DiscoveryMode.Online);
    }

    public async findOfflineRequestInfo(method: string | Method): Promise<GenericRequest> {
        return this.findRequestInfo(method, DiscoveryMode.Offline);
    }

    public async findRequestInfo(method: string | Method, mode: DiscoveryMode): Promise<GenericRequest> {
        const methodAlias: string = isMethod(method) ? method.name : method;
        const providedMethod = getProvidedMethodByAlias(methodAlias, this.registryService, this.app);
        let requestInfo: GenericRequest;
        const discovered = await this.genericClienApi.discoverMethod({
            consumedMethod: toConsumedMethodRef(providedMethod),
            discoveryMode: mode
        });
        let methods = discovered.methods || [];
        if (isMethod(method)) {
            const providerAppRef = this.registryService.getApplication(method.peer.applicationName);
            methods = methods.filter(m => {
                if (m.providedMethod && m.providedMethod.providedService) {
                    const id = m.providedMethod.providedService.applicationId;
                    const {connectionId} = m.providedMethod.providedService;
                    const connectionIdString = UniqueId.fromProperties(connectionId as plexus.IUniqueId).toString();
                    return id === providerAppRef.id && connectionIdString === method.peer.id;
                } 
                    return false;
                
            });
        }
        if (methods.length > 0) {
            requestInfo = methods[0].providedMethod as ProvidedMethodReference;
        } else {
            throw new Error(`Handler for action [${methodAlias}] is not found`);
        }
        return requestInfo;
    }

}