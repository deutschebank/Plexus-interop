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
﻿namespace Plexus.Interop.Metamodel
{
    using System.Collections.Generic;

    public sealed class Application : IApplication
    {
        public string Id { get; set; }

        public List<IConsumedService> ConsumedServices { get; set; } = new List<IConsumedService>();

        public List<IProvidedService> ProvidedServices { get; set; } = new List<IProvidedService>();

        IReadOnlyCollection<IConsumedService> IApplication.ConsumedServices => ConsumedServices;

        IReadOnlyCollection<IProvidedService> IApplication.ProvidedServices => ProvidedServices;

        public Maybe<LaunchMode> LaunchMode { get; set; }

        private bool Equals(Application other)
        {
            return string.Equals(Id, other.Id);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            return obj is Application && Equals((Application) obj);
        }

        public override int GetHashCode()
        {
            return (Id != null ? Id.GetHashCode() : 0);
        }

        public override string ToString()
        {
            return $"{nameof(Id)}: {Id}, {nameof(LaunchMode)}: {LaunchMode}";
        }
    }
}
