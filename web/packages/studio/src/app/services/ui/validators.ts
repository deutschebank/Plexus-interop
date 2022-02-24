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
import { InteropClient } from '../core/InteropClient';
import { ConsumedMethod, ProvidedMethod } from '@plexus-interop/metadata';
import { DiscoveredMethod } from '@plexus-interop/client';
import { ValidatorFn, AbstractControl } from '@angular/forms';

export function plexusMessageValidator(formFieldName: string, client: InteropClient, methodToInvoke: DiscoveredMethod | ConsumedMethod | ProvidedMethod): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const value = control.value;
        try {
            client.validateRequest(methodToInvoke, value);
            return null;
        } catch (error) {
            const errors = {};
            errors[formFieldName] = `${error}`;
            return errors;
        }
    };
}