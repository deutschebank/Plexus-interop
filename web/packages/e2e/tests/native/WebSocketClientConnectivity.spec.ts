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
import { assert, expect } from 'chai';

import { WebSocketConnectionFactory } from '@plexus-interop/websocket-transport';

import { EchoClientClientBuilder } from '../../src/echo/client/EchoClientGeneratedClient';
import { ClientsSetup } from '../common/ClientsSetup';
import { TransportsSetup } from '../common/TransportsSetup';
import { readWsUrl } from '../common/utils';
import { ClientConnectivityTests } from '../echo/ClientConnectivityTests';

describe('Web Socket Client connectivity', () => {
  const clientsSetup = new ClientsSetup();
  const transportsSetup = new TransportsSetup();
  const wsUrl = readWsUrl();

  const connectivityTests = new ClientConnectivityTests(
    transportsSetup.createWebSocketTransportProvider(wsUrl),
    clientsSetup
  );

  it('Can receive WS URL from Broker', () => {
    expect(wsUrl).is.not.empty;
  });

  it('Can connect/disconnect from running Broker instance', function (done) {
    this.timeout(5000);
    let wsUrl = readWsUrl();
    clientsSetup.createEchoClient(transportsSetup.createWebSocketTransportProvider(wsUrl)).then((client) => {
      expect(client).to.not.be.undefined;
      client.disconnect().then(() => {
        done();
      });
    });
  });

  it('Connects when second connect is successfull', (done) => {
    const wsUrl = readWsUrl();
    const provider = transportsSetup.createWebSocketTransportProvider(wsUrl);
    let count = 0;
    const failAndSuccessProvider = () => {
      if (count === 0) {
        count++;
        return Promise.reject('Failed');
      } else {
        return provider().then((setup) => setup.getConnection());
      }
    };
    new EchoClientClientBuilder()
      .withTransportConnectionProvider(failAndSuccessProvider)
      .connect()
      .then((client) => {
        expect(client).to.not.be.undefined;
        client.disconnect().then(() => {
          done();
        });
      });
  });

  it('Failed to connect if Web Socket server is not available', function (done) {
    this.timeout(10000);
    new EchoClientClientBuilder()
      .withTransportConnectionProvider(() =>
        new WebSocketConnectionFactory(new WebSocket('ws://127.0.0.1:11111')).connect()
      )
      .connect()
      .catch((e) => {
        console.log('Connection error', e);
        done();
      });
  });

  it('Received error for open invocation on disconnect', function () {
    return connectivityTests.testInvocationClientReceiveErrorOnClientDisconnect();
  });

  it('Receives error if provide wrong client id to Broker', () =>
    connectivityTests
      .testClientReceiveErrorIfProvideWrongId()
      .then(() => {
        assert.fail('Should have errored');
      })
      .catch((e) => {
        expect(e.message).to.match(/doesn't exist/);
      }));

  it('Server receives error if client dropped connection', function () {
    return connectivityTests.testServerReceivesErrorIfClientDroppedConnection();
  });

  it('Client receives error if server dropped connection', function () {
    return connectivityTests.testClientReceivesErrorIfServerDroppedConnection();
  });
});
