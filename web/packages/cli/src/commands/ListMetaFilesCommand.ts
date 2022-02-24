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
import { BaseJavaGenCommand } from './BaseJavaGenCommand';
import { baseDir, outFile, verbose, generalEntryPoint } from './DefaultOptions';
import { Option } from './Option';
import { getJavaExecPath, getJavaGenLibPath } from '../common/java';
import { simpleSpawn } from '../common/process';

export class ListMetaFilesCommand extends BaseJavaGenCommand {

    public plexusGenArgs: (opts: any) => string[] = opts => ['--type=list-meta', ...this.optionArgs(opts, '=', name => name === 'out' ? 'outFile' : name)]

    public generalDescription = () => 'list metadata files';

    public name = () => 'list-meta';

    public options: () => Option[] = () => [baseDir(), outFile(), generalEntryPoint(), verbose()];

    public async action(opts: any): Promise<void> {
        const javaExecPath = await getJavaExecPath();
        const javaLibPath = getJavaGenLibPath();
        await simpleSpawn(javaExecPath, ['-jar', javaLibPath, ...this.plexusGenArgs(opts)], true);
    }
}