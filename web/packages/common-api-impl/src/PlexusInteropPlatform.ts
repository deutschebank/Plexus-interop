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
import { GenericClientApiBuilder } from '@plexus-interop/client';
import { webSocketCtor } from '@plexus-interop/common';
import { BinaryMarshallerProvider, DynamicBinaryMarshallerProvider } from '@plexus-interop/io';
import { Application, InteropRegistryService, Option, UrlInteropRegistryProvider } from '@plexus-interop/metadata';
import { WebSocketDataProvider } from '@plexus-interop/remote';
import { TransportConnection } from '@plexus-interop/transport-common';
import { WebSocketConnectionFactory } from '@plexus-interop/websocket-transport';

import {
  InteropFeature,
  InteropPeer,
  InteropPeerDefinition,
  InteropPlatform,
  MethodImplementation,
  StreamImplementation,
} from './api/client-api';
import { InteropPlatformConfig } from './api/InteropPlatformConfig';
import { PlexusInteropPeer } from './PlexusInteropPeer';
import { registerMethod, registerStream } from './registration';

export class PlexusInteropPlatform implements InteropPlatform {
  private registryService: InteropRegistryService;
  private connectionProvider: () => Promise<TransportConnection>;
  private marshallerProvider: BinaryMarshallerProvider;
  private interopRegistryProvider: UrlInteropRegistryProvider;

  public readonly type: string = 'Plexus Interop';
  public readonly version: string = '0.0.1';

  public constructor(platformConfig: InteropPlatformConfig) {
    const WsCtor = webSocketCtor();
    const metadataWsUrl = `${platformConfig.webSocketUrl}/metadata/interop`;
    this.connectionProvider = async () =>
      new WebSocketConnectionFactory(new WsCtor(platformConfig.webSocketUrl)).connect();
    this.interopRegistryProvider = new UrlInteropRegistryProvider(
      metadataWsUrl,
      -1,
      new WebSocketDataProvider(webSocketCtor())
    );
  }

  public isFeatureSupported(feature: InteropFeature): boolean {
    switch (feature) {
      case InteropFeature.DiscoverMethods:
      case InteropFeature.DiscoverStreams:
      case InteropFeature.RegisterMethodOnConnect:
      case InteropFeature.RegisterStreamOnConnect:
      case InteropFeature.InvokeMethod:
      case InteropFeature.SubscribeStream:
        return true;
      default:
        return false;
    }
  }

  public async connect(
    applicationName: string,
    apiMetadata?: string,
    methods?: MethodImplementation[],
    streams?: StreamImplementation[]
  ): Promise<InteropPeer> {
    await this.finishInitialization();
    const hostAppMetadata = this.registryService.getApplication(applicationName);
    const clientBuilder = new GenericClientApiBuilder(this.marshallerProvider)
      .withApplicationId(hostAppMetadata.id)
      .withTransportConnectionProvider(this.connectionProvider);
    methods = methods || [];
    methods.forEach((method) => registerMethod(method, clientBuilder, this.registryService));
    streams = streams || [];
    streams.forEach((stream) => registerStream(stream, clientBuilder, this.registryService));
    const genericClient = await clientBuilder.connect();
    const peer = new PlexusInteropPeer(genericClient, this.registryService, hostAppMetadata);
    peer.disconnect = peer.disconnect.bind(peer);
    peer.invoke = peer.invoke.bind(peer);
    peer.subscribe = peer.subscribe.bind(peer);
    peer.onConnectionStatusChanged = peer.onConnectionStatusChanged.bind(peer);
    peer.discoverMethods = peer.discoverMethods.bind(peer);
    peer.discoverStreams = peer.discoverStreams.bind(peer);
    peer.disconnect = peer.disconnect.bind(peer);
    return peer;
  }

  public async getPeerDefinitions(): Promise<InteropPeerDefinition[]> {
    await this.finishInitialization();
    const aliasFinder = (app: Application) => app.options.find((o) => o.id.endsWith('alias'));
    return this.interopRegistryProvider
      .getCurrent()
      .applications.valuesArray()
      .map(aliasFinder)
      .filter((alias) => !!alias)
      .map((alias) => ({
        applicationName: (alias as Option).value,
      }));
  }

  private async finishInitialization(): Promise<void> {
    if (!this.marshallerProvider || !this.registryService) {
      await this.interopRegistryProvider.start();
      this.marshallerProvider = new DynamicBinaryMarshallerProvider(this.interopRegistryProvider.getCurrent());
      this.registryService = new InteropRegistryService(this.interopRegistryProvider);
    }
  }
}
