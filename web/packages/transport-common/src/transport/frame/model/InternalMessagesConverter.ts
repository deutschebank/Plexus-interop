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
import { transportProtocol as plexus } from '@plexus-interop/protocol';
import { Arrays } from '@plexus-interop/common';
import { Frame } from './Frame';
import { ConnectionOpenFrame } from './ConnectionOpenFrame';
import { ChannelCloseFrame } from './ChannelCloseFrame';
import { ChannelOpenFrame } from './ChannelOpenFrame';
import { ConnectionCloseFrame } from './ConnectionCloseFrame';
import { MessageFrame } from './MessageFrame';

export class InternalMessagesConverter {

    public deserialize(data: Uint8Array): Frame {
        const protoFrame: plexus.interop.transport.protocol.Header = plexus.interop.transport.protocol.Header.decode(data);
        const plainData = plexus.interop.transport.protocol.Header.toObject(protoFrame) as plexus.interop.transport.protocol.IHeader;
        if (plainData.channelClose) {
            return new ChannelCloseFrame(plainData);
        } if (plainData.channelOpen) {
            return new ChannelOpenFrame(plainData);
        } if (plainData.close) {
            return new ConnectionCloseFrame(plainData);
        } if (plainData.messageFrame) {
            return new MessageFrame(plainData);
        } if (plainData.open) {
            return new ConnectionOpenFrame(plainData);
        } 
            throw new Error('Unsupported frame type');
        
    }

    public serialize(frame: Frame): ArrayBuffer {
        return Arrays.toArrayBuffer(plexus.interop.transport.protocol.Header.encode(
            frame.internalHeaderProperties
        ).finish());
    }

}
