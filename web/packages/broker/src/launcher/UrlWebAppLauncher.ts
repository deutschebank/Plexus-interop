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
import { Logger, LoggerFactory } from '@plexus-interop/common';
import { UniqueId } from '@plexus-interop/protocol';

import { AppLauncher } from './AppLauncher';
import { AppLaunchRequest } from './AppLaunchRequest';
import { AppLaunchResponse } from './AppLaunchResponse';
import { LaunchInvocationContext } from './LaunchInvocationContext';

export class UrlWebAppLauncher implements AppLauncher {
  public static readonly instanceIdRequestParam: string = 'plexusInstanceId';

  private readonly log: Logger = LoggerFactory.getLogger('UrlWebAppLauncher');

  public async launch(
    invocationContext: LaunchInvocationContext,
    request: AppLaunchRequest
  ): Promise<AppLaunchResponse> {
    const appInstanceId = UniqueId.generateNew();
    const launchUrl: string = request.launchParams.url;
    const instanceIdParam = `${UrlWebAppLauncher.instanceIdRequestParam}=${appInstanceId.toString()}`;
    const url = launchUrl.indexOf('?') === -1 ? `${launchUrl}?${instanceIdParam}` : `${launchUrl}&${instanceIdParam}`;
    this.log.info(`Launching application with [${url}] url`);
    window.open(url, '_blank');
    return {
      appInstanceId,
    };
  }
}
