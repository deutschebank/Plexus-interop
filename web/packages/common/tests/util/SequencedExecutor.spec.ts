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
import { SequencedExecutor } from '../../src/util/async/SequencedExecutor';

describe('SequencedExecutor', () => {
  const sut = new SequencedExecutor();

  it('Executus tasks in a row', (done) => {
    let counter = 0;
    sut.submit(async () => {
      counter++;
    });
    sut.submit(async () => {
      if (counter === 1) {
        done();
      }
    });
  });

  it('Executus tasks if previous failed', (done) => {
    sut
      .submit(async () => {
        throw new Error('Failed');
      })
      .catch((e) => {});
    sut.submit(async () => done());
  });
});
