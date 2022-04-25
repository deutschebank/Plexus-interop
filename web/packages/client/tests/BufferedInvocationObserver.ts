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
import { BlockingQueueBase, CancellationToken } from '@plexus-interop/common';

import { LogInvocationObserver } from './LogInvocationObserver';

export class BufferedInvocationObserver<T> extends LogInvocationObserver<T> {
  constructor(
    private cancellationToken?: CancellationToken,
    private buffer: BlockingQueueBase<T> = new BlockingQueueBase<T>()
  ) {
    super();
  }

  public next(data: T): void {
    super.next(data);
    this.buffer.enqueue(data);
  }

  public pullData(): Promise<T> {
    return this.buffer.blockingDequeue(this.cancellationToken);
  }
}
