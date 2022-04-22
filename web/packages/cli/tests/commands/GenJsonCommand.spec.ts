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
import * as path from 'path';

import { GenJsonCommand } from '../../src/commands/GenJsonCommand';
import { filesEqual, getApprovalsBaseDir, getTestBaseDir, prepareOutDir } from './setup';

describe('Metadata JSON generation CLI', () => {
  it('Generates JSON with all metadata', async () => {
    const testName = 'generated-json';
    const genCommand = new GenJsonCommand();
    const outDir = prepareOutDir(testName);

    await genCommand.action({
      out: outDir,
      baseDir: getTestBaseDir(),
    });

    expect(
      await filesEqual(
        path.join(outDir, 'interop.json'),
        path.join(getApprovalsBaseDir(), 'generated-json.approved.txt')
      )
    ).toBeTruthy();
  }, 15000);
});
