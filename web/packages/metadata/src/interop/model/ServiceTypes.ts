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
import { ExtendedMap } from '@plexus-interop/common';
import { MatchPattern } from './MatchPattern';
import { Message } from './Message';
import { MethodType } from './MethodType';
import { Option } from './Option';

export interface Application {

    id: string;
    
    consumedServices: ConsumedService[];

    providedServices: ProvidedService[];

    options: Option[];    

}

export interface ConsumedService {

    service: Service;

    application: Application;

    methods: ExtendedMap<string, ConsumedMethod>;

    from: MatchPattern;

    alias?: string;

}

export interface ConsumedMethod {
    method: Method;
    consumedService: ConsumedService;
}

export interface ProvidedMethod {
    method: Method;
    providedService: ProvidedService;
    title?: string;
    options: Option[];
}

export interface ProvidedService {

    service: Service;

    application: Application;

    methods: ExtendedMap<string, ProvidedMethod>;

    to: MatchPattern;

    alias?: string;

}

export interface Service {
    id: string;
    serviceAlias?: string;
    methods: ExtendedMap<string, Method>;
}

export interface Method {
    name: string;
    type: MethodType;
    requestMessage: Message;
    responseMessage: Message;
    service: Service;
}