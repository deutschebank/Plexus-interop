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
import { Unsubscribable as AnonymousSubscription, Subscription } from 'rxjs';

import { ProvidedMethodReference } from '@plexus-interop/client-api';
import {
  CancellationToken,
  Logger,
  LoggerFactory,
  once,
  StateMaschine,
  StateMaschineBase,
} from '@plexus-interop/common';
import {
  ClientError,
  ClientProtocolHelper,
  ClientProtocolUtils,
  ErrorCompletion,
  InvocationMetaInfo,
  ClientProtocolHelper as modelHelper,
  clientProtocol as plexus,
  SuccessCompletion,
} from '@plexus-interop/protocol';
import { Channel, UniqueId } from '@plexus-interop/transport-common';

import { ClientDtoUtils } from '../ClientDtoUtils';
import { InvocationChannelObserver } from './InvocationChannelObserver';
import { InvocationState } from './InvocationState';

export class GenericInvocation {
  private readonly stateMachine: StateMaschine<InvocationState>;

  private pendingHeader: plexus.interop.protocol.IInvocationMessageHeader | null;

  private id: UniqueId;

  private sentMessagesCounter: number = 0;

  private sendCompletionReceived: boolean = false;

  private sendCompletionReceivedCallback: (() => void) | null = null;

  private metaInfo: InvocationMetaInfo;

  private log: Logger;

  public readonly readCancellationToken: CancellationToken;

  public constructor(
    private readonly sourceChannel: Channel,
    baseReadToken: CancellationToken = new CancellationToken()
  ) {
    this.readCancellationToken = new CancellationToken(baseReadToken);
    this.log = LoggerFactory.getLogger('Invocation');
    this.memoizedClose = once(this.memoizedClose.bind(this));
    this.stateMachine = new StateMaschineBase<InvocationState>(InvocationState.CREATED, [
      // initialization
      { from: InvocationState.CREATED, to: InvocationState.START_REQUESTED },
      { from: InvocationState.START_REQUESTED, to: InvocationState.REMOTE_STARTING },
      { from: InvocationState.REMOTE_STARTING, to: InvocationState.OPEN },
      { from: InvocationState.CREATED, to: InvocationState.ACCEPTING_INVOCATION_INFO },
      { from: InvocationState.ACCEPTING_INVOCATION_INFO, to: InvocationState.OPEN },
      { from: InvocationState.START_REQUESTED, to: InvocationState.OPEN },
      // active -> completion
      { from: InvocationState.OPEN, to: InvocationState.COMPLETION_RECEIVED },
      { from: InvocationState.OPEN, to: InvocationState.SENT_COMPLETED },
      { from: InvocationState.COMPLETION_RECEIVED, to: InvocationState.COMPLETION_HANDSHAKE },
      { from: InvocationState.SENT_COMPLETED, to: InvocationState.COMPLETION_HANDSHAKE },
      // closure
      { from: InvocationState.COMPLETION_HANDSHAKE, to: InvocationState.COMPLETED },
      // forced closure
      { from: InvocationState.OPEN, to: InvocationState.COMPLETED },
      { from: InvocationState.SENT_COMPLETED, to: InvocationState.COMPLETED },
    ]);
  }

  public start(
    metaInfo: InvocationMetaInfo,
    invocationObserver: InvocationChannelObserver<AnonymousSubscription, ArrayBuffer>
  ): void {
    this.metaInfo = metaInfo;
    this.log.trace('Start basic invocation');
    this.startInvocationInternal(() => this.sendStartInvocationRequest(metaInfo), invocationObserver);
  }

  public startDiscovered(
    methodReference: ProvidedMethodReference,
    invocationObserver: InvocationChannelObserver<AnonymousSubscription, ArrayBuffer>
  ): void {
    this.log.trace('Start discovered invocation');
    this.metaInfo = ClientDtoUtils.providedMethodToInvocationInfo(methodReference);
    this.startInvocationInternal(() => this.sendStartDiscoveredInvocationRequest(methodReference), invocationObserver);
  }

