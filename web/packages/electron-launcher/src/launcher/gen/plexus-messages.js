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
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
'use strict';

var $protobuf = require('protobufjs/minimal');

// Common aliases
var $Reader = $protobuf.Reader,
  $Writer = $protobuf.Writer,
  $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots.launcher || ($protobuf.roots.launcher = {});

$root.interop = (function () {
  /**
   * Namespace interop.
   * @exports interop
   * @namespace
   */
  var interop = {};

  interop.AppLauncherService = (function () {
    /**
     * Constructs a new AppLauncherService service.
     * @memberof interop
     * @classdesc Represents an AppLauncherService
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    function AppLauncherService(rpcImpl, requestDelimited, responseDelimited) {
      $protobuf.rpc.Service.call(
        this,
        rpcImpl,
        requestDelimited,
        responseDelimited
      );
    }

    (AppLauncherService.prototype = Object.create(
      $protobuf.rpc.Service.prototype
    )).constructor = AppLauncherService;

    /**
     * Creates new AppLauncherService service using the specified rpc implementation.
     * @function create
     * @memberof interop.AppLauncherService
     * @static
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     * @returns {AppLauncherService} RPC service. Useful where requests and/or responses are streamed.
     */
    AppLauncherService.create = function create(
      rpcImpl,
      requestDelimited,
      responseDelimited
    ) {
      return new this(rpcImpl, requestDelimited, responseDelimited);
    };

    /**
     * Callback as used by {@link interop.AppLauncherService#launch}.
     * @memberof interop.AppLauncherService
     * @typedef LaunchCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {interop.AppLaunchResponse} [response] AppLaunchResponse
     */

    /**
     * Calls Launch.
     * @function launch
     * @memberof interop.AppLauncherService
     * @instance
     * @param {interop.IAppLaunchRequest} request AppLaunchRequest message or plain object
     * @param {interop.AppLauncherService.LaunchCallback} callback Node-style callback called with the error, if any, and AppLaunchResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(
      (AppLauncherService.prototype.launch = function launch(
        request,
        callback
      ) {
        return this.rpcCall(
          launch,
          $root.interop.AppLaunchRequest,
          $root.interop.AppLaunchResponse,
          request,
          callback
        );
      }),
      'name',
      { value: 'Launch' }
    );

    /**
     * Calls Launch.
     * @function launch
     * @memberof interop.AppLauncherService
     * @instance
     * @param {interop.IAppLaunchRequest} request AppLaunchRequest message or plain object
     * @returns {Promise<interop.AppLaunchResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link interop.AppLauncherService#appLaunchedEventStream}.
     * @memberof interop.AppLauncherService
     * @typedef AppLaunchedEventStreamCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {interop.AppLaunchedEvent} [response] AppLaunchedEvent
     */

    /**
     * Calls AppLaunchedEventStream.
     * @function appLaunchedEventStream
     * @memberof interop.AppLauncherService
     * @instance
     * @param {google.protobuf.IEmpty} request Empty message or plain object
     * @param {interop.AppLauncherService.AppLaunchedEventStreamCallback} callback Node-style callback called with the error, if any, and AppLaunchedEvent
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(
      (AppLauncherService.prototype.appLaunchedEventStream =
        function appLaunchedEventStream(request, callback) {
          return this.rpcCall(
            appLaunchedEventStream,
            $root.google.protobuf.Empty,
            $root.interop.AppLaunchedEvent,
            request,
            callback
          );
        }),
      'name',
      { value: 'AppLaunchedEventStream' }
    );

    /**
     * Calls AppLaunchedEventStream.
     * @function appLaunchedEventStream
     * @memberof interop.AppLauncherService
     * @instance
     * @param {google.protobuf.IEmpty} request Empty message or plain object
     * @returns {Promise<interop.AppLaunchedEvent>} Promise
     * @variation 2
     */

    return AppLauncherService;
  })();

  interop.AppLaunchRequest = (function () {
    /**
     * Properties of an AppLaunchRequest.
     * @memberof interop
     * @interface IAppLaunchRequest
     * @property {string|null} [appId] AppLaunchRequest appId
     * @property {string|null} [launchParamsJson] AppLaunchRequest launchParamsJson
     * @property {interop.AppLaunchMode|null} [launchMode] AppLaunchRequest launchMode
     * @property {interop.IUniqueId|null} [suggestedAppInstanceId] AppLaunchRequest suggestedAppInstanceId
     * @property {interop.IAppLaunchReferrer|null} [referrer] AppLaunchRequest referrer
     */

    /**
     * Constructs a new AppLaunchRequest.
     * @memberof interop
     * @classdesc Represents an AppLaunchRequest.
     * @implements IAppLaunchRequest
     * @constructor
     * @param {interop.IAppLaunchRequest=} [properties] Properties to set
     */
    function AppLaunchRequest(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * AppLaunchRequest appId.
     * @member {string} appId
     * @memberof interop.AppLaunchRequest
     * @instance
     */
    AppLaunchRequest.prototype.appId = '';

    /**
     * AppLaunchRequest launchParamsJson.
     * @member {string} launchParamsJson
     * @memberof interop.AppLaunchRequest
     * @instance
     */
    AppLaunchRequest.prototype.launchParamsJson = '';

    /**
     * AppLaunchRequest launchMode.
     * @member {interop.AppLaunchMode} launchMode
     * @memberof interop.AppLaunchRequest
     * @instance
     */
    AppLaunchRequest.prototype.launchMode = 0;

    /**
     * AppLaunchRequest suggestedAppInstanceId.
     * @member {interop.IUniqueId|null|undefined} suggestedAppInstanceId
     * @memberof interop.AppLaunchRequest
     * @instance
     */
    AppLaunchRequest.prototype.suggestedAppInstanceId = null;

    /**
     * AppLaunchRequest referrer.
     * @member {interop.IAppLaunchReferrer|null|undefined} referrer
     * @memberof interop.AppLaunchRequest
     * @instance
     */
    AppLaunchRequest.prototype.referrer = null;

    /**
     * Creates a new AppLaunchRequest instance using the specified properties.
     * @function create
     * @memberof interop.AppLaunchRequest
     * @static
     * @param {interop.IAppLaunchRequest=} [properties] Properties to set
     * @returns {interop.AppLaunchRequest} AppLaunchRequest instance
     */
    AppLaunchRequest.create = function create(properties) {
      return new AppLaunchRequest(properties);
    };

    /**
     * Encodes the specified AppLaunchRequest message. Does not implicitly {@link interop.AppLaunchRequest.verify|verify} messages.
     * @function encode
     * @memberof interop.AppLaunchRequest
     * @static
     * @param {interop.IAppLaunchRequest} message AppLaunchRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AppLaunchRequest.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.appId != null && Object.hasOwnProperty.call(message, 'appId'))
        writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.appId);
      if (
        message.launchParamsJson != null &&
        Object.hasOwnProperty.call(message, 'launchParamsJson')
      )
        writer
          .uint32(/* id 2, wireType 2 =*/ 18)
          .string(message.launchParamsJson);
      if (
        message.launchMode != null &&
        Object.hasOwnProperty.call(message, 'launchMode')
      )
        writer.uint32(/* id 3, wireType 0 =*/ 24).int32(message.launchMode);
      if (
        message.suggestedAppInstanceId != null &&
        Object.hasOwnProperty.call(message, 'suggestedAppInstanceId')
      )
        $root.interop.UniqueId.encode(
          message.suggestedAppInstanceId,
          writer.uint32(/* id 4, wireType 2 =*/ 34).fork()
        ).ldelim();
      if (
        message.referrer != null &&
        Object.hasOwnProperty.call(message, 'referrer')
      )
        $root.interop.AppLaunchReferrer.encode(
          message.referrer,
          writer.uint32(/* id 5, wireType 2 =*/ 42).fork()
        ).ldelim();
      return writer;
    };

    /**
     * Encodes the specified AppLaunchRequest message, length delimited. Does not implicitly {@link interop.AppLaunchRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof interop.AppLaunchRequest
     * @static
     * @param {interop.IAppLaunchRequest} message AppLaunchRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AppLaunchRequest.encodeDelimited = function encodeDelimited(
      message,
      writer
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AppLaunchRequest message from the specified reader or buffer.
     * @function decode
     * @memberof interop.AppLaunchRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {interop.AppLaunchRequest} AppLaunchRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AppLaunchRequest.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.interop.AppLaunchRequest();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1: {
            message.appId = reader.string();
            break;
          }
          case 2: {
            message.launchParamsJson = reader.string();
            break;
          }
          case 3: {
            message.launchMode = reader.int32();
            break;
          }
          case 4: {
            message.suggestedAppInstanceId = $root.interop.UniqueId.decode(
              reader,
              reader.uint32()
            );
            break;
          }
          case 5: {
            message.referrer = $root.interop.AppLaunchReferrer.decode(
              reader,
              reader.uint32()
            );
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes an AppLaunchRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof interop.AppLaunchRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {interop.AppLaunchRequest} AppLaunchRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AppLaunchRequest.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AppLaunchRequest message.
     * @function verify
     * @memberof interop.AppLaunchRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AppLaunchRequest.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (message.appId != null && message.hasOwnProperty('appId'))
        if (!$util.isString(message.appId)) return 'appId: string expected';
      if (
        message.launchParamsJson != null &&
        message.hasOwnProperty('launchParamsJson')
      )
        if (!$util.isString(message.launchParamsJson))
          return 'launchParamsJson: string expected';
      if (message.launchMode != null && message.hasOwnProperty('launchMode'))
        switch (message.launchMode) {
          default:
            return 'launchMode: enum value expected';
          case 0:
          case 1:
            break;
        }
      if (
        message.suggestedAppInstanceId != null &&
        message.hasOwnProperty('suggestedAppInstanceId')
      ) {
        var error = $root.interop.UniqueId.verify(
          message.suggestedAppInstanceId
        );
        if (error) return 'suggestedAppInstanceId.' + error;
      }
      if (message.referrer != null && message.hasOwnProperty('referrer')) {
        var error = $root.interop.AppLaunchReferrer.verify(message.referrer);
        if (error) return 'referrer.' + error;
      }
      return null;
    };

    /**
     * Creates an AppLaunchRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof interop.AppLaunchRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {interop.AppLaunchRequest} AppLaunchRequest
     */
    AppLaunchRequest.fromObject = function fromObject(object) {
      if (object instanceof $root.interop.AppLaunchRequest) return object;
      var message = new $root.interop.AppLaunchRequest();
      if (object.appId != null) message.appId = String(object.appId);
      if (object.launchParamsJson != null)
        message.launchParamsJson = String(object.launchParamsJson);
      switch (object.launchMode) {
        default:
          if (typeof object.launchMode === 'number') {
            message.launchMode = object.launchMode;
            break;
          }
          break;
        case 'SINGLE_INSTANCE':
        case 0:
          message.launchMode = 0;
          break;
        case 'MULTI_INSTANCE':
        case 1:
          message.launchMode = 1;
          break;
      }
      if (object.suggestedAppInstanceId != null) {
        if (typeof object.suggestedAppInstanceId !== 'object')
          throw TypeError(
            '.interop.AppLaunchRequest.suggestedAppInstanceId: object expected'
          );
        message.suggestedAppInstanceId = $root.interop.UniqueId.fromObject(
          object.suggestedAppInstanceId
        );
      }
      if (object.referrer != null) {
        if (typeof object.referrer !== 'object')
          throw TypeError(
            '.interop.AppLaunchRequest.referrer: object expected'
          );
        message.referrer = $root.interop.AppLaunchReferrer.fromObject(
          object.referrer
        );
      }
      return message;
    };

    /**
     * Creates a plain object from an AppLaunchRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof interop.AppLaunchRequest
     * @static
     * @param {interop.AppLaunchRequest} message AppLaunchRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AppLaunchRequest.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.appId = '';
        object.launchParamsJson = '';
        object.launchMode = options.enums === String ? 'SINGLE_INSTANCE' : 0;
        object.suggestedAppInstanceId = null;
        object.referrer = null;
      }
      if (message.appId != null && message.hasOwnProperty('appId'))
        object.appId = message.appId;
      if (
        message.launchParamsJson != null &&
        message.hasOwnProperty('launchParamsJson')
      )
        object.launchParamsJson = message.launchParamsJson;
      if (message.launchMode != null && message.hasOwnProperty('launchMode'))
        object.launchMode =
          options.enums === String
            ? $root.interop.AppLaunchMode[message.launchMode] === undefined
              ? message.launchMode
              : $root.interop.AppLaunchMode[message.launchMode]
            : message.launchMode;
      if (
        message.suggestedAppInstanceId != null &&
        message.hasOwnProperty('suggestedAppInstanceId')
      )
        object.suggestedAppInstanceId = $root.interop.UniqueId.toObject(
          message.suggestedAppInstanceId,
          options
        );
      if (message.referrer != null && message.hasOwnProperty('referrer'))
        object.referrer = $root.interop.AppLaunchReferrer.toObject(
          message.referrer,
          options
        );
      return object;
    };

    /**
     * Converts this AppLaunchRequest to JSON.
     * @function toJSON
     * @memberof interop.AppLaunchRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AppLaunchRequest.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for AppLaunchRequest
     * @function getTypeUrl
     * @memberof interop.AppLaunchRequest
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    AppLaunchRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = 'type.googleapis.com';
      }
      return typeUrlPrefix + '/interop.AppLaunchRequest';
    };

    return AppLaunchRequest;
  })();

  interop.AppLaunchReferrer = (function () {
    /**
     * Properties of an AppLaunchReferrer.
     * @memberof interop
     * @interface IAppLaunchReferrer
     * @property {string|null} [appId] AppLaunchReferrer appId
     * @property {interop.IUniqueId|null} [appInstanceId] AppLaunchReferrer appInstanceId
     * @property {interop.IUniqueId|null} [connectionId] AppLaunchReferrer connectionId
     */

    /**
     * Constructs a new AppLaunchReferrer.
     * @memberof interop
     * @classdesc Represents an AppLaunchReferrer.
     * @implements IAppLaunchReferrer
     * @constructor
     * @param {interop.IAppLaunchReferrer=} [properties] Properties to set
     */
    function AppLaunchReferrer(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * AppLaunchReferrer appId.
     * @member {string} appId
     * @memberof interop.AppLaunchReferrer
     * @instance
     */
    AppLaunchReferrer.prototype.appId = '';

    /**
     * AppLaunchReferrer appInstanceId.
     * @member {interop.IUniqueId|null|undefined} appInstanceId
     * @memberof interop.AppLaunchReferrer
     * @instance
     */
    AppLaunchReferrer.prototype.appInstanceId = null;

    /**
     * AppLaunchReferrer connectionId.
     * @member {interop.IUniqueId|null|undefined} connectionId
     * @memberof interop.AppLaunchReferrer
     * @instance
     */
    AppLaunchReferrer.prototype.connectionId = null;

    /**
     * Creates a new AppLaunchReferrer instance using the specified properties.
     * @function create
     * @memberof interop.AppLaunchReferrer
     * @static
     * @param {interop.IAppLaunchReferrer=} [properties] Properties to set
     * @returns {interop.AppLaunchReferrer} AppLaunchReferrer instance
     */
    AppLaunchReferrer.create = function create(properties) {
      return new AppLaunchReferrer(properties);
    };

    /**
     * Encodes the specified AppLaunchReferrer message. Does not implicitly {@link interop.AppLaunchReferrer.verify|verify} messages.
     * @function encode
     * @memberof interop.AppLaunchReferrer
     * @static
     * @param {interop.IAppLaunchReferrer} message AppLaunchReferrer message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AppLaunchReferrer.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.appId != null && Object.hasOwnProperty.call(message, 'appId'))
        writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.appId);
      if (
        message.appInstanceId != null &&
        Object.hasOwnProperty.call(message, 'appInstanceId')
      )
        $root.interop.UniqueId.encode(
          message.appInstanceId,
          writer.uint32(/* id 2, wireType 2 =*/ 18).fork()
        ).ldelim();
      if (
        message.connectionId != null &&
        Object.hasOwnProperty.call(message, 'connectionId')
      )
        $root.interop.UniqueId.encode(
          message.connectionId,
          writer.uint32(/* id 3, wireType 2 =*/ 26).fork()
        ).ldelim();
      return writer;
    };

    /**
     * Encodes the specified AppLaunchReferrer message, length delimited. Does not implicitly {@link interop.AppLaunchReferrer.verify|verify} messages.
     * @function encodeDelimited
     * @memberof interop.AppLaunchReferrer
     * @static
     * @param {interop.IAppLaunchReferrer} message AppLaunchReferrer message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AppLaunchReferrer.encodeDelimited = function encodeDelimited(
      message,
      writer
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AppLaunchReferrer message from the specified reader or buffer.
     * @function decode
     * @memberof interop.AppLaunchReferrer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {interop.AppLaunchReferrer} AppLaunchReferrer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AppLaunchReferrer.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.interop.AppLaunchReferrer();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1: {
            message.appId = reader.string();
            break;
          }
          case 2: {
            message.appInstanceId = $root.interop.UniqueId.decode(
              reader,
              reader.uint32()
            );
            break;
          }
          case 3: {
            message.connectionId = $root.interop.UniqueId.decode(
              reader,
              reader.uint32()
            );
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes an AppLaunchReferrer message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof interop.AppLaunchReferrer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {interop.AppLaunchReferrer} AppLaunchReferrer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AppLaunchReferrer.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AppLaunchReferrer message.
     * @function verify
     * @memberof interop.AppLaunchReferrer
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AppLaunchReferrer.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (message.appId != null && message.hasOwnProperty('appId'))
        if (!$util.isString(message.appId)) return 'appId: string expected';
      if (
        message.appInstanceId != null &&
        message.hasOwnProperty('appInstanceId')
      ) {
        var error = $root.interop.UniqueId.verify(message.appInstanceId);
        if (error) return 'appInstanceId.' + error;
      }
      if (
        message.connectionId != null &&
        message.hasOwnProperty('connectionId')
      ) {
        var error = $root.interop.UniqueId.verify(message.connectionId);
        if (error) return 'connectionId.' + error;
      }
      return null;
    };

    /**
     * Creates an AppLaunchReferrer message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof interop.AppLaunchReferrer
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {interop.AppLaunchReferrer} AppLaunchReferrer
     */
    AppLaunchReferrer.fromObject = function fromObject(object) {
      if (object instanceof $root.interop.AppLaunchReferrer) return object;
      var message = new $root.interop.AppLaunchReferrer();
      if (object.appId != null) message.appId = String(object.appId);
      if (object.appInstanceId != null) {
        if (typeof object.appInstanceId !== 'object')
          throw TypeError(
            '.interop.AppLaunchReferrer.appInstanceId: object expected'
          );
        message.appInstanceId = $root.interop.UniqueId.fromObject(
          object.appInstanceId
        );
      }
      if (object.connectionId != null) {
        if (typeof object.connectionId !== 'object')
          throw TypeError(
            '.interop.AppLaunchReferrer.connectionId: object expected'
          );
        message.connectionId = $root.interop.UniqueId.fromObject(
          object.connectionId
        );
      }
      return message;
    };

    /**
     * Creates a plain object from an AppLaunchReferrer message. Also converts values to other types if specified.
     * @function toObject
     * @memberof interop.AppLaunchReferrer
     * @static
     * @param {interop.AppLaunchReferrer} message AppLaunchReferrer
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AppLaunchReferrer.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.appId = '';
        object.appInstanceId = null;
        object.connectionId = null;
      }
      if (message.appId != null && message.hasOwnProperty('appId'))
        object.appId = message.appId;
      if (
        message.appInstanceId != null &&
        message.hasOwnProperty('appInstanceId')
      )
        object.appInstanceId = $root.interop.UniqueId.toObject(
          message.appInstanceId,
          options
        );
      if (
        message.connectionId != null &&
        message.hasOwnProperty('connectionId')
      )
        object.connectionId = $root.interop.UniqueId.toObject(
          message.connectionId,
          options
        );
      return object;
    };

    /**
     * Converts this AppLaunchReferrer to JSON.
     * @function toJSON
     * @memberof interop.AppLaunchReferrer
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AppLaunchReferrer.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for AppLaunchReferrer
     * @function getTypeUrl
     * @memberof interop.AppLaunchReferrer
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    AppLaunchReferrer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = 'type.googleapis.com';
      }
      return typeUrlPrefix + '/interop.AppLaunchReferrer';
    };

    return AppLaunchReferrer;
  })();

  interop.AppLaunchResponse = (function () {
    /**
     * Properties of an AppLaunchResponse.
     * @memberof interop
     * @interface IAppLaunchResponse
     * @property {interop.IUniqueId|null} [appInstanceId] AppLaunchResponse appInstanceId
     */

    /**
     * Constructs a new AppLaunchResponse.
     * @memberof interop
     * @classdesc Represents an AppLaunchResponse.
     * @implements IAppLaunchResponse
     * @constructor
     * @param {interop.IAppLaunchResponse=} [properties] Properties to set
     */
    function AppLaunchResponse(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * AppLaunchResponse appInstanceId.
     * @member {interop.IUniqueId|null|undefined} appInstanceId
     * @memberof interop.AppLaunchResponse
     * @instance
     */
    AppLaunchResponse.prototype.appInstanceId = null;

    /**
     * Creates a new AppLaunchResponse instance using the specified properties.
     * @function create
     * @memberof interop.AppLaunchResponse
     * @static
     * @param {interop.IAppLaunchResponse=} [properties] Properties to set
     * @returns {interop.AppLaunchResponse} AppLaunchResponse instance
     */
    AppLaunchResponse.create = function create(properties) {
      return new AppLaunchResponse(properties);
    };

    /**
     * Encodes the specified AppLaunchResponse message. Does not implicitly {@link interop.AppLaunchResponse.verify|verify} messages.
     * @function encode
     * @memberof interop.AppLaunchResponse
     * @static
     * @param {interop.IAppLaunchResponse} message AppLaunchResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AppLaunchResponse.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (
        message.appInstanceId != null &&
        Object.hasOwnProperty.call(message, 'appInstanceId')
      )
        $root.interop.UniqueId.encode(
          message.appInstanceId,
          writer.uint32(/* id 1, wireType 2 =*/ 10).fork()
        ).ldelim();
      return writer;
    };

    /**
     * Encodes the specified AppLaunchResponse message, length delimited. Does not implicitly {@link interop.AppLaunchResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof interop.AppLaunchResponse
     * @static
     * @param {interop.IAppLaunchResponse} message AppLaunchResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AppLaunchResponse.encodeDelimited = function encodeDelimited(
      message,
      writer
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AppLaunchResponse message from the specified reader or buffer.
     * @function decode
     * @memberof interop.AppLaunchResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {interop.AppLaunchResponse} AppLaunchResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AppLaunchResponse.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.interop.AppLaunchResponse();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1: {
            message.appInstanceId = $root.interop.UniqueId.decode(
              reader,
              reader.uint32()
            );
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes an AppLaunchResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof interop.AppLaunchResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {interop.AppLaunchResponse} AppLaunchResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AppLaunchResponse.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AppLaunchResponse message.
     * @function verify
     * @memberof interop.AppLaunchResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AppLaunchResponse.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (
        message.appInstanceId != null &&
        message.hasOwnProperty('appInstanceId')
      ) {
        var error = $root.interop.UniqueId.verify(message.appInstanceId);
        if (error) return 'appInstanceId.' + error;
      }
      return null;
    };

    /**
     * Creates an AppLaunchResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof interop.AppLaunchResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {interop.AppLaunchResponse} AppLaunchResponse
     */
    AppLaunchResponse.fromObject = function fromObject(object) {
      if (object instanceof $root.interop.AppLaunchResponse) return object;
      var message = new $root.interop.AppLaunchResponse();
      if (object.appInstanceId != null) {
        if (typeof object.appInstanceId !== 'object')
          throw TypeError(
            '.interop.AppLaunchResponse.appInstanceId: object expected'
          );
        message.appInstanceId = $root.interop.UniqueId.fromObject(
          object.appInstanceId
        );
      }
      return message;
    };

    /**
     * Creates a plain object from an AppLaunchResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof interop.AppLaunchResponse
     * @static
     * @param {interop.AppLaunchResponse} message AppLaunchResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AppLaunchResponse.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) object.appInstanceId = null;
      if (
        message.appInstanceId != null &&
        message.hasOwnProperty('appInstanceId')
      )
        object.appInstanceId = $root.interop.UniqueId.toObject(
          message.appInstanceId,
          options
        );
      return object;
    };

    /**
     * Converts this AppLaunchResponse to JSON.
     * @function toJSON
     * @memberof interop.AppLaunchResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AppLaunchResponse.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for AppLaunchResponse
     * @function getTypeUrl
     * @memberof interop.AppLaunchResponse
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    AppLaunchResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = 'type.googleapis.com';
      }
      return typeUrlPrefix + '/interop.AppLaunchResponse';
    };

    return AppLaunchResponse;
  })();

  interop.AppLaunchedEvent = (function () {
    /**
     * Properties of an AppLaunchedEvent.
     * @memberof interop
     * @interface IAppLaunchedEvent
     * @property {interop.IUniqueId|null} [appInstanceId] AppLaunchedEvent appInstanceId
     * @property {Array.<string>|null} [appIds] AppLaunchedEvent appIds
     * @property {interop.IAppLaunchReferrer|null} [referrer] AppLaunchedEvent referrer
     */

    /**
     * Constructs a new AppLaunchedEvent.
     * @memberof interop
     * @classdesc Represents an AppLaunchedEvent.
     * @implements IAppLaunchedEvent
     * @constructor
     * @param {interop.IAppLaunchedEvent=} [properties] Properties to set
     */
    function AppLaunchedEvent(properties) {
      this.appIds = [];
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * AppLaunchedEvent appInstanceId.
     * @member {interop.IUniqueId|null|undefined} appInstanceId
     * @memberof interop.AppLaunchedEvent
     * @instance
     */
    AppLaunchedEvent.prototype.appInstanceId = null;

    /**
     * AppLaunchedEvent appIds.
     * @member {Array.<string>} appIds
     * @memberof interop.AppLaunchedEvent
     * @instance
     */
    AppLaunchedEvent.prototype.appIds = $util.emptyArray;

    /**
     * AppLaunchedEvent referrer.
     * @member {interop.IAppLaunchReferrer|null|undefined} referrer
     * @memberof interop.AppLaunchedEvent
     * @instance
     */
    AppLaunchedEvent.prototype.referrer = null;

    /**
     * Creates a new AppLaunchedEvent instance using the specified properties.
     * @function create
     * @memberof interop.AppLaunchedEvent
     * @static
     * @param {interop.IAppLaunchedEvent=} [properties] Properties to set
     * @returns {interop.AppLaunchedEvent} AppLaunchedEvent instance
     */
    AppLaunchedEvent.create = function create(properties) {
      return new AppLaunchedEvent(properties);
    };

    /**
     * Encodes the specified AppLaunchedEvent message. Does not implicitly {@link interop.AppLaunchedEvent.verify|verify} messages.
     * @function encode
     * @memberof interop.AppLaunchedEvent
     * @static
     * @param {interop.IAppLaunchedEvent} message AppLaunchedEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AppLaunchedEvent.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (
        message.appInstanceId != null &&
        Object.hasOwnProperty.call(message, 'appInstanceId')
      )
        $root.interop.UniqueId.encode(
          message.appInstanceId,
          writer.uint32(/* id 1, wireType 2 =*/ 10).fork()
        ).ldelim();
      if (message.appIds != null && message.appIds.length)
        for (var i = 0; i < message.appIds.length; ++i)
          writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.appIds[i]);
      if (
        message.referrer != null &&
        Object.hasOwnProperty.call(message, 'referrer')
      )
        $root.interop.AppLaunchReferrer.encode(
          message.referrer,
          writer.uint32(/* id 3, wireType 2 =*/ 26).fork()
        ).ldelim();
      return writer;
    };

    /**
     * Encodes the specified AppLaunchedEvent message, length delimited. Does not implicitly {@link interop.AppLaunchedEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof interop.AppLaunchedEvent
     * @static
     * @param {interop.IAppLaunchedEvent} message AppLaunchedEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AppLaunchedEvent.encodeDelimited = function encodeDelimited(
      message,
      writer
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AppLaunchedEvent message from the specified reader or buffer.
     * @function decode
     * @memberof interop.AppLaunchedEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {interop.AppLaunchedEvent} AppLaunchedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AppLaunchedEvent.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.interop.AppLaunchedEvent();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1: {
            message.appInstanceId = $root.interop.UniqueId.decode(
              reader,
              reader.uint32()
            );
            break;
          }
          case 2: {
            if (!(message.appIds && message.appIds.length)) message.appIds = [];
            message.appIds.push(reader.string());
            break;
          }
          case 3: {
            message.referrer = $root.interop.AppLaunchReferrer.decode(
              reader,
              reader.uint32()
            );
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes an AppLaunchedEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof interop.AppLaunchedEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {interop.AppLaunchedEvent} AppLaunchedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AppLaunchedEvent.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AppLaunchedEvent message.
     * @function verify
     * @memberof interop.AppLaunchedEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AppLaunchedEvent.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (
        message.appInstanceId != null &&
        message.hasOwnProperty('appInstanceId')
      ) {
        var error = $root.interop.UniqueId.verify(message.appInstanceId);
        if (error) return 'appInstanceId.' + error;
      }
      if (message.appIds != null && message.hasOwnProperty('appIds')) {
        if (!Array.isArray(message.appIds)) return 'appIds: array expected';
        for (var i = 0; i < message.appIds.length; ++i)
          if (!$util.isString(message.appIds[i]))
            return 'appIds: string[] expected';
      }
      if (message.referrer != null && message.hasOwnProperty('referrer')) {
        var error = $root.interop.AppLaunchReferrer.verify(message.referrer);
        if (error) return 'referrer.' + error;
      }
      return null;
    };

    /**
     * Creates an AppLaunchedEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof interop.AppLaunchedEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {interop.AppLaunchedEvent} AppLaunchedEvent
     */
    AppLaunchedEvent.fromObject = function fromObject(object) {
      if (object instanceof $root.interop.AppLaunchedEvent) return object;
      var message = new $root.interop.AppLaunchedEvent();
      if (object.appInstanceId != null) {
        if (typeof object.appInstanceId !== 'object')
          throw TypeError(
            '.interop.AppLaunchedEvent.appInstanceId: object expected'
          );
        message.appInstanceId = $root.interop.UniqueId.fromObject(
          object.appInstanceId
        );
      }
      if (object.appIds) {
        if (!Array.isArray(object.appIds))
          throw TypeError('.interop.AppLaunchedEvent.appIds: array expected');
        message.appIds = [];
        for (var i = 0; i < object.appIds.length; ++i)
          message.appIds[i] = String(object.appIds[i]);
      }
      if (object.referrer != null) {
        if (typeof object.referrer !== 'object')
          throw TypeError(
            '.interop.AppLaunchedEvent.referrer: object expected'
          );
        message.referrer = $root.interop.AppLaunchReferrer.fromObject(
          object.referrer
        );
      }
      return message;
    };

    /**
     * Creates a plain object from an AppLaunchedEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof interop.AppLaunchedEvent
     * @static
     * @param {interop.AppLaunchedEvent} message AppLaunchedEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AppLaunchedEvent.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.arrays || options.defaults) object.appIds = [];
      if (options.defaults) {
        object.appInstanceId = null;
        object.referrer = null;
      }
      if (
        message.appInstanceId != null &&
        message.hasOwnProperty('appInstanceId')
      )
        object.appInstanceId = $root.interop.UniqueId.toObject(
          message.appInstanceId,
          options
        );
      if (message.appIds && message.appIds.length) {
        object.appIds = [];
        for (var j = 0; j < message.appIds.length; ++j)
          object.appIds[j] = message.appIds[j];
      }
      if (message.referrer != null && message.hasOwnProperty('referrer'))
        object.referrer = $root.interop.AppLaunchReferrer.toObject(
          message.referrer,
          options
        );
      return object;
    };

    /**
     * Converts this AppLaunchedEvent to JSON.
     * @function toJSON
     * @memberof interop.AppLaunchedEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AppLaunchedEvent.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for AppLaunchedEvent
     * @function getTypeUrl
     * @memberof interop.AppLaunchedEvent
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    AppLaunchedEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = 'type.googleapis.com';
      }
      return typeUrlPrefix + '/interop.AppLaunchedEvent';
    };

    return AppLaunchedEvent;
  })();

  /**
   * AppLaunchMode enum.
   * @name interop.AppLaunchMode
   * @enum {number}
   * @property {number} SINGLE_INSTANCE=0 SINGLE_INSTANCE value
   * @property {number} MULTI_INSTANCE=1 MULTI_INSTANCE value
   */
  interop.AppLaunchMode = (function () {
    var valuesById = {},
      values = Object.create(valuesById);
    values[(valuesById[0] = 'SINGLE_INSTANCE')] = 0;
    values[(valuesById[1] = 'MULTI_INSTANCE')] = 1;
    return values;
  })();

  interop.UniqueId = (function () {
    /**
     * Properties of an UniqueId.
     * @memberof interop
     * @interface IUniqueId
     * @property {Long|null} [lo] UniqueId lo
     * @property {Long|null} [hi] UniqueId hi
     */

    /**
     * Constructs a new UniqueId.
     * @memberof interop
     * @classdesc Represents an UniqueId.
     * @implements IUniqueId
     * @constructor
     * @param {interop.IUniqueId=} [properties] Properties to set
     */
    function UniqueId(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * UniqueId lo.
     * @member {Long} lo
     * @memberof interop.UniqueId
     * @instance
     */
    UniqueId.prototype.lo = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

    /**
     * UniqueId hi.
     * @member {Long} hi
     * @memberof interop.UniqueId
     * @instance
     */
    UniqueId.prototype.hi = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

    /**
     * Creates a new UniqueId instance using the specified properties.
     * @function create
     * @memberof interop.UniqueId
     * @static
     * @param {interop.IUniqueId=} [properties] Properties to set
     * @returns {interop.UniqueId} UniqueId instance
     */
    UniqueId.create = function create(properties) {
      return new UniqueId(properties);
    };

    /**
     * Encodes the specified UniqueId message. Does not implicitly {@link interop.UniqueId.verify|verify} messages.
     * @function encode
     * @memberof interop.UniqueId
     * @static
     * @param {interop.IUniqueId} message UniqueId message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UniqueId.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.lo != null && Object.hasOwnProperty.call(message, 'lo'))
        writer.uint32(/* id 1, wireType 1 =*/ 9).fixed64(message.lo);
      if (message.hi != null && Object.hasOwnProperty.call(message, 'hi'))
        writer.uint32(/* id 2, wireType 1 =*/ 17).fixed64(message.hi);
      return writer;
    };

    /**
     * Encodes the specified UniqueId message, length delimited. Does not implicitly {@link interop.UniqueId.verify|verify} messages.
     * @function encodeDelimited
     * @memberof interop.UniqueId
     * @static
     * @param {interop.IUniqueId} message UniqueId message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UniqueId.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an UniqueId message from the specified reader or buffer.
     * @function decode
     * @memberof interop.UniqueId
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {interop.UniqueId} UniqueId
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UniqueId.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.interop.UniqueId();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1: {
            message.lo = reader.fixed64();
            break;
          }
          case 2: {
            message.hi = reader.fixed64();
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes an UniqueId message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof interop.UniqueId
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {interop.UniqueId} UniqueId
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UniqueId.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an UniqueId message.
     * @function verify
     * @memberof interop.UniqueId
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    UniqueId.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (message.lo != null && message.hasOwnProperty('lo'))
        if (
          !$util.isInteger(message.lo) &&
          !(
            message.lo &&
            $util.isInteger(message.lo.low) &&
            $util.isInteger(message.lo.high)
          )
        )
          return 'lo: integer|Long expected';
      if (message.hi != null && message.hasOwnProperty('hi'))
        if (
          !$util.isInteger(message.hi) &&
          !(
            message.hi &&
            $util.isInteger(message.hi.low) &&
            $util.isInteger(message.hi.high)
          )
        )
          return 'hi: integer|Long expected';
      return null;
    };

    /**
     * Creates an UniqueId message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof interop.UniqueId
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {interop.UniqueId} UniqueId
     */
    UniqueId.fromObject = function fromObject(object) {
      if (object instanceof $root.interop.UniqueId) return object;
      var message = new $root.interop.UniqueId();
      if (object.lo != null)
        if ($util.Long)
          (message.lo = $util.Long.fromValue(object.lo)).unsigned = false;
        else if (typeof object.lo === 'string')
          message.lo = parseInt(object.lo, 10);
        else if (typeof object.lo === 'number') message.lo = object.lo;
        else if (typeof object.lo === 'object')
          message.lo = new $util.LongBits(
            object.lo.low >>> 0,
            object.lo.high >>> 0
          ).toNumber();
      if (object.hi != null)
        if ($util.Long)
          (message.hi = $util.Long.fromValue(object.hi)).unsigned = false;
        else if (typeof object.hi === 'string')
          message.hi = parseInt(object.hi, 10);
        else if (typeof object.hi === 'number') message.hi = object.hi;
        else if (typeof object.hi === 'object')
          message.hi = new $util.LongBits(
            object.hi.low >>> 0,
            object.hi.high >>> 0
          ).toNumber();
      return message;
    };

    /**
     * Creates a plain object from an UniqueId message. Also converts values to other types if specified.
     * @function toObject
     * @memberof interop.UniqueId
     * @static
     * @param {interop.UniqueId} message UniqueId
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    UniqueId.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        if ($util.Long) {
          var long = new $util.Long(0, 0, false);
          object.lo =
            options.longs === String
              ? long.toString()
              : options.longs === Number
              ? long.toNumber()
              : long;
        } else object.lo = options.longs === String ? '0' : 0;
        if ($util.Long) {
          var long = new $util.Long(0, 0, false);
          object.hi =
            options.longs === String
              ? long.toString()
              : options.longs === Number
              ? long.toNumber()
              : long;
        } else object.hi = options.longs === String ? '0' : 0;
      }
      if (message.lo != null && message.hasOwnProperty('lo'))
        if (typeof message.lo === 'number')
          object.lo =
            options.longs === String ? String(message.lo) : message.lo;
        else
          object.lo =
            options.longs === String
              ? $util.Long.prototype.toString.call(message.lo)
              : options.longs === Number
              ? new $util.LongBits(
                  message.lo.low >>> 0,
                  message.lo.high >>> 0
                ).toNumber()
              : message.lo;
      if (message.hi != null && message.hasOwnProperty('hi'))
        if (typeof message.hi === 'number')
          object.hi =
            options.longs === String ? String(message.hi) : message.hi;
        else
          object.hi =
            options.longs === String
              ? $util.Long.prototype.toString.call(message.hi)
              : options.longs === Number
              ? new $util.LongBits(
                  message.hi.low >>> 0,
                  message.hi.high >>> 0
                ).toNumber()
              : message.hi;
      return object;
    };

    /**
     * Converts this UniqueId to JSON.
     * @function toJSON
     * @memberof interop.UniqueId
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    UniqueId.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for UniqueId
     * @function getTypeUrl
     * @memberof interop.UniqueId
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    UniqueId.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = 'type.googleapis.com';
      }
      return typeUrlPrefix + '/interop.UniqueId';
    };

    return UniqueId;
  })();

  return interop;
})();

$root.google = (function () {
  /**
   * Namespace google.
   * @exports google
   * @namespace
   */
  var google = {};

  google.protobuf = (function () {
    /**
     * Namespace protobuf.
     * @memberof google
     * @namespace
     */
    var protobuf = {};

    protobuf.Empty = (function () {
      /**
       * Properties of an Empty.
       * @memberof google.protobuf
       * @interface IEmpty
       */

      /**
       * Constructs a new Empty.
       * @memberof google.protobuf
       * @classdesc Represents an Empty.
       * @implements IEmpty
       * @constructor
       * @param {google.protobuf.IEmpty=} [properties] Properties to set
       */
      function Empty(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Creates a new Empty instance using the specified properties.
       * @function create
       * @memberof google.protobuf.Empty
       * @static
       * @param {google.protobuf.IEmpty=} [properties] Properties to set
       * @returns {google.protobuf.Empty} Empty instance
       */
      Empty.create = function create(properties) {
        return new Empty(properties);
      };

      /**
       * Encodes the specified Empty message. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
       * @function encode
       * @memberof google.protobuf.Empty
       * @static
       * @param {google.protobuf.IEmpty} message Empty message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Empty.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        return writer;
      };

      /**
       * Encodes the specified Empty message, length delimited. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
       * @function encodeDelimited
       * @memberof google.protobuf.Empty
       * @static
       * @param {google.protobuf.IEmpty} message Empty message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Empty.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes an Empty message from the specified reader or buffer.
       * @function decode
       * @memberof google.protobuf.Empty
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {google.protobuf.Empty} Empty
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Empty.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.google.protobuf.Empty();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes an Empty message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof google.protobuf.Empty
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {google.protobuf.Empty} Empty
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Empty.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies an Empty message.
       * @function verify
       * @memberof google.protobuf.Empty
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      Empty.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        return null;
      };

      /**
       * Creates an Empty message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof google.protobuf.Empty
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {google.protobuf.Empty} Empty
       */
      Empty.fromObject = function fromObject(object) {
        if (object instanceof $root.google.protobuf.Empty) return object;
        return new $root.google.protobuf.Empty();
      };

      /**
       * Creates a plain object from an Empty message. Also converts values to other types if specified.
       * @function toObject
       * @memberof google.protobuf.Empty
       * @static
       * @param {google.protobuf.Empty} message Empty
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      Empty.toObject = function toObject() {
        return {};
      };

      /**
       * Converts this Empty to JSON.
       * @function toJSON
       * @memberof google.protobuf.Empty
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      Empty.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for Empty
       * @function getTypeUrl
       * @memberof google.protobuf.Empty
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      Empty.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return typeUrlPrefix + '/google.protobuf.Empty';
      };

      return Empty;
    })();

    return protobuf;
  })();

  return google;
})();

module.exports = $root;
