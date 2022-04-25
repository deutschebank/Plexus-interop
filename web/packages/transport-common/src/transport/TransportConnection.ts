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
import { Observer, Subscription } from '@plexus-interop/common';
import { clientProtocol, UniqueId } from '@plexus-interop/protocol';

import { TransportChannel } from './TransportChannel';

export interface TransportConnection {
  /**
   * Creates new logical Transport Channel
   */
  createChannel(): Promise<TransportChannel>;

  /**
   * Closes connection, no more communication available through this connection
   */
  disconnect(completion?: clientProtocol.ICompletion): Promise<void>;

  /**
   * Gets list of Channels managed by this Connection
   */
  getManagedChannels(): TransportChannel[];

  /**
   * Gets Channel by or id, returns undefined if not found
   */
  getManagedChannel(id: string): TransportChannel | undefined;

  /**
   * Unique connection identifier
   */
  uuid(): UniqueId;

  /**
   * Checks whether connection is active
   */
  isConnected(): boolean;

  /**
   * Subscribe for incoming channels
   */
  subscribeToChannels(channelObserver: Observer<TransportChannel>): Subscription;

  /**
   * Opens current connection, starting to receive incoming channels
   */
  connect(channelObserver?: Observer<TransportChannel>): Promise<void>;
}