  public acceptInvocation(invocationObserver: InvocationChannelObserver<AnonymousSubscription, ArrayBuffer>): void {
    this.log.debug('Accept of invocation requested');
    this.stateMachine.throwIfNot(InvocationState.CREATED);
    this.stateMachine.go(InvocationState.ACCEPTING_INVOCATION_INFO);
    this.openSubscription(invocationObserver).catch((e) => this.log.error('Failed to open channel subscription', e));
  }

  public uuid(): UniqueId {
    return this.id;
  }

  public getMetaInfo(): InvocationMetaInfo {
    return this.metaInfo;
  }

  public sendCompleted(): void {
    this.stateMachine.throwIfNot(InvocationState.OPEN, InvocationState.COMPLETION_RECEIVED);
    if (this.stateMachine.is(InvocationState.COMPLETION_RECEIVED)) {
      this.stateMachine.go(InvocationState.COMPLETION_HANDSHAKE);
    } else {
      this.stateMachine.go(InvocationState.SENT_COMPLETED);
    }
    this.sourceChannel.sendMessage(modelHelper.sendCompletionPayload({}));
  }

  public async close(completion: plexus.ICompletion = new SuccessCompletion()): Promise<plexus.ICompletion> {
    /* istanbul ignore if */
    if (this.log.isDebugEnabled()) {
      this.log.debug('Close invocation requested', JSON.stringify(completion));
    }
    return this.memoizedClose(completion);
  }

  public async sendMessage(data: ArrayBuffer): Promise<void> {
    this.stateMachine.throwIfNot(
      InvocationState.OPEN,
      InvocationState.COMPLETION_RECEIVED,
      InvocationState.SENT_COMPLETED
    );
    this.log.trace(`Sending message of ${data.byteLength} bytes`);
    const headerPayload = modelHelper.messageHeaderPayload({
      length: data.byteLength,
    });
    this.sourceChannel.sendMessage(headerPayload);
    this.sourceChannel.sendMessage(data);
    this.sentMessagesCounter++;
  }

  // public methods below are NOT a part of API, for unit tests only

  public currentState(): InvocationState {
    return this.stateMachine.getCurrent();
  }

  public getSentMessagesCounter(): number {
    return this.sentMessagesCounter;
  }

  private async memoizedClose(completion: plexus.ICompletion): Promise<plexus.ICompletion> {
    this.stateMachine.throwIfNot(
      InvocationState.OPEN,
      InvocationState.COMPLETION_RECEIVED,
      InvocationState.SENT_COMPLETED,
      InvocationState.COMPLETION_HANDSHAKE
    );

    const isSuccessCompletion = ClientProtocolHelper.isSuccessCompletion(completion);

    if (isSuccessCompletion && this.stateMachine.isOneOf(InvocationState.COMPLETION_RECEIVED, InvocationState.OPEN)) {
      this.sendCompleted();
    }

    this.stateMachine.go(InvocationState.COMPLETED);

    return new Promise((resolveCloseAction, rejectCloseAction) => {
      const closeChannel = () => {
        this.log.trace('Sending channel close message');
        this.closeChannel(completion)
          .then((result) => resolveCloseAction(result))
          .catch((e) => rejectCloseAction(e));
      };
      if (isSuccessCompletion && !this.sendCompletionReceived) {
        // wait for remote side for success case only
        this.log.debug('Waiting for remote completion');
        this.sendCompletionReceivedCallback = closeChannel;
      } else {
        closeChannel();
      }
    });
  }

  private setUuid(id: UniqueId): void {
    this.log.debug(`Set id, ${id.toString()}`);
    this.log = LoggerFactory.getLogger(`Invocation [${id.toString()}]`);
    this.id = id;
  }

