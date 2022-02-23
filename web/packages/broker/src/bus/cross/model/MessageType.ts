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
import { PublishRequest } from './PublishRequest';
import { Event } from '../../Event';
import { SubscribeRequest } from './SubscribeRequest';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class MessageType<Req, Res> {

    // tslint:disable-next-line:variable-name
    public static Ping: MessageType<{}, {}> = new MessageType<{}, {}>(1);

    // tslint:disable-next-line:variable-name
    public static Publish: MessageType<PublishRequest, {}> = new MessageType<PublishRequest, {}>(6);

    // tslint:disable-next-line:variable-name
    public static Subscribe: MessageType<SubscribeRequest, Event> = new MessageType<SubscribeRequest, Event>(8);

    constructor(public id: number) { }
    
}