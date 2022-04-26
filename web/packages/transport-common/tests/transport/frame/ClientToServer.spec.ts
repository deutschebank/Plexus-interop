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

/* eslint-disable no-promise-executor-return, @typescript-eslint/no-use-before-define, no-console */
import { Unsubscribable as AnonymousSubscription } from 'rxjs';

import { DelegateChannelObserver } from '../../../src/common/DelegateChannelObserver';
import { TransportChannel } from '../../../src/transport/TransportChannel';
import { TransportConnection } from '../../../src/transport/TransportConnection';
import { BufferedObserver } from '../../BufferedObserver';
import { LogObserver } from '../../LogObserver';
import { randomPayload } from '../../utils';
import { disconnect, setupConnections } from '../transport-mocks';

describe('Framed Transport Connection: Client to Server communication', () => {
  it('Sends message from server to client', async () => {
    const { client, server, clientChannelsObserver, serverChannelsObserver } = await setupConnections();
    await sendReceiveAndVerify(client, server, clientChannelsObserver, serverChannelsObserver, randomPayload(3));
    await disconnect(client, server);
  });

  it('Can connect client and server', async () => {
    const { client, server } = await setupConnections();
    expect(client).toBeDefined();
    expect(server).toBeDefined();
    await disconnect(client, server);
  });

  it('Can send big message', async () => {
    const { client, server, clientChannelsObserver, serverChannelsObserver } = await setupConnections();
    const payload = randomPayload(2 * 1024);
    await sendReceiveAndVerify(client, server, clientChannelsObserver, serverChannelsObserver, payload);
    await disconnect(client, server);
  });

  it('Can send messages with different length in a row', async () => {
    const { client, server, clientChannelsObserver, serverChannelsObserver } = await setupConnections();
    await sendReceiveAndVerifyAll(client, server, clientChannelsObserver, serverChannelsObserver, [
      randomPayload(1),
      randomPayload(5),
      randomPayload(10),
    ]);
    await disconnect(client, server);
  });

  it('Can continue to send messages even if remote channel requested close', async () => {
    const { client, server, serverChannelsObserver } = await setupConnections();

    const clientChannel = await client.createChannel();

    const payload = new ArrayBuffer(3);

    await new Promise<AnonymousSubscription>((resolve) =>
      clientChannel.open(
        new DelegateChannelObserver(new LogObserver(undefined, clientChannel.uuid()), (s) => resolve(s))
      )
    );

    // sever channel opened
    const serverChannel = await serverChannelsObserver.pullData();
    const observer = new BufferedObserver<ArrayBuffer>();
    await new Promise<AnonymousSubscription>((resolve) =>
      serverChannel.open(new DelegateChannelObserver(observer, (s) => resolve(s)))
    );

    // server channel close requested
    const serverChClosed = serverChannel.close();

    clientChannel.sendMessage(payload);
    const received = await observer.pullData();

    expect(new Uint8Array(payload)).toEqual(new Uint8Array(received));
    const clientChClosed = clientChannel.close();
    await clientChClosed;
    await serverChClosed;
    await disconnect(client, server);

    return new Promise((resolve) => setTimeout(resolve, 1000));
  });

  async function sendReceiveAndVerify(
    clientConnection: TransportConnection,
    serverConnection: TransportConnection,
    clientChannelsObserver: BufferedObserver<TransportChannel>,
    serverChannelsObserver: BufferedObserver<TransportChannel>,
    payload: ArrayBuffer
  ): Promise<void> {
    console.log('Creating channel');
    const clientChannel = await clientConnection.createChannel();
    console.log('Created channel');
    await new Promise<AnonymousSubscription>((resolve) =>
      clientChannel.open(
        new DelegateChannelObserver(new LogObserver(undefined, clientChannel.uuid()), (s) => {
          console.log('Client channel created');
          resolve(s);
        })
      )
    );
    console.log('Client channel created');

    await clientChannel.sendMessage(payload);
    console.log('Client sent message');

    const serverChannel = await serverChannelsObserver.pullData();
    console.log('Waiting for server chanel channel');

    const observer = new BufferedObserver<ArrayBuffer>();
    serverChannel.open(new DelegateChannelObserver(observer, () => {}));
    const received = await observer.pullData();
    expect(new Uint8Array(payload)).toEqual(new Uint8Array(received));
    const clientChClosed = clientChannel.close();
    const serverChClosed = serverChannel.close();
    await clientChClosed;
    await serverChClosed;
  }

  async function sendReceiveAndVerifyAll(
    clientConnection: TransportConnection,
    serverConnection: TransportConnection,
    clientChannelsObserver: BufferedObserver<TransportChannel>,
    serverChannelsObserver: BufferedObserver<TransportChannel>,
    payloads: ArrayBuffer[]
  ): Promise<void> {
    const clientChannel = await clientConnection.createChannel();
    new Promise<AnonymousSubscription>((resolve) =>
      clientChannel.open(
        new DelegateChannelObserver(new LogObserver(undefined, clientChannel.uuid()), (s) => resolve(s))
      )
    ).then(() => {
      payloads.forEach((payload) => clientChannel.sendMessage(payload));
    });

    const serverChannel = await serverChannelsObserver.pullData();

    const observer = new BufferedObserver<ArrayBuffer>();
    await new Promise<void>((resolve) => serverChannel.open(new DelegateChannelObserver(observer, () => resolve())));

    // eslint-disable-next-line no-restricted-syntax
    for (const payload of payloads) {
      // eslint-disable-next-line no-await-in-loop
      const received = await observer.pullData();
      expect(new Uint8Array(payload)).toEqual(new Uint8Array(received));
    }
    const clientChClosed = clientChannel.close();
    const serverChClosed = serverChannel.close();
    await clientChClosed;
    await serverChClosed;
  }
});
