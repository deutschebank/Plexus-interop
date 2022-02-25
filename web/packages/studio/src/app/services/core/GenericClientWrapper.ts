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
import {
  DiscoveredMethod,
  GenericClientApi,
  InvocationClient,
  InvocationObserver,
  MethodDiscoveryRequest,
  MethodType,
  StreamingInvocationClient,
  ValueHandler,
} from '@plexus-interop/client';
import {
  DiscoveryMode,
  MethodDiscoveryResponse,
  MethodInvocationContext,
  ProvidedMethodReference,
} from '@plexus-interop/client-api';
import { flatMap } from '@plexus-interop/common';
import { DynamicProtoMarshallerFactory } from '@plexus-interop/io/dist/main/src/dynamic';
import { ConsumedMethod, InteropRegistryService, ProvidedMethod, ProvidedService } from '@plexus-interop/metadata';
import { ClientError } from '@plexus-interop/protocol';

import { DefaultMessageGenerator } from './DefaultMessageGenerator';
import { FieldNamesValidator } from './FieldNamesValidator';
import { InteropClient } from './InteropClient';
import {
  BidiStreamingStringHandler,
  ServerStreamingStringHandler,
  toGenericObserver,
  UnaryStringHandler,
  wrapGenericHostClient,
} from './StringHandlers';

type DiscoveredMetaInfo = {
  inputMessageId: string;
  outputMessageId: string;
  provided: ProvidedMethodReference;
};

type ConsumedMetaInfo = {
  serviceId: string;
  methodId: string;
  inputMessageId: string;
  outputMessageId: string;
};

export class GenericClientWrapper implements InteropClient {
  private fieldsNamesValidator: FieldNamesValidator;

  public constructor(
    private readonly appId: string,
    private readonly genericClient: GenericClientApi,
    private readonly interopRegistryService: InteropRegistryService,
    private readonly encoderProvider: DynamicProtoMarshallerFactory,
    private readonly unaryHandlers: Map<string, UnaryStringHandler>,
    private readonly serverStreamingHandlers: Map<string, ServerStreamingStringHandler>,
    private readonly bidiHandlers: Map<string, BidiStreamingStringHandler>,
    private readonly defaultGenerator: DefaultMessageGenerator
  ) {
    this.fieldsNamesValidator = new FieldNamesValidator(this.interopRegistryService);
  }

  public getConnectionStrId(): string {
    return this.genericClient.getConnectionId().toString();
  }

  public validateRequest(method: DiscoveredMethod | ConsumedMethod | ProvidedMethod, payload: string): void {
    const { inputMessageId, outputMessageId } = this.toMetaInfo(method);
    this.validateRequestByMessageId(this.isProvided(method) ? outputMessageId : inputMessageId, payload);
  }

  public createPayloadPreview(messageId: string, jsonPayload: string): string {
    try {
      const requestData = JSON.parse(jsonPayload);
      const requestEncoder = this.encoderProvider.getMarshaller(messageId);
      const encodedRequest: ArrayBuffer = requestEncoder.encode(requestData);
      return `[${new Uint8Array(encodedRequest).toString()}]`;
    } catch (error) {
      return 'Unable to generate payload';
    }
  }

  public disconnect(): Promise<void> {
    return this.genericClient.disconnect();
  }

  public setUnaryActionHandler(
    serviceId: string,
    methodId: string,
    serviceAlias: string,
    handler: (invocationContext: MethodInvocationContext, requestJson: string) => Promise<string>
  ): void {
    this.unaryHandlers.set(
      methodHash({
        serviceId,
        methodId,
        serviceAlias,
      }),
      handler
    );
  }

  private validateRequestByMessageId(messageId: string, payload: any): void {
    const requestEncoder = this.encoderProvider.getMarshaller(messageId);
    const requestData = JSON.parse(payload);
    requestEncoder.validate(requestData);
    this.fieldsNamesValidator.validate(messageId, requestData);
  }

  private isConsumed(
    methodToInvoke: DiscoveredMethod | ConsumedMethod | ProvidedMethod
  ): methodToInvoke is ConsumedMethod {
    return !!(methodToInvoke as ConsumedMethod).consumedService;
  }

