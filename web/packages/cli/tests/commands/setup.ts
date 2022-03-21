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
import * as path from 'path';
import { mkdirsSync } from 'fs-extra';
import { getBaseDir, readTextFile } from '../../src/common/files';

export function getTestBaseDir(): string {
    return path.resolve(getBaseDir(), '../../../samples/greeting/registry');
}

export function getInvalidTestBaseDir(): string {
    return path.resolve(getBaseDir(), '../../../dsl/gen/test/src/main/resources');
}

export function getTestClientInput(): string {
    return 'greeting_client.interop';
}

export function getApprovalsBaseDir(): string {
    return path.join(getBaseDir(), 'tests/approved');
}

export function prepareOutDir(testName: string): string {
    const outDir = path.join(getBaseDir(), 'dist/gen', testName);
    mkdirsSync(outDir);
    return outDir;
}

export async function filesEqual(first: string, second: string): Promise<boolean> {
    const firstContent = await readTextFile(first);
    const secondContent = await readTextFile(second);
    return unifyWhiteSpaces(firstContent) === unifyWhiteSpaces(secondContent);
}

export function unifyWhiteSpaces(s: string): string {
    return s.replace(/\s+/g, ' ');
}