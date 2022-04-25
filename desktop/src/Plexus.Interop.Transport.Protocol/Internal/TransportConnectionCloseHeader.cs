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
﻿using Plexus.Pools;
using System.Collections.Generic;
using Plexus.Interop.Protocol.Common;

namespace Plexus.Interop.Transport.Protocol.Internal
{
    internal sealed class TransportConnectionCloseHeader : PooledObject<TransportConnectionCloseHeader>, ITransportConnectionCloseHeader
    {
        public CompletionHeader Completion { get; set; }

        public override bool Equals(object obj)
        {
            var header = obj as TransportConnectionCloseHeader;
            return header != null &&
                   EqualityComparer<CompletionHeader>.Default.Equals(Completion, header.Completion);
        }

        public override int GetHashCode()
        {
            return 418588383 + EqualityComparer<CompletionHeader>.Default.GetHashCode(Completion);
        }

        public T Handle<T, TArgs>(TransportConnectionHeaderHandler<T, TArgs> handler, TArgs args = default)
        {
            return handler.Handle(this, args);
        }

        public T Handle<T, TArgs>(TransportHeaderHandler<T, TArgs> handler, TArgs args = default)
        {
            return handler.Handle(this, args);
        }

        public override string ToString()
        {
            return $"{{Type: {typeof(TransportConnectionCloseHeader).Name}, {nameof(Completion)}: {Completion.ToString()}}}";
        }

        protected override void Cleanup()
        {
            Completion = default;
        }
    }
}
