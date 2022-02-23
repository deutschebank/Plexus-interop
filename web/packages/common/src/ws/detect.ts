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
export function webSocketCtor(): any {
    if (typeof window !== 'undefined') {
        const anyWindow: any = window;
        if (anyWindow && anyWindow.WebSocket) {
            return anyWindow.WebSocket;
        }    
    }
    const isNode = typeof global !== 'undefined' && ({}).toString.call(global) === '[object global]';    
    if (isNode) {
        const anyGlobal: any = global;
        if (anyGlobal && anyGlobal.WebSocket) {
            return anyGlobal.WebSocket;
        }
        // eslint-disable-next-line global-require
        return require('websocket').w3cwebsocket;          
    }
    throw new Error('WebSocket API is not found');
}