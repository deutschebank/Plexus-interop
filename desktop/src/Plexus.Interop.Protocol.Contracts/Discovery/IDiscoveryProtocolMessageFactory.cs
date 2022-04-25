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
﻿/**
 * Copyright 2017-2021 Plexus Interop Deutsche Bank AG
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
 using System.Collections.Generic;

namespace Plexus.Interop.Protocol.Discovery
{
    public interface IDiscoveryProtocolMessageFactory
    {
        IServiceDiscoveryRequest CreateServiceDiscoveryRequest(
            Maybe<IConsumedServiceReference> consumedService,
            DiscoveryMode discoveryMode, 
            IContextLinkageOptions contextLinkageOptions);

        IServiceDiscoveryResponse CreateServiceDiscoveryResponse(IReadOnlyCollection<IDiscoveredService> services);

        IDiscoveredService CreateDiscoveredService(
            IConsumedServiceReference consumedService,
            IProvidedServiceReference providedService,
            Maybe<string> serviceTitle,
            IReadOnlyCollection<IDiscoveredServiceMethod> methods);

        IDiscoveredServiceMethod CreateDiscoveredServiceMethod(
            string methodId, 
            Maybe<string> methodTitle, 
            string inputMessageId, 
            string outputMessageId,
            MethodType methodType,
            IReadOnlyCollection<IOption> options);

        IMethodDiscoveryRequest CreateMethodDiscoveryRequest(
            Maybe<string> inputMessageId,
            Maybe<string> outputMessageId,
            Maybe<IConsumedMethodReference> method, 
            DiscoveryMode discoveryMode, 
            IContextLinkageOptions contextLinkageOptions);

        IDiscoveredMethod CreateDiscoveredMethod(
            IProvidedMethodReference providedMethod,
            Maybe<string> methodTitle,
            string inputMessageId,
            string outputMessageId,
            MethodType methodType,
            IReadOnlyCollection<IOption> options);

        IMethodDiscoveryResponse CreateMethodDiscoveryResponse(
            IReadOnlyCollection<IDiscoveredMethod> methods);

        IOption CreateOption(string id, string value);
    }
}
