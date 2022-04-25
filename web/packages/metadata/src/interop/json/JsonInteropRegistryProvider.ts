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
import { map, Observable, of } from 'rxjs';

import { ExtendedArray, ExtendedMap, Logger, LoggerFactory, toMap } from '@plexus-interop/common';

import { InteropRegistryProvider } from '../InteropRegistryProvider';
import { Enum } from '../model/Enum';
import { InteropRegistry } from '../model/InteropRegistry';
import { MatchPatternFactory } from '../model/MatchPatternFactory';
import { Message } from '../model/Message';
import { MethodType } from '../model/MethodType';
import {
  Application,
  ConsumedMethod,
  ConsumedService,
  Method,
  ProvidedMethod,
  ProvidedService,
  Service,
} from '../model/ServiceTypes';
import { ApplicationDto } from './ApplicationDto';
import { ConsumedServiceDto } from './ConsumedServiceDto';
import { isEnum, isMessage, MessagesNamespace } from './MessagesNamespace';
import { MethodTypeDto } from './MethodTypeDto';
import { OptionDto } from './OptionDto';
import { ProvidedServiceDto } from './ProvidedServiceDto';
import { RegistryDto } from './RegistryDto';
import { ServiceDto } from './ServiceDto';

export class JsonInteropRegistryProvider implements InteropRegistryProvider {
  private log: Logger;

  private readonly $registry: Observable<InteropRegistry>;
  private current: InteropRegistry;

  public constructor(jsonMetadata: string, $jsonMetadata?: Observable<string>) {
    this.log = LoggerFactory.getLogger('JsonInteropRegistryProvider');
    this.current = this.parseRegistry(jsonMetadata);
    this.$registry = ($jsonMetadata || of(jsonMetadata)).pipe(map(this.parseRegistry.bind(this)));
    this.$registry.subscribe({
      next: (update) => {
        this.current = update;
      },
    });
  }

  public getCurrent(): InteropRegistry {
    return this.current;
  }

  public getRegistry(): Observable<InteropRegistry> {
    return this.$registry;
  }

  private parseRegistry(jsonRegistry: string): InteropRegistry {
    this.log.trace(`Parsing JSON registry of ${jsonRegistry.length} length`);
    const registryDto: RegistryDto = JSON.parse(jsonRegistry);
    this.log.trace(`Finished parsing ${jsonRegistry.length} length`);

    const messages = ExtendedMap.create<string, Message>();
    const enums = ExtendedMap.create<string, Enum>();

    this.collectMessagesMetadata(registryDto.messages, null, messages, enums);

    const services = ExtendedArray.of(registryDto.services.map((s) => this.convertService(messages, s))).toMap(
      (s) => s.id,
      (s) => s
    );

    const applications = ExtendedArray.of(
      registryDto.applications.map((appDto) => this.convertApplication(services, appDto))
    ).toMap(
      (a) => a.id,
      (a) => a
    );

    return {
      messages,
      enums,
      services,
      applications,
      rawMessages: registryDto.messages,
    };
  }

