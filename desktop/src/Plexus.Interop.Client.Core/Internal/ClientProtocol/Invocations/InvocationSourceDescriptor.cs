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
﻿namespace Plexus.Interop.Internal.ClientProtocol.Invocations
{
    internal sealed class InvocationSourceDescriptor
    {
        public InvocationSourceDescriptor(
            string applicationId,
            UniqueId applicationInstanceId,
            UniqueId connectionId)
        {
            ApplicationId = applicationId;
            ConnectionId = connectionId;
            ApplicationInstanceId = applicationInstanceId;
        }

        public string ApplicationId { get; }

        public UniqueId ConnectionId { get; }

        public UniqueId ApplicationInstanceId { get; }

        private bool Equals(InvocationSourceDescriptor other)
        {
            return string.Equals(ApplicationId, other.ApplicationId) && ConnectionId.Equals(other.ConnectionId) && string.Equals(ApplicationInstanceId, other.ApplicationInstanceId);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            return obj is InvocationSourceDescriptor && Equals((InvocationSourceDescriptor) obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hashCode = (ApplicationId != null ? ApplicationId.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ ConnectionId.GetHashCode();
                hashCode = (hashCode * 397) ^ ApplicationInstanceId.GetHashCode();
                return hashCode;
            }
        }

        public override string ToString()
        {
            return $"{nameof(ApplicationId)}: {ApplicationId}, {nameof(ConnectionId)}: {ConnectionId}, {nameof(ApplicationInstanceId)}: {ApplicationInstanceId}";
        }
    }
}
