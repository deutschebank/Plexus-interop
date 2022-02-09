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
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubjectConfig } from 'rxjs/websocket';

export class WebSocketDataProvider {

    public constructor(private readonly wsCtor: any = WebSocket) {}

    public getData(url: string): Observable<string> {
        return webSocket<string>(this.config(url));
    }

    public getSingleMessage(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let resolved = false;
            let subscription = this.getData(url).subscribe({
                next: (message: string) => {
                    resolved = true;
                    resolve(message);
                },
                error: e => reject(e),
                complete: () => {
                    if (!resolved) {
                        reject(new Error('No data received'));
                    }
                }
            });
        });
    }

    private config(url: string): WebSocketSubjectConfig<string> {
        return {
            url,
            WebSocketCtor: this.wsCtor,
            // override default behavior, which invokes JSON.parse
            resultSelector: (e: MessageEvent) => e.data
        };
    }

}