  private startInvocationInternal(
    sendRequest: () => Promise<void>,
    invocationObserver: InvocationChannelObserver<AnonymousSubscription, ArrayBuffer>
  ): void {
    this.log.debug('Invocation start requested');
    this.stateMachine.throwIfNot(InvocationState.CREATED);
    this.setUuid(UniqueId.generateNew());
    const subscriptionStartedPromise = this.openSubscription(invocationObserver);
    this.stateMachine
      .goAsync(InvocationState.START_REQUESTED, {
        preHandler: async () => {
          await subscriptionStartedPromise;
          await sendRequest();
        },
      })
      .catch((e) => this.log.error('Invocation start failed', e));
  }

  private terminate(message: string): void {
    this.log.error('Terminating channel');
    this.closeChannel(new ErrorCompletion(new ClientError(message)));
  }

  private closeChannel(completion: plexus.ICompletion): Promise<plexus.ICompletion> {
    return this.sourceChannel
      .close(completion)
      .then((channelCompletion) => {
        this.log.debug('Channel closed');
        this.closeInternal();
        const result = ClientProtocolUtils.createSummarizedCompletion(
          completion,
          channelCompletion,
          this.checkInternalStatus()
        );
        if (this.log.isTraceEnabled()) {
          this.log.trace(`Completion result ${JSON.stringify(result)}`);
        }
        return result;
      })
      .catch((e) => {
        /* istanbul ignore if */
        if (this.log.isDebugEnabled()) {
          this.log.debug('Error during channel closure', e);
        }
        this.closeInternal();
        throw e;
      });
  }

  private handleRemoteSentCompleted(
    invocationObserver: InvocationChannelObserver<AnonymousSubscription, ArrayBuffer>
  ): void {
    this.log.debug('Source channel subscription completed');
    invocationObserver.streamCompleted();
    this.sendCompletionReceived = true;
    if (this.sendCompletionReceivedCallback) {
      this.sendCompletionReceivedCallback();
      this.sendCompletionReceivedCallback = null;
    }
    switch (this.stateMachine.getCurrent()) {
      case InvocationState.SENT_COMPLETED:
        this.log.debug('SENT_COMPLETED -> COMPLETION_HANDSHAKE');
        this.stateMachine.go(InvocationState.COMPLETION_HANDSHAKE);
        break;
      case InvocationState.OPEN:
        this.log.debug('OPEN -> COMPLETION_RECEIVED');
        this.stateMachine.go(InvocationState.COMPLETION_RECEIVED);
        break;
      case InvocationState.COMPLETED:
        this.log.debug('Already completed');
        break;
      default:
        throw new Error(`Can't handle completion, invalid state ${this.stateMachine.getCurrent()}`);
    }
  }

  private async closeInternal(): Promise<void> {
    this.readCancellationToken.cancel('Invocation closed');
  }

  private openSubscription(
    invocationObserver: InvocationChannelObserver<AnonymousSubscription, ArrayBuffer>
  ): Promise<AnonymousSubscription> {
    this.log.trace(`Starting listening of incoming messages`);
    return new Promise<AnonymousSubscription>((resolve, reject) => {
      this.sourceChannel.open({
        started: (sourceSubscription) => {
          this.log.debug('Source channel subscription started');
          resolve(sourceSubscription);
        },

        startFailed: (error) => {
          this.log.error('Unable to open source channel', error);
          invocationObserver.startFailed(error);
          reject(error);
        },

        next: (message) => {
          try {
            this.handleIncomingMessage(message, invocationObserver);
          } catch (e) {
            const errorText = 'Error while processing of incoming message';
            this.log.error(errorText, e);
            this.terminate(errorText);
            invocationObserver.error(e);
          }
        },

        complete: (completion) => {
          this.log.debug('Remote channel closed');
          invocationObserver.complete(completion);
        },

        error: (e) => {
          this.log.error('Error from source channel received', e);
          this.closeInternal();
          invocationObserver.error(e);
        },
      });
    });
  }

