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
import { AnonymousSubscription, Logger, LoggerFactory, Subscription } from '@plexus-interop/common';

import { Event } from '../Event';
import { EventBus } from '../EventBus';

type Handler = (event: Event) => void;

export class MemoryEventBus implements EventBus {
  private readonly log: Logger;
  private subscriptions: Map<string, Handler[]> = new Map();

  public constructor(readonly namespace: string = 'plexus-bus') {
    this.log = LoggerFactory.getLogger(`MemoryEventBus [${namespace}]`);
  }

  public async init(): Promise<EventBus> {
    return this;
  }

  public publish(key: string, event: Event): void {
    const topic = this.internalKey(key);
    this.log.trace(`Publishing event to ${topic}`);
    this.subscriptions.get(topic)?.forEach((handler) => handler(event.payload));
  }

  public subscribe(key: string, handler: Handler): Subscription {
    const topic = this.internalKey(key);
    this.log.trace(`Subscribing to ${topic}`);

    const wrappedHandler = (value: any) => {
      this.log.trace(`Received update for ${topic}`);
      handler({ payload: value });
    };

    if (!this.subscriptions.has(topic)) this.subscriptions.set(topic, []);
    this.subscriptions.get(topic)?.push(wrappedHandler);

    const unsubscribe = () => {
      const existingHandlers = this.subscriptions.get(topic) || [];
      const index = existingHandlers.indexOf(wrappedHandler);
      this.subscriptions.set(topic, existingHandlers.splice(index, 1));
    };

    return new AnonymousSubscription(() => {
      this.log.trace(`Unsubscribing from internal ${key} channel`);
      unsubscribe();
    });
  }

  private internalKey(key: string): string {
    return `${this.namespace}:${key}`;
  }
}
