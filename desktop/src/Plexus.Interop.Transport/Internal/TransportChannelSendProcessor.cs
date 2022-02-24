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
 namespace Plexus.Interop.Transport.Internal
{
    using Plexus.Channels;
    using Plexus.Interop.Protocol.Common;
    using Plexus.Interop.Transport.Protocol;
    using Plexus.Pools;
    using System;
    using System.Threading.Tasks;

    internal sealed class TransportChannelSendProcessor
    {
        private readonly ILogger _log;
        private readonly IChannel<TransportMessageFrame> _buffer = new BufferedChannel<TransportMessageFrame>(3);
        private readonly IWritableChannel<ChannelMessage> _out;
        private readonly IChannelHeaderFactory _headerFactory;
        private readonly Promise _initialized = new Promise();

        public TransportChannelSendProcessor(
            UniqueId connectionId,
            UniqueId channelId,
            IWritableChannel<ChannelMessage> @out,
            IChannelHeaderFactory headerFactory)
        {
            ChannelId = channelId;
            _log = LogManager.GetLogger<TransportChannelSendProcessor>($"{connectionId.ToString()}.{channelId.ToString()}");
            _headerFactory = headerFactory;
            _out = @out;
            _buffer.Out.PropagateTerminationFrom(_out.Completion);
            Completion = ProcessAsync().LogCompletion(_log);
            Completion.PropagateCompletionToPromise(_initialized);
        }

        public UniqueId ChannelId { get; }

        public Task Completion { get; }

        public ITerminatableWritableChannel<TransportMessageFrame> Out => _buffer.Out;

        internal Task Initialized => _initialized.Task;

        private async Task ProcessAsync()
        {
            try
            {
                _log.Trace("Starting sending");
                await SendOpenMessageAsync().ConfigureAwait(false);
                _initialized.TryComplete();
                await _buffer.In.ConsumeAsync(SendAsync).ConfigureAwait(false);                
                await SendCloseMessageAsync().ConfigureAwait(false);
                _log.Trace("Sending completed");
            }
            catch (Exception ex)
            {                              
                _buffer.Out.TryTerminate(ex);
                _buffer.In.DisposeBufferedItems();
                await SendCloseMessageAsync(ex).IgnoreExceptions().ConfigureAwait(false);
                _log.Trace("Sending failed: {0}", ex.FormatTypeAndMessage());
                throw;
            }            
        }

        private async Task SendOpenMessageAsync()
        {
            var openHeader = _headerFactory.CreateChannelOpenHeader(ChannelId);
            await SendAsync(openHeader).ConfigureAwait(false);
        }

        private Task SendAsync(ITransportChannelHeader header, IPooledBuffer body) => SendAsync(header, new Maybe<IPooledBuffer>(body));

        private async Task SendAsync(ITransportChannelHeader header, Maybe<IPooledBuffer> body = default)
        {
            try
            {
                _log.Trace("Sending: {0} with body {1}", header, body);
                await _out.WriteAsync(new ChannelMessage(header, body)).ConfigureAwait(false);
            }
            catch
            {
                header.Dispose();
                if (body.HasValue)
                {
                    body.Value.Dispose();
                }
                throw;
            }
        }

        private async Task SendCloseMessageAsync(Exception error = null)
        {
            var closeHeader = _headerFactory.CreateChannelCloseHeader(
                ChannelId,
                error == null
                    ? CompletionHeader.Completed
                    : error is OperationCanceledException
                        ? CompletionHeader.Canceled
                        : CompletionHeader.Failed(GetErrorHeader(error)));
            await SendAsync(closeHeader).ConfigureAwait(false);
        }

        private static ErrorHeader GetErrorHeader(Exception error)
        {
            var message = error is RemoteErrorException remoteError ? remoteError.RemoteMessage : error.Message;
            return new ErrorHeader(message, error.FormatToString());
        }

        private async Task SendAsync(TransportMessageFrame frame)
        {
            var header = _headerFactory.CreateFrameHeader(ChannelId, frame.HasMore, frame.Payload.Count);
            await SendAsync(header, frame.Payload).ConfigureAwait(false);
        }
    }
}