  private isDiscovered(
    methodToInvoke: DiscoveredMethod | ConsumedMethod | ProvidedMethod
  ): methodToInvoke is DiscoveredMethod {
    return !!(methodToInvoke as DiscoveredMethod).providedMethod;
  }

  private toMetaInfo(
    method: DiscoveredMethod | ConsumedMethod | ProvidedMethod
  ): DiscoveredMetaInfo | ConsumedMetaInfo {
    if (this.isConsumed(method)) {
      return {
        inputMessageId: method.method.requestMessage.id,
        outputMessageId: method.method.responseMessage.id,
        serviceId: method.consumedService.service.id,
        methodId: method.method.name,
      };
    } else if (this.isDiscovered(method)) {
      return {
        inputMessageId: method.inputMessageId as string,
        outputMessageId: method.outputMessageId as string,
        provided: method.providedMethod,
      };
    } else {
      return {
        inputMessageId: method.method.requestMessage.id,
        outputMessageId: method.method.responseMessage.id as string,
        serviceId: method.method.service.id,
        methodId: method.method.name,
      };
    }
  }

  private isProvided(method: DiscoveredMethod | ConsumedMethod | ProvidedMethod): boolean {
    return !this.isConsumed(method) && !this.isDiscovered(method);
  }

  public async sendUnaryRequest(
    methodToInvoke: DiscoveredMethod | ConsumedMethod,
    requestJson: string,
    responseHandler: ValueHandler<string>
  ): Promise<InvocationClient> {
    const metaInfo = this.toMetaInfo(methodToInvoke);
    const { inputMessageId, outputMessageId } = metaInfo;

    const requestEncoder = this.encoderProvider.getMarshaller(inputMessageId);
    const responseEncoder = this.encoderProvider.getMarshaller(outputMessageId);

    const requestData = JSON.parse(requestJson);
    requestEncoder.validate(requestData);

    const encodedRequest = requestEncoder.encode(requestData);

    const internalResponseHandler = {
      value: (v) => responseHandler.value(JSON.stringify(responseEncoder.decode(v))),
      error: (e) => responseHandler.error(e),
    };

    if (!this.isConsumed(methodToInvoke)) {
      const provided = (metaInfo as DiscoveredMetaInfo).provided;
      return await this.genericClient.sendRawUnaryRequest(provided, encodedRequest, internalResponseHandler);
    } else {
      const consumedMetaInfo = metaInfo as ConsumedMetaInfo;
      return await this.genericClient.sendRawUnaryRequest(
        {
          serviceId: consumedMetaInfo.serviceId,
          methodId: consumedMetaInfo.methodId,
        },
        encodedRequest,
        internalResponseHandler
      );
    }
  }

  public setBidiStreamingActionHandler(
    serviceId: string,
    methodId: string,
    serviceAlias: string,
    handler: BidiStreamingStringHandler
  ): void {
    this.bidiHandlers.set(
      methodHash({
        serviceId,
        methodId,
        serviceAlias,
      }),
      handler
    );
  }

  public setServerStreamingActionHandler(
    serviceId: string,
    methodId: string,
    serviceAlias: string,
    handler: ServerStreamingStringHandler
  ): void {
    this.serverStreamingHandlers.set(
      methodHash({
        serviceId,
        methodId,
        serviceAlias,
      }),
      handler
    );
  }

  public async sendBidiStreamingRequest(
    methodToInvoke: DiscoveredMethod | ConsumedMethod,
    responseObserver: InvocationObserver<string>
  ): Promise<StreamingInvocationClient<string>> {
    const metaInfo = this.toMetaInfo(methodToInvoke);
    const { inputMessageId, outputMessageId } = metaInfo;

    const requestEncoder = this.encoderProvider.getMarshaller(inputMessageId);
    const responseEncoder = this.encoderProvider.getMarshaller(outputMessageId);

    const observer = toGenericObserver(responseObserver, responseEncoder);

    if (!this.isConsumed(methodToInvoke)) {
      const provided = (metaInfo as DiscoveredMetaInfo).provided;
      const baseClient = await this.genericClient.sendRawBidirectionalStreamingRequest(provided, observer);
      return wrapGenericHostClient(baseClient, requestEncoder);
    } else {
      const consumedMetaInfo = metaInfo as ConsumedMetaInfo;
      const baseClient = await this.genericClient.sendRawBidirectionalStreamingRequest(
        {
          serviceId: consumedMetaInfo.serviceId,
          methodId: consumedMetaInfo.methodId,
        },
        observer
      );
      return wrapGenericHostClient(baseClient, requestEncoder);
    }
  }

