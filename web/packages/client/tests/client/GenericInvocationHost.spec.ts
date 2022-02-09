/**
 * Copyright 2017-2020 Plexus Interop Deutsche Bank AG
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
import { AcceptedInvocation } from '../../src/client/generic/AcceptedInvocation';
import { Invocation } from '../../src/client/generic/Invocation';
import { createInvocationInfo } from './client-mocks';
import { GenericInvocationsHost } from '../../src/client/api/generic/GenericInvocationsHost';
import { when, mock, instance, anything, verify } from 'ts-mockito';
import { GenericClientImpl } from '../../src/client/generic/GenericClientImpl';
import { Observer } from '@plexus-interop/common';
import { clientProtocol as plexus, SuccessCompletion } from '@plexus-interop/protocol';
import { Subscription, Unsubscribable as AnonymousSubscription } from 'rxjs';
import { ChannelObserver } from '@plexus-interop/transport-common';
import { MethodInvocationContext } from '@plexus-interop/client-api';
import { InvocationObserver, UnaryHandlerConverter } from '../../src/client';
import { ServerStreamingInvocationHandler } from '../../src/client/api/generic/handlers/streaming/ServerStreamingInvocationHandler';
import { ServerStreamingConverter } from '../../src/client/api/generic/handlers/streaming/converters';
import { StreamingInvocationClient } from '../../src/client/api/generic/handlers/streaming/StreamingInvocationClient';
import { InvocationHandlersRegistry } from '../../src/client/api/generic/handlers/InvocationHandlersRegistry';
import { ProtoMarshallerProvider } from '@plexus-interop/io/dist/main/src/static';

declare var process: any;

process.on('unhandledRejection', (reason: any, p: any) => {
    // tslint:disable-next-line:no-console
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

describe('GenericInvocationHost', () => {

    it('Can handle invocoming invocation and send response back', async (done) => {

        const responsePayload = new Uint8Array([1, 2, 3]).buffer;
        const requestPayload = new Uint8Array([3, 2, 1]).buffer;

        setupSimpleHostedInvocation(requestPayload, async (completion: plexus.ICompletion) => {
            done();
            return new SuccessCompletion();
        }, async (context: MethodInvocationContext, request: ArrayBuffer) => {
            // tslint:disable-next-line:no-console
            console.log('Doing important stuff ...');
            return responsePayload;
        }, (invocation) => {
            verify(invocation.sendMessage(responsePayload)).called();
        });

    });

    it('Closes invocation with error on if execution rejected', async (done) => {

        const requestPayload = new Uint8Array([3, 2, 1]).buffer;

        setupSimpleHostedInvocation(requestPayload, async (completion: plexus.ICompletion) => {
            expect(completion).toBeDefined();
            expect(completion.status).toEqual(plexus.Completion.Status.Failed);
            expect(completion.error).toBeDefined();
            done();
            return new SuccessCompletion();
        }, (context: MethodInvocationContext, request: ArrayBuffer) => Promise.reject('Execution error'));

    });

    it('Closes invocation with error on if execution failed', async (done) => {

        const requestPayload = new Uint8Array([3, 2, 1]).buffer;

        setupSimpleHostedInvocation(requestPayload, async (completion: plexus.ICompletion) => {
            expect(completion).toBeDefined();
            expect(completion.status).toEqual(plexus.Completion.Status.Failed);
            expect(completion.error).toBeDefined();
            done();
            return new SuccessCompletion();
        }, (context: MethodInvocationContext, request: ArrayBuffer) => { throw new Error('Execution error'); });

    });

    it('Can receive multiple messages, send multiple responses back and complete invocation', async (done) => {
        const requestPayload = new Uint8Array([3, 2, 1]).buffer;
        const responsePayload = new Uint8Array([1, 2, 3]).buffer;
        setupHostedInvocation(requestPayload, async (completion: plexus.ICompletion) => {
            done();
            return new SuccessCompletion();
        }, (context: MethodInvocationContext, client) => {
            let count = 0;
            return {
                next: request => {
                    expect(request).toBe(requestPayload);
                    count++;
                    client.next(responsePayload);
                    if (count === 3) {
                        client.complete();
                    }
                },
                error: e => { },
                complete: () => { },
                streamCompleted: () => { }
            };
        }, (invocation) => {
        }, 3);
    });

    it('Can send multiple responses back and complete invocation with Server Streaming handler', (done) => {

        const requestPayload = new Uint8Array([3, 2, 1]).buffer;
        const responsePayload = new Uint8Array([1, 2, 3]).buffer;

        const streamingHandler: ServerStreamingInvocationHandler<ArrayBuffer, ArrayBuffer> = {
            ...baseHandler(),
            handle: (context: MethodInvocationContext, receivedRequest: ArrayBuffer, invocationHostClient: StreamingInvocationClient<ArrayBuffer>) => {
                expect(receivedRequest).toBe(requestPayload);
                invocationHostClient.next(responsePayload);
                invocationHostClient.next(responsePayload);
                invocationHostClient.complete();
            }
        };

        setupServerStreamingHostedInvocation(

            requestPayload,

            (completion: plexus.ICompletion) => Promise.resolve(new SuccessCompletion()),

            streamingHandler,

            (invocation: Invocation) => {
                verify(invocation.sendMessage(responsePayload)).twice();
                verify(invocation.close(anything())).called();
                done();
            });
    });

});

function setupSimpleHostedInvocation(
    requestPayload: ArrayBuffer,
    invocationCloseHandler: (x: plexus.ICompletion) => Promise<plexus.ICompletion>,
    hostedAction: (context: MethodInvocationContext, request: ArrayBuffer) => Promise<ArrayBuffer>,
    postHandler?: (invocation: Invocation) => void): void {

    const streamingHandler = new UnaryHandlerConverter().convert({
        ...baseHandler(),
        handle: hostedAction
    });

    setupHostedInvocation(requestPayload, invocationCloseHandler, streamingHandler.handle, postHandler);
}

function setupServerStreamingHostedInvocation(
    requestPayload: ArrayBuffer,
    invocationCloseHandler: (x: plexus.ICompletion) => Promise<plexus.ICompletion>,
    serverStreamingHandler: ServerStreamingInvocationHandler<ArrayBuffer, ArrayBuffer>,
    postHandler?: (invocation: Invocation) => void): void {

    const streamingHandler = new ServerStreamingConverter().convert(serverStreamingHandler);

    setupHostedInvocation(requestPayload, invocationCloseHandler, streamingHandler.handle, postHandler);
}

function setupHostedInvocation(
    requestPayload: ArrayBuffer,
    invocationCloseHandler: (x: plexus.ICompletion) => Promise<plexus.ICompletion>,
    hostedAction: (context: MethodInvocationContext, invocationHostClient: StreamingInvocationClient<ArrayBuffer>) => InvocationObserver<ArrayBuffer>,
    postHandler?: (invocation: Invocation) => void,
    requestMessagesCount: number = 1): void {

    const invocationInfo = createInvocationInfo();
    const mockInvocation = mock(AcceptedInvocation);

    when(mockInvocation.getMetaInfo()).thenReturn(invocationInfo);
    when(mockInvocation.sendMessage(anything())).thenReturn(Promise.resolve());
    when(mockInvocation.close(anything())).thenCall((completion: plexus.ICompletion) => {
        if (postHandler) {
            postHandler(mockInvocation);
        }
        invocationCloseHandler(completion);
        return Promise.resolve(new SuccessCompletion());
    });
    when(mockInvocation.open(anything())).thenCall((observer: ChannelObserver<AnonymousSubscription, ArrayBuffer>) => {
        setTimeout(() => {
            observer.started(new Subscription());
            setTimeout(() => {
                for (let i = 0; i < requestMessagesCount; i++) {
                    observer.next(requestPayload);
                }
                observer.complete();
            }, 0);
        }, 0);
    });

    const mockInvocationInstance = instance(mockInvocation);

    const mockGenericClient = mock(GenericClientImpl);
    when(mockGenericClient.acceptInvocations(anything())).thenCall((observer: Observer<Invocation>) => {
        setTimeout(() => {
            observer.next(mockInvocationInstance);
            observer.complete();
        }, 0);
        return Promise.resolve();
    });
    const mockGenericClientInstance = instance(mockGenericClient);
    const registry = new InvocationHandlersRegistry(new ProtoMarshallerProvider());
    registry.registerBidiStreamingGenericHandler({
        ...baseHandler(),
        handle: hostedAction
    });

    const invocationHost = new GenericInvocationsHost(mockGenericClientInstance, registry);

    invocationHost.start();
}

// tslint:disable-next-line:typedef
function baseHandler() {
    const invocationInfo = createInvocationInfo();
    return {
        serviceInfo: {
            serviceId: invocationInfo.serviceId as string,
            serviceAlias: invocationInfo.serviceAlias
        },
        methodId: invocationInfo.methodId as string,
        handle: () => { }
    };
}