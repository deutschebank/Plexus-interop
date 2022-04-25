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
import { TransportConnection, UniqueId } from '@plexus-interop/transport-common';

import { GenericClientApi } from './GenericClientApi';
import { InternalGenericClientApi } from './internal/InternalGenericClientApi';

export interface ClientApiBuilder<ClientType, BuilderType extends ClientApiBuilder<ClientType, any>> {
  connect(): Promise<ClientType>;
  withClientApiDecorator(
    clientApiDecorator: (client: InternalGenericClientApi) => Promise<GenericClientApi>
  ): BuilderType;
  withClientExtension(extension: (builder: ClientApiBuilder<ClientType, BuilderType>) => void): BuilderType;
  withTransportConnectionProvider(provider: () => Promise<TransportConnection>): BuilderType;
  withAppInstanceId(appInstanceId: UniqueId): BuilderType;
  withAppId(appId: string): BuilderType;
}