  public sendServerStreamingRequest(
    methodToInvoke: DiscoveredMethod | ConsumedMethod,
    requestJson: string,
    responseObserver: InvocationObserver<string>
  ): Promise<InvocationClient> {
    const metaInfo = this.toMetaInfo(methodToInvoke);
    const { inputMessageId, outputMessageId } = metaInfo;

    const requestEncoder = this.encoderProvider.getMarshaller(inputMessageId);
    const responseEncoder = this.encoderProvider.getMarshaller(outputMessageId);

    const requestData = JSON.parse(requestJson);
    requestEncoder.validate(requestData);

    const encodedRequest = requestEncoder.encode(requestData);
    const observer = toGenericObserver(responseObserver, responseEncoder);

    if (!this.isConsumed(methodToInvoke)) {
      const provided = (metaInfo as DiscoveredMetaInfo).provided;
      return this.genericClient.sendRawServerStreamingRequest(provided, encodedRequest, observer);
    } else {
      const consumedMetaInfo = metaInfo as ConsumedMetaInfo;
      return this.genericClient.sendRawServerStreamingRequest(
        {
          serviceId: consumedMetaInfo.serviceId,
          methodId: consumedMetaInfo.methodId,
        },
        encodedRequest,
        observer
      );
    }
  }

  public resetInvocationHandlers(): void {
    const providedServices = this.interopRegistryService.getProvidedServices(this.appId);
    const notInterceptedMsg = 'Plexus Studio: Not intercepted';
    const notInterceptedError = new Error(notInterceptedMsg);
    flatMap((ps: ProvidedService) => ps.methods.valuesArray(), providedServices).forEach((pm) => {
      const pmFullName = methodHash({
        serviceId: pm.providedService.service.id,
        serviceAlias: pm.providedService.alias,
        methodId: pm.method.name,
      });
      switch (pm.method.type) {
        case MethodType.Unary:
          this.unaryHandlers.set(pmFullName, async () => Promise.reject(notInterceptedError));
          break;
        case MethodType.ServerStreaming:
          this.serverStreamingHandlers.set(pmFullName, (context, request, hostClient) =>
            hostClient.error(new ClientError(notInterceptedMsg))
          );
          break;
        case MethodType.DuplexStreaming:
        case MethodType.ClientStreaming:
          this.bidiHandlers.set(pmFullName, (context, hostClient) => {
            hostClient.error(new ClientError(notInterceptedMsg));
            return {
              next: (v) => {},
              complete: () => {},
              error: (e) => {},
              streamCompleted: () => {},
            };
          });
          break;
      }
    });
  }

  public createDefaultPayload(messageId: string): string {
    return this.defaultGenerator.generate(messageId);
  }

  public discoverMethod(discoveryRequest: MethodDiscoveryRequest): Promise<MethodDiscoveryResponse> {
    return this.genericClient.discoverMethod(discoveryRequest);
  }

  public async discoverAllMethods(method: ConsumedMethod): Promise<MethodDiscoveryResponse> {
    const consumedMethod = {
      consumedService: {
        serviceId: method.consumedService.service.id,
        serviceAlias: method.consumedService.alias,
      },
      methodId: method.method.name,
    };
    const discoveryRequest = { consumedMethod };
    const discoveredMethods = await this.discoverMethod(discoveryRequest);
    const onlineMethods = await this.discoverMethod({
      ...discoveryRequest,
      discoveryMode: DiscoveryMode.Online,
    });
    if (onlineMethods && onlineMethods.methods) {
      onlineMethods.methods.forEach((pm) => discoveredMethods.methods.push(pm));
    }
    return discoveredMethods;
  }
}

export function methodHash(methodInfo: { serviceId: string; methodId: string; serviceAlias?: string }): string {
  const alias = methodInfo.serviceAlias || 'default';
  return `${methodInfo.serviceId}.${alias}.${methodInfo.methodId}`;
}