  private collectMessagesMetadata(
    rawEnries: MessagesNamespace,
    // eslint-disable-next-line @typescript-eslint/default-param-last
    namespaceId: string | null = null,
    messagesMap: ExtendedMap<string, Message>,
    enumsMap: ExtendedMap<string, Enum>
  ): void {
    const { nested } = rawEnries;
    if (!nested) {
      return;
    }

    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const key in nested) {
      const namespaceEntry = nested[key];
      const id = namespaceId ? `${namespaceId}.${key}` : key;
      if (isMessage(namespaceEntry)) {
        messagesMap.set(id, { id, fields: namespaceEntry.fields });
      } else if (isEnum(namespaceEntry)) {
        enumsMap.set(id, { id, values: namespaceEntry.values });
      }
      this.collectMessagesMetadata(namespaceEntry, id, messagesMap, enumsMap);
    }
  }

  private convertApplication(services: ExtendedMap<string, Service>, appDto: ApplicationDto): Application {
    const providedServices: ProvidedService[] = [];
    const consumedServices: ConsumedService[] = [];
    const application: Application = {
      id: appDto.id,
      providedServices,
      consumedServices,
      options: [],
    };
    appDto.consumes = appDto.consumes || [];
    appDto.consumes.forEach((consumedDto) => {
      consumedServices.push(
        this.convertConsumedService(consumedDto, application, services.get(consumedDto.service) as Service)
      );
    });
    appDto.provides = appDto.provides || [];
    appDto.provides.forEach((providedDto) => {
      providedServices.push(
        this.convertProvidedService(providedDto, application, services.get(providedDto.service) as Service)
      );
    });
    if (appDto.options) {
      application.options = appDto.options.map((optDto) => ({ id: optDto.id, value: optDto.value }));
    }
    return application;
  }

  private convertConsumedService(
    serviceDto: ConsumedServiceDto,
    application: Application,
    service: Service
  ): ConsumedService {
    const methods = ExtendedMap.create<string, ConsumedMethod>();
    const consumedService: ConsumedService = {
      service,
      application,
      alias: serviceDto.alias,
      from: MatchPatternFactory.createMatcher(serviceDto.from),
      methods,
    };
    serviceDto.methods = serviceDto.methods || [];
    serviceDto.methods
      .map(
        (m) =>
          ({
            method: service.methods.get(m.name) as Method,
            consumedService,
          } as ConsumedMethod)
      )
      .forEach((cm) => methods.set(cm.method.name, cm));
    return consumedService;
  }

  private convertProvidedService(
    serviceDto: ProvidedServiceDto,
    application: Application,
    service: Service
  ): ProvidedService {
    const methods = ExtendedMap.create<string, ProvidedMethod>();

    const providedService: ProvidedService = {
      service,
      application,
      alias: serviceDto.alias,
      to: MatchPatternFactory.createMatcher(serviceDto.to),
      methods,
    };

    serviceDto.methods
      .map(
        (pm) =>
          ({
            method: service.methods.get(pm.name) as Method,
            providedService,
            title: this.getOptionValueOrDefault(pm.options, 'interop.ProvidedMethodOptions.title', null),
            options: pm.options,
          } as ProvidedMethod)
      )
      .forEach((pm) => methods.set(pm.method.name, pm));

    return providedService;
  }

  private getOptionValueOrDefault(options: OptionDto[], id: string, defaultValue: string | null): string | null {
    if (options) {
      // eslint-disable-next-line no-restricted-syntax
      for (const o of options) {
        if (o.id === id) {
          return o.value;
        }
      }
    }
    return defaultValue;
  }

  private convertService(messagesMap: Map<string, Message>, serviceDto: ServiceDto): Service {
    const service: Service = {
      id: serviceDto.id,
      methods: ExtendedMap.create<string, Method>(),
    };
    service.methods = toMap(
      serviceDto.methods.map(
        (methodDto) =>
          ({
            name: methodDto.name,
            type: this.convertMethodType(methodDto.type),
            requestMessage: messagesMap.get(methodDto.request) as Message,
            responseMessage: messagesMap.get(methodDto.response) as Message,
            service,
          } as Method)
      ),
      (m) => m.name,
      (m) => m
    );
    return service;
  }

  private convertMethodType(methodTypeDto: MethodTypeDto): MethodType {
    switch (methodTypeDto) {
      case MethodTypeDto.ClientStreaming:
        return MethodType.ClientStreaming;
      case MethodTypeDto.ServerStreaming:
        return MethodType.ServerStreaming;
      case MethodTypeDto.Unary:
        return MethodType.Unary;
      case MethodTypeDto.DuplexStreaming:
        return MethodType.DuplexStreaming;
      default:
        throw new Error(`Unsupported method type: ${methodTypeDto}`);
    }
  }
}
