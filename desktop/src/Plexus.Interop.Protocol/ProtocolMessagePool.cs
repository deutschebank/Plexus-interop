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
namespace Plexus.Interop.Protocol
{
    using Plexus.Interop.Protocol.Connect;
    using Plexus.Interop.Protocol.Discovery;
    using Plexus.Interop.Protocol.Internal;
    using Plexus.Interop.Protocol.Internal.Connect;
    using Plexus.Interop.Protocol.Internal.Discovery;
    using Plexus.Interop.Protocol.Internal.Invocation;
    using Plexus.Interop.Protocol.Invocation;
    using System.Collections.Generic;

    public sealed class ProtocolMessagePool : IProtocolMessageFactory
    {
        public static readonly ProtocolMessagePool Instance = new ProtocolMessagePool();

        public IConnectRequest CreateConnectRequest(string hostAppId, UniqueId hostAppInstanceId)
        {
            var obj = ConnectRequest.Rent();
            obj.ApplicationId = hostAppId;
            obj.ApplicationInstanceId = hostAppInstanceId;
            return obj;
        }

        public IConnectResponse CreateConnectResponse(UniqueId connectionId)
        {
            var obj = ConnectResponse.Rent();
            obj.ConnectionId = connectionId;
            return obj;
        }

        public IInvocationMessageHeader CreateInvocationMessageHeader()
        {
            return InvocationMessageHeader.Instance;
        }

        public IInvocationMessageReceived CreateInvocationMessageReceived()
        {
            return InvocationMessageReceived.Instance;
        }

        public IInvocationStart CreateInvocationStartRequest(IInvocationTarget target, IContextLinkageOptions contextLinkageOptions)
        {
            var obj = InvocationStart.Rent();
            obj.Target = target;
            obj.ContextLinkageOptions = contextLinkageOptions ?? CreateContextLinkageOptions(ContextLinkageDiscoveryMode.None);
            return obj;
        }

        public IInvocationStarted CreateInvocationStarted()
        {
            return InvocationStarted.Instance;
        }

        public IInvocationStarting CreateInvocationStarting()
        {
            return InvocationStarting.Instance;
        }

        public IInvocationStartRequested CreateInvocationStartRequested(
            string serviceId,
            string methodId,
            Maybe<string> providerServiceAlias,
            string consumerApplicationId,
            UniqueId consumerApplicationInstanceId,
            UniqueId consumerConnectionId)
        {
            var obj = InvocationStartRequested.Rent();
            obj.ServiceId = serviceId;
            obj.MethodId = methodId;
            obj.ServiceAlias = providerServiceAlias;
            obj.ConsumerApplicationId = consumerApplicationId;
            obj.ConsumerApplicationInstanceId = consumerApplicationInstanceId;
            obj.ConsumerConnectionId = consumerConnectionId;
            return obj;
        }

        public IServiceDiscoveryRequest CreateServiceDiscoveryRequest(
            Maybe<IConsumedServiceReference> consumedService,
            DiscoveryMode mode, 
            IContextLinkageOptions contextLinkageOptions)
        {
            var obj = ServiceDiscoveryRequest.Rent();
            obj.ConsumedService = consumedService;
            obj.DiscoveryMode = mode;
            obj.ContextLinkageOptions = contextLinkageOptions;
            return obj;
        }

        public IServiceDiscoveryResponse CreateServiceDiscoveryResponse(IReadOnlyCollection<IDiscoveredService> services)
        {
            var obj = ServiceDiscoveryResponse.Rent();
            obj.Services = services;
            return obj;
        }

        public IDiscoveredService CreateDiscoveredService(
            IConsumedServiceReference consumedService,
            IProvidedServiceReference providedService,
            Maybe<string> serviceTitle,
            IReadOnlyCollection<IDiscoveredServiceMethod> methods)
        {
            var obj = DiscoveredService.Rent();
            obj.ConsumedService = consumedService;
            obj.ProvidedService = providedService;
            obj.ServiceTitle = serviceTitle;
            obj.Methods = methods;
            return obj;
        }

