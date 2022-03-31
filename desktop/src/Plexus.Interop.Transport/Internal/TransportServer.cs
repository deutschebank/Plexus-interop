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
    using System.Threading.Tasks;
    using Plexus.Channels;
    using Plexus.Interop.Transport.Protocol.Serialization;
    using Plexus.Interop.Transport.Transmission;
    using Plexus.Processes;

    internal sealed class TransportServer : ProcessBase, ITransportServer
    {
        private readonly ITransmissionServer _transmissionServer;
        private readonly TransportConnectionFactory _connectionFactory;
        private readonly BufferedChannel<ITransportConnection> _buffer = new BufferedChannel<ITransportConnection>(1);

        public TransportServer(
            TransportType transportType,
            ITransmissionServer transmissionServer,
            ITransportProtocolSerializationProvider serializationProvider)
        {
            _connectionFactory = new TransportConnectionFactory(transportType, serializationProvider);
            _transmissionServer = transmissionServer;
            _buffer.Out.PropagateCompletionFrom(Completion);
            OnStop(_transmissionServer.Stop);
        }

        protected override ILogger Log { get; } = LogManager.GetLogger<TransportServer>();

        public IReadableChannel<ITransportConnection> In => _buffer.In;

        protected override async Task<Task> StartCoreAsync()
        {
            await _transmissionServer.StartAsync().ConfigureAwait(false);
            return ProcessAsync();
        }

        private async Task ProcessAsync()
        {
            await _transmissionServer.In.ConsumeAsync(AcceptAsync).ConfigureAwait(false);
            Log.Debug("Transmission server completed");
        }

        private async Task AcceptAsync(ITransmissionConnection c)
        {            
            try
            {
                await _buffer.WriteAsync(_connectionFactory.Create(c), CancellationToken).ConfigureAwait(false);
                Log.Debug("New connection accepted");
            }
            catch
            {
                await c.DisconnectAsync().IgnoreExceptions().ConfigureAwait(false);
                throw;
            }
        }

        public override string ToString()
        {
            return $"Transmission server: {_transmissionServer.FormatObject()}";
        }
    }
}
