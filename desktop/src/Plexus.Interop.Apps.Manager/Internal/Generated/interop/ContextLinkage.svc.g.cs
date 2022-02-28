/**
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
// <auto-generated>
// 	Generated by the Plexus Interop compiler.  DO NOT EDIT!
// 	source: interop\context_linkage.proto
// </auto-generated>
#pragma warning disable 1591, 0612, 3021
#region Designer generated code
namespace Plexus.Interop.Apps.Internal.Generated {
	
	using System;
	using global::Plexus;
	using global::Plexus.Channels;
	using global::Plexus.Interop;
	using global::System.Threading.Tasks;
					
	internal static partial class ContextLinkageService {
		
		public const string Id = "interop.ContextLinkageService";			
		public const string ContextLoadedStreamMethodId = "ContextLoadedStream";
		public const string CreateContextMethodId = "CreateContext";
		public const string CreateContext2MethodId = "CreateContext2";
		public const string JoinContextMethodId = "JoinContext";
		public const string GetContextsMethodId = "GetContexts";
		public const string GetLinkedInvocationsMethodId = "GetLinkedInvocations";
		public const string GetAllLinkedInvocationsMethodId = "GetAllLinkedInvocations";
		public const string AppJoinedContextStreamMethodId = "AppJoinedContextStream";
		public const string RestoreContextsLinkageMethodId = "RestoreContextsLinkage";
		
		public static readonly ContextLinkageService.Descriptor DefaultDescriptor = CreateDescriptor();
		
		public static ContextLinkageService.Descriptor CreateDescriptor() {
			return new ContextLinkageService.Descriptor();
		} 
		
		public static ContextLinkageService.Descriptor CreateDescriptor(string alias) {
			return new ContextLinkageService.Descriptor(alias);
		}				
	
		public partial interface IContextLoadedStreamProxy {
			IServerStreamingMethodCall<global::Plexus.Interop.Apps.Internal.Generated.ContextLoadingUpdate> ContextLoadedStream(global::Plexus.Interop.Apps.Internal.Generated.Context request);
		}
		
		public partial interface ICreateContextProxy {
			IUnaryMethodCall<global::Plexus.Interop.Apps.Internal.Generated.Context> CreateContext(global::Google.Protobuf.WellKnownTypes.Empty request);
		}
		
		public partial interface ICreateContext2Proxy {
			IUnaryMethodCall<global::Plexus.Interop.Apps.Internal.Generated.Context> CreateContext2(global::Plexus.Interop.Apps.Internal.Generated.CreateContextRequest request);
		}
		
		public partial interface IJoinContextProxy {
			IUnaryMethodCall<global::Google.Protobuf.WellKnownTypes.Empty> JoinContext(global::Plexus.Interop.Apps.Internal.Generated.Context request);
		}
		
		public partial interface IGetContextsProxy {
			IUnaryMethodCall<global::Plexus.Interop.Apps.Internal.Generated.ContextsList> GetContexts(global::Google.Protobuf.WellKnownTypes.Empty request);
		}
		
		public partial interface IGetLinkedInvocationsProxy {
			IUnaryMethodCall<global::Plexus.Interop.Apps.Internal.Generated.InvocationsList> GetLinkedInvocations(global::Plexus.Interop.Apps.Internal.Generated.Context request);
		}
		
		public partial interface IGetAllLinkedInvocationsProxy {
			IUnaryMethodCall<global::Plexus.Interop.Apps.Internal.Generated.ContextToInvocationsList> GetAllLinkedInvocations(global::Google.Protobuf.WellKnownTypes.Empty request);
		}
		
		public partial interface IAppJoinedContextStreamProxy {
			IServerStreamingMethodCall<global::Plexus.Interop.Apps.Internal.Generated.AppJoinedContextEvent> AppJoinedContextStream(global::Google.Protobuf.WellKnownTypes.Empty request);
		}
		
		public partial interface IRestoreContextsLinkageProxy {
			IUnaryMethodCall<global::Plexus.Interop.Apps.Internal.Generated.RestoreContextsLinkageResponse> RestoreContextsLinkage(global::Plexus.Interop.Apps.Internal.Generated.RestoreContextsLinkageRequest request);
		}
		
		public partial interface IContextLoadedStreamImpl {
			Task ContextLoadedStream(global::Plexus.Interop.Apps.Internal.Generated.Context request, IWritableChannel<global::Plexus.Interop.Apps.Internal.Generated.ContextLoadingUpdate> responseStream, MethodCallContext context);
		}
		
		public partial interface ICreateContextImpl {
			Task<global::Plexus.Interop.Apps.Internal.Generated.Context> CreateContext(global::Google.Protobuf.WellKnownTypes.Empty request, MethodCallContext context);
		}
		
		public partial interface ICreateContext2Impl {
			Task<global::Plexus.Interop.Apps.Internal.Generated.Context> CreateContext2(global::Plexus.Interop.Apps.Internal.Generated.CreateContextRequest request, MethodCallContext context);
		}
		
		public partial interface IJoinContextImpl {
			Task<global::Google.Protobuf.WellKnownTypes.Empty> JoinContext(global::Plexus.Interop.Apps.Internal.Generated.Context request, MethodCallContext context);
		}
		
		public partial interface IGetContextsImpl {
			Task<global::Plexus.Interop.Apps.Internal.Generated.ContextsList> GetContexts(global::Google.Protobuf.WellKnownTypes.Empty request, MethodCallContext context);
		}
		
		public partial interface IGetLinkedInvocationsImpl {
			Task<global::Plexus.Interop.Apps.Internal.Generated.InvocationsList> GetLinkedInvocations(global::Plexus.Interop.Apps.Internal.Generated.Context request, MethodCallContext context);
		}
		
		public partial interface IGetAllLinkedInvocationsImpl {
			Task<global::Plexus.Interop.Apps.Internal.Generated.ContextToInvocationsList> GetAllLinkedInvocations(global::Google.Protobuf.WellKnownTypes.Empty request, MethodCallContext context);
		}
		
		public partial interface IAppJoinedContextStreamImpl {
			Task AppJoinedContextStream(global::Google.Protobuf.WellKnownTypes.Empty request, IWritableChannel<global::Plexus.Interop.Apps.Internal.Generated.AppJoinedContextEvent> responseStream, MethodCallContext context);
		}
		
		public partial interface IRestoreContextsLinkageImpl {
			Task<global::Plexus.Interop.Apps.Internal.Generated.RestoreContextsLinkageResponse> RestoreContextsLinkage(global::Plexus.Interop.Apps.Internal.Generated.RestoreContextsLinkageRequest request, MethodCallContext context);
		}
		
		public sealed partial class Descriptor {
		
			public ServerStreamingMethod<global::Plexus.Interop.Apps.Internal.Generated.Context, global::Plexus.Interop.Apps.Internal.Generated.ContextLoadingUpdate> ContextLoadedStreamMethod {get; private set; }
			public UnaryMethod<global::Google.Protobuf.WellKnownTypes.Empty, global::Plexus.Interop.Apps.Internal.Generated.Context> CreateContextMethod {get; private set; }
			public UnaryMethod<global::Plexus.Interop.Apps.Internal.Generated.CreateContextRequest, global::Plexus.Interop.Apps.Internal.Generated.Context> CreateContext2Method {get; private set; }
			public UnaryMethod<global::Plexus.Interop.Apps.Internal.Generated.Context, global::Google.Protobuf.WellKnownTypes.Empty> JoinContextMethod {get; private set; }
			public UnaryMethod<global::Google.Protobuf.WellKnownTypes.Empty, global::Plexus.Interop.Apps.Internal.Generated.ContextsList> GetContextsMethod {get; private set; }
			public UnaryMethod<global::Plexus.Interop.Apps.Internal.Generated.Context, global::Plexus.Interop.Apps.Internal.Generated.InvocationsList> GetLinkedInvocationsMethod {get; private set; }
			public UnaryMethod<global::Google.Protobuf.WellKnownTypes.Empty, global::Plexus.Interop.Apps.Internal.Generated.ContextToInvocationsList> GetAllLinkedInvocationsMethod {get; private set; }
			public ServerStreamingMethod<global::Google.Protobuf.WellKnownTypes.Empty, global::Plexus.Interop.Apps.Internal.Generated.AppJoinedContextEvent> AppJoinedContextStreamMethod {get; private set; }
			public UnaryMethod<global::Plexus.Interop.Apps.Internal.Generated.RestoreContextsLinkageRequest, global::Plexus.Interop.Apps.Internal.Generated.RestoreContextsLinkageResponse> RestoreContextsLinkageMethod {get; private set; }
			
			public Descriptor() {				
				ContextLoadedStreamMethod = Method.ServerStreaming<global::Plexus.Interop.Apps.Internal.Generated.Context, global::Plexus.Interop.Apps.Internal.Generated.ContextLoadingUpdate>(Id, ContextLoadedStreamMethodId);
				CreateContextMethod = Method.Unary<global::Google.Protobuf.WellKnownTypes.Empty, global::Plexus.Interop.Apps.Internal.Generated.Context>(Id, CreateContextMethodId);
				CreateContext2Method = Method.Unary<global::Plexus.Interop.Apps.Internal.Generated.CreateContextRequest, global::Plexus.Interop.Apps.Internal.Generated.Context>(Id, CreateContext2MethodId);
				JoinContextMethod = Method.Unary<global::Plexus.Interop.Apps.Internal.Generated.Context, global::Google.Protobuf.WellKnownTypes.Empty>(Id, JoinContextMethodId);
				GetContextsMethod = Method.Unary<global::Google.Protobuf.WellKnownTypes.Empty, global::Plexus.Interop.Apps.Internal.Generated.ContextsList>(Id, GetContextsMethodId);
				GetLinkedInvocationsMethod = Method.Unary<global::Plexus.Interop.Apps.Internal.Generated.Context, global::Plexus.Interop.Apps.Internal.Generated.InvocationsList>(Id, GetLinkedInvocationsMethodId);
				GetAllLinkedInvocationsMethod = Method.Unary<global::Google.Protobuf.WellKnownTypes.Empty, global::Plexus.Interop.Apps.Internal.Generated.ContextToInvocationsList>(Id, GetAllLinkedInvocationsMethodId);
				AppJoinedContextStreamMethod = Method.ServerStreaming<global::Google.Protobuf.WellKnownTypes.Empty, global::Plexus.Interop.Apps.Internal.Generated.AppJoinedContextEvent>(Id, AppJoinedContextStreamMethodId);
				RestoreContextsLinkageMethod = Method.Unary<global::Plexus.Interop.Apps.Internal.Generated.RestoreContextsLinkageRequest, global::Plexus.Interop.Apps.Internal.Generated.RestoreContextsLinkageResponse>(Id, RestoreContextsLinkageMethodId);
			}
		
			public Descriptor(string alias) {
				ContextLoadedStreamMethod = Method.ServerStreaming<global::Plexus.Interop.Apps.Internal.Generated.Context, global::Plexus.Interop.Apps.Internal.Generated.ContextLoadingUpdate>(Id, alias, ContextLoadedStreamMethodId);
				CreateContextMethod = Method.Unary<global::Google.Protobuf.WellKnownTypes.Empty, global::Plexus.Interop.Apps.Internal.Generated.Context>(Id, alias, CreateContextMethodId);
				CreateContext2Method = Method.Unary<global::Plexus.Interop.Apps.Internal.Generated.CreateContextRequest, global::Plexus.Interop.Apps.Internal.Generated.Context>(Id, alias, CreateContext2MethodId);
				JoinContextMethod = Method.Unary<global::Plexus.Interop.Apps.Internal.Generated.Context, global::Google.Protobuf.WellKnownTypes.Empty>(Id, alias, JoinContextMethodId);
				GetContextsMethod = Method.Unary<global::Google.Protobuf.WellKnownTypes.Empty, global::Plexus.Interop.Apps.Internal.Generated.ContextsList>(Id, alias, GetContextsMethodId);
				GetLinkedInvocationsMethod = Method.Unary<global::Plexus.Interop.Apps.Internal.Generated.Context, global::Plexus.Interop.Apps.Internal.Generated.InvocationsList>(Id, alias, GetLinkedInvocationsMethodId);
				GetAllLinkedInvocationsMethod = Method.Unary<global::Google.Protobuf.WellKnownTypes.Empty, global::Plexus.Interop.Apps.Internal.Generated.ContextToInvocationsList>(Id, alias, GetAllLinkedInvocationsMethodId);
				AppJoinedContextStreamMethod = Method.ServerStreaming<global::Google.Protobuf.WellKnownTypes.Empty, global::Plexus.Interop.Apps.Internal.Generated.AppJoinedContextEvent>(Id, alias, AppJoinedContextStreamMethodId);
				RestoreContextsLinkageMethod = Method.Unary<global::Plexus.Interop.Apps.Internal.Generated.RestoreContextsLinkageRequest, global::Plexus.Interop.Apps.Internal.Generated.RestoreContextsLinkageResponse>(Id, alias, RestoreContextsLinkageMethodId);
			}
		}
	}
					
}
#endregion Designer generated code
