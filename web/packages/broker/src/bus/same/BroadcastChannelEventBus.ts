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
import { BroadcastChannel as BChannel } from 'broadcast-channel';

import {
  AnonymousSubscription,
  CacheEntry,
  InMemoryCache,
  Logger,
  LoggerFactory,
  Subscription,
} from '@plexus-interop/common';

import { Event } from '../Event';
import { EventBus } from '../EventBus';

export class BroadcastChannelEventBus implements EventBus {
  private readonly openChannelTtl: number = 300000;

  private readonly log: Logger;

  private readonly openChannels = new InMemoryCache();

  public constructor(private readonly namespace: string = 'plexus-bus') {
    this.log = LoggerFactory.getLogger(`BroadCastEventBus [${namespace}]`);
  }

  public subscribe(key: string, handler: (event: Event) => void): Subscription {
    this.log.trace(`Subscribing to ${key}`);
    const channel = new BChannel(this.internalKey(key));
    channel.onmessage = (e) => {
      handler({ payload: e.data });
    };
    return new AnonymousSubscription(() => {
      this.log.trace(`Closing subscription to channel ${key}`);
      channel.close();
    });
  }

  public publish(key: string, event: Event): void {
    this.log.trace(`Publishing to ${key}`);
    const channel = this.lookupOpenChannel(key);
    channel.postMessage(event.payload);
  }

  public async init(): Promise<EventBus> {
    return this;
  }

  private lookupOpenChannel(key: string): BChannel {
    let channel = this.openChannels.get<BChannel>(key);
    if (!channel) {
      channel = new BChannel(this.internalKey(key));
      this.openChannels.set<BChannel>(
        key,
        new CacheEntry<BChannel>(channel, this.openChannelTtl, () => {
          this.log.debug(`TTL passed for ${key} channel, closing it`);
          (channel as BChannel).close();
        })
      );
    } else {
      this.openChannels.resetTtl(key);
    }
    return channel;
  }

  private internalKey(key: string): string {
    return `${this.namespace}:${key}`;
  }
}
