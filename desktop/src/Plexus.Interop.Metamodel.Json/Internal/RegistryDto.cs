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
namespace Plexus.Interop.Metamodel.Json.Internal
{
    using System.Collections.Generic;
    using System.IO;
    using System.Runtime.Serialization;

    [DataContract]
    internal sealed class RegistryDto
    {
        private List<ServiceDto> _services = new List<ServiceDto>();
        private List<ApplicationDto> _applications = new List<ApplicationDto>();

        [DataMember(Name = "services")]
        public List<ServiceDto> Services
        {
            get => _services = _services ?? new List<ServiceDto>();
            set => _services = value ?? new List<ServiceDto>();
        }

        [DataMember(Name = "applications")]
        public List<ApplicationDto> Applications
        {
            get => _applications = _applications ?? new List<ApplicationDto>();
            set => _applications = value ?? new List<ApplicationDto>();
        }

        public static RegistryDto LoadFromFile(string filePath) =>
            JsonConvert.DeserializeFromFile<RegistryDto>(filePath);

        public static RegistryDto LoadFromStream(Stream stream) => JsonConvert.Deserialize<RegistryDto>(stream);

        public static RegistryDto Parse(string content) => JsonConvert.Deserialize<RegistryDto>(content);
    }
}