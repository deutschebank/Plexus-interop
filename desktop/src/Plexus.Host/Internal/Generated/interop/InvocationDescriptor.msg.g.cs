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
// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: interop/invocation_descriptor.proto
// </auto-generated>
#pragma warning disable 1591, 0612, 3021
#region Designer generated code

using pb = global::Google.Protobuf;
using pbc = global::Google.Protobuf.Collections;
using pbr = global::Google.Protobuf.Reflection;
using scg = global::System.Collections.Generic;
namespace Plexus.Host.Internal.Generated {

  /// <summary>Holder for reflection information generated from interop/invocation_descriptor.proto</summary>
  internal static partial class InvocationDescriptorReflection {

    #region Descriptor
    /// <summary>File descriptor for interop/invocation_descriptor.proto</summary>
    public static pbr::FileDescriptor Descriptor {
      get { return descriptor; }
    }
    private static pbr::FileDescriptor descriptor;

    static InvocationDescriptorReflection() {
      byte[] descriptorData = global::System.Convert.FromBase64String(
          string.Concat(
            "CiNpbnRlcm9wL2ludm9jYXRpb25fZGVzY3JpcHRvci5wcm90bxIHaW50ZXJv",
            "cBonaW50ZXJvcC9hcHBfY29ubmVjdGlvbl9kZXNjcmlwdG9yLnByb3RvGhVp",
            "bnRlcm9wL29wdGlvbnMucHJvdG8i3QEKFEludm9jYXRpb25EZXNjcmlwdG9y",
            "EhIKCnNlcnZpY2VfaWQYASABKAkSGAoQc2VydmljZV9hbGlhc19pZBgCIAEo",
            "CRIRCgltZXRob2RfaWQYAyABKAkSMAoGc291cmNlGAQgASgLMiAuaW50ZXJv",
            "cC5BcHBDb25uZWN0aW9uRGVzY3JpcHRvchIwCgZ0YXJnZXQYBSABKAsyIC5p",
            "bnRlcm9wLkFwcENvbm5lY3Rpb25EZXNjcmlwdG9yOiCS2wQcaW50ZXJvcC5J",
            "bnZvY2F0aW9uRGVzY3JpcHRvckIhqgIeUGxleHVzLkhvc3QuSW50ZXJuYWwu",
            "R2VuZXJhdGVkYgZwcm90bzM="));
      descriptor = pbr::FileDescriptor.FromGeneratedCode(descriptorData,
          new pbr::FileDescriptor[] { global::Plexus.Host.Internal.Generated.AppConnectionDescriptorReflection.Descriptor, global::Plexus.Host.Internal.Generated.OptionsReflection.Descriptor, },
          new pbr::GeneratedClrTypeInfo(null, null, new pbr::GeneratedClrTypeInfo[] {
            new pbr::GeneratedClrTypeInfo(typeof(global::Plexus.Host.Internal.Generated.InvocationDescriptor), global::Plexus.Host.Internal.Generated.InvocationDescriptor.Parser, new[]{ "ServiceId", "ServiceAliasId", "MethodId", "Source", "Target" }, null, null, null, null)
          }));
    }
    #endregion

  }
  #region Messages
  internal sealed partial class InvocationDescriptor : pb::IMessage<InvocationDescriptor>
  #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
      , pb::IBufferMessage
  #endif
  {
    private static readonly pb::MessageParser<InvocationDescriptor> _parser = new pb::MessageParser<InvocationDescriptor>(() => new InvocationDescriptor());
    private pb::UnknownFieldSet _unknownFields;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public static pb::MessageParser<InvocationDescriptor> Parser { get { return _parser; } }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public static pbr::MessageDescriptor Descriptor {
      get { return global::Plexus.Host.Internal.Generated.InvocationDescriptorReflection.Descriptor.MessageTypes[0]; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    pbr::MessageDescriptor pb::IMessage.Descriptor {
      get { return Descriptor; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public InvocationDescriptor() {
      OnConstruction();
    }

    partial void OnConstruction();

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public InvocationDescriptor(InvocationDescriptor other) : this() {
      serviceId_ = other.serviceId_;
      serviceAliasId_ = other.serviceAliasId_;
      methodId_ = other.methodId_;
      source_ = other.source_ != null ? other.source_.Clone() : null;
      target_ = other.target_ != null ? other.target_.Clone() : null;
      _unknownFields = pb::UnknownFieldSet.Clone(other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public InvocationDescriptor Clone() {
      return new InvocationDescriptor(this);
    }

    /// <summary>Field number for the "service_id" field.</summary>
    public const int ServiceIdFieldNumber = 1;
    private string serviceId_ = "";
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public string ServiceId {
      get { return serviceId_; }
      set {
        serviceId_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }

    /// <summary>Field number for the "service_alias_id" field.</summary>
    public const int ServiceAliasIdFieldNumber = 2;
    private string serviceAliasId_ = "";
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public string ServiceAliasId {
      get { return serviceAliasId_; }
      set {
        serviceAliasId_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }

    /// <summary>Field number for the "method_id" field.</summary>
    public const int MethodIdFieldNumber = 3;
    private string methodId_ = "";
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public string MethodId {
      get { return methodId_; }
      set {
        methodId_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }

    /// <summary>Field number for the "source" field.</summary>
    public const int SourceFieldNumber = 4;
    private global::Plexus.Host.Internal.Generated.AppConnectionDescriptor source_;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public global::Plexus.Host.Internal.Generated.AppConnectionDescriptor Source {
      get { return source_; }
      set {
        source_ = value;
      }
    }

    /// <summary>Field number for the "target" field.</summary>
    public const int TargetFieldNumber = 5;
    private global::Plexus.Host.Internal.Generated.AppConnectionDescriptor target_;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public global::Plexus.Host.Internal.Generated.AppConnectionDescriptor Target {
      get { return target_; }
      set {
        target_ = value;
      }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public override bool Equals(object other) {
      return Equals(other as InvocationDescriptor);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public bool Equals(InvocationDescriptor other) {
      if (ReferenceEquals(other, null)) {
        return false;
      }
      if (ReferenceEquals(other, this)) {
        return true;
      }
      if (ServiceId != other.ServiceId) return false;
      if (ServiceAliasId != other.ServiceAliasId) return false;
      if (MethodId != other.MethodId) return false;
      if (!object.Equals(Source, other.Source)) return false;
      if (!object.Equals(Target, other.Target)) return false;
      return Equals(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public override int GetHashCode() {
      int hash = 1;
      if (ServiceId.Length != 0) hash ^= ServiceId.GetHashCode();
      if (ServiceAliasId.Length != 0) hash ^= ServiceAliasId.GetHashCode();
      if (MethodId.Length != 0) hash ^= MethodId.GetHashCode();
      if (source_ != null) hash ^= Source.GetHashCode();
      if (target_ != null) hash ^= Target.GetHashCode();
      if (_unknownFields != null) {
        hash ^= _unknownFields.GetHashCode();
      }
      return hash;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public override string ToString() {
      return pb::JsonFormatter.ToDiagnosticString(this);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public void WriteTo(pb::CodedOutputStream output) {
    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
      output.WriteRawMessage(this);
    #else
      if (ServiceId.Length != 0) {
        output.WriteRawTag(10);
        output.WriteString(ServiceId);
      }
      if (ServiceAliasId.Length != 0) {
        output.WriteRawTag(18);
        output.WriteString(ServiceAliasId);
      }
      if (MethodId.Length != 0) {
        output.WriteRawTag(26);
        output.WriteString(MethodId);
      }
      if (source_ != null) {
        output.WriteRawTag(34);
        output.WriteMessage(Source);
      }
      if (target_ != null) {
        output.WriteRawTag(42);
        output.WriteMessage(Target);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(output);
      }
    #endif
    }

    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    void pb::IBufferMessage.InternalWriteTo(ref pb::WriteContext output) {
      if (ServiceId.Length != 0) {
        output.WriteRawTag(10);
        output.WriteString(ServiceId);
      }
      if (ServiceAliasId.Length != 0) {
        output.WriteRawTag(18);
        output.WriteString(ServiceAliasId);
      }
      if (MethodId.Length != 0) {
        output.WriteRawTag(26);
        output.WriteString(MethodId);
      }
      if (source_ != null) {
        output.WriteRawTag(34);
        output.WriteMessage(Source);
      }
      if (target_ != null) {
        output.WriteRawTag(42);
        output.WriteMessage(Target);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(ref output);
      }
    }
    #endif

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public int CalculateSize() {
      int size = 0;
      if (ServiceId.Length != 0) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(ServiceId);
      }
      if (ServiceAliasId.Length != 0) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(ServiceAliasId);
      }
      if (MethodId.Length != 0) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(MethodId);
      }
      if (source_ != null) {
        size += 1 + pb::CodedOutputStream.ComputeMessageSize(Source);
      }
      if (target_ != null) {
        size += 1 + pb::CodedOutputStream.ComputeMessageSize(Target);
      }
      if (_unknownFields != null) {
        size += _unknownFields.CalculateSize();
      }
      return size;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public void MergeFrom(InvocationDescriptor other) {
      if (other == null) {
        return;
      }
      if (other.ServiceId.Length != 0) {
        ServiceId = other.ServiceId;
      }
      if (other.ServiceAliasId.Length != 0) {
        ServiceAliasId = other.ServiceAliasId;
      }
      if (other.MethodId.Length != 0) {
        MethodId = other.MethodId;
      }
      if (other.source_ != null) {
        if (source_ == null) {
          Source = new global::Plexus.Host.Internal.Generated.AppConnectionDescriptor();
        }
        Source.MergeFrom(other.Source);
      }
      if (other.target_ != null) {
        if (target_ == null) {
          Target = new global::Plexus.Host.Internal.Generated.AppConnectionDescriptor();
        }
        Target.MergeFrom(other.Target);
      }
      _unknownFields = pb::UnknownFieldSet.MergeFrom(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    public void MergeFrom(pb::CodedInputStream input) {
    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
      input.ReadRawMessage(this);
    #else
      uint tag;
      while ((tag = input.ReadTag()) != 0) {
        switch(tag) {
          default:
            _unknownFields = pb::UnknownFieldSet.MergeFieldFrom(_unknownFields, input);
            break;
          case 10: {
            ServiceId = input.ReadString();
            break;
          }
          case 18: {
            ServiceAliasId = input.ReadString();
            break;
          }
          case 26: {
            MethodId = input.ReadString();
            break;
          }
          case 34: {
            if (source_ == null) {
              Source = new global::Plexus.Host.Internal.Generated.AppConnectionDescriptor();
            }
            input.ReadMessage(Source);
            break;
          }
          case 42: {
            if (target_ == null) {
              Target = new global::Plexus.Host.Internal.Generated.AppConnectionDescriptor();
            }
            input.ReadMessage(Target);
            break;
          }
        }
      }
    #endif
    }

    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    [global::System.CodeDom.Compiler.GeneratedCode("protoc", null)]
    void pb::IBufferMessage.InternalMergeFrom(ref pb::ParseContext input) {
      uint tag;
      while ((tag = input.ReadTag()) != 0) {
        switch(tag) {
          default:
            _unknownFields = pb::UnknownFieldSet.MergeFieldFrom(_unknownFields, ref input);
            break;
          case 10: {
            ServiceId = input.ReadString();
            break;
          }
          case 18: {
            ServiceAliasId = input.ReadString();
            break;
          }
          case 26: {
            MethodId = input.ReadString();
            break;
          }
          case 34: {
            if (source_ == null) {
              Source = new global::Plexus.Host.Internal.Generated.AppConnectionDescriptor();
            }
            input.ReadMessage(Source);
            break;
          }
          case 42: {
            if (target_ == null) {
              Target = new global::Plexus.Host.Internal.Generated.AppConnectionDescriptor();
            }
            input.ReadMessage(Target);
            break;
          }
        }
      }
    }
    #endif

  }

  #endregion

}

#endregion Designer generated code
