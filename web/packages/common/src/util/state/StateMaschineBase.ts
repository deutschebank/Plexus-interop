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

/* eslint-disable max-classes-per-file */
import { Logger } from '../../logger/Logger';
import { LoggerFactory } from '../../logger/LoggerFactory';
import { Handlers, StateMaschine, Transition, Transitions } from './StateMaschine';

class StateDescriptor<T> {
  constructor(public state: T, public inTransitions: Transitions<T> = [], public outTransitions: Transitions<T> = []) {}

  public hasOutTransition(state: T): boolean {
    return this.outTransitions.filter((transtion) => transtion.to === state).length > 0;
  }
}

export class StateMaschineBase<T> implements StateMaschine<T> {
  private readonly stateDescriptorsMap: Map<T, StateDescriptor<T>> = new Map<T, StateDescriptor<T>>();

  constructor(
    private current: T,
    transitions: Transitions<T>,
    private logger: Logger = LoggerFactory.getLogger('StateMaschine')
  ) {
    transitions.forEach((transition) => {
      this.putIfAbsent(transition.from);
      this.putIfAbsent(transition.to);
      const fromDescriptor = this.lookup(transition.from);
      if (fromDescriptor.hasOutTransition(transition.to)) {
        throw new Error(`Transition ${transition.from} -> ${transition.to} already exists`);
      }
      fromDescriptor.outTransitions.push(transition);
    });
  }

  public is(state: T): boolean {
    return this.current === state;
  }

  public isOneOf(...states: T[]): boolean {
    return states.some((state) => this.is(state));
  }

  public getCurrent(): T {
    return this.current;
  }

  public canGo(state: T): boolean {
    const descriptor = this.stateDescriptorsMap.get(this.getCurrent());
    if (descriptor) {
      return descriptor.hasOutTransition(state);
    }
    return false;
  }

  public go(to: T): void {
    if (!this.canGo(to)) {
      throw new Error(`Transition ${this.getCurrent()} -> ${to} does not exist`);
    }
    const descriptor = this.lookup(this.getCurrent());
    const transition = descriptor.outTransitions.find((trans) => trans.to === to) as Transition<T>;
    const old = this.getCurrent();
    if (transition.preHandler) {
      transition
        .preHandler()
        .then(() => {
          /* istanbul ignore if */
          if (this.logger.isTraceEnabled()) {
            this.logger.trace(`Finished pre-handler for ${old} -> ${to}`);
          }
        })
        .catch((e) => this.logger.error(`Pre-handler for ${this.getCurrent()} -> ${to} failed`, e));
    }
    this.switchInternal(to);
    if (transition.postHandler) {
      transition
        .postHandler()
        .then(() => {
          /* istanbul ignore if */
          if (this.logger.isTraceEnabled()) {
            this.logger.trace(`Finished post-handler for ${this.getCurrent()} -> ${to}`);
          }
        })
        .catch((e) => this.logger.error(`Post-handler for ${this.getCurrent()} -> ${to} failed`, e));
    }
  }

  public goAsync(to: T, dynamicHandlers?: Handlers): Promise<void> {
    if (this.canGo(to)) {
      const descriptor = this.lookup(this.getCurrent());
      const transition = descriptor.outTransitions.find((trans) => trans.to === to) as Transition<T>;
      return new Promise<void>((resolve, reject) => {
        const preHandlePassed = () => {
          this.switchInternal(transition.to);
          const postHandlerPromises = [dynamicHandlers ? dynamicHandlers.postHandler : null, transition.postHandler]
            .filter((handler) => !!handler)
            .map((handler) => handler as () => Promise<void>)
            .map((handler) => handler());
          Promise.all(postHandlerPromises).then(() => resolve(), reject);
        };
        const preHandlePromises = [dynamicHandlers ? dynamicHandlers.preHandler : null, transition.preHandler]
          .filter((handler) => !!handler)
          .map((handler) => handler as () => Promise<void>)
          .map((handler) => handler());
        Promise.all(preHandlePromises).then(preHandlePassed.bind(this), reject);
      });
    }
    const error = `Transition ${this.getCurrent()} -> ${to} does not exist`;
    this.logError(error);
    return Promise.reject(error);
  }

  public throwIfNot(...states: T[]): void {
    const result = states.some((state) => this.is(state));
    if (!result) {
      const error = `Current state is ${this.current} not one of [${states.join(',')}]`;
      this.logError(error);
      throw new Error(error);
    }
  }

  private logError(m: string): void {
    if (this.logger) {
      this.logger.error(m);
    }
  }

  private switchInternal(to: T): void {
    /* istanbul ignore if */
    if (this.logger.isTraceEnabled()) {
      this.logger.trace(`${this.getCurrent()} -> ${to}`);
    }
    this.current = to;
  }

  private putIfAbsent(state: T): void {
    if (!this.stateDescriptorsMap.has(state)) {
      this.stateDescriptorsMap.set(state, new StateDescriptor(state));
    }
  }

  private lookup(state: T): StateDescriptor<T> {
    return this.stateDescriptorsMap.get(state) as StateDescriptor<T>;
  }
}
