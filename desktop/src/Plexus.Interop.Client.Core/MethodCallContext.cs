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
    using System.Threading;

    public sealed class MethodCallContext
    {
        internal MethodCallContext(
            string consumerApplicationId,
            UniqueId consumerApplicationInstanceId,
            UniqueId consumerConnectionId,
            TransportType consumerTransportType,
            CancellationToken cancellationToken)
        {
            ConsumerApplicationId = consumerApplicationId;
            ConsumerApplicationInstanceId = consumerApplicationInstanceId;
            ConsumerConnectionId = consumerConnectionId;
            CancellationToken = cancellationToken;
            ConsumerTransportType = consumerTransportType;
        }

        public string ConsumerApplicationId { get; }

        public UniqueId ConsumerApplicationInstanceId { get; }

        public UniqueId ConsumerConnectionId { get; }

        public TransportType ConsumerTransportType { get; }

        public CancellationToken CancellationToken { get; }

        public override string ToString()
            => $"{nameof(ConsumerApplicationId)}: {ConsumerApplicationId}, " +
               $"{nameof(ConsumerConnectionId)}: {ConsumerConnectionId}, " +
               $"{nameof(ConsumerApplicationInstanceId)}: {ConsumerApplicationInstanceId}, " +
               $"{nameof(ConsumerTransportType)}: {ConsumerTransportType}";
    }
}
