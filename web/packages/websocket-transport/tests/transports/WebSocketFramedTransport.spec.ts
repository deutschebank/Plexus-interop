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
import { ChannelOpenFrame, InternalMessagesConverter, MessageFrame, UniqueId } from '@plexus-interop/transport-common';

import { WebSocketFramedTransport } from '../../src/transport/WebSocketFramedTransport';

const MockSocket = require('mock-socket');
const getPort = require('get-port');

const portNumbers = getPort.makeRange;

const { Server } = MockSocket;
const MockWebSocket = MockSocket.WebSocket;

describe('WebSocketFramedTransport', () => {
  const messagesConverter = new InternalMessagesConverter();
  let connectionUrl: string | null = null;

  let mockServer: any = null;

  beforeEach(async () => {
    const port = await getPort({
      host: 'localhost',
      port: portNumbers(8000, 8015),
    });
    connectionUrl = `ws://localhost:${port}`;
    mockServer = new Server(connectionUrl);
    mockServer.on('connection', () => {});
  });

  afterEach((done) => {
    mockServer.stop(() => {
      done();
    });
  });

  const newMockSocket = () => new MockWebSocket(connectionUrl);
  const newMockedTransport = () => new WebSocketFramedTransport(newMockSocket());

  it('Connects to socket after creation', () => newMockedTransport().connectionEstablished());

  it('Transmits header frames with Array Buffer view type', (done) => {
    const transport = newMockedTransport();
    transport.connectionEstablished().then(() => {
      const frame = ChannelOpenFrame.fromHeaderData({ channelId: UniqueId.generateNew() });
      mockServer.send(new Uint8Array(messagesConverter.serialize(frame)));
      transport.open({
        next: (nextFrame) => {
          const channelFrame = nextFrame as ChannelOpenFrame;
          expect(nextFrame).toBeDefined();
          expect(channelFrame).toEqual(nextFrame);
          done();
        },
        complete: () => {},
        error: () => {},
      });
    });
  });

  it('Transmits header frames with Array Buffer type', (done) => {
    const transport = newMockedTransport();
    transport.connectionEstablished().then(() => {
      const frame = ChannelOpenFrame.fromHeaderData({ channelId: UniqueId.generateNew() });
      mockServer.send(messagesConverter.serialize(frame));
      transport.open({
        next: (receivedFrame) => {
          const channelFrame = receivedFrame as ChannelOpenFrame;
          expect(receivedFrame).toBeDefined();
          expect(channelFrame).toEqual(frame);
          done();
        },
        complete: () => {},
        error: () => {},
      });
    });
  });

  it('Fails on to open connection after disconnect', (done) => {
    const transport = newMockedTransport();
    transport.connectionEstablished().then(() => {
      transport.disconnect().then(() => {
        transport
          .open({
            next: () => {},
            complete: () => {},
            error: () => {},
          })
          .catch(() => done());
      });
    });
  });

  it('Fails on writing frame after disconnect', (done) => {
    const transport = newMockedTransport();
    transport.connectionEstablished().then(() => {
      transport.disconnect().then(() => {
        const frame = ChannelOpenFrame.fromHeaderData({ channelId: UniqueId.generateNew() });
        transport.writeFrame(frame).catch(() => done());
      });
    });
  });

  it('Sends terminate message to server on disconnent action', (done) => {
    const transport = newMockedTransport();
    transport.connectionEstablished().then(() => {
      mockServer.on('message', (data: any) => {
        expect(data).toEqual(WebSocketFramedTransport.TERMINATE_MESSAGE);
        done();
      });
      transport.disconnect();
    });
  });

  it('Transmits frame to client with data payload', (done) => {
    const transport = newMockedTransport();
    transport.connectionEstablished().then(() => {
      const messageHeaderFrame = MessageFrame.fromHeaderData({
        channelId: UniqueId.generateNew(),
        hasMore: false,
      });
      const payload = new Uint8Array([1, 2, 3]);
      mockServer.send(messagesConverter.serialize(messageHeaderFrame));
      mockServer.send(payload);
      transport.open({
        next: (receivedFrame) => {
          expect(receivedFrame).toBeDefined();
          const receivedMessageFrame: MessageFrame = receivedFrame as MessageFrame;
          expect(receivedMessageFrame.getHeaderData()).toEqual(messageHeaderFrame.getHeaderData());
          expect(receivedFrame.body).toBeDefined();
          done();
        },
        complete: () => {},
        error: () => {},
      });
    });
  });

  it('Transmits frame to server', (done) => {
    const transport = newMockedTransport();
    transport.connectionEstablished().then(() => {
      const frame = ChannelOpenFrame.fromHeaderData({ channelId: UniqueId.generateNew() });
      mockServer.on('message', (data: any) => {
        const received = messagesConverter.deserialize(new Uint8Array(data));
        expect(received).toEqual(frame);
        done();
      });
      transport.writeFrame(frame);
    });
  });

  it('Closes connection if server closed it', (done) => {
    const transport = newMockedTransport();
    mockServer.on('connection', () => {
      mockServer.close();
      setTimeout(() => {
        expect(transport.connected()).toEqual(false);
        transport
          .open({
            next: () => {},
            complete: () => {},
            error: () => {},
          })
          .catch(() => done());
      }, 0);
    });
  });
});
