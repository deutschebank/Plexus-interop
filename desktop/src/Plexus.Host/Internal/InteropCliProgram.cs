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
 namespace Plexus.Host.Internal
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Plexus.Host.Internal.Generated;
    using Plexus.Interop;
    using UniqueId = Plexus.UniqueId;

    internal sealed class InteropCliProgram : IProgram
    {
        private static readonly ILogger Log = LogManager.GetLogger<InteropCliProgram>();

        private readonly ICommandLineToolClient _client = new CommandLineToolClient(s => s.WithBrokerWorkingDir(Directory.GetCurrentDirectory()));

        private readonly string[] _ids;

        public InteropCliProgram(IEnumerable<string> ids)
        {
            _ids = ids.ToArray();
        }

        public string Name { get; } = "Interop CLI";

        public string InstanceKey { get; } = "interop-cli";

        public InstanceAwareness InstanceAwareness { get; } = InstanceAwareness.MultiInstance;

        public async Task<Task> StartAsync()
        {
            if (_ids.Length == 0)
            {
                return TaskConstants.Completed;
            }
            await _client.ConnectAsync().ConfigureAwait(false);
            return ProcessAsync();
        }

        private async Task ProcessAsync()
        {
            try
            {
                await Task.WhenAll(_ids.Select(LaunchAppAsync)).ConfigureAwait(false);
            }
            finally
            {
                await _client.DisconnectAsync().ConfigureAwait(false);
            }
        }

        private async Task LaunchAppAsync(string appId)
        {
            try
            {
                Log.Info("Launching app {0}", appId);
                var request = new ResolveAppRequest
                {
                    AppId = appId,
                    AppResolveMode = AppLaunchMode.MultiInstance
                };
                var response = await _client.AppLifecycleService.ResolveApp(request).ConfigureAwait(false);
                var connectionId = UniqueId.FromHiLo(response.AppConnectionId.Hi, response.AppConnectionId.Lo);
                var appInstanceId = UniqueId.FromHiLo(response.AppInstanceId.Hi, response.AppInstanceId.Lo);
                Log.Info("Launched app {0}: connectionId={1}, appInstanceId={2}", appId, connectionId, appInstanceId);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Failed to launch app {0}", appId);
            }
        }

        public Task ShutdownAsync()
        {
            return _client.DisconnectAsync();
        }
    }
}