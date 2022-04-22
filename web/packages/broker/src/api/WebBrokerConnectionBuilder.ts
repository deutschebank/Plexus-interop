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
import { Logger, LoggerFactory } from '@plexus-interop/common';
import { AppRegistryProvider, AppRegistryService, InteropRegistryProvider } from '@plexus-interop/metadata';
import { InMemoryConnectionFactory, TransportConnection } from '@plexus-interop/transport-common';

import { Broker } from '../broker/Broker';
import { EventBus } from '../bus/EventBus';
import { AppLauncher } from '../launcher/AppLauncher';
import { AppLauncherRegistry } from '../launcher/AppLauncherRegistry';
import { HostConnectionFactory } from '../peers/host/HostConnectionFactory';
import { PeerAppLifeCycleManager } from '../peers/PeerAppLifeCycleManager';
import { PeerConnectionsService } from '../peers/PeerConnectionsService';
import { PeerServerConnectionFactory } from '../peers/PeerServerConnectionFactory';
import { EventBusRemoteBrokerService } from '../peers/remote/EventBusRemoteBrokerService';
import { RemoteBrokerService } from '../peers/remote/RemoteBrokerService';
import { MultiSourcesServerConnectionFactory } from '../transport/MultiSourcesServerConnectionFactory';
import { AppLifeCycleConfig } from './AppLifeCycleConfig';

export class WebBrokerConnectionBuilder {
  private readonly log: Logger = LoggerFactory.getLogger('WebBrokerConnectionBuilder');

  private appRegistryProviderFactory: () => Promise<AppRegistryProvider>;

  private interopRegistryProviderFactory: () => Promise<InteropRegistryProvider>;

  private eventBusProvider: () => Promise<EventBus>;

  private appLifeCycleConfig: AppLifeCycleConfig = { heartBitTtl: 5000, heartBitPeriod: 1500 };

  private readonly launcherRegistry: AppLauncherRegistry = new AppLauncherRegistry();

  public withAppLifeCycleConfig(config: AppLifeCycleConfig): WebBrokerConnectionBuilder {
    this.appLifeCycleConfig = config;
    return this;
  }

  public withAppLauncher(launcherId: string, launcher: AppLauncher): WebBrokerConnectionBuilder {
    this.launcherRegistry.registerAppLauncher(launcherId, launcher);
    return this;
  }

  public withEventBusProvider(provider: () => Promise<EventBus>): WebBrokerConnectionBuilder {
    this.eventBusProvider = provider;
    return this;
  }

  public withInteropRegistryProviderFactory(
    factory: () => Promise<InteropRegistryProvider>
  ): WebBrokerConnectionBuilder {
    this.interopRegistryProviderFactory = factory;
    return this;
  }

  public withAppRegistryProviderFactory(factory: () => Promise<AppRegistryProvider>): WebBrokerConnectionBuilder {
    this.appRegistryProviderFactory = factory;
    return this;
  }

  public async connect(): Promise<TransportConnection> {
    this.validate();

    this.log.info('Initialyzing App Registry Provider');
    const appRegistryProvider = await this.appRegistryProviderFactory();

    this.log.info('Initialyzing Interop Registry Provider');
    const interopRegistryProvider = await this.interopRegistryProviderFactory();
    const appRegistryService = new AppRegistryService(appRegistryProvider);

    const hostClientConnectionFactory = new InMemoryConnectionFactory();
    this.log.debug('Creating in memory host connection');
    const [hostClientConnection, hostServerConnection] = await hostClientConnectionFactory.connectBoth();
    const hostServerConnectionId = hostServerConnection.uuid().toString();
    const hostClientConnectionId = hostClientConnection.uuid().toString();

    this.log.info('Initialyzing Event Bus');
    const eventBus = await this.eventBusProvider();

    const remoteBrokerService: RemoteBrokerService = new EventBusRemoteBrokerService(eventBus, hostServerConnectionId);

    const peerConnectionService: PeerConnectionsService = new PeerConnectionsService(remoteBrokerService);
    const peerConnectionsFactory = new PeerServerConnectionFactory(
      hostClientConnectionId,
      peerConnectionService,
      remoteBrokerService
    );
    const brokerConnectionsFactory = new MultiSourcesServerConnectionFactory(
      new HostConnectionFactory(hostClientConnectionFactory, remoteBrokerService),
      peerConnectionsFactory
    );

    const appLifeCycleManager = new PeerAppLifeCycleManager(
      peerConnectionService,
      appRegistryService,
      this.launcherRegistry,
      this.appLifeCycleConfig.heartBitPeriod,
      this.appLifeCycleConfig.heartBitTtl
    );

    this.log.info('Starting Broker');
    new Broker(appLifeCycleManager, brokerConnectionsFactory, interopRegistryProvider, appRegistryService).start();

    return hostClientConnection;
  }

  private validate(): void {
    if (!this.appRegistryProviderFactory) {
      throw new Error('App Registry Provider is required');
    }
    if (!this.interopRegistryProviderFactory) {
      throw new Error('Interop Registry Provider is required');
    }
    if (!this.eventBusProvider) {
      throw new Error('Event Bus Provider is required');
    }
  }
}