        public IDiscoveredServiceMethod CreateDiscoveredServiceMethod(
            string methodId, 
            Maybe<string> methodTitle, 
            string inputMessageId, 
            string outputMessageId,
            MethodType methodType,
            IReadOnlyCollection<IOption> options)
        {
            var obj = DiscoveredServiceMethod.Rent();
            obj.MethodId = methodId;
            obj.MethodTitle = methodTitle;
            obj.InputMessageId = inputMessageId;
            obj.OutputMessageId = outputMessageId;
            obj.MethodType = methodType;
            obj.Options = options;
            return obj;
        }

        public IMethodDiscoveryRequest CreateMethodDiscoveryRequest(
            Maybe<string> inputMessageId, 
            Maybe<string> outputMessageId,
            Maybe<IConsumedMethodReference> method, 
            DiscoveryMode discoveryMode,
            IContextLinkageOptions contextLinkageOptions)
        {
            var obj = MethodDiscoveryRequest.Rent();
            obj.InputMessageId = inputMessageId;
            obj.OutputMessageId = outputMessageId;
            obj.ConsumedMethod = method;
            obj.DiscoveryMode = discoveryMode;
            obj.ContextLinkageOptions = contextLinkageOptions;
            return obj;
        }

        public IDiscoveredMethod CreateDiscoveredMethod(
            IProvidedMethodReference providedMethod,
            Maybe<string> methodTitle, 
            string inputMessageId, 
            string outputMessageId,
            MethodType methodType,
            IReadOnlyCollection<IOption> options)
        {
            var obj = DiscoveredMethod.Rent();
            obj.ProvidedMethod = providedMethod;
            obj.MethodTitle = methodTitle;
            obj.InputMessageId = inputMessageId;
            obj.OutputMessageId = outputMessageId;
            obj.MethodType = methodType;
            obj.Options = options;
            return obj;
        }

        public IMethodDiscoveryResponse CreateMethodDiscoveryResponse(IReadOnlyCollection<IDiscoveredMethod> methods)
        {
            var obj = MethodDiscoveryResponse.Rent();
            obj.Methods = methods;
            return obj;
        }

        public IOption CreateOption(string id, string value)
        {
            var obj = Option.Rent();
            obj.Id = id;
            obj.Value = value;
            return obj;
        }

        public IInvocationSendCompleted CreateInvocationSendCompletion()
        {
            return InvocationSendCompleted.Instance;
        }

        public IConsumedServiceReference CreateConsumedServiceReference(string serviceId, Maybe<string> serviceAlias)
        {
            var obj = ConsumedServiceReference.Rent();
            obj.ServiceId = serviceId;
            obj.ServiceAlias = serviceAlias;
            return obj;
        }

        public IConsumedMethodReference CreateConsumedMethodReference(IConsumedServiceReference consumedService, string methodId)
        {
            var obj = ConsumedMethodReference.Rent();
            obj.ConsumedService = consumedService;
            obj.MethodId = methodId;
            return obj;
        }

        public IProvidedServiceReference CreateProvidedServiceReference(string serviceId, Maybe<string> serviceAlias, Maybe<string> applicationId, Maybe<UniqueId> connectionId, Maybe<UniqueId> applicationInstanceId)
        {
            var obj = ProvidedServiceReference.Rent();
            obj.ServiceId = serviceId;
            obj.ServiceAlias = serviceAlias;
            obj.ApplicationId = applicationId;
            obj.ConnectionId = connectionId;
            obj.ApplicationInstanceId = applicationInstanceId;
            return obj;
        }

        public IProvidedMethodReference CreateProvidedMethodReference(IProvidedServiceReference providedService, string methodId)
        {
            var obj = ProvidedMethodReference.Rent();
            obj.ProvidedService = providedService;
            obj.MethodId = methodId;
            return obj;
        }

        public IContextLinkageOptions CreateContextLinkageOptions(ContextLinkageDiscoveryMode contextLinkageDiscoveryMode, Maybe<string> specificContextId = default)
        {
            var obj = ContextLinkageOptions.Rent();
            obj.Mode = contextLinkageDiscoveryMode;
            obj.SpecificContext = specificContextId;
            return obj;
        }
    }
}
