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
import { InvocationMetaInfo, clientProtocol as plexus } from '@plexus-interop/protocol';
import { UniqueId } from '@plexus-interop/transport-common';

import { AnonymousSubscription } from '../api/AnonymousSubscription';
import { GenericInvocation } from './GenericInvocation';
import { Invocation } from './Invocation';
import { InvocationChannelObserver } from './InvocationChannelObserver';

export class AcceptedInvocation implements Invocation {
  constructor(private readonly genericInvocation: GenericInvocation) {}

  public uuid(): UniqueId {
    return this.genericInvocation.uuid();
  }

  public sendMessage(data: ArrayBuffer): Promise<void> {
    return this.genericInvocation.sendMessage(data);
  }

  public open(observer: InvocationChannelObserver<AnonymousSubscription, ArrayBuffer>): void {
    this.genericInvocation.acceptInvocation(observer);
  }

  public close(completion?: plexus.ICompletion): Promise<plexus.ICompletion> {
    return this.genericInvocation.close(completion);
  }

  public async sendCompleted(): Promise<void> {
    return this.genericInvocation.sendCompleted();
  }

  public getMetaInfo(): InvocationMetaInfo {
    return this.genericInvocation.getMetaInfo();
  }
}