  private handleIncomingMessage(
    data: ArrayBuffer,
    invocationObserver: InvocationChannelObserver<AnonymousSubscription, ArrayBuffer>
  ): void {
    this.log.trace(`Received message of ${data.byteLength} bytes`);
    if (this.readCancellationToken.isCancelled()) {
      this.log.warn(`Read cancelled with '${this.readCancellationToken.getReason()}', drop message`);
      return;
    }
    if (this.pendingHeader) {
      this.log.trace(`Received message payload of ${data.byteLength} length`);
      this.pendingHeader = null;
      this.sourceChannel.sendMessage(
        modelHelper.messageReceivedPayload({
          invocationId: this.uuid(),
        })
      );
      invocationObserver.next(data);
    } else if (this.stateMachine.is(InvocationState.START_REQUESTED)) {
      this.log.debug('Received invocation starting message');
      modelHelper.decodeInvocationStarting(data);
      this.stateMachine.go(InvocationState.REMOTE_STARTING);
    } else if (this.stateMachine.is(InvocationState.REMOTE_STARTING)) {
      this.log.debug('Received invocation started message');
      modelHelper.decodeInvocationStarted(data);
      this.stateMachine.go(InvocationState.OPEN);
      // requested invocation started
      invocationObserver.started(new Subscription(() => this.close()));
    } else if (this.stateMachine.is(InvocationState.ACCEPTING_INVOCATION_INFO)) {
      const envelopObject = modelHelper.decodeBrokerEnvelop(data);
      if (envelopObject.invocationStartRequested) {
        if (this.log.isTraceEnabled()) {
          this.log.trace(
            `Received invocation request message ${JSON.stringify(envelopObject.invocationStartRequested)}`
          );
        }
        this.metaInfo = ClientProtocolHelper.toInvocationInfo(envelopObject.invocationStartRequested);
        // accepted invocation started
        this.setUuid(UniqueId.generateNew());
        this.stateMachine.go(InvocationState.OPEN);
        this.sourceChannel.sendMessage(
          modelHelper.invocationStartedMessagePayload({
            invocationId: this.uuid(),
          })
        );
        invocationObserver.started(new Subscription(() => this.close()));
      } else {
        this.log.warn(`Unknown message received ${JSON.stringify(envelopObject)}`);
      }
    } else if (
      this.stateMachine.isOneOf(
        InvocationState.OPEN,
        InvocationState.SENT_COMPLETED,
        InvocationState.COMPLETION_HANDSHAKE,
        InvocationState.COMPLETED,
        InvocationState.COMPLETION_RECEIVED
      )
    ) {
      const envelopObject = modelHelper.decodeInvocationEnvelop(data);
      if (envelopObject.message) {
        this.log.trace(`Received message header`);
        this.pendingHeader = envelopObject.message;
      } else if (envelopObject.confirmation) {
        this.log.trace(`Received message delivery confirmation`);
        this.sentMessagesCounter--;
      } else if (envelopObject.sendCompletion) {
        this.log.trace(`Received send completion`);
        this.handleRemoteSentCompleted(invocationObserver);
      } else {
        this.log.warn(`Unknown message received ${JSON.stringify(envelopObject)}`);
      }
    } else {
      throw new Error(`Unexpected state, ${this.currentState()}`);
    }
  }

  private checkInternalStatus(): plexus.ICompletion {
    if (this.sentMessagesCounter !== 0) {
      const message = `Confirmation not received for all messages, ${this.sentMessagesCounter}`;
      return {
        status: plexus.Completion.Status.Failed,
        error: {
          message,
        },
      };
    }
    return {
      status: plexus.Completion.Status.Completed,
    };
  }

  private async sendStartInvocationRequest(metaInfo: InvocationMetaInfo): Promise<void> {
    this.log.trace('Sending start request to channel');
    const payload = modelHelper.invocationStartRequestPayload(metaInfo);
    return this.sourceChannel.sendMessage(payload);
  }

  private async sendStartDiscoveredInvocationRequest(methodReference: ProvidedMethodReference): Promise<void> {
    this.log.trace('Sending start discovered request to channel');
    const payload = modelHelper.discoveredInvocationStartRequestPayload(methodReference);
    return this.sourceChannel.sendMessage(payload);
  }
}
