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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppActions } from '../services/ui/AppActions';
import { ConnectionDetails, TransportType, transportTypes as types } from '../services/ui/AppModel';
import * as fromRoot from '../services/ui/RootReducers';
import { SubscriptionsRegistry } from '../services/ui/SubscriptionsRegistry';

@Component({
  selector: 'app-metadata-loader',
  templateUrl: './metadata-loader.component.html',
  styleUrls: ['./metadata-loader.component.css'],
  providers: [SubscriptionsRegistry],
})
export class MetadataLoaderComponent implements OnInit, OnDestroy {
  transportType: UntypedFormControl = new UntypedFormControl(TransportType.NATIVE_WS, [Validators.required]);
  metadataUrl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.minLength(1)]);
  appsUrl: UntypedFormControl = new UntypedFormControl('', [this.requiredWebConfig.bind(this)]);
  proxyHostUrl: UntypedFormControl = new UntypedFormControl('', [this.requiredCrossWebConfig.bind(this)]);
  wsUrl: UntypedFormControl = new UntypedFormControl('', [this.requiredWsConfig.bind(this)]);

  transportTypes = types;

  connectionFormGroup: UntypedFormGroup = this.builder.group({
    metadataUrl: this.metadataUrl,
    appsUrl: this.appsUrl,
    proxyHostUrl: this.proxyHostUrl,
    transportType: this.transportType,
    wsUrl: this.wsUrl,
  });

  constructor(
    private actions: AppActions,
    private store: Store<fromRoot.State>,
    private router: Router,
    private subscriptions: SubscriptionsRegistry,
    private builder: UntypedFormBuilder
  ) {}

  ngOnInit() {
    const connectionDetailsObs = this.store.select((state) => state.plexus.connectionDetails);
    this.subscriptions.add(
      connectionDetailsObs.subscribe((details) => {
        this.metadataUrl.setValue(details.generalConfig ? details.generalConfig.metadataUrl : '');
        this.appsUrl.setValue(details.webConfig ? details.webConfig.appsMetadataUrl : '');
        this.proxyHostUrl.setValue(details.webConfig ? details.webConfig.proxyHostUrl : '');
        this.transportType.setValue(details.generalConfig ? details.generalConfig.transportType : '');
        this.wsUrl.setValue(details.wsConfig ? details.wsConfig.wsUrl : '');
      })
    );
  }

  triggerValidation(): void {
    for (var i in this.connectionFormGroup.controls) {
      this.connectionFormGroup.controls[i].updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribeAll();
  }

  requiredCrossWebConfig(formControl: UntypedFormControl) {
    const value = formControl.value as string;
    const valid = this.transportType.value !== TransportType.WEB_CROSS || (!!value && value.length > 0);
    return valid ? null : { required: true };
  }

  requiredWsConfig(formControl: UntypedFormControl) {
    const value = formControl.value as string;
    const valid = this.transportType.value !== TransportType.NATIVE_WS || (!!value && value.length > 0);
    return valid ? null : { required: true };
  }

  requiredWebConfig(formControl: UntypedFormControl) {
    const value = formControl.value as string;
    const valid = this.transportType.value === TransportType.NATIVE_WS || (!!value && value.length > 0);
    return valid ? null : { required: true };
  }

  connect(metadataUrl?: string) {
    const wsConfig = !!this.wsUrl.value ? { wsUrl: this.wsUrl.value } : null;
    const webConfig =
      this.appsUrl.value || this.proxyHostUrl.value
        ? {
            proxyHostUrl: this.proxyHostUrl.value,
            appsMetadataUrl: this.appsUrl.value,
          }
        : null;
    const connectionDetails: ConnectionDetails = {
      generalConfig: {
        metadataUrl: this.metadataUrl.value,
        transportType: this.transportType.value,
      },
      wsConfig,
      webConfig,
      connected: false,
    };
    this.store.dispatch({
      type: AppActions.CONNECTION_SETUP_START,
      payload: {
        connectionDetails,
        silentOnFailure: false,
      },
    });
  }
}
