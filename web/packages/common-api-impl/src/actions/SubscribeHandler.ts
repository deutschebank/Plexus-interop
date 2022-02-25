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
import { GenericClientApi } from '@plexus-interop/client';
import { GenericRequest } from '@plexus-interop/client-api';
import { Application, InteropRegistryService } from '@plexus-interop/metadata';

import { Method, StreamObserver, StreamSubscription } from '../api/client-api';
import { getProvidedMethodByAlias, toMethodDefinition } from '../metadata';
import { isMethod } from '../types';
import { DiscoverMethodHandler } from './DiscoverMethodHandler';

export class SubscribeHandler {
  public constructor(
    private readonly registryService: InteropRegistryService,
    private readonly genericClienApi: GenericClientApi,
    private readonly app: Application
  ) {}

  public async handle(method: string | Method, observer: StreamObserver, args?: any): Promise<StreamSubscription> {
    const asyncNop = async () => {};
    observer.next = observer.next || asyncNop;
    observer.error = observer.error || asyncNop;
    observer.completed = observer.completed || asyncNop;

    const methodAlias: string = isMethod(method) ? method.name : method;
    const providedMethod = getProvidedMethodByAlias(methodAlias, this.registryService, this.app);
    const requestType = providedMethod.method.requestMessage.id;
    const responseType = providedMethod.method.responseMessage.id;

    const requestInfo: GenericRequest = await new DiscoverMethodHandler(
      this.registryService,
      this.genericClienApi,
      this.app
    ).findOnlineRequestInfo(method);

    const invocation = await this.genericClienApi.sendServerStreamingRequest(
      requestInfo,
      args,
      {
        next: (v) => observer.next(v),
        error: (e) => observer.error(e),
        streamCompleted: () => observer.completed(),
        complete: () => {},
      },
      requestType,
      responseType
    );

    return {
      arguments: args,
      unsubscribe: () => invocation.cancel(),
      stream: toMethodDefinition(providedMethod),
    };
  }
}
