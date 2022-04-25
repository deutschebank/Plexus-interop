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
// to execute 'warmp up' of protobufjs cli at this point rather than on first execution
import 'protobufjs/cli';

import { downloadJre, javaExecProvided } from './common/java';
import { downloadProtoc, protocExecProvided } from './common/protoc';

export function install(): Promise<void[]> {
  return Promise.all([installJre(), installProtoc()]);
}

async function installProtoc(): Promise<void> {
  if (process.env.PLEXUS_CLI_SKIP_PROTOC_DOWNLOAD === 'true') {
    console.log('protoc download skipped');
  } else {
    try {
      const provided = await protocExecProvided();
      console.log(`protoc executable already provided: ${provided}`);
    } catch (error) {
      console.log('Failed to locate Protoc Executable, going to download', error.message);
      await downloadProtoc();
    }
  }
}

async function installJre(): Promise<void> {
  if (process.env.PLEXUS_CLI_SKIP_JRE_DOWNLOAD === 'true') {
    console.log('JRE download skipped');
  } else {
    try {
      const provided = await javaExecProvided();
      console.log(`Java executable already provided: ${provided}`);
    } catch (error) {
      console.log('Failed to locate Java Executable, going to download', error.message);
      await downloadJre();
    }
  }
}
