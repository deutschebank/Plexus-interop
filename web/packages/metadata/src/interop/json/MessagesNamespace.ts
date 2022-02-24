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
import { Fields } from './Fields';
import { Options } from './Options';
import { EnumDto } from './EnumDto';

export interface MessageDto {
    fields: Fields;
    options?: Options;
    nested?: MessagesNamespaceContent;
}

export type MessagesNamespace = {
    options?: Options;
    nested?: MessagesNamespaceContent;
};

export type MessagesNamespaceContent = {
    [key: string]: MessageDto | MessagesNamespace | EnumDto;
};

export function isMessage(o: MessageDto | MessagesNamespace | EnumDto): o is MessageDto {
    return !!(o as MessageDto).fields;
}

export function isEnum(o: MessageDto | MessagesNamespace | EnumDto): o is EnumDto {
    return !!(o as EnumDto).values;
}