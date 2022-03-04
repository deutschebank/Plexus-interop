import * as $protobuf from "protobufjs";
/** Namespace interop. */
export namespace interop {

    /** Represents an AppLauncherService */
    class AppLauncherService extends $protobuf.rpc.Service {

        /**
         * Constructs a new AppLauncherService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new AppLauncherService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): AppLauncherService;

        /**
         * Calls Launch.
         * @param request AppLaunchRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AppLaunchResponse
         */
        public launch(request: interop.IAppLaunchRequest, callback: interop.AppLauncherService.LaunchCallback): void;

        /**
         * Calls Launch.
         * @param request AppLaunchRequest message or plain object
         * @returns Promise
         */
        public launch(request: interop.IAppLaunchRequest): Promise<interop.AppLaunchResponse>;

        /**
         * Calls AppLaunchedEventStream.
         * @param request Empty message or plain object
         * @param callback Node-style callback called with the error, if any, and AppLaunchedEvent
         */
        public appLaunchedEventStream(request: google.protobuf.IEmpty, callback: interop.AppLauncherService.AppLaunchedEventStreamCallback): void;

        /**
         * Calls AppLaunchedEventStream.
         * @param request Empty message or plain object
         * @returns Promise
         */
        public appLaunchedEventStream(request: google.protobuf.IEmpty): Promise<interop.AppLaunchedEvent>;
    }

    namespace AppLauncherService {

        /**
         * Callback as used by {@link interop.AppLauncherService#launch}.
         * @param error Error, if any
         * @param [response] AppLaunchResponse
         */
        type LaunchCallback = (error: (Error|null), response?: interop.AppLaunchResponse) => void;

        /**
         * Callback as used by {@link interop.AppLauncherService#appLaunchedEventStream}.
         * @param error Error, if any
         * @param [response] AppLaunchedEvent
         */
        type AppLaunchedEventStreamCallback = (error: (Error|null), response?: interop.AppLaunchedEvent) => void;
    }

    /** Properties of an AppLaunchRequest. */
    interface IAppLaunchRequest {

        /** AppLaunchRequest appId */
        appId?: (string|null);

        /** AppLaunchRequest launchParamsJson */
        launchParamsJson?: (string|null);

        /** AppLaunchRequest launchMode */
        launchMode?: (interop.AppLaunchMode|null);

        /** AppLaunchRequest suggestedAppInstanceId */
        suggestedAppInstanceId?: (interop.IUniqueId|null);

        /** AppLaunchRequest referrer */
        referrer?: (interop.IAppLaunchReferrer|null);
    }

    /** Represents an AppLaunchRequest. */
    class AppLaunchRequest implements IAppLaunchRequest {

        /**
         * Constructs a new AppLaunchRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: interop.IAppLaunchRequest);

        /** AppLaunchRequest appId. */
        public appId: string;

        /** AppLaunchRequest launchParamsJson. */
        public launchParamsJson: string;

        /** AppLaunchRequest launchMode. */
        public launchMode: interop.AppLaunchMode;

        /** AppLaunchRequest suggestedAppInstanceId. */
        public suggestedAppInstanceId?: (interop.IUniqueId|null);

        /** AppLaunchRequest referrer. */
        public referrer?: (interop.IAppLaunchReferrer|null);

        /**
         * Creates a new AppLaunchRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AppLaunchRequest instance
         */
        public static create(properties?: interop.IAppLaunchRequest): interop.AppLaunchRequest;

        /**
         * Encodes the specified AppLaunchRequest message. Does not implicitly {@link interop.AppLaunchRequest.verify|verify} messages.
         * @param message AppLaunchRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: interop.IAppLaunchRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AppLaunchRequest message, length delimited. Does not implicitly {@link interop.AppLaunchRequest.verify|verify} messages.
         * @param message AppLaunchRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: interop.IAppLaunchRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AppLaunchRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AppLaunchRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): interop.AppLaunchRequest;

        /**
         * Decodes an AppLaunchRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AppLaunchRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): interop.AppLaunchRequest;

        /**
         * Verifies an AppLaunchRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AppLaunchRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AppLaunchRequest
         */
        public static fromObject(object: { [k: string]: any }): interop.AppLaunchRequest;

        /**
         * Creates a plain object from an AppLaunchRequest message. Also converts values to other types if specified.
         * @param message AppLaunchRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: interop.AppLaunchRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AppLaunchRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AppLaunchReferrer. */
    interface IAppLaunchReferrer {

        /** AppLaunchReferrer appId */
        appId?: (string|null);

        /** AppLaunchReferrer appInstanceId */
        appInstanceId?: (interop.IUniqueId|null);

        /** AppLaunchReferrer connectionId */
        connectionId?: (interop.IUniqueId|null);
    }

    /** Represents an AppLaunchReferrer. */
    class AppLaunchReferrer implements IAppLaunchReferrer {

        /**
         * Constructs a new AppLaunchReferrer.
         * @param [properties] Properties to set
         */
        constructor(properties?: interop.IAppLaunchReferrer);

        /** AppLaunchReferrer appId. */
        public appId: string;

        /** AppLaunchReferrer appInstanceId. */
        public appInstanceId?: (interop.IUniqueId|null);

        /** AppLaunchReferrer connectionId. */
        public connectionId?: (interop.IUniqueId|null);

        /**
         * Creates a new AppLaunchReferrer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AppLaunchReferrer instance
         */
        public static create(properties?: interop.IAppLaunchReferrer): interop.AppLaunchReferrer;

        /**
         * Encodes the specified AppLaunchReferrer message. Does not implicitly {@link interop.AppLaunchReferrer.verify|verify} messages.
         * @param message AppLaunchReferrer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: interop.IAppLaunchReferrer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AppLaunchReferrer message, length delimited. Does not implicitly {@link interop.AppLaunchReferrer.verify|verify} messages.
         * @param message AppLaunchReferrer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: interop.IAppLaunchReferrer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AppLaunchReferrer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AppLaunchReferrer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): interop.AppLaunchReferrer;

        /**
         * Decodes an AppLaunchReferrer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AppLaunchReferrer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): interop.AppLaunchReferrer;

        /**
         * Verifies an AppLaunchReferrer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AppLaunchReferrer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AppLaunchReferrer
         */
        public static fromObject(object: { [k: string]: any }): interop.AppLaunchReferrer;

        /**
         * Creates a plain object from an AppLaunchReferrer message. Also converts values to other types if specified.
         * @param message AppLaunchReferrer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: interop.AppLaunchReferrer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AppLaunchReferrer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AppLaunchResponse. */
    interface IAppLaunchResponse {

        /** AppLaunchResponse appInstanceId */
        appInstanceId?: (interop.IUniqueId|null);
    }

    /** Represents an AppLaunchResponse. */
    class AppLaunchResponse implements IAppLaunchResponse {

        /**
         * Constructs a new AppLaunchResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: interop.IAppLaunchResponse);

        /** AppLaunchResponse appInstanceId. */
        public appInstanceId?: (interop.IUniqueId|null);

        /**
         * Creates a new AppLaunchResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AppLaunchResponse instance
         */
        public static create(properties?: interop.IAppLaunchResponse): interop.AppLaunchResponse;

        /**
         * Encodes the specified AppLaunchResponse message. Does not implicitly {@link interop.AppLaunchResponse.verify|verify} messages.
         * @param message AppLaunchResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: interop.IAppLaunchResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AppLaunchResponse message, length delimited. Does not implicitly {@link interop.AppLaunchResponse.verify|verify} messages.
         * @param message AppLaunchResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: interop.IAppLaunchResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AppLaunchResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AppLaunchResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): interop.AppLaunchResponse;

        /**
         * Decodes an AppLaunchResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AppLaunchResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): interop.AppLaunchResponse;

        /**
         * Verifies an AppLaunchResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AppLaunchResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AppLaunchResponse
         */
        public static fromObject(object: { [k: string]: any }): interop.AppLaunchResponse;

        /**
         * Creates a plain object from an AppLaunchResponse message. Also converts values to other types if specified.
         * @param message AppLaunchResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: interop.AppLaunchResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AppLaunchResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AppLaunchedEvent. */
    interface IAppLaunchedEvent {

        /** AppLaunchedEvent appInstanceId */
        appInstanceId?: (interop.IUniqueId|null);

        /** AppLaunchedEvent appIds */
        appIds?: (string[]|null);

        /** AppLaunchedEvent referrer */
        referrer?: (interop.IAppLaunchReferrer|null);
    }

    /** Represents an AppLaunchedEvent. */
    class AppLaunchedEvent implements IAppLaunchedEvent {

        /**
         * Constructs a new AppLaunchedEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: interop.IAppLaunchedEvent);

        /** AppLaunchedEvent appInstanceId. */
        public appInstanceId?: (interop.IUniqueId|null);

        /** AppLaunchedEvent appIds. */
        public appIds: string[];

        /** AppLaunchedEvent referrer. */
        public referrer?: (interop.IAppLaunchReferrer|null);

        /**
         * Creates a new AppLaunchedEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AppLaunchedEvent instance
         */
        public static create(properties?: interop.IAppLaunchedEvent): interop.AppLaunchedEvent;

        /**
         * Encodes the specified AppLaunchedEvent message. Does not implicitly {@link interop.AppLaunchedEvent.verify|verify} messages.
         * @param message AppLaunchedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: interop.IAppLaunchedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AppLaunchedEvent message, length delimited. Does not implicitly {@link interop.AppLaunchedEvent.verify|verify} messages.
         * @param message AppLaunchedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: interop.IAppLaunchedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AppLaunchedEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AppLaunchedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): interop.AppLaunchedEvent;

        /**
         * Decodes an AppLaunchedEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AppLaunchedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): interop.AppLaunchedEvent;

        /**
         * Verifies an AppLaunchedEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AppLaunchedEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AppLaunchedEvent
         */
        public static fromObject(object: { [k: string]: any }): interop.AppLaunchedEvent;

        /**
         * Creates a plain object from an AppLaunchedEvent message. Also converts values to other types if specified.
         * @param message AppLaunchedEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: interop.AppLaunchedEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AppLaunchedEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** AppLaunchMode enum. */
    enum AppLaunchMode {
        SINGLE_INSTANCE = 0,
        MULTI_INSTANCE = 1
    }

    /** Properties of an UniqueId. */
    interface IUniqueId {

        /** UniqueId lo */
        lo?: (Long|null);

        /** UniqueId hi */
        hi?: (Long|null);
    }

    /** Represents an UniqueId. */
    class UniqueId implements IUniqueId {

        /**
         * Constructs a new UniqueId.
         * @param [properties] Properties to set
         */
        constructor(properties?: interop.IUniqueId);

        /** UniqueId lo. */
        public lo: Long;

        /** UniqueId hi. */
        public hi: Long;

        /**
         * Creates a new UniqueId instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UniqueId instance
         */
        public static create(properties?: interop.IUniqueId): interop.UniqueId;

        /**
         * Encodes the specified UniqueId message. Does not implicitly {@link interop.UniqueId.verify|verify} messages.
         * @param message UniqueId message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: interop.IUniqueId, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UniqueId message, length delimited. Does not implicitly {@link interop.UniqueId.verify|verify} messages.
         * @param message UniqueId message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: interop.IUniqueId, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UniqueId message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UniqueId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): interop.UniqueId;

        /**
         * Decodes an UniqueId message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UniqueId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): interop.UniqueId;

        /**
         * Verifies an UniqueId message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UniqueId message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UniqueId
         */
        public static fromObject(object: { [k: string]: any }): interop.UniqueId;

        /**
         * Creates a plain object from an UniqueId message. Also converts values to other types if specified.
         * @param message UniqueId
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: interop.UniqueId, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UniqueId to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Empty. */
        interface IEmpty {
        }

        /** Represents an Empty. */
        class Empty implements IEmpty {

            /**
             * Constructs a new Empty.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEmpty);

            /**
             * Creates a new Empty instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Empty instance
             */
            public static create(properties?: google.protobuf.IEmpty): google.protobuf.Empty;

            /**
             * Encodes the specified Empty message. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @param message Empty message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Empty message, length delimited. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @param message Empty message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Empty message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Empty;

            /**
             * Decodes an Empty message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Empty;

            /**
             * Verifies an Empty message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Empty
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Empty;

            /**
             * Creates a plain object from an Empty message. Also converts values to other types if specified.
             * @param message Empty
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Empty, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Empty to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
