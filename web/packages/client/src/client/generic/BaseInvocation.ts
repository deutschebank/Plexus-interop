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
import { AnonymousSubscription } from '@plexus-interop/common';
import { InvocationMetaInfo, clientProtocol as plexus } from '@plexus-interop/protocol';
import { UniqueId } from '@plexus-interop/transport-common';

import { InvocationChannelObserver } from './InvocationChannelObserver';

export interface BaseInvocation<Req, Res> {
  uuid(): UniqueId;
  sendMessage(data: Req): Promise<void>;
  sendCompleted(): Promise<void>;
  open(observer: InvocationChannelObserver<AnonymousSubscription, Res>): void;
  close(completion?: plexus.ICompletion): Promise<plexus.ICompletion>;
  getMetaInfo(): InvocationMetaInfo;
}
