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
import { ExtendedMap } from '@plexus-interop/common';
import { Application } from './Application';
import { Message } from './Message';
import { Service } from './Service';
import { MessagesNamespace } from '../json/MessagesNamespace';
import { Enum } from './Enum';

export interface InteropRegistry {

    applications: ExtendedMap<string, Application>;

    messages: ExtendedMap<string, Message>;

    enums?: ExtendedMap<string, Enum>;

    services: ExtendedMap<string, Service>;

    rawMessages: MessagesNamespace;
    
}