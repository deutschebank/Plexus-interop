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
import { InvocationMetaInfo , clientProtocol } from '@plexus-interop/protocol';
import { Observer } from '@plexus-interop/common';
import { ServiceDiscoveryRequest , ServiceDiscoveryResponse , MethodDiscoveryRequest , MethodDiscoveryResponse , ProvidedMethodReference } from '@plexus-interop/client-api';
import { UniqueId } from '@plexus-interop/transport-common';
import { AnonymousSubscription } from '../api/AnonymousSubscription';
import { Invocation } from './Invocation';

export interface GenericClient {

    getApplicationId(): string;

    getApplicationInstanceId(): UniqueId;

    getConnectionId(): UniqueId;

    requestInvocation(invocationInfo: InvocationMetaInfo): Promise<Invocation>;

    requestDiscoveredInvocation(methodReference: ProvidedMethodReference): Promise<Invocation>;

    acceptInvocations(observer: Observer<Invocation>): Promise<AnonymousSubscription>;

    discoverService(discoveryRequest: ServiceDiscoveryRequest): Promise<ServiceDiscoveryResponse>;

    discoverMethod(discoveryRequest: MethodDiscoveryRequest): Promise<MethodDiscoveryResponse>;

    disconnect(completion?: clientProtocol.ICompletion): Promise<void>;

}