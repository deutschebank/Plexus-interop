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
namespace Plexus.Interop
{
    public sealed class BrokerOptions
    {
        public string MetadataDir { get; }
        public uint Port { get; }
        public uint WssPort { get; }

        public BrokerOptions(
            string metadataDir,
            uint port,
            uint wssPort)
        {
            MetadataDir = metadataDir;
            Port = port;
            WssPort = wssPort;
        }

        public override string ToString() => string.Join(", ",
            $"{nameof(MetadataDir)}: {MetadataDir}",
            $"{nameof(Port)}: {Port}",
            $"{nameof(WssPort)}: {WssPort}");
    }
}
