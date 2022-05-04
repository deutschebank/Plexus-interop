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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { LoggerFactory } from '@plexus-interop/common';
import { Application, ConsumedMethod } from '@plexus-interop/metadata';

import { InteropClientFactory } from '../core/InteropClientFactory';
import { InteropServiceFactory } from '../core/InteropServiceFactory';
import { TransportConnectionFactory } from '../core/TransportConnectionFactory';
import { autoConnectEffect, connectionSetupEffect } from '../effects/ConnectionEffects';
import { TypedAction } from '../reducers/TypedAction';
import { AppActions } from './AppActions';
import { AppConnectedActionParams, ConnectionSetupActionParams } from './AppModel';
import { logger, State } from './RootReducers';

@Injectable()
export class Effects {
  private log = LoggerFactory.getLogger(Effects.name);

  autoConnectToPlexus$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.AUTO_CONNECT),
      withLatestFrom(this.store.select((state) => state.plexus)),
      mergeMap(async ([action, state]) => autoConnectEffect(state))
    )
  );

  connectToPlexus$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<TypedAction<ConnectionSetupActionParams>>(AppActions.CONNECTION_SETUP_START),
      mergeMap(async (action) =>
        connectionSetupEffect(action.payload, this.transportConnectionFactory, this.interopServiceFactory)
      )
    )
  );

  plexusConnected$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.CONNECTION_SETUP_SUCCESS),
      map((_) => {
        this.router.navigate(['/apps'], { queryParamsHandling: 'merge' });
        return { type: AppActions.DO_NOTHING };
      })
    )
  );

  disconnectMetadata = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.DISCONNECT_FROM_PLEXUS),
      withLatestFrom(this.store.select((state) => state.plexus.services).pipe(filter((services) => !!services))),
      mergeMap(async ([action, services]) => {
        if (services.interopClient) {
          await services.interopClient.disconnect();
        }

        this.log.info(`Disconnected from Plexus`);

        this.router.navigate(['/']);

        return { type: AppActions.DISCONNECT_FROM_PLEXUS_SUCCESS };
      })
    )
  );

  connectToApp$: Observable<TypedAction<AppConnectedActionParams>> = createEffect(() =>
    this.actions$.pipe(
      ofType<TypedAction<Application>>(AppActions.CONNECT_TO_APP_START),
      withLatestFrom(this.store.select((state) => state.plexus.services).pipe(filter((services) => !!services))),
      mergeMap(async ([action, services]) => {
        const application = action.payload;
        const appId = application.id;

        const interopClient = await this.interopClientFactory.connect(
          appId,
          services.interopRegistryService,
          services.connectionProvider
        );

        return {
          type: AppActions.CONNECT_TO_APP_SUCCESS,
          payload: { interopClient, application },
        };
      })
    )
  );

  loadConsumedMethod$: Observable<TypedAction<any>> = createEffect(() =>
    this.actions$.pipe(
      ofType<TypedAction<ConsumedMethod>>(AppActions.SELECT_CONSUMED_METHOD),
      withLatestFrom(this.store.select((state) => state.plexus.services).pipe(filter((services) => !!services))),
      mergeMap(async ([action, services]) => {
        const method = action.payload;
        const interopClient = services.interopClient;
        const discoveredMethods = await interopClient.discoverAllMethods(method);
        return {
          type: AppActions.CONSUMED_METHOD_SUCCESS,
          payload: {
            method,
            discoveredMethods,
          },
        };
      })
    )
  );

  appConnected$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.CONNECT_TO_APP_SUCCESS),
      map((_) => {
        return { type: AppActions.NAVIGATE_TO_APP };
      })
    )
  );

  consumedActionLoaded$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.CONSUMED_METHOD_SUCCESS),
      map((_) => {
        this.router.navigate(['/consumed'], { queryParamsHandling: 'merge' });
        return { type: AppActions.DO_NOTHING };
      })
    )
  );

  appConnectionFailed$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.CONNECT_TO_APP_FAILED),
      map((_) => {
        this.router.navigate(['/apps']);
        return { type: AppActions.DO_NOTHING };
      })
    )
  );

  navigateToApp$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.NAVIGATE_TO_APP),
      withLatestFrom(this.store.select((state) => state.plexus.services)),
      mergeMap(async ([action, services]) => {
        services.interopClient.resetInvocationHandlers();
        this.router.navigate(['/app'], { queryParamsHandling: 'merge' });
        return { type: AppActions.DO_NOTHING };
      })
    )
  );

  disconnectFromApp$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.DISCONNECT_FROM_APP),
      withLatestFrom(this.store.select((state) => state.plexus.services)),
      mergeMap(async ([action, services]) => {
        const disconnected = await services.interopClient.disconnect();
        return { type: AppActions.DISCONNECT_FROM_APP_SUCCESS };
      })
    )
  );

  disconnectedFromApp$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.DISCONNECT_FROM_APP_SUCCESS),
      withLatestFrom(this.store.select((state) => state.plexus.services)),
      map((_) => {
        this.log.info(`Disconnected from app - success!`);
        this.router.navigate(['/apps']);

        return { type: AppActions.DO_NOTHING };
      })
    )
  );

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private transportConnectionFactory: TransportConnectionFactory,
    private interopServiceFactory: InteropServiceFactory,
    private interopClientFactory: InteropClientFactory,
    private store: Store<State>,
    private router: Router
  ) {}
}
