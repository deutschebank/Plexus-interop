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
namespace Plexus.Interop.Transport.Transmission.Streams
{
    using Plexus.Channels;
    using Plexus.Interop.Transport.Transmission.Streams.Internal;
    using Plexus.Pools;
    using System;
    using System.IO;
    using System.Threading;
    using System.Threading.Tasks;

    public sealed class StreamTransmissionConnection : ITransmissionConnection
    {
        public static async ValueTask<ITransmissionConnection> CreateAsync(UniqueId id, Func<ValueTask<Stream>> streamFactory)
        {
            var result = await streamFactory().ConfigureAwait(false);
            return new StreamTransmissionConnection(id, result);
        }

        private readonly ILogger _log;
        private readonly StreamTransmissionWriter _writer;
        private readonly StreamTransmissionReader _reader;
        private readonly Stream _stream;
        private readonly CancellationTokenSource _cancellation = new CancellationTokenSource();

        private StreamTransmissionConnection(UniqueId id, Stream stream)
        {
            Id = id;
            _log = LogManager.GetLogger<StreamTransmissionConnection>(id.ToString());
            _writer = new StreamTransmissionWriter(id, stream, _cancellation.Token);
            _reader = new StreamTransmissionReader(id, stream, _cancellation.Token);            
            _stream = stream;
            Out = _writer.Out;
            In = _reader.In;
            Completion = ProcessAsync().LogCompletion(_log);
        }

        public UniqueId Id { get; }

        public Task Completion { get; }

        public ITerminatableWritableChannel<IPooledBuffer> Out { get; }

        public IReadableChannel<IPooledBuffer> In { get; }

        private async Task ProcessAsync()
        {
            using (_stream)
            {
                var writerCompletion = GetWriterCompletion();
                var readerCompletion = GetReaderCompletion();
                try
                {
                    await Task.WhenAny(writerCompletion, readerCompletion).Unwrap().ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    _log.Warn(ex, $"Caught exception during {nameof(ProcessAsync)}");
                    _cancellation.Cancel();
                    throw;
                }
                await Task.WhenAll(writerCompletion, readerCompletion).ConfigureAwait(false);
                _log.Trace("Processing completed. Disposing stream.");
            }
        }

        private async Task GetReaderCompletion()
        {
            try
            {
                await _reader.In.Completion;
            }
            catch (Exception ex)
            {
                _log.Warn(ex, $"Caught exception during {nameof(GetReaderCompletion)}");
                throw;
            }
        }

        private async Task GetWriterCompletion()
        {
            try
            {
                await _writer.Completion;
            }
            catch (Exception ex)
            {
                _log.Warn(ex, $"Caught exception during {nameof(GetWriterCompletion)}");
                throw;
            }
        }

        public async Task DisconnectAsync()
        {
            _log.Trace("Disconnecting");
            _cancellation.Cancel();
            await Completion.IgnoreExceptions().ConfigureAwait(false);
            _log.Trace("Disconnected");
        }

        public void Dispose()
        {
            _log.Trace("Disposing");
            DisconnectAsync().GetResult();
        }

        public override string ToString()
        {
            return $"{{{nameof(Id)}: {Id}, Type: {GetType()}}}";
        }
    }
}
