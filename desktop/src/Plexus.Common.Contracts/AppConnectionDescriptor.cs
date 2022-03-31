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
namespace Plexus
{
    public sealed class AppConnectionDescriptor
    {
        public UniqueId ConnectionId { get; }

        public string ApplicationId { get; }

        public UniqueId ApplicationInstanceId { get; }

        public TransportType TransportType { get; }

        public AppConnectionDescriptor(
            UniqueId connectionId,
            string applicationId,
            UniqueId applicationInstanceId,
            TransportType transportType)
        {
            ConnectionId = connectionId;
            ApplicationId = applicationId;
            ApplicationInstanceId = applicationInstanceId;
            TransportType = transportType;
        }

        public override bool Equals(object obj)
            => obj is AppConnectionDescriptor other
            && ConnectionId == other.ConnectionId
            && ApplicationId == other.ApplicationId
            && ApplicationInstanceId == other.ApplicationInstanceId
            && TransportType == other.TransportType;

        public override int GetHashCode()
            => ConnectionId.GetHashCode()
            ^ ApplicationId.GetHashCode()
            ^ ApplicationInstanceId.GetHashCode()
            ^ TransportType.GetHashCode();

        public override string ToString()
            => $"{ApplicationId}, " +
               $"{nameof(ConnectionId)}: {ConnectionId}, " +
               $"{nameof(ApplicationInstanceId)}: {ApplicationInstanceId}, " +
               $"{nameof(TransportType)}: {TransportType}";
    }
}
