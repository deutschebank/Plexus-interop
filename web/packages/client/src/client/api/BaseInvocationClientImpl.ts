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
import { Logger } from '@plexus-interop/common';
import {
  CancelledCompletion,
  ClientError,
  ErrorCompletion,
  clientProtocol as plexus,
  SuccessCompletion,
} from '@plexus-interop/protocol';

import { Invocation } from '../generic/Invocation';
import { InvocationClient } from './InvocationClient';

export abstract class BaseInvocationClientImpl implements InvocationClient {
  constructor(protected invocation: Invocation, protected log: Logger) {}

  public async error(clientError: ClientError): Promise<void> {
    /* istanbul ignore if */
    if (this.log.isDebugEnabled()) {
      this.log.debug(`Client reported error, closing invocation`, JSON.stringify(clientError));
    }
    await this.close(new ErrorCompletion(clientError));
  }

  public async cancel(): Promise<void> {
    this.log.debug(`Client cancelled operation, closing invocation`);
    await this.close(new CancelledCompletion());
  }

  protected async close(completion: plexus.ICompletion = new SuccessCompletion()): Promise<void> {
    await this.invocation.close(completion);
  }
}
