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
import { Subscription } from '@plexus-interop/common';
import { PlexusObserver } from '@plexus-interop/transport-common';
import { ActionType } from '../ActionType';
import { EventType } from '../events/EventType';

/**
 * All action calls passed from Proxy Channels/Connections to remote connection
 */
export interface RemoteBrokerService {

    subscribe<T>(eventType: EventType<T>, observer: PlexusObserver<T>): Subscription;

    publish<T>(eventType: EventType<T>, payload: T, remoteBrokerId?: string): void;

    invokeUnary<Req, Res>(actionType: ActionType<Req, Res>, requestPayload: Req, remoteBrokerId: string): Promise<Res>;

    invoke<Req, Res>(actionType: ActionType<Req, Res>, requestPaylaod: Req, remoteBrokerId: string, observer: PlexusObserver<Res>): Subscription;

    host<Req, Res>(actionType: ActionType<Req, Res>, handler: (requestPaylaod: Req, observer: PlexusObserver<Res>) => Subscription, hostId: string): void;

}