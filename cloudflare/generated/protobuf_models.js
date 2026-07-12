/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
const $Object = $util.global.Object, $undefined = $util.global.undefined, $Error = $util.global.Error, $Array = $util.global.Array, $TypeError = $util.global.TypeError, $String = $util.global.String, $Boolean = $util.global.Boolean, $Number = $util.global.Number, $parseInt = $util.global.parseInt, $BigInt = $util.global.BigInt, $isFinite = $util.global.isFinite;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const AMR_MODEL_NSP = $root.AMR_MODEL_NSP = (() => {

    /**
     * Namespace AMR_MODEL_NSP.
     * @exports AMR_MODEL_NSP
     * @namespace
     */
    const AMR_MODEL_NSP = {};

    /**
     * MESSAGE_BASE_DATA_TYPE enum.
     * @name AMR_MODEL_NSP.MESSAGE_BASE_DATA_TYPE
     * @enum {number}
     * @property {number} DATA_BYTES=0 DATA_BYTES value
     * @property {number} DATA_STRING=1 DATA_STRING value
     * @property {number} DATA_IP=3 DATA_IP value
     * @property {number} DATA_BOOL=4 DATA_BOOL value
     * @property {number} DATA_INT32=5 DATA_INT32 value
     * @property {number} DATA_UINT32=6 DATA_UINT32 value
     * @property {number} DATA_INT64=7 DATA_INT64 value
     * @property {number} DATA_UINT64=8 DATA_UINT64 value
     * @property {number} DATA_FLOAT=9 DATA_FLOAT value
     * @property {number} DATA_DOUBLE=10 DATA_DOUBLE value
     * @property {number} DATA_COMBOX=11 DATA_COMBOX value
     * @property {number} DATA_FIXED_E=12 DATA_FIXED_E value
     */
    AMR_MODEL_NSP.MESSAGE_BASE_DATA_TYPE = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "DATA_BYTES"] = 0;
        values[valuesById[1] = "DATA_STRING"] = 1;
        values[valuesById[3] = "DATA_IP"] = 3;
        values[valuesById[4] = "DATA_BOOL"] = 4;
        values[valuesById[5] = "DATA_INT32"] = 5;
        values[valuesById[6] = "DATA_UINT32"] = 6;
        values[valuesById[7] = "DATA_INT64"] = 7;
        values[valuesById[8] = "DATA_UINT64"] = 8;
        values[valuesById[9] = "DATA_FLOAT"] = 9;
        values[valuesById[10] = "DATA_DOUBLE"] = 10;
        values[valuesById[11] = "DATA_COMBOX"] = 11;
        values[valuesById[12] = "DATA_FIXED_E"] = 12;
        return values;
    })();

    /**
     * MESSAGE_SHAPE_TYPE enum.
     * @name AMR_MODEL_NSP.MESSAGE_SHAPE_TYPE
     * @enum {number}
     * @property {number} ENUM_SPHERE=0 ENUM_SPHERE value
     * @property {number} ENUM_BOX=1 ENUM_BOX value
     * @property {number} ENUM_CYLINDER=2 ENUM_CYLINDER value
     */
    AMR_MODEL_NSP.MESSAGE_SHAPE_TYPE = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "ENUM_SPHERE"] = 0;
        values[valuesById[1] = "ENUM_BOX"] = 1;
        values[valuesById[2] = "ENUM_CYLINDER"] = 2;
        return values;
    })();

    AMR_MODEL_NSP.Message_Combox_Item = (function() {

        /**
         * Properties of a Message_Combox_Item.
         * @typedef {Object} AMR_MODEL_NSP.Message_Combox_Item.$Properties
         * @property {string|null} [key] Message_Combox_Item key
         * @property {string|null} [desc] Message_Combox_Item desc
         * @property {Array.<AMR_MODEL_NSP.Message_Base_Element.$Properties>|null} [arrayCmobEle] Message_Combox_Item arrayCmobEle
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Combox_Item.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Combox_Item
         * @augments AMR_MODEL_NSP.Message_Combox_Item.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Combox_Item.$Properties instead.
         */

        /**
         * Shape of a Message_Combox_Item.
         * @typedef {AMR_MODEL_NSP.Message_Combox_Item.$Properties} AMR_MODEL_NSP.Message_Combox_Item.$Shape
         */

        /**
         * Constructs a new Message_Combox_Item.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Combox_Item.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Combox_Item.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Combox_Item = function (properties) {
            this.arrayCmobEle = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Combox_Item key.
         * @member {string} key
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @instance
         */
        Message_Combox_Item.prototype.key = "";

        /**
         * Message_Combox_Item desc.
         * @member {string} desc
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @instance
         */
        Message_Combox_Item.prototype.desc = "";

        /**
         * Message_Combox_Item arrayCmobEle.
         * @member {Array.<AMR_MODEL_NSP.Message_Base_Element.$Properties>} arrayCmobEle
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @instance
         */
        Message_Combox_Item.prototype.arrayCmobEle = $util.emptyArray;

        /**
         * Creates a new Message_Combox_Item instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @static
         * @param {AMR_MODEL_NSP.Message_Combox_Item.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Combox_Item} Message_Combox_Item instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Combox_Item.$Shape): AMR_MODEL_NSP.Message_Combox_Item & AMR_MODEL_NSP.Message_Combox_Item.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Combox_Item.$Properties): AMR_MODEL_NSP.Message_Combox_Item;
         * }}
         */
        Message_Combox_Item.create = function(properties) {
            return new Message_Combox_Item(properties);
        };

        /**
         * Encodes the specified Message_Combox_Item message. Does not implicitly {@link AMR_MODEL_NSP.Message_Combox_Item.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @static
         * @param {AMR_MODEL_NSP.Message_Combox_Item.$Properties} message Message_Combox_Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Combox_Item.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.desc);
            if (message.arrayCmobEle != null && message.arrayCmobEle.length)
                for (let i = 0; i < message.arrayCmobEle.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.arrayCmobEle[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Combox_Item message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Combox_Item.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @static
         * @param {AMR_MODEL_NSP.Message_Combox_Item.$Properties} message Message_Combox_Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Combox_Item.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Combox_Item message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Combox_Item & AMR_MODEL_NSP.Message_Combox_Item.$Shape} Message_Combox_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Combox_Item.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Combox_Item(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if (!(message.arrayCmobEle && message.arrayCmobEle.length))
                            message.arrayCmobEle = [];
                        message.arrayCmobEle.push($root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Combox_Item message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Combox_Item & AMR_MODEL_NSP.Message_Combox_Item.$Shape} Message_Combox_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Combox_Item.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Combox_Item message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Combox_Item.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.arrayCmobEle != null && $Object.hasOwnProperty.call(message, "arrayCmobEle")) {
                if (!$Array.isArray(message.arrayCmobEle))
                    return "arrayCmobEle: array expected";
                for (let i = 0; i < message.arrayCmobEle.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.arrayCmobEle[i], _depth + 1);
                    if (error)
                        return "arrayCmobEle." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Message_Combox_Item message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Combox_Item} Message_Combox_Item
         */
        Message_Combox_Item.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Combox_Item)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Combox_Item: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Combox_Item();
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.arrayCmobEle) {
                if (!$Array.isArray(object.arrayCmobEle))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Combox_Item.arrayCmobEle: array expected");
                message.arrayCmobEle = $Array(object.arrayCmobEle.length);
                for (let i = 0; i < object.arrayCmobEle.length; ++i) {
                    if (!$util.isObject(object.arrayCmobEle[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Combox_Item.arrayCmobEle: object expected");
                    message.arrayCmobEle[i] = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.arrayCmobEle[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_Combox_Item message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @static
         * @param {AMR_MODEL_NSP.Message_Combox_Item} message Message_Combox_Item
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Combox_Item.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.arrayCmobEle = [];
            if (options.defaults) {
                object.key = "";
                object.desc = "";
            }
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.arrayCmobEle && message.arrayCmobEle.length) {
                object.arrayCmobEle = $Array(message.arrayCmobEle.length);
                for (let j = 0; j < message.arrayCmobEle.length; ++j)
                    object.arrayCmobEle[j] = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.arrayCmobEle[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Message_Combox_Item to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Combox_Item.prototype.toJSON = function() {
            return Message_Combox_Item.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Combox_Item
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Combox_Item
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Combox_Item.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Combox_Item";
        };

        return Message_Combox_Item;
    })();

    AMR_MODEL_NSP.Message_Combox_Type = (function() {

        /**
         * Properties of a Message_Combox_Type.
         * @typedef {Object} AMR_MODEL_NSP.Message_Combox_Type.$Properties
         * @property {string|null} [typeKey] Message_Combox_Type typeKey
         * @property {string|null} [typeDesc] Message_Combox_Type typeDesc
         * @property {Array.<AMR_MODEL_NSP.Message_Combox_Item.$Properties>|null} [typeGroups] Message_Combox_Type typeGroups
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Combox_Type.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Combox_Type
         * @augments AMR_MODEL_NSP.Message_Combox_Type.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Combox_Type.$Properties instead.
         */

        /**
         * Shape of a Message_Combox_Type.
         * @typedef {AMR_MODEL_NSP.Message_Combox_Type.$Properties} AMR_MODEL_NSP.Message_Combox_Type.$Shape
         */

        /**
         * Constructs a new Message_Combox_Type.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Combox_Type.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Combox_Type.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Combox_Type = function (properties) {
            this.typeGroups = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Combox_Type typeKey.
         * @member {string} typeKey
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @instance
         */
        Message_Combox_Type.prototype.typeKey = "";

        /**
         * Message_Combox_Type typeDesc.
         * @member {string} typeDesc
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @instance
         */
        Message_Combox_Type.prototype.typeDesc = "";

        /**
         * Message_Combox_Type typeGroups.
         * @member {Array.<AMR_MODEL_NSP.Message_Combox_Item.$Properties>} typeGroups
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @instance
         */
        Message_Combox_Type.prototype.typeGroups = $util.emptyArray;

        /**
         * Creates a new Message_Combox_Type instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @static
         * @param {AMR_MODEL_NSP.Message_Combox_Type.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Combox_Type} Message_Combox_Type instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Combox_Type.$Shape): AMR_MODEL_NSP.Message_Combox_Type & AMR_MODEL_NSP.Message_Combox_Type.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Combox_Type.$Properties): AMR_MODEL_NSP.Message_Combox_Type;
         * }}
         */
        Message_Combox_Type.create = function(properties) {
            return new Message_Combox_Type(properties);
        };

        /**
         * Encodes the specified Message_Combox_Type message. Does not implicitly {@link AMR_MODEL_NSP.Message_Combox_Type.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @static
         * @param {AMR_MODEL_NSP.Message_Combox_Type.$Properties} message Message_Combox_Type message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Combox_Type.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.typeKey != null && $Object.hasOwnProperty.call(message, "typeKey") && message.typeKey !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.typeKey);
            if (message.typeDesc != null && $Object.hasOwnProperty.call(message, "typeDesc") && message.typeDesc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.typeDesc);
            if (message.typeGroups != null && message.typeGroups.length)
                for (let i = 0; i < message.typeGroups.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Combox_Item.encode(message.typeGroups[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Combox_Type message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Combox_Type.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @static
         * @param {AMR_MODEL_NSP.Message_Combox_Type.$Properties} message Message_Combox_Type message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Combox_Type.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Combox_Type message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Combox_Type & AMR_MODEL_NSP.Message_Combox_Type.$Shape} Message_Combox_Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Combox_Type.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Combox_Type(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.typeKey = value;
                        else
                            delete message.typeKey;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.typeDesc = value;
                        else
                            delete message.typeDesc;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if (!(message.typeGroups && message.typeGroups.length))
                            message.typeGroups = [];
                        message.typeGroups.push($root.AMR_MODEL_NSP.Message_Combox_Item.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Combox_Type message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Combox_Type & AMR_MODEL_NSP.Message_Combox_Type.$Shape} Message_Combox_Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Combox_Type.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Combox_Type message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Combox_Type.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.typeKey != null && $Object.hasOwnProperty.call(message, "typeKey"))
                if (!$util.isString(message.typeKey))
                    return "typeKey: string expected";
            if (message.typeDesc != null && $Object.hasOwnProperty.call(message, "typeDesc"))
                if (!$util.isString(message.typeDesc))
                    return "typeDesc: string expected";
            if (message.typeGroups != null && $Object.hasOwnProperty.call(message, "typeGroups")) {
                if (!$Array.isArray(message.typeGroups))
                    return "typeGroups: array expected";
                for (let i = 0; i < message.typeGroups.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Combox_Item.verify(message.typeGroups[i], _depth + 1);
                    if (error)
                        return "typeGroups." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Message_Combox_Type message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Combox_Type} Message_Combox_Type
         */
        Message_Combox_Type.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Combox_Type)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Combox_Type: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Combox_Type();
            if (object.typeKey != null)
                if (typeof object.typeKey !== "string" || object.typeKey.length)
                    message.typeKey = $String(object.typeKey);
            if (object.typeDesc != null)
                if (typeof object.typeDesc !== "string" || object.typeDesc.length)
                    message.typeDesc = $String(object.typeDesc);
            if (object.typeGroups) {
                if (!$Array.isArray(object.typeGroups))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Combox_Type.typeGroups: array expected");
                message.typeGroups = $Array(object.typeGroups.length);
                for (let i = 0; i < object.typeGroups.length; ++i) {
                    if (!$util.isObject(object.typeGroups[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Combox_Type.typeGroups: object expected");
                    message.typeGroups[i] = $root.AMR_MODEL_NSP.Message_Combox_Item.fromObject(object.typeGroups[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_Combox_Type message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @static
         * @param {AMR_MODEL_NSP.Message_Combox_Type} message Message_Combox_Type
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Combox_Type.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.typeGroups = [];
            if (options.defaults) {
                object.typeKey = "";
                object.typeDesc = "";
            }
            if (message.typeKey != null && $Object.hasOwnProperty.call(message, "typeKey"))
                object.typeKey = message.typeKey;
            if (message.typeDesc != null && $Object.hasOwnProperty.call(message, "typeDesc"))
                object.typeDesc = message.typeDesc;
            if (message.typeGroups && message.typeGroups.length) {
                object.typeGroups = $Array(message.typeGroups.length);
                for (let j = 0; j < message.typeGroups.length; ++j)
                    object.typeGroups[j] = $root.AMR_MODEL_NSP.Message_Combox_Item.toObject(message.typeGroups[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Message_Combox_Type to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Combox_Type.prototype.toJSON = function() {
            return Message_Combox_Type.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Combox_Type
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Combox_Type
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Combox_Type.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Combox_Type";
        };

        return Message_Combox_Type;
    })();

    AMR_MODEL_NSP.Message_Base_Element = (function() {

        /**
         * Properties of a Message_Base_Element.
         * @typedef {Object} AMR_MODEL_NSP.Message_Base_Element.$Properties
         * @property {string|null} [key] Message_Base_Element key
         * @property {AMR_MODEL_NSP.MESSAGE_BASE_DATA_TYPE|null} [type] Message_Base_Element type
         * @property {string|null} [stringValue] Message_Base_Element stringValue
         * @property {boolean|null} [boolValue] Message_Base_Element boolValue
         * @property {number|null} [int32Value] Message_Base_Element int32Value
         * @property {number|null} [uint32Value] Message_Base_Element uint32Value
         * @property {number|Long|null} [int64Value] Message_Base_Element int64Value
         * @property {number|Long|null} [uint64Value] Message_Base_Element uint64Value
         * @property {number|null} [floatValue] Message_Base_Element floatValue
         * @property {number|null} [doubleValue] Message_Base_Element doubleValue
         * @property {Uint8Array|null} [bytesValue] Message_Base_Element bytesValue
         * @property {string|null} [ipValue] Message_Base_Element ipValue
         * @property {string|null} [stringFix] Message_Base_Element stringFix
         * @property {AMR_MODEL_NSP.Message_Combox_Type.$Properties|null} [comboType] Message_Base_Element comboType
         * @property {number|null} [int32Maxvalue] Message_Base_Element int32Maxvalue
         * @property {number|null} [uint32Maxvalue] Message_Base_Element uint32Maxvalue
         * @property {number|Long|null} [int64Maxvalue] Message_Base_Element int64Maxvalue
         * @property {number|Long|null} [uint64Maxvalue] Message_Base_Element uint64Maxvalue
         * @property {number|null} [floatMaxvalue] Message_Base_Element floatMaxvalue
         * @property {number|null} [doubleMaxvalue] Message_Base_Element doubleMaxvalue
         * @property {number|null} [int32Minvalue] Message_Base_Element int32Minvalue
         * @property {number|null} [uint32Minvalue] Message_Base_Element uint32Minvalue
         * @property {number|Long|null} [int64Minvalue] Message_Base_Element int64Minvalue
         * @property {number|Long|null} [uint64Minvalue] Message_Base_Element uint64Minvalue
         * @property {number|null} [floatMinvalue] Message_Base_Element floatMinvalue
         * @property {number|null} [doubleMinvalue] Message_Base_Element doubleMinvalue
         * @property {string|null} [unit] Message_Base_Element unit
         * @property {string|null} [desc] Message_Base_Element desc
         * @property {boolean|null} [boolParse] Message_Base_Element boolParse
         * @property {boolean|null} [boolHide] Message_Base_Element boolHide
         * @property {boolean|null} [boolNoeditable] Message_Base_Element boolNoeditable
         * @property {boolean|null} [boolMustfill] Message_Base_Element boolMustfill
         * @property {boolean|null} [boolBasic] Message_Base_Element boolBasic
         * @property {Array.<string>|null} [fixedSource] Message_Base_Element fixedSource
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Base_Element.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Base_Element
         * @augments AMR_MODEL_NSP.Message_Base_Element.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Base_Element.$Properties instead.
         */

        /**
         * Shape of a Message_Base_Element.
         * @typedef {AMR_MODEL_NSP.Message_Base_Element.$Properties} AMR_MODEL_NSP.Message_Base_Element.$Shape
         */

        /**
         * Constructs a new Message_Base_Element.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Base_Element.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Base_Element.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Base_Element = function (properties) {
            this.fixedSource = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Base_Element key.
         * @member {string} key
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.key = "";

        /**
         * Message_Base_Element type.
         * @member {AMR_MODEL_NSP.MESSAGE_BASE_DATA_TYPE} type
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.type = 0;

        /**
         * Message_Base_Element stringValue.
         * @member {string} stringValue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.stringValue = "";

        /**
         * Message_Base_Element boolValue.
         * @member {boolean} boolValue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.boolValue = false;

        /**
         * Message_Base_Element int32Value.
         * @member {number} int32Value
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.int32Value = 0;

        /**
         * Message_Base_Element uint32Value.
         * @member {number} uint32Value
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.uint32Value = 0;

        /**
         * Message_Base_Element int64Value.
         * @member {number|Long} int64Value
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.int64Value = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Message_Base_Element uint64Value.
         * @member {number|Long} uint64Value
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.uint64Value = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Message_Base_Element floatValue.
         * @member {number} floatValue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.floatValue = 0;

        /**
         * Message_Base_Element doubleValue.
         * @member {number} doubleValue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.doubleValue = 0;

        /**
         * Message_Base_Element bytesValue.
         * @member {Uint8Array} bytesValue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.bytesValue = $util.newBuffer([]);

        /**
         * Message_Base_Element ipValue.
         * @member {string} ipValue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.ipValue = "";

        /**
         * Message_Base_Element stringFix.
         * @member {string} stringFix
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.stringFix = "";

        /**
         * Message_Base_Element comboType.
         * @member {AMR_MODEL_NSP.Message_Combox_Type.$Properties|null|undefined} comboType
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.comboType = null;

        /**
         * Message_Base_Element int32Maxvalue.
         * @member {number} int32Maxvalue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.int32Maxvalue = 0;

        /**
         * Message_Base_Element uint32Maxvalue.
         * @member {number} uint32Maxvalue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.uint32Maxvalue = 0;

        /**
         * Message_Base_Element int64Maxvalue.
         * @member {number|Long} int64Maxvalue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.int64Maxvalue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Message_Base_Element uint64Maxvalue.
         * @member {number|Long} uint64Maxvalue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.uint64Maxvalue = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Message_Base_Element floatMaxvalue.
         * @member {number} floatMaxvalue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.floatMaxvalue = 0;

        /**
         * Message_Base_Element doubleMaxvalue.
         * @member {number} doubleMaxvalue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.doubleMaxvalue = 0;

        /**
         * Message_Base_Element int32Minvalue.
         * @member {number} int32Minvalue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.int32Minvalue = 0;

        /**
         * Message_Base_Element uint32Minvalue.
         * @member {number} uint32Minvalue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.uint32Minvalue = 0;

        /**
         * Message_Base_Element int64Minvalue.
         * @member {number|Long} int64Minvalue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.int64Minvalue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Message_Base_Element uint64Minvalue.
         * @member {number|Long} uint64Minvalue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.uint64Minvalue = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Message_Base_Element floatMinvalue.
         * @member {number} floatMinvalue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.floatMinvalue = 0;

        /**
         * Message_Base_Element doubleMinvalue.
         * @member {number} doubleMinvalue
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.doubleMinvalue = 0;

        /**
         * Message_Base_Element unit.
         * @member {string} unit
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.unit = "";

        /**
         * Message_Base_Element desc.
         * @member {string} desc
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.desc = "";

        /**
         * Message_Base_Element boolParse.
         * @member {boolean} boolParse
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.boolParse = false;

        /**
         * Message_Base_Element boolHide.
         * @member {boolean} boolHide
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.boolHide = false;

        /**
         * Message_Base_Element boolNoeditable.
         * @member {boolean} boolNoeditable
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.boolNoeditable = false;

        /**
         * Message_Base_Element boolMustfill.
         * @member {boolean} boolMustfill
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.boolMustfill = false;

        /**
         * Message_Base_Element boolBasic.
         * @member {boolean} boolBasic
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.boolBasic = false;

        /**
         * Message_Base_Element fixedSource.
         * @member {Array.<string>} fixedSource
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         */
        Message_Base_Element.prototype.fixedSource = $util.emptyArray;

        /**
         * Creates a new Message_Base_Element instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @static
         * @param {AMR_MODEL_NSP.Message_Base_Element.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Base_Element} Message_Base_Element instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Base_Element.$Shape): AMR_MODEL_NSP.Message_Base_Element & AMR_MODEL_NSP.Message_Base_Element.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Base_Element.$Properties): AMR_MODEL_NSP.Message_Base_Element;
         * }}
         */
        Message_Base_Element.create = function(properties) {
            return new Message_Base_Element(properties);
        };

        /**
         * Encodes the specified Message_Base_Element message. Does not implicitly {@link AMR_MODEL_NSP.Message_Base_Element.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @static
         * @param {AMR_MODEL_NSP.Message_Base_Element.$Properties} message Message_Base_Element message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Base_Element.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.type != null && $Object.hasOwnProperty.call(message, "type") && message.type !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
            if (message.stringValue != null && $Object.hasOwnProperty.call(message, "stringValue") && message.stringValue !== "")
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.stringValue);
            if (message.boolValue != null && $Object.hasOwnProperty.call(message, "boolValue") && message.boolValue !== false)
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.boolValue);
            if (message.int32Value != null && $Object.hasOwnProperty.call(message, "int32Value") && message.int32Value !== 0)
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.int32Value);
            if (message.uint32Value != null && $Object.hasOwnProperty.call(message, "uint32Value") && message.uint32Value !== 0)
                writer.uint32(/* id 13, wireType 0 =*/104).uint32(message.uint32Value);
            if (message.int64Value != null && $Object.hasOwnProperty.call(message, "int64Value") && (typeof message.int64Value === "object" ? message.int64Value.low || message.int64Value.high : message.int64Value !== 0))
                writer.uint32(/* id 14, wireType 0 =*/112).int64(message.int64Value);
            if (message.uint64Value != null && $Object.hasOwnProperty.call(message, "uint64Value") && (typeof message.uint64Value === "object" ? message.uint64Value.low || message.uint64Value.high : message.uint64Value !== 0))
                writer.uint32(/* id 15, wireType 0 =*/120).uint64(message.uint64Value);
            if (message.floatValue != null && $Object.hasOwnProperty.call(message, "floatValue") && !$Object.is(message.floatValue, 0))
                writer.uint32(/* id 16, wireType 5 =*/133).float(message.floatValue);
            if (message.doubleValue != null && $Object.hasOwnProperty.call(message, "doubleValue") && !$Object.is(message.doubleValue, 0))
                writer.uint32(/* id 17, wireType 1 =*/137).double(message.doubleValue);
            if (message.bytesValue != null && $Object.hasOwnProperty.call(message, "bytesValue") && message.bytesValue.length)
                writer.uint32(/* id 18, wireType 2 =*/146).bytes(message.bytesValue);
            if (message.ipValue != null && $Object.hasOwnProperty.call(message, "ipValue") && message.ipValue !== "")
                writer.uint32(/* id 19, wireType 2 =*/154).string(message.ipValue);
            if (message.stringFix != null && $Object.hasOwnProperty.call(message, "stringFix") && message.stringFix !== "")
                writer.uint32(/* id 20, wireType 2 =*/162).string(message.stringFix);
            if (message.comboType != null && $Object.hasOwnProperty.call(message, "comboType"))
                $root.AMR_MODEL_NSP.Message_Combox_Type.encode(message.comboType, writer.uint32(/* id 21, wireType 2 =*/170).fork(), _depth + 1).ldelim();
            if (message.int32Maxvalue != null && $Object.hasOwnProperty.call(message, "int32Maxvalue") && message.int32Maxvalue !== 0)
                writer.uint32(/* id 30, wireType 0 =*/240).int32(message.int32Maxvalue);
            if (message.uint32Maxvalue != null && $Object.hasOwnProperty.call(message, "uint32Maxvalue") && message.uint32Maxvalue !== 0)
                writer.uint32(/* id 31, wireType 0 =*/248).uint32(message.uint32Maxvalue);
            if (message.int64Maxvalue != null && $Object.hasOwnProperty.call(message, "int64Maxvalue") && (typeof message.int64Maxvalue === "object" ? message.int64Maxvalue.low || message.int64Maxvalue.high : message.int64Maxvalue !== 0))
                writer.uint32(/* id 32, wireType 0 =*/256).int64(message.int64Maxvalue);
            if (message.uint64Maxvalue != null && $Object.hasOwnProperty.call(message, "uint64Maxvalue") && (typeof message.uint64Maxvalue === "object" ? message.uint64Maxvalue.low || message.uint64Maxvalue.high : message.uint64Maxvalue !== 0))
                writer.uint32(/* id 33, wireType 0 =*/264).uint64(message.uint64Maxvalue);
            if (message.floatMaxvalue != null && $Object.hasOwnProperty.call(message, "floatMaxvalue") && !$Object.is(message.floatMaxvalue, 0))
                writer.uint32(/* id 34, wireType 5 =*/277).float(message.floatMaxvalue);
            if (message.doubleMaxvalue != null && $Object.hasOwnProperty.call(message, "doubleMaxvalue") && !$Object.is(message.doubleMaxvalue, 0))
                writer.uint32(/* id 35, wireType 1 =*/281).double(message.doubleMaxvalue);
            if (message.int32Minvalue != null && $Object.hasOwnProperty.call(message, "int32Minvalue") && message.int32Minvalue !== 0)
                writer.uint32(/* id 40, wireType 0 =*/320).int32(message.int32Minvalue);
            if (message.uint32Minvalue != null && $Object.hasOwnProperty.call(message, "uint32Minvalue") && message.uint32Minvalue !== 0)
                writer.uint32(/* id 41, wireType 0 =*/328).uint32(message.uint32Minvalue);
            if (message.int64Minvalue != null && $Object.hasOwnProperty.call(message, "int64Minvalue") && (typeof message.int64Minvalue === "object" ? message.int64Minvalue.low || message.int64Minvalue.high : message.int64Minvalue !== 0))
                writer.uint32(/* id 42, wireType 0 =*/336).int64(message.int64Minvalue);
            if (message.uint64Minvalue != null && $Object.hasOwnProperty.call(message, "uint64Minvalue") && (typeof message.uint64Minvalue === "object" ? message.uint64Minvalue.low || message.uint64Minvalue.high : message.uint64Minvalue !== 0))
                writer.uint32(/* id 43, wireType 0 =*/344).uint64(message.uint64Minvalue);
            if (message.floatMinvalue != null && $Object.hasOwnProperty.call(message, "floatMinvalue") && !$Object.is(message.floatMinvalue, 0))
                writer.uint32(/* id 44, wireType 5 =*/357).float(message.floatMinvalue);
            if (message.doubleMinvalue != null && $Object.hasOwnProperty.call(message, "doubleMinvalue") && !$Object.is(message.doubleMinvalue, 0))
                writer.uint32(/* id 45, wireType 1 =*/361).double(message.doubleMinvalue);
            if (message.unit != null && $Object.hasOwnProperty.call(message, "unit") && message.unit !== "")
                writer.uint32(/* id 50, wireType 2 =*/402).string(message.unit);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 51, wireType 2 =*/410).string(message.desc);
            if (message.boolParse != null && $Object.hasOwnProperty.call(message, "boolParse") && message.boolParse !== false)
                writer.uint32(/* id 52, wireType 0 =*/416).bool(message.boolParse);
            if (message.boolHide != null && $Object.hasOwnProperty.call(message, "boolHide") && message.boolHide !== false)
                writer.uint32(/* id 53, wireType 0 =*/424).bool(message.boolHide);
            if (message.boolNoeditable != null && $Object.hasOwnProperty.call(message, "boolNoeditable") && message.boolNoeditable !== false)
                writer.uint32(/* id 54, wireType 0 =*/432).bool(message.boolNoeditable);
            if (message.boolMustfill != null && $Object.hasOwnProperty.call(message, "boolMustfill") && message.boolMustfill !== false)
                writer.uint32(/* id 55, wireType 0 =*/440).bool(message.boolMustfill);
            if (message.boolBasic != null && $Object.hasOwnProperty.call(message, "boolBasic") && message.boolBasic !== false)
                writer.uint32(/* id 56, wireType 0 =*/448).bool(message.boolBasic);
            if (message.fixedSource != null && message.fixedSource.length)
                for (let i = 0; i < message.fixedSource.length; ++i)
                    writer.uint32(/* id 57, wireType 2 =*/458).string(message.fixedSource[i]);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Base_Element message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Base_Element.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @static
         * @param {AMR_MODEL_NSP.Message_Base_Element.$Properties} message Message_Base_Element message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Base_Element.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Base_Element message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Base_Element & AMR_MODEL_NSP.Message_Base_Element.$Shape} Message_Base_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Base_Element.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Base_Element(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.type = value;
                        else
                            delete message.type;
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.stringValue = value;
                        else
                            delete message.stringValue;
                        continue;
                    }
                case 11: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolValue = value;
                        else
                            delete message.boolValue;
                        continue;
                    }
                case 12: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.int32Value = value;
                        else
                            delete message.int32Value;
                        continue;
                    }
                case 13: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.uint32Value = value;
                        else
                            delete message.uint32Value;
                        continue;
                    }
                case 14: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                            message.int64Value = value;
                        else
                            delete message.int64Value;
                        continue;
                    }
                case 15: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.uint64Value = value;
                        else
                            delete message.uint64Value;
                        continue;
                    }
                case 16: {
                        if (wireType !== 5)
                            break;
                        if (!$Object.is(value = reader.float(), 0))
                            message.floatValue = value;
                        else
                            delete message.floatValue;
                        continue;
                    }
                case 17: {
                        if (wireType !== 1)
                            break;
                        if (!$Object.is(value = reader.double(), 0))
                            message.doubleValue = value;
                        else
                            delete message.doubleValue;
                        continue;
                    }
                case 18: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.bytesValue = value;
                        else
                            delete message.bytesValue;
                        continue;
                    }
                case 19: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.ipValue = value;
                        else
                            delete message.ipValue;
                        continue;
                    }
                case 20: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.stringFix = value;
                        else
                            delete message.stringFix;
                        continue;
                    }
                case 21: {
                        if (wireType !== 2)
                            break;
                        message.comboType = $root.AMR_MODEL_NSP.Message_Combox_Type.decode(reader, reader.uint32(), $undefined, _depth + 1, message.comboType);
                        continue;
                    }
                case 30: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.int32Maxvalue = value;
                        else
                            delete message.int32Maxvalue;
                        continue;
                    }
                case 31: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.uint32Maxvalue = value;
                        else
                            delete message.uint32Maxvalue;
                        continue;
                    }
                case 32: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                            message.int64Maxvalue = value;
                        else
                            delete message.int64Maxvalue;
                        continue;
                    }
                case 33: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.uint64Maxvalue = value;
                        else
                            delete message.uint64Maxvalue;
                        continue;
                    }
                case 34: {
                        if (wireType !== 5)
                            break;
                        if (!$Object.is(value = reader.float(), 0))
                            message.floatMaxvalue = value;
                        else
                            delete message.floatMaxvalue;
                        continue;
                    }
                case 35: {
                        if (wireType !== 1)
                            break;
                        if (!$Object.is(value = reader.double(), 0))
                            message.doubleMaxvalue = value;
                        else
                            delete message.doubleMaxvalue;
                        continue;
                    }
                case 40: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.int32Minvalue = value;
                        else
                            delete message.int32Minvalue;
                        continue;
                    }
                case 41: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.uint32Minvalue = value;
                        else
                            delete message.uint32Minvalue;
                        continue;
                    }
                case 42: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                            message.int64Minvalue = value;
                        else
                            delete message.int64Minvalue;
                        continue;
                    }
                case 43: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.uint64Minvalue = value;
                        else
                            delete message.uint64Minvalue;
                        continue;
                    }
                case 44: {
                        if (wireType !== 5)
                            break;
                        if (!$Object.is(value = reader.float(), 0))
                            message.floatMinvalue = value;
                        else
                            delete message.floatMinvalue;
                        continue;
                    }
                case 45: {
                        if (wireType !== 1)
                            break;
                        if (!$Object.is(value = reader.double(), 0))
                            message.doubleMinvalue = value;
                        else
                            delete message.doubleMinvalue;
                        continue;
                    }
                case 50: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.unit = value;
                        else
                            delete message.unit;
                        continue;
                    }
                case 51: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 52: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolParse = value;
                        else
                            delete message.boolParse;
                        continue;
                    }
                case 53: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolHide = value;
                        else
                            delete message.boolHide;
                        continue;
                    }
                case 54: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolNoeditable = value;
                        else
                            delete message.boolNoeditable;
                        continue;
                    }
                case 55: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolMustfill = value;
                        else
                            delete message.boolMustfill;
                        continue;
                    }
                case 56: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolBasic = value;
                        else
                            delete message.boolBasic;
                        continue;
                    }
                case 57: {
                        if (wireType !== 2)
                            break;
                        if (!(message.fixedSource && message.fixedSource.length))
                            message.fixedSource = [];
                        message.fixedSource.push(reader.stringVerify());
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Base_Element message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Base_Element & AMR_MODEL_NSP.Message_Base_Element.$Shape} Message_Base_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Base_Element.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Base_Element message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Base_Element.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                if (typeof message.type !== "number" || (message.type | 0) !== message.type)
                    return "type: enum value expected";
            if (message.stringValue != null && $Object.hasOwnProperty.call(message, "stringValue"))
                if (!$util.isString(message.stringValue))
                    return "stringValue: string expected";
            if (message.boolValue != null && $Object.hasOwnProperty.call(message, "boolValue"))
                if (typeof message.boolValue !== "boolean")
                    return "boolValue: boolean expected";
            if (message.int32Value != null && $Object.hasOwnProperty.call(message, "int32Value"))
                if (!$util.isInteger(message.int32Value))
                    return "int32Value: integer expected";
            if (message.uint32Value != null && $Object.hasOwnProperty.call(message, "uint32Value"))
                if (!$util.isInteger(message.uint32Value))
                    return "uint32Value: integer expected";
            if (message.int64Value != null && $Object.hasOwnProperty.call(message, "int64Value"))
                if (!$util.isInteger(message.int64Value) && !(message.int64Value && $util.isInteger(message.int64Value.low) && $util.isInteger(message.int64Value.high)))
                    return "int64Value: integer|Long expected";
            if (message.uint64Value != null && $Object.hasOwnProperty.call(message, "uint64Value"))
                if (!$util.isInteger(message.uint64Value) && !(message.uint64Value && $util.isInteger(message.uint64Value.low) && $util.isInteger(message.uint64Value.high)))
                    return "uint64Value: integer|Long expected";
            if (message.floatValue != null && $Object.hasOwnProperty.call(message, "floatValue"))
                if (typeof message.floatValue !== "number")
                    return "floatValue: number expected";
            if (message.doubleValue != null && $Object.hasOwnProperty.call(message, "doubleValue"))
                if (typeof message.doubleValue !== "number")
                    return "doubleValue: number expected";
            if (message.bytesValue != null && $Object.hasOwnProperty.call(message, "bytesValue"))
                if (!(message.bytesValue && typeof message.bytesValue.length === "number" || $util.isString(message.bytesValue)))
                    return "bytesValue: buffer expected";
            if (message.ipValue != null && $Object.hasOwnProperty.call(message, "ipValue"))
                if (!$util.isString(message.ipValue))
                    return "ipValue: string expected";
            if (message.stringFix != null && $Object.hasOwnProperty.call(message, "stringFix"))
                if (!$util.isString(message.stringFix))
                    return "stringFix: string expected";
            if (message.comboType != null && $Object.hasOwnProperty.call(message, "comboType")) {
                let error = $root.AMR_MODEL_NSP.Message_Combox_Type.verify(message.comboType, _depth + 1);
                if (error)
                    return "comboType." + error;
            }
            if (message.int32Maxvalue != null && $Object.hasOwnProperty.call(message, "int32Maxvalue"))
                if (!$util.isInteger(message.int32Maxvalue))
                    return "int32Maxvalue: integer expected";
            if (message.uint32Maxvalue != null && $Object.hasOwnProperty.call(message, "uint32Maxvalue"))
                if (!$util.isInteger(message.uint32Maxvalue))
                    return "uint32Maxvalue: integer expected";
            if (message.int64Maxvalue != null && $Object.hasOwnProperty.call(message, "int64Maxvalue"))
                if (!$util.isInteger(message.int64Maxvalue) && !(message.int64Maxvalue && $util.isInteger(message.int64Maxvalue.low) && $util.isInteger(message.int64Maxvalue.high)))
                    return "int64Maxvalue: integer|Long expected";
            if (message.uint64Maxvalue != null && $Object.hasOwnProperty.call(message, "uint64Maxvalue"))
                if (!$util.isInteger(message.uint64Maxvalue) && !(message.uint64Maxvalue && $util.isInteger(message.uint64Maxvalue.low) && $util.isInteger(message.uint64Maxvalue.high)))
                    return "uint64Maxvalue: integer|Long expected";
            if (message.floatMaxvalue != null && $Object.hasOwnProperty.call(message, "floatMaxvalue"))
                if (typeof message.floatMaxvalue !== "number")
                    return "floatMaxvalue: number expected";
            if (message.doubleMaxvalue != null && $Object.hasOwnProperty.call(message, "doubleMaxvalue"))
                if (typeof message.doubleMaxvalue !== "number")
                    return "doubleMaxvalue: number expected";
            if (message.int32Minvalue != null && $Object.hasOwnProperty.call(message, "int32Minvalue"))
                if (!$util.isInteger(message.int32Minvalue))
                    return "int32Minvalue: integer expected";
            if (message.uint32Minvalue != null && $Object.hasOwnProperty.call(message, "uint32Minvalue"))
                if (!$util.isInteger(message.uint32Minvalue))
                    return "uint32Minvalue: integer expected";
            if (message.int64Minvalue != null && $Object.hasOwnProperty.call(message, "int64Minvalue"))
                if (!$util.isInteger(message.int64Minvalue) && !(message.int64Minvalue && $util.isInteger(message.int64Minvalue.low) && $util.isInteger(message.int64Minvalue.high)))
                    return "int64Minvalue: integer|Long expected";
            if (message.uint64Minvalue != null && $Object.hasOwnProperty.call(message, "uint64Minvalue"))
                if (!$util.isInteger(message.uint64Minvalue) && !(message.uint64Minvalue && $util.isInteger(message.uint64Minvalue.low) && $util.isInteger(message.uint64Minvalue.high)))
                    return "uint64Minvalue: integer|Long expected";
            if (message.floatMinvalue != null && $Object.hasOwnProperty.call(message, "floatMinvalue"))
                if (typeof message.floatMinvalue !== "number")
                    return "floatMinvalue: number expected";
            if (message.doubleMinvalue != null && $Object.hasOwnProperty.call(message, "doubleMinvalue"))
                if (typeof message.doubleMinvalue !== "number")
                    return "doubleMinvalue: number expected";
            if (message.unit != null && $Object.hasOwnProperty.call(message, "unit"))
                if (!$util.isString(message.unit))
                    return "unit: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.boolParse != null && $Object.hasOwnProperty.call(message, "boolParse"))
                if (typeof message.boolParse !== "boolean")
                    return "boolParse: boolean expected";
            if (message.boolHide != null && $Object.hasOwnProperty.call(message, "boolHide"))
                if (typeof message.boolHide !== "boolean")
                    return "boolHide: boolean expected";
            if (message.boolNoeditable != null && $Object.hasOwnProperty.call(message, "boolNoeditable"))
                if (typeof message.boolNoeditable !== "boolean")
                    return "boolNoeditable: boolean expected";
            if (message.boolMustfill != null && $Object.hasOwnProperty.call(message, "boolMustfill"))
                if (typeof message.boolMustfill !== "boolean")
                    return "boolMustfill: boolean expected";
            if (message.boolBasic != null && $Object.hasOwnProperty.call(message, "boolBasic"))
                if (typeof message.boolBasic !== "boolean")
                    return "boolBasic: boolean expected";
            if (message.fixedSource != null && $Object.hasOwnProperty.call(message, "fixedSource")) {
                if (!$Array.isArray(message.fixedSource))
                    return "fixedSource: array expected";
                for (let i = 0; i < message.fixedSource.length; ++i)
                    if (!$util.isString(message.fixedSource[i]))
                        return "fixedSource: string[] expected";
            }
            return null;
        };

        /**
         * Creates a Message_Base_Element message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Base_Element} Message_Base_Element
         */
        Message_Base_Element.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Base_Element)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Base_Element: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Base_Element();
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.type !== 0 && (typeof object.type !== "string" || $root.AMR_MODEL_NSP.MESSAGE_BASE_DATA_TYPE[object.type] !== 0))
                switch (object.type) {
                case "DATA_BYTES":
                case 0:
                    message.type = 0;
                    break;
                case "DATA_STRING":
                case 1:
                    message.type = 1;
                    break;
                case "DATA_IP":
                case 3:
                    message.type = 3;
                    break;
                case "DATA_BOOL":
                case 4:
                    message.type = 4;
                    break;
                case "DATA_INT32":
                case 5:
                    message.type = 5;
                    break;
                case "DATA_UINT32":
                case 6:
                    message.type = 6;
                    break;
                case "DATA_INT64":
                case 7:
                    message.type = 7;
                    break;
                case "DATA_UINT64":
                case 8:
                    message.type = 8;
                    break;
                case "DATA_FLOAT":
                case 9:
                    message.type = 9;
                    break;
                case "DATA_DOUBLE":
                case 10:
                    message.type = 10;
                    break;
                case "DATA_COMBOX":
                case 11:
                    message.type = 11;
                    break;
                case "DATA_FIXED_E":
                case 12:
                    message.type = 12;
                    break;
                default:
                    if (typeof object.type === "number" && (object.type | 0) === object.type)
                        message.type = object.type;
                }
            if (object.stringValue != null)
                if (typeof object.stringValue !== "string" || object.stringValue.length)
                    message.stringValue = $String(object.stringValue);
            if (object.boolValue != null)
                if (object.boolValue)
                    message.boolValue = $Boolean(object.boolValue);
            if (object.int32Value != null)
                if ($Number(object.int32Value) !== 0)
                    message.int32Value = object.int32Value | 0;
            if (object.uint32Value != null)
                if ($Number(object.uint32Value) !== 0)
                    message.uint32Value = object.uint32Value >>> 0;
            if (object.int64Value != null)
                if (typeof object.int64Value === "object" ? object.int64Value.low || object.int64Value.high : $Number(object.int64Value) !== 0)
                    if ($util.Long)
                        message.int64Value = $util.Long.fromValue(object.int64Value, false);
                    else if (typeof object.int64Value === "string")
                        message.int64Value = $parseInt(object.int64Value, 10);
                    else if (typeof object.int64Value === "number")
                        message.int64Value = object.int64Value;
                    else if (typeof object.int64Value === "object")
                        message.int64Value = new $util.LongBits(object.int64Value.low >>> 0, object.int64Value.high >>> 0).toNumber();
            if (object.uint64Value != null)
                if (typeof object.uint64Value === "object" ? object.uint64Value.low || object.uint64Value.high : $Number(object.uint64Value) !== 0)
                    if ($util.Long)
                        message.uint64Value = $util.Long.fromValue(object.uint64Value, true);
                    else if (typeof object.uint64Value === "string")
                        message.uint64Value = $parseInt(object.uint64Value, 10);
                    else if (typeof object.uint64Value === "number")
                        message.uint64Value = object.uint64Value;
                    else if (typeof object.uint64Value === "object")
                        message.uint64Value = new $util.LongBits(object.uint64Value.low >>> 0, object.uint64Value.high >>> 0).toNumber(true);
            if (object.floatValue != null)
                if (!$Object.is($Number(object.floatValue), 0))
                    message.floatValue = $Number(object.floatValue);
            if (object.doubleValue != null)
                if (!$Object.is($Number(object.doubleValue), 0))
                    message.doubleValue = $Number(object.doubleValue);
            if (object.bytesValue != null)
                if (object.bytesValue.length)
                    if (typeof object.bytesValue === "string")
                        $util.base64.decode(object.bytesValue, message.bytesValue = $util.newBuffer($util.base64.length(object.bytesValue)), 0);
                    else if (object.bytesValue.length >= 0)
                        message.bytesValue = object.bytesValue;
            if (object.ipValue != null)
                if (typeof object.ipValue !== "string" || object.ipValue.length)
                    message.ipValue = $String(object.ipValue);
            if (object.stringFix != null)
                if (typeof object.stringFix !== "string" || object.stringFix.length)
                    message.stringFix = $String(object.stringFix);
            if (object.comboType != null) {
                if (!$util.isObject(object.comboType))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Base_Element.comboType: object expected");
                message.comboType = $root.AMR_MODEL_NSP.Message_Combox_Type.fromObject(object.comboType, _depth + 1);
            }
            if (object.int32Maxvalue != null)
                if ($Number(object.int32Maxvalue) !== 0)
                    message.int32Maxvalue = object.int32Maxvalue | 0;
            if (object.uint32Maxvalue != null)
                if ($Number(object.uint32Maxvalue) !== 0)
                    message.uint32Maxvalue = object.uint32Maxvalue >>> 0;
            if (object.int64Maxvalue != null)
                if (typeof object.int64Maxvalue === "object" ? object.int64Maxvalue.low || object.int64Maxvalue.high : $Number(object.int64Maxvalue) !== 0)
                    if ($util.Long)
                        message.int64Maxvalue = $util.Long.fromValue(object.int64Maxvalue, false);
                    else if (typeof object.int64Maxvalue === "string")
                        message.int64Maxvalue = $parseInt(object.int64Maxvalue, 10);
                    else if (typeof object.int64Maxvalue === "number")
                        message.int64Maxvalue = object.int64Maxvalue;
                    else if (typeof object.int64Maxvalue === "object")
                        message.int64Maxvalue = new $util.LongBits(object.int64Maxvalue.low >>> 0, object.int64Maxvalue.high >>> 0).toNumber();
            if (object.uint64Maxvalue != null)
                if (typeof object.uint64Maxvalue === "object" ? object.uint64Maxvalue.low || object.uint64Maxvalue.high : $Number(object.uint64Maxvalue) !== 0)
                    if ($util.Long)
                        message.uint64Maxvalue = $util.Long.fromValue(object.uint64Maxvalue, true);
                    else if (typeof object.uint64Maxvalue === "string")
                        message.uint64Maxvalue = $parseInt(object.uint64Maxvalue, 10);
                    else if (typeof object.uint64Maxvalue === "number")
                        message.uint64Maxvalue = object.uint64Maxvalue;
                    else if (typeof object.uint64Maxvalue === "object")
                        message.uint64Maxvalue = new $util.LongBits(object.uint64Maxvalue.low >>> 0, object.uint64Maxvalue.high >>> 0).toNumber(true);
            if (object.floatMaxvalue != null)
                if (!$Object.is($Number(object.floatMaxvalue), 0))
                    message.floatMaxvalue = $Number(object.floatMaxvalue);
            if (object.doubleMaxvalue != null)
                if (!$Object.is($Number(object.doubleMaxvalue), 0))
                    message.doubleMaxvalue = $Number(object.doubleMaxvalue);
            if (object.int32Minvalue != null)
                if ($Number(object.int32Minvalue) !== 0)
                    message.int32Minvalue = object.int32Minvalue | 0;
            if (object.uint32Minvalue != null)
                if ($Number(object.uint32Minvalue) !== 0)
                    message.uint32Minvalue = object.uint32Minvalue >>> 0;
            if (object.int64Minvalue != null)
                if (typeof object.int64Minvalue === "object" ? object.int64Minvalue.low || object.int64Minvalue.high : $Number(object.int64Minvalue) !== 0)
                    if ($util.Long)
                        message.int64Minvalue = $util.Long.fromValue(object.int64Minvalue, false);
                    else if (typeof object.int64Minvalue === "string")
                        message.int64Minvalue = $parseInt(object.int64Minvalue, 10);
                    else if (typeof object.int64Minvalue === "number")
                        message.int64Minvalue = object.int64Minvalue;
                    else if (typeof object.int64Minvalue === "object")
                        message.int64Minvalue = new $util.LongBits(object.int64Minvalue.low >>> 0, object.int64Minvalue.high >>> 0).toNumber();
            if (object.uint64Minvalue != null)
                if (typeof object.uint64Minvalue === "object" ? object.uint64Minvalue.low || object.uint64Minvalue.high : $Number(object.uint64Minvalue) !== 0)
                    if ($util.Long)
                        message.uint64Minvalue = $util.Long.fromValue(object.uint64Minvalue, true);
                    else if (typeof object.uint64Minvalue === "string")
                        message.uint64Minvalue = $parseInt(object.uint64Minvalue, 10);
                    else if (typeof object.uint64Minvalue === "number")
                        message.uint64Minvalue = object.uint64Minvalue;
                    else if (typeof object.uint64Minvalue === "object")
                        message.uint64Minvalue = new $util.LongBits(object.uint64Minvalue.low >>> 0, object.uint64Minvalue.high >>> 0).toNumber(true);
            if (object.floatMinvalue != null)
                if (!$Object.is($Number(object.floatMinvalue), 0))
                    message.floatMinvalue = $Number(object.floatMinvalue);
            if (object.doubleMinvalue != null)
                if (!$Object.is($Number(object.doubleMinvalue), 0))
                    message.doubleMinvalue = $Number(object.doubleMinvalue);
            if (object.unit != null)
                if (typeof object.unit !== "string" || object.unit.length)
                    message.unit = $String(object.unit);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.boolParse != null)
                if (object.boolParse)
                    message.boolParse = $Boolean(object.boolParse);
            if (object.boolHide != null)
                if (object.boolHide)
                    message.boolHide = $Boolean(object.boolHide);
            if (object.boolNoeditable != null)
                if (object.boolNoeditable)
                    message.boolNoeditable = $Boolean(object.boolNoeditable);
            if (object.boolMustfill != null)
                if (object.boolMustfill)
                    message.boolMustfill = $Boolean(object.boolMustfill);
            if (object.boolBasic != null)
                if (object.boolBasic)
                    message.boolBasic = $Boolean(object.boolBasic);
            if (object.fixedSource) {
                if (!$Array.isArray(object.fixedSource))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Base_Element.fixedSource: array expected");
                message.fixedSource = $Array(object.fixedSource.length);
                for (let i = 0; i < object.fixedSource.length; ++i)
                    message.fixedSource[i] = $String(object.fixedSource[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_Base_Element message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @static
         * @param {AMR_MODEL_NSP.Message_Base_Element} message Message_Base_Element
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Base_Element.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.fixedSource = [];
            if (options.defaults) {
                object.key = "";
                object.type = options.enums === $String ? "DATA_BYTES" : 0;
                object.stringValue = "";
                object.boolValue = false;
                object.int32Value = 0;
                object.uint32Value = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.int64Value = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.int64Value = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.uint64Value = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.uint64Value = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                object.floatValue = 0;
                object.doubleValue = 0;
                if (options.bytes === $String)
                    object.bytesValue = "";
                else {
                    object.bytesValue = [];
                    if (options.bytes !== $Array)
                        object.bytesValue = $util.newBuffer(object.bytesValue);
                }
                object.ipValue = "";
                object.stringFix = "";
                object.comboType = null;
                object.int32Maxvalue = 0;
                object.uint32Maxvalue = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.int64Maxvalue = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.int64Maxvalue = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.uint64Maxvalue = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.uint64Maxvalue = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                object.floatMaxvalue = 0;
                object.doubleMaxvalue = 0;
                object.int32Minvalue = 0;
                object.uint32Minvalue = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.int64Minvalue = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.int64Minvalue = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.uint64Minvalue = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.uint64Minvalue = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                object.floatMinvalue = 0;
                object.doubleMinvalue = 0;
                object.unit = "";
                object.desc = "";
                object.boolParse = false;
                object.boolHide = false;
                object.boolNoeditable = false;
                object.boolMustfill = false;
                object.boolBasic = false;
            }
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                object.type = options.enums === $String ? $root.AMR_MODEL_NSP.MESSAGE_BASE_DATA_TYPE[message.type] === $undefined ? message.type : $root.AMR_MODEL_NSP.MESSAGE_BASE_DATA_TYPE[message.type] : message.type;
            if (message.stringValue != null && $Object.hasOwnProperty.call(message, "stringValue"))
                object.stringValue = message.stringValue;
            if (message.boolValue != null && $Object.hasOwnProperty.call(message, "boolValue"))
                object.boolValue = message.boolValue;
            if (message.int32Value != null && $Object.hasOwnProperty.call(message, "int32Value"))
                object.int32Value = message.int32Value;
            if (message.uint32Value != null && $Object.hasOwnProperty.call(message, "uint32Value"))
                object.uint32Value = message.uint32Value;
            if (message.int64Value != null && $Object.hasOwnProperty.call(message, "int64Value"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.int64Value = typeof message.int64Value === "number" ? $BigInt(message.int64Value) : $util.Long.fromBits(message.int64Value.low >>> 0, message.int64Value.high >>> 0, false).toBigInt();
                else if (typeof message.int64Value === "number")
                    object.int64Value = options.longs === $String ? $String(message.int64Value) : message.int64Value;
                else
                    object.int64Value = options.longs === $String ? $util.Long.prototype.toString.call(message.int64Value) : options.longs === $Number ? new $util.LongBits(message.int64Value.low >>> 0, message.int64Value.high >>> 0).toNumber() : message.int64Value;
            if (message.uint64Value != null && $Object.hasOwnProperty.call(message, "uint64Value"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.uint64Value = typeof message.uint64Value === "number" ? $BigInt(message.uint64Value) : $util.Long.fromBits(message.uint64Value.low >>> 0, message.uint64Value.high >>> 0, true).toBigInt();
                else if (typeof message.uint64Value === "number")
                    object.uint64Value = options.longs === $String ? $String(message.uint64Value) : message.uint64Value;
                else
                    object.uint64Value = options.longs === $String ? $util.Long.prototype.toString.call(message.uint64Value) : options.longs === $Number ? new $util.LongBits(message.uint64Value.low >>> 0, message.uint64Value.high >>> 0).toNumber(true) : message.uint64Value;
            if (message.floatValue != null && $Object.hasOwnProperty.call(message, "floatValue"))
                object.floatValue = options.json && !$isFinite(message.floatValue) ? $String(message.floatValue) : message.floatValue;
            if (message.doubleValue != null && $Object.hasOwnProperty.call(message, "doubleValue"))
                object.doubleValue = options.json && !$isFinite(message.doubleValue) ? $String(message.doubleValue) : message.doubleValue;
            if (message.bytesValue != null && $Object.hasOwnProperty.call(message, "bytesValue"))
                object.bytesValue = options.bytes === $String ? $util.base64.encode(message.bytesValue, 0, message.bytesValue.length) : options.bytes === $Array ? $Array.prototype.slice.call(message.bytesValue) : message.bytesValue;
            if (message.ipValue != null && $Object.hasOwnProperty.call(message, "ipValue"))
                object.ipValue = message.ipValue;
            if (message.stringFix != null && $Object.hasOwnProperty.call(message, "stringFix"))
                object.stringFix = message.stringFix;
            if (message.comboType != null && $Object.hasOwnProperty.call(message, "comboType"))
                object.comboType = $root.AMR_MODEL_NSP.Message_Combox_Type.toObject(message.comboType, options, _depth + 1);
            if (message.int32Maxvalue != null && $Object.hasOwnProperty.call(message, "int32Maxvalue"))
                object.int32Maxvalue = message.int32Maxvalue;
            if (message.uint32Maxvalue != null && $Object.hasOwnProperty.call(message, "uint32Maxvalue"))
                object.uint32Maxvalue = message.uint32Maxvalue;
            if (message.int64Maxvalue != null && $Object.hasOwnProperty.call(message, "int64Maxvalue"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.int64Maxvalue = typeof message.int64Maxvalue === "number" ? $BigInt(message.int64Maxvalue) : $util.Long.fromBits(message.int64Maxvalue.low >>> 0, message.int64Maxvalue.high >>> 0, false).toBigInt();
                else if (typeof message.int64Maxvalue === "number")
                    object.int64Maxvalue = options.longs === $String ? $String(message.int64Maxvalue) : message.int64Maxvalue;
                else
                    object.int64Maxvalue = options.longs === $String ? $util.Long.prototype.toString.call(message.int64Maxvalue) : options.longs === $Number ? new $util.LongBits(message.int64Maxvalue.low >>> 0, message.int64Maxvalue.high >>> 0).toNumber() : message.int64Maxvalue;
            if (message.uint64Maxvalue != null && $Object.hasOwnProperty.call(message, "uint64Maxvalue"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.uint64Maxvalue = typeof message.uint64Maxvalue === "number" ? $BigInt(message.uint64Maxvalue) : $util.Long.fromBits(message.uint64Maxvalue.low >>> 0, message.uint64Maxvalue.high >>> 0, true).toBigInt();
                else if (typeof message.uint64Maxvalue === "number")
                    object.uint64Maxvalue = options.longs === $String ? $String(message.uint64Maxvalue) : message.uint64Maxvalue;
                else
                    object.uint64Maxvalue = options.longs === $String ? $util.Long.prototype.toString.call(message.uint64Maxvalue) : options.longs === $Number ? new $util.LongBits(message.uint64Maxvalue.low >>> 0, message.uint64Maxvalue.high >>> 0).toNumber(true) : message.uint64Maxvalue;
            if (message.floatMaxvalue != null && $Object.hasOwnProperty.call(message, "floatMaxvalue"))
                object.floatMaxvalue = options.json && !$isFinite(message.floatMaxvalue) ? $String(message.floatMaxvalue) : message.floatMaxvalue;
            if (message.doubleMaxvalue != null && $Object.hasOwnProperty.call(message, "doubleMaxvalue"))
                object.doubleMaxvalue = options.json && !$isFinite(message.doubleMaxvalue) ? $String(message.doubleMaxvalue) : message.doubleMaxvalue;
            if (message.int32Minvalue != null && $Object.hasOwnProperty.call(message, "int32Minvalue"))
                object.int32Minvalue = message.int32Minvalue;
            if (message.uint32Minvalue != null && $Object.hasOwnProperty.call(message, "uint32Minvalue"))
                object.uint32Minvalue = message.uint32Minvalue;
            if (message.int64Minvalue != null && $Object.hasOwnProperty.call(message, "int64Minvalue"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.int64Minvalue = typeof message.int64Minvalue === "number" ? $BigInt(message.int64Minvalue) : $util.Long.fromBits(message.int64Minvalue.low >>> 0, message.int64Minvalue.high >>> 0, false).toBigInt();
                else if (typeof message.int64Minvalue === "number")
                    object.int64Minvalue = options.longs === $String ? $String(message.int64Minvalue) : message.int64Minvalue;
                else
                    object.int64Minvalue = options.longs === $String ? $util.Long.prototype.toString.call(message.int64Minvalue) : options.longs === $Number ? new $util.LongBits(message.int64Minvalue.low >>> 0, message.int64Minvalue.high >>> 0).toNumber() : message.int64Minvalue;
            if (message.uint64Minvalue != null && $Object.hasOwnProperty.call(message, "uint64Minvalue"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.uint64Minvalue = typeof message.uint64Minvalue === "number" ? $BigInt(message.uint64Minvalue) : $util.Long.fromBits(message.uint64Minvalue.low >>> 0, message.uint64Minvalue.high >>> 0, true).toBigInt();
                else if (typeof message.uint64Minvalue === "number")
                    object.uint64Minvalue = options.longs === $String ? $String(message.uint64Minvalue) : message.uint64Minvalue;
                else
                    object.uint64Minvalue = options.longs === $String ? $util.Long.prototype.toString.call(message.uint64Minvalue) : options.longs === $Number ? new $util.LongBits(message.uint64Minvalue.low >>> 0, message.uint64Minvalue.high >>> 0).toNumber(true) : message.uint64Minvalue;
            if (message.floatMinvalue != null && $Object.hasOwnProperty.call(message, "floatMinvalue"))
                object.floatMinvalue = options.json && !$isFinite(message.floatMinvalue) ? $String(message.floatMinvalue) : message.floatMinvalue;
            if (message.doubleMinvalue != null && $Object.hasOwnProperty.call(message, "doubleMinvalue"))
                object.doubleMinvalue = options.json && !$isFinite(message.doubleMinvalue) ? $String(message.doubleMinvalue) : message.doubleMinvalue;
            if (message.unit != null && $Object.hasOwnProperty.call(message, "unit"))
                object.unit = message.unit;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.boolParse != null && $Object.hasOwnProperty.call(message, "boolParse"))
                object.boolParse = message.boolParse;
            if (message.boolHide != null && $Object.hasOwnProperty.call(message, "boolHide"))
                object.boolHide = message.boolHide;
            if (message.boolNoeditable != null && $Object.hasOwnProperty.call(message, "boolNoeditable"))
                object.boolNoeditable = message.boolNoeditable;
            if (message.boolMustfill != null && $Object.hasOwnProperty.call(message, "boolMustfill"))
                object.boolMustfill = message.boolMustfill;
            if (message.boolBasic != null && $Object.hasOwnProperty.call(message, "boolBasic"))
                object.boolBasic = message.boolBasic;
            if (message.fixedSource && message.fixedSource.length) {
                object.fixedSource = $Array(message.fixedSource.length);
                for (let j = 0; j < message.fixedSource.length; ++j)
                    object.fixedSource[j] = message.fixedSource[j];
            }
            return object;
        };

        /**
         * Converts this Message_Base_Element to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Base_Element.prototype.toJSON = function() {
            return Message_Base_Element.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Base_Element
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Base_Element
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Base_Element.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Base_Element";
        };

        return Message_Base_Element;
    })();

    AMR_MODEL_NSP.Message_Base_Group_Element = (function() {

        /**
         * Properties of a Message_Base_Group_Element.
         * @typedef {Object} AMR_MODEL_NSP.Message_Base_Group_Element.$Properties
         * @property {string|null} [key] Message_Base_Group_Element key
         * @property {string|null} [desc] Message_Base_Group_Element desc
         * @property {Array.<AMR_MODEL_NSP.Message_Base_Element.$Properties>|null} [arrayBaseEle] Message_Base_Group_Element arrayBaseEle
         * @property {boolean|null} [boolDeprecated] Message_Base_Group_Element boolDeprecated
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Base_Group_Element.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Base_Group_Element
         * @augments AMR_MODEL_NSP.Message_Base_Group_Element.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Base_Group_Element.$Properties instead.
         */

        /**
         * Shape of a Message_Base_Group_Element.
         * @typedef {AMR_MODEL_NSP.Message_Base_Group_Element.$Properties} AMR_MODEL_NSP.Message_Base_Group_Element.$Shape
         */

        /**
         * Constructs a new Message_Base_Group_Element.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Base_Group_Element.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Base_Group_Element.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Base_Group_Element = function (properties) {
            this.arrayBaseEle = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Base_Group_Element key.
         * @member {string} key
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @instance
         */
        Message_Base_Group_Element.prototype.key = "";

        /**
         * Message_Base_Group_Element desc.
         * @member {string} desc
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @instance
         */
        Message_Base_Group_Element.prototype.desc = "";

        /**
         * Message_Base_Group_Element arrayBaseEle.
         * @member {Array.<AMR_MODEL_NSP.Message_Base_Element.$Properties>} arrayBaseEle
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @instance
         */
        Message_Base_Group_Element.prototype.arrayBaseEle = $util.emptyArray;

        /**
         * Message_Base_Group_Element boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @instance
         */
        Message_Base_Group_Element.prototype.boolDeprecated = false;

        /**
         * Creates a new Message_Base_Group_Element instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @static
         * @param {AMR_MODEL_NSP.Message_Base_Group_Element.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Base_Group_Element} Message_Base_Group_Element instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Base_Group_Element.$Shape): AMR_MODEL_NSP.Message_Base_Group_Element & AMR_MODEL_NSP.Message_Base_Group_Element.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Base_Group_Element.$Properties): AMR_MODEL_NSP.Message_Base_Group_Element;
         * }}
         */
        Message_Base_Group_Element.create = function(properties) {
            return new Message_Base_Group_Element(properties);
        };

        /**
         * Encodes the specified Message_Base_Group_Element message. Does not implicitly {@link AMR_MODEL_NSP.Message_Base_Group_Element.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @static
         * @param {AMR_MODEL_NSP.Message_Base_Group_Element.$Properties} message Message_Base_Group_Element message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Base_Group_Element.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.desc);
            if (message.arrayBaseEle != null && message.arrayBaseEle.length)
                for (let i = 0; i < message.arrayBaseEle.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.arrayBaseEle[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.boolDeprecated);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Base_Group_Element message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Base_Group_Element.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @static
         * @param {AMR_MODEL_NSP.Message_Base_Group_Element.$Properties} message Message_Base_Group_Element message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Base_Group_Element.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Base_Group_Element message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Base_Group_Element & AMR_MODEL_NSP.Message_Base_Group_Element.$Shape} Message_Base_Group_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Base_Group_Element.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Base_Group_Element(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if (!(message.arrayBaseEle && message.arrayBaseEle.length))
                            message.arrayBaseEle = [];
                        message.arrayBaseEle.push($root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Base_Group_Element message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Base_Group_Element & AMR_MODEL_NSP.Message_Base_Group_Element.$Shape} Message_Base_Group_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Base_Group_Element.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Base_Group_Element message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Base_Group_Element.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.arrayBaseEle != null && $Object.hasOwnProperty.call(message, "arrayBaseEle")) {
                if (!$Array.isArray(message.arrayBaseEle))
                    return "arrayBaseEle: array expected";
                for (let i = 0; i < message.arrayBaseEle.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.arrayBaseEle[i], _depth + 1);
                    if (error)
                        return "arrayBaseEle." + error;
                }
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            return null;
        };

        /**
         * Creates a Message_Base_Group_Element message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Base_Group_Element} Message_Base_Group_Element
         */
        Message_Base_Group_Element.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Base_Group_Element)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Base_Group_Element: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Base_Group_Element();
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.arrayBaseEle) {
                if (!$Array.isArray(object.arrayBaseEle))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Base_Group_Element.arrayBaseEle: array expected");
                message.arrayBaseEle = $Array(object.arrayBaseEle.length);
                for (let i = 0; i < object.arrayBaseEle.length; ++i) {
                    if (!$util.isObject(object.arrayBaseEle[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Base_Group_Element.arrayBaseEle: object expected");
                    message.arrayBaseEle[i] = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.arrayBaseEle[i], _depth + 1);
                }
            }
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            return message;
        };

        /**
         * Creates a plain object from a Message_Base_Group_Element message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @static
         * @param {AMR_MODEL_NSP.Message_Base_Group_Element} message Message_Base_Group_Element
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Base_Group_Element.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.arrayBaseEle = [];
            if (options.defaults) {
                object.key = "";
                object.desc = "";
                object.boolDeprecated = false;
            }
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.arrayBaseEle && message.arrayBaseEle.length) {
                object.arrayBaseEle = $Array(message.arrayBaseEle.length);
                for (let j = 0; j < message.arrayBaseEle.length; ++j)
                    object.arrayBaseEle[j] = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.arrayBaseEle[j], options, _depth + 1);
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            return object;
        };

        /**
         * Converts this Message_Base_Group_Element to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Base_Group_Element.prototype.toJSON = function() {
            return Message_Base_Group_Element.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Base_Group_Element
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Base_Group_Element
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Base_Group_Element.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Base_Group_Element";
        };

        return Message_Base_Group_Element;
    })();

    AMR_MODEL_NSP.Message_Sphere = (function() {

        /**
         * Properties of a Message_Sphere.
         * @typedef {Object} AMR_MODEL_NSP.Message_Sphere.$Properties
         * @property {number|null} [diameter] Message_Sphere diameter
         * @property {boolean|null} [boolDeprecated] Message_Sphere boolDeprecated
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Sphere.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Sphere
         * @augments AMR_MODEL_NSP.Message_Sphere.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Sphere.$Properties instead.
         */

        /**
         * Shape of a Message_Sphere.
         * @typedef {AMR_MODEL_NSP.Message_Sphere.$Properties} AMR_MODEL_NSP.Message_Sphere.$Shape
         */

        /**
         * Constructs a new Message_Sphere.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Sphere.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Sphere.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Sphere = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Sphere diameter.
         * @member {number} diameter
         * @memberof AMR_MODEL_NSP.Message_Sphere
         * @instance
         */
        Message_Sphere.prototype.diameter = 0;

        /**
         * Message_Sphere boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_Sphere
         * @instance
         */
        Message_Sphere.prototype.boolDeprecated = false;

        /**
         * Creates a new Message_Sphere instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Sphere
         * @static
         * @param {AMR_MODEL_NSP.Message_Sphere.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Sphere} Message_Sphere instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Sphere.$Shape): AMR_MODEL_NSP.Message_Sphere & AMR_MODEL_NSP.Message_Sphere.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Sphere.$Properties): AMR_MODEL_NSP.Message_Sphere;
         * }}
         */
        Message_Sphere.create = function(properties) {
            return new Message_Sphere(properties);
        };

        /**
         * Encodes the specified Message_Sphere message. Does not implicitly {@link AMR_MODEL_NSP.Message_Sphere.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Sphere
         * @static
         * @param {AMR_MODEL_NSP.Message_Sphere.$Properties} message Message_Sphere message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Sphere.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.diameter != null && $Object.hasOwnProperty.call(message, "diameter") && message.diameter !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.diameter);
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.boolDeprecated);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Sphere message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Sphere.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Sphere
         * @static
         * @param {AMR_MODEL_NSP.Message_Sphere.$Properties} message Message_Sphere message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Sphere.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Sphere message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Sphere
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Sphere & AMR_MODEL_NSP.Message_Sphere.$Shape} Message_Sphere
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Sphere.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Sphere(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.diameter = value;
                        else
                            delete message.diameter;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Sphere message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Sphere
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Sphere & AMR_MODEL_NSP.Message_Sphere.$Shape} Message_Sphere
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Sphere.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Sphere message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Sphere
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Sphere.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.diameter != null && $Object.hasOwnProperty.call(message, "diameter"))
                if (!$util.isInteger(message.diameter))
                    return "diameter: integer expected";
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            return null;
        };

        /**
         * Creates a Message_Sphere message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Sphere
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Sphere} Message_Sphere
         */
        Message_Sphere.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Sphere)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Sphere: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Sphere();
            if (object.diameter != null)
                if ($Number(object.diameter) !== 0)
                    message.diameter = object.diameter >>> 0;
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            return message;
        };

        /**
         * Creates a plain object from a Message_Sphere message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Sphere
         * @static
         * @param {AMR_MODEL_NSP.Message_Sphere} message Message_Sphere
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Sphere.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.diameter = 0;
                object.boolDeprecated = false;
            }
            if (message.diameter != null && $Object.hasOwnProperty.call(message, "diameter"))
                object.diameter = message.diameter;
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            return object;
        };

        /**
         * Converts this Message_Sphere to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Sphere
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Sphere.prototype.toJSON = function() {
            return Message_Sphere.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Sphere
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Sphere
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Sphere.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Sphere";
        };

        return Message_Sphere;
    })();

    AMR_MODEL_NSP.Message_BOX = (function() {

        /**
         * Properties of a Message_BOX.
         * @typedef {Object} AMR_MODEL_NSP.Message_BOX.$Properties
         * @property {number|null} [sizeLen] Message_BOX sizeLen
         * @property {number|null} [sizeWidth] Message_BOX sizeWidth
         * @property {number|null} [sizeHeight] Message_BOX sizeHeight
         * @property {boolean|null} [boolDeprecated] Message_BOX boolDeprecated
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_BOX.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_BOX
         * @augments AMR_MODEL_NSP.Message_BOX.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_BOX.$Properties instead.
         */

        /**
         * Shape of a Message_BOX.
         * @typedef {AMR_MODEL_NSP.Message_BOX.$Properties} AMR_MODEL_NSP.Message_BOX.$Shape
         */

        /**
         * Constructs a new Message_BOX.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_BOX.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_BOX.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_BOX = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_BOX sizeLen.
         * @member {number} sizeLen
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @instance
         */
        Message_BOX.prototype.sizeLen = 0;

        /**
         * Message_BOX sizeWidth.
         * @member {number} sizeWidth
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @instance
         */
        Message_BOX.prototype.sizeWidth = 0;

        /**
         * Message_BOX sizeHeight.
         * @member {number} sizeHeight
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @instance
         */
        Message_BOX.prototype.sizeHeight = 0;

        /**
         * Message_BOX boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @instance
         */
        Message_BOX.prototype.boolDeprecated = false;

        /**
         * Creates a new Message_BOX instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @static
         * @param {AMR_MODEL_NSP.Message_BOX.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_BOX} Message_BOX instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_BOX.$Shape): AMR_MODEL_NSP.Message_BOX & AMR_MODEL_NSP.Message_BOX.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_BOX.$Properties): AMR_MODEL_NSP.Message_BOX;
         * }}
         */
        Message_BOX.create = function(properties) {
            return new Message_BOX(properties);
        };

        /**
         * Encodes the specified Message_BOX message. Does not implicitly {@link AMR_MODEL_NSP.Message_BOX.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @static
         * @param {AMR_MODEL_NSP.Message_BOX.$Properties} message Message_BOX message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_BOX.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.sizeLen != null && $Object.hasOwnProperty.call(message, "sizeLen") && message.sizeLen !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.sizeLen);
            if (message.sizeWidth != null && $Object.hasOwnProperty.call(message, "sizeWidth") && message.sizeWidth !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.sizeWidth);
            if (message.sizeHeight != null && $Object.hasOwnProperty.call(message, "sizeHeight") && message.sizeHeight !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.sizeHeight);
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.boolDeprecated);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_BOX message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_BOX.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @static
         * @param {AMR_MODEL_NSP.Message_BOX.$Properties} message Message_BOX message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_BOX.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_BOX message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_BOX & AMR_MODEL_NSP.Message_BOX.$Shape} Message_BOX
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_BOX.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_BOX(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.sizeLen = value;
                        else
                            delete message.sizeLen;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.sizeWidth = value;
                        else
                            delete message.sizeWidth;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.sizeHeight = value;
                        else
                            delete message.sizeHeight;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_BOX message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_BOX & AMR_MODEL_NSP.Message_BOX.$Shape} Message_BOX
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_BOX.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_BOX message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_BOX.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.sizeLen != null && $Object.hasOwnProperty.call(message, "sizeLen"))
                if (!$util.isInteger(message.sizeLen))
                    return "sizeLen: integer expected";
            if (message.sizeWidth != null && $Object.hasOwnProperty.call(message, "sizeWidth"))
                if (!$util.isInteger(message.sizeWidth))
                    return "sizeWidth: integer expected";
            if (message.sizeHeight != null && $Object.hasOwnProperty.call(message, "sizeHeight"))
                if (!$util.isInteger(message.sizeHeight))
                    return "sizeHeight: integer expected";
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            return null;
        };

        /**
         * Creates a Message_BOX message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_BOX} Message_BOX
         */
        Message_BOX.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_BOX)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_BOX: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_BOX();
            if (object.sizeLen != null)
                if ($Number(object.sizeLen) !== 0)
                    message.sizeLen = object.sizeLen >>> 0;
            if (object.sizeWidth != null)
                if ($Number(object.sizeWidth) !== 0)
                    message.sizeWidth = object.sizeWidth >>> 0;
            if (object.sizeHeight != null)
                if ($Number(object.sizeHeight) !== 0)
                    message.sizeHeight = object.sizeHeight >>> 0;
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            return message;
        };

        /**
         * Creates a plain object from a Message_BOX message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @static
         * @param {AMR_MODEL_NSP.Message_BOX} message Message_BOX
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_BOX.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.sizeLen = 0;
                object.sizeWidth = 0;
                object.sizeHeight = 0;
                object.boolDeprecated = false;
            }
            if (message.sizeLen != null && $Object.hasOwnProperty.call(message, "sizeLen"))
                object.sizeLen = message.sizeLen;
            if (message.sizeWidth != null && $Object.hasOwnProperty.call(message, "sizeWidth"))
                object.sizeWidth = message.sizeWidth;
            if (message.sizeHeight != null && $Object.hasOwnProperty.call(message, "sizeHeight"))
                object.sizeHeight = message.sizeHeight;
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            return object;
        };

        /**
         * Converts this Message_BOX to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_BOX.prototype.toJSON = function() {
            return Message_BOX.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_BOX
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_BOX
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_BOX.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_BOX";
        };

        return Message_BOX;
    })();

    AMR_MODEL_NSP.Message_CYLINDER = (function() {

        /**
         * Properties of a Message_CYLINDER.
         * @typedef {Object} AMR_MODEL_NSP.Message_CYLINDER.$Properties
         * @property {number|null} [diameter] Message_CYLINDER diameter
         * @property {number|null} [height] Message_CYLINDER height
         * @property {boolean|null} [boolDeprecated] Message_CYLINDER boolDeprecated
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_CYLINDER.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_CYLINDER
         * @augments AMR_MODEL_NSP.Message_CYLINDER.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_CYLINDER.$Properties instead.
         */

        /**
         * Shape of a Message_CYLINDER.
         * @typedef {AMR_MODEL_NSP.Message_CYLINDER.$Properties} AMR_MODEL_NSP.Message_CYLINDER.$Shape
         */

        /**
         * Constructs a new Message_CYLINDER.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_CYLINDER.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_CYLINDER.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_CYLINDER = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_CYLINDER diameter.
         * @member {number} diameter
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @instance
         */
        Message_CYLINDER.prototype.diameter = 0;

        /**
         * Message_CYLINDER height.
         * @member {number} height
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @instance
         */
        Message_CYLINDER.prototype.height = 0;

        /**
         * Message_CYLINDER boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @instance
         */
        Message_CYLINDER.prototype.boolDeprecated = false;

        /**
         * Creates a new Message_CYLINDER instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @static
         * @param {AMR_MODEL_NSP.Message_CYLINDER.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_CYLINDER} Message_CYLINDER instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_CYLINDER.$Shape): AMR_MODEL_NSP.Message_CYLINDER & AMR_MODEL_NSP.Message_CYLINDER.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_CYLINDER.$Properties): AMR_MODEL_NSP.Message_CYLINDER;
         * }}
         */
        Message_CYLINDER.create = function(properties) {
            return new Message_CYLINDER(properties);
        };

        /**
         * Encodes the specified Message_CYLINDER message. Does not implicitly {@link AMR_MODEL_NSP.Message_CYLINDER.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @static
         * @param {AMR_MODEL_NSP.Message_CYLINDER.$Properties} message Message_CYLINDER message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_CYLINDER.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.diameter != null && $Object.hasOwnProperty.call(message, "diameter") && message.diameter !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.diameter);
            if (message.height != null && $Object.hasOwnProperty.call(message, "height") && message.height !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.height);
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.boolDeprecated);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_CYLINDER message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_CYLINDER.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @static
         * @param {AMR_MODEL_NSP.Message_CYLINDER.$Properties} message Message_CYLINDER message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_CYLINDER.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_CYLINDER message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_CYLINDER & AMR_MODEL_NSP.Message_CYLINDER.$Shape} Message_CYLINDER
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_CYLINDER.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_CYLINDER(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.diameter = value;
                        else
                            delete message.diameter;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.height = value;
                        else
                            delete message.height;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_CYLINDER message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_CYLINDER & AMR_MODEL_NSP.Message_CYLINDER.$Shape} Message_CYLINDER
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_CYLINDER.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_CYLINDER message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_CYLINDER.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.diameter != null && $Object.hasOwnProperty.call(message, "diameter"))
                if (!$util.isInteger(message.diameter))
                    return "diameter: integer expected";
            if (message.height != null && $Object.hasOwnProperty.call(message, "height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            return null;
        };

        /**
         * Creates a Message_CYLINDER message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_CYLINDER} Message_CYLINDER
         */
        Message_CYLINDER.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_CYLINDER)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_CYLINDER: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_CYLINDER();
            if (object.diameter != null)
                if ($Number(object.diameter) !== 0)
                    message.diameter = object.diameter >>> 0;
            if (object.height != null)
                if ($Number(object.height) !== 0)
                    message.height = object.height >>> 0;
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            return message;
        };

        /**
         * Creates a plain object from a Message_CYLINDER message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @static
         * @param {AMR_MODEL_NSP.Message_CYLINDER} message Message_CYLINDER
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_CYLINDER.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.diameter = 0;
                object.height = 0;
                object.boolDeprecated = false;
            }
            if (message.diameter != null && $Object.hasOwnProperty.call(message, "diameter"))
                object.diameter = message.diameter;
            if (message.height != null && $Object.hasOwnProperty.call(message, "height"))
                object.height = message.height;
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            return object;
        };

        /**
         * Converts this Message_CYLINDER to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_CYLINDER.prototype.toJSON = function() {
            return Message_CYLINDER.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_CYLINDER
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_CYLINDER
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_CYLINDER.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_CYLINDER";
        };

        return Message_CYLINDER;
    })();

    AMR_MODEL_NSP.Message_Module_Shape = (function() {

        /**
         * Properties of a Message_Module_Shape.
         * @typedef {Object} AMR_MODEL_NSP.Message_Module_Shape.$Properties
         * @property {AMR_MODEL_NSP.MESSAGE_SHAPE_TYPE|null} [shapeType] Message_Module_Shape shapeType
         * @property {boolean|null} [boolDeprecated] Message_Module_Shape boolDeprecated
         * @property {AMR_MODEL_NSP.Message_Sphere.$Properties|null} [sphere] Message_Module_Shape sphere
         * @property {AMR_MODEL_NSP.Message_BOX.$Properties|null} [box] Message_Module_Shape box
         * @property {AMR_MODEL_NSP.Message_CYLINDER.$Properties|null} [cylinder] Message_Module_Shape cylinder
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Module_Shape.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Module_Shape
         * @augments AMR_MODEL_NSP.Message_Module_Shape.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Module_Shape.$Properties instead.
         */

        /**
         * Shape of a Message_Module_Shape.
         * @typedef {AMR_MODEL_NSP.Message_Module_Shape.$Properties} AMR_MODEL_NSP.Message_Module_Shape.$Shape
         */

        /**
         * Constructs a new Message_Module_Shape.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Module_Shape.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Module_Shape.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Module_Shape = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Module_Shape shapeType.
         * @member {AMR_MODEL_NSP.MESSAGE_SHAPE_TYPE} shapeType
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @instance
         */
        Message_Module_Shape.prototype.shapeType = 0;

        /**
         * Message_Module_Shape boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @instance
         */
        Message_Module_Shape.prototype.boolDeprecated = false;

        /**
         * Message_Module_Shape sphere.
         * @member {AMR_MODEL_NSP.Message_Sphere.$Properties|null|undefined} sphere
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @instance
         */
        Message_Module_Shape.prototype.sphere = null;

        /**
         * Message_Module_Shape box.
         * @member {AMR_MODEL_NSP.Message_BOX.$Properties|null|undefined} box
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @instance
         */
        Message_Module_Shape.prototype.box = null;

        /**
         * Message_Module_Shape cylinder.
         * @member {AMR_MODEL_NSP.Message_CYLINDER.$Properties|null|undefined} cylinder
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @instance
         */
        Message_Module_Shape.prototype.cylinder = null;

        /**
         * Creates a new Message_Module_Shape instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Shape.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Module_Shape} Message_Module_Shape instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Module_Shape.$Shape): AMR_MODEL_NSP.Message_Module_Shape & AMR_MODEL_NSP.Message_Module_Shape.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Module_Shape.$Properties): AMR_MODEL_NSP.Message_Module_Shape;
         * }}
         */
        Message_Module_Shape.create = function(properties) {
            return new Message_Module_Shape(properties);
        };

        /**
         * Encodes the specified Message_Module_Shape message. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Shape.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Shape.$Properties} message Message_Module_Shape message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Module_Shape.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.shapeType != null && $Object.hasOwnProperty.call(message, "shapeType") && message.shapeType !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.shapeType);
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.boolDeprecated);
            if (message.sphere != null && $Object.hasOwnProperty.call(message, "sphere"))
                $root.AMR_MODEL_NSP.Message_Sphere.encode(message.sphere, writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
            if (message.box != null && $Object.hasOwnProperty.call(message, "box"))
                $root.AMR_MODEL_NSP.Message_BOX.encode(message.box, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.cylinder != null && $Object.hasOwnProperty.call(message, "cylinder"))
                $root.AMR_MODEL_NSP.Message_CYLINDER.encode(message.cylinder, writer.uint32(/* id 12, wireType 2 =*/98).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Module_Shape message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Shape.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Shape.$Properties} message Message_Module_Shape message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Module_Shape.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Module_Shape message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Module_Shape & AMR_MODEL_NSP.Message_Module_Shape.$Shape} Message_Module_Shape
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Module_Shape.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Module_Shape(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.shapeType = value;
                        else
                            delete message.shapeType;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        message.sphere = $root.AMR_MODEL_NSP.Message_Sphere.decode(reader, reader.uint32(), $undefined, _depth + 1, message.sphere);
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        message.box = $root.AMR_MODEL_NSP.Message_BOX.decode(reader, reader.uint32(), $undefined, _depth + 1, message.box);
                        continue;
                    }
                case 12: {
                        if (wireType !== 2)
                            break;
                        message.cylinder = $root.AMR_MODEL_NSP.Message_CYLINDER.decode(reader, reader.uint32(), $undefined, _depth + 1, message.cylinder);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Module_Shape message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Module_Shape & AMR_MODEL_NSP.Message_Module_Shape.$Shape} Message_Module_Shape
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Module_Shape.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Module_Shape message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Module_Shape.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.shapeType != null && $Object.hasOwnProperty.call(message, "shapeType"))
                if (typeof message.shapeType !== "number" || (message.shapeType | 0) !== message.shapeType)
                    return "shapeType: enum value expected";
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            if (message.sphere != null && $Object.hasOwnProperty.call(message, "sphere")) {
                let error = $root.AMR_MODEL_NSP.Message_Sphere.verify(message.sphere, _depth + 1);
                if (error)
                    return "sphere." + error;
            }
            if (message.box != null && $Object.hasOwnProperty.call(message, "box")) {
                let error = $root.AMR_MODEL_NSP.Message_BOX.verify(message.box, _depth + 1);
                if (error)
                    return "box." + error;
            }
            if (message.cylinder != null && $Object.hasOwnProperty.call(message, "cylinder")) {
                let error = $root.AMR_MODEL_NSP.Message_CYLINDER.verify(message.cylinder, _depth + 1);
                if (error)
                    return "cylinder." + error;
            }
            return null;
        };

        /**
         * Creates a Message_Module_Shape message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Module_Shape} Message_Module_Shape
         */
        Message_Module_Shape.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Module_Shape)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Module_Shape: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Module_Shape();
            if (object.shapeType !== 0 && (typeof object.shapeType !== "string" || $root.AMR_MODEL_NSP.MESSAGE_SHAPE_TYPE[object.shapeType] !== 0))
                switch (object.shapeType) {
                case "ENUM_SPHERE":
                case 0:
                    message.shapeType = 0;
                    break;
                case "ENUM_BOX":
                case 1:
                    message.shapeType = 1;
                    break;
                case "ENUM_CYLINDER":
                case 2:
                    message.shapeType = 2;
                    break;
                default:
                    if (typeof object.shapeType === "number" && (object.shapeType | 0) === object.shapeType)
                        message.shapeType = object.shapeType;
                }
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            if (object.sphere != null) {
                if (!$util.isObject(object.sphere))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_Shape.sphere: object expected");
                message.sphere = $root.AMR_MODEL_NSP.Message_Sphere.fromObject(object.sphere, _depth + 1);
            }
            if (object.box != null) {
                if (!$util.isObject(object.box))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_Shape.box: object expected");
                message.box = $root.AMR_MODEL_NSP.Message_BOX.fromObject(object.box, _depth + 1);
            }
            if (object.cylinder != null) {
                if (!$util.isObject(object.cylinder))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_Shape.cylinder: object expected");
                message.cylinder = $root.AMR_MODEL_NSP.Message_CYLINDER.fromObject(object.cylinder, _depth + 1);
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_Module_Shape message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Shape} message Message_Module_Shape
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Module_Shape.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.shapeType = options.enums === $String ? "ENUM_SPHERE" : 0;
                object.boolDeprecated = false;
                object.sphere = null;
                object.box = null;
                object.cylinder = null;
            }
            if (message.shapeType != null && $Object.hasOwnProperty.call(message, "shapeType"))
                object.shapeType = options.enums === $String ? $root.AMR_MODEL_NSP.MESSAGE_SHAPE_TYPE[message.shapeType] === $undefined ? message.shapeType : $root.AMR_MODEL_NSP.MESSAGE_SHAPE_TYPE[message.shapeType] : message.shapeType;
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            if (message.sphere != null && $Object.hasOwnProperty.call(message, "sphere"))
                object.sphere = $root.AMR_MODEL_NSP.Message_Sphere.toObject(message.sphere, options, _depth + 1);
            if (message.box != null && $Object.hasOwnProperty.call(message, "box"))
                object.box = $root.AMR_MODEL_NSP.Message_BOX.toObject(message.box, options, _depth + 1);
            if (message.cylinder != null && $Object.hasOwnProperty.call(message, "cylinder"))
                object.cylinder = $root.AMR_MODEL_NSP.Message_CYLINDER.toObject(message.cylinder, options, _depth + 1);
            return object;
        };

        /**
         * Converts this Message_Module_Shape to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Module_Shape.prototype.toJSON = function() {
            return Message_Module_Shape.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Module_Shape
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Module_Shape
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Module_Shape.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Module_Shape";
        };

        return Message_Module_Shape;
    })();

    AMR_MODEL_NSP.Message_Module_General_Attribute = (function() {

        /**
         * Properties of a Message_Module_General_Attribute.
         * @typedef {Object} AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties
         * @property {AMR_MODEL_NSP.Message_Base_Element.$Properties|null} [moduleName] Message_Module_General_Attribute moduleName
         * @property {AMR_MODEL_NSP.Message_Base_Element.$Properties|null} [moduleDesc] Message_Module_General_Attribute moduleDesc
         * @property {AMR_MODEL_NSP.Message_Base_Element.$Properties|null} [moduleUuid] Message_Module_General_Attribute moduleUuid
         * @property {AMR_MODEL_NSP.Message_Base_Element.$Properties|null} [versionInfo] Message_Module_General_Attribute versionInfo
         * @property {AMR_MODEL_NSP.Message_Base_Element.$Properties|null} [module_3dIcon] Message_Module_General_Attribute module_3dIcon
         * @property {AMR_MODEL_NSP.Message_Base_Element.$Properties|null} [subSysType] Message_Module_General_Attribute subSysType
         * @property {AMR_MODEL_NSP.Message_Base_Element.$Properties|null} [mainModuleType] Message_Module_General_Attribute mainModuleType
         * @property {AMR_MODEL_NSP.Message_Base_Element.$Properties|null} [subModuleType] Message_Module_General_Attribute subModuleType
         * @property {AMR_MODEL_NSP.Message_Base_Element.$Properties|null} [venderName] Message_Module_General_Attribute venderName
         * @property {AMR_MODEL_NSP.Message_Base_Element.$Properties|null} [moduleDscType] Message_Module_General_Attribute moduleDscType
         * @property {AMR_MODEL_NSP.Message_Base_Element.$Properties|null} [moduleIcon] Message_Module_General_Attribute moduleIcon
         * @property {AMR_MODEL_NSP.Message_Module_Shape.$Properties|null} [moduleShape] Message_Module_General_Attribute moduleShape
         * @property {boolean|null} [boolDeprecated] Message_Module_General_Attribute boolDeprecated
         * @property {Array.<AMR_MODEL_NSP.Message_Base_Element.$Properties>|null} [extendParams] Message_Module_General_Attribute extendParams
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Module_General_Attribute.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Module_General_Attribute
         * @augments AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties instead.
         */

        /**
         * Shape of a Message_Module_General_Attribute.
         * @typedef {AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties} AMR_MODEL_NSP.Message_Module_General_Attribute.$Shape
         */

        /**
         * Constructs a new Message_Module_General_Attribute.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Module_General_Attribute.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Module_General_Attribute = function (properties) {
            this.extendParams = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Module_General_Attribute moduleName.
         * @member {AMR_MODEL_NSP.Message_Base_Element.$Properties|null|undefined} moduleName
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.moduleName = null;

        /**
         * Message_Module_General_Attribute moduleDesc.
         * @member {AMR_MODEL_NSP.Message_Base_Element.$Properties|null|undefined} moduleDesc
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.moduleDesc = null;

        /**
         * Message_Module_General_Attribute moduleUuid.
         * @member {AMR_MODEL_NSP.Message_Base_Element.$Properties|null|undefined} moduleUuid
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.moduleUuid = null;

        /**
         * Message_Module_General_Attribute versionInfo.
         * @member {AMR_MODEL_NSP.Message_Base_Element.$Properties|null|undefined} versionInfo
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.versionInfo = null;

        /**
         * Message_Module_General_Attribute module_3dIcon.
         * @member {AMR_MODEL_NSP.Message_Base_Element.$Properties|null|undefined} module_3dIcon
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.module_3dIcon = null;

        /**
         * Message_Module_General_Attribute subSysType.
         * @member {AMR_MODEL_NSP.Message_Base_Element.$Properties|null|undefined} subSysType
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.subSysType = null;

        /**
         * Message_Module_General_Attribute mainModuleType.
         * @member {AMR_MODEL_NSP.Message_Base_Element.$Properties|null|undefined} mainModuleType
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.mainModuleType = null;

        /**
         * Message_Module_General_Attribute subModuleType.
         * @member {AMR_MODEL_NSP.Message_Base_Element.$Properties|null|undefined} subModuleType
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.subModuleType = null;

        /**
         * Message_Module_General_Attribute venderName.
         * @member {AMR_MODEL_NSP.Message_Base_Element.$Properties|null|undefined} venderName
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.venderName = null;

        /**
         * Message_Module_General_Attribute moduleDscType.
         * @member {AMR_MODEL_NSP.Message_Base_Element.$Properties|null|undefined} moduleDscType
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.moduleDscType = null;

        /**
         * Message_Module_General_Attribute moduleIcon.
         * @member {AMR_MODEL_NSP.Message_Base_Element.$Properties|null|undefined} moduleIcon
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.moduleIcon = null;

        /**
         * Message_Module_General_Attribute moduleShape.
         * @member {AMR_MODEL_NSP.Message_Module_Shape.$Properties|null|undefined} moduleShape
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.moduleShape = null;

        /**
         * Message_Module_General_Attribute boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.boolDeprecated = false;

        /**
         * Message_Module_General_Attribute extendParams.
         * @member {Array.<AMR_MODEL_NSP.Message_Base_Element.$Properties>} extendParams
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         */
        Message_Module_General_Attribute.prototype.extendParams = $util.emptyArray;

        /**
         * Creates a new Message_Module_General_Attribute instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Module_General_Attribute} Message_Module_General_Attribute instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Module_General_Attribute.$Shape): AMR_MODEL_NSP.Message_Module_General_Attribute & AMR_MODEL_NSP.Message_Module_General_Attribute.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties): AMR_MODEL_NSP.Message_Module_General_Attribute;
         * }}
         */
        Message_Module_General_Attribute.create = function(properties) {
            return new Message_Module_General_Attribute(properties);
        };

        /**
         * Encodes the specified Message_Module_General_Attribute message. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_General_Attribute.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties} message Message_Module_General_Attribute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Module_General_Attribute.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.moduleName != null && $Object.hasOwnProperty.call(message, "moduleName"))
                $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.moduleName, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.moduleDesc != null && $Object.hasOwnProperty.call(message, "moduleDesc"))
                $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.moduleDesc, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.moduleUuid != null && $Object.hasOwnProperty.call(message, "moduleUuid"))
                $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.moduleUuid, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.versionInfo != null && $Object.hasOwnProperty.call(message, "versionInfo"))
                $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.versionInfo, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
            if (message.module_3dIcon != null && $Object.hasOwnProperty.call(message, "module_3dIcon"))
                $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.module_3dIcon, writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
            if (message.subSysType != null && $Object.hasOwnProperty.call(message, "subSysType"))
                $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.subSysType, writer.uint32(/* id 7, wireType 2 =*/58).fork(), _depth + 1).ldelim();
            if (message.mainModuleType != null && $Object.hasOwnProperty.call(message, "mainModuleType"))
                $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.mainModuleType, writer.uint32(/* id 8, wireType 2 =*/66).fork(), _depth + 1).ldelim();
            if (message.subModuleType != null && $Object.hasOwnProperty.call(message, "subModuleType"))
                $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.subModuleType, writer.uint32(/* id 9, wireType 2 =*/74).fork(), _depth + 1).ldelim();
            if (message.venderName != null && $Object.hasOwnProperty.call(message, "venderName"))
                $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.venderName, writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
            if (message.moduleDscType != null && $Object.hasOwnProperty.call(message, "moduleDscType"))
                $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.moduleDscType, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.moduleIcon != null && $Object.hasOwnProperty.call(message, "moduleIcon"))
                $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.moduleIcon, writer.uint32(/* id 12, wireType 2 =*/98).fork(), _depth + 1).ldelim();
            if (message.moduleShape != null && $Object.hasOwnProperty.call(message, "moduleShape"))
                $root.AMR_MODEL_NSP.Message_Module_Shape.encode(message.moduleShape, writer.uint32(/* id 13, wireType 2 =*/106).fork(), _depth + 1).ldelim();
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 14, wireType 0 =*/112).bool(message.boolDeprecated);
            if (message.extendParams != null && message.extendParams.length)
                for (let i = 0; i < message.extendParams.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.extendParams[i], writer.uint32(/* id 20, wireType 2 =*/162).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Module_General_Attribute message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_General_Attribute.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties} message Message_Module_General_Attribute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Module_General_Attribute.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Module_General_Attribute message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Module_General_Attribute & AMR_MODEL_NSP.Message_Module_General_Attribute.$Shape} Message_Module_General_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Module_General_Attribute.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Module_General_Attribute(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.moduleName = $root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1, message.moduleName);
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.moduleDesc = $root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1, message.moduleDesc);
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.moduleUuid = $root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1, message.moduleUuid);
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        message.versionInfo = $root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1, message.versionInfo);
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        message.module_3dIcon = $root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1, message.module_3dIcon);
                        continue;
                    }
                case 7: {
                        if (wireType !== 2)
                            break;
                        message.subSysType = $root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1, message.subSysType);
                        continue;
                    }
                case 8: {
                        if (wireType !== 2)
                            break;
                        message.mainModuleType = $root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1, message.mainModuleType);
                        continue;
                    }
                case 9: {
                        if (wireType !== 2)
                            break;
                        message.subModuleType = $root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1, message.subModuleType);
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        message.venderName = $root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1, message.venderName);
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        message.moduleDscType = $root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1, message.moduleDscType);
                        continue;
                    }
                case 12: {
                        if (wireType !== 2)
                            break;
                        message.moduleIcon = $root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1, message.moduleIcon);
                        continue;
                    }
                case 13: {
                        if (wireType !== 2)
                            break;
                        message.moduleShape = $root.AMR_MODEL_NSP.Message_Module_Shape.decode(reader, reader.uint32(), $undefined, _depth + 1, message.moduleShape);
                        continue;
                    }
                case 14: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                case 20: {
                        if (wireType !== 2)
                            break;
                        if (!(message.extendParams && message.extendParams.length))
                            message.extendParams = [];
                        message.extendParams.push($root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Module_General_Attribute message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Module_General_Attribute & AMR_MODEL_NSP.Message_Module_General_Attribute.$Shape} Message_Module_General_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Module_General_Attribute.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Module_General_Attribute message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Module_General_Attribute.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.moduleName != null && $Object.hasOwnProperty.call(message, "moduleName")) {
                let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.moduleName, _depth + 1);
                if (error)
                    return "moduleName." + error;
            }
            if (message.moduleDesc != null && $Object.hasOwnProperty.call(message, "moduleDesc")) {
                let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.moduleDesc, _depth + 1);
                if (error)
                    return "moduleDesc." + error;
            }
            if (message.moduleUuid != null && $Object.hasOwnProperty.call(message, "moduleUuid")) {
                let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.moduleUuid, _depth + 1);
                if (error)
                    return "moduleUuid." + error;
            }
            if (message.versionInfo != null && $Object.hasOwnProperty.call(message, "versionInfo")) {
                let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.versionInfo, _depth + 1);
                if (error)
                    return "versionInfo." + error;
            }
            if (message.module_3dIcon != null && $Object.hasOwnProperty.call(message, "module_3dIcon")) {
                let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.module_3dIcon, _depth + 1);
                if (error)
                    return "module_3dIcon." + error;
            }
            if (message.subSysType != null && $Object.hasOwnProperty.call(message, "subSysType")) {
                let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.subSysType, _depth + 1);
                if (error)
                    return "subSysType." + error;
            }
            if (message.mainModuleType != null && $Object.hasOwnProperty.call(message, "mainModuleType")) {
                let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.mainModuleType, _depth + 1);
                if (error)
                    return "mainModuleType." + error;
            }
            if (message.subModuleType != null && $Object.hasOwnProperty.call(message, "subModuleType")) {
                let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.subModuleType, _depth + 1);
                if (error)
                    return "subModuleType." + error;
            }
            if (message.venderName != null && $Object.hasOwnProperty.call(message, "venderName")) {
                let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.venderName, _depth + 1);
                if (error)
                    return "venderName." + error;
            }
            if (message.moduleDscType != null && $Object.hasOwnProperty.call(message, "moduleDscType")) {
                let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.moduleDscType, _depth + 1);
                if (error)
                    return "moduleDscType." + error;
            }
            if (message.moduleIcon != null && $Object.hasOwnProperty.call(message, "moduleIcon")) {
                let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.moduleIcon, _depth + 1);
                if (error)
                    return "moduleIcon." + error;
            }
            if (message.moduleShape != null && $Object.hasOwnProperty.call(message, "moduleShape")) {
                let error = $root.AMR_MODEL_NSP.Message_Module_Shape.verify(message.moduleShape, _depth + 1);
                if (error)
                    return "moduleShape." + error;
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            if (message.extendParams != null && $Object.hasOwnProperty.call(message, "extendParams")) {
                if (!$Array.isArray(message.extendParams))
                    return "extendParams: array expected";
                for (let i = 0; i < message.extendParams.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.extendParams[i], _depth + 1);
                    if (error)
                        return "extendParams." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Message_Module_General_Attribute message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Module_General_Attribute} Message_Module_General_Attribute
         */
        Message_Module_General_Attribute.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Module_General_Attribute)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Module_General_Attribute();
            if (object.moduleName != null) {
                if (!$util.isObject(object.moduleName))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.moduleName: object expected");
                message.moduleName = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.moduleName, _depth + 1);
            }
            if (object.moduleDesc != null) {
                if (!$util.isObject(object.moduleDesc))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.moduleDesc: object expected");
                message.moduleDesc = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.moduleDesc, _depth + 1);
            }
            if (object.moduleUuid != null) {
                if (!$util.isObject(object.moduleUuid))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.moduleUuid: object expected");
                message.moduleUuid = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.moduleUuid, _depth + 1);
            }
            if (object.versionInfo != null) {
                if (!$util.isObject(object.versionInfo))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.versionInfo: object expected");
                message.versionInfo = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.versionInfo, _depth + 1);
            }
            if (object.module_3dIcon != null) {
                if (!$util.isObject(object.module_3dIcon))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.module_3dIcon: object expected");
                message.module_3dIcon = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.module_3dIcon, _depth + 1);
            }
            if (object.subSysType != null) {
                if (!$util.isObject(object.subSysType))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.subSysType: object expected");
                message.subSysType = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.subSysType, _depth + 1);
            }
            if (object.mainModuleType != null) {
                if (!$util.isObject(object.mainModuleType))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.mainModuleType: object expected");
                message.mainModuleType = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.mainModuleType, _depth + 1);
            }
            if (object.subModuleType != null) {
                if (!$util.isObject(object.subModuleType))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.subModuleType: object expected");
                message.subModuleType = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.subModuleType, _depth + 1);
            }
            if (object.venderName != null) {
                if (!$util.isObject(object.venderName))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.venderName: object expected");
                message.venderName = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.venderName, _depth + 1);
            }
            if (object.moduleDscType != null) {
                if (!$util.isObject(object.moduleDscType))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.moduleDscType: object expected");
                message.moduleDscType = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.moduleDscType, _depth + 1);
            }
            if (object.moduleIcon != null) {
                if (!$util.isObject(object.moduleIcon))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.moduleIcon: object expected");
                message.moduleIcon = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.moduleIcon, _depth + 1);
            }
            if (object.moduleShape != null) {
                if (!$util.isObject(object.moduleShape))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.moduleShape: object expected");
                message.moduleShape = $root.AMR_MODEL_NSP.Message_Module_Shape.fromObject(object.moduleShape, _depth + 1);
            }
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            if (object.extendParams) {
                if (!$Array.isArray(object.extendParams))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.extendParams: array expected");
                message.extendParams = $Array(object.extendParams.length);
                for (let i = 0; i < object.extendParams.length; ++i) {
                    if (!$util.isObject(object.extendParams[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Module_General_Attribute.extendParams: object expected");
                    message.extendParams[i] = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.extendParams[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_Module_General_Attribute message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_General_Attribute} message Message_Module_General_Attribute
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Module_General_Attribute.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.extendParams = [];
            if (options.defaults) {
                object.moduleName = null;
                object.moduleDesc = null;
                object.moduleUuid = null;
                object.versionInfo = null;
                object.module_3dIcon = null;
                object.subSysType = null;
                object.mainModuleType = null;
                object.subModuleType = null;
                object.venderName = null;
                object.moduleDscType = null;
                object.moduleIcon = null;
                object.moduleShape = null;
                object.boolDeprecated = false;
            }
            if (message.moduleName != null && $Object.hasOwnProperty.call(message, "moduleName"))
                object.moduleName = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.moduleName, options, _depth + 1);
            if (message.moduleDesc != null && $Object.hasOwnProperty.call(message, "moduleDesc"))
                object.moduleDesc = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.moduleDesc, options, _depth + 1);
            if (message.moduleUuid != null && $Object.hasOwnProperty.call(message, "moduleUuid"))
                object.moduleUuid = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.moduleUuid, options, _depth + 1);
            if (message.versionInfo != null && $Object.hasOwnProperty.call(message, "versionInfo"))
                object.versionInfo = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.versionInfo, options, _depth + 1);
            if (message.module_3dIcon != null && $Object.hasOwnProperty.call(message, "module_3dIcon"))
                object.module_3dIcon = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.module_3dIcon, options, _depth + 1);
            if (message.subSysType != null && $Object.hasOwnProperty.call(message, "subSysType"))
                object.subSysType = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.subSysType, options, _depth + 1);
            if (message.mainModuleType != null && $Object.hasOwnProperty.call(message, "mainModuleType"))
                object.mainModuleType = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.mainModuleType, options, _depth + 1);
            if (message.subModuleType != null && $Object.hasOwnProperty.call(message, "subModuleType"))
                object.subModuleType = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.subModuleType, options, _depth + 1);
            if (message.venderName != null && $Object.hasOwnProperty.call(message, "venderName"))
                object.venderName = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.venderName, options, _depth + 1);
            if (message.moduleDscType != null && $Object.hasOwnProperty.call(message, "moduleDscType"))
                object.moduleDscType = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.moduleDscType, options, _depth + 1);
            if (message.moduleIcon != null && $Object.hasOwnProperty.call(message, "moduleIcon"))
                object.moduleIcon = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.moduleIcon, options, _depth + 1);
            if (message.moduleShape != null && $Object.hasOwnProperty.call(message, "moduleShape"))
                object.moduleShape = $root.AMR_MODEL_NSP.Message_Module_Shape.toObject(message.moduleShape, options, _depth + 1);
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            if (message.extendParams && message.extendParams.length) {
                object.extendParams = $Array(message.extendParams.length);
                for (let j = 0; j < message.extendParams.length; ++j)
                    object.extendParams[j] = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.extendParams[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Message_Module_General_Attribute to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Module_General_Attribute.prototype.toJSON = function() {
            return Message_Module_General_Attribute.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Module_General_Attribute
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Module_General_Attribute
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Module_General_Attribute.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Module_General_Attribute";
        };

        return Message_Module_General_Attribute;
    })();

    AMR_MODEL_NSP.Message_Struct_Param = (function() {

        /**
         * Properties of a Message_Struct_Param.
         * @typedef {Object} AMR_MODEL_NSP.Message_Struct_Param.$Properties
         * @property {Array.<AMR_MODEL_NSP.Message_Base_Element.$Properties>|null} [extendParams] Message_Struct_Param extendParams
         * @property {Array.<AMR_MODEL_NSP.Message_Base_Group_Element.$Properties>|null} [segmentedLimitsParams] Message_Struct_Param segmentedLimitsParams
         * @property {boolean|null} [boolDeprecated] Message_Struct_Param boolDeprecated
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Struct_Param.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Struct_Param
         * @augments AMR_MODEL_NSP.Message_Struct_Param.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Struct_Param.$Properties instead.
         */

        /**
         * Shape of a Message_Struct_Param.
         * @typedef {AMR_MODEL_NSP.Message_Struct_Param.$Properties} AMR_MODEL_NSP.Message_Struct_Param.$Shape
         */

        /**
         * Constructs a new Message_Struct_Param.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Struct_Param.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Struct_Param.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Struct_Param = function (properties) {
            this.extendParams = [];
            this.segmentedLimitsParams = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Struct_Param extendParams.
         * @member {Array.<AMR_MODEL_NSP.Message_Base_Element.$Properties>} extendParams
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @instance
         */
        Message_Struct_Param.prototype.extendParams = $util.emptyArray;

        /**
         * Message_Struct_Param segmentedLimitsParams.
         * @member {Array.<AMR_MODEL_NSP.Message_Base_Group_Element.$Properties>} segmentedLimitsParams
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @instance
         */
        Message_Struct_Param.prototype.segmentedLimitsParams = $util.emptyArray;

        /**
         * Message_Struct_Param boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @instance
         */
        Message_Struct_Param.prototype.boolDeprecated = false;

        /**
         * Creates a new Message_Struct_Param instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @static
         * @param {AMR_MODEL_NSP.Message_Struct_Param.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Struct_Param} Message_Struct_Param instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Struct_Param.$Shape): AMR_MODEL_NSP.Message_Struct_Param & AMR_MODEL_NSP.Message_Struct_Param.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Struct_Param.$Properties): AMR_MODEL_NSP.Message_Struct_Param;
         * }}
         */
        Message_Struct_Param.create = function(properties) {
            return new Message_Struct_Param(properties);
        };

        /**
         * Encodes the specified Message_Struct_Param message. Does not implicitly {@link AMR_MODEL_NSP.Message_Struct_Param.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @static
         * @param {AMR_MODEL_NSP.Message_Struct_Param.$Properties} message Message_Struct_Param message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Struct_Param.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.extendParams != null && message.extendParams.length)
                for (let i = 0; i < message.extendParams.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.extendParams[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.segmentedLimitsParams != null && message.segmentedLimitsParams.length)
                for (let i = 0; i < message.segmentedLimitsParams.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Base_Group_Element.encode(message.segmentedLimitsParams[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.boolDeprecated);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Struct_Param message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Struct_Param.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @static
         * @param {AMR_MODEL_NSP.Message_Struct_Param.$Properties} message Message_Struct_Param message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Struct_Param.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Struct_Param message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Struct_Param & AMR_MODEL_NSP.Message_Struct_Param.$Shape} Message_Struct_Param
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Struct_Param.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Struct_Param(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (!(message.extendParams && message.extendParams.length))
                            message.extendParams = [];
                        message.extendParams.push($root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if (!(message.segmentedLimitsParams && message.segmentedLimitsParams.length))
                            message.segmentedLimitsParams = [];
                        message.segmentedLimitsParams.push($root.AMR_MODEL_NSP.Message_Base_Group_Element.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Struct_Param message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Struct_Param & AMR_MODEL_NSP.Message_Struct_Param.$Shape} Message_Struct_Param
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Struct_Param.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Struct_Param message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Struct_Param.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.extendParams != null && $Object.hasOwnProperty.call(message, "extendParams")) {
                if (!$Array.isArray(message.extendParams))
                    return "extendParams: array expected";
                for (let i = 0; i < message.extendParams.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.extendParams[i], _depth + 1);
                    if (error)
                        return "extendParams." + error;
                }
            }
            if (message.segmentedLimitsParams != null && $Object.hasOwnProperty.call(message, "segmentedLimitsParams")) {
                if (!$Array.isArray(message.segmentedLimitsParams))
                    return "segmentedLimitsParams: array expected";
                for (let i = 0; i < message.segmentedLimitsParams.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Base_Group_Element.verify(message.segmentedLimitsParams[i], _depth + 1);
                    if (error)
                        return "segmentedLimitsParams." + error;
                }
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            return null;
        };

        /**
         * Creates a Message_Struct_Param message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Struct_Param} Message_Struct_Param
         */
        Message_Struct_Param.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Struct_Param)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Struct_Param: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Struct_Param();
            if (object.extendParams) {
                if (!$Array.isArray(object.extendParams))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Struct_Param.extendParams: array expected");
                message.extendParams = $Array(object.extendParams.length);
                for (let i = 0; i < object.extendParams.length; ++i) {
                    if (!$util.isObject(object.extendParams[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Struct_Param.extendParams: object expected");
                    message.extendParams[i] = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.extendParams[i], _depth + 1);
                }
            }
            if (object.segmentedLimitsParams) {
                if (!$Array.isArray(object.segmentedLimitsParams))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Struct_Param.segmentedLimitsParams: array expected");
                message.segmentedLimitsParams = $Array(object.segmentedLimitsParams.length);
                for (let i = 0; i < object.segmentedLimitsParams.length; ++i) {
                    if (!$util.isObject(object.segmentedLimitsParams[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Struct_Param.segmentedLimitsParams: object expected");
                    message.segmentedLimitsParams[i] = $root.AMR_MODEL_NSP.Message_Base_Group_Element.fromObject(object.segmentedLimitsParams[i], _depth + 1);
                }
            }
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            return message;
        };

        /**
         * Creates a plain object from a Message_Struct_Param message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @static
         * @param {AMR_MODEL_NSP.Message_Struct_Param} message Message_Struct_Param
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Struct_Param.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults) {
                object.extendParams = [];
                object.segmentedLimitsParams = [];
            }
            if (options.defaults)
                object.boolDeprecated = false;
            if (message.extendParams && message.extendParams.length) {
                object.extendParams = $Array(message.extendParams.length);
                for (let j = 0; j < message.extendParams.length; ++j)
                    object.extendParams[j] = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.extendParams[j], options, _depth + 1);
            }
            if (message.segmentedLimitsParams && message.segmentedLimitsParams.length) {
                object.segmentedLimitsParams = $Array(message.segmentedLimitsParams.length);
                for (let j = 0; j < message.segmentedLimitsParams.length; ++j)
                    object.segmentedLimitsParams[j] = $root.AMR_MODEL_NSP.Message_Base_Group_Element.toObject(message.segmentedLimitsParams[j], options, _depth + 1);
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            return object;
        };

        /**
         * Converts this Message_Struct_Param to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Struct_Param.prototype.toJSON = function() {
            return Message_Struct_Param.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Struct_Param
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Struct_Param
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Struct_Param.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Struct_Param";
        };

        return Message_Struct_Param;
    })();

    AMR_MODEL_NSP.Message_Module_Private_Attribute = (function() {

        /**
         * Properties of a Message_Module_Private_Attribute.
         * @typedef {Object} AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties
         * @property {Array.<AMR_MODEL_NSP.Message_Base_Group_Element.$Properties>|null} [privateAttrs] Message_Module_Private_Attribute privateAttrs
         * @property {boolean|null} [boolDeprecated] Message_Module_Private_Attribute boolDeprecated
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Module_Private_Attribute.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Module_Private_Attribute
         * @augments AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties instead.
         */

        /**
         * Shape of a Message_Module_Private_Attribute.
         * @typedef {AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties} AMR_MODEL_NSP.Message_Module_Private_Attribute.$Shape
         */

        /**
         * Constructs a new Message_Module_Private_Attribute.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Module_Private_Attribute.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Module_Private_Attribute = function (properties) {
            this.privateAttrs = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Module_Private_Attribute privateAttrs.
         * @member {Array.<AMR_MODEL_NSP.Message_Base_Group_Element.$Properties>} privateAttrs
         * @memberof AMR_MODEL_NSP.Message_Module_Private_Attribute
         * @instance
         */
        Message_Module_Private_Attribute.prototype.privateAttrs = $util.emptyArray;

        /**
         * Message_Module_Private_Attribute boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_Module_Private_Attribute
         * @instance
         */
        Message_Module_Private_Attribute.prototype.boolDeprecated = false;

        /**
         * Creates a new Message_Module_Private_Attribute instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Module_Private_Attribute
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Module_Private_Attribute} Message_Module_Private_Attribute instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Module_Private_Attribute.$Shape): AMR_MODEL_NSP.Message_Module_Private_Attribute & AMR_MODEL_NSP.Message_Module_Private_Attribute.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties): AMR_MODEL_NSP.Message_Module_Private_Attribute;
         * }}
         */
        Message_Module_Private_Attribute.create = function(properties) {
            return new Message_Module_Private_Attribute(properties);
        };

        /**
         * Encodes the specified Message_Module_Private_Attribute message. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Private_Attribute.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Module_Private_Attribute
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties} message Message_Module_Private_Attribute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Module_Private_Attribute.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.privateAttrs != null && message.privateAttrs.length)
                for (let i = 0; i < message.privateAttrs.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Base_Group_Element.encode(message.privateAttrs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.boolDeprecated);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Module_Private_Attribute message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Private_Attribute.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Module_Private_Attribute
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties} message Message_Module_Private_Attribute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Module_Private_Attribute.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Module_Private_Attribute message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Module_Private_Attribute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Module_Private_Attribute & AMR_MODEL_NSP.Message_Module_Private_Attribute.$Shape} Message_Module_Private_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Module_Private_Attribute.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Module_Private_Attribute(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (!(message.privateAttrs && message.privateAttrs.length))
                            message.privateAttrs = [];
                        message.privateAttrs.push($root.AMR_MODEL_NSP.Message_Base_Group_Element.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Module_Private_Attribute message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Module_Private_Attribute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Module_Private_Attribute & AMR_MODEL_NSP.Message_Module_Private_Attribute.$Shape} Message_Module_Private_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Module_Private_Attribute.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Module_Private_Attribute message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Module_Private_Attribute
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Module_Private_Attribute.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.privateAttrs != null && $Object.hasOwnProperty.call(message, "privateAttrs")) {
                if (!$Array.isArray(message.privateAttrs))
                    return "privateAttrs: array expected";
                for (let i = 0; i < message.privateAttrs.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Base_Group_Element.verify(message.privateAttrs[i], _depth + 1);
                    if (error)
                        return "privateAttrs." + error;
                }
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            return null;
        };

        /**
         * Creates a Message_Module_Private_Attribute message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Module_Private_Attribute
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Module_Private_Attribute} Message_Module_Private_Attribute
         */
        Message_Module_Private_Attribute.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Module_Private_Attribute)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Module_Private_Attribute: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Module_Private_Attribute();
            if (object.privateAttrs) {
                if (!$Array.isArray(object.privateAttrs))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_Private_Attribute.privateAttrs: array expected");
                message.privateAttrs = $Array(object.privateAttrs.length);
                for (let i = 0; i < object.privateAttrs.length; ++i) {
                    if (!$util.isObject(object.privateAttrs[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Module_Private_Attribute.privateAttrs: object expected");
                    message.privateAttrs[i] = $root.AMR_MODEL_NSP.Message_Base_Group_Element.fromObject(object.privateAttrs[i], _depth + 1);
                }
            }
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            return message;
        };

        /**
         * Creates a plain object from a Message_Module_Private_Attribute message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Module_Private_Attribute
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Private_Attribute} message Message_Module_Private_Attribute
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Module_Private_Attribute.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.privateAttrs = [];
            if (options.defaults)
                object.boolDeprecated = false;
            if (message.privateAttrs && message.privateAttrs.length) {
                object.privateAttrs = $Array(message.privateAttrs.length);
                for (let j = 0; j < message.privateAttrs.length; ++j)
                    object.privateAttrs[j] = $root.AMR_MODEL_NSP.Message_Base_Group_Element.toObject(message.privateAttrs[j], options, _depth + 1);
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            return object;
        };

        /**
         * Converts this Message_Module_Private_Attribute to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Module_Private_Attribute
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Module_Private_Attribute.prototype.toJSON = function() {
            return Message_Module_Private_Attribute.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Module_Private_Attribute
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Module_Private_Attribute
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Module_Private_Attribute.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Module_Private_Attribute";
        };

        return Message_Module_Private_Attribute;
    })();

    AMR_MODEL_NSP.Message_Bus_Interface_Element = (function() {

        /**
         * Properties of a Message_Bus_Interface_Element.
         * @typedef {Object} AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties
         * @property {string|null} [busInterfaceType] Message_Bus_Interface_Element busInterfaceType
         * @property {string|null} [busInterfaceSubType] Message_Bus_Interface_Element busInterfaceSubType
         * @property {number|null} [busInterfaceNums] Message_Bus_Interface_Element busInterfaceNums
         * @property {boolean|null} [boolDeprecated] Message_Bus_Interface_Element boolDeprecated
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Bus_Interface_Element.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Bus_Interface_Element
         * @augments AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties instead.
         */

        /**
         * Shape of a Message_Bus_Interface_Element.
         * @typedef {AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties} AMR_MODEL_NSP.Message_Bus_Interface_Element.$Shape
         */

        /**
         * Constructs a new Message_Bus_Interface_Element.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Bus_Interface_Element.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Bus_Interface_Element = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Bus_Interface_Element busInterfaceType.
         * @member {string} busInterfaceType
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @instance
         */
        Message_Bus_Interface_Element.prototype.busInterfaceType = "";

        /**
         * Message_Bus_Interface_Element busInterfaceSubType.
         * @member {string} busInterfaceSubType
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @instance
         */
        Message_Bus_Interface_Element.prototype.busInterfaceSubType = "";

        /**
         * Message_Bus_Interface_Element busInterfaceNums.
         * @member {number} busInterfaceNums
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @instance
         */
        Message_Bus_Interface_Element.prototype.busInterfaceNums = 0;

        /**
         * Message_Bus_Interface_Element boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @instance
         */
        Message_Bus_Interface_Element.prototype.boolDeprecated = false;

        /**
         * Creates a new Message_Bus_Interface_Element instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @static
         * @param {AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Bus_Interface_Element} Message_Bus_Interface_Element instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Bus_Interface_Element.$Shape): AMR_MODEL_NSP.Message_Bus_Interface_Element & AMR_MODEL_NSP.Message_Bus_Interface_Element.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties): AMR_MODEL_NSP.Message_Bus_Interface_Element;
         * }}
         */
        Message_Bus_Interface_Element.create = function(properties) {
            return new Message_Bus_Interface_Element(properties);
        };

        /**
         * Encodes the specified Message_Bus_Interface_Element message. Does not implicitly {@link AMR_MODEL_NSP.Message_Bus_Interface_Element.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @static
         * @param {AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties} message Message_Bus_Interface_Element message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Bus_Interface_Element.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.busInterfaceType != null && $Object.hasOwnProperty.call(message, "busInterfaceType") && message.busInterfaceType !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.busInterfaceType);
            if (message.busInterfaceSubType != null && $Object.hasOwnProperty.call(message, "busInterfaceSubType") && message.busInterfaceSubType !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.busInterfaceSubType);
            if (message.busInterfaceNums != null && $Object.hasOwnProperty.call(message, "busInterfaceNums") && message.busInterfaceNums !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.busInterfaceNums);
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.boolDeprecated);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Bus_Interface_Element message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Bus_Interface_Element.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @static
         * @param {AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties} message Message_Bus_Interface_Element message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Bus_Interface_Element.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Bus_Interface_Element message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Bus_Interface_Element & AMR_MODEL_NSP.Message_Bus_Interface_Element.$Shape} Message_Bus_Interface_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Bus_Interface_Element.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Bus_Interface_Element(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.busInterfaceType = value;
                        else
                            delete message.busInterfaceType;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.busInterfaceSubType = value;
                        else
                            delete message.busInterfaceSubType;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.busInterfaceNums = value;
                        else
                            delete message.busInterfaceNums;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Bus_Interface_Element message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Bus_Interface_Element & AMR_MODEL_NSP.Message_Bus_Interface_Element.$Shape} Message_Bus_Interface_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Bus_Interface_Element.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Bus_Interface_Element message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Bus_Interface_Element.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.busInterfaceType != null && $Object.hasOwnProperty.call(message, "busInterfaceType"))
                if (!$util.isString(message.busInterfaceType))
                    return "busInterfaceType: string expected";
            if (message.busInterfaceSubType != null && $Object.hasOwnProperty.call(message, "busInterfaceSubType"))
                if (!$util.isString(message.busInterfaceSubType))
                    return "busInterfaceSubType: string expected";
            if (message.busInterfaceNums != null && $Object.hasOwnProperty.call(message, "busInterfaceNums"))
                if (!$util.isInteger(message.busInterfaceNums))
                    return "busInterfaceNums: integer expected";
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            return null;
        };

        /**
         * Creates a Message_Bus_Interface_Element message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Bus_Interface_Element} Message_Bus_Interface_Element
         */
        Message_Bus_Interface_Element.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Bus_Interface_Element)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Bus_Interface_Element: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Bus_Interface_Element();
            if (object.busInterfaceType != null)
                if (typeof object.busInterfaceType !== "string" || object.busInterfaceType.length)
                    message.busInterfaceType = $String(object.busInterfaceType);
            if (object.busInterfaceSubType != null)
                if (typeof object.busInterfaceSubType !== "string" || object.busInterfaceSubType.length)
                    message.busInterfaceSubType = $String(object.busInterfaceSubType);
            if (object.busInterfaceNums != null)
                if ($Number(object.busInterfaceNums) !== 0)
                    message.busInterfaceNums = object.busInterfaceNums | 0;
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            return message;
        };

        /**
         * Creates a plain object from a Message_Bus_Interface_Element message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @static
         * @param {AMR_MODEL_NSP.Message_Bus_Interface_Element} message Message_Bus_Interface_Element
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Bus_Interface_Element.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.busInterfaceType = "";
                object.busInterfaceSubType = "";
                object.busInterfaceNums = 0;
                object.boolDeprecated = false;
            }
            if (message.busInterfaceType != null && $Object.hasOwnProperty.call(message, "busInterfaceType"))
                object.busInterfaceType = message.busInterfaceType;
            if (message.busInterfaceSubType != null && $Object.hasOwnProperty.call(message, "busInterfaceSubType"))
                object.busInterfaceSubType = message.busInterfaceSubType;
            if (message.busInterfaceNums != null && $Object.hasOwnProperty.call(message, "busInterfaceNums"))
                object.busInterfaceNums = message.busInterfaceNums;
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            return object;
        };

        /**
         * Converts this Message_Bus_Interface_Element to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Bus_Interface_Element.prototype.toJSON = function() {
            return Message_Bus_Interface_Element.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Bus_Interface_Element
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Bus_Interface_Element
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Bus_Interface_Element.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Bus_Interface_Element";
        };

        return Message_Bus_Interface_Element;
    })();

    AMR_MODEL_NSP.Message_Interface_Ability = (function() {

        /**
         * Properties of a Message_Interface_Ability.
         * @typedef {Object} AMR_MODEL_NSP.Message_Interface_Ability.$Properties
         * @property {Array.<AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties>|null} [busInterfaceAbility] Message_Interface_Ability busInterfaceAbility
         * @property {boolean|null} [boolDeprecated] Message_Interface_Ability boolDeprecated
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Interface_Ability.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Interface_Ability
         * @augments AMR_MODEL_NSP.Message_Interface_Ability.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Interface_Ability.$Properties instead.
         */

        /**
         * Shape of a Message_Interface_Ability.
         * @typedef {AMR_MODEL_NSP.Message_Interface_Ability.$Properties} AMR_MODEL_NSP.Message_Interface_Ability.$Shape
         */

        /**
         * Constructs a new Message_Interface_Ability.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Interface_Ability.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Interface_Ability.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Interface_Ability = function (properties) {
            this.busInterfaceAbility = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Interface_Ability busInterfaceAbility.
         * @member {Array.<AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties>} busInterfaceAbility
         * @memberof AMR_MODEL_NSP.Message_Interface_Ability
         * @instance
         */
        Message_Interface_Ability.prototype.busInterfaceAbility = $util.emptyArray;

        /**
         * Message_Interface_Ability boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_Interface_Ability
         * @instance
         */
        Message_Interface_Ability.prototype.boolDeprecated = false;

        /**
         * Creates a new Message_Interface_Ability instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Interface_Ability
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Ability.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Interface_Ability} Message_Interface_Ability instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Interface_Ability.$Shape): AMR_MODEL_NSP.Message_Interface_Ability & AMR_MODEL_NSP.Message_Interface_Ability.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Interface_Ability.$Properties): AMR_MODEL_NSP.Message_Interface_Ability;
         * }}
         */
        Message_Interface_Ability.create = function(properties) {
            return new Message_Interface_Ability(properties);
        };

        /**
         * Encodes the specified Message_Interface_Ability message. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Ability.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Interface_Ability
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Ability.$Properties} message Message_Interface_Ability message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Interface_Ability.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.busInterfaceAbility != null && message.busInterfaceAbility.length)
                for (let i = 0; i < message.busInterfaceAbility.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Bus_Interface_Element.encode(message.busInterfaceAbility[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.boolDeprecated);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Interface_Ability message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Ability.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Interface_Ability
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Ability.$Properties} message Message_Interface_Ability message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Interface_Ability.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Interface_Ability message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Interface_Ability
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Interface_Ability & AMR_MODEL_NSP.Message_Interface_Ability.$Shape} Message_Interface_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Interface_Ability.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Interface_Ability(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (!(message.busInterfaceAbility && message.busInterfaceAbility.length))
                            message.busInterfaceAbility = [];
                        message.busInterfaceAbility.push($root.AMR_MODEL_NSP.Message_Bus_Interface_Element.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Interface_Ability message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Interface_Ability
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Interface_Ability & AMR_MODEL_NSP.Message_Interface_Ability.$Shape} Message_Interface_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Interface_Ability.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Interface_Ability message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Interface_Ability
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Interface_Ability.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.busInterfaceAbility != null && $Object.hasOwnProperty.call(message, "busInterfaceAbility")) {
                if (!$Array.isArray(message.busInterfaceAbility))
                    return "busInterfaceAbility: array expected";
                for (let i = 0; i < message.busInterfaceAbility.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Bus_Interface_Element.verify(message.busInterfaceAbility[i], _depth + 1);
                    if (error)
                        return "busInterfaceAbility." + error;
                }
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            return null;
        };

        /**
         * Creates a Message_Interface_Ability message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Interface_Ability
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Interface_Ability} Message_Interface_Ability
         */
        Message_Interface_Ability.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Interface_Ability)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Ability: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Interface_Ability();
            if (object.busInterfaceAbility) {
                if (!$Array.isArray(object.busInterfaceAbility))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Ability.busInterfaceAbility: array expected");
                message.busInterfaceAbility = $Array(object.busInterfaceAbility.length);
                for (let i = 0; i < object.busInterfaceAbility.length; ++i) {
                    if (!$util.isObject(object.busInterfaceAbility[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Ability.busInterfaceAbility: object expected");
                    message.busInterfaceAbility[i] = $root.AMR_MODEL_NSP.Message_Bus_Interface_Element.fromObject(object.busInterfaceAbility[i], _depth + 1);
                }
            }
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            return message;
        };

        /**
         * Creates a plain object from a Message_Interface_Ability message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Interface_Ability
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Ability} message Message_Interface_Ability
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Interface_Ability.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.busInterfaceAbility = [];
            if (options.defaults)
                object.boolDeprecated = false;
            if (message.busInterfaceAbility && message.busInterfaceAbility.length) {
                object.busInterfaceAbility = $Array(message.busInterfaceAbility.length);
                for (let j = 0; j < message.busInterfaceAbility.length; ++j)
                    object.busInterfaceAbility[j] = $root.AMR_MODEL_NSP.Message_Bus_Interface_Element.toObject(message.busInterfaceAbility[j], options, _depth + 1);
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            return object;
        };

        /**
         * Converts this Message_Interface_Ability to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Interface_Ability
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Interface_Ability.prototype.toJSON = function() {
            return Message_Interface_Ability.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Interface_Ability
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Interface_Ability
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Interface_Ability.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Interface_Ability";
        };

        return Message_Interface_Ability;
    })();

    AMR_MODEL_NSP.Message_Interface_Attribute = (function() {

        /**
         * Properties of a Message_Interface_Attribute.
         * @typedef {Object} AMR_MODEL_NSP.Message_Interface_Attribute.$Properties
         * @property {Array.<AMR_MODEL_NSP.Message_Base_Element.$Properties>|null} [interfaceParamsArray] Message_Interface_Attribute interfaceParamsArray
         * @property {boolean|null} [boolDeprecated] Message_Interface_Attribute boolDeprecated
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Interface_Attribute.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Interface_Attribute
         * @augments AMR_MODEL_NSP.Message_Interface_Attribute.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Interface_Attribute.$Properties instead.
         */

        /**
         * Shape of a Message_Interface_Attribute.
         * @typedef {AMR_MODEL_NSP.Message_Interface_Attribute.$Properties} AMR_MODEL_NSP.Message_Interface_Attribute.$Shape
         */

        /**
         * Constructs a new Message_Interface_Attribute.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Interface_Attribute.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Interface_Attribute.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Interface_Attribute = function (properties) {
            this.interfaceParamsArray = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Interface_Attribute interfaceParamsArray.
         * @member {Array.<AMR_MODEL_NSP.Message_Base_Element.$Properties>} interfaceParamsArray
         * @memberof AMR_MODEL_NSP.Message_Interface_Attribute
         * @instance
         */
        Message_Interface_Attribute.prototype.interfaceParamsArray = $util.emptyArray;

        /**
         * Message_Interface_Attribute boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_Interface_Attribute
         * @instance
         */
        Message_Interface_Attribute.prototype.boolDeprecated = false;

        /**
         * Creates a new Message_Interface_Attribute instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Interface_Attribute
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Attribute.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Interface_Attribute} Message_Interface_Attribute instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Interface_Attribute.$Shape): AMR_MODEL_NSP.Message_Interface_Attribute & AMR_MODEL_NSP.Message_Interface_Attribute.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Interface_Attribute.$Properties): AMR_MODEL_NSP.Message_Interface_Attribute;
         * }}
         */
        Message_Interface_Attribute.create = function(properties) {
            return new Message_Interface_Attribute(properties);
        };

        /**
         * Encodes the specified Message_Interface_Attribute message. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Attribute.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Interface_Attribute
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Attribute.$Properties} message Message_Interface_Attribute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Interface_Attribute.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.interfaceParamsArray != null && message.interfaceParamsArray.length)
                for (let i = 0; i < message.interfaceParamsArray.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Base_Element.encode(message.interfaceParamsArray[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.boolDeprecated);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Interface_Attribute message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Attribute.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Interface_Attribute
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Attribute.$Properties} message Message_Interface_Attribute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Interface_Attribute.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Interface_Attribute message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Interface_Attribute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Interface_Attribute & AMR_MODEL_NSP.Message_Interface_Attribute.$Shape} Message_Interface_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Interface_Attribute.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Interface_Attribute(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (!(message.interfaceParamsArray && message.interfaceParamsArray.length))
                            message.interfaceParamsArray = [];
                        message.interfaceParamsArray.push($root.AMR_MODEL_NSP.Message_Base_Element.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Interface_Attribute message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Interface_Attribute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Interface_Attribute & AMR_MODEL_NSP.Message_Interface_Attribute.$Shape} Message_Interface_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Interface_Attribute.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Interface_Attribute message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Interface_Attribute
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Interface_Attribute.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.interfaceParamsArray != null && $Object.hasOwnProperty.call(message, "interfaceParamsArray")) {
                if (!$Array.isArray(message.interfaceParamsArray))
                    return "interfaceParamsArray: array expected";
                for (let i = 0; i < message.interfaceParamsArray.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Base_Element.verify(message.interfaceParamsArray[i], _depth + 1);
                    if (error)
                        return "interfaceParamsArray." + error;
                }
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            return null;
        };

        /**
         * Creates a Message_Interface_Attribute message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Interface_Attribute
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Interface_Attribute} Message_Interface_Attribute
         */
        Message_Interface_Attribute.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Interface_Attribute)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Attribute: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Interface_Attribute();
            if (object.interfaceParamsArray) {
                if (!$Array.isArray(object.interfaceParamsArray))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Attribute.interfaceParamsArray: array expected");
                message.interfaceParamsArray = $Array(object.interfaceParamsArray.length);
                for (let i = 0; i < object.interfaceParamsArray.length; ++i) {
                    if (!$util.isObject(object.interfaceParamsArray[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Attribute.interfaceParamsArray: object expected");
                    message.interfaceParamsArray[i] = $root.AMR_MODEL_NSP.Message_Base_Element.fromObject(object.interfaceParamsArray[i], _depth + 1);
                }
            }
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            return message;
        };

        /**
         * Creates a plain object from a Message_Interface_Attribute message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Interface_Attribute
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Attribute} message Message_Interface_Attribute
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Interface_Attribute.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.interfaceParamsArray = [];
            if (options.defaults)
                object.boolDeprecated = false;
            if (message.interfaceParamsArray && message.interfaceParamsArray.length) {
                object.interfaceParamsArray = $Array(message.interfaceParamsArray.length);
                for (let j = 0; j < message.interfaceParamsArray.length; ++j)
                    object.interfaceParamsArray[j] = $root.AMR_MODEL_NSP.Message_Base_Element.toObject(message.interfaceParamsArray[j], options, _depth + 1);
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            return object;
        };

        /**
         * Converts this Message_Interface_Attribute to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Interface_Attribute
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Interface_Attribute.prototype.toJSON = function() {
            return Message_Interface_Attribute.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Interface_Attribute
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Interface_Attribute
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Interface_Attribute.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Interface_Attribute";
        };

        return Message_Interface_Attribute;
    })();

    AMR_MODEL_NSP.Message_Interface_Param_Group = (function() {

        /**
         * Properties of a Message_Interface_Param_Group.
         * @typedef {Object} AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties
         * @property {string|null} [key] Message_Interface_Param_Group key
         * @property {string|null} [type] Message_Interface_Param_Group type
         * @property {string|null} [path] Message_Interface_Param_Group path
         * @property {string|null} [desc] Message_Interface_Param_Group desc
         * @property {string|null} [interfaceUuid] Message_Interface_Param_Group interfaceUuid
         * @property {Array.<string>|null} [linkedInterfaceUuid] Message_Interface_Param_Group linkedInterfaceUuid
         * @property {Array.<AMR_MODEL_NSP.Message_Combox_Item.$Properties>|null} [linkAttrs] Message_Interface_Param_Group linkAttrs
         * @property {AMR_MODEL_NSP.Message_Interface_Attribute.$Properties|null} [interfaceAttrs] Message_Interface_Param_Group interfaceAttrs
         * @property {AMR_MODEL_NSP.Message_Interface_Attribute.$Properties|null} [interfaceParams] Message_Interface_Param_Group interfaceParams
         * @property {boolean|null} [boolDeprecated] Message_Interface_Param_Group boolDeprecated
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Interface_Param_Group.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Interface_Param_Group
         * @augments AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties instead.
         */

        /**
         * Shape of a Message_Interface_Param_Group.
         * @typedef {AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties} AMR_MODEL_NSP.Message_Interface_Param_Group.$Shape
         */

        /**
         * Constructs a new Message_Interface_Param_Group.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Interface_Param_Group.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Interface_Param_Group = function (properties) {
            this.linkedInterfaceUuid = [];
            this.linkAttrs = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Interface_Param_Group key.
         * @member {string} key
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @instance
         */
        Message_Interface_Param_Group.prototype.key = "";

        /**
         * Message_Interface_Param_Group type.
         * @member {string} type
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @instance
         */
        Message_Interface_Param_Group.prototype.type = "";

        /**
         * Message_Interface_Param_Group path.
         * @member {string} path
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @instance
         */
        Message_Interface_Param_Group.prototype.path = "";

        /**
         * Message_Interface_Param_Group desc.
         * @member {string} desc
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @instance
         */
        Message_Interface_Param_Group.prototype.desc = "";

        /**
         * Message_Interface_Param_Group interfaceUuid.
         * @member {string} interfaceUuid
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @instance
         */
        Message_Interface_Param_Group.prototype.interfaceUuid = "";

        /**
         * Message_Interface_Param_Group linkedInterfaceUuid.
         * @member {Array.<string>} linkedInterfaceUuid
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @instance
         */
        Message_Interface_Param_Group.prototype.linkedInterfaceUuid = $util.emptyArray;

        /**
         * Message_Interface_Param_Group linkAttrs.
         * @member {Array.<AMR_MODEL_NSP.Message_Combox_Item.$Properties>} linkAttrs
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @instance
         */
        Message_Interface_Param_Group.prototype.linkAttrs = $util.emptyArray;

        /**
         * Message_Interface_Param_Group interfaceAttrs.
         * @member {AMR_MODEL_NSP.Message_Interface_Attribute.$Properties|null|undefined} interfaceAttrs
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @instance
         */
        Message_Interface_Param_Group.prototype.interfaceAttrs = null;

        /**
         * Message_Interface_Param_Group interfaceParams.
         * @member {AMR_MODEL_NSP.Message_Interface_Attribute.$Properties|null|undefined} interfaceParams
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @instance
         */
        Message_Interface_Param_Group.prototype.interfaceParams = null;

        /**
         * Message_Interface_Param_Group boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @instance
         */
        Message_Interface_Param_Group.prototype.boolDeprecated = false;

        /**
         * Creates a new Message_Interface_Param_Group instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Interface_Param_Group} Message_Interface_Param_Group instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Interface_Param_Group.$Shape): AMR_MODEL_NSP.Message_Interface_Param_Group & AMR_MODEL_NSP.Message_Interface_Param_Group.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties): AMR_MODEL_NSP.Message_Interface_Param_Group;
         * }}
         */
        Message_Interface_Param_Group.create = function(properties) {
            return new Message_Interface_Param_Group(properties);
        };

        /**
         * Encodes the specified Message_Interface_Param_Group message. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Param_Group.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties} message Message_Interface_Param_Group message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Interface_Param_Group.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.type != null && $Object.hasOwnProperty.call(message, "type") && message.type !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
            if (message.path != null && $Object.hasOwnProperty.call(message, "path") && message.path !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.path);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.desc);
            if (message.interfaceUuid != null && $Object.hasOwnProperty.call(message, "interfaceUuid") && message.interfaceUuid !== "")
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.interfaceUuid);
            if (message.linkedInterfaceUuid != null && message.linkedInterfaceUuid.length)
                for (let i = 0; i < message.linkedInterfaceUuid.length; ++i)
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.linkedInterfaceUuid[i]);
            if (message.linkAttrs != null && message.linkAttrs.length)
                for (let i = 0; i < message.linkAttrs.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Combox_Item.encode(message.linkAttrs[i], writer.uint32(/* id 7, wireType 2 =*/58).fork(), _depth + 1).ldelim();
            if (message.interfaceAttrs != null && $Object.hasOwnProperty.call(message, "interfaceAttrs"))
                $root.AMR_MODEL_NSP.Message_Interface_Attribute.encode(message.interfaceAttrs, writer.uint32(/* id 8, wireType 2 =*/66).fork(), _depth + 1).ldelim();
            if (message.interfaceParams != null && $Object.hasOwnProperty.call(message, "interfaceParams"))
                $root.AMR_MODEL_NSP.Message_Interface_Attribute.encode(message.interfaceParams, writer.uint32(/* id 9, wireType 2 =*/74).fork(), _depth + 1).ldelim();
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 10, wireType 0 =*/80).bool(message.boolDeprecated);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Interface_Param_Group message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Param_Group.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties} message Message_Interface_Param_Group message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Interface_Param_Group.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Interface_Param_Group message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Interface_Param_Group & AMR_MODEL_NSP.Message_Interface_Param_Group.$Shape} Message_Interface_Param_Group
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Interface_Param_Group.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Interface_Param_Group(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.type = value;
                        else
                            delete message.type;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.path = value;
                        else
                            delete message.path;
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.interfaceUuid = value;
                        else
                            delete message.interfaceUuid;
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        if (!(message.linkedInterfaceUuid && message.linkedInterfaceUuid.length))
                            message.linkedInterfaceUuid = [];
                        message.linkedInterfaceUuid.push(reader.stringVerify());
                        continue;
                    }
                case 7: {
                        if (wireType !== 2)
                            break;
                        if (!(message.linkAttrs && message.linkAttrs.length))
                            message.linkAttrs = [];
                        message.linkAttrs.push($root.AMR_MODEL_NSP.Message_Combox_Item.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 8: {
                        if (wireType !== 2)
                            break;
                        message.interfaceAttrs = $root.AMR_MODEL_NSP.Message_Interface_Attribute.decode(reader, reader.uint32(), $undefined, _depth + 1, message.interfaceAttrs);
                        continue;
                    }
                case 9: {
                        if (wireType !== 2)
                            break;
                        message.interfaceParams = $root.AMR_MODEL_NSP.Message_Interface_Attribute.decode(reader, reader.uint32(), $undefined, _depth + 1, message.interfaceParams);
                        continue;
                    }
                case 10: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Interface_Param_Group message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Interface_Param_Group & AMR_MODEL_NSP.Message_Interface_Param_Group.$Shape} Message_Interface_Param_Group
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Interface_Param_Group.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Interface_Param_Group message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Interface_Param_Group.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.path != null && $Object.hasOwnProperty.call(message, "path"))
                if (!$util.isString(message.path))
                    return "path: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.interfaceUuid != null && $Object.hasOwnProperty.call(message, "interfaceUuid"))
                if (!$util.isString(message.interfaceUuid))
                    return "interfaceUuid: string expected";
            if (message.linkedInterfaceUuid != null && $Object.hasOwnProperty.call(message, "linkedInterfaceUuid")) {
                if (!$Array.isArray(message.linkedInterfaceUuid))
                    return "linkedInterfaceUuid: array expected";
                for (let i = 0; i < message.linkedInterfaceUuid.length; ++i)
                    if (!$util.isString(message.linkedInterfaceUuid[i]))
                        return "linkedInterfaceUuid: string[] expected";
            }
            if (message.linkAttrs != null && $Object.hasOwnProperty.call(message, "linkAttrs")) {
                if (!$Array.isArray(message.linkAttrs))
                    return "linkAttrs: array expected";
                for (let i = 0; i < message.linkAttrs.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Combox_Item.verify(message.linkAttrs[i], _depth + 1);
                    if (error)
                        return "linkAttrs." + error;
                }
            }
            if (message.interfaceAttrs != null && $Object.hasOwnProperty.call(message, "interfaceAttrs")) {
                let error = $root.AMR_MODEL_NSP.Message_Interface_Attribute.verify(message.interfaceAttrs, _depth + 1);
                if (error)
                    return "interfaceAttrs." + error;
            }
            if (message.interfaceParams != null && $Object.hasOwnProperty.call(message, "interfaceParams")) {
                let error = $root.AMR_MODEL_NSP.Message_Interface_Attribute.verify(message.interfaceParams, _depth + 1);
                if (error)
                    return "interfaceParams." + error;
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            return null;
        };

        /**
         * Creates a Message_Interface_Param_Group message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Interface_Param_Group} Message_Interface_Param_Group
         */
        Message_Interface_Param_Group.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Interface_Param_Group)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Param_Group: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Interface_Param_Group();
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.type != null)
                if (typeof object.type !== "string" || object.type.length)
                    message.type = $String(object.type);
            if (object.path != null)
                if (typeof object.path !== "string" || object.path.length)
                    message.path = $String(object.path);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.interfaceUuid != null)
                if (typeof object.interfaceUuid !== "string" || object.interfaceUuid.length)
                    message.interfaceUuid = $String(object.interfaceUuid);
            if (object.linkedInterfaceUuid) {
                if (!$Array.isArray(object.linkedInterfaceUuid))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Param_Group.linkedInterfaceUuid: array expected");
                message.linkedInterfaceUuid = $Array(object.linkedInterfaceUuid.length);
                for (let i = 0; i < object.linkedInterfaceUuid.length; ++i)
                    message.linkedInterfaceUuid[i] = $String(object.linkedInterfaceUuid[i]);
            }
            if (object.linkAttrs) {
                if (!$Array.isArray(object.linkAttrs))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Param_Group.linkAttrs: array expected");
                message.linkAttrs = $Array(object.linkAttrs.length);
                for (let i = 0; i < object.linkAttrs.length; ++i) {
                    if (!$util.isObject(object.linkAttrs[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Param_Group.linkAttrs: object expected");
                    message.linkAttrs[i] = $root.AMR_MODEL_NSP.Message_Combox_Item.fromObject(object.linkAttrs[i], _depth + 1);
                }
            }
            if (object.interfaceAttrs != null) {
                if (!$util.isObject(object.interfaceAttrs))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Param_Group.interfaceAttrs: object expected");
                message.interfaceAttrs = $root.AMR_MODEL_NSP.Message_Interface_Attribute.fromObject(object.interfaceAttrs, _depth + 1);
            }
            if (object.interfaceParams != null) {
                if (!$util.isObject(object.interfaceParams))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Param_Group.interfaceParams: object expected");
                message.interfaceParams = $root.AMR_MODEL_NSP.Message_Interface_Attribute.fromObject(object.interfaceParams, _depth + 1);
            }
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            return message;
        };

        /**
         * Creates a plain object from a Message_Interface_Param_Group message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Param_Group} message Message_Interface_Param_Group
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Interface_Param_Group.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults) {
                object.linkedInterfaceUuid = [];
                object.linkAttrs = [];
            }
            if (options.defaults) {
                object.key = "";
                object.type = "";
                object.path = "";
                object.desc = "";
                object.interfaceUuid = "";
                object.interfaceAttrs = null;
                object.interfaceParams = null;
                object.boolDeprecated = false;
            }
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                object.type = message.type;
            if (message.path != null && $Object.hasOwnProperty.call(message, "path"))
                object.path = message.path;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.interfaceUuid != null && $Object.hasOwnProperty.call(message, "interfaceUuid"))
                object.interfaceUuid = message.interfaceUuid;
            if (message.linkedInterfaceUuid && message.linkedInterfaceUuid.length) {
                object.linkedInterfaceUuid = $Array(message.linkedInterfaceUuid.length);
                for (let j = 0; j < message.linkedInterfaceUuid.length; ++j)
                    object.linkedInterfaceUuid[j] = message.linkedInterfaceUuid[j];
            }
            if (message.linkAttrs && message.linkAttrs.length) {
                object.linkAttrs = $Array(message.linkAttrs.length);
                for (let j = 0; j < message.linkAttrs.length; ++j)
                    object.linkAttrs[j] = $root.AMR_MODEL_NSP.Message_Combox_Item.toObject(message.linkAttrs[j], options, _depth + 1);
            }
            if (message.interfaceAttrs != null && $Object.hasOwnProperty.call(message, "interfaceAttrs"))
                object.interfaceAttrs = $root.AMR_MODEL_NSP.Message_Interface_Attribute.toObject(message.interfaceAttrs, options, _depth + 1);
            if (message.interfaceParams != null && $Object.hasOwnProperty.call(message, "interfaceParams"))
                object.interfaceParams = $root.AMR_MODEL_NSP.Message_Interface_Attribute.toObject(message.interfaceParams, options, _depth + 1);
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            return object;
        };

        /**
         * Converts this Message_Interface_Param_Group to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Interface_Param_Group.prototype.toJSON = function() {
            return Message_Interface_Param_Group.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Interface_Param_Group
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Interface_Param_Group
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Interface_Param_Group.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Interface_Param_Group";
        };

        return Message_Interface_Param_Group;
    })();

    AMR_MODEL_NSP.Message_Interface_Param = (function() {

        /**
         * Properties of a Message_Interface_Param.
         * @typedef {Object} AMR_MODEL_NSP.Message_Interface_Param.$Properties
         * @property {Array.<AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties>|null} [interface_Group] Message_Interface_Param interface_Group
         * @property {number|null} [nodePosX] Message_Interface_Param nodePosX
         * @property {number|null} [nodePosY] Message_Interface_Param nodePosY
         * @property {boolean|null} [boolDeprecated] Message_Interface_Param boolDeprecated
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Interface_Param.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Interface_Param
         * @augments AMR_MODEL_NSP.Message_Interface_Param.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Interface_Param.$Properties instead.
         */

        /**
         * Shape of a Message_Interface_Param.
         * @typedef {AMR_MODEL_NSP.Message_Interface_Param.$Properties} AMR_MODEL_NSP.Message_Interface_Param.$Shape
         */

        /**
         * Constructs a new Message_Interface_Param.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Interface_Param.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Interface_Param.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Interface_Param = function (properties) {
            this.interface_Group = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Interface_Param interface_Group.
         * @member {Array.<AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties>} interface_Group
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @instance
         */
        Message_Interface_Param.prototype.interface_Group = $util.emptyArray;

        /**
         * Message_Interface_Param nodePosX.
         * @member {number} nodePosX
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @instance
         */
        Message_Interface_Param.prototype.nodePosX = 0;

        /**
         * Message_Interface_Param nodePosY.
         * @member {number} nodePosY
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @instance
         */
        Message_Interface_Param.prototype.nodePosY = 0;

        /**
         * Message_Interface_Param boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @instance
         */
        Message_Interface_Param.prototype.boolDeprecated = false;

        /**
         * Creates a new Message_Interface_Param instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Param.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Interface_Param} Message_Interface_Param instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Interface_Param.$Shape): AMR_MODEL_NSP.Message_Interface_Param & AMR_MODEL_NSP.Message_Interface_Param.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Interface_Param.$Properties): AMR_MODEL_NSP.Message_Interface_Param;
         * }}
         */
        Message_Interface_Param.create = function(properties) {
            return new Message_Interface_Param(properties);
        };

        /**
         * Encodes the specified Message_Interface_Param message. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Param.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Param.$Properties} message Message_Interface_Param message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Interface_Param.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.interface_Group != null && message.interface_Group.length)
                for (let i = 0; i < message.interface_Group.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Interface_Param_Group.encode(message.interface_Group[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.nodePosX != null && $Object.hasOwnProperty.call(message, "nodePosX") && !$Object.is(message.nodePosX, 0))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.nodePosX);
            if (message.nodePosY != null && $Object.hasOwnProperty.call(message, "nodePosY") && !$Object.is(message.nodePosY, 0))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.nodePosY);
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.boolDeprecated);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Interface_Param message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Param.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Param.$Properties} message Message_Interface_Param message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Interface_Param.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Interface_Param message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Interface_Param & AMR_MODEL_NSP.Message_Interface_Param.$Shape} Message_Interface_Param
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Interface_Param.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Interface_Param(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (!(message.interface_Group && message.interface_Group.length))
                            message.interface_Group = [];
                        message.interface_Group.push($root.AMR_MODEL_NSP.Message_Interface_Param_Group.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 2: {
                        if (wireType !== 5)
                            break;
                        if (!$Object.is(value = reader.float(), 0))
                            message.nodePosX = value;
                        else
                            delete message.nodePosX;
                        continue;
                    }
                case 3: {
                        if (wireType !== 5)
                            break;
                        if (!$Object.is(value = reader.float(), 0))
                            message.nodePosY = value;
                        else
                            delete message.nodePosY;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Interface_Param message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Interface_Param & AMR_MODEL_NSP.Message_Interface_Param.$Shape} Message_Interface_Param
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Interface_Param.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Interface_Param message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Interface_Param.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.interface_Group != null && $Object.hasOwnProperty.call(message, "interface_Group")) {
                if (!$Array.isArray(message.interface_Group))
                    return "interface_Group: array expected";
                for (let i = 0; i < message.interface_Group.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Interface_Param_Group.verify(message.interface_Group[i], _depth + 1);
                    if (error)
                        return "interface_Group." + error;
                }
            }
            if (message.nodePosX != null && $Object.hasOwnProperty.call(message, "nodePosX"))
                if (typeof message.nodePosX !== "number")
                    return "nodePosX: number expected";
            if (message.nodePosY != null && $Object.hasOwnProperty.call(message, "nodePosY"))
                if (typeof message.nodePosY !== "number")
                    return "nodePosY: number expected";
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            return null;
        };

        /**
         * Creates a Message_Interface_Param message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Interface_Param} Message_Interface_Param
         */
        Message_Interface_Param.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Interface_Param)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Param: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Interface_Param();
            if (object.interface_Group) {
                if (!$Array.isArray(object.interface_Group))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Param.interface_Group: array expected");
                message.interface_Group = $Array(object.interface_Group.length);
                for (let i = 0; i < object.interface_Group.length; ++i) {
                    if (!$util.isObject(object.interface_Group[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Interface_Param.interface_Group: object expected");
                    message.interface_Group[i] = $root.AMR_MODEL_NSP.Message_Interface_Param_Group.fromObject(object.interface_Group[i], _depth + 1);
                }
            }
            if (object.nodePosX != null)
                if (!$Object.is($Number(object.nodePosX), 0))
                    message.nodePosX = $Number(object.nodePosX);
            if (object.nodePosY != null)
                if (!$Object.is($Number(object.nodePosY), 0))
                    message.nodePosY = $Number(object.nodePosY);
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            return message;
        };

        /**
         * Creates a plain object from a Message_Interface_Param message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @static
         * @param {AMR_MODEL_NSP.Message_Interface_Param} message Message_Interface_Param
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Interface_Param.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.interface_Group = [];
            if (options.defaults) {
                object.nodePosX = 0;
                object.nodePosY = 0;
                object.boolDeprecated = false;
            }
            if (message.interface_Group && message.interface_Group.length) {
                object.interface_Group = $Array(message.interface_Group.length);
                for (let j = 0; j < message.interface_Group.length; ++j)
                    object.interface_Group[j] = $root.AMR_MODEL_NSP.Message_Interface_Param_Group.toObject(message.interface_Group[j], options, _depth + 1);
            }
            if (message.nodePosX != null && $Object.hasOwnProperty.call(message, "nodePosX"))
                object.nodePosX = options.json && !$isFinite(message.nodePosX) ? $String(message.nodePosX) : message.nodePosX;
            if (message.nodePosY != null && $Object.hasOwnProperty.call(message, "nodePosY"))
                object.nodePosY = options.json && !$isFinite(message.nodePosY) ? $String(message.nodePosY) : message.nodePosY;
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            return object;
        };

        /**
         * Converts this Message_Interface_Param to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Interface_Param.prototype.toJSON = function() {
            return Message_Interface_Param.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Interface_Param
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Interface_Param
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Interface_Param.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Interface_Param";
        };

        return Message_Interface_Param;
    })();

    AMR_MODEL_NSP.Message_Module_Componets = (function() {

        /**
         * Properties of a Message_Module_Componets.
         * @typedef {Object} AMR_MODEL_NSP.Message_Module_Componets.$Properties
         * @property {AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties|null} [generalAttr] Message_Module_Componets generalAttr
         * @property {AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties|null} [privateAttr] Message_Module_Componets privateAttr
         * @property {AMR_MODEL_NSP.Message_Interface_Ability.$Properties|null} [interfaceAbility] Message_Module_Componets interfaceAbility
         * @property {AMR_MODEL_NSP.Message_Interface_Param.$Properties|null} [interfaceParams] Message_Module_Componets interfaceParams
         * @property {AMR_MODEL_NSP.Message_Struct_Param.$Properties|null} [structParam] Message_Module_Componets structParam
         * @property {boolean|null} [boolDeprecated] Message_Module_Componets boolDeprecated
         * @property {boolean|null} [boolDisable] Message_Module_Componets boolDisable
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Module_Componets.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Module_Componets
         * @augments AMR_MODEL_NSP.Message_Module_Componets.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Module_Componets.$Properties instead.
         */

        /**
         * Shape of a Message_Module_Componets.
         * @typedef {AMR_MODEL_NSP.Message_Module_Componets.$Properties} AMR_MODEL_NSP.Message_Module_Componets.$Shape
         */

        /**
         * Constructs a new Message_Module_Componets.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Module_Componets.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Module_Componets.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Module_Componets = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Module_Componets generalAttr.
         * @member {AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties|null|undefined} generalAttr
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @instance
         */
        Message_Module_Componets.prototype.generalAttr = null;

        /**
         * Message_Module_Componets privateAttr.
         * @member {AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties|null|undefined} privateAttr
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @instance
         */
        Message_Module_Componets.prototype.privateAttr = null;

        /**
         * Message_Module_Componets interfaceAbility.
         * @member {AMR_MODEL_NSP.Message_Interface_Ability.$Properties|null|undefined} interfaceAbility
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @instance
         */
        Message_Module_Componets.prototype.interfaceAbility = null;

        /**
         * Message_Module_Componets interfaceParams.
         * @member {AMR_MODEL_NSP.Message_Interface_Param.$Properties|null|undefined} interfaceParams
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @instance
         */
        Message_Module_Componets.prototype.interfaceParams = null;

        /**
         * Message_Module_Componets structParam.
         * @member {AMR_MODEL_NSP.Message_Struct_Param.$Properties|null|undefined} structParam
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @instance
         */
        Message_Module_Componets.prototype.structParam = null;

        /**
         * Message_Module_Componets boolDeprecated.
         * @member {boolean} boolDeprecated
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @instance
         */
        Message_Module_Componets.prototype.boolDeprecated = false;

        /**
         * Message_Module_Componets boolDisable.
         * @member {boolean} boolDisable
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @instance
         */
        Message_Module_Componets.prototype.boolDisable = false;

        /**
         * Creates a new Message_Module_Componets instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Componets.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Module_Componets} Message_Module_Componets instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Module_Componets.$Shape): AMR_MODEL_NSP.Message_Module_Componets & AMR_MODEL_NSP.Message_Module_Componets.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Module_Componets.$Properties): AMR_MODEL_NSP.Message_Module_Componets;
         * }}
         */
        Message_Module_Componets.create = function(properties) {
            return new Message_Module_Componets(properties);
        };

        /**
         * Encodes the specified Message_Module_Componets message. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Componets.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Componets.$Properties} message Message_Module_Componets message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Module_Componets.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.generalAttr != null && $Object.hasOwnProperty.call(message, "generalAttr"))
                $root.AMR_MODEL_NSP.Message_Module_General_Attribute.encode(message.generalAttr, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.privateAttr != null && $Object.hasOwnProperty.call(message, "privateAttr"))
                $root.AMR_MODEL_NSP.Message_Module_Private_Attribute.encode(message.privateAttr, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.interfaceAbility != null && $Object.hasOwnProperty.call(message, "interfaceAbility"))
                $root.AMR_MODEL_NSP.Message_Interface_Ability.encode(message.interfaceAbility, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.interfaceParams != null && $Object.hasOwnProperty.call(message, "interfaceParams"))
                $root.AMR_MODEL_NSP.Message_Interface_Param.encode(message.interfaceParams, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.structParam != null && $Object.hasOwnProperty.call(message, "structParam"))
                $root.AMR_MODEL_NSP.Message_Struct_Param.encode(message.structParam, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated") && message.boolDeprecated !== false)
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.boolDeprecated);
            if (message.boolDisable != null && $Object.hasOwnProperty.call(message, "boolDisable") && message.boolDisable !== false)
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.boolDisable);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Module_Componets message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Componets.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Componets.$Properties} message Message_Module_Componets message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Module_Componets.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Module_Componets message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Module_Componets & AMR_MODEL_NSP.Message_Module_Componets.$Shape} Message_Module_Componets
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Module_Componets.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Module_Componets(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.generalAttr = $root.AMR_MODEL_NSP.Message_Module_General_Attribute.decode(reader, reader.uint32(), $undefined, _depth + 1, message.generalAttr);
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.privateAttr = $root.AMR_MODEL_NSP.Message_Module_Private_Attribute.decode(reader, reader.uint32(), $undefined, _depth + 1, message.privateAttr);
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.interfaceAbility = $root.AMR_MODEL_NSP.Message_Interface_Ability.decode(reader, reader.uint32(), $undefined, _depth + 1, message.interfaceAbility);
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.interfaceParams = $root.AMR_MODEL_NSP.Message_Interface_Param.decode(reader, reader.uint32(), $undefined, _depth + 1, message.interfaceParams);
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        message.structParam = $root.AMR_MODEL_NSP.Message_Struct_Param.decode(reader, reader.uint32(), $undefined, _depth + 1, message.structParam);
                        continue;
                    }
                case 6: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDeprecated = value;
                        else
                            delete message.boolDeprecated;
                        continue;
                    }
                case 7: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolDisable = value;
                        else
                            delete message.boolDisable;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Module_Componets message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Module_Componets & AMR_MODEL_NSP.Message_Module_Componets.$Shape} Message_Module_Componets
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Module_Componets.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Module_Componets message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Module_Componets.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.generalAttr != null && $Object.hasOwnProperty.call(message, "generalAttr")) {
                let error = $root.AMR_MODEL_NSP.Message_Module_General_Attribute.verify(message.generalAttr, _depth + 1);
                if (error)
                    return "generalAttr." + error;
            }
            if (message.privateAttr != null && $Object.hasOwnProperty.call(message, "privateAttr")) {
                let error = $root.AMR_MODEL_NSP.Message_Module_Private_Attribute.verify(message.privateAttr, _depth + 1);
                if (error)
                    return "privateAttr." + error;
            }
            if (message.interfaceAbility != null && $Object.hasOwnProperty.call(message, "interfaceAbility")) {
                let error = $root.AMR_MODEL_NSP.Message_Interface_Ability.verify(message.interfaceAbility, _depth + 1);
                if (error)
                    return "interfaceAbility." + error;
            }
            if (message.interfaceParams != null && $Object.hasOwnProperty.call(message, "interfaceParams")) {
                let error = $root.AMR_MODEL_NSP.Message_Interface_Param.verify(message.interfaceParams, _depth + 1);
                if (error)
                    return "interfaceParams." + error;
            }
            if (message.structParam != null && $Object.hasOwnProperty.call(message, "structParam")) {
                let error = $root.AMR_MODEL_NSP.Message_Struct_Param.verify(message.structParam, _depth + 1);
                if (error)
                    return "structParam." + error;
            }
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                if (typeof message.boolDeprecated !== "boolean")
                    return "boolDeprecated: boolean expected";
            if (message.boolDisable != null && $Object.hasOwnProperty.call(message, "boolDisable"))
                if (typeof message.boolDisable !== "boolean")
                    return "boolDisable: boolean expected";
            return null;
        };

        /**
         * Creates a Message_Module_Componets message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Module_Componets} Message_Module_Componets
         */
        Message_Module_Componets.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Module_Componets)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Module_Componets: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Module_Componets();
            if (object.generalAttr != null) {
                if (!$util.isObject(object.generalAttr))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_Componets.generalAttr: object expected");
                message.generalAttr = $root.AMR_MODEL_NSP.Message_Module_General_Attribute.fromObject(object.generalAttr, _depth + 1);
            }
            if (object.privateAttr != null) {
                if (!$util.isObject(object.privateAttr))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_Componets.privateAttr: object expected");
                message.privateAttr = $root.AMR_MODEL_NSP.Message_Module_Private_Attribute.fromObject(object.privateAttr, _depth + 1);
            }
            if (object.interfaceAbility != null) {
                if (!$util.isObject(object.interfaceAbility))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_Componets.interfaceAbility: object expected");
                message.interfaceAbility = $root.AMR_MODEL_NSP.Message_Interface_Ability.fromObject(object.interfaceAbility, _depth + 1);
            }
            if (object.interfaceParams != null) {
                if (!$util.isObject(object.interfaceParams))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_Componets.interfaceParams: object expected");
                message.interfaceParams = $root.AMR_MODEL_NSP.Message_Interface_Param.fromObject(object.interfaceParams, _depth + 1);
            }
            if (object.structParam != null) {
                if (!$util.isObject(object.structParam))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_Componets.structParam: object expected");
                message.structParam = $root.AMR_MODEL_NSP.Message_Struct_Param.fromObject(object.structParam, _depth + 1);
            }
            if (object.boolDeprecated != null)
                if (object.boolDeprecated)
                    message.boolDeprecated = $Boolean(object.boolDeprecated);
            if (object.boolDisable != null)
                if (object.boolDisable)
                    message.boolDisable = $Boolean(object.boolDisable);
            return message;
        };

        /**
         * Creates a plain object from a Message_Module_Componets message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Componets} message Message_Module_Componets
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Module_Componets.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.generalAttr = null;
                object.privateAttr = null;
                object.interfaceAbility = null;
                object.interfaceParams = null;
                object.structParam = null;
                object.boolDeprecated = false;
                object.boolDisable = false;
            }
            if (message.generalAttr != null && $Object.hasOwnProperty.call(message, "generalAttr"))
                object.generalAttr = $root.AMR_MODEL_NSP.Message_Module_General_Attribute.toObject(message.generalAttr, options, _depth + 1);
            if (message.privateAttr != null && $Object.hasOwnProperty.call(message, "privateAttr"))
                object.privateAttr = $root.AMR_MODEL_NSP.Message_Module_Private_Attribute.toObject(message.privateAttr, options, _depth + 1);
            if (message.interfaceAbility != null && $Object.hasOwnProperty.call(message, "interfaceAbility"))
                object.interfaceAbility = $root.AMR_MODEL_NSP.Message_Interface_Ability.toObject(message.interfaceAbility, options, _depth + 1);
            if (message.interfaceParams != null && $Object.hasOwnProperty.call(message, "interfaceParams"))
                object.interfaceParams = $root.AMR_MODEL_NSP.Message_Interface_Param.toObject(message.interfaceParams, options, _depth + 1);
            if (message.structParam != null && $Object.hasOwnProperty.call(message, "structParam"))
                object.structParam = $root.AMR_MODEL_NSP.Message_Struct_Param.toObject(message.structParam, options, _depth + 1);
            if (message.boolDeprecated != null && $Object.hasOwnProperty.call(message, "boolDeprecated"))
                object.boolDeprecated = message.boolDeprecated;
            if (message.boolDisable != null && $Object.hasOwnProperty.call(message, "boolDisable"))
                object.boolDisable = message.boolDisable;
            return object;
        };

        /**
         * Converts this Message_Module_Componets to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Module_Componets.prototype.toJSON = function() {
            return Message_Module_Componets.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Module_Componets
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Module_Componets
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Module_Componets.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Module_Componets";
        };

        return Message_Module_Componets;
    })();

    AMR_MODEL_NSP.Message_Module_Info = (function() {

        /**
         * Properties of a Message_Module_Info.
         * @typedef {Object} AMR_MODEL_NSP.Message_Module_Info.$Properties
         * @property {string|null} [moduleGroupName] Message_Module_Info moduleGroupName
         * @property {string|null} [moduleGroupUuid] Message_Module_Info moduleGroupUuid
         * @property {string|null} [moduleSys] Message_Module_Info moduleSys
         * @property {Array.<AMR_MODEL_NSP.Message_Module_Componets.$Properties>|null} [moduleComponets] Message_Module_Info moduleComponets
         * @property {Array.<AMR_MODEL_NSP.Message_Module_Info.$Properties>|null} [moreModuleInfo] Message_Module_Info moreModuleInfo
         * @property {string|null} [modelVersion] Message_Module_Info modelVersion
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Module_Info.
         * @memberof AMR_MODEL_NSP
         * @interface IMessage_Module_Info
         * @augments AMR_MODEL_NSP.Message_Module_Info.$Properties
         * @deprecated Use AMR_MODEL_NSP.Message_Module_Info.$Properties instead.
         */

        /**
         * Shape of a Message_Module_Info.
         * @typedef {AMR_MODEL_NSP.Message_Module_Info.$Properties} AMR_MODEL_NSP.Message_Module_Info.$Shape
         */

        /**
         * Constructs a new Message_Module_Info.
         * @memberof AMR_MODEL_NSP
         * @classdesc Represents a Message_Module_Info.
         * @constructor
         * @param {AMR_MODEL_NSP.Message_Module_Info.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Module_Info = function (properties) {
            this.moduleComponets = [];
            this.moreModuleInfo = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Module_Info moduleGroupName.
         * @member {string} moduleGroupName
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @instance
         */
        Message_Module_Info.prototype.moduleGroupName = "";

        /**
         * Message_Module_Info moduleGroupUuid.
         * @member {string} moduleGroupUuid
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @instance
         */
        Message_Module_Info.prototype.moduleGroupUuid = "";

        /**
         * Message_Module_Info moduleSys.
         * @member {string} moduleSys
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @instance
         */
        Message_Module_Info.prototype.moduleSys = "";

        /**
         * Message_Module_Info moduleComponets.
         * @member {Array.<AMR_MODEL_NSP.Message_Module_Componets.$Properties>} moduleComponets
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @instance
         */
        Message_Module_Info.prototype.moduleComponets = $util.emptyArray;

        /**
         * Message_Module_Info moreModuleInfo.
         * @member {Array.<AMR_MODEL_NSP.Message_Module_Info.$Properties>} moreModuleInfo
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @instance
         */
        Message_Module_Info.prototype.moreModuleInfo = $util.emptyArray;

        /**
         * Message_Module_Info modelVersion.
         * @member {string} modelVersion
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @instance
         */
        Message_Module_Info.prototype.modelVersion = "";

        /**
         * Creates a new Message_Module_Info instance using the specified properties.
         * @function create
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Info.$Properties=} [properties] Properties to set
         * @returns {AMR_MODEL_NSP.Message_Module_Info} Message_Module_Info instance
         * @type {{
         *   (properties: AMR_MODEL_NSP.Message_Module_Info.$Shape): AMR_MODEL_NSP.Message_Module_Info & AMR_MODEL_NSP.Message_Module_Info.$Shape;
         *   (properties?: AMR_MODEL_NSP.Message_Module_Info.$Properties): AMR_MODEL_NSP.Message_Module_Info;
         * }}
         */
        Message_Module_Info.create = function(properties) {
            return new Message_Module_Info(properties);
        };

        /**
         * Encodes the specified Message_Module_Info message. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Info.verify|verify} messages.
         * @function encode
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Info.$Properties} message Message_Module_Info message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Module_Info.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.moduleGroupName != null && $Object.hasOwnProperty.call(message, "moduleGroupName") && message.moduleGroupName !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.moduleGroupName);
            if (message.moduleGroupUuid != null && $Object.hasOwnProperty.call(message, "moduleGroupUuid") && message.moduleGroupUuid !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.moduleGroupUuid);
            if (message.moduleSys != null && $Object.hasOwnProperty.call(message, "moduleSys") && message.moduleSys !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.moduleSys);
            if (message.moduleComponets != null && message.moduleComponets.length)
                for (let i = 0; i < message.moduleComponets.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Module_Componets.encode(message.moduleComponets[i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.moreModuleInfo != null && message.moreModuleInfo.length)
                for (let i = 0; i < message.moreModuleInfo.length; ++i)
                    $root.AMR_MODEL_NSP.Message_Module_Info.encode(message.moreModuleInfo[i], writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
            if (message.modelVersion != null && $Object.hasOwnProperty.call(message, "modelVersion") && message.modelVersion !== "")
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.modelVersion);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Module_Info message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Info.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Info.$Properties} message Message_Module_Info message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Module_Info.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Module_Info message from the specified reader or buffer.
         * @function decode
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Module_Info & AMR_MODEL_NSP.Message_Module_Info.$Shape} Message_Module_Info
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Module_Info.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.AMR_MODEL_NSP.Message_Module_Info(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.moduleGroupName = value;
                        else
                            delete message.moduleGroupName;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.moduleGroupUuid = value;
                        else
                            delete message.moduleGroupUuid;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.moduleSys = value;
                        else
                            delete message.moduleSys;
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        if (!(message.moduleComponets && message.moduleComponets.length))
                            message.moduleComponets = [];
                        message.moduleComponets.push($root.AMR_MODEL_NSP.Message_Module_Componets.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        if (!(message.moreModuleInfo && message.moreModuleInfo.length))
                            message.moreModuleInfo = [];
                        message.moreModuleInfo.push($root.AMR_MODEL_NSP.Message_Module_Info.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.modelVersion = value;
                        else
                            delete message.modelVersion;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Module_Info message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Module_Info & AMR_MODEL_NSP.Message_Module_Info.$Shape} Message_Module_Info
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Module_Info.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Module_Info message.
         * @function verify
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Module_Info.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.moduleGroupName != null && $Object.hasOwnProperty.call(message, "moduleGroupName"))
                if (!$util.isString(message.moduleGroupName))
                    return "moduleGroupName: string expected";
            if (message.moduleGroupUuid != null && $Object.hasOwnProperty.call(message, "moduleGroupUuid"))
                if (!$util.isString(message.moduleGroupUuid))
                    return "moduleGroupUuid: string expected";
            if (message.moduleSys != null && $Object.hasOwnProperty.call(message, "moduleSys"))
                if (!$util.isString(message.moduleSys))
                    return "moduleSys: string expected";
            if (message.moduleComponets != null && $Object.hasOwnProperty.call(message, "moduleComponets")) {
                if (!$Array.isArray(message.moduleComponets))
                    return "moduleComponets: array expected";
                for (let i = 0; i < message.moduleComponets.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Module_Componets.verify(message.moduleComponets[i], _depth + 1);
                    if (error)
                        return "moduleComponets." + error;
                }
            }
            if (message.moreModuleInfo != null && $Object.hasOwnProperty.call(message, "moreModuleInfo")) {
                if (!$Array.isArray(message.moreModuleInfo))
                    return "moreModuleInfo: array expected";
                for (let i = 0; i < message.moreModuleInfo.length; ++i) {
                    let error = $root.AMR_MODEL_NSP.Message_Module_Info.verify(message.moreModuleInfo[i], _depth + 1);
                    if (error)
                        return "moreModuleInfo." + error;
                }
            }
            if (message.modelVersion != null && $Object.hasOwnProperty.call(message, "modelVersion"))
                if (!$util.isString(message.modelVersion))
                    return "modelVersion: string expected";
            return null;
        };

        /**
         * Creates a Message_Module_Info message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AMR_MODEL_NSP.Message_Module_Info} Message_Module_Info
         */
        Message_Module_Info.fromObject = function (object, _depth) {
            if (object instanceof $root.AMR_MODEL_NSP.Message_Module_Info)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".AMR_MODEL_NSP.Message_Module_Info: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.AMR_MODEL_NSP.Message_Module_Info();
            if (object.moduleGroupName != null)
                if (typeof object.moduleGroupName !== "string" || object.moduleGroupName.length)
                    message.moduleGroupName = $String(object.moduleGroupName);
            if (object.moduleGroupUuid != null)
                if (typeof object.moduleGroupUuid !== "string" || object.moduleGroupUuid.length)
                    message.moduleGroupUuid = $String(object.moduleGroupUuid);
            if (object.moduleSys != null)
                if (typeof object.moduleSys !== "string" || object.moduleSys.length)
                    message.moduleSys = $String(object.moduleSys);
            if (object.moduleComponets) {
                if (!$Array.isArray(object.moduleComponets))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_Info.moduleComponets: array expected");
                message.moduleComponets = $Array(object.moduleComponets.length);
                for (let i = 0; i < object.moduleComponets.length; ++i) {
                    if (!$util.isObject(object.moduleComponets[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Module_Info.moduleComponets: object expected");
                    message.moduleComponets[i] = $root.AMR_MODEL_NSP.Message_Module_Componets.fromObject(object.moduleComponets[i], _depth + 1);
                }
            }
            if (object.moreModuleInfo) {
                if (!$Array.isArray(object.moreModuleInfo))
                    throw $TypeError(".AMR_MODEL_NSP.Message_Module_Info.moreModuleInfo: array expected");
                message.moreModuleInfo = $Array(object.moreModuleInfo.length);
                for (let i = 0; i < object.moreModuleInfo.length; ++i) {
                    if (!$util.isObject(object.moreModuleInfo[i]))
                        throw $TypeError(".AMR_MODEL_NSP.Message_Module_Info.moreModuleInfo: object expected");
                    message.moreModuleInfo[i] = $root.AMR_MODEL_NSP.Message_Module_Info.fromObject(object.moreModuleInfo[i], _depth + 1);
                }
            }
            if (object.modelVersion != null)
                if (typeof object.modelVersion !== "string" || object.modelVersion.length)
                    message.modelVersion = $String(object.modelVersion);
            return message;
        };

        /**
         * Creates a plain object from a Message_Module_Info message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @static
         * @param {AMR_MODEL_NSP.Message_Module_Info} message Message_Module_Info
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Module_Info.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults) {
                object.moduleComponets = [];
                object.moreModuleInfo = [];
            }
            if (options.defaults) {
                object.moduleGroupName = "";
                object.moduleGroupUuid = "";
                object.moduleSys = "";
                object.modelVersion = "";
            }
            if (message.moduleGroupName != null && $Object.hasOwnProperty.call(message, "moduleGroupName"))
                object.moduleGroupName = message.moduleGroupName;
            if (message.moduleGroupUuid != null && $Object.hasOwnProperty.call(message, "moduleGroupUuid"))
                object.moduleGroupUuid = message.moduleGroupUuid;
            if (message.moduleSys != null && $Object.hasOwnProperty.call(message, "moduleSys"))
                object.moduleSys = message.moduleSys;
            if (message.moduleComponets && message.moduleComponets.length) {
                object.moduleComponets = $Array(message.moduleComponets.length);
                for (let j = 0; j < message.moduleComponets.length; ++j)
                    object.moduleComponets[j] = $root.AMR_MODEL_NSP.Message_Module_Componets.toObject(message.moduleComponets[j], options, _depth + 1);
            }
            if (message.moreModuleInfo && message.moreModuleInfo.length) {
                object.moreModuleInfo = $Array(message.moreModuleInfo.length);
                for (let j = 0; j < message.moreModuleInfo.length; ++j)
                    object.moreModuleInfo[j] = $root.AMR_MODEL_NSP.Message_Module_Info.toObject(message.moreModuleInfo[j], options, _depth + 1);
            }
            if (message.modelVersion != null && $Object.hasOwnProperty.call(message, "modelVersion"))
                object.modelVersion = message.modelVersion;
            return object;
        };

        /**
         * Converts this Message_Module_Info to JSON.
         * @function toJSON
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Module_Info.prototype.toJSON = function() {
            return Message_Module_Info.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Module_Info
         * @function getTypeUrl
         * @memberof AMR_MODEL_NSP.Message_Module_Info
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Module_Info.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/AMR_MODEL_NSP.Message_Module_Info";
        };

        return Message_Module_Info;
    })();

    return AMR_MODEL_NSP;
})();

export const MODEL_ABI = $root.MODEL_ABI = (() => {

    /**
     * Namespace MODEL_ABI.
     * @exports MODEL_ABI
     * @namespace
     */
    const MODEL_ABI = {};

    /**
     * MESSAGE_ATTRIBUTE_TYPE enum.
     * @name MODEL_ABI.MESSAGE_ATTRIBUTE_TYPE
     * @enum {number}
     * @property {number} BYTES_E=0 BYTES_E value
     * @property {number} STRING_E=1 STRING_E value
     * @property {number} IP_E=3 IP_E value
     * @property {number} BOOL_E=4 BOOL_E value
     * @property {number} INT32_E=5 INT32_E value
     * @property {number} UINT32_E=6 UINT32_E value
     * @property {number} INT64_E=7 INT64_E value
     * @property {number} UINT64_E=8 UINT64_E value
     * @property {number} FLOAT_E=9 FLOAT_E value
     * @property {number} DOUBLE_E=10 DOUBLE_E value
     * @property {number} FIXED_E=11 FIXED_E value
     * @property {number} DATA_COMBOX_E=12 DATA_COMBOX_E value
     */
    MODEL_ABI.MESSAGE_ATTRIBUTE_TYPE = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "BYTES_E"] = 0;
        values[valuesById[1] = "STRING_E"] = 1;
        values[valuesById[3] = "IP_E"] = 3;
        values[valuesById[4] = "BOOL_E"] = 4;
        values[valuesById[5] = "INT32_E"] = 5;
        values[valuesById[6] = "UINT32_E"] = 6;
        values[valuesById[7] = "INT64_E"] = 7;
        values[valuesById[8] = "UINT64_E"] = 8;
        values[valuesById[9] = "FLOAT_E"] = 9;
        values[valuesById[10] = "DOUBLE_E"] = 10;
        values[valuesById[11] = "FIXED_E"] = 11;
        values[valuesById[12] = "DATA_COMBOX_E"] = 12;
        return values;
    })();

    /**
     * MESSAGE_ATTRIBUTE_OPTION enum.
     * @name MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION
     * @enum {number}
     * @property {number} REQUIRED_E=0 REQUIRED_E value
     * @property {number} OPTIONAL_E=1 OPTIONAL_E value
     */
    MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "REQUIRED_E"] = 0;
        values[valuesById[1] = "OPTIONAL_E"] = 1;
        return values;
    })();

    /**
     * COMBOX_SOURCE_TYPE enum.
     * @name MODEL_ABI.COMBOX_SOURCE_TYPE
     * @enum {number}
     * @property {number} NORMAL_E=0 NORMAL_E value
     * @property {number} CUSTOM_E=1 CUSTOM_E value
     */
    MODEL_ABI.COMBOX_SOURCE_TYPE = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "NORMAL_E"] = 0;
        values[valuesById[1] = "CUSTOM_E"] = 1;
        return values;
    })();

    /**
     * COMMON_ATTR_TYPE enum.
     * @name MODEL_ABI.COMMON_ATTR_TYPE
     * @enum {number}
     * @property {number} COMBOX_E=0 COMBOX_E value
     * @property {number} ARRAY_E=1 ARRAY_E value
     */
    MODEL_ABI.COMMON_ATTR_TYPE = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "COMBOX_E"] = 0;
        values[valuesById[1] = "ARRAY_E"] = 1;
        return values;
    })();

    MODEL_ABI.Message_Combox_Item = (function() {

        /**
         * Properties of a Message_Combox_Item.
         * @typedef {Object} MODEL_ABI.Message_Combox_Item.$Properties
         * @property {string|null} [key] Message_Combox_Item key
         * @property {string|null} [desc] Message_Combox_Item desc
         * @property {Array.<MODEL_ABI.Message_Attribute.$Properties>|null} [arrayCmobEle] Message_Combox_Item arrayCmobEle
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Combox_Item.
         * @memberof MODEL_ABI
         * @interface IMessage_Combox_Item
         * @augments MODEL_ABI.Message_Combox_Item.$Properties
         * @deprecated Use MODEL_ABI.Message_Combox_Item.$Properties instead.
         */

        /**
         * Shape of a Message_Combox_Item.
         * @typedef {MODEL_ABI.Message_Combox_Item.$Properties} MODEL_ABI.Message_Combox_Item.$Shape
         */

        /**
         * Constructs a new Message_Combox_Item.
         * @memberof MODEL_ABI
         * @classdesc Represents a Message_Combox_Item.
         * @constructor
         * @param {MODEL_ABI.Message_Combox_Item.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Combox_Item = function (properties) {
            this.arrayCmobEle = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Combox_Item key.
         * @member {string} key
         * @memberof MODEL_ABI.Message_Combox_Item
         * @instance
         */
        Message_Combox_Item.prototype.key = "";

        /**
         * Message_Combox_Item desc.
         * @member {string} desc
         * @memberof MODEL_ABI.Message_Combox_Item
         * @instance
         */
        Message_Combox_Item.prototype.desc = "";

        /**
         * Message_Combox_Item arrayCmobEle.
         * @member {Array.<MODEL_ABI.Message_Attribute.$Properties>} arrayCmobEle
         * @memberof MODEL_ABI.Message_Combox_Item
         * @instance
         */
        Message_Combox_Item.prototype.arrayCmobEle = $util.emptyArray;

        /**
         * Creates a new Message_Combox_Item instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Message_Combox_Item
         * @static
         * @param {MODEL_ABI.Message_Combox_Item.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Message_Combox_Item} Message_Combox_Item instance
         * @type {{
         *   (properties: MODEL_ABI.Message_Combox_Item.$Shape): MODEL_ABI.Message_Combox_Item & MODEL_ABI.Message_Combox_Item.$Shape;
         *   (properties?: MODEL_ABI.Message_Combox_Item.$Properties): MODEL_ABI.Message_Combox_Item;
         * }}
         */
        Message_Combox_Item.create = function(properties) {
            return new Message_Combox_Item(properties);
        };

        /**
         * Encodes the specified Message_Combox_Item message. Does not implicitly {@link MODEL_ABI.Message_Combox_Item.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Message_Combox_Item
         * @static
         * @param {MODEL_ABI.Message_Combox_Item.$Properties} message Message_Combox_Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Combox_Item.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.desc);
            if (message.arrayCmobEle != null && message.arrayCmobEle.length)
                for (let i = 0; i < message.arrayCmobEle.length; ++i)
                    $root.MODEL_ABI.Message_Attribute.encode(message.arrayCmobEle[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Combox_Item message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Combox_Item.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Message_Combox_Item
         * @static
         * @param {MODEL_ABI.Message_Combox_Item.$Properties} message Message_Combox_Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Combox_Item.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Combox_Item message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Message_Combox_Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Combox_Item & MODEL_ABI.Message_Combox_Item.$Shape} Message_Combox_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Combox_Item.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Message_Combox_Item(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if (!(message.arrayCmobEle && message.arrayCmobEle.length))
                            message.arrayCmobEle = [];
                        message.arrayCmobEle.push($root.MODEL_ABI.Message_Attribute.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Combox_Item message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Message_Combox_Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Combox_Item & MODEL_ABI.Message_Combox_Item.$Shape} Message_Combox_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Combox_Item.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Combox_Item message.
         * @function verify
         * @memberof MODEL_ABI.Message_Combox_Item
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Combox_Item.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.arrayCmobEle != null && $Object.hasOwnProperty.call(message, "arrayCmobEle")) {
                if (!$Array.isArray(message.arrayCmobEle))
                    return "arrayCmobEle: array expected";
                for (let i = 0; i < message.arrayCmobEle.length; ++i) {
                    let error = $root.MODEL_ABI.Message_Attribute.verify(message.arrayCmobEle[i], _depth + 1);
                    if (error)
                        return "arrayCmobEle." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Message_Combox_Item message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Message_Combox_Item
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Message_Combox_Item} Message_Combox_Item
         */
        Message_Combox_Item.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Message_Combox_Item)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Message_Combox_Item: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Message_Combox_Item();
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.arrayCmobEle) {
                if (!$Array.isArray(object.arrayCmobEle))
                    throw $TypeError(".MODEL_ABI.Message_Combox_Item.arrayCmobEle: array expected");
                message.arrayCmobEle = $Array(object.arrayCmobEle.length);
                for (let i = 0; i < object.arrayCmobEle.length; ++i) {
                    if (!$util.isObject(object.arrayCmobEle[i]))
                        throw $TypeError(".MODEL_ABI.Message_Combox_Item.arrayCmobEle: object expected");
                    message.arrayCmobEle[i] = $root.MODEL_ABI.Message_Attribute.fromObject(object.arrayCmobEle[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_Combox_Item message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Message_Combox_Item
         * @static
         * @param {MODEL_ABI.Message_Combox_Item} message Message_Combox_Item
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Combox_Item.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.arrayCmobEle = [];
            if (options.defaults) {
                object.key = "";
                object.desc = "";
            }
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.arrayCmobEle && message.arrayCmobEle.length) {
                object.arrayCmobEle = $Array(message.arrayCmobEle.length);
                for (let j = 0; j < message.arrayCmobEle.length; ++j)
                    object.arrayCmobEle[j] = $root.MODEL_ABI.Message_Attribute.toObject(message.arrayCmobEle[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Message_Combox_Item to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Message_Combox_Item
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Combox_Item.prototype.toJSON = function() {
            return Message_Combox_Item.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Combox_Item
         * @function getTypeUrl
         * @memberof MODEL_ABI.Message_Combox_Item
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Combox_Item.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Message_Combox_Item";
        };

        return Message_Combox_Item;
    })();

    MODEL_ABI.Message_Combox_Type = (function() {

        /**
         * Properties of a Message_Combox_Type.
         * @typedef {Object} MODEL_ABI.Message_Combox_Type.$Properties
         * @property {string|null} [typeKey] Message_Combox_Type typeKey
         * @property {string|null} [typeDesc] Message_Combox_Type typeDesc
         * @property {Array.<MODEL_ABI.Message_Combox_Item.$Properties>|null} [typeGroups] Message_Combox_Type typeGroups
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Combox_Type.
         * @memberof MODEL_ABI
         * @interface IMessage_Combox_Type
         * @augments MODEL_ABI.Message_Combox_Type.$Properties
         * @deprecated Use MODEL_ABI.Message_Combox_Type.$Properties instead.
         */

        /**
         * Shape of a Message_Combox_Type.
         * @typedef {MODEL_ABI.Message_Combox_Type.$Properties} MODEL_ABI.Message_Combox_Type.$Shape
         */

        /**
         * Constructs a new Message_Combox_Type.
         * @memberof MODEL_ABI
         * @classdesc Represents a Message_Combox_Type.
         * @constructor
         * @param {MODEL_ABI.Message_Combox_Type.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Combox_Type = function (properties) {
            this.typeGroups = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Combox_Type typeKey.
         * @member {string} typeKey
         * @memberof MODEL_ABI.Message_Combox_Type
         * @instance
         */
        Message_Combox_Type.prototype.typeKey = "";

        /**
         * Message_Combox_Type typeDesc.
         * @member {string} typeDesc
         * @memberof MODEL_ABI.Message_Combox_Type
         * @instance
         */
        Message_Combox_Type.prototype.typeDesc = "";

        /**
         * Message_Combox_Type typeGroups.
         * @member {Array.<MODEL_ABI.Message_Combox_Item.$Properties>} typeGroups
         * @memberof MODEL_ABI.Message_Combox_Type
         * @instance
         */
        Message_Combox_Type.prototype.typeGroups = $util.emptyArray;

        /**
         * Creates a new Message_Combox_Type instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Message_Combox_Type
         * @static
         * @param {MODEL_ABI.Message_Combox_Type.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Message_Combox_Type} Message_Combox_Type instance
         * @type {{
         *   (properties: MODEL_ABI.Message_Combox_Type.$Shape): MODEL_ABI.Message_Combox_Type & MODEL_ABI.Message_Combox_Type.$Shape;
         *   (properties?: MODEL_ABI.Message_Combox_Type.$Properties): MODEL_ABI.Message_Combox_Type;
         * }}
         */
        Message_Combox_Type.create = function(properties) {
            return new Message_Combox_Type(properties);
        };

        /**
         * Encodes the specified Message_Combox_Type message. Does not implicitly {@link MODEL_ABI.Message_Combox_Type.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Message_Combox_Type
         * @static
         * @param {MODEL_ABI.Message_Combox_Type.$Properties} message Message_Combox_Type message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Combox_Type.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.typeKey != null && $Object.hasOwnProperty.call(message, "typeKey") && message.typeKey !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.typeKey);
            if (message.typeDesc != null && $Object.hasOwnProperty.call(message, "typeDesc") && message.typeDesc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.typeDesc);
            if (message.typeGroups != null && message.typeGroups.length)
                for (let i = 0; i < message.typeGroups.length; ++i)
                    $root.MODEL_ABI.Message_Combox_Item.encode(message.typeGroups[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Combox_Type message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Combox_Type.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Message_Combox_Type
         * @static
         * @param {MODEL_ABI.Message_Combox_Type.$Properties} message Message_Combox_Type message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Combox_Type.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Combox_Type message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Message_Combox_Type
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Combox_Type & MODEL_ABI.Message_Combox_Type.$Shape} Message_Combox_Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Combox_Type.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Message_Combox_Type(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.typeKey = value;
                        else
                            delete message.typeKey;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.typeDesc = value;
                        else
                            delete message.typeDesc;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if (!(message.typeGroups && message.typeGroups.length))
                            message.typeGroups = [];
                        message.typeGroups.push($root.MODEL_ABI.Message_Combox_Item.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Combox_Type message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Message_Combox_Type
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Combox_Type & MODEL_ABI.Message_Combox_Type.$Shape} Message_Combox_Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Combox_Type.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Combox_Type message.
         * @function verify
         * @memberof MODEL_ABI.Message_Combox_Type
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Combox_Type.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.typeKey != null && $Object.hasOwnProperty.call(message, "typeKey"))
                if (!$util.isString(message.typeKey))
                    return "typeKey: string expected";
            if (message.typeDesc != null && $Object.hasOwnProperty.call(message, "typeDesc"))
                if (!$util.isString(message.typeDesc))
                    return "typeDesc: string expected";
            if (message.typeGroups != null && $Object.hasOwnProperty.call(message, "typeGroups")) {
                if (!$Array.isArray(message.typeGroups))
                    return "typeGroups: array expected";
                for (let i = 0; i < message.typeGroups.length; ++i) {
                    let error = $root.MODEL_ABI.Message_Combox_Item.verify(message.typeGroups[i], _depth + 1);
                    if (error)
                        return "typeGroups." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Message_Combox_Type message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Message_Combox_Type
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Message_Combox_Type} Message_Combox_Type
         */
        Message_Combox_Type.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Message_Combox_Type)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Message_Combox_Type: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Message_Combox_Type();
            if (object.typeKey != null)
                if (typeof object.typeKey !== "string" || object.typeKey.length)
                    message.typeKey = $String(object.typeKey);
            if (object.typeDesc != null)
                if (typeof object.typeDesc !== "string" || object.typeDesc.length)
                    message.typeDesc = $String(object.typeDesc);
            if (object.typeGroups) {
                if (!$Array.isArray(object.typeGroups))
                    throw $TypeError(".MODEL_ABI.Message_Combox_Type.typeGroups: array expected");
                message.typeGroups = $Array(object.typeGroups.length);
                for (let i = 0; i < object.typeGroups.length; ++i) {
                    if (!$util.isObject(object.typeGroups[i]))
                        throw $TypeError(".MODEL_ABI.Message_Combox_Type.typeGroups: object expected");
                    message.typeGroups[i] = $root.MODEL_ABI.Message_Combox_Item.fromObject(object.typeGroups[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_Combox_Type message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Message_Combox_Type
         * @static
         * @param {MODEL_ABI.Message_Combox_Type} message Message_Combox_Type
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Combox_Type.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.typeGroups = [];
            if (options.defaults) {
                object.typeKey = "";
                object.typeDesc = "";
            }
            if (message.typeKey != null && $Object.hasOwnProperty.call(message, "typeKey"))
                object.typeKey = message.typeKey;
            if (message.typeDesc != null && $Object.hasOwnProperty.call(message, "typeDesc"))
                object.typeDesc = message.typeDesc;
            if (message.typeGroups && message.typeGroups.length) {
                object.typeGroups = $Array(message.typeGroups.length);
                for (let j = 0; j < message.typeGroups.length; ++j)
                    object.typeGroups[j] = $root.MODEL_ABI.Message_Combox_Item.toObject(message.typeGroups[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Message_Combox_Type to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Message_Combox_Type
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Combox_Type.prototype.toJSON = function() {
            return Message_Combox_Type.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Combox_Type
         * @function getTypeUrl
         * @memberof MODEL_ABI.Message_Combox_Type
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Combox_Type.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Message_Combox_Type";
        };

        return Message_Combox_Type;
    })();

    MODEL_ABI.Message_Attribute = (function() {

        /**
         * Properties of a Message_Attribute.
         * @typedef {Object} MODEL_ABI.Message_Attribute.$Properties
         * @property {string|null} [key] Message_Attribute key
         * @property {string|null} [desc] Message_Attribute desc
         * @property {string|null} [tips] Message_Attribute tips
         * @property {number|null} [maxCount] Message_Attribute maxCount
         * @property {MODEL_ABI.MESSAGE_ATTRIBUTE_TYPE|null} [type] Message_Attribute type
         * @property {string|null} [stringValue] Message_Attribute stringValue
         * @property {boolean|null} [boolValue] Message_Attribute boolValue
         * @property {number|null} [int32Value] Message_Attribute int32Value
         * @property {number|null} [uint32Value] Message_Attribute uint32Value
         * @property {number|Long|null} [int64Value] Message_Attribute int64Value
         * @property {number|Long|null} [uint64Value] Message_Attribute uint64Value
         * @property {number|null} [floatValue] Message_Attribute floatValue
         * @property {number|null} [doubleValue] Message_Attribute doubleValue
         * @property {Uint8Array|null} [bytesValue] Message_Attribute bytesValue
         * @property {string|null} [stringFix] Message_Attribute stringFix
         * @property {MODEL_ABI.Message_Combox_Type.$Properties|null} [comboType] Message_Attribute comboType
         * @property {number|null} [int32Maxvalue] Message_Attribute int32Maxvalue
         * @property {number|null} [uint32Maxvalue] Message_Attribute uint32Maxvalue
         * @property {number|Long|null} [int64Maxvalue] Message_Attribute int64Maxvalue
         * @property {number|Long|null} [uint64Maxvalue] Message_Attribute uint64Maxvalue
         * @property {number|null} [floatMaxvalue] Message_Attribute floatMaxvalue
         * @property {number|null} [doubleMaxvalue] Message_Attribute doubleMaxvalue
         * @property {number|null} [int32Minvalue] Message_Attribute int32Minvalue
         * @property {number|null} [uint32Minvalue] Message_Attribute uint32Minvalue
         * @property {number|Long|null} [int64Minvalue] Message_Attribute int64Minvalue
         * @property {number|Long|null} [uint64Minvalue] Message_Attribute uint64Minvalue
         * @property {number|null} [floatMinvalue] Message_Attribute floatMinvalue
         * @property {number|null} [doubleMinvalue] Message_Attribute doubleMinvalue
         * @property {string|null} [unit] Message_Attribute unit
         * @property {Array.<string>|null} [fixedSource] Message_Attribute fixedSource
         * @property {boolean|null} [copyEnable] Message_Attribute copyEnable
         * @property {MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION|null} [option] Message_Attribute option
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Attribute.
         * @memberof MODEL_ABI
         * @interface IMessage_Attribute
         * @augments MODEL_ABI.Message_Attribute.$Properties
         * @deprecated Use MODEL_ABI.Message_Attribute.$Properties instead.
         */

        /**
         * Shape of a Message_Attribute.
         * @typedef {MODEL_ABI.Message_Attribute.$Properties} MODEL_ABI.Message_Attribute.$Shape
         */

        /**
         * Constructs a new Message_Attribute.
         * @memberof MODEL_ABI
         * @classdesc Represents a Message_Attribute.
         * @constructor
         * @param {MODEL_ABI.Message_Attribute.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Attribute = function (properties) {
            this.fixedSource = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Attribute key.
         * @member {string} key
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.key = "";

        /**
         * Message_Attribute desc.
         * @member {string} desc
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.desc = "";

        /**
         * Message_Attribute tips.
         * @member {string} tips
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.tips = "";

        /**
         * Message_Attribute maxCount.
         * @member {number} maxCount
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.maxCount = 0;

        /**
         * Message_Attribute type.
         * @member {MODEL_ABI.MESSAGE_ATTRIBUTE_TYPE} type
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.type = 0;

        /**
         * Message_Attribute stringValue.
         * @member {string} stringValue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.stringValue = "";

        /**
         * Message_Attribute boolValue.
         * @member {boolean} boolValue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.boolValue = false;

        /**
         * Message_Attribute int32Value.
         * @member {number} int32Value
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.int32Value = 0;

        /**
         * Message_Attribute uint32Value.
         * @member {number} uint32Value
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.uint32Value = 0;

        /**
         * Message_Attribute int64Value.
         * @member {number|Long} int64Value
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.int64Value = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Message_Attribute uint64Value.
         * @member {number|Long} uint64Value
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.uint64Value = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Message_Attribute floatValue.
         * @member {number} floatValue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.floatValue = 0;

        /**
         * Message_Attribute doubleValue.
         * @member {number} doubleValue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.doubleValue = 0;

        /**
         * Message_Attribute bytesValue.
         * @member {Uint8Array} bytesValue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.bytesValue = $util.newBuffer([]);

        /**
         * Message_Attribute stringFix.
         * @member {string} stringFix
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.stringFix = "";

        /**
         * Message_Attribute comboType.
         * @member {MODEL_ABI.Message_Combox_Type.$Properties|null|undefined} comboType
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.comboType = null;

        /**
         * Message_Attribute int32Maxvalue.
         * @member {number} int32Maxvalue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.int32Maxvalue = 0;

        /**
         * Message_Attribute uint32Maxvalue.
         * @member {number} uint32Maxvalue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.uint32Maxvalue = 0;

        /**
         * Message_Attribute int64Maxvalue.
         * @member {number|Long} int64Maxvalue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.int64Maxvalue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Message_Attribute uint64Maxvalue.
         * @member {number|Long} uint64Maxvalue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.uint64Maxvalue = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Message_Attribute floatMaxvalue.
         * @member {number} floatMaxvalue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.floatMaxvalue = 0;

        /**
         * Message_Attribute doubleMaxvalue.
         * @member {number} doubleMaxvalue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.doubleMaxvalue = 0;

        /**
         * Message_Attribute int32Minvalue.
         * @member {number} int32Minvalue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.int32Minvalue = 0;

        /**
         * Message_Attribute uint32Minvalue.
         * @member {number} uint32Minvalue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.uint32Minvalue = 0;

        /**
         * Message_Attribute int64Minvalue.
         * @member {number|Long} int64Minvalue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.int64Minvalue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Message_Attribute uint64Minvalue.
         * @member {number|Long} uint64Minvalue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.uint64Minvalue = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Message_Attribute floatMinvalue.
         * @member {number} floatMinvalue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.floatMinvalue = 0;

        /**
         * Message_Attribute doubleMinvalue.
         * @member {number} doubleMinvalue
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.doubleMinvalue = 0;

        /**
         * Message_Attribute unit.
         * @member {string} unit
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.unit = "";

        /**
         * Message_Attribute fixedSource.
         * @member {Array.<string>} fixedSource
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.fixedSource = $util.emptyArray;

        /**
         * Message_Attribute copyEnable.
         * @member {boolean} copyEnable
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.copyEnable = false;

        /**
         * Message_Attribute option.
         * @member {MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION} option
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.option = 0;

        /**
         * Creates a new Message_Attribute instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Message_Attribute
         * @static
         * @param {MODEL_ABI.Message_Attribute.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Message_Attribute} Message_Attribute instance
         * @type {{
         *   (properties: MODEL_ABI.Message_Attribute.$Shape): MODEL_ABI.Message_Attribute & MODEL_ABI.Message_Attribute.$Shape;
         *   (properties?: MODEL_ABI.Message_Attribute.$Properties): MODEL_ABI.Message_Attribute;
         * }}
         */
        Message_Attribute.create = function(properties) {
            return new Message_Attribute(properties);
        };

        /**
         * Encodes the specified Message_Attribute message. Does not implicitly {@link MODEL_ABI.Message_Attribute.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Message_Attribute
         * @static
         * @param {MODEL_ABI.Message_Attribute.$Properties} message Message_Attribute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Attribute.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.desc);
            if (message.tips != null && $Object.hasOwnProperty.call(message, "tips") && message.tips !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.tips);
            if (message.maxCount != null && $Object.hasOwnProperty.call(message, "maxCount") && message.maxCount !== 0)
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.maxCount);
            if (message.type != null && $Object.hasOwnProperty.call(message, "type") && message.type !== 0)
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.type);
            if (message.stringValue != null && $Object.hasOwnProperty.call(message, "stringValue") && message.stringValue !== "")
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.stringValue);
            if (message.boolValue != null && $Object.hasOwnProperty.call(message, "boolValue") && message.boolValue !== false)
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.boolValue);
            if (message.int32Value != null && $Object.hasOwnProperty.call(message, "int32Value") && message.int32Value !== 0)
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.int32Value);
            if (message.uint32Value != null && $Object.hasOwnProperty.call(message, "uint32Value") && message.uint32Value !== 0)
                writer.uint32(/* id 13, wireType 0 =*/104).uint32(message.uint32Value);
            if (message.int64Value != null && $Object.hasOwnProperty.call(message, "int64Value") && (typeof message.int64Value === "object" ? message.int64Value.low || message.int64Value.high : message.int64Value !== 0))
                writer.uint32(/* id 14, wireType 0 =*/112).int64(message.int64Value);
            if (message.uint64Value != null && $Object.hasOwnProperty.call(message, "uint64Value") && (typeof message.uint64Value === "object" ? message.uint64Value.low || message.uint64Value.high : message.uint64Value !== 0))
                writer.uint32(/* id 15, wireType 0 =*/120).uint64(message.uint64Value);
            if (message.floatValue != null && $Object.hasOwnProperty.call(message, "floatValue") && !$Object.is(message.floatValue, 0))
                writer.uint32(/* id 16, wireType 5 =*/133).float(message.floatValue);
            if (message.doubleValue != null && $Object.hasOwnProperty.call(message, "doubleValue") && !$Object.is(message.doubleValue, 0))
                writer.uint32(/* id 17, wireType 1 =*/137).double(message.doubleValue);
            if (message.bytesValue != null && $Object.hasOwnProperty.call(message, "bytesValue") && message.bytesValue.length)
                writer.uint32(/* id 18, wireType 2 =*/146).bytes(message.bytesValue);
            if (message.stringFix != null && $Object.hasOwnProperty.call(message, "stringFix") && message.stringFix !== "")
                writer.uint32(/* id 19, wireType 2 =*/154).string(message.stringFix);
            if (message.comboType != null && $Object.hasOwnProperty.call(message, "comboType"))
                $root.MODEL_ABI.Message_Combox_Type.encode(message.comboType, writer.uint32(/* id 20, wireType 2 =*/162).fork(), _depth + 1).ldelim();
            if (message.int32Maxvalue != null && $Object.hasOwnProperty.call(message, "int32Maxvalue") && message.int32Maxvalue !== 0)
                writer.uint32(/* id 30, wireType 0 =*/240).int32(message.int32Maxvalue);
            if (message.uint32Maxvalue != null && $Object.hasOwnProperty.call(message, "uint32Maxvalue") && message.uint32Maxvalue !== 0)
                writer.uint32(/* id 31, wireType 0 =*/248).uint32(message.uint32Maxvalue);
            if (message.int64Maxvalue != null && $Object.hasOwnProperty.call(message, "int64Maxvalue") && (typeof message.int64Maxvalue === "object" ? message.int64Maxvalue.low || message.int64Maxvalue.high : message.int64Maxvalue !== 0))
                writer.uint32(/* id 32, wireType 0 =*/256).int64(message.int64Maxvalue);
            if (message.uint64Maxvalue != null && $Object.hasOwnProperty.call(message, "uint64Maxvalue") && (typeof message.uint64Maxvalue === "object" ? message.uint64Maxvalue.low || message.uint64Maxvalue.high : message.uint64Maxvalue !== 0))
                writer.uint32(/* id 33, wireType 0 =*/264).uint64(message.uint64Maxvalue);
            if (message.floatMaxvalue != null && $Object.hasOwnProperty.call(message, "floatMaxvalue") && !$Object.is(message.floatMaxvalue, 0))
                writer.uint32(/* id 34, wireType 5 =*/277).float(message.floatMaxvalue);
            if (message.doubleMaxvalue != null && $Object.hasOwnProperty.call(message, "doubleMaxvalue") && !$Object.is(message.doubleMaxvalue, 0))
                writer.uint32(/* id 35, wireType 1 =*/281).double(message.doubleMaxvalue);
            if (message.int32Minvalue != null && $Object.hasOwnProperty.call(message, "int32Minvalue") && message.int32Minvalue !== 0)
                writer.uint32(/* id 40, wireType 0 =*/320).int32(message.int32Minvalue);
            if (message.uint32Minvalue != null && $Object.hasOwnProperty.call(message, "uint32Minvalue") && message.uint32Minvalue !== 0)
                writer.uint32(/* id 41, wireType 0 =*/328).uint32(message.uint32Minvalue);
            if (message.int64Minvalue != null && $Object.hasOwnProperty.call(message, "int64Minvalue") && (typeof message.int64Minvalue === "object" ? message.int64Minvalue.low || message.int64Minvalue.high : message.int64Minvalue !== 0))
                writer.uint32(/* id 42, wireType 0 =*/336).int64(message.int64Minvalue);
            if (message.uint64Minvalue != null && $Object.hasOwnProperty.call(message, "uint64Minvalue") && (typeof message.uint64Minvalue === "object" ? message.uint64Minvalue.low || message.uint64Minvalue.high : message.uint64Minvalue !== 0))
                writer.uint32(/* id 43, wireType 0 =*/344).uint64(message.uint64Minvalue);
            if (message.floatMinvalue != null && $Object.hasOwnProperty.call(message, "floatMinvalue") && !$Object.is(message.floatMinvalue, 0))
                writer.uint32(/* id 44, wireType 5 =*/357).float(message.floatMinvalue);
            if (message.doubleMinvalue != null && $Object.hasOwnProperty.call(message, "doubleMinvalue") && !$Object.is(message.doubleMinvalue, 0))
                writer.uint32(/* id 45, wireType 1 =*/361).double(message.doubleMinvalue);
            if (message.unit != null && $Object.hasOwnProperty.call(message, "unit") && message.unit !== "")
                writer.uint32(/* id 50, wireType 2 =*/402).string(message.unit);
            if (message.fixedSource != null && message.fixedSource.length)
                for (let i = 0; i < message.fixedSource.length; ++i)
                    writer.uint32(/* id 51, wireType 2 =*/410).string(message.fixedSource[i]);
            if (message.copyEnable != null && $Object.hasOwnProperty.call(message, "copyEnable") && message.copyEnable !== false)
                writer.uint32(/* id 52, wireType 0 =*/416).bool(message.copyEnable);
            if (message.option != null && $Object.hasOwnProperty.call(message, "option") && message.option !== 0)
                writer.uint32(/* id 53, wireType 0 =*/424).int32(message.option);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Attribute message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Attribute.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Message_Attribute
         * @static
         * @param {MODEL_ABI.Message_Attribute.$Properties} message Message_Attribute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Attribute.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Attribute message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Message_Attribute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Attribute & MODEL_ABI.Message_Attribute.$Shape} Message_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Attribute.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Message_Attribute(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.tips = value;
                        else
                            delete message.tips;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.maxCount = value;
                        else
                            delete message.maxCount;
                        continue;
                    }
                case 5: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.type = value;
                        else
                            delete message.type;
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.stringValue = value;
                        else
                            delete message.stringValue;
                        continue;
                    }
                case 11: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolValue = value;
                        else
                            delete message.boolValue;
                        continue;
                    }
                case 12: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.int32Value = value;
                        else
                            delete message.int32Value;
                        continue;
                    }
                case 13: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.uint32Value = value;
                        else
                            delete message.uint32Value;
                        continue;
                    }
                case 14: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                            message.int64Value = value;
                        else
                            delete message.int64Value;
                        continue;
                    }
                case 15: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.uint64Value = value;
                        else
                            delete message.uint64Value;
                        continue;
                    }
                case 16: {
                        if (wireType !== 5)
                            break;
                        if (!$Object.is(value = reader.float(), 0))
                            message.floatValue = value;
                        else
                            delete message.floatValue;
                        continue;
                    }
                case 17: {
                        if (wireType !== 1)
                            break;
                        if (!$Object.is(value = reader.double(), 0))
                            message.doubleValue = value;
                        else
                            delete message.doubleValue;
                        continue;
                    }
                case 18: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.bytesValue = value;
                        else
                            delete message.bytesValue;
                        continue;
                    }
                case 19: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.stringFix = value;
                        else
                            delete message.stringFix;
                        continue;
                    }
                case 20: {
                        if (wireType !== 2)
                            break;
                        message.comboType = $root.MODEL_ABI.Message_Combox_Type.decode(reader, reader.uint32(), $undefined, _depth + 1, message.comboType);
                        continue;
                    }
                case 30: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.int32Maxvalue = value;
                        else
                            delete message.int32Maxvalue;
                        continue;
                    }
                case 31: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.uint32Maxvalue = value;
                        else
                            delete message.uint32Maxvalue;
                        continue;
                    }
                case 32: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                            message.int64Maxvalue = value;
                        else
                            delete message.int64Maxvalue;
                        continue;
                    }
                case 33: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.uint64Maxvalue = value;
                        else
                            delete message.uint64Maxvalue;
                        continue;
                    }
                case 34: {
                        if (wireType !== 5)
                            break;
                        if (!$Object.is(value = reader.float(), 0))
                            message.floatMaxvalue = value;
                        else
                            delete message.floatMaxvalue;
                        continue;
                    }
                case 35: {
                        if (wireType !== 1)
                            break;
                        if (!$Object.is(value = reader.double(), 0))
                            message.doubleMaxvalue = value;
                        else
                            delete message.doubleMaxvalue;
                        continue;
                    }
                case 40: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.int32Minvalue = value;
                        else
                            delete message.int32Minvalue;
                        continue;
                    }
                case 41: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.uint32Minvalue = value;
                        else
                            delete message.uint32Minvalue;
                        continue;
                    }
                case 42: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                            message.int64Minvalue = value;
                        else
                            delete message.int64Minvalue;
                        continue;
                    }
                case 43: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.uint64Minvalue = value;
                        else
                            delete message.uint64Minvalue;
                        continue;
                    }
                case 44: {
                        if (wireType !== 5)
                            break;
                        if (!$Object.is(value = reader.float(), 0))
                            message.floatMinvalue = value;
                        else
                            delete message.floatMinvalue;
                        continue;
                    }
                case 45: {
                        if (wireType !== 1)
                            break;
                        if (!$Object.is(value = reader.double(), 0))
                            message.doubleMinvalue = value;
                        else
                            delete message.doubleMinvalue;
                        continue;
                    }
                case 50: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.unit = value;
                        else
                            delete message.unit;
                        continue;
                    }
                case 51: {
                        if (wireType !== 2)
                            break;
                        if (!(message.fixedSource && message.fixedSource.length))
                            message.fixedSource = [];
                        message.fixedSource.push(reader.stringVerify());
                        continue;
                    }
                case 52: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.copyEnable = value;
                        else
                            delete message.copyEnable;
                        continue;
                    }
                case 53: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.option = value;
                        else
                            delete message.option;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Attribute message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Message_Attribute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Attribute & MODEL_ABI.Message_Attribute.$Shape} Message_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Attribute.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Attribute message.
         * @function verify
         * @memberof MODEL_ABI.Message_Attribute
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Attribute.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.tips != null && $Object.hasOwnProperty.call(message, "tips"))
                if (!$util.isString(message.tips))
                    return "tips: string expected";
            if (message.maxCount != null && $Object.hasOwnProperty.call(message, "maxCount"))
                if (!$util.isInteger(message.maxCount))
                    return "maxCount: integer expected";
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                if (typeof message.type !== "number" || (message.type | 0) !== message.type)
                    return "type: enum value expected";
            if (message.stringValue != null && $Object.hasOwnProperty.call(message, "stringValue"))
                if (!$util.isString(message.stringValue))
                    return "stringValue: string expected";
            if (message.boolValue != null && $Object.hasOwnProperty.call(message, "boolValue"))
                if (typeof message.boolValue !== "boolean")
                    return "boolValue: boolean expected";
            if (message.int32Value != null && $Object.hasOwnProperty.call(message, "int32Value"))
                if (!$util.isInteger(message.int32Value))
                    return "int32Value: integer expected";
            if (message.uint32Value != null && $Object.hasOwnProperty.call(message, "uint32Value"))
                if (!$util.isInteger(message.uint32Value))
                    return "uint32Value: integer expected";
            if (message.int64Value != null && $Object.hasOwnProperty.call(message, "int64Value"))
                if (!$util.isInteger(message.int64Value) && !(message.int64Value && $util.isInteger(message.int64Value.low) && $util.isInteger(message.int64Value.high)))
                    return "int64Value: integer|Long expected";
            if (message.uint64Value != null && $Object.hasOwnProperty.call(message, "uint64Value"))
                if (!$util.isInteger(message.uint64Value) && !(message.uint64Value && $util.isInteger(message.uint64Value.low) && $util.isInteger(message.uint64Value.high)))
                    return "uint64Value: integer|Long expected";
            if (message.floatValue != null && $Object.hasOwnProperty.call(message, "floatValue"))
                if (typeof message.floatValue !== "number")
                    return "floatValue: number expected";
            if (message.doubleValue != null && $Object.hasOwnProperty.call(message, "doubleValue"))
                if (typeof message.doubleValue !== "number")
                    return "doubleValue: number expected";
            if (message.bytesValue != null && $Object.hasOwnProperty.call(message, "bytesValue"))
                if (!(message.bytesValue && typeof message.bytesValue.length === "number" || $util.isString(message.bytesValue)))
                    return "bytesValue: buffer expected";
            if (message.stringFix != null && $Object.hasOwnProperty.call(message, "stringFix"))
                if (!$util.isString(message.stringFix))
                    return "stringFix: string expected";
            if (message.comboType != null && $Object.hasOwnProperty.call(message, "comboType")) {
                let error = $root.MODEL_ABI.Message_Combox_Type.verify(message.comboType, _depth + 1);
                if (error)
                    return "comboType." + error;
            }
            if (message.int32Maxvalue != null && $Object.hasOwnProperty.call(message, "int32Maxvalue"))
                if (!$util.isInteger(message.int32Maxvalue))
                    return "int32Maxvalue: integer expected";
            if (message.uint32Maxvalue != null && $Object.hasOwnProperty.call(message, "uint32Maxvalue"))
                if (!$util.isInteger(message.uint32Maxvalue))
                    return "uint32Maxvalue: integer expected";
            if (message.int64Maxvalue != null && $Object.hasOwnProperty.call(message, "int64Maxvalue"))
                if (!$util.isInteger(message.int64Maxvalue) && !(message.int64Maxvalue && $util.isInteger(message.int64Maxvalue.low) && $util.isInteger(message.int64Maxvalue.high)))
                    return "int64Maxvalue: integer|Long expected";
            if (message.uint64Maxvalue != null && $Object.hasOwnProperty.call(message, "uint64Maxvalue"))
                if (!$util.isInteger(message.uint64Maxvalue) && !(message.uint64Maxvalue && $util.isInteger(message.uint64Maxvalue.low) && $util.isInteger(message.uint64Maxvalue.high)))
                    return "uint64Maxvalue: integer|Long expected";
            if (message.floatMaxvalue != null && $Object.hasOwnProperty.call(message, "floatMaxvalue"))
                if (typeof message.floatMaxvalue !== "number")
                    return "floatMaxvalue: number expected";
            if (message.doubleMaxvalue != null && $Object.hasOwnProperty.call(message, "doubleMaxvalue"))
                if (typeof message.doubleMaxvalue !== "number")
                    return "doubleMaxvalue: number expected";
            if (message.int32Minvalue != null && $Object.hasOwnProperty.call(message, "int32Minvalue"))
                if (!$util.isInteger(message.int32Minvalue))
                    return "int32Minvalue: integer expected";
            if (message.uint32Minvalue != null && $Object.hasOwnProperty.call(message, "uint32Minvalue"))
                if (!$util.isInteger(message.uint32Minvalue))
                    return "uint32Minvalue: integer expected";
            if (message.int64Minvalue != null && $Object.hasOwnProperty.call(message, "int64Minvalue"))
                if (!$util.isInteger(message.int64Minvalue) && !(message.int64Minvalue && $util.isInteger(message.int64Minvalue.low) && $util.isInteger(message.int64Minvalue.high)))
                    return "int64Minvalue: integer|Long expected";
            if (message.uint64Minvalue != null && $Object.hasOwnProperty.call(message, "uint64Minvalue"))
                if (!$util.isInteger(message.uint64Minvalue) && !(message.uint64Minvalue && $util.isInteger(message.uint64Minvalue.low) && $util.isInteger(message.uint64Minvalue.high)))
                    return "uint64Minvalue: integer|Long expected";
            if (message.floatMinvalue != null && $Object.hasOwnProperty.call(message, "floatMinvalue"))
                if (typeof message.floatMinvalue !== "number")
                    return "floatMinvalue: number expected";
            if (message.doubleMinvalue != null && $Object.hasOwnProperty.call(message, "doubleMinvalue"))
                if (typeof message.doubleMinvalue !== "number")
                    return "doubleMinvalue: number expected";
            if (message.unit != null && $Object.hasOwnProperty.call(message, "unit"))
                if (!$util.isString(message.unit))
                    return "unit: string expected";
            if (message.fixedSource != null && $Object.hasOwnProperty.call(message, "fixedSource")) {
                if (!$Array.isArray(message.fixedSource))
                    return "fixedSource: array expected";
                for (let i = 0; i < message.fixedSource.length; ++i)
                    if (!$util.isString(message.fixedSource[i]))
                        return "fixedSource: string[] expected";
            }
            if (message.copyEnable != null && $Object.hasOwnProperty.call(message, "copyEnable"))
                if (typeof message.copyEnable !== "boolean")
                    return "copyEnable: boolean expected";
            if (message.option != null && $Object.hasOwnProperty.call(message, "option"))
                if (typeof message.option !== "number" || (message.option | 0) !== message.option)
                    return "option: enum value expected";
            return null;
        };

        /**
         * Creates a Message_Attribute message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Message_Attribute
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Message_Attribute} Message_Attribute
         */
        Message_Attribute.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Message_Attribute)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Message_Attribute: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Message_Attribute();
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.tips != null)
                if (typeof object.tips !== "string" || object.tips.length)
                    message.tips = $String(object.tips);
            if (object.maxCount != null)
                if ($Number(object.maxCount) !== 0)
                    message.maxCount = object.maxCount | 0;
            if (object.type !== 0 && (typeof object.type !== "string" || $root.MODEL_ABI.MESSAGE_ATTRIBUTE_TYPE[object.type] !== 0))
                switch (object.type) {
                case "BYTES_E":
                case 0:
                    message.type = 0;
                    break;
                case "STRING_E":
                case 1:
                    message.type = 1;
                    break;
                case "IP_E":
                case 3:
                    message.type = 3;
                    break;
                case "BOOL_E":
                case 4:
                    message.type = 4;
                    break;
                case "INT32_E":
                case 5:
                    message.type = 5;
                    break;
                case "UINT32_E":
                case 6:
                    message.type = 6;
                    break;
                case "INT64_E":
                case 7:
                    message.type = 7;
                    break;
                case "UINT64_E":
                case 8:
                    message.type = 8;
                    break;
                case "FLOAT_E":
                case 9:
                    message.type = 9;
                    break;
                case "DOUBLE_E":
                case 10:
                    message.type = 10;
                    break;
                case "FIXED_E":
                case 11:
                    message.type = 11;
                    break;
                case "DATA_COMBOX_E":
                case 12:
                    message.type = 12;
                    break;
                default:
                    if (typeof object.type === "number" && (object.type | 0) === object.type)
                        message.type = object.type;
                }
            if (object.stringValue != null)
                if (typeof object.stringValue !== "string" || object.stringValue.length)
                    message.stringValue = $String(object.stringValue);
            if (object.boolValue != null)
                if (object.boolValue)
                    message.boolValue = $Boolean(object.boolValue);
            if (object.int32Value != null)
                if ($Number(object.int32Value) !== 0)
                    message.int32Value = object.int32Value | 0;
            if (object.uint32Value != null)
                if ($Number(object.uint32Value) !== 0)
                    message.uint32Value = object.uint32Value >>> 0;
            if (object.int64Value != null)
                if (typeof object.int64Value === "object" ? object.int64Value.low || object.int64Value.high : $Number(object.int64Value) !== 0)
                    if ($util.Long)
                        message.int64Value = $util.Long.fromValue(object.int64Value, false);
                    else if (typeof object.int64Value === "string")
                        message.int64Value = $parseInt(object.int64Value, 10);
                    else if (typeof object.int64Value === "number")
                        message.int64Value = object.int64Value;
                    else if (typeof object.int64Value === "object")
                        message.int64Value = new $util.LongBits(object.int64Value.low >>> 0, object.int64Value.high >>> 0).toNumber();
            if (object.uint64Value != null)
                if (typeof object.uint64Value === "object" ? object.uint64Value.low || object.uint64Value.high : $Number(object.uint64Value) !== 0)
                    if ($util.Long)
                        message.uint64Value = $util.Long.fromValue(object.uint64Value, true);
                    else if (typeof object.uint64Value === "string")
                        message.uint64Value = $parseInt(object.uint64Value, 10);
                    else if (typeof object.uint64Value === "number")
                        message.uint64Value = object.uint64Value;
                    else if (typeof object.uint64Value === "object")
                        message.uint64Value = new $util.LongBits(object.uint64Value.low >>> 0, object.uint64Value.high >>> 0).toNumber(true);
            if (object.floatValue != null)
                if (!$Object.is($Number(object.floatValue), 0))
                    message.floatValue = $Number(object.floatValue);
            if (object.doubleValue != null)
                if (!$Object.is($Number(object.doubleValue), 0))
                    message.doubleValue = $Number(object.doubleValue);
            if (object.bytesValue != null)
                if (object.bytesValue.length)
                    if (typeof object.bytesValue === "string")
                        $util.base64.decode(object.bytesValue, message.bytesValue = $util.newBuffer($util.base64.length(object.bytesValue)), 0);
                    else if (object.bytesValue.length >= 0)
                        message.bytesValue = object.bytesValue;
            if (object.stringFix != null)
                if (typeof object.stringFix !== "string" || object.stringFix.length)
                    message.stringFix = $String(object.stringFix);
            if (object.comboType != null) {
                if (!$util.isObject(object.comboType))
                    throw $TypeError(".MODEL_ABI.Message_Attribute.comboType: object expected");
                message.comboType = $root.MODEL_ABI.Message_Combox_Type.fromObject(object.comboType, _depth + 1);
            }
            if (object.int32Maxvalue != null)
                if ($Number(object.int32Maxvalue) !== 0)
                    message.int32Maxvalue = object.int32Maxvalue | 0;
            if (object.uint32Maxvalue != null)
                if ($Number(object.uint32Maxvalue) !== 0)
                    message.uint32Maxvalue = object.uint32Maxvalue >>> 0;
            if (object.int64Maxvalue != null)
                if (typeof object.int64Maxvalue === "object" ? object.int64Maxvalue.low || object.int64Maxvalue.high : $Number(object.int64Maxvalue) !== 0)
                    if ($util.Long)
                        message.int64Maxvalue = $util.Long.fromValue(object.int64Maxvalue, false);
                    else if (typeof object.int64Maxvalue === "string")
                        message.int64Maxvalue = $parseInt(object.int64Maxvalue, 10);
                    else if (typeof object.int64Maxvalue === "number")
                        message.int64Maxvalue = object.int64Maxvalue;
                    else if (typeof object.int64Maxvalue === "object")
                        message.int64Maxvalue = new $util.LongBits(object.int64Maxvalue.low >>> 0, object.int64Maxvalue.high >>> 0).toNumber();
            if (object.uint64Maxvalue != null)
                if (typeof object.uint64Maxvalue === "object" ? object.uint64Maxvalue.low || object.uint64Maxvalue.high : $Number(object.uint64Maxvalue) !== 0)
                    if ($util.Long)
                        message.uint64Maxvalue = $util.Long.fromValue(object.uint64Maxvalue, true);
                    else if (typeof object.uint64Maxvalue === "string")
                        message.uint64Maxvalue = $parseInt(object.uint64Maxvalue, 10);
                    else if (typeof object.uint64Maxvalue === "number")
                        message.uint64Maxvalue = object.uint64Maxvalue;
                    else if (typeof object.uint64Maxvalue === "object")
                        message.uint64Maxvalue = new $util.LongBits(object.uint64Maxvalue.low >>> 0, object.uint64Maxvalue.high >>> 0).toNumber(true);
            if (object.floatMaxvalue != null)
                if (!$Object.is($Number(object.floatMaxvalue), 0))
                    message.floatMaxvalue = $Number(object.floatMaxvalue);
            if (object.doubleMaxvalue != null)
                if (!$Object.is($Number(object.doubleMaxvalue), 0))
                    message.doubleMaxvalue = $Number(object.doubleMaxvalue);
            if (object.int32Minvalue != null)
                if ($Number(object.int32Minvalue) !== 0)
                    message.int32Minvalue = object.int32Minvalue | 0;
            if (object.uint32Minvalue != null)
                if ($Number(object.uint32Minvalue) !== 0)
                    message.uint32Minvalue = object.uint32Minvalue >>> 0;
            if (object.int64Minvalue != null)
                if (typeof object.int64Minvalue === "object" ? object.int64Minvalue.low || object.int64Minvalue.high : $Number(object.int64Minvalue) !== 0)
                    if ($util.Long)
                        message.int64Minvalue = $util.Long.fromValue(object.int64Minvalue, false);
                    else if (typeof object.int64Minvalue === "string")
                        message.int64Minvalue = $parseInt(object.int64Minvalue, 10);
                    else if (typeof object.int64Minvalue === "number")
                        message.int64Minvalue = object.int64Minvalue;
                    else if (typeof object.int64Minvalue === "object")
                        message.int64Minvalue = new $util.LongBits(object.int64Minvalue.low >>> 0, object.int64Minvalue.high >>> 0).toNumber();
            if (object.uint64Minvalue != null)
                if (typeof object.uint64Minvalue === "object" ? object.uint64Minvalue.low || object.uint64Minvalue.high : $Number(object.uint64Minvalue) !== 0)
                    if ($util.Long)
                        message.uint64Minvalue = $util.Long.fromValue(object.uint64Minvalue, true);
                    else if (typeof object.uint64Minvalue === "string")
                        message.uint64Minvalue = $parseInt(object.uint64Minvalue, 10);
                    else if (typeof object.uint64Minvalue === "number")
                        message.uint64Minvalue = object.uint64Minvalue;
                    else if (typeof object.uint64Minvalue === "object")
                        message.uint64Minvalue = new $util.LongBits(object.uint64Minvalue.low >>> 0, object.uint64Minvalue.high >>> 0).toNumber(true);
            if (object.floatMinvalue != null)
                if (!$Object.is($Number(object.floatMinvalue), 0))
                    message.floatMinvalue = $Number(object.floatMinvalue);
            if (object.doubleMinvalue != null)
                if (!$Object.is($Number(object.doubleMinvalue), 0))
                    message.doubleMinvalue = $Number(object.doubleMinvalue);
            if (object.unit != null)
                if (typeof object.unit !== "string" || object.unit.length)
                    message.unit = $String(object.unit);
            if (object.fixedSource) {
                if (!$Array.isArray(object.fixedSource))
                    throw $TypeError(".MODEL_ABI.Message_Attribute.fixedSource: array expected");
                message.fixedSource = $Array(object.fixedSource.length);
                for (let i = 0; i < object.fixedSource.length; ++i)
                    message.fixedSource[i] = $String(object.fixedSource[i]);
            }
            if (object.copyEnable != null)
                if (object.copyEnable)
                    message.copyEnable = $Boolean(object.copyEnable);
            if (object.option !== 0 && (typeof object.option !== "string" || $root.MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION[object.option] !== 0))
                switch (object.option) {
                case "REQUIRED_E":
                case 0:
                    message.option = 0;
                    break;
                case "OPTIONAL_E":
                case 1:
                    message.option = 1;
                    break;
                default:
                    if (typeof object.option === "number" && (object.option | 0) === object.option)
                        message.option = object.option;
                }
            return message;
        };

        /**
         * Creates a plain object from a Message_Attribute message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Message_Attribute
         * @static
         * @param {MODEL_ABI.Message_Attribute} message Message_Attribute
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Attribute.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.fixedSource = [];
            if (options.defaults) {
                object.key = "";
                object.desc = "";
                object.tips = "";
                object.maxCount = 0;
                object.type = options.enums === $String ? "BYTES_E" : 0;
                object.stringValue = "";
                object.boolValue = false;
                object.int32Value = 0;
                object.uint32Value = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.int64Value = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.int64Value = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.uint64Value = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.uint64Value = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                object.floatValue = 0;
                object.doubleValue = 0;
                if (options.bytes === $String)
                    object.bytesValue = "";
                else {
                    object.bytesValue = [];
                    if (options.bytes !== $Array)
                        object.bytesValue = $util.newBuffer(object.bytesValue);
                }
                object.stringFix = "";
                object.comboType = null;
                object.int32Maxvalue = 0;
                object.uint32Maxvalue = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.int64Maxvalue = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.int64Maxvalue = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.uint64Maxvalue = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.uint64Maxvalue = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                object.floatMaxvalue = 0;
                object.doubleMaxvalue = 0;
                object.int32Minvalue = 0;
                object.uint32Minvalue = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.int64Minvalue = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.int64Minvalue = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.uint64Minvalue = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.uint64Minvalue = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                object.floatMinvalue = 0;
                object.doubleMinvalue = 0;
                object.unit = "";
                object.copyEnable = false;
                object.option = options.enums === $String ? "REQUIRED_E" : 0;
            }
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.tips != null && $Object.hasOwnProperty.call(message, "tips"))
                object.tips = message.tips;
            if (message.maxCount != null && $Object.hasOwnProperty.call(message, "maxCount"))
                object.maxCount = message.maxCount;
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                object.type = options.enums === $String ? $root.MODEL_ABI.MESSAGE_ATTRIBUTE_TYPE[message.type] === $undefined ? message.type : $root.MODEL_ABI.MESSAGE_ATTRIBUTE_TYPE[message.type] : message.type;
            if (message.stringValue != null && $Object.hasOwnProperty.call(message, "stringValue"))
                object.stringValue = message.stringValue;
            if (message.boolValue != null && $Object.hasOwnProperty.call(message, "boolValue"))
                object.boolValue = message.boolValue;
            if (message.int32Value != null && $Object.hasOwnProperty.call(message, "int32Value"))
                object.int32Value = message.int32Value;
            if (message.uint32Value != null && $Object.hasOwnProperty.call(message, "uint32Value"))
                object.uint32Value = message.uint32Value;
            if (message.int64Value != null && $Object.hasOwnProperty.call(message, "int64Value"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.int64Value = typeof message.int64Value === "number" ? $BigInt(message.int64Value) : $util.Long.fromBits(message.int64Value.low >>> 0, message.int64Value.high >>> 0, false).toBigInt();
                else if (typeof message.int64Value === "number")
                    object.int64Value = options.longs === $String ? $String(message.int64Value) : message.int64Value;
                else
                    object.int64Value = options.longs === $String ? $util.Long.prototype.toString.call(message.int64Value) : options.longs === $Number ? new $util.LongBits(message.int64Value.low >>> 0, message.int64Value.high >>> 0).toNumber() : message.int64Value;
            if (message.uint64Value != null && $Object.hasOwnProperty.call(message, "uint64Value"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.uint64Value = typeof message.uint64Value === "number" ? $BigInt(message.uint64Value) : $util.Long.fromBits(message.uint64Value.low >>> 0, message.uint64Value.high >>> 0, true).toBigInt();
                else if (typeof message.uint64Value === "number")
                    object.uint64Value = options.longs === $String ? $String(message.uint64Value) : message.uint64Value;
                else
                    object.uint64Value = options.longs === $String ? $util.Long.prototype.toString.call(message.uint64Value) : options.longs === $Number ? new $util.LongBits(message.uint64Value.low >>> 0, message.uint64Value.high >>> 0).toNumber(true) : message.uint64Value;
            if (message.floatValue != null && $Object.hasOwnProperty.call(message, "floatValue"))
                object.floatValue = options.json && !$isFinite(message.floatValue) ? $String(message.floatValue) : message.floatValue;
            if (message.doubleValue != null && $Object.hasOwnProperty.call(message, "doubleValue"))
                object.doubleValue = options.json && !$isFinite(message.doubleValue) ? $String(message.doubleValue) : message.doubleValue;
            if (message.bytesValue != null && $Object.hasOwnProperty.call(message, "bytesValue"))
                object.bytesValue = options.bytes === $String ? $util.base64.encode(message.bytesValue, 0, message.bytesValue.length) : options.bytes === $Array ? $Array.prototype.slice.call(message.bytesValue) : message.bytesValue;
            if (message.stringFix != null && $Object.hasOwnProperty.call(message, "stringFix"))
                object.stringFix = message.stringFix;
            if (message.comboType != null && $Object.hasOwnProperty.call(message, "comboType"))
                object.comboType = $root.MODEL_ABI.Message_Combox_Type.toObject(message.comboType, options, _depth + 1);
            if (message.int32Maxvalue != null && $Object.hasOwnProperty.call(message, "int32Maxvalue"))
                object.int32Maxvalue = message.int32Maxvalue;
            if (message.uint32Maxvalue != null && $Object.hasOwnProperty.call(message, "uint32Maxvalue"))
                object.uint32Maxvalue = message.uint32Maxvalue;
            if (message.int64Maxvalue != null && $Object.hasOwnProperty.call(message, "int64Maxvalue"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.int64Maxvalue = typeof message.int64Maxvalue === "number" ? $BigInt(message.int64Maxvalue) : $util.Long.fromBits(message.int64Maxvalue.low >>> 0, message.int64Maxvalue.high >>> 0, false).toBigInt();
                else if (typeof message.int64Maxvalue === "number")
                    object.int64Maxvalue = options.longs === $String ? $String(message.int64Maxvalue) : message.int64Maxvalue;
                else
                    object.int64Maxvalue = options.longs === $String ? $util.Long.prototype.toString.call(message.int64Maxvalue) : options.longs === $Number ? new $util.LongBits(message.int64Maxvalue.low >>> 0, message.int64Maxvalue.high >>> 0).toNumber() : message.int64Maxvalue;
            if (message.uint64Maxvalue != null && $Object.hasOwnProperty.call(message, "uint64Maxvalue"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.uint64Maxvalue = typeof message.uint64Maxvalue === "number" ? $BigInt(message.uint64Maxvalue) : $util.Long.fromBits(message.uint64Maxvalue.low >>> 0, message.uint64Maxvalue.high >>> 0, true).toBigInt();
                else if (typeof message.uint64Maxvalue === "number")
                    object.uint64Maxvalue = options.longs === $String ? $String(message.uint64Maxvalue) : message.uint64Maxvalue;
                else
                    object.uint64Maxvalue = options.longs === $String ? $util.Long.prototype.toString.call(message.uint64Maxvalue) : options.longs === $Number ? new $util.LongBits(message.uint64Maxvalue.low >>> 0, message.uint64Maxvalue.high >>> 0).toNumber(true) : message.uint64Maxvalue;
            if (message.floatMaxvalue != null && $Object.hasOwnProperty.call(message, "floatMaxvalue"))
                object.floatMaxvalue = options.json && !$isFinite(message.floatMaxvalue) ? $String(message.floatMaxvalue) : message.floatMaxvalue;
            if (message.doubleMaxvalue != null && $Object.hasOwnProperty.call(message, "doubleMaxvalue"))
                object.doubleMaxvalue = options.json && !$isFinite(message.doubleMaxvalue) ? $String(message.doubleMaxvalue) : message.doubleMaxvalue;
            if (message.int32Minvalue != null && $Object.hasOwnProperty.call(message, "int32Minvalue"))
                object.int32Minvalue = message.int32Minvalue;
            if (message.uint32Minvalue != null && $Object.hasOwnProperty.call(message, "uint32Minvalue"))
                object.uint32Minvalue = message.uint32Minvalue;
            if (message.int64Minvalue != null && $Object.hasOwnProperty.call(message, "int64Minvalue"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.int64Minvalue = typeof message.int64Minvalue === "number" ? $BigInt(message.int64Minvalue) : $util.Long.fromBits(message.int64Minvalue.low >>> 0, message.int64Minvalue.high >>> 0, false).toBigInt();
                else if (typeof message.int64Minvalue === "number")
                    object.int64Minvalue = options.longs === $String ? $String(message.int64Minvalue) : message.int64Minvalue;
                else
                    object.int64Minvalue = options.longs === $String ? $util.Long.prototype.toString.call(message.int64Minvalue) : options.longs === $Number ? new $util.LongBits(message.int64Minvalue.low >>> 0, message.int64Minvalue.high >>> 0).toNumber() : message.int64Minvalue;
            if (message.uint64Minvalue != null && $Object.hasOwnProperty.call(message, "uint64Minvalue"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.uint64Minvalue = typeof message.uint64Minvalue === "number" ? $BigInt(message.uint64Minvalue) : $util.Long.fromBits(message.uint64Minvalue.low >>> 0, message.uint64Minvalue.high >>> 0, true).toBigInt();
                else if (typeof message.uint64Minvalue === "number")
                    object.uint64Minvalue = options.longs === $String ? $String(message.uint64Minvalue) : message.uint64Minvalue;
                else
                    object.uint64Minvalue = options.longs === $String ? $util.Long.prototype.toString.call(message.uint64Minvalue) : options.longs === $Number ? new $util.LongBits(message.uint64Minvalue.low >>> 0, message.uint64Minvalue.high >>> 0).toNumber(true) : message.uint64Minvalue;
            if (message.floatMinvalue != null && $Object.hasOwnProperty.call(message, "floatMinvalue"))
                object.floatMinvalue = options.json && !$isFinite(message.floatMinvalue) ? $String(message.floatMinvalue) : message.floatMinvalue;
            if (message.doubleMinvalue != null && $Object.hasOwnProperty.call(message, "doubleMinvalue"))
                object.doubleMinvalue = options.json && !$isFinite(message.doubleMinvalue) ? $String(message.doubleMinvalue) : message.doubleMinvalue;
            if (message.unit != null && $Object.hasOwnProperty.call(message, "unit"))
                object.unit = message.unit;
            if (message.fixedSource && message.fixedSource.length) {
                object.fixedSource = $Array(message.fixedSource.length);
                for (let j = 0; j < message.fixedSource.length; ++j)
                    object.fixedSource[j] = message.fixedSource[j];
            }
            if (message.copyEnable != null && $Object.hasOwnProperty.call(message, "copyEnable"))
                object.copyEnable = message.copyEnable;
            if (message.option != null && $Object.hasOwnProperty.call(message, "option"))
                object.option = options.enums === $String ? $root.MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION[message.option] === $undefined ? message.option : $root.MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION[message.option] : message.option;
            return object;
        };

        /**
         * Converts this Message_Attribute to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Message_Attribute
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Attribute.prototype.toJSON = function() {
            return Message_Attribute.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Attribute
         * @function getTypeUrl
         * @memberof MODEL_ABI.Message_Attribute
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Attribute.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Message_Attribute";
        };

        return Message_Attribute;
    })();

    MODEL_ABI.Message_Custom_Combox_Element = (function() {

        /**
         * Properties of a Message_Custom_Combox_Element.
         * @typedef {Object} MODEL_ABI.Message_Custom_Combox_Element.$Properties
         * @property {string|null} [key] Message_Custom_Combox_Element key
         * @property {string|null} [desc] Message_Custom_Combox_Element desc
         * @property {Array.<MODEL_ABI.Message_ArrayAttr.$Properties>|null} [arrayAttr] Message_Custom_Combox_Element arrayAttr
         * @property {Array.<MODEL_ABI.Message_ComboAttr.$Properties>|null} [comboxAttr] Message_Custom_Combox_Element comboxAttr
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Custom_Combox_Element.
         * @memberof MODEL_ABI
         * @interface IMessage_Custom_Combox_Element
         * @augments MODEL_ABI.Message_Custom_Combox_Element.$Properties
         * @deprecated Use MODEL_ABI.Message_Custom_Combox_Element.$Properties instead.
         */

        /**
         * Shape of a Message_Custom_Combox_Element.
         * @typedef {MODEL_ABI.Message_Custom_Combox_Element.$Properties} MODEL_ABI.Message_Custom_Combox_Element.$Shape
         */

        /**
         * Constructs a new Message_Custom_Combox_Element.
         * @memberof MODEL_ABI
         * @classdesc Represents a Message_Custom_Combox_Element.
         * @constructor
         * @param {MODEL_ABI.Message_Custom_Combox_Element.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Custom_Combox_Element = function (properties) {
            this.arrayAttr = [];
            this.comboxAttr = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Custom_Combox_Element key.
         * @member {string} key
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @instance
         */
        Message_Custom_Combox_Element.prototype.key = "";

        /**
         * Message_Custom_Combox_Element desc.
         * @member {string} desc
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @instance
         */
        Message_Custom_Combox_Element.prototype.desc = "";

        /**
         * Message_Custom_Combox_Element arrayAttr.
         * @member {Array.<MODEL_ABI.Message_ArrayAttr.$Properties>} arrayAttr
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @instance
         */
        Message_Custom_Combox_Element.prototype.arrayAttr = $util.emptyArray;

        /**
         * Message_Custom_Combox_Element comboxAttr.
         * @member {Array.<MODEL_ABI.Message_ComboAttr.$Properties>} comboxAttr
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @instance
         */
        Message_Custom_Combox_Element.prototype.comboxAttr = $util.emptyArray;

        /**
         * Creates a new Message_Custom_Combox_Element instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @static
         * @param {MODEL_ABI.Message_Custom_Combox_Element.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Message_Custom_Combox_Element} Message_Custom_Combox_Element instance
         * @type {{
         *   (properties: MODEL_ABI.Message_Custom_Combox_Element.$Shape): MODEL_ABI.Message_Custom_Combox_Element & MODEL_ABI.Message_Custom_Combox_Element.$Shape;
         *   (properties?: MODEL_ABI.Message_Custom_Combox_Element.$Properties): MODEL_ABI.Message_Custom_Combox_Element;
         * }}
         */
        Message_Custom_Combox_Element.create = function(properties) {
            return new Message_Custom_Combox_Element(properties);
        };

        /**
         * Encodes the specified Message_Custom_Combox_Element message. Does not implicitly {@link MODEL_ABI.Message_Custom_Combox_Element.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @static
         * @param {MODEL_ABI.Message_Custom_Combox_Element.$Properties} message Message_Custom_Combox_Element message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Custom_Combox_Element.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.desc);
            if (message.arrayAttr != null && message.arrayAttr.length)
                for (let i = 0; i < message.arrayAttr.length; ++i)
                    $root.MODEL_ABI.Message_ArrayAttr.encode(message.arrayAttr[i], writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
            if (message.comboxAttr != null && message.comboxAttr.length)
                for (let i = 0; i < message.comboxAttr.length; ++i)
                    $root.MODEL_ABI.Message_ComboAttr.encode(message.comboxAttr[i], writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Custom_Combox_Element message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Custom_Combox_Element.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @static
         * @param {MODEL_ABI.Message_Custom_Combox_Element.$Properties} message Message_Custom_Combox_Element message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Custom_Combox_Element.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Custom_Combox_Element message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Custom_Combox_Element & MODEL_ABI.Message_Custom_Combox_Element.$Shape} Message_Custom_Combox_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Custom_Combox_Element.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Message_Custom_Combox_Element(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        if (!(message.arrayAttr && message.arrayAttr.length))
                            message.arrayAttr = [];
                        message.arrayAttr.push($root.MODEL_ABI.Message_ArrayAttr.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        if (!(message.comboxAttr && message.comboxAttr.length))
                            message.comboxAttr = [];
                        message.comboxAttr.push($root.MODEL_ABI.Message_ComboAttr.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Custom_Combox_Element message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Custom_Combox_Element & MODEL_ABI.Message_Custom_Combox_Element.$Shape} Message_Custom_Combox_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Custom_Combox_Element.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Custom_Combox_Element message.
         * @function verify
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Custom_Combox_Element.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.arrayAttr != null && $Object.hasOwnProperty.call(message, "arrayAttr")) {
                if (!$Array.isArray(message.arrayAttr))
                    return "arrayAttr: array expected";
                for (let i = 0; i < message.arrayAttr.length; ++i) {
                    let error = $root.MODEL_ABI.Message_ArrayAttr.verify(message.arrayAttr[i], _depth + 1);
                    if (error)
                        return "arrayAttr." + error;
                }
            }
            if (message.comboxAttr != null && $Object.hasOwnProperty.call(message, "comboxAttr")) {
                if (!$Array.isArray(message.comboxAttr))
                    return "comboxAttr: array expected";
                for (let i = 0; i < message.comboxAttr.length; ++i) {
                    let error = $root.MODEL_ABI.Message_ComboAttr.verify(message.comboxAttr[i], _depth + 1);
                    if (error)
                        return "comboxAttr." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Message_Custom_Combox_Element message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Message_Custom_Combox_Element} Message_Custom_Combox_Element
         */
        Message_Custom_Combox_Element.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Message_Custom_Combox_Element)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Message_Custom_Combox_Element: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Message_Custom_Combox_Element();
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.arrayAttr) {
                if (!$Array.isArray(object.arrayAttr))
                    throw $TypeError(".MODEL_ABI.Message_Custom_Combox_Element.arrayAttr: array expected");
                message.arrayAttr = $Array(object.arrayAttr.length);
                for (let i = 0; i < object.arrayAttr.length; ++i) {
                    if (!$util.isObject(object.arrayAttr[i]))
                        throw $TypeError(".MODEL_ABI.Message_Custom_Combox_Element.arrayAttr: object expected");
                    message.arrayAttr[i] = $root.MODEL_ABI.Message_ArrayAttr.fromObject(object.arrayAttr[i], _depth + 1);
                }
            }
            if (object.comboxAttr) {
                if (!$Array.isArray(object.comboxAttr))
                    throw $TypeError(".MODEL_ABI.Message_Custom_Combox_Element.comboxAttr: array expected");
                message.comboxAttr = $Array(object.comboxAttr.length);
                for (let i = 0; i < object.comboxAttr.length; ++i) {
                    if (!$util.isObject(object.comboxAttr[i]))
                        throw $TypeError(".MODEL_ABI.Message_Custom_Combox_Element.comboxAttr: object expected");
                    message.comboxAttr[i] = $root.MODEL_ABI.Message_ComboAttr.fromObject(object.comboxAttr[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_Custom_Combox_Element message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @static
         * @param {MODEL_ABI.Message_Custom_Combox_Element} message Message_Custom_Combox_Element
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Custom_Combox_Element.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults) {
                object.arrayAttr = [];
                object.comboxAttr = [];
            }
            if (options.defaults) {
                object.key = "";
                object.desc = "";
            }
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.arrayAttr && message.arrayAttr.length) {
                object.arrayAttr = $Array(message.arrayAttr.length);
                for (let j = 0; j < message.arrayAttr.length; ++j)
                    object.arrayAttr[j] = $root.MODEL_ABI.Message_ArrayAttr.toObject(message.arrayAttr[j], options, _depth + 1);
            }
            if (message.comboxAttr && message.comboxAttr.length) {
                object.comboxAttr = $Array(message.comboxAttr.length);
                for (let j = 0; j < message.comboxAttr.length; ++j)
                    object.comboxAttr[j] = $root.MODEL_ABI.Message_ComboAttr.toObject(message.comboxAttr[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Message_Custom_Combox_Element to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Custom_Combox_Element.prototype.toJSON = function() {
            return Message_Custom_Combox_Element.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Custom_Combox_Element
         * @function getTypeUrl
         * @memberof MODEL_ABI.Message_Custom_Combox_Element
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Custom_Combox_Element.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Message_Custom_Combox_Element";
        };

        return Message_Custom_Combox_Element;
    })();

    MODEL_ABI.Message_Custom_ComboAttr = (function() {

        /**
         * Properties of a Message_Custom_ComboAttr.
         * @typedef {Object} MODEL_ABI.Message_Custom_ComboAttr.$Properties
         * @property {Array.<MODEL_ABI.Message_Custom_Combox_Element.$Properties>|null} [element] Message_Custom_ComboAttr element
         * @property {string|null} [defaultSelect] Message_Custom_ComboAttr defaultSelect
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Custom_ComboAttr.
         * @memberof MODEL_ABI
         * @interface IMessage_Custom_ComboAttr
         * @augments MODEL_ABI.Message_Custom_ComboAttr.$Properties
         * @deprecated Use MODEL_ABI.Message_Custom_ComboAttr.$Properties instead.
         */

        /**
         * Shape of a Message_Custom_ComboAttr.
         * @typedef {MODEL_ABI.Message_Custom_ComboAttr.$Properties} MODEL_ABI.Message_Custom_ComboAttr.$Shape
         */

        /**
         * Constructs a new Message_Custom_ComboAttr.
         * @memberof MODEL_ABI
         * @classdesc Represents a Message_Custom_ComboAttr.
         * @constructor
         * @param {MODEL_ABI.Message_Custom_ComboAttr.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Custom_ComboAttr = function (properties) {
            this.element = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Custom_ComboAttr element.
         * @member {Array.<MODEL_ABI.Message_Custom_Combox_Element.$Properties>} element
         * @memberof MODEL_ABI.Message_Custom_ComboAttr
         * @instance
         */
        Message_Custom_ComboAttr.prototype.element = $util.emptyArray;

        /**
         * Message_Custom_ComboAttr defaultSelect.
         * @member {string} defaultSelect
         * @memberof MODEL_ABI.Message_Custom_ComboAttr
         * @instance
         */
        Message_Custom_ComboAttr.prototype.defaultSelect = "";

        /**
         * Creates a new Message_Custom_ComboAttr instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Message_Custom_ComboAttr
         * @static
         * @param {MODEL_ABI.Message_Custom_ComboAttr.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Message_Custom_ComboAttr} Message_Custom_ComboAttr instance
         * @type {{
         *   (properties: MODEL_ABI.Message_Custom_ComboAttr.$Shape): MODEL_ABI.Message_Custom_ComboAttr & MODEL_ABI.Message_Custom_ComboAttr.$Shape;
         *   (properties?: MODEL_ABI.Message_Custom_ComboAttr.$Properties): MODEL_ABI.Message_Custom_ComboAttr;
         * }}
         */
        Message_Custom_ComboAttr.create = function(properties) {
            return new Message_Custom_ComboAttr(properties);
        };

        /**
         * Encodes the specified Message_Custom_ComboAttr message. Does not implicitly {@link MODEL_ABI.Message_Custom_ComboAttr.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Message_Custom_ComboAttr
         * @static
         * @param {MODEL_ABI.Message_Custom_ComboAttr.$Properties} message Message_Custom_ComboAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Custom_ComboAttr.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.element != null && message.element.length)
                for (let i = 0; i < message.element.length; ++i)
                    $root.MODEL_ABI.Message_Custom_Combox_Element.encode(message.element[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.defaultSelect != null && $Object.hasOwnProperty.call(message, "defaultSelect") && message.defaultSelect !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.defaultSelect);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Custom_ComboAttr message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Custom_ComboAttr.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Message_Custom_ComboAttr
         * @static
         * @param {MODEL_ABI.Message_Custom_ComboAttr.$Properties} message Message_Custom_ComboAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Custom_ComboAttr.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Custom_ComboAttr message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Message_Custom_ComboAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Custom_ComboAttr & MODEL_ABI.Message_Custom_ComboAttr.$Shape} Message_Custom_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Custom_ComboAttr.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Message_Custom_ComboAttr(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (!(message.element && message.element.length))
                            message.element = [];
                        message.element.push($root.MODEL_ABI.Message_Custom_Combox_Element.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.defaultSelect = value;
                        else
                            delete message.defaultSelect;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Custom_ComboAttr message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Message_Custom_ComboAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Custom_ComboAttr & MODEL_ABI.Message_Custom_ComboAttr.$Shape} Message_Custom_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Custom_ComboAttr.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Custom_ComboAttr message.
         * @function verify
         * @memberof MODEL_ABI.Message_Custom_ComboAttr
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Custom_ComboAttr.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.element != null && $Object.hasOwnProperty.call(message, "element")) {
                if (!$Array.isArray(message.element))
                    return "element: array expected";
                for (let i = 0; i < message.element.length; ++i) {
                    let error = $root.MODEL_ABI.Message_Custom_Combox_Element.verify(message.element[i], _depth + 1);
                    if (error)
                        return "element." + error;
                }
            }
            if (message.defaultSelect != null && $Object.hasOwnProperty.call(message, "defaultSelect"))
                if (!$util.isString(message.defaultSelect))
                    return "defaultSelect: string expected";
            return null;
        };

        /**
         * Creates a Message_Custom_ComboAttr message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Message_Custom_ComboAttr
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Message_Custom_ComboAttr} Message_Custom_ComboAttr
         */
        Message_Custom_ComboAttr.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Message_Custom_ComboAttr)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Message_Custom_ComboAttr: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Message_Custom_ComboAttr();
            if (object.element) {
                if (!$Array.isArray(object.element))
                    throw $TypeError(".MODEL_ABI.Message_Custom_ComboAttr.element: array expected");
                message.element = $Array(object.element.length);
                for (let i = 0; i < object.element.length; ++i) {
                    if (!$util.isObject(object.element[i]))
                        throw $TypeError(".MODEL_ABI.Message_Custom_ComboAttr.element: object expected");
                    message.element[i] = $root.MODEL_ABI.Message_Custom_Combox_Element.fromObject(object.element[i], _depth + 1);
                }
            }
            if (object.defaultSelect != null)
                if (typeof object.defaultSelect !== "string" || object.defaultSelect.length)
                    message.defaultSelect = $String(object.defaultSelect);
            return message;
        };

        /**
         * Creates a plain object from a Message_Custom_ComboAttr message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Message_Custom_ComboAttr
         * @static
         * @param {MODEL_ABI.Message_Custom_ComboAttr} message Message_Custom_ComboAttr
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Custom_ComboAttr.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.element = [];
            if (options.defaults)
                object.defaultSelect = "";
            if (message.element && message.element.length) {
                object.element = $Array(message.element.length);
                for (let j = 0; j < message.element.length; ++j)
                    object.element[j] = $root.MODEL_ABI.Message_Custom_Combox_Element.toObject(message.element[j], options, _depth + 1);
            }
            if (message.defaultSelect != null && $Object.hasOwnProperty.call(message, "defaultSelect"))
                object.defaultSelect = message.defaultSelect;
            return object;
        };

        /**
         * Converts this Message_Custom_ComboAttr to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Message_Custom_ComboAttr
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Custom_ComboAttr.prototype.toJSON = function() {
            return Message_Custom_ComboAttr.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Custom_ComboAttr
         * @function getTypeUrl
         * @memberof MODEL_ABI.Message_Custom_ComboAttr
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Custom_ComboAttr.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Message_Custom_ComboAttr";
        };

        return Message_Custom_ComboAttr;
    })();

    MODEL_ABI.Message_Normal_Combox_Element = (function() {

        /**
         * Properties of a Message_Normal_Combox_Element.
         * @typedef {Object} MODEL_ABI.Message_Normal_Combox_Element.$Properties
         * @property {string|null} [sourcePath] Message_Normal_Combox_Element sourcePath
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Normal_Combox_Element.
         * @memberof MODEL_ABI
         * @interface IMessage_Normal_Combox_Element
         * @augments MODEL_ABI.Message_Normal_Combox_Element.$Properties
         * @deprecated Use MODEL_ABI.Message_Normal_Combox_Element.$Properties instead.
         */

        /**
         * Shape of a Message_Normal_Combox_Element.
         * @typedef {MODEL_ABI.Message_Normal_Combox_Element.$Properties} MODEL_ABI.Message_Normal_Combox_Element.$Shape
         */

        /**
         * Constructs a new Message_Normal_Combox_Element.
         * @memberof MODEL_ABI
         * @classdesc Represents a Message_Normal_Combox_Element.
         * @constructor
         * @param {MODEL_ABI.Message_Normal_Combox_Element.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Normal_Combox_Element = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Normal_Combox_Element sourcePath.
         * @member {string} sourcePath
         * @memberof MODEL_ABI.Message_Normal_Combox_Element
         * @instance
         */
        Message_Normal_Combox_Element.prototype.sourcePath = "";

        /**
         * Creates a new Message_Normal_Combox_Element instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Message_Normal_Combox_Element
         * @static
         * @param {MODEL_ABI.Message_Normal_Combox_Element.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Message_Normal_Combox_Element} Message_Normal_Combox_Element instance
         * @type {{
         *   (properties: MODEL_ABI.Message_Normal_Combox_Element.$Shape): MODEL_ABI.Message_Normal_Combox_Element & MODEL_ABI.Message_Normal_Combox_Element.$Shape;
         *   (properties?: MODEL_ABI.Message_Normal_Combox_Element.$Properties): MODEL_ABI.Message_Normal_Combox_Element;
         * }}
         */
        Message_Normal_Combox_Element.create = function(properties) {
            return new Message_Normal_Combox_Element(properties);
        };

        /**
         * Encodes the specified Message_Normal_Combox_Element message. Does not implicitly {@link MODEL_ABI.Message_Normal_Combox_Element.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Message_Normal_Combox_Element
         * @static
         * @param {MODEL_ABI.Message_Normal_Combox_Element.$Properties} message Message_Normal_Combox_Element message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Normal_Combox_Element.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.sourcePath != null && $Object.hasOwnProperty.call(message, "sourcePath") && message.sourcePath !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.sourcePath);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Normal_Combox_Element message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Normal_Combox_Element.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Message_Normal_Combox_Element
         * @static
         * @param {MODEL_ABI.Message_Normal_Combox_Element.$Properties} message Message_Normal_Combox_Element message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Normal_Combox_Element.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Normal_Combox_Element message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Message_Normal_Combox_Element
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Normal_Combox_Element & MODEL_ABI.Message_Normal_Combox_Element.$Shape} Message_Normal_Combox_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Normal_Combox_Element.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Message_Normal_Combox_Element(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.sourcePath = value;
                        else
                            delete message.sourcePath;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Normal_Combox_Element message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Message_Normal_Combox_Element
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Normal_Combox_Element & MODEL_ABI.Message_Normal_Combox_Element.$Shape} Message_Normal_Combox_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Normal_Combox_Element.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Normal_Combox_Element message.
         * @function verify
         * @memberof MODEL_ABI.Message_Normal_Combox_Element
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Normal_Combox_Element.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.sourcePath != null && $Object.hasOwnProperty.call(message, "sourcePath"))
                if (!$util.isString(message.sourcePath))
                    return "sourcePath: string expected";
            return null;
        };

        /**
         * Creates a Message_Normal_Combox_Element message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Message_Normal_Combox_Element
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Message_Normal_Combox_Element} Message_Normal_Combox_Element
         */
        Message_Normal_Combox_Element.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Message_Normal_Combox_Element)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Message_Normal_Combox_Element: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Message_Normal_Combox_Element();
            if (object.sourcePath != null)
                if (typeof object.sourcePath !== "string" || object.sourcePath.length)
                    message.sourcePath = $String(object.sourcePath);
            return message;
        };

        /**
         * Creates a plain object from a Message_Normal_Combox_Element message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Message_Normal_Combox_Element
         * @static
         * @param {MODEL_ABI.Message_Normal_Combox_Element} message Message_Normal_Combox_Element
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Normal_Combox_Element.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.defaults)
                object.sourcePath = "";
            if (message.sourcePath != null && $Object.hasOwnProperty.call(message, "sourcePath"))
                object.sourcePath = message.sourcePath;
            return object;
        };

        /**
         * Converts this Message_Normal_Combox_Element to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Message_Normal_Combox_Element
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Normal_Combox_Element.prototype.toJSON = function() {
            return Message_Normal_Combox_Element.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Normal_Combox_Element
         * @function getTypeUrl
         * @memberof MODEL_ABI.Message_Normal_Combox_Element
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Normal_Combox_Element.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Message_Normal_Combox_Element";
        };

        return Message_Normal_Combox_Element;
    })();

    MODEL_ABI.Message_Normal_ComboAttr = (function() {

        /**
         * Properties of a Message_Normal_ComboAttr.
         * @typedef {Object} MODEL_ABI.Message_Normal_ComboAttr.$Properties
         * @property {Array.<MODEL_ABI.Message_Normal_Combox_Element.$Properties>|null} [element] Message_Normal_ComboAttr element
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Normal_ComboAttr.
         * @memberof MODEL_ABI
         * @interface IMessage_Normal_ComboAttr
         * @augments MODEL_ABI.Message_Normal_ComboAttr.$Properties
         * @deprecated Use MODEL_ABI.Message_Normal_ComboAttr.$Properties instead.
         */

        /**
         * Shape of a Message_Normal_ComboAttr.
         * @typedef {MODEL_ABI.Message_Normal_ComboAttr.$Properties} MODEL_ABI.Message_Normal_ComboAttr.$Shape
         */

        /**
         * Constructs a new Message_Normal_ComboAttr.
         * @memberof MODEL_ABI
         * @classdesc Represents a Message_Normal_ComboAttr.
         * @constructor
         * @param {MODEL_ABI.Message_Normal_ComboAttr.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Normal_ComboAttr = function (properties) {
            this.element = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Normal_ComboAttr element.
         * @member {Array.<MODEL_ABI.Message_Normal_Combox_Element.$Properties>} element
         * @memberof MODEL_ABI.Message_Normal_ComboAttr
         * @instance
         */
        Message_Normal_ComboAttr.prototype.element = $util.emptyArray;

        /**
         * Creates a new Message_Normal_ComboAttr instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Message_Normal_ComboAttr
         * @static
         * @param {MODEL_ABI.Message_Normal_ComboAttr.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Message_Normal_ComboAttr} Message_Normal_ComboAttr instance
         * @type {{
         *   (properties: MODEL_ABI.Message_Normal_ComboAttr.$Shape): MODEL_ABI.Message_Normal_ComboAttr & MODEL_ABI.Message_Normal_ComboAttr.$Shape;
         *   (properties?: MODEL_ABI.Message_Normal_ComboAttr.$Properties): MODEL_ABI.Message_Normal_ComboAttr;
         * }}
         */
        Message_Normal_ComboAttr.create = function(properties) {
            return new Message_Normal_ComboAttr(properties);
        };

        /**
         * Encodes the specified Message_Normal_ComboAttr message. Does not implicitly {@link MODEL_ABI.Message_Normal_ComboAttr.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Message_Normal_ComboAttr
         * @static
         * @param {MODEL_ABI.Message_Normal_ComboAttr.$Properties} message Message_Normal_ComboAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Normal_ComboAttr.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.element != null && message.element.length)
                for (let i = 0; i < message.element.length; ++i)
                    $root.MODEL_ABI.Message_Normal_Combox_Element.encode(message.element[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Normal_ComboAttr message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Normal_ComboAttr.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Message_Normal_ComboAttr
         * @static
         * @param {MODEL_ABI.Message_Normal_ComboAttr.$Properties} message Message_Normal_ComboAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Normal_ComboAttr.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Normal_ComboAttr message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Message_Normal_ComboAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Normal_ComboAttr & MODEL_ABI.Message_Normal_ComboAttr.$Shape} Message_Normal_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Normal_ComboAttr.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Message_Normal_ComboAttr();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (!(message.element && message.element.length))
                            message.element = [];
                        message.element.push($root.MODEL_ABI.Message_Normal_Combox_Element.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Normal_ComboAttr message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Message_Normal_ComboAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Normal_ComboAttr & MODEL_ABI.Message_Normal_ComboAttr.$Shape} Message_Normal_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Normal_ComboAttr.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Normal_ComboAttr message.
         * @function verify
         * @memberof MODEL_ABI.Message_Normal_ComboAttr
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Normal_ComboAttr.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.element != null && $Object.hasOwnProperty.call(message, "element")) {
                if (!$Array.isArray(message.element))
                    return "element: array expected";
                for (let i = 0; i < message.element.length; ++i) {
                    let error = $root.MODEL_ABI.Message_Normal_Combox_Element.verify(message.element[i], _depth + 1);
                    if (error)
                        return "element." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Message_Normal_ComboAttr message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Message_Normal_ComboAttr
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Message_Normal_ComboAttr} Message_Normal_ComboAttr
         */
        Message_Normal_ComboAttr.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Message_Normal_ComboAttr)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Message_Normal_ComboAttr: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Message_Normal_ComboAttr();
            if (object.element) {
                if (!$Array.isArray(object.element))
                    throw $TypeError(".MODEL_ABI.Message_Normal_ComboAttr.element: array expected");
                message.element = $Array(object.element.length);
                for (let i = 0; i < object.element.length; ++i) {
                    if (!$util.isObject(object.element[i]))
                        throw $TypeError(".MODEL_ABI.Message_Normal_ComboAttr.element: object expected");
                    message.element[i] = $root.MODEL_ABI.Message_Normal_Combox_Element.fromObject(object.element[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_Normal_ComboAttr message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Message_Normal_ComboAttr
         * @static
         * @param {MODEL_ABI.Message_Normal_ComboAttr} message Message_Normal_ComboAttr
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Normal_ComboAttr.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.element = [];
            if (message.element && message.element.length) {
                object.element = $Array(message.element.length);
                for (let j = 0; j < message.element.length; ++j)
                    object.element[j] = $root.MODEL_ABI.Message_Normal_Combox_Element.toObject(message.element[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Message_Normal_ComboAttr to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Message_Normal_ComboAttr
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Normal_ComboAttr.prototype.toJSON = function() {
            return Message_Normal_ComboAttr.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Normal_ComboAttr
         * @function getTypeUrl
         * @memberof MODEL_ABI.Message_Normal_ComboAttr
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Normal_ComboAttr.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Message_Normal_ComboAttr";
        };

        return Message_Normal_ComboAttr;
    })();

    MODEL_ABI.Message_ComboAttr = (function() {

        /**
         * Properties of a Message_ComboAttr.
         * @typedef {Object} MODEL_ABI.Message_ComboAttr.$Properties
         * @property {string|null} [key] Message_ComboAttr key
         * @property {string|null} [desc] Message_ComboAttr desc
         * @property {string|null} [tips] Message_ComboAttr tips
         * @property {MODEL_ABI.COMBOX_SOURCE_TYPE|null} [comboxSource] Message_ComboAttr comboxSource
         * @property {MODEL_ABI.Message_Custom_ComboAttr.$Properties|null} [customCombox] Message_ComboAttr customCombox
         * @property {MODEL_ABI.Message_Normal_ComboAttr.$Properties|null} [normalCombox] Message_ComboAttr normalCombox
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_ComboAttr.
         * @memberof MODEL_ABI
         * @interface IMessage_ComboAttr
         * @augments MODEL_ABI.Message_ComboAttr.$Properties
         * @deprecated Use MODEL_ABI.Message_ComboAttr.$Properties instead.
         */

        /**
         * Shape of a Message_ComboAttr.
         * @typedef {MODEL_ABI.Message_ComboAttr.$Properties} MODEL_ABI.Message_ComboAttr.$Shape
         */

        /**
         * Constructs a new Message_ComboAttr.
         * @memberof MODEL_ABI
         * @classdesc Represents a Message_ComboAttr.
         * @constructor
         * @param {MODEL_ABI.Message_ComboAttr.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_ComboAttr = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_ComboAttr key.
         * @member {string} key
         * @memberof MODEL_ABI.Message_ComboAttr
         * @instance
         */
        Message_ComboAttr.prototype.key = "";

        /**
         * Message_ComboAttr desc.
         * @member {string} desc
         * @memberof MODEL_ABI.Message_ComboAttr
         * @instance
         */
        Message_ComboAttr.prototype.desc = "";

        /**
         * Message_ComboAttr tips.
         * @member {string} tips
         * @memberof MODEL_ABI.Message_ComboAttr
         * @instance
         */
        Message_ComboAttr.prototype.tips = "";

        /**
         * Message_ComboAttr comboxSource.
         * @member {MODEL_ABI.COMBOX_SOURCE_TYPE} comboxSource
         * @memberof MODEL_ABI.Message_ComboAttr
         * @instance
         */
        Message_ComboAttr.prototype.comboxSource = 0;

        /**
         * Message_ComboAttr customCombox.
         * @member {MODEL_ABI.Message_Custom_ComboAttr.$Properties|null|undefined} customCombox
         * @memberof MODEL_ABI.Message_ComboAttr
         * @instance
         */
        Message_ComboAttr.prototype.customCombox = null;

        /**
         * Message_ComboAttr normalCombox.
         * @member {MODEL_ABI.Message_Normal_ComboAttr.$Properties|null|undefined} normalCombox
         * @memberof MODEL_ABI.Message_ComboAttr
         * @instance
         */
        Message_ComboAttr.prototype.normalCombox = null;

        /**
         * Creates a new Message_ComboAttr instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Message_ComboAttr
         * @static
         * @param {MODEL_ABI.Message_ComboAttr.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Message_ComboAttr} Message_ComboAttr instance
         * @type {{
         *   (properties: MODEL_ABI.Message_ComboAttr.$Shape): MODEL_ABI.Message_ComboAttr & MODEL_ABI.Message_ComboAttr.$Shape;
         *   (properties?: MODEL_ABI.Message_ComboAttr.$Properties): MODEL_ABI.Message_ComboAttr;
         * }}
         */
        Message_ComboAttr.create = function(properties) {
            return new Message_ComboAttr(properties);
        };

        /**
         * Encodes the specified Message_ComboAttr message. Does not implicitly {@link MODEL_ABI.Message_ComboAttr.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Message_ComboAttr
         * @static
         * @param {MODEL_ABI.Message_ComboAttr.$Properties} message Message_ComboAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_ComboAttr.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.desc);
            if (message.tips != null && $Object.hasOwnProperty.call(message, "tips") && message.tips !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.tips);
            if (message.comboxSource != null && $Object.hasOwnProperty.call(message, "comboxSource") && message.comboxSource !== 0)
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.comboxSource);
            if (message.customCombox != null && $Object.hasOwnProperty.call(message, "customCombox"))
                $root.MODEL_ABI.Message_Custom_ComboAttr.encode(message.customCombox, writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
            if (message.normalCombox != null && $Object.hasOwnProperty.call(message, "normalCombox"))
                $root.MODEL_ABI.Message_Normal_ComboAttr.encode(message.normalCombox, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_ComboAttr message, length delimited. Does not implicitly {@link MODEL_ABI.Message_ComboAttr.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Message_ComboAttr
         * @static
         * @param {MODEL_ABI.Message_ComboAttr.$Properties} message Message_ComboAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_ComboAttr.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_ComboAttr message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Message_ComboAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_ComboAttr & MODEL_ABI.Message_ComboAttr.$Shape} Message_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_ComboAttr.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Message_ComboAttr(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.tips = value;
                        else
                            delete message.tips;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.comboxSource = value;
                        else
                            delete message.comboxSource;
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        message.customCombox = $root.MODEL_ABI.Message_Custom_ComboAttr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.customCombox);
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        message.normalCombox = $root.MODEL_ABI.Message_Normal_ComboAttr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.normalCombox);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_ComboAttr message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Message_ComboAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_ComboAttr & MODEL_ABI.Message_ComboAttr.$Shape} Message_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_ComboAttr.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_ComboAttr message.
         * @function verify
         * @memberof MODEL_ABI.Message_ComboAttr
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_ComboAttr.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.tips != null && $Object.hasOwnProperty.call(message, "tips"))
                if (!$util.isString(message.tips))
                    return "tips: string expected";
            if (message.comboxSource != null && $Object.hasOwnProperty.call(message, "comboxSource"))
                if (typeof message.comboxSource !== "number" || (message.comboxSource | 0) !== message.comboxSource)
                    return "comboxSource: enum value expected";
            if (message.customCombox != null && $Object.hasOwnProperty.call(message, "customCombox")) {
                let error = $root.MODEL_ABI.Message_Custom_ComboAttr.verify(message.customCombox, _depth + 1);
                if (error)
                    return "customCombox." + error;
            }
            if (message.normalCombox != null && $Object.hasOwnProperty.call(message, "normalCombox")) {
                let error = $root.MODEL_ABI.Message_Normal_ComboAttr.verify(message.normalCombox, _depth + 1);
                if (error)
                    return "normalCombox." + error;
            }
            return null;
        };

        /**
         * Creates a Message_ComboAttr message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Message_ComboAttr
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Message_ComboAttr} Message_ComboAttr
         */
        Message_ComboAttr.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Message_ComboAttr)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Message_ComboAttr: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Message_ComboAttr();
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.tips != null)
                if (typeof object.tips !== "string" || object.tips.length)
                    message.tips = $String(object.tips);
            if (object.comboxSource !== 0 && (typeof object.comboxSource !== "string" || $root.MODEL_ABI.COMBOX_SOURCE_TYPE[object.comboxSource] !== 0))
                switch (object.comboxSource) {
                case "NORMAL_E":
                case 0:
                    message.comboxSource = 0;
                    break;
                case "CUSTOM_E":
                case 1:
                    message.comboxSource = 1;
                    break;
                default:
                    if (typeof object.comboxSource === "number" && (object.comboxSource | 0) === object.comboxSource)
                        message.comboxSource = object.comboxSource;
                }
            if (object.customCombox != null) {
                if (!$util.isObject(object.customCombox))
                    throw $TypeError(".MODEL_ABI.Message_ComboAttr.customCombox: object expected");
                message.customCombox = $root.MODEL_ABI.Message_Custom_ComboAttr.fromObject(object.customCombox, _depth + 1);
            }
            if (object.normalCombox != null) {
                if (!$util.isObject(object.normalCombox))
                    throw $TypeError(".MODEL_ABI.Message_ComboAttr.normalCombox: object expected");
                message.normalCombox = $root.MODEL_ABI.Message_Normal_ComboAttr.fromObject(object.normalCombox, _depth + 1);
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_ComboAttr message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Message_ComboAttr
         * @static
         * @param {MODEL_ABI.Message_ComboAttr} message Message_ComboAttr
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_ComboAttr.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.key = "";
                object.desc = "";
                object.tips = "";
                object.comboxSource = options.enums === $String ? "NORMAL_E" : 0;
                object.customCombox = null;
                object.normalCombox = null;
            }
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.tips != null && $Object.hasOwnProperty.call(message, "tips"))
                object.tips = message.tips;
            if (message.comboxSource != null && $Object.hasOwnProperty.call(message, "comboxSource"))
                object.comboxSource = options.enums === $String ? $root.MODEL_ABI.COMBOX_SOURCE_TYPE[message.comboxSource] === $undefined ? message.comboxSource : $root.MODEL_ABI.COMBOX_SOURCE_TYPE[message.comboxSource] : message.comboxSource;
            if (message.customCombox != null && $Object.hasOwnProperty.call(message, "customCombox"))
                object.customCombox = $root.MODEL_ABI.Message_Custom_ComboAttr.toObject(message.customCombox, options, _depth + 1);
            if (message.normalCombox != null && $Object.hasOwnProperty.call(message, "normalCombox"))
                object.normalCombox = $root.MODEL_ABI.Message_Normal_ComboAttr.toObject(message.normalCombox, options, _depth + 1);
            return object;
        };

        /**
         * Converts this Message_ComboAttr to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Message_ComboAttr
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_ComboAttr.prototype.toJSON = function() {
            return Message_ComboAttr.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_ComboAttr
         * @function getTypeUrl
         * @memberof MODEL_ABI.Message_ComboAttr
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_ComboAttr.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Message_ComboAttr";
        };

        return Message_ComboAttr;
    })();

    MODEL_ABI.Message_ArrayAttr = (function() {

        /**
         * Properties of a Message_ArrayAttr.
         * @typedef {Object} MODEL_ABI.Message_ArrayAttr.$Properties
         * @property {string|null} [groupKey] Message_ArrayAttr groupKey
         * @property {string|null} [groupName] Message_ArrayAttr groupName
         * @property {MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION|null} [option] Message_ArrayAttr option
         * @property {Array.<MODEL_ABI.Message_Attribute.$Properties>|null} [attrParams] Message_ArrayAttr attrParams
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_ArrayAttr.
         * @memberof MODEL_ABI
         * @interface IMessage_ArrayAttr
         * @augments MODEL_ABI.Message_ArrayAttr.$Properties
         * @deprecated Use MODEL_ABI.Message_ArrayAttr.$Properties instead.
         */

        /**
         * Shape of a Message_ArrayAttr.
         * @typedef {MODEL_ABI.Message_ArrayAttr.$Properties} MODEL_ABI.Message_ArrayAttr.$Shape
         */

        /**
         * Constructs a new Message_ArrayAttr.
         * @memberof MODEL_ABI
         * @classdesc Represents a Message_ArrayAttr.
         * @constructor
         * @param {MODEL_ABI.Message_ArrayAttr.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_ArrayAttr = function (properties) {
            this.attrParams = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_ArrayAttr groupKey.
         * @member {string} groupKey
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @instance
         */
        Message_ArrayAttr.prototype.groupKey = "";

        /**
         * Message_ArrayAttr groupName.
         * @member {string} groupName
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @instance
         */
        Message_ArrayAttr.prototype.groupName = "";

        /**
         * Message_ArrayAttr option.
         * @member {MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION} option
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @instance
         */
        Message_ArrayAttr.prototype.option = 0;

        /**
         * Message_ArrayAttr attrParams.
         * @member {Array.<MODEL_ABI.Message_Attribute.$Properties>} attrParams
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @instance
         */
        Message_ArrayAttr.prototype.attrParams = $util.emptyArray;

        /**
         * Creates a new Message_ArrayAttr instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @static
         * @param {MODEL_ABI.Message_ArrayAttr.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Message_ArrayAttr} Message_ArrayAttr instance
         * @type {{
         *   (properties: MODEL_ABI.Message_ArrayAttr.$Shape): MODEL_ABI.Message_ArrayAttr & MODEL_ABI.Message_ArrayAttr.$Shape;
         *   (properties?: MODEL_ABI.Message_ArrayAttr.$Properties): MODEL_ABI.Message_ArrayAttr;
         * }}
         */
        Message_ArrayAttr.create = function(properties) {
            return new Message_ArrayAttr(properties);
        };

        /**
         * Encodes the specified Message_ArrayAttr message. Does not implicitly {@link MODEL_ABI.Message_ArrayAttr.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @static
         * @param {MODEL_ABI.Message_ArrayAttr.$Properties} message Message_ArrayAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_ArrayAttr.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.groupName != null && $Object.hasOwnProperty.call(message, "groupName") && message.groupName !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.groupName);
            if (message.option != null && $Object.hasOwnProperty.call(message, "option") && message.option !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.option);
            if (message.groupKey != null && $Object.hasOwnProperty.call(message, "groupKey") && message.groupKey !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.groupKey);
            if (message.attrParams != null && message.attrParams.length)
                for (let i = 0; i < message.attrParams.length; ++i)
                    $root.MODEL_ABI.Message_Attribute.encode(message.attrParams[i], writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_ArrayAttr message, length delimited. Does not implicitly {@link MODEL_ABI.Message_ArrayAttr.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @static
         * @param {MODEL_ABI.Message_ArrayAttr.$Properties} message Message_ArrayAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_ArrayAttr.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_ArrayAttr message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_ArrayAttr & MODEL_ABI.Message_ArrayAttr.$Shape} Message_ArrayAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_ArrayAttr.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Message_ArrayAttr(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.groupKey = value;
                        else
                            delete message.groupKey;
                        continue;
                    }
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.groupName = value;
                        else
                            delete message.groupName;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.option = value;
                        else
                            delete message.option;
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        if (!(message.attrParams && message.attrParams.length))
                            message.attrParams = [];
                        message.attrParams.push($root.MODEL_ABI.Message_Attribute.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_ArrayAttr message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_ArrayAttr & MODEL_ABI.Message_ArrayAttr.$Shape} Message_ArrayAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_ArrayAttr.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_ArrayAttr message.
         * @function verify
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_ArrayAttr.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.groupKey != null && $Object.hasOwnProperty.call(message, "groupKey"))
                if (!$util.isString(message.groupKey))
                    return "groupKey: string expected";
            if (message.groupName != null && $Object.hasOwnProperty.call(message, "groupName"))
                if (!$util.isString(message.groupName))
                    return "groupName: string expected";
            if (message.option != null && $Object.hasOwnProperty.call(message, "option"))
                if (typeof message.option !== "number" || (message.option | 0) !== message.option)
                    return "option: enum value expected";
            if (message.attrParams != null && $Object.hasOwnProperty.call(message, "attrParams")) {
                if (!$Array.isArray(message.attrParams))
                    return "attrParams: array expected";
                for (let i = 0; i < message.attrParams.length; ++i) {
                    let error = $root.MODEL_ABI.Message_Attribute.verify(message.attrParams[i], _depth + 1);
                    if (error)
                        return "attrParams." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Message_ArrayAttr message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Message_ArrayAttr} Message_ArrayAttr
         */
        Message_ArrayAttr.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Message_ArrayAttr)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Message_ArrayAttr: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Message_ArrayAttr();
            if (object.groupKey != null)
                if (typeof object.groupKey !== "string" || object.groupKey.length)
                    message.groupKey = $String(object.groupKey);
            if (object.groupName != null)
                if (typeof object.groupName !== "string" || object.groupName.length)
                    message.groupName = $String(object.groupName);
            if (object.option !== 0 && (typeof object.option !== "string" || $root.MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION[object.option] !== 0))
                switch (object.option) {
                case "REQUIRED_E":
                case 0:
                    message.option = 0;
                    break;
                case "OPTIONAL_E":
                case 1:
                    message.option = 1;
                    break;
                default:
                    if (typeof object.option === "number" && (object.option | 0) === object.option)
                        message.option = object.option;
                }
            if (object.attrParams) {
                if (!$Array.isArray(object.attrParams))
                    throw $TypeError(".MODEL_ABI.Message_ArrayAttr.attrParams: array expected");
                message.attrParams = $Array(object.attrParams.length);
                for (let i = 0; i < object.attrParams.length; ++i) {
                    if (!$util.isObject(object.attrParams[i]))
                        throw $TypeError(".MODEL_ABI.Message_ArrayAttr.attrParams: object expected");
                    message.attrParams[i] = $root.MODEL_ABI.Message_Attribute.fromObject(object.attrParams[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_ArrayAttr message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @static
         * @param {MODEL_ABI.Message_ArrayAttr} message Message_ArrayAttr
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_ArrayAttr.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.attrParams = [];
            if (options.defaults) {
                object.groupName = "";
                object.option = options.enums === $String ? "REQUIRED_E" : 0;
                object.groupKey = "";
            }
            if (message.groupName != null && $Object.hasOwnProperty.call(message, "groupName"))
                object.groupName = message.groupName;
            if (message.option != null && $Object.hasOwnProperty.call(message, "option"))
                object.option = options.enums === $String ? $root.MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION[message.option] === $undefined ? message.option : $root.MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION[message.option] : message.option;
            if (message.groupKey != null && $Object.hasOwnProperty.call(message, "groupKey"))
                object.groupKey = message.groupKey;
            if (message.attrParams && message.attrParams.length) {
                object.attrParams = $Array(message.attrParams.length);
                for (let j = 0; j < message.attrParams.length; ++j)
                    object.attrParams[j] = $root.MODEL_ABI.Message_Attribute.toObject(message.attrParams[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Message_ArrayAttr to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_ArrayAttr.prototype.toJSON = function() {
            return Message_ArrayAttr.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_ArrayAttr
         * @function getTypeUrl
         * @memberof MODEL_ABI.Message_ArrayAttr
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_ArrayAttr.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Message_ArrayAttr";
        };

        return Message_ArrayAttr;
    })();

    MODEL_ABI.Message_CommonAttr = (function() {

        /**
         * Properties of a Message_CommonAttr.
         * @typedef {Object} MODEL_ABI.Message_CommonAttr.$Properties
         * @property {string|null} [key] Message_CommonAttr key
         * @property {MODEL_ABI.COMMON_ATTR_TYPE|null} [type] Message_CommonAttr type
         * @property {MODEL_ABI.Message_ComboAttr.$Properties|null} [comboxParam] Message_CommonAttr comboxParam
         * @property {MODEL_ABI.Message_ArrayAttr.$Properties|null} [arrayParam] Message_CommonAttr arrayParam
         * @property {boolean|null} [cloneEnable] Message_CommonAttr cloneEnable
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_CommonAttr.
         * @memberof MODEL_ABI
         * @interface IMessage_CommonAttr
         * @augments MODEL_ABI.Message_CommonAttr.$Properties
         * @deprecated Use MODEL_ABI.Message_CommonAttr.$Properties instead.
         */

        /**
         * Shape of a Message_CommonAttr.
         * @typedef {MODEL_ABI.Message_CommonAttr.$Properties} MODEL_ABI.Message_CommonAttr.$Shape
         */

        /**
         * Constructs a new Message_CommonAttr.
         * @memberof MODEL_ABI
         * @classdesc Represents a Message_CommonAttr.
         * @constructor
         * @param {MODEL_ABI.Message_CommonAttr.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_CommonAttr = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_CommonAttr key.
         * @member {string} key
         * @memberof MODEL_ABI.Message_CommonAttr
         * @instance
         */
        Message_CommonAttr.prototype.key = "";

        /**
         * Message_CommonAttr type.
         * @member {MODEL_ABI.COMMON_ATTR_TYPE} type
         * @memberof MODEL_ABI.Message_CommonAttr
         * @instance
         */
        Message_CommonAttr.prototype.type = 0;

        /**
         * Message_CommonAttr comboxParam.
         * @member {MODEL_ABI.Message_ComboAttr.$Properties|null|undefined} comboxParam
         * @memberof MODEL_ABI.Message_CommonAttr
         * @instance
         */
        Message_CommonAttr.prototype.comboxParam = null;

        /**
         * Message_CommonAttr arrayParam.
         * @member {MODEL_ABI.Message_ArrayAttr.$Properties|null|undefined} arrayParam
         * @memberof MODEL_ABI.Message_CommonAttr
         * @instance
         */
        Message_CommonAttr.prototype.arrayParam = null;

        /**
         * Message_CommonAttr cloneEnable.
         * @member {boolean} cloneEnable
         * @memberof MODEL_ABI.Message_CommonAttr
         * @instance
         */
        Message_CommonAttr.prototype.cloneEnable = false;

        /**
         * Creates a new Message_CommonAttr instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Message_CommonAttr
         * @static
         * @param {MODEL_ABI.Message_CommonAttr.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Message_CommonAttr} Message_CommonAttr instance
         * @type {{
         *   (properties: MODEL_ABI.Message_CommonAttr.$Shape): MODEL_ABI.Message_CommonAttr & MODEL_ABI.Message_CommonAttr.$Shape;
         *   (properties?: MODEL_ABI.Message_CommonAttr.$Properties): MODEL_ABI.Message_CommonAttr;
         * }}
         */
        Message_CommonAttr.create = function(properties) {
            return new Message_CommonAttr(properties);
        };

        /**
         * Encodes the specified Message_CommonAttr message. Does not implicitly {@link MODEL_ABI.Message_CommonAttr.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Message_CommonAttr
         * @static
         * @param {MODEL_ABI.Message_CommonAttr.$Properties} message Message_CommonAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_CommonAttr.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.type != null && $Object.hasOwnProperty.call(message, "type") && message.type !== 0)
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.type);
            if (message.comboxParam != null && $Object.hasOwnProperty.call(message, "comboxParam"))
                $root.MODEL_ABI.Message_ComboAttr.encode(message.comboxParam, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.arrayParam != null && $Object.hasOwnProperty.call(message, "arrayParam"))
                $root.MODEL_ABI.Message_ArrayAttr.encode(message.arrayParam, writer.uint32(/* id 12, wireType 2 =*/98).fork(), _depth + 1).ldelim();
            if (message.cloneEnable != null && $Object.hasOwnProperty.call(message, "cloneEnable") && message.cloneEnable !== false)
                writer.uint32(/* id 32, wireType 0 =*/256).bool(message.cloneEnable);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_CommonAttr message, length delimited. Does not implicitly {@link MODEL_ABI.Message_CommonAttr.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Message_CommonAttr
         * @static
         * @param {MODEL_ABI.Message_CommonAttr.$Properties} message Message_CommonAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_CommonAttr.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_CommonAttr message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Message_CommonAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_CommonAttr & MODEL_ABI.Message_CommonAttr.$Shape} Message_CommonAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_CommonAttr.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Message_CommonAttr(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 10: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.type = value;
                        else
                            delete message.type;
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        message.comboxParam = $root.MODEL_ABI.Message_ComboAttr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.comboxParam);
                        continue;
                    }
                case 12: {
                        if (wireType !== 2)
                            break;
                        message.arrayParam = $root.MODEL_ABI.Message_ArrayAttr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.arrayParam);
                        continue;
                    }
                case 32: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.cloneEnable = value;
                        else
                            delete message.cloneEnable;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_CommonAttr message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Message_CommonAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_CommonAttr & MODEL_ABI.Message_CommonAttr.$Shape} Message_CommonAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_CommonAttr.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_CommonAttr message.
         * @function verify
         * @memberof MODEL_ABI.Message_CommonAttr
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_CommonAttr.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                if (typeof message.type !== "number" || (message.type | 0) !== message.type)
                    return "type: enum value expected";
            if (message.comboxParam != null && $Object.hasOwnProperty.call(message, "comboxParam")) {
                let error = $root.MODEL_ABI.Message_ComboAttr.verify(message.comboxParam, _depth + 1);
                if (error)
                    return "comboxParam." + error;
            }
            if (message.arrayParam != null && $Object.hasOwnProperty.call(message, "arrayParam")) {
                let error = $root.MODEL_ABI.Message_ArrayAttr.verify(message.arrayParam, _depth + 1);
                if (error)
                    return "arrayParam." + error;
            }
            if (message.cloneEnable != null && $Object.hasOwnProperty.call(message, "cloneEnable"))
                if (typeof message.cloneEnable !== "boolean")
                    return "cloneEnable: boolean expected";
            return null;
        };

        /**
         * Creates a Message_CommonAttr message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Message_CommonAttr
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Message_CommonAttr} Message_CommonAttr
         */
        Message_CommonAttr.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Message_CommonAttr)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Message_CommonAttr: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Message_CommonAttr();
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.type !== 0 && (typeof object.type !== "string" || $root.MODEL_ABI.COMMON_ATTR_TYPE[object.type] !== 0))
                switch (object.type) {
                case "COMBOX_E":
                case 0:
                    message.type = 0;
                    break;
                case "ARRAY_E":
                case 1:
                    message.type = 1;
                    break;
                default:
                    if (typeof object.type === "number" && (object.type | 0) === object.type)
                        message.type = object.type;
                }
            if (object.comboxParam != null) {
                if (!$util.isObject(object.comboxParam))
                    throw $TypeError(".MODEL_ABI.Message_CommonAttr.comboxParam: object expected");
                message.comboxParam = $root.MODEL_ABI.Message_ComboAttr.fromObject(object.comboxParam, _depth + 1);
            }
            if (object.arrayParam != null) {
                if (!$util.isObject(object.arrayParam))
                    throw $TypeError(".MODEL_ABI.Message_CommonAttr.arrayParam: object expected");
                message.arrayParam = $root.MODEL_ABI.Message_ArrayAttr.fromObject(object.arrayParam, _depth + 1);
            }
            if (object.cloneEnable != null)
                if (object.cloneEnable)
                    message.cloneEnable = $Boolean(object.cloneEnable);
            return message;
        };

        /**
         * Creates a plain object from a Message_CommonAttr message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Message_CommonAttr
         * @static
         * @param {MODEL_ABI.Message_CommonAttr} message Message_CommonAttr
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_CommonAttr.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.key = "";
                object.type = options.enums === $String ? "COMBOX_E" : 0;
                object.comboxParam = null;
                object.arrayParam = null;
                object.cloneEnable = false;
            }
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                object.type = options.enums === $String ? $root.MODEL_ABI.COMMON_ATTR_TYPE[message.type] === $undefined ? message.type : $root.MODEL_ABI.COMMON_ATTR_TYPE[message.type] : message.type;
            if (message.comboxParam != null && $Object.hasOwnProperty.call(message, "comboxParam"))
                object.comboxParam = $root.MODEL_ABI.Message_ComboAttr.toObject(message.comboxParam, options, _depth + 1);
            if (message.arrayParam != null && $Object.hasOwnProperty.call(message, "arrayParam"))
                object.arrayParam = $root.MODEL_ABI.Message_ArrayAttr.toObject(message.arrayParam, options, _depth + 1);
            if (message.cloneEnable != null && $Object.hasOwnProperty.call(message, "cloneEnable"))
                object.cloneEnable = message.cloneEnable;
            return object;
        };

        /**
         * Converts this Message_CommonAttr to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Message_CommonAttr
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_CommonAttr.prototype.toJSON = function() {
            return Message_CommonAttr.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_CommonAttr
         * @function getTypeUrl
         * @memberof MODEL_ABI.Message_CommonAttr
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_CommonAttr.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Message_CommonAttr";
        };

        return Message_CommonAttr;
    })();

    MODEL_ABI.Child_Function_Ability = (function() {

        /**
         * Properties of a Child_Function_Ability.
         * @typedef {Object} MODEL_ABI.Child_Function_Ability.$Properties
         * @property {string|null} [type] Child_Function_Ability type
         * @property {string|null} [desc] Child_Function_Ability desc
         * @property {string|null} [tips] Child_Function_Ability tips
         * @property {string|null} [key] Child_Function_Ability key
         * @property {Array.<MODEL_ABI.Message_CommonAttr.$Properties>|null} [attr] Child_Function_Ability attr
         * @property {boolean|null} [cloneEnable] Child_Function_Ability cloneEnable
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Child_Function_Ability.
         * @memberof MODEL_ABI
         * @interface IChild_Function_Ability
         * @augments MODEL_ABI.Child_Function_Ability.$Properties
         * @deprecated Use MODEL_ABI.Child_Function_Ability.$Properties instead.
         */

        /**
         * Shape of a Child_Function_Ability.
         * @typedef {MODEL_ABI.Child_Function_Ability.$Properties} MODEL_ABI.Child_Function_Ability.$Shape
         */

        /**
         * Constructs a new Child_Function_Ability.
         * @memberof MODEL_ABI
         * @classdesc Represents a Child_Function_Ability.
         * @constructor
         * @param {MODEL_ABI.Child_Function_Ability.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Child_Function_Ability = function (properties) {
            this.attr = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Child_Function_Ability type.
         * @member {string} type
         * @memberof MODEL_ABI.Child_Function_Ability
         * @instance
         */
        Child_Function_Ability.prototype.type = "";

        /**
         * Child_Function_Ability desc.
         * @member {string} desc
         * @memberof MODEL_ABI.Child_Function_Ability
         * @instance
         */
        Child_Function_Ability.prototype.desc = "";

        /**
         * Child_Function_Ability tips.
         * @member {string} tips
         * @memberof MODEL_ABI.Child_Function_Ability
         * @instance
         */
        Child_Function_Ability.prototype.tips = "";

        /**
         * Child_Function_Ability key.
         * @member {string} key
         * @memberof MODEL_ABI.Child_Function_Ability
         * @instance
         */
        Child_Function_Ability.prototype.key = "";

        /**
         * Child_Function_Ability attr.
         * @member {Array.<MODEL_ABI.Message_CommonAttr.$Properties>} attr
         * @memberof MODEL_ABI.Child_Function_Ability
         * @instance
         */
        Child_Function_Ability.prototype.attr = $util.emptyArray;

        /**
         * Child_Function_Ability cloneEnable.
         * @member {boolean} cloneEnable
         * @memberof MODEL_ABI.Child_Function_Ability
         * @instance
         */
        Child_Function_Ability.prototype.cloneEnable = false;

        /**
         * Creates a new Child_Function_Ability instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Child_Function_Ability
         * @static
         * @param {MODEL_ABI.Child_Function_Ability.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Child_Function_Ability} Child_Function_Ability instance
         * @type {{
         *   (properties: MODEL_ABI.Child_Function_Ability.$Shape): MODEL_ABI.Child_Function_Ability & MODEL_ABI.Child_Function_Ability.$Shape;
         *   (properties?: MODEL_ABI.Child_Function_Ability.$Properties): MODEL_ABI.Child_Function_Ability;
         * }}
         */
        Child_Function_Ability.create = function(properties) {
            return new Child_Function_Ability(properties);
        };

        /**
         * Encodes the specified Child_Function_Ability message. Does not implicitly {@link MODEL_ABI.Child_Function_Ability.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Child_Function_Ability
         * @static
         * @param {MODEL_ABI.Child_Function_Ability.$Properties} message Child_Function_Ability message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Child_Function_Ability.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.type != null && $Object.hasOwnProperty.call(message, "type") && message.type !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.desc);
            if (message.tips != null && $Object.hasOwnProperty.call(message, "tips") && message.tips !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.tips);
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.key);
            if (message.attr != null && message.attr.length)
                for (let i = 0; i < message.attr.length; ++i)
                    $root.MODEL_ABI.Message_CommonAttr.encode(message.attr[i], writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
            if (message.cloneEnable != null && $Object.hasOwnProperty.call(message, "cloneEnable") && message.cloneEnable !== false)
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.cloneEnable);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Child_Function_Ability message, length delimited. Does not implicitly {@link MODEL_ABI.Child_Function_Ability.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Child_Function_Ability
         * @static
         * @param {MODEL_ABI.Child_Function_Ability.$Properties} message Child_Function_Ability message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Child_Function_Ability.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Child_Function_Ability message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Child_Function_Ability
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Child_Function_Ability & MODEL_ABI.Child_Function_Ability.$Shape} Child_Function_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Child_Function_Ability.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Child_Function_Ability(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.type = value;
                        else
                            delete message.type;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.tips = value;
                        else
                            delete message.tips;
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        if (!(message.attr && message.attr.length))
                            message.attr = [];
                        message.attr.push($root.MODEL_ABI.Message_CommonAttr.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 11: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.cloneEnable = value;
                        else
                            delete message.cloneEnable;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Child_Function_Ability message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Child_Function_Ability
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Child_Function_Ability & MODEL_ABI.Child_Function_Ability.$Shape} Child_Function_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Child_Function_Ability.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Child_Function_Ability message.
         * @function verify
         * @memberof MODEL_ABI.Child_Function_Ability
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Child_Function_Ability.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.tips != null && $Object.hasOwnProperty.call(message, "tips"))
                if (!$util.isString(message.tips))
                    return "tips: string expected";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.attr != null && $Object.hasOwnProperty.call(message, "attr")) {
                if (!$Array.isArray(message.attr))
                    return "attr: array expected";
                for (let i = 0; i < message.attr.length; ++i) {
                    let error = $root.MODEL_ABI.Message_CommonAttr.verify(message.attr[i], _depth + 1);
                    if (error)
                        return "attr." + error;
                }
            }
            if (message.cloneEnable != null && $Object.hasOwnProperty.call(message, "cloneEnable"))
                if (typeof message.cloneEnable !== "boolean")
                    return "cloneEnable: boolean expected";
            return null;
        };

        /**
         * Creates a Child_Function_Ability message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Child_Function_Ability
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Child_Function_Ability} Child_Function_Ability
         */
        Child_Function_Ability.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Child_Function_Ability)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Child_Function_Ability: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Child_Function_Ability();
            if (object.type != null)
                if (typeof object.type !== "string" || object.type.length)
                    message.type = $String(object.type);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.tips != null)
                if (typeof object.tips !== "string" || object.tips.length)
                    message.tips = $String(object.tips);
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.attr) {
                if (!$Array.isArray(object.attr))
                    throw $TypeError(".MODEL_ABI.Child_Function_Ability.attr: array expected");
                message.attr = $Array(object.attr.length);
                for (let i = 0; i < object.attr.length; ++i) {
                    if (!$util.isObject(object.attr[i]))
                        throw $TypeError(".MODEL_ABI.Child_Function_Ability.attr: object expected");
                    message.attr[i] = $root.MODEL_ABI.Message_CommonAttr.fromObject(object.attr[i], _depth + 1);
                }
            }
            if (object.cloneEnable != null)
                if (object.cloneEnable)
                    message.cloneEnable = $Boolean(object.cloneEnable);
            return message;
        };

        /**
         * Creates a plain object from a Child_Function_Ability message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Child_Function_Ability
         * @static
         * @param {MODEL_ABI.Child_Function_Ability} message Child_Function_Ability
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Child_Function_Ability.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.attr = [];
            if (options.defaults) {
                object.type = "";
                object.desc = "";
                object.tips = "";
                object.key = "";
                object.cloneEnable = false;
            }
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                object.type = message.type;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.tips != null && $Object.hasOwnProperty.call(message, "tips"))
                object.tips = message.tips;
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.attr && message.attr.length) {
                object.attr = $Array(message.attr.length);
                for (let j = 0; j < message.attr.length; ++j)
                    object.attr[j] = $root.MODEL_ABI.Message_CommonAttr.toObject(message.attr[j], options, _depth + 1);
            }
            if (message.cloneEnable != null && $Object.hasOwnProperty.call(message, "cloneEnable"))
                object.cloneEnable = message.cloneEnable;
            return object;
        };

        /**
         * Converts this Child_Function_Ability to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Child_Function_Ability
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Child_Function_Ability.prototype.toJSON = function() {
            return Child_Function_Ability.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Child_Function_Ability
         * @function getTypeUrl
         * @memberof MODEL_ABI.Child_Function_Ability
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Child_Function_Ability.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Child_Function_Ability";
        };

        return Child_Function_Ability;
    })();

    MODEL_ABI.Function_Ability = (function() {

        /**
         * Properties of a Function_Ability.
         * @typedef {Object} MODEL_ABI.Function_Ability.$Properties
         * @property {string|null} [type] Function_Ability type
         * @property {string|null} [desc] Function_Ability desc
         * @property {string|null} [tips] Function_Ability tips
         * @property {Array.<MODEL_ABI.Child_Function_Ability.$Properties>|null} [childFunction] Function_Ability childFunction
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Function_Ability.
         * @memberof MODEL_ABI
         * @interface IFunction_Ability
         * @augments MODEL_ABI.Function_Ability.$Properties
         * @deprecated Use MODEL_ABI.Function_Ability.$Properties instead.
         */

        /**
         * Shape of a Function_Ability.
         * @typedef {MODEL_ABI.Function_Ability.$Properties} MODEL_ABI.Function_Ability.$Shape
         */

        /**
         * Constructs a new Function_Ability.
         * @memberof MODEL_ABI
         * @classdesc Represents a Function_Ability.
         * @constructor
         * @param {MODEL_ABI.Function_Ability.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Function_Ability = function (properties) {
            this.childFunction = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Function_Ability type.
         * @member {string} type
         * @memberof MODEL_ABI.Function_Ability
         * @instance
         */
        Function_Ability.prototype.type = "";

        /**
         * Function_Ability desc.
         * @member {string} desc
         * @memberof MODEL_ABI.Function_Ability
         * @instance
         */
        Function_Ability.prototype.desc = "";

        /**
         * Function_Ability tips.
         * @member {string} tips
         * @memberof MODEL_ABI.Function_Ability
         * @instance
         */
        Function_Ability.prototype.tips = "";

        /**
         * Function_Ability childFunction.
         * @member {Array.<MODEL_ABI.Child_Function_Ability.$Properties>} childFunction
         * @memberof MODEL_ABI.Function_Ability
         * @instance
         */
        Function_Ability.prototype.childFunction = $util.emptyArray;

        /**
         * Creates a new Function_Ability instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Function_Ability
         * @static
         * @param {MODEL_ABI.Function_Ability.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Function_Ability} Function_Ability instance
         * @type {{
         *   (properties: MODEL_ABI.Function_Ability.$Shape): MODEL_ABI.Function_Ability & MODEL_ABI.Function_Ability.$Shape;
         *   (properties?: MODEL_ABI.Function_Ability.$Properties): MODEL_ABI.Function_Ability;
         * }}
         */
        Function_Ability.create = function(properties) {
            return new Function_Ability(properties);
        };

        /**
         * Encodes the specified Function_Ability message. Does not implicitly {@link MODEL_ABI.Function_Ability.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Function_Ability
         * @static
         * @param {MODEL_ABI.Function_Ability.$Properties} message Function_Ability message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Function_Ability.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.type != null && $Object.hasOwnProperty.call(message, "type") && message.type !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.desc);
            if (message.tips != null && $Object.hasOwnProperty.call(message, "tips") && message.tips !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.tips);
            if (message.childFunction != null && message.childFunction.length)
                for (let i = 0; i < message.childFunction.length; ++i)
                    $root.MODEL_ABI.Child_Function_Ability.encode(message.childFunction[i], writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Function_Ability message, length delimited. Does not implicitly {@link MODEL_ABI.Function_Ability.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Function_Ability
         * @static
         * @param {MODEL_ABI.Function_Ability.$Properties} message Function_Ability message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Function_Ability.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Function_Ability message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Function_Ability
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Function_Ability & MODEL_ABI.Function_Ability.$Shape} Function_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Function_Ability.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Function_Ability(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.type = value;
                        else
                            delete message.type;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.tips = value;
                        else
                            delete message.tips;
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        if (!(message.childFunction && message.childFunction.length))
                            message.childFunction = [];
                        message.childFunction.push($root.MODEL_ABI.Child_Function_Ability.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Function_Ability message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Function_Ability
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Function_Ability & MODEL_ABI.Function_Ability.$Shape} Function_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Function_Ability.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Function_Ability message.
         * @function verify
         * @memberof MODEL_ABI.Function_Ability
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Function_Ability.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.tips != null && $Object.hasOwnProperty.call(message, "tips"))
                if (!$util.isString(message.tips))
                    return "tips: string expected";
            if (message.childFunction != null && $Object.hasOwnProperty.call(message, "childFunction")) {
                if (!$Array.isArray(message.childFunction))
                    return "childFunction: array expected";
                for (let i = 0; i < message.childFunction.length; ++i) {
                    let error = $root.MODEL_ABI.Child_Function_Ability.verify(message.childFunction[i], _depth + 1);
                    if (error)
                        return "childFunction." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Function_Ability message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Function_Ability
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Function_Ability} Function_Ability
         */
        Function_Ability.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Function_Ability)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Function_Ability: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Function_Ability();
            if (object.type != null)
                if (typeof object.type !== "string" || object.type.length)
                    message.type = $String(object.type);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.tips != null)
                if (typeof object.tips !== "string" || object.tips.length)
                    message.tips = $String(object.tips);
            if (object.childFunction) {
                if (!$Array.isArray(object.childFunction))
                    throw $TypeError(".MODEL_ABI.Function_Ability.childFunction: array expected");
                message.childFunction = $Array(object.childFunction.length);
                for (let i = 0; i < object.childFunction.length; ++i) {
                    if (!$util.isObject(object.childFunction[i]))
                        throw $TypeError(".MODEL_ABI.Function_Ability.childFunction: object expected");
                    message.childFunction[i] = $root.MODEL_ABI.Child_Function_Ability.fromObject(object.childFunction[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Function_Ability message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Function_Ability
         * @static
         * @param {MODEL_ABI.Function_Ability} message Function_Ability
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Function_Ability.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.childFunction = [];
            if (options.defaults) {
                object.type = "";
                object.desc = "";
                object.tips = "";
            }
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                object.type = message.type;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.tips != null && $Object.hasOwnProperty.call(message, "tips"))
                object.tips = message.tips;
            if (message.childFunction && message.childFunction.length) {
                object.childFunction = $Array(message.childFunction.length);
                for (let j = 0; j < message.childFunction.length; ++j)
                    object.childFunction[j] = $root.MODEL_ABI.Child_Function_Ability.toObject(message.childFunction[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Function_Ability to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Function_Ability
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Function_Ability.prototype.toJSON = function() {
            return Function_Ability.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Function_Ability
         * @function getTypeUrl
         * @memberof MODEL_ABI.Function_Ability
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Function_Ability.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Function_Ability";
        };

        return Function_Ability;
    })();

    MODEL_ABI.Component_Ability = (function() {

        /**
         * Properties of a Component_Ability.
         * @typedef {Object} MODEL_ABI.Component_Ability.$Properties
         * @property {string|null} [type] Component_Ability type
         * @property {Array.<string>|null} [entity] Component_Ability entity
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Component_Ability.
         * @memberof MODEL_ABI
         * @interface IComponent_Ability
         * @augments MODEL_ABI.Component_Ability.$Properties
         * @deprecated Use MODEL_ABI.Component_Ability.$Properties instead.
         */

        /**
         * Shape of a Component_Ability.
         * @typedef {MODEL_ABI.Component_Ability.$Properties} MODEL_ABI.Component_Ability.$Shape
         */

        /**
         * Constructs a new Component_Ability.
         * @memberof MODEL_ABI
         * @classdesc Represents a Component_Ability.
         * @constructor
         * @param {MODEL_ABI.Component_Ability.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Component_Ability = function (properties) {
            this.entity = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Component_Ability type.
         * @member {string} type
         * @memberof MODEL_ABI.Component_Ability
         * @instance
         */
        Component_Ability.prototype.type = "";

        /**
         * Component_Ability entity.
         * @member {Array.<string>} entity
         * @memberof MODEL_ABI.Component_Ability
         * @instance
         */
        Component_Ability.prototype.entity = $util.emptyArray;

        /**
         * Creates a new Component_Ability instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Component_Ability
         * @static
         * @param {MODEL_ABI.Component_Ability.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Component_Ability} Component_Ability instance
         * @type {{
         *   (properties: MODEL_ABI.Component_Ability.$Shape): MODEL_ABI.Component_Ability & MODEL_ABI.Component_Ability.$Shape;
         *   (properties?: MODEL_ABI.Component_Ability.$Properties): MODEL_ABI.Component_Ability;
         * }}
         */
        Component_Ability.create = function(properties) {
            return new Component_Ability(properties);
        };

        /**
         * Encodes the specified Component_Ability message. Does not implicitly {@link MODEL_ABI.Component_Ability.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Component_Ability
         * @static
         * @param {MODEL_ABI.Component_Ability.$Properties} message Component_Ability message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Component_Ability.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.type != null && $Object.hasOwnProperty.call(message, "type") && message.type !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
            if (message.entity != null && message.entity.length)
                for (let i = 0; i < message.entity.length; ++i)
                    writer.uint32(/* id 11, wireType 2 =*/90).string(message.entity[i]);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Component_Ability message, length delimited. Does not implicitly {@link MODEL_ABI.Component_Ability.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Component_Ability
         * @static
         * @param {MODEL_ABI.Component_Ability.$Properties} message Component_Ability message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Component_Ability.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Component_Ability message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Component_Ability
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Component_Ability & MODEL_ABI.Component_Ability.$Shape} Component_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Component_Ability.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Component_Ability(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.type = value;
                        else
                            delete message.type;
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        if (!(message.entity && message.entity.length))
                            message.entity = [];
                        message.entity.push(reader.stringVerify());
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Component_Ability message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Component_Ability
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Component_Ability & MODEL_ABI.Component_Ability.$Shape} Component_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Component_Ability.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Component_Ability message.
         * @function verify
         * @memberof MODEL_ABI.Component_Ability
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Component_Ability.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.entity != null && $Object.hasOwnProperty.call(message, "entity")) {
                if (!$Array.isArray(message.entity))
                    return "entity: array expected";
                for (let i = 0; i < message.entity.length; ++i)
                    if (!$util.isString(message.entity[i]))
                        return "entity: string[] expected";
            }
            return null;
        };

        /**
         * Creates a Component_Ability message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Component_Ability
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Component_Ability} Component_Ability
         */
        Component_Ability.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Component_Ability)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Component_Ability: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Component_Ability();
            if (object.type != null)
                if (typeof object.type !== "string" || object.type.length)
                    message.type = $String(object.type);
            if (object.entity) {
                if (!$Array.isArray(object.entity))
                    throw $TypeError(".MODEL_ABI.Component_Ability.entity: array expected");
                message.entity = $Array(object.entity.length);
                for (let i = 0; i < object.entity.length; ++i)
                    message.entity[i] = $String(object.entity[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a Component_Ability message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Component_Ability
         * @static
         * @param {MODEL_ABI.Component_Ability} message Component_Ability
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Component_Ability.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.entity = [];
            if (options.defaults)
                object.type = "";
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                object.type = message.type;
            if (message.entity && message.entity.length) {
                object.entity = $Array(message.entity.length);
                for (let j = 0; j < message.entity.length; ++j)
                    object.entity[j] = message.entity[j];
            }
            return object;
        };

        /**
         * Converts this Component_Ability to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Component_Ability
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Component_Ability.prototype.toJSON = function() {
            return Component_Ability.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Component_Ability
         * @function getTypeUrl
         * @memberof MODEL_ABI.Component_Ability
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Component_Ability.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Component_Ability";
        };

        return Component_Ability;
    })();

    MODEL_ABI.Controller_Ability = (function() {

        /**
         * Properties of a Controller_Ability.
         * @typedef {Object} MODEL_ABI.Controller_Ability.$Properties
         * @property {string|null} [version] Controller_Ability version
         * @property {Array.<MODEL_ABI.Component_Ability.$Properties>|null} [componentAbility] Controller_Ability componentAbility
         * @property {Array.<MODEL_ABI.Function_Ability.$Properties>|null} [functionAbility] Controller_Ability functionAbility
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Controller_Ability.
         * @memberof MODEL_ABI
         * @interface IController_Ability
         * @augments MODEL_ABI.Controller_Ability.$Properties
         * @deprecated Use MODEL_ABI.Controller_Ability.$Properties instead.
         */

        /**
         * Shape of a Controller_Ability.
         * @typedef {MODEL_ABI.Controller_Ability.$Properties} MODEL_ABI.Controller_Ability.$Shape
         */

        /**
         * Constructs a new Controller_Ability.
         * @memberof MODEL_ABI
         * @classdesc Represents a Controller_Ability.
         * @constructor
         * @param {MODEL_ABI.Controller_Ability.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Controller_Ability = function (properties) {
            this.componentAbility = [];
            this.functionAbility = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Controller_Ability version.
         * @member {string} version
         * @memberof MODEL_ABI.Controller_Ability
         * @instance
         */
        Controller_Ability.prototype.version = "";

        /**
         * Controller_Ability componentAbility.
         * @member {Array.<MODEL_ABI.Component_Ability.$Properties>} componentAbility
         * @memberof MODEL_ABI.Controller_Ability
         * @instance
         */
        Controller_Ability.prototype.componentAbility = $util.emptyArray;

        /**
         * Controller_Ability functionAbility.
         * @member {Array.<MODEL_ABI.Function_Ability.$Properties>} functionAbility
         * @memberof MODEL_ABI.Controller_Ability
         * @instance
         */
        Controller_Ability.prototype.functionAbility = $util.emptyArray;

        /**
         * Creates a new Controller_Ability instance using the specified properties.
         * @function create
         * @memberof MODEL_ABI.Controller_Ability
         * @static
         * @param {MODEL_ABI.Controller_Ability.$Properties=} [properties] Properties to set
         * @returns {MODEL_ABI.Controller_Ability} Controller_Ability instance
         * @type {{
         *   (properties: MODEL_ABI.Controller_Ability.$Shape): MODEL_ABI.Controller_Ability & MODEL_ABI.Controller_Ability.$Shape;
         *   (properties?: MODEL_ABI.Controller_Ability.$Properties): MODEL_ABI.Controller_Ability;
         * }}
         */
        Controller_Ability.create = function(properties) {
            return new Controller_Ability(properties);
        };

        /**
         * Encodes the specified Controller_Ability message. Does not implicitly {@link MODEL_ABI.Controller_Ability.verify|verify} messages.
         * @function encode
         * @memberof MODEL_ABI.Controller_Ability
         * @static
         * @param {MODEL_ABI.Controller_Ability.$Properties} message Controller_Ability message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Controller_Ability.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.version != null && $Object.hasOwnProperty.call(message, "version") && message.version !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.version);
            if (message.componentAbility != null && message.componentAbility.length)
                for (let i = 0; i < message.componentAbility.length; ++i)
                    $root.MODEL_ABI.Component_Ability.encode(message.componentAbility[i], writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.functionAbility != null && message.functionAbility.length)
                for (let i = 0; i < message.functionAbility.length; ++i)
                    $root.MODEL_ABI.Function_Ability.encode(message.functionAbility[i], writer.uint32(/* id 12, wireType 2 =*/98).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Controller_Ability message, length delimited. Does not implicitly {@link MODEL_ABI.Controller_Ability.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_ABI.Controller_Ability
         * @static
         * @param {MODEL_ABI.Controller_Ability.$Properties} message Controller_Ability message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Controller_Ability.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Controller_Ability message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_ABI.Controller_Ability
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_ABI.Controller_Ability & MODEL_ABI.Controller_Ability.$Shape} Controller_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Controller_Ability.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_ABI.Controller_Ability(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.version = value;
                        else
                            delete message.version;
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        if (!(message.componentAbility && message.componentAbility.length))
                            message.componentAbility = [];
                        message.componentAbility.push($root.MODEL_ABI.Component_Ability.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 12: {
                        if (wireType !== 2)
                            break;
                        if (!(message.functionAbility && message.functionAbility.length))
                            message.functionAbility = [];
                        message.functionAbility.push($root.MODEL_ABI.Function_Ability.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Controller_Ability message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_ABI.Controller_Ability
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Controller_Ability & MODEL_ABI.Controller_Ability.$Shape} Controller_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Controller_Ability.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Controller_Ability message.
         * @function verify
         * @memberof MODEL_ABI.Controller_Ability
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Controller_Ability.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.version != null && $Object.hasOwnProperty.call(message, "version"))
                if (!$util.isString(message.version))
                    return "version: string expected";
            if (message.componentAbility != null && $Object.hasOwnProperty.call(message, "componentAbility")) {
                if (!$Array.isArray(message.componentAbility))
                    return "componentAbility: array expected";
                for (let i = 0; i < message.componentAbility.length; ++i) {
                    let error = $root.MODEL_ABI.Component_Ability.verify(message.componentAbility[i], _depth + 1);
                    if (error)
                        return "componentAbility." + error;
                }
            }
            if (message.functionAbility != null && $Object.hasOwnProperty.call(message, "functionAbility")) {
                if (!$Array.isArray(message.functionAbility))
                    return "functionAbility: array expected";
                for (let i = 0; i < message.functionAbility.length; ++i) {
                    let error = $root.MODEL_ABI.Function_Ability.verify(message.functionAbility[i], _depth + 1);
                    if (error)
                        return "functionAbility." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Controller_Ability message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_ABI.Controller_Ability
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_ABI.Controller_Ability} Controller_Ability
         */
        Controller_Ability.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_ABI.Controller_Ability)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_ABI.Controller_Ability: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_ABI.Controller_Ability();
            if (object.version != null)
                if (typeof object.version !== "string" || object.version.length)
                    message.version = $String(object.version);
            if (object.componentAbility) {
                if (!$Array.isArray(object.componentAbility))
                    throw $TypeError(".MODEL_ABI.Controller_Ability.componentAbility: array expected");
                message.componentAbility = $Array(object.componentAbility.length);
                for (let i = 0; i < object.componentAbility.length; ++i) {
                    if (!$util.isObject(object.componentAbility[i]))
                        throw $TypeError(".MODEL_ABI.Controller_Ability.componentAbility: object expected");
                    message.componentAbility[i] = $root.MODEL_ABI.Component_Ability.fromObject(object.componentAbility[i], _depth + 1);
                }
            }
            if (object.functionAbility) {
                if (!$Array.isArray(object.functionAbility))
                    throw $TypeError(".MODEL_ABI.Controller_Ability.functionAbility: array expected");
                message.functionAbility = $Array(object.functionAbility.length);
                for (let i = 0; i < object.functionAbility.length; ++i) {
                    if (!$util.isObject(object.functionAbility[i]))
                        throw $TypeError(".MODEL_ABI.Controller_Ability.functionAbility: object expected");
                    message.functionAbility[i] = $root.MODEL_ABI.Function_Ability.fromObject(object.functionAbility[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Controller_Ability message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_ABI.Controller_Ability
         * @static
         * @param {MODEL_ABI.Controller_Ability} message Controller_Ability
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Controller_Ability.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults) {
                object.componentAbility = [];
                object.functionAbility = [];
            }
            if (options.defaults)
                object.version = "";
            if (message.version != null && $Object.hasOwnProperty.call(message, "version"))
                object.version = message.version;
            if (message.componentAbility && message.componentAbility.length) {
                object.componentAbility = $Array(message.componentAbility.length);
                for (let j = 0; j < message.componentAbility.length; ++j)
                    object.componentAbility[j] = $root.MODEL_ABI.Component_Ability.toObject(message.componentAbility[j], options, _depth + 1);
            }
            if (message.functionAbility && message.functionAbility.length) {
                object.functionAbility = $Array(message.functionAbility.length);
                for (let j = 0; j < message.functionAbility.length; ++j)
                    object.functionAbility[j] = $root.MODEL_ABI.Function_Ability.toObject(message.functionAbility[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Controller_Ability to JSON.
         * @function toJSON
         * @memberof MODEL_ABI.Controller_Ability
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Controller_Ability.prototype.toJSON = function() {
            return Controller_Ability.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Controller_Ability
         * @function getTypeUrl
         * @memberof MODEL_ABI.Controller_Ability
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Controller_Ability.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_ABI.Controller_Ability";
        };

        return Controller_Ability;
    })();

    return MODEL_ABI;
})();

export const MODEL_DES = $root.MODEL_DES = (() => {

    /**
     * Namespace MODEL_DES.
     * @exports MODEL_DES
     * @namespace
     */
    const MODEL_DES = {};

    /**
     * MESSAGE_ATTRIBUTE_TYPE enum.
     * @name MODEL_DES.MESSAGE_ATTRIBUTE_TYPE
     * @enum {number}
     * @property {number} BYTES_E=0 BYTES_E value
     * @property {number} STRING_E=1 STRING_E value
     * @property {number} IP_E=3 IP_E value
     * @property {number} BOOL_E=4 BOOL_E value
     * @property {number} INT32_E=5 INT32_E value
     * @property {number} UINT32_E=6 UINT32_E value
     * @property {number} INT64_E=7 INT64_E value
     * @property {number} UINT64_E=8 UINT64_E value
     * @property {number} FLOAT_E=9 FLOAT_E value
     * @property {number} DOUBLE_E=10 DOUBLE_E value
     * @property {number} FIXED_E=11 FIXED_E value
     * @property {number} DATA_COMBOX_E=12 DATA_COMBOX_E value
     */
    MODEL_DES.MESSAGE_ATTRIBUTE_TYPE = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "BYTES_E"] = 0;
        values[valuesById[1] = "STRING_E"] = 1;
        values[valuesById[3] = "IP_E"] = 3;
        values[valuesById[4] = "BOOL_E"] = 4;
        values[valuesById[5] = "INT32_E"] = 5;
        values[valuesById[6] = "UINT32_E"] = 6;
        values[valuesById[7] = "INT64_E"] = 7;
        values[valuesById[8] = "UINT64_E"] = 8;
        values[valuesById[9] = "FLOAT_E"] = 9;
        values[valuesById[10] = "DOUBLE_E"] = 10;
        values[valuesById[11] = "FIXED_E"] = 11;
        values[valuesById[12] = "DATA_COMBOX_E"] = 12;
        return values;
    })();

    /**
     * MESSAGE_ATTRIBUTE_OPTION enum.
     * @name MODEL_DES.MESSAGE_ATTRIBUTE_OPTION
     * @enum {number}
     * @property {number} REQUIRED_E=0 REQUIRED_E value
     * @property {number} OPTIONAL_E=1 OPTIONAL_E value
     */
    MODEL_DES.MESSAGE_ATTRIBUTE_OPTION = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "REQUIRED_E"] = 0;
        values[valuesById[1] = "OPTIONAL_E"] = 1;
        return values;
    })();

    /**
     * COMMON_ATTR_TYPE enum.
     * @name MODEL_DES.COMMON_ATTR_TYPE
     * @enum {number}
     * @property {number} COMBOX_E=0 COMBOX_E value
     * @property {number} ARRAY_E=1 ARRAY_E value
     */
    MODEL_DES.COMMON_ATTR_TYPE = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "COMBOX_E"] = 0;
        values[valuesById[1] = "ARRAY_E"] = 1;
        return values;
    })();

    MODEL_DES.Message_Combox_Item = (function() {

        /**
         * Properties of a Message_Combox_Item.
         * @typedef {Object} MODEL_DES.Message_Combox_Item.$Properties
         * @property {string|null} [key] Message_Combox_Item key
         * @property {string|null} [desc] Message_Combox_Item desc
         * @property {Array.<MODEL_DES.Message_Attribute.$Properties>|null} [arrayCmobEle] Message_Combox_Item arrayCmobEle
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Combox_Item.
         * @memberof MODEL_DES
         * @interface IMessage_Combox_Item
         * @augments MODEL_DES.Message_Combox_Item.$Properties
         * @deprecated Use MODEL_DES.Message_Combox_Item.$Properties instead.
         */

        /**
         * Shape of a Message_Combox_Item.
         * @typedef {MODEL_DES.Message_Combox_Item.$Properties} MODEL_DES.Message_Combox_Item.$Shape
         */

        /**
         * Constructs a new Message_Combox_Item.
         * @memberof MODEL_DES
         * @classdesc Represents a Message_Combox_Item.
         * @constructor
         * @param {MODEL_DES.Message_Combox_Item.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Combox_Item = function (properties) {
            this.arrayCmobEle = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Combox_Item key.
         * @member {string} key
         * @memberof MODEL_DES.Message_Combox_Item
         * @instance
         */
        Message_Combox_Item.prototype.key = "";

        /**
         * Message_Combox_Item desc.
         * @member {string} desc
         * @memberof MODEL_DES.Message_Combox_Item
         * @instance
         */
        Message_Combox_Item.prototype.desc = "";

        /**
         * Message_Combox_Item arrayCmobEle.
         * @member {Array.<MODEL_DES.Message_Attribute.$Properties>} arrayCmobEle
         * @memberof MODEL_DES.Message_Combox_Item
         * @instance
         */
        Message_Combox_Item.prototype.arrayCmobEle = $util.emptyArray;

        /**
         * Creates a new Message_Combox_Item instance using the specified properties.
         * @function create
         * @memberof MODEL_DES.Message_Combox_Item
         * @static
         * @param {MODEL_DES.Message_Combox_Item.$Properties=} [properties] Properties to set
         * @returns {MODEL_DES.Message_Combox_Item} Message_Combox_Item instance
         * @type {{
         *   (properties: MODEL_DES.Message_Combox_Item.$Shape): MODEL_DES.Message_Combox_Item & MODEL_DES.Message_Combox_Item.$Shape;
         *   (properties?: MODEL_DES.Message_Combox_Item.$Properties): MODEL_DES.Message_Combox_Item;
         * }}
         */
        Message_Combox_Item.create = function(properties) {
            return new Message_Combox_Item(properties);
        };

        /**
         * Encodes the specified Message_Combox_Item message. Does not implicitly {@link MODEL_DES.Message_Combox_Item.verify|verify} messages.
         * @function encode
         * @memberof MODEL_DES.Message_Combox_Item
         * @static
         * @param {MODEL_DES.Message_Combox_Item.$Properties} message Message_Combox_Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Combox_Item.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.desc);
            if (message.arrayCmobEle != null && message.arrayCmobEle.length)
                for (let i = 0; i < message.arrayCmobEle.length; ++i)
                    $root.MODEL_DES.Message_Attribute.encode(message.arrayCmobEle[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Combox_Item message, length delimited. Does not implicitly {@link MODEL_DES.Message_Combox_Item.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_DES.Message_Combox_Item
         * @static
         * @param {MODEL_DES.Message_Combox_Item.$Properties} message Message_Combox_Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Combox_Item.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Combox_Item message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_DES.Message_Combox_Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_DES.Message_Combox_Item & MODEL_DES.Message_Combox_Item.$Shape} Message_Combox_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Combox_Item.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_DES.Message_Combox_Item(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if (!(message.arrayCmobEle && message.arrayCmobEle.length))
                            message.arrayCmobEle = [];
                        message.arrayCmobEle.push($root.MODEL_DES.Message_Attribute.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Combox_Item message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_DES.Message_Combox_Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_DES.Message_Combox_Item & MODEL_DES.Message_Combox_Item.$Shape} Message_Combox_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Combox_Item.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Combox_Item message.
         * @function verify
         * @memberof MODEL_DES.Message_Combox_Item
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Combox_Item.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.arrayCmobEle != null && $Object.hasOwnProperty.call(message, "arrayCmobEle")) {
                if (!$Array.isArray(message.arrayCmobEle))
                    return "arrayCmobEle: array expected";
                for (let i = 0; i < message.arrayCmobEle.length; ++i) {
                    let error = $root.MODEL_DES.Message_Attribute.verify(message.arrayCmobEle[i], _depth + 1);
                    if (error)
                        return "arrayCmobEle." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Message_Combox_Item message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_DES.Message_Combox_Item
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_DES.Message_Combox_Item} Message_Combox_Item
         */
        Message_Combox_Item.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_DES.Message_Combox_Item)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_DES.Message_Combox_Item: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_DES.Message_Combox_Item();
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.arrayCmobEle) {
                if (!$Array.isArray(object.arrayCmobEle))
                    throw $TypeError(".MODEL_DES.Message_Combox_Item.arrayCmobEle: array expected");
                message.arrayCmobEle = $Array(object.arrayCmobEle.length);
                for (let i = 0; i < object.arrayCmobEle.length; ++i) {
                    if (!$util.isObject(object.arrayCmobEle[i]))
                        throw $TypeError(".MODEL_DES.Message_Combox_Item.arrayCmobEle: object expected");
                    message.arrayCmobEle[i] = $root.MODEL_DES.Message_Attribute.fromObject(object.arrayCmobEle[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_Combox_Item message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_DES.Message_Combox_Item
         * @static
         * @param {MODEL_DES.Message_Combox_Item} message Message_Combox_Item
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Combox_Item.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.arrayCmobEle = [];
            if (options.defaults) {
                object.key = "";
                object.desc = "";
            }
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.arrayCmobEle && message.arrayCmobEle.length) {
                object.arrayCmobEle = $Array(message.arrayCmobEle.length);
                for (let j = 0; j < message.arrayCmobEle.length; ++j)
                    object.arrayCmobEle[j] = $root.MODEL_DES.Message_Attribute.toObject(message.arrayCmobEle[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Message_Combox_Item to JSON.
         * @function toJSON
         * @memberof MODEL_DES.Message_Combox_Item
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Combox_Item.prototype.toJSON = function() {
            return Message_Combox_Item.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Combox_Item
         * @function getTypeUrl
         * @memberof MODEL_DES.Message_Combox_Item
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Combox_Item.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_DES.Message_Combox_Item";
        };

        return Message_Combox_Item;
    })();

    MODEL_DES.Message_Combox_Type = (function() {

        /**
         * Properties of a Message_Combox_Type.
         * @typedef {Object} MODEL_DES.Message_Combox_Type.$Properties
         * @property {string|null} [typeKey] Message_Combox_Type typeKey
         * @property {string|null} [typeDesc] Message_Combox_Type typeDesc
         * @property {Array.<MODEL_DES.Message_Combox_Item.$Properties>|null} [typeGroups] Message_Combox_Type typeGroups
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Combox_Type.
         * @memberof MODEL_DES
         * @interface IMessage_Combox_Type
         * @augments MODEL_DES.Message_Combox_Type.$Properties
         * @deprecated Use MODEL_DES.Message_Combox_Type.$Properties instead.
         */

        /**
         * Shape of a Message_Combox_Type.
         * @typedef {MODEL_DES.Message_Combox_Type.$Properties} MODEL_DES.Message_Combox_Type.$Shape
         */

        /**
         * Constructs a new Message_Combox_Type.
         * @memberof MODEL_DES
         * @classdesc Represents a Message_Combox_Type.
         * @constructor
         * @param {MODEL_DES.Message_Combox_Type.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Combox_Type = function (properties) {
            this.typeGroups = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Combox_Type typeKey.
         * @member {string} typeKey
         * @memberof MODEL_DES.Message_Combox_Type
         * @instance
         */
        Message_Combox_Type.prototype.typeKey = "";

        /**
         * Message_Combox_Type typeDesc.
         * @member {string} typeDesc
         * @memberof MODEL_DES.Message_Combox_Type
         * @instance
         */
        Message_Combox_Type.prototype.typeDesc = "";

        /**
         * Message_Combox_Type typeGroups.
         * @member {Array.<MODEL_DES.Message_Combox_Item.$Properties>} typeGroups
         * @memberof MODEL_DES.Message_Combox_Type
         * @instance
         */
        Message_Combox_Type.prototype.typeGroups = $util.emptyArray;

        /**
         * Creates a new Message_Combox_Type instance using the specified properties.
         * @function create
         * @memberof MODEL_DES.Message_Combox_Type
         * @static
         * @param {MODEL_DES.Message_Combox_Type.$Properties=} [properties] Properties to set
         * @returns {MODEL_DES.Message_Combox_Type} Message_Combox_Type instance
         * @type {{
         *   (properties: MODEL_DES.Message_Combox_Type.$Shape): MODEL_DES.Message_Combox_Type & MODEL_DES.Message_Combox_Type.$Shape;
         *   (properties?: MODEL_DES.Message_Combox_Type.$Properties): MODEL_DES.Message_Combox_Type;
         * }}
         */
        Message_Combox_Type.create = function(properties) {
            return new Message_Combox_Type(properties);
        };

        /**
         * Encodes the specified Message_Combox_Type message. Does not implicitly {@link MODEL_DES.Message_Combox_Type.verify|verify} messages.
         * @function encode
         * @memberof MODEL_DES.Message_Combox_Type
         * @static
         * @param {MODEL_DES.Message_Combox_Type.$Properties} message Message_Combox_Type message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Combox_Type.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.typeKey != null && $Object.hasOwnProperty.call(message, "typeKey") && message.typeKey !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.typeKey);
            if (message.typeDesc != null && $Object.hasOwnProperty.call(message, "typeDesc") && message.typeDesc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.typeDesc);
            if (message.typeGroups != null && message.typeGroups.length)
                for (let i = 0; i < message.typeGroups.length; ++i)
                    $root.MODEL_DES.Message_Combox_Item.encode(message.typeGroups[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Combox_Type message, length delimited. Does not implicitly {@link MODEL_DES.Message_Combox_Type.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_DES.Message_Combox_Type
         * @static
         * @param {MODEL_DES.Message_Combox_Type.$Properties} message Message_Combox_Type message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Combox_Type.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Combox_Type message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_DES.Message_Combox_Type
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_DES.Message_Combox_Type & MODEL_DES.Message_Combox_Type.$Shape} Message_Combox_Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Combox_Type.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_DES.Message_Combox_Type(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.typeKey = value;
                        else
                            delete message.typeKey;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.typeDesc = value;
                        else
                            delete message.typeDesc;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if (!(message.typeGroups && message.typeGroups.length))
                            message.typeGroups = [];
                        message.typeGroups.push($root.MODEL_DES.Message_Combox_Item.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Combox_Type message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_DES.Message_Combox_Type
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_DES.Message_Combox_Type & MODEL_DES.Message_Combox_Type.$Shape} Message_Combox_Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Combox_Type.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Combox_Type message.
         * @function verify
         * @memberof MODEL_DES.Message_Combox_Type
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Combox_Type.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.typeKey != null && $Object.hasOwnProperty.call(message, "typeKey"))
                if (!$util.isString(message.typeKey))
                    return "typeKey: string expected";
            if (message.typeDesc != null && $Object.hasOwnProperty.call(message, "typeDesc"))
                if (!$util.isString(message.typeDesc))
                    return "typeDesc: string expected";
            if (message.typeGroups != null && $Object.hasOwnProperty.call(message, "typeGroups")) {
                if (!$Array.isArray(message.typeGroups))
                    return "typeGroups: array expected";
                for (let i = 0; i < message.typeGroups.length; ++i) {
                    let error = $root.MODEL_DES.Message_Combox_Item.verify(message.typeGroups[i], _depth + 1);
                    if (error)
                        return "typeGroups." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Message_Combox_Type message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_DES.Message_Combox_Type
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_DES.Message_Combox_Type} Message_Combox_Type
         */
        Message_Combox_Type.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_DES.Message_Combox_Type)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_DES.Message_Combox_Type: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_DES.Message_Combox_Type();
            if (object.typeKey != null)
                if (typeof object.typeKey !== "string" || object.typeKey.length)
                    message.typeKey = $String(object.typeKey);
            if (object.typeDesc != null)
                if (typeof object.typeDesc !== "string" || object.typeDesc.length)
                    message.typeDesc = $String(object.typeDesc);
            if (object.typeGroups) {
                if (!$Array.isArray(object.typeGroups))
                    throw $TypeError(".MODEL_DES.Message_Combox_Type.typeGroups: array expected");
                message.typeGroups = $Array(object.typeGroups.length);
                for (let i = 0; i < object.typeGroups.length; ++i) {
                    if (!$util.isObject(object.typeGroups[i]))
                        throw $TypeError(".MODEL_DES.Message_Combox_Type.typeGroups: object expected");
                    message.typeGroups[i] = $root.MODEL_DES.Message_Combox_Item.fromObject(object.typeGroups[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_Combox_Type message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_DES.Message_Combox_Type
         * @static
         * @param {MODEL_DES.Message_Combox_Type} message Message_Combox_Type
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Combox_Type.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.typeGroups = [];
            if (options.defaults) {
                object.typeKey = "";
                object.typeDesc = "";
            }
            if (message.typeKey != null && $Object.hasOwnProperty.call(message, "typeKey"))
                object.typeKey = message.typeKey;
            if (message.typeDesc != null && $Object.hasOwnProperty.call(message, "typeDesc"))
                object.typeDesc = message.typeDesc;
            if (message.typeGroups && message.typeGroups.length) {
                object.typeGroups = $Array(message.typeGroups.length);
                for (let j = 0; j < message.typeGroups.length; ++j)
                    object.typeGroups[j] = $root.MODEL_DES.Message_Combox_Item.toObject(message.typeGroups[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Message_Combox_Type to JSON.
         * @function toJSON
         * @memberof MODEL_DES.Message_Combox_Type
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Combox_Type.prototype.toJSON = function() {
            return Message_Combox_Type.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Combox_Type
         * @function getTypeUrl
         * @memberof MODEL_DES.Message_Combox_Type
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Combox_Type.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_DES.Message_Combox_Type";
        };

        return Message_Combox_Type;
    })();

    MODEL_DES.Message_Attribute = (function() {

        /**
         * Properties of a Message_Attribute.
         * @typedef {Object} MODEL_DES.Message_Attribute.$Properties
         * @property {string|null} [key] Message_Attribute key
         * @property {MODEL_DES.MESSAGE_ATTRIBUTE_TYPE|null} [type] Message_Attribute type
         * @property {string|null} [stringValue] Message_Attribute stringValue
         * @property {boolean|null} [boolValue] Message_Attribute boolValue
         * @property {number|null} [int32Value] Message_Attribute int32Value
         * @property {number|null} [uint32Value] Message_Attribute uint32Value
         * @property {number|Long|null} [int64Value] Message_Attribute int64Value
         * @property {number|Long|null} [uint64Value] Message_Attribute uint64Value
         * @property {number|null} [floatValue] Message_Attribute floatValue
         * @property {number|null} [doubleValue] Message_Attribute doubleValue
         * @property {Uint8Array|null} [bytesValue] Message_Attribute bytesValue
         * @property {string|null} [stringFix] Message_Attribute stringFix
         * @property {MODEL_DES.Message_Combox_Type.$Properties|null} [comboType] Message_Attribute comboType
         * @property {Array.<string>|null} [fixedSource] Message_Attribute fixedSource
         * @property {string|null} [unit] Message_Attribute unit
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_Attribute.
         * @memberof MODEL_DES
         * @interface IMessage_Attribute
         * @augments MODEL_DES.Message_Attribute.$Properties
         * @deprecated Use MODEL_DES.Message_Attribute.$Properties instead.
         */

        /**
         * Shape of a Message_Attribute.
         * @typedef {MODEL_DES.Message_Attribute.$Properties} MODEL_DES.Message_Attribute.$Shape
         */

        /**
         * Constructs a new Message_Attribute.
         * @memberof MODEL_DES
         * @classdesc Represents a Message_Attribute.
         * @constructor
         * @param {MODEL_DES.Message_Attribute.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_Attribute = function (properties) {
            this.fixedSource = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_Attribute key.
         * @member {string} key
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.key = "";

        /**
         * Message_Attribute type.
         * @member {MODEL_DES.MESSAGE_ATTRIBUTE_TYPE} type
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.type = 0;

        /**
         * Message_Attribute stringValue.
         * @member {string} stringValue
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.stringValue = "";

        /**
         * Message_Attribute boolValue.
         * @member {boolean} boolValue
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.boolValue = false;

        /**
         * Message_Attribute int32Value.
         * @member {number} int32Value
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.int32Value = 0;

        /**
         * Message_Attribute uint32Value.
         * @member {number} uint32Value
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.uint32Value = 0;

        /**
         * Message_Attribute int64Value.
         * @member {number|Long} int64Value
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.int64Value = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Message_Attribute uint64Value.
         * @member {number|Long} uint64Value
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.uint64Value = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Message_Attribute floatValue.
         * @member {number} floatValue
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.floatValue = 0;

        /**
         * Message_Attribute doubleValue.
         * @member {number} doubleValue
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.doubleValue = 0;

        /**
         * Message_Attribute bytesValue.
         * @member {Uint8Array} bytesValue
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.bytesValue = $util.newBuffer([]);

        /**
         * Message_Attribute stringFix.
         * @member {string} stringFix
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.stringFix = "";

        /**
         * Message_Attribute comboType.
         * @member {MODEL_DES.Message_Combox_Type.$Properties|null|undefined} comboType
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.comboType = null;

        /**
         * Message_Attribute fixedSource.
         * @member {Array.<string>} fixedSource
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.fixedSource = $util.emptyArray;

        /**
         * Message_Attribute unit.
         * @member {string} unit
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         */
        Message_Attribute.prototype.unit = "";

        /**
         * Creates a new Message_Attribute instance using the specified properties.
         * @function create
         * @memberof MODEL_DES.Message_Attribute
         * @static
         * @param {MODEL_DES.Message_Attribute.$Properties=} [properties] Properties to set
         * @returns {MODEL_DES.Message_Attribute} Message_Attribute instance
         * @type {{
         *   (properties: MODEL_DES.Message_Attribute.$Shape): MODEL_DES.Message_Attribute & MODEL_DES.Message_Attribute.$Shape;
         *   (properties?: MODEL_DES.Message_Attribute.$Properties): MODEL_DES.Message_Attribute;
         * }}
         */
        Message_Attribute.create = function(properties) {
            return new Message_Attribute(properties);
        };

        /**
         * Encodes the specified Message_Attribute message. Does not implicitly {@link MODEL_DES.Message_Attribute.verify|verify} messages.
         * @function encode
         * @memberof MODEL_DES.Message_Attribute
         * @static
         * @param {MODEL_DES.Message_Attribute.$Properties} message Message_Attribute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Attribute.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.type != null && $Object.hasOwnProperty.call(message, "type") && message.type !== 0)
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.type);
            if (message.stringValue != null && $Object.hasOwnProperty.call(message, "stringValue") && message.stringValue !== "")
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.stringValue);
            if (message.boolValue != null && $Object.hasOwnProperty.call(message, "boolValue") && message.boolValue !== false)
                writer.uint32(/* id 12, wireType 0 =*/96).bool(message.boolValue);
            if (message.int32Value != null && $Object.hasOwnProperty.call(message, "int32Value") && message.int32Value !== 0)
                writer.uint32(/* id 13, wireType 0 =*/104).int32(message.int32Value);
            if (message.uint32Value != null && $Object.hasOwnProperty.call(message, "uint32Value") && message.uint32Value !== 0)
                writer.uint32(/* id 14, wireType 0 =*/112).uint32(message.uint32Value);
            if (message.int64Value != null && $Object.hasOwnProperty.call(message, "int64Value") && (typeof message.int64Value === "object" ? message.int64Value.low || message.int64Value.high : message.int64Value !== 0))
                writer.uint32(/* id 15, wireType 0 =*/120).int64(message.int64Value);
            if (message.uint64Value != null && $Object.hasOwnProperty.call(message, "uint64Value") && (typeof message.uint64Value === "object" ? message.uint64Value.low || message.uint64Value.high : message.uint64Value !== 0))
                writer.uint32(/* id 16, wireType 0 =*/128).uint64(message.uint64Value);
            if (message.floatValue != null && $Object.hasOwnProperty.call(message, "floatValue") && !$Object.is(message.floatValue, 0))
                writer.uint32(/* id 17, wireType 5 =*/141).float(message.floatValue);
            if (message.doubleValue != null && $Object.hasOwnProperty.call(message, "doubleValue") && !$Object.is(message.doubleValue, 0))
                writer.uint32(/* id 18, wireType 1 =*/145).double(message.doubleValue);
            if (message.bytesValue != null && $Object.hasOwnProperty.call(message, "bytesValue") && message.bytesValue.length)
                writer.uint32(/* id 19, wireType 2 =*/154).bytes(message.bytesValue);
            if (message.stringFix != null && $Object.hasOwnProperty.call(message, "stringFix") && message.stringFix !== "")
                writer.uint32(/* id 20, wireType 2 =*/162).string(message.stringFix);
            if (message.fixedSource != null && message.fixedSource.length)
                for (let i = 0; i < message.fixedSource.length; ++i)
                    writer.uint32(/* id 21, wireType 2 =*/170).string(message.fixedSource[i]);
            if (message.comboType != null && $Object.hasOwnProperty.call(message, "comboType"))
                $root.MODEL_DES.Message_Combox_Type.encode(message.comboType, writer.uint32(/* id 23, wireType 2 =*/186).fork(), _depth + 1).ldelim();
            if (message.unit != null && $Object.hasOwnProperty.call(message, "unit") && message.unit !== "")
                writer.uint32(/* id 50, wireType 2 =*/402).string(message.unit);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_Attribute message, length delimited. Does not implicitly {@link MODEL_DES.Message_Attribute.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_DES.Message_Attribute
         * @static
         * @param {MODEL_DES.Message_Attribute.$Properties} message Message_Attribute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_Attribute.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_Attribute message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_DES.Message_Attribute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_DES.Message_Attribute & MODEL_DES.Message_Attribute.$Shape} Message_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Attribute.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_DES.Message_Attribute(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 10: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.type = value;
                        else
                            delete message.type;
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.stringValue = value;
                        else
                            delete message.stringValue;
                        continue;
                    }
                case 12: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.boolValue = value;
                        else
                            delete message.boolValue;
                        continue;
                    }
                case 13: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.int32Value = value;
                        else
                            delete message.int32Value;
                        continue;
                    }
                case 14: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.uint32Value = value;
                        else
                            delete message.uint32Value;
                        continue;
                    }
                case 15: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                            message.int64Value = value;
                        else
                            delete message.int64Value;
                        continue;
                    }
                case 16: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.uint64Value = value;
                        else
                            delete message.uint64Value;
                        continue;
                    }
                case 17: {
                        if (wireType !== 5)
                            break;
                        if (!$Object.is(value = reader.float(), 0))
                            message.floatValue = value;
                        else
                            delete message.floatValue;
                        continue;
                    }
                case 18: {
                        if (wireType !== 1)
                            break;
                        if (!$Object.is(value = reader.double(), 0))
                            message.doubleValue = value;
                        else
                            delete message.doubleValue;
                        continue;
                    }
                case 19: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.bytesValue = value;
                        else
                            delete message.bytesValue;
                        continue;
                    }
                case 20: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.stringFix = value;
                        else
                            delete message.stringFix;
                        continue;
                    }
                case 23: {
                        if (wireType !== 2)
                            break;
                        message.comboType = $root.MODEL_DES.Message_Combox_Type.decode(reader, reader.uint32(), $undefined, _depth + 1, message.comboType);
                        continue;
                    }
                case 21: {
                        if (wireType !== 2)
                            break;
                        if (!(message.fixedSource && message.fixedSource.length))
                            message.fixedSource = [];
                        message.fixedSource.push(reader.stringVerify());
                        continue;
                    }
                case 50: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.unit = value;
                        else
                            delete message.unit;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_Attribute message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_DES.Message_Attribute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_DES.Message_Attribute & MODEL_DES.Message_Attribute.$Shape} Message_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_Attribute.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_Attribute message.
         * @function verify
         * @memberof MODEL_DES.Message_Attribute
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_Attribute.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                if (typeof message.type !== "number" || (message.type | 0) !== message.type)
                    return "type: enum value expected";
            if (message.stringValue != null && $Object.hasOwnProperty.call(message, "stringValue"))
                if (!$util.isString(message.stringValue))
                    return "stringValue: string expected";
            if (message.boolValue != null && $Object.hasOwnProperty.call(message, "boolValue"))
                if (typeof message.boolValue !== "boolean")
                    return "boolValue: boolean expected";
            if (message.int32Value != null && $Object.hasOwnProperty.call(message, "int32Value"))
                if (!$util.isInteger(message.int32Value))
                    return "int32Value: integer expected";
            if (message.uint32Value != null && $Object.hasOwnProperty.call(message, "uint32Value"))
                if (!$util.isInteger(message.uint32Value))
                    return "uint32Value: integer expected";
            if (message.int64Value != null && $Object.hasOwnProperty.call(message, "int64Value"))
                if (!$util.isInteger(message.int64Value) && !(message.int64Value && $util.isInteger(message.int64Value.low) && $util.isInteger(message.int64Value.high)))
                    return "int64Value: integer|Long expected";
            if (message.uint64Value != null && $Object.hasOwnProperty.call(message, "uint64Value"))
                if (!$util.isInteger(message.uint64Value) && !(message.uint64Value && $util.isInteger(message.uint64Value.low) && $util.isInteger(message.uint64Value.high)))
                    return "uint64Value: integer|Long expected";
            if (message.floatValue != null && $Object.hasOwnProperty.call(message, "floatValue"))
                if (typeof message.floatValue !== "number")
                    return "floatValue: number expected";
            if (message.doubleValue != null && $Object.hasOwnProperty.call(message, "doubleValue"))
                if (typeof message.doubleValue !== "number")
                    return "doubleValue: number expected";
            if (message.bytesValue != null && $Object.hasOwnProperty.call(message, "bytesValue"))
                if (!(message.bytesValue && typeof message.bytesValue.length === "number" || $util.isString(message.bytesValue)))
                    return "bytesValue: buffer expected";
            if (message.stringFix != null && $Object.hasOwnProperty.call(message, "stringFix"))
                if (!$util.isString(message.stringFix))
                    return "stringFix: string expected";
            if (message.comboType != null && $Object.hasOwnProperty.call(message, "comboType")) {
                let error = $root.MODEL_DES.Message_Combox_Type.verify(message.comboType, _depth + 1);
                if (error)
                    return "comboType." + error;
            }
            if (message.fixedSource != null && $Object.hasOwnProperty.call(message, "fixedSource")) {
                if (!$Array.isArray(message.fixedSource))
                    return "fixedSource: array expected";
                for (let i = 0; i < message.fixedSource.length; ++i)
                    if (!$util.isString(message.fixedSource[i]))
                        return "fixedSource: string[] expected";
            }
            if (message.unit != null && $Object.hasOwnProperty.call(message, "unit"))
                if (!$util.isString(message.unit))
                    return "unit: string expected";
            return null;
        };

        /**
         * Creates a Message_Attribute message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_DES.Message_Attribute
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_DES.Message_Attribute} Message_Attribute
         */
        Message_Attribute.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_DES.Message_Attribute)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_DES.Message_Attribute: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_DES.Message_Attribute();
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.type !== 0 && (typeof object.type !== "string" || $root.MODEL_DES.MESSAGE_ATTRIBUTE_TYPE[object.type] !== 0))
                switch (object.type) {
                case "BYTES_E":
                case 0:
                    message.type = 0;
                    break;
                case "STRING_E":
                case 1:
                    message.type = 1;
                    break;
                case "IP_E":
                case 3:
                    message.type = 3;
                    break;
                case "BOOL_E":
                case 4:
                    message.type = 4;
                    break;
                case "INT32_E":
                case 5:
                    message.type = 5;
                    break;
                case "UINT32_E":
                case 6:
                    message.type = 6;
                    break;
                case "INT64_E":
                case 7:
                    message.type = 7;
                    break;
                case "UINT64_E":
                case 8:
                    message.type = 8;
                    break;
                case "FLOAT_E":
                case 9:
                    message.type = 9;
                    break;
                case "DOUBLE_E":
                case 10:
                    message.type = 10;
                    break;
                case "FIXED_E":
                case 11:
                    message.type = 11;
                    break;
                case "DATA_COMBOX_E":
                case 12:
                    message.type = 12;
                    break;
                default:
                    if (typeof object.type === "number" && (object.type | 0) === object.type)
                        message.type = object.type;
                }
            if (object.stringValue != null)
                if (typeof object.stringValue !== "string" || object.stringValue.length)
                    message.stringValue = $String(object.stringValue);
            if (object.boolValue != null)
                if (object.boolValue)
                    message.boolValue = $Boolean(object.boolValue);
            if (object.int32Value != null)
                if ($Number(object.int32Value) !== 0)
                    message.int32Value = object.int32Value | 0;
            if (object.uint32Value != null)
                if ($Number(object.uint32Value) !== 0)
                    message.uint32Value = object.uint32Value >>> 0;
            if (object.int64Value != null)
                if (typeof object.int64Value === "object" ? object.int64Value.low || object.int64Value.high : $Number(object.int64Value) !== 0)
                    if ($util.Long)
                        message.int64Value = $util.Long.fromValue(object.int64Value, false);
                    else if (typeof object.int64Value === "string")
                        message.int64Value = $parseInt(object.int64Value, 10);
                    else if (typeof object.int64Value === "number")
                        message.int64Value = object.int64Value;
                    else if (typeof object.int64Value === "object")
                        message.int64Value = new $util.LongBits(object.int64Value.low >>> 0, object.int64Value.high >>> 0).toNumber();
            if (object.uint64Value != null)
                if (typeof object.uint64Value === "object" ? object.uint64Value.low || object.uint64Value.high : $Number(object.uint64Value) !== 0)
                    if ($util.Long)
                        message.uint64Value = $util.Long.fromValue(object.uint64Value, true);
                    else if (typeof object.uint64Value === "string")
                        message.uint64Value = $parseInt(object.uint64Value, 10);
                    else if (typeof object.uint64Value === "number")
                        message.uint64Value = object.uint64Value;
                    else if (typeof object.uint64Value === "object")
                        message.uint64Value = new $util.LongBits(object.uint64Value.low >>> 0, object.uint64Value.high >>> 0).toNumber(true);
            if (object.floatValue != null)
                if (!$Object.is($Number(object.floatValue), 0))
                    message.floatValue = $Number(object.floatValue);
            if (object.doubleValue != null)
                if (!$Object.is($Number(object.doubleValue), 0))
                    message.doubleValue = $Number(object.doubleValue);
            if (object.bytesValue != null)
                if (object.bytesValue.length)
                    if (typeof object.bytesValue === "string")
                        $util.base64.decode(object.bytesValue, message.bytesValue = $util.newBuffer($util.base64.length(object.bytesValue)), 0);
                    else if (object.bytesValue.length >= 0)
                        message.bytesValue = object.bytesValue;
            if (object.stringFix != null)
                if (typeof object.stringFix !== "string" || object.stringFix.length)
                    message.stringFix = $String(object.stringFix);
            if (object.comboType != null) {
                if (!$util.isObject(object.comboType))
                    throw $TypeError(".MODEL_DES.Message_Attribute.comboType: object expected");
                message.comboType = $root.MODEL_DES.Message_Combox_Type.fromObject(object.comboType, _depth + 1);
            }
            if (object.fixedSource) {
                if (!$Array.isArray(object.fixedSource))
                    throw $TypeError(".MODEL_DES.Message_Attribute.fixedSource: array expected");
                message.fixedSource = $Array(object.fixedSource.length);
                for (let i = 0; i < object.fixedSource.length; ++i)
                    message.fixedSource[i] = $String(object.fixedSource[i]);
            }
            if (object.unit != null)
                if (typeof object.unit !== "string" || object.unit.length)
                    message.unit = $String(object.unit);
            return message;
        };

        /**
         * Creates a plain object from a Message_Attribute message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_DES.Message_Attribute
         * @static
         * @param {MODEL_DES.Message_Attribute} message Message_Attribute
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_Attribute.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.fixedSource = [];
            if (options.defaults) {
                object.key = "";
                object.type = options.enums === $String ? "BYTES_E" : 0;
                object.stringValue = "";
                object.boolValue = false;
                object.int32Value = 0;
                object.uint32Value = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.int64Value = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.int64Value = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.uint64Value = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.uint64Value = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                object.floatValue = 0;
                object.doubleValue = 0;
                if (options.bytes === $String)
                    object.bytesValue = "";
                else {
                    object.bytesValue = [];
                    if (options.bytes !== $Array)
                        object.bytesValue = $util.newBuffer(object.bytesValue);
                }
                object.stringFix = "";
                object.comboType = null;
                object.unit = "";
            }
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                object.type = options.enums === $String ? $root.MODEL_DES.MESSAGE_ATTRIBUTE_TYPE[message.type] === $undefined ? message.type : $root.MODEL_DES.MESSAGE_ATTRIBUTE_TYPE[message.type] : message.type;
            if (message.stringValue != null && $Object.hasOwnProperty.call(message, "stringValue"))
                object.stringValue = message.stringValue;
            if (message.boolValue != null && $Object.hasOwnProperty.call(message, "boolValue"))
                object.boolValue = message.boolValue;
            if (message.int32Value != null && $Object.hasOwnProperty.call(message, "int32Value"))
                object.int32Value = message.int32Value;
            if (message.uint32Value != null && $Object.hasOwnProperty.call(message, "uint32Value"))
                object.uint32Value = message.uint32Value;
            if (message.int64Value != null && $Object.hasOwnProperty.call(message, "int64Value"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.int64Value = typeof message.int64Value === "number" ? $BigInt(message.int64Value) : $util.Long.fromBits(message.int64Value.low >>> 0, message.int64Value.high >>> 0, false).toBigInt();
                else if (typeof message.int64Value === "number")
                    object.int64Value = options.longs === $String ? $String(message.int64Value) : message.int64Value;
                else
                    object.int64Value = options.longs === $String ? $util.Long.prototype.toString.call(message.int64Value) : options.longs === $Number ? new $util.LongBits(message.int64Value.low >>> 0, message.int64Value.high >>> 0).toNumber() : message.int64Value;
            if (message.uint64Value != null && $Object.hasOwnProperty.call(message, "uint64Value"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.uint64Value = typeof message.uint64Value === "number" ? $BigInt(message.uint64Value) : $util.Long.fromBits(message.uint64Value.low >>> 0, message.uint64Value.high >>> 0, true).toBigInt();
                else if (typeof message.uint64Value === "number")
                    object.uint64Value = options.longs === $String ? $String(message.uint64Value) : message.uint64Value;
                else
                    object.uint64Value = options.longs === $String ? $util.Long.prototype.toString.call(message.uint64Value) : options.longs === $Number ? new $util.LongBits(message.uint64Value.low >>> 0, message.uint64Value.high >>> 0).toNumber(true) : message.uint64Value;
            if (message.floatValue != null && $Object.hasOwnProperty.call(message, "floatValue"))
                object.floatValue = options.json && !$isFinite(message.floatValue) ? $String(message.floatValue) : message.floatValue;
            if (message.doubleValue != null && $Object.hasOwnProperty.call(message, "doubleValue"))
                object.doubleValue = options.json && !$isFinite(message.doubleValue) ? $String(message.doubleValue) : message.doubleValue;
            if (message.bytesValue != null && $Object.hasOwnProperty.call(message, "bytesValue"))
                object.bytesValue = options.bytes === $String ? $util.base64.encode(message.bytesValue, 0, message.bytesValue.length) : options.bytes === $Array ? $Array.prototype.slice.call(message.bytesValue) : message.bytesValue;
            if (message.stringFix != null && $Object.hasOwnProperty.call(message, "stringFix"))
                object.stringFix = message.stringFix;
            if (message.fixedSource && message.fixedSource.length) {
                object.fixedSource = $Array(message.fixedSource.length);
                for (let j = 0; j < message.fixedSource.length; ++j)
                    object.fixedSource[j] = message.fixedSource[j];
            }
            if (message.comboType != null && $Object.hasOwnProperty.call(message, "comboType"))
                object.comboType = $root.MODEL_DES.Message_Combox_Type.toObject(message.comboType, options, _depth + 1);
            if (message.unit != null && $Object.hasOwnProperty.call(message, "unit"))
                object.unit = message.unit;
            return object;
        };

        /**
         * Converts this Message_Attribute to JSON.
         * @function toJSON
         * @memberof MODEL_DES.Message_Attribute
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_Attribute.prototype.toJSON = function() {
            return Message_Attribute.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_Attribute
         * @function getTypeUrl
         * @memberof MODEL_DES.Message_Attribute
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_Attribute.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_DES.Message_Attribute";
        };

        return Message_Attribute;
    })();

    MODEL_DES.Message_ComboAttr = (function() {

        /**
         * Properties of a Message_ComboAttr.
         * @typedef {Object} MODEL_DES.Message_ComboAttr.$Properties
         * @property {string|null} [combName] Message_ComboAttr combName
         * @property {string|null} [key] Message_ComboAttr key
         * @property {string|null} [desc] Message_ComboAttr desc
         * @property {Array.<MODEL_DES.Message_ArrayAttr.$Properties>|null} [arrayAttr] Message_ComboAttr arrayAttr
         * @property {Array.<MODEL_DES.Message_ComboAttr.$Properties>|null} [comboxAttr] Message_ComboAttr comboxAttr
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_ComboAttr.
         * @memberof MODEL_DES
         * @interface IMessage_ComboAttr
         * @augments MODEL_DES.Message_ComboAttr.$Properties
         * @deprecated Use MODEL_DES.Message_ComboAttr.$Properties instead.
         */

        /**
         * Shape of a Message_ComboAttr.
         * @typedef {MODEL_DES.Message_ComboAttr.$Properties} MODEL_DES.Message_ComboAttr.$Shape
         */

        /**
         * Constructs a new Message_ComboAttr.
         * @memberof MODEL_DES
         * @classdesc Represents a Message_ComboAttr.
         * @constructor
         * @param {MODEL_DES.Message_ComboAttr.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_ComboAttr = function (properties) {
            this.arrayAttr = [];
            this.comboxAttr = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_ComboAttr combName.
         * @member {string} combName
         * @memberof MODEL_DES.Message_ComboAttr
         * @instance
         */
        Message_ComboAttr.prototype.combName = "";

        /**
         * Message_ComboAttr key.
         * @member {string} key
         * @memberof MODEL_DES.Message_ComboAttr
         * @instance
         */
        Message_ComboAttr.prototype.key = "";

        /**
         * Message_ComboAttr desc.
         * @member {string} desc
         * @memberof MODEL_DES.Message_ComboAttr
         * @instance
         */
        Message_ComboAttr.prototype.desc = "";

        /**
         * Message_ComboAttr arrayAttr.
         * @member {Array.<MODEL_DES.Message_ArrayAttr.$Properties>} arrayAttr
         * @memberof MODEL_DES.Message_ComboAttr
         * @instance
         */
        Message_ComboAttr.prototype.arrayAttr = $util.emptyArray;

        /**
         * Message_ComboAttr comboxAttr.
         * @member {Array.<MODEL_DES.Message_ComboAttr.$Properties>} comboxAttr
         * @memberof MODEL_DES.Message_ComboAttr
         * @instance
         */
        Message_ComboAttr.prototype.comboxAttr = $util.emptyArray;

        /**
         * Creates a new Message_ComboAttr instance using the specified properties.
         * @function create
         * @memberof MODEL_DES.Message_ComboAttr
         * @static
         * @param {MODEL_DES.Message_ComboAttr.$Properties=} [properties] Properties to set
         * @returns {MODEL_DES.Message_ComboAttr} Message_ComboAttr instance
         * @type {{
         *   (properties: MODEL_DES.Message_ComboAttr.$Shape): MODEL_DES.Message_ComboAttr & MODEL_DES.Message_ComboAttr.$Shape;
         *   (properties?: MODEL_DES.Message_ComboAttr.$Properties): MODEL_DES.Message_ComboAttr;
         * }}
         */
        Message_ComboAttr.create = function(properties) {
            return new Message_ComboAttr(properties);
        };

        /**
         * Encodes the specified Message_ComboAttr message. Does not implicitly {@link MODEL_DES.Message_ComboAttr.verify|verify} messages.
         * @function encode
         * @memberof MODEL_DES.Message_ComboAttr
         * @static
         * @param {MODEL_DES.Message_ComboAttr.$Properties} message Message_ComboAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_ComboAttr.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.combName != null && $Object.hasOwnProperty.call(message, "combName") && message.combName !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.combName);
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.key);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.desc);
            if (message.arrayAttr != null && message.arrayAttr.length)
                for (let i = 0; i < message.arrayAttr.length; ++i)
                    $root.MODEL_DES.Message_ArrayAttr.encode(message.arrayAttr[i], writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
            if (message.comboxAttr != null && message.comboxAttr.length)
                for (let i = 0; i < message.comboxAttr.length; ++i)
                    $root.MODEL_DES.Message_ComboAttr.encode(message.comboxAttr[i], writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_ComboAttr message, length delimited. Does not implicitly {@link MODEL_DES.Message_ComboAttr.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_DES.Message_ComboAttr
         * @static
         * @param {MODEL_DES.Message_ComboAttr.$Properties} message Message_ComboAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_ComboAttr.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_ComboAttr message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_DES.Message_ComboAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_DES.Message_ComboAttr & MODEL_DES.Message_ComboAttr.$Shape} Message_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_ComboAttr.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_DES.Message_ComboAttr(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.combName = value;
                        else
                            delete message.combName;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        if (!(message.arrayAttr && message.arrayAttr.length))
                            message.arrayAttr = [];
                        message.arrayAttr.push($root.MODEL_DES.Message_ArrayAttr.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        if (!(message.comboxAttr && message.comboxAttr.length))
                            message.comboxAttr = [];
                        message.comboxAttr.push($root.MODEL_DES.Message_ComboAttr.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_ComboAttr message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_DES.Message_ComboAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_DES.Message_ComboAttr & MODEL_DES.Message_ComboAttr.$Shape} Message_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_ComboAttr.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_ComboAttr message.
         * @function verify
         * @memberof MODEL_DES.Message_ComboAttr
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_ComboAttr.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.combName != null && $Object.hasOwnProperty.call(message, "combName"))
                if (!$util.isString(message.combName))
                    return "combName: string expected";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.arrayAttr != null && $Object.hasOwnProperty.call(message, "arrayAttr")) {
                if (!$Array.isArray(message.arrayAttr))
                    return "arrayAttr: array expected";
                for (let i = 0; i < message.arrayAttr.length; ++i) {
                    let error = $root.MODEL_DES.Message_ArrayAttr.verify(message.arrayAttr[i], _depth + 1);
                    if (error)
                        return "arrayAttr." + error;
                }
            }
            if (message.comboxAttr != null && $Object.hasOwnProperty.call(message, "comboxAttr")) {
                if (!$Array.isArray(message.comboxAttr))
                    return "comboxAttr: array expected";
                for (let i = 0; i < message.comboxAttr.length; ++i) {
                    let error = $root.MODEL_DES.Message_ComboAttr.verify(message.comboxAttr[i], _depth + 1);
                    if (error)
                        return "comboxAttr." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Message_ComboAttr message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_DES.Message_ComboAttr
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_DES.Message_ComboAttr} Message_ComboAttr
         */
        Message_ComboAttr.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_DES.Message_ComboAttr)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_DES.Message_ComboAttr: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_DES.Message_ComboAttr();
            if (object.combName != null)
                if (typeof object.combName !== "string" || object.combName.length)
                    message.combName = $String(object.combName);
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.arrayAttr) {
                if (!$Array.isArray(object.arrayAttr))
                    throw $TypeError(".MODEL_DES.Message_ComboAttr.arrayAttr: array expected");
                message.arrayAttr = $Array(object.arrayAttr.length);
                for (let i = 0; i < object.arrayAttr.length; ++i) {
                    if (!$util.isObject(object.arrayAttr[i]))
                        throw $TypeError(".MODEL_DES.Message_ComboAttr.arrayAttr: object expected");
                    message.arrayAttr[i] = $root.MODEL_DES.Message_ArrayAttr.fromObject(object.arrayAttr[i], _depth + 1);
                }
            }
            if (object.comboxAttr) {
                if (!$Array.isArray(object.comboxAttr))
                    throw $TypeError(".MODEL_DES.Message_ComboAttr.comboxAttr: array expected");
                message.comboxAttr = $Array(object.comboxAttr.length);
                for (let i = 0; i < object.comboxAttr.length; ++i) {
                    if (!$util.isObject(object.comboxAttr[i]))
                        throw $TypeError(".MODEL_DES.Message_ComboAttr.comboxAttr: object expected");
                    message.comboxAttr[i] = $root.MODEL_DES.Message_ComboAttr.fromObject(object.comboxAttr[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_ComboAttr message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_DES.Message_ComboAttr
         * @static
         * @param {MODEL_DES.Message_ComboAttr} message Message_ComboAttr
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_ComboAttr.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults) {
                object.arrayAttr = [];
                object.comboxAttr = [];
            }
            if (options.defaults) {
                object.combName = "";
                object.key = "";
                object.desc = "";
            }
            if (message.combName != null && $Object.hasOwnProperty.call(message, "combName"))
                object.combName = message.combName;
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.arrayAttr && message.arrayAttr.length) {
                object.arrayAttr = $Array(message.arrayAttr.length);
                for (let j = 0; j < message.arrayAttr.length; ++j)
                    object.arrayAttr[j] = $root.MODEL_DES.Message_ArrayAttr.toObject(message.arrayAttr[j], options, _depth + 1);
            }
            if (message.comboxAttr && message.comboxAttr.length) {
                object.comboxAttr = $Array(message.comboxAttr.length);
                for (let j = 0; j < message.comboxAttr.length; ++j)
                    object.comboxAttr[j] = $root.MODEL_DES.Message_ComboAttr.toObject(message.comboxAttr[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Message_ComboAttr to JSON.
         * @function toJSON
         * @memberof MODEL_DES.Message_ComboAttr
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_ComboAttr.prototype.toJSON = function() {
            return Message_ComboAttr.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_ComboAttr
         * @function getTypeUrl
         * @memberof MODEL_DES.Message_ComboAttr
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_ComboAttr.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_DES.Message_ComboAttr";
        };

        return Message_ComboAttr;
    })();

    MODEL_DES.Message_ArrayAttr = (function() {

        /**
         * Properties of a Message_ArrayAttr.
         * @typedef {Object} MODEL_DES.Message_ArrayAttr.$Properties
         * @property {string|null} [groupKey] Message_ArrayAttr groupKey
         * @property {string|null} [groupName] Message_ArrayAttr groupName
         * @property {MODEL_DES.MESSAGE_ATTRIBUTE_OPTION|null} [option] Message_ArrayAttr option
         * @property {Array.<MODEL_DES.Message_Attribute.$Properties>|null} [attrParams] Message_ArrayAttr attrParams
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_ArrayAttr.
         * @memberof MODEL_DES
         * @interface IMessage_ArrayAttr
         * @augments MODEL_DES.Message_ArrayAttr.$Properties
         * @deprecated Use MODEL_DES.Message_ArrayAttr.$Properties instead.
         */

        /**
         * Shape of a Message_ArrayAttr.
         * @typedef {MODEL_DES.Message_ArrayAttr.$Properties} MODEL_DES.Message_ArrayAttr.$Shape
         */

        /**
         * Constructs a new Message_ArrayAttr.
         * @memberof MODEL_DES
         * @classdesc Represents a Message_ArrayAttr.
         * @constructor
         * @param {MODEL_DES.Message_ArrayAttr.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_ArrayAttr = function (properties) {
            this.attrParams = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_ArrayAttr groupKey.
         * @member {string} groupKey
         * @memberof MODEL_DES.Message_ArrayAttr
         * @instance
         */
        Message_ArrayAttr.prototype.groupKey = "";

        /**
         * Message_ArrayAttr groupName.
         * @member {string} groupName
         * @memberof MODEL_DES.Message_ArrayAttr
         * @instance
         */
        Message_ArrayAttr.prototype.groupName = "";

        /**
         * Message_ArrayAttr option.
         * @member {MODEL_DES.MESSAGE_ATTRIBUTE_OPTION} option
         * @memberof MODEL_DES.Message_ArrayAttr
         * @instance
         */
        Message_ArrayAttr.prototype.option = 0;

        /**
         * Message_ArrayAttr attrParams.
         * @member {Array.<MODEL_DES.Message_Attribute.$Properties>} attrParams
         * @memberof MODEL_DES.Message_ArrayAttr
         * @instance
         */
        Message_ArrayAttr.prototype.attrParams = $util.emptyArray;

        /**
         * Creates a new Message_ArrayAttr instance using the specified properties.
         * @function create
         * @memberof MODEL_DES.Message_ArrayAttr
         * @static
         * @param {MODEL_DES.Message_ArrayAttr.$Properties=} [properties] Properties to set
         * @returns {MODEL_DES.Message_ArrayAttr} Message_ArrayAttr instance
         * @type {{
         *   (properties: MODEL_DES.Message_ArrayAttr.$Shape): MODEL_DES.Message_ArrayAttr & MODEL_DES.Message_ArrayAttr.$Shape;
         *   (properties?: MODEL_DES.Message_ArrayAttr.$Properties): MODEL_DES.Message_ArrayAttr;
         * }}
         */
        Message_ArrayAttr.create = function(properties) {
            return new Message_ArrayAttr(properties);
        };

        /**
         * Encodes the specified Message_ArrayAttr message. Does not implicitly {@link MODEL_DES.Message_ArrayAttr.verify|verify} messages.
         * @function encode
         * @memberof MODEL_DES.Message_ArrayAttr
         * @static
         * @param {MODEL_DES.Message_ArrayAttr.$Properties} message Message_ArrayAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_ArrayAttr.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.groupName != null && $Object.hasOwnProperty.call(message, "groupName") && message.groupName !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.groupName);
            if (message.option != null && $Object.hasOwnProperty.call(message, "option") && message.option !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.option);
            if (message.groupKey != null && $Object.hasOwnProperty.call(message, "groupKey") && message.groupKey !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.groupKey);
            if (message.attrParams != null && message.attrParams.length)
                for (let i = 0; i < message.attrParams.length; ++i)
                    $root.MODEL_DES.Message_Attribute.encode(message.attrParams[i], writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_ArrayAttr message, length delimited. Does not implicitly {@link MODEL_DES.Message_ArrayAttr.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_DES.Message_ArrayAttr
         * @static
         * @param {MODEL_DES.Message_ArrayAttr.$Properties} message Message_ArrayAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_ArrayAttr.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_ArrayAttr message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_DES.Message_ArrayAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_DES.Message_ArrayAttr & MODEL_DES.Message_ArrayAttr.$Shape} Message_ArrayAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_ArrayAttr.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_DES.Message_ArrayAttr(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.groupKey = value;
                        else
                            delete message.groupKey;
                        continue;
                    }
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.groupName = value;
                        else
                            delete message.groupName;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.option = value;
                        else
                            delete message.option;
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        if (!(message.attrParams && message.attrParams.length))
                            message.attrParams = [];
                        message.attrParams.push($root.MODEL_DES.Message_Attribute.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_ArrayAttr message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_DES.Message_ArrayAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_DES.Message_ArrayAttr & MODEL_DES.Message_ArrayAttr.$Shape} Message_ArrayAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_ArrayAttr.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_ArrayAttr message.
         * @function verify
         * @memberof MODEL_DES.Message_ArrayAttr
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_ArrayAttr.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.groupKey != null && $Object.hasOwnProperty.call(message, "groupKey"))
                if (!$util.isString(message.groupKey))
                    return "groupKey: string expected";
            if (message.groupName != null && $Object.hasOwnProperty.call(message, "groupName"))
                if (!$util.isString(message.groupName))
                    return "groupName: string expected";
            if (message.option != null && $Object.hasOwnProperty.call(message, "option"))
                if (typeof message.option !== "number" || (message.option | 0) !== message.option)
                    return "option: enum value expected";
            if (message.attrParams != null && $Object.hasOwnProperty.call(message, "attrParams")) {
                if (!$Array.isArray(message.attrParams))
                    return "attrParams: array expected";
                for (let i = 0; i < message.attrParams.length; ++i) {
                    let error = $root.MODEL_DES.Message_Attribute.verify(message.attrParams[i], _depth + 1);
                    if (error)
                        return "attrParams." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Message_ArrayAttr message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_DES.Message_ArrayAttr
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_DES.Message_ArrayAttr} Message_ArrayAttr
         */
        Message_ArrayAttr.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_DES.Message_ArrayAttr)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_DES.Message_ArrayAttr: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_DES.Message_ArrayAttr();
            if (object.groupKey != null)
                if (typeof object.groupKey !== "string" || object.groupKey.length)
                    message.groupKey = $String(object.groupKey);
            if (object.groupName != null)
                if (typeof object.groupName !== "string" || object.groupName.length)
                    message.groupName = $String(object.groupName);
            if (object.option !== 0 && (typeof object.option !== "string" || $root.MODEL_DES.MESSAGE_ATTRIBUTE_OPTION[object.option] !== 0))
                switch (object.option) {
                case "REQUIRED_E":
                case 0:
                    message.option = 0;
                    break;
                case "OPTIONAL_E":
                case 1:
                    message.option = 1;
                    break;
                default:
                    if (typeof object.option === "number" && (object.option | 0) === object.option)
                        message.option = object.option;
                }
            if (object.attrParams) {
                if (!$Array.isArray(object.attrParams))
                    throw $TypeError(".MODEL_DES.Message_ArrayAttr.attrParams: array expected");
                message.attrParams = $Array(object.attrParams.length);
                for (let i = 0; i < object.attrParams.length; ++i) {
                    if (!$util.isObject(object.attrParams[i]))
                        throw $TypeError(".MODEL_DES.Message_ArrayAttr.attrParams: object expected");
                    message.attrParams[i] = $root.MODEL_DES.Message_Attribute.fromObject(object.attrParams[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Message_ArrayAttr message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_DES.Message_ArrayAttr
         * @static
         * @param {MODEL_DES.Message_ArrayAttr} message Message_ArrayAttr
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_ArrayAttr.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.attrParams = [];
            if (options.defaults) {
                object.groupName = "";
                object.option = options.enums === $String ? "REQUIRED_E" : 0;
                object.groupKey = "";
            }
            if (message.groupName != null && $Object.hasOwnProperty.call(message, "groupName"))
                object.groupName = message.groupName;
            if (message.option != null && $Object.hasOwnProperty.call(message, "option"))
                object.option = options.enums === $String ? $root.MODEL_DES.MESSAGE_ATTRIBUTE_OPTION[message.option] === $undefined ? message.option : $root.MODEL_DES.MESSAGE_ATTRIBUTE_OPTION[message.option] : message.option;
            if (message.groupKey != null && $Object.hasOwnProperty.call(message, "groupKey"))
                object.groupKey = message.groupKey;
            if (message.attrParams && message.attrParams.length) {
                object.attrParams = $Array(message.attrParams.length);
                for (let j = 0; j < message.attrParams.length; ++j)
                    object.attrParams[j] = $root.MODEL_DES.Message_Attribute.toObject(message.attrParams[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Message_ArrayAttr to JSON.
         * @function toJSON
         * @memberof MODEL_DES.Message_ArrayAttr
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_ArrayAttr.prototype.toJSON = function() {
            return Message_ArrayAttr.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_ArrayAttr
         * @function getTypeUrl
         * @memberof MODEL_DES.Message_ArrayAttr
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_ArrayAttr.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_DES.Message_ArrayAttr";
        };

        return Message_ArrayAttr;
    })();

    MODEL_DES.Message_CommonAttr = (function() {

        /**
         * Properties of a Message_CommonAttr.
         * @typedef {Object} MODEL_DES.Message_CommonAttr.$Properties
         * @property {string|null} [key] Message_CommonAttr key
         * @property {MODEL_DES.COMMON_ATTR_TYPE|null} [type] Message_CommonAttr type
         * @property {MODEL_DES.Message_ComboAttr.$Properties|null} [comboxParam] Message_CommonAttr comboxParam
         * @property {MODEL_DES.Message_ArrayAttr.$Properties|null} [arrayParam] Message_CommonAttr arrayParam
         * @property {boolean|null} [cloneEnable] Message_CommonAttr cloneEnable
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Message_CommonAttr.
         * @memberof MODEL_DES
         * @interface IMessage_CommonAttr
         * @augments MODEL_DES.Message_CommonAttr.$Properties
         * @deprecated Use MODEL_DES.Message_CommonAttr.$Properties instead.
         */

        /**
         * Shape of a Message_CommonAttr.
         * @typedef {MODEL_DES.Message_CommonAttr.$Properties} MODEL_DES.Message_CommonAttr.$Shape
         */

        /**
         * Constructs a new Message_CommonAttr.
         * @memberof MODEL_DES
         * @classdesc Represents a Message_CommonAttr.
         * @constructor
         * @param {MODEL_DES.Message_CommonAttr.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Message_CommonAttr = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Message_CommonAttr key.
         * @member {string} key
         * @memberof MODEL_DES.Message_CommonAttr
         * @instance
         */
        Message_CommonAttr.prototype.key = "";

        /**
         * Message_CommonAttr type.
         * @member {MODEL_DES.COMMON_ATTR_TYPE} type
         * @memberof MODEL_DES.Message_CommonAttr
         * @instance
         */
        Message_CommonAttr.prototype.type = 0;

        /**
         * Message_CommonAttr comboxParam.
         * @member {MODEL_DES.Message_ComboAttr.$Properties|null|undefined} comboxParam
         * @memberof MODEL_DES.Message_CommonAttr
         * @instance
         */
        Message_CommonAttr.prototype.comboxParam = null;

        /**
         * Message_CommonAttr arrayParam.
         * @member {MODEL_DES.Message_ArrayAttr.$Properties|null|undefined} arrayParam
         * @memberof MODEL_DES.Message_CommonAttr
         * @instance
         */
        Message_CommonAttr.prototype.arrayParam = null;

        /**
         * Message_CommonAttr cloneEnable.
         * @member {boolean} cloneEnable
         * @memberof MODEL_DES.Message_CommonAttr
         * @instance
         */
        Message_CommonAttr.prototype.cloneEnable = false;

        /**
         * Creates a new Message_CommonAttr instance using the specified properties.
         * @function create
         * @memberof MODEL_DES.Message_CommonAttr
         * @static
         * @param {MODEL_DES.Message_CommonAttr.$Properties=} [properties] Properties to set
         * @returns {MODEL_DES.Message_CommonAttr} Message_CommonAttr instance
         * @type {{
         *   (properties: MODEL_DES.Message_CommonAttr.$Shape): MODEL_DES.Message_CommonAttr & MODEL_DES.Message_CommonAttr.$Shape;
         *   (properties?: MODEL_DES.Message_CommonAttr.$Properties): MODEL_DES.Message_CommonAttr;
         * }}
         */
        Message_CommonAttr.create = function(properties) {
            return new Message_CommonAttr(properties);
        };

        /**
         * Encodes the specified Message_CommonAttr message. Does not implicitly {@link MODEL_DES.Message_CommonAttr.verify|verify} messages.
         * @function encode
         * @memberof MODEL_DES.Message_CommonAttr
         * @static
         * @param {MODEL_DES.Message_CommonAttr.$Properties} message Message_CommonAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_CommonAttr.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.type != null && $Object.hasOwnProperty.call(message, "type") && message.type !== 0)
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.type);
            if (message.comboxParam != null && $Object.hasOwnProperty.call(message, "comboxParam"))
                $root.MODEL_DES.Message_ComboAttr.encode(message.comboxParam, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.arrayParam != null && $Object.hasOwnProperty.call(message, "arrayParam"))
                $root.MODEL_DES.Message_ArrayAttr.encode(message.arrayParam, writer.uint32(/* id 12, wireType 2 =*/98).fork(), _depth + 1).ldelim();
            if (message.cloneEnable != null && $Object.hasOwnProperty.call(message, "cloneEnable") && message.cloneEnable !== false)
                writer.uint32(/* id 32, wireType 0 =*/256).bool(message.cloneEnable);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Message_CommonAttr message, length delimited. Does not implicitly {@link MODEL_DES.Message_CommonAttr.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_DES.Message_CommonAttr
         * @static
         * @param {MODEL_DES.Message_CommonAttr.$Properties} message Message_CommonAttr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message_CommonAttr.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Message_CommonAttr message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_DES.Message_CommonAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_DES.Message_CommonAttr & MODEL_DES.Message_CommonAttr.$Shape} Message_CommonAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_CommonAttr.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_DES.Message_CommonAttr(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 10: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.type = value;
                        else
                            delete message.type;
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        message.comboxParam = $root.MODEL_DES.Message_ComboAttr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.comboxParam);
                        continue;
                    }
                case 12: {
                        if (wireType !== 2)
                            break;
                        message.arrayParam = $root.MODEL_DES.Message_ArrayAttr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.arrayParam);
                        continue;
                    }
                case 32: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.cloneEnable = value;
                        else
                            delete message.cloneEnable;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Message_CommonAttr message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_DES.Message_CommonAttr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_DES.Message_CommonAttr & MODEL_DES.Message_CommonAttr.$Shape} Message_CommonAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message_CommonAttr.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message_CommonAttr message.
         * @function verify
         * @memberof MODEL_DES.Message_CommonAttr
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message_CommonAttr.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                if (typeof message.type !== "number" || (message.type | 0) !== message.type)
                    return "type: enum value expected";
            if (message.comboxParam != null && $Object.hasOwnProperty.call(message, "comboxParam")) {
                let error = $root.MODEL_DES.Message_ComboAttr.verify(message.comboxParam, _depth + 1);
                if (error)
                    return "comboxParam." + error;
            }
            if (message.arrayParam != null && $Object.hasOwnProperty.call(message, "arrayParam")) {
                let error = $root.MODEL_DES.Message_ArrayAttr.verify(message.arrayParam, _depth + 1);
                if (error)
                    return "arrayParam." + error;
            }
            if (message.cloneEnable != null && $Object.hasOwnProperty.call(message, "cloneEnable"))
                if (typeof message.cloneEnable !== "boolean")
                    return "cloneEnable: boolean expected";
            return null;
        };

        /**
         * Creates a Message_CommonAttr message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_DES.Message_CommonAttr
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_DES.Message_CommonAttr} Message_CommonAttr
         */
        Message_CommonAttr.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_DES.Message_CommonAttr)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_DES.Message_CommonAttr: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_DES.Message_CommonAttr();
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.type !== 0 && (typeof object.type !== "string" || $root.MODEL_DES.COMMON_ATTR_TYPE[object.type] !== 0))
                switch (object.type) {
                case "COMBOX_E":
                case 0:
                    message.type = 0;
                    break;
                case "ARRAY_E":
                case 1:
                    message.type = 1;
                    break;
                default:
                    if (typeof object.type === "number" && (object.type | 0) === object.type)
                        message.type = object.type;
                }
            if (object.comboxParam != null) {
                if (!$util.isObject(object.comboxParam))
                    throw $TypeError(".MODEL_DES.Message_CommonAttr.comboxParam: object expected");
                message.comboxParam = $root.MODEL_DES.Message_ComboAttr.fromObject(object.comboxParam, _depth + 1);
            }
            if (object.arrayParam != null) {
                if (!$util.isObject(object.arrayParam))
                    throw $TypeError(".MODEL_DES.Message_CommonAttr.arrayParam: object expected");
                message.arrayParam = $root.MODEL_DES.Message_ArrayAttr.fromObject(object.arrayParam, _depth + 1);
            }
            if (object.cloneEnable != null)
                if (object.cloneEnable)
                    message.cloneEnable = $Boolean(object.cloneEnable);
            return message;
        };

        /**
         * Creates a plain object from a Message_CommonAttr message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_DES.Message_CommonAttr
         * @static
         * @param {MODEL_DES.Message_CommonAttr} message Message_CommonAttr
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message_CommonAttr.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.key = "";
                object.type = options.enums === $String ? "COMBOX_E" : 0;
                object.comboxParam = null;
                object.arrayParam = null;
                object.cloneEnable = false;
            }
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                object.type = options.enums === $String ? $root.MODEL_DES.COMMON_ATTR_TYPE[message.type] === $undefined ? message.type : $root.MODEL_DES.COMMON_ATTR_TYPE[message.type] : message.type;
            if (message.comboxParam != null && $Object.hasOwnProperty.call(message, "comboxParam"))
                object.comboxParam = $root.MODEL_DES.Message_ComboAttr.toObject(message.comboxParam, options, _depth + 1);
            if (message.arrayParam != null && $Object.hasOwnProperty.call(message, "arrayParam"))
                object.arrayParam = $root.MODEL_DES.Message_ArrayAttr.toObject(message.arrayParam, options, _depth + 1);
            if (message.cloneEnable != null && $Object.hasOwnProperty.call(message, "cloneEnable"))
                object.cloneEnable = message.cloneEnable;
            return object;
        };

        /**
         * Converts this Message_CommonAttr to JSON.
         * @function toJSON
         * @memberof MODEL_DES.Message_CommonAttr
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message_CommonAttr.prototype.toJSON = function() {
            return Message_CommonAttr.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Message_CommonAttr
         * @function getTypeUrl
         * @memberof MODEL_DES.Message_CommonAttr
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Message_CommonAttr.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_DES.Message_CommonAttr";
        };

        return Message_CommonAttr;
    })();

    MODEL_DES.Robot_Child_Function = (function() {

        /**
         * Properties of a Robot_Child_Function.
         * @typedef {Object} MODEL_DES.Robot_Child_Function.$Properties
         * @property {string|null} [type] Robot_Child_Function type
         * @property {string|null} [desc] Robot_Child_Function desc
         * @property {string|null} [key] Robot_Child_Function key
         * @property {Array.<MODEL_DES.Message_CommonAttr.$Properties>|null} [attr] Robot_Child_Function attr
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Robot_Child_Function.
         * @memberof MODEL_DES
         * @interface IRobot_Child_Function
         * @augments MODEL_DES.Robot_Child_Function.$Properties
         * @deprecated Use MODEL_DES.Robot_Child_Function.$Properties instead.
         */

        /**
         * Shape of a Robot_Child_Function.
         * @typedef {MODEL_DES.Robot_Child_Function.$Properties} MODEL_DES.Robot_Child_Function.$Shape
         */

        /**
         * Constructs a new Robot_Child_Function.
         * @memberof MODEL_DES
         * @classdesc Represents a Robot_Child_Function.
         * @constructor
         * @param {MODEL_DES.Robot_Child_Function.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Robot_Child_Function = function (properties) {
            this.attr = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Robot_Child_Function type.
         * @member {string} type
         * @memberof MODEL_DES.Robot_Child_Function
         * @instance
         */
        Robot_Child_Function.prototype.type = "";

        /**
         * Robot_Child_Function desc.
         * @member {string} desc
         * @memberof MODEL_DES.Robot_Child_Function
         * @instance
         */
        Robot_Child_Function.prototype.desc = "";

        /**
         * Robot_Child_Function key.
         * @member {string} key
         * @memberof MODEL_DES.Robot_Child_Function
         * @instance
         */
        Robot_Child_Function.prototype.key = "";

        /**
         * Robot_Child_Function attr.
         * @member {Array.<MODEL_DES.Message_CommonAttr.$Properties>} attr
         * @memberof MODEL_DES.Robot_Child_Function
         * @instance
         */
        Robot_Child_Function.prototype.attr = $util.emptyArray;

        /**
         * Creates a new Robot_Child_Function instance using the specified properties.
         * @function create
         * @memberof MODEL_DES.Robot_Child_Function
         * @static
         * @param {MODEL_DES.Robot_Child_Function.$Properties=} [properties] Properties to set
         * @returns {MODEL_DES.Robot_Child_Function} Robot_Child_Function instance
         * @type {{
         *   (properties: MODEL_DES.Robot_Child_Function.$Shape): MODEL_DES.Robot_Child_Function & MODEL_DES.Robot_Child_Function.$Shape;
         *   (properties?: MODEL_DES.Robot_Child_Function.$Properties): MODEL_DES.Robot_Child_Function;
         * }}
         */
        Robot_Child_Function.create = function(properties) {
            return new Robot_Child_Function(properties);
        };

        /**
         * Encodes the specified Robot_Child_Function message. Does not implicitly {@link MODEL_DES.Robot_Child_Function.verify|verify} messages.
         * @function encode
         * @memberof MODEL_DES.Robot_Child_Function
         * @static
         * @param {MODEL_DES.Robot_Child_Function.$Properties} message Robot_Child_Function message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Robot_Child_Function.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.type != null && $Object.hasOwnProperty.call(message, "type") && message.type !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.desc);
            if (message.key != null && $Object.hasOwnProperty.call(message, "key") && message.key !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.key);
            if (message.attr != null && message.attr.length)
                for (let i = 0; i < message.attr.length; ++i)
                    $root.MODEL_DES.Message_CommonAttr.encode(message.attr[i], writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Robot_Child_Function message, length delimited. Does not implicitly {@link MODEL_DES.Robot_Child_Function.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_DES.Robot_Child_Function
         * @static
         * @param {MODEL_DES.Robot_Child_Function.$Properties} message Robot_Child_Function message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Robot_Child_Function.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Robot_Child_Function message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_DES.Robot_Child_Function
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_DES.Robot_Child_Function & MODEL_DES.Robot_Child_Function.$Shape} Robot_Child_Function
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Robot_Child_Function.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_DES.Robot_Child_Function(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.type = value;
                        else
                            delete message.type;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.key = value;
                        else
                            delete message.key;
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        if (!(message.attr && message.attr.length))
                            message.attr = [];
                        message.attr.push($root.MODEL_DES.Message_CommonAttr.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Robot_Child_Function message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_DES.Robot_Child_Function
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_DES.Robot_Child_Function & MODEL_DES.Robot_Child_Function.$Shape} Robot_Child_Function
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Robot_Child_Function.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Robot_Child_Function message.
         * @function verify
         * @memberof MODEL_DES.Robot_Child_Function
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Robot_Child_Function.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.attr != null && $Object.hasOwnProperty.call(message, "attr")) {
                if (!$Array.isArray(message.attr))
                    return "attr: array expected";
                for (let i = 0; i < message.attr.length; ++i) {
                    let error = $root.MODEL_DES.Message_CommonAttr.verify(message.attr[i], _depth + 1);
                    if (error)
                        return "attr." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Robot_Child_Function message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_DES.Robot_Child_Function
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_DES.Robot_Child_Function} Robot_Child_Function
         */
        Robot_Child_Function.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_DES.Robot_Child_Function)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_DES.Robot_Child_Function: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_DES.Robot_Child_Function();
            if (object.type != null)
                if (typeof object.type !== "string" || object.type.length)
                    message.type = $String(object.type);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.key != null)
                if (typeof object.key !== "string" || object.key.length)
                    message.key = $String(object.key);
            if (object.attr) {
                if (!$Array.isArray(object.attr))
                    throw $TypeError(".MODEL_DES.Robot_Child_Function.attr: array expected");
                message.attr = $Array(object.attr.length);
                for (let i = 0; i < object.attr.length; ++i) {
                    if (!$util.isObject(object.attr[i]))
                        throw $TypeError(".MODEL_DES.Robot_Child_Function.attr: object expected");
                    message.attr[i] = $root.MODEL_DES.Message_CommonAttr.fromObject(object.attr[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Robot_Child_Function message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_DES.Robot_Child_Function
         * @static
         * @param {MODEL_DES.Robot_Child_Function} message Robot_Child_Function
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Robot_Child_Function.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.attr = [];
            if (options.defaults) {
                object.type = "";
                object.desc = "";
                object.key = "";
            }
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                object.type = message.type;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                object.key = message.key;
            if (message.attr && message.attr.length) {
                object.attr = $Array(message.attr.length);
                for (let j = 0; j < message.attr.length; ++j)
                    object.attr[j] = $root.MODEL_DES.Message_CommonAttr.toObject(message.attr[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Robot_Child_Function to JSON.
         * @function toJSON
         * @memberof MODEL_DES.Robot_Child_Function
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Robot_Child_Function.prototype.toJSON = function() {
            return Robot_Child_Function.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Robot_Child_Function
         * @function getTypeUrl
         * @memberof MODEL_DES.Robot_Child_Function
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Robot_Child_Function.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_DES.Robot_Child_Function";
        };

        return Robot_Child_Function;
    })();

    MODEL_DES.Robot_Function = (function() {

        /**
         * Properties of a Robot_Function.
         * @typedef {Object} MODEL_DES.Robot_Function.$Properties
         * @property {string|null} [type] Robot_Function type
         * @property {string|null} [desc] Robot_Function desc
         * @property {Array.<MODEL_DES.Robot_Child_Function.$Properties>|null} [childFunction] Robot_Function childFunction
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Robot_Function.
         * @memberof MODEL_DES
         * @interface IRobot_Function
         * @augments MODEL_DES.Robot_Function.$Properties
         * @deprecated Use MODEL_DES.Robot_Function.$Properties instead.
         */

        /**
         * Shape of a Robot_Function.
         * @typedef {MODEL_DES.Robot_Function.$Properties} MODEL_DES.Robot_Function.$Shape
         */

        /**
         * Constructs a new Robot_Function.
         * @memberof MODEL_DES
         * @classdesc Represents a Robot_Function.
         * @constructor
         * @param {MODEL_DES.Robot_Function.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Robot_Function = function (properties) {
            this.childFunction = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Robot_Function type.
         * @member {string} type
         * @memberof MODEL_DES.Robot_Function
         * @instance
         */
        Robot_Function.prototype.type = "";

        /**
         * Robot_Function desc.
         * @member {string} desc
         * @memberof MODEL_DES.Robot_Function
         * @instance
         */
        Robot_Function.prototype.desc = "";

        /**
         * Robot_Function childFunction.
         * @member {Array.<MODEL_DES.Robot_Child_Function.$Properties>} childFunction
         * @memberof MODEL_DES.Robot_Function
         * @instance
         */
        Robot_Function.prototype.childFunction = $util.emptyArray;

        /**
         * Creates a new Robot_Function instance using the specified properties.
         * @function create
         * @memberof MODEL_DES.Robot_Function
         * @static
         * @param {MODEL_DES.Robot_Function.$Properties=} [properties] Properties to set
         * @returns {MODEL_DES.Robot_Function} Robot_Function instance
         * @type {{
         *   (properties: MODEL_DES.Robot_Function.$Shape): MODEL_DES.Robot_Function & MODEL_DES.Robot_Function.$Shape;
         *   (properties?: MODEL_DES.Robot_Function.$Properties): MODEL_DES.Robot_Function;
         * }}
         */
        Robot_Function.create = function(properties) {
            return new Robot_Function(properties);
        };

        /**
         * Encodes the specified Robot_Function message. Does not implicitly {@link MODEL_DES.Robot_Function.verify|verify} messages.
         * @function encode
         * @memberof MODEL_DES.Robot_Function
         * @static
         * @param {MODEL_DES.Robot_Function.$Properties} message Robot_Function message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Robot_Function.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.type != null && $Object.hasOwnProperty.call(message, "type") && message.type !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc") && message.desc !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.desc);
            if (message.childFunction != null && message.childFunction.length)
                for (let i = 0; i < message.childFunction.length; ++i)
                    $root.MODEL_DES.Robot_Child_Function.encode(message.childFunction[i], writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Robot_Function message, length delimited. Does not implicitly {@link MODEL_DES.Robot_Function.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_DES.Robot_Function
         * @static
         * @param {MODEL_DES.Robot_Function.$Properties} message Robot_Function message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Robot_Function.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Robot_Function message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_DES.Robot_Function
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_DES.Robot_Function & MODEL_DES.Robot_Function.$Shape} Robot_Function
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Robot_Function.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_DES.Robot_Function(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.type = value;
                        else
                            delete message.type;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.desc = value;
                        else
                            delete message.desc;
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        if (!(message.childFunction && message.childFunction.length))
                            message.childFunction = [];
                        message.childFunction.push($root.MODEL_DES.Robot_Child_Function.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Robot_Function message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_DES.Robot_Function
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_DES.Robot_Function & MODEL_DES.Robot_Function.$Shape} Robot_Function
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Robot_Function.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Robot_Function message.
         * @function verify
         * @memberof MODEL_DES.Robot_Function
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Robot_Function.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                if (!$util.isString(message.desc))
                    return "desc: string expected";
            if (message.childFunction != null && $Object.hasOwnProperty.call(message, "childFunction")) {
                if (!$Array.isArray(message.childFunction))
                    return "childFunction: array expected";
                for (let i = 0; i < message.childFunction.length; ++i) {
                    let error = $root.MODEL_DES.Robot_Child_Function.verify(message.childFunction[i], _depth + 1);
                    if (error)
                        return "childFunction." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Robot_Function message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_DES.Robot_Function
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_DES.Robot_Function} Robot_Function
         */
        Robot_Function.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_DES.Robot_Function)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_DES.Robot_Function: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_DES.Robot_Function();
            if (object.type != null)
                if (typeof object.type !== "string" || object.type.length)
                    message.type = $String(object.type);
            if (object.desc != null)
                if (typeof object.desc !== "string" || object.desc.length)
                    message.desc = $String(object.desc);
            if (object.childFunction) {
                if (!$Array.isArray(object.childFunction))
                    throw $TypeError(".MODEL_DES.Robot_Function.childFunction: array expected");
                message.childFunction = $Array(object.childFunction.length);
                for (let i = 0; i < object.childFunction.length; ++i) {
                    if (!$util.isObject(object.childFunction[i]))
                        throw $TypeError(".MODEL_DES.Robot_Function.childFunction: object expected");
                    message.childFunction[i] = $root.MODEL_DES.Robot_Child_Function.fromObject(object.childFunction[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Robot_Function message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_DES.Robot_Function
         * @static
         * @param {MODEL_DES.Robot_Function} message Robot_Function
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Robot_Function.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.childFunction = [];
            if (options.defaults) {
                object.type = "";
                object.desc = "";
            }
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                object.type = message.type;
            if (message.desc != null && $Object.hasOwnProperty.call(message, "desc"))
                object.desc = message.desc;
            if (message.childFunction && message.childFunction.length) {
                object.childFunction = $Array(message.childFunction.length);
                for (let j = 0; j < message.childFunction.length; ++j)
                    object.childFunction[j] = $root.MODEL_DES.Robot_Child_Function.toObject(message.childFunction[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Robot_Function to JSON.
         * @function toJSON
         * @memberof MODEL_DES.Robot_Function
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Robot_Function.prototype.toJSON = function() {
            return Robot_Function.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Robot_Function
         * @function getTypeUrl
         * @memberof MODEL_DES.Robot_Function
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Robot_Function.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_DES.Robot_Function";
        };

        return Robot_Function;
    })();

    MODEL_DES.Robot_Description = (function() {

        /**
         * Properties of a Robot_Description.
         * @typedef {Object} MODEL_DES.Robot_Description.$Properties
         * @property {string|null} [version] Robot_Description version
         * @property {Array.<MODEL_DES.Robot_Function.$Properties>|null} ["function"] Robot_Description function
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Robot_Description.
         * @memberof MODEL_DES
         * @interface IRobot_Description
         * @augments MODEL_DES.Robot_Description.$Properties
         * @deprecated Use MODEL_DES.Robot_Description.$Properties instead.
         */

        /**
         * Shape of a Robot_Description.
         * @typedef {MODEL_DES.Robot_Description.$Properties} MODEL_DES.Robot_Description.$Shape
         */

        /**
         * Constructs a new Robot_Description.
         * @memberof MODEL_DES
         * @classdesc Represents a Robot_Description.
         * @constructor
         * @param {MODEL_DES.Robot_Description.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Robot_Description = function (properties) {
            this["function"] = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Robot_Description version.
         * @member {string} version
         * @memberof MODEL_DES.Robot_Description
         * @instance
         */
        Robot_Description.prototype.version = "";

        /**
         * Robot_Description function.
         * @member {Array.<MODEL_DES.Robot_Function.$Properties>} function
         * @memberof MODEL_DES.Robot_Description
         * @instance
         */
        Robot_Description.prototype["function"] = $util.emptyArray;

        /**
         * Creates a new Robot_Description instance using the specified properties.
         * @function create
         * @memberof MODEL_DES.Robot_Description
         * @static
         * @param {MODEL_DES.Robot_Description.$Properties=} [properties] Properties to set
         * @returns {MODEL_DES.Robot_Description} Robot_Description instance
         * @type {{
         *   (properties: MODEL_DES.Robot_Description.$Shape): MODEL_DES.Robot_Description & MODEL_DES.Robot_Description.$Shape;
         *   (properties?: MODEL_DES.Robot_Description.$Properties): MODEL_DES.Robot_Description;
         * }}
         */
        Robot_Description.create = function(properties) {
            return new Robot_Description(properties);
        };

        /**
         * Encodes the specified Robot_Description message. Does not implicitly {@link MODEL_DES.Robot_Description.verify|verify} messages.
         * @function encode
         * @memberof MODEL_DES.Robot_Description
         * @static
         * @param {MODEL_DES.Robot_Description.$Properties} message Robot_Description message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Robot_Description.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.version != null && $Object.hasOwnProperty.call(message, "version") && message.version !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.version);
            if (message["function"] != null && message["function"].length)
                for (let i = 0; i < message["function"].length; ++i)
                    $root.MODEL_DES.Robot_Function.encode(message["function"][i], writer.uint32(/* id 12, wireType 2 =*/98).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Robot_Description message, length delimited. Does not implicitly {@link MODEL_DES.Robot_Description.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MODEL_DES.Robot_Description
         * @static
         * @param {MODEL_DES.Robot_Description.$Properties} message Robot_Description message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Robot_Description.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a Robot_Description message from the specified reader or buffer.
         * @function decode
         * @memberof MODEL_DES.Robot_Description
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MODEL_DES.Robot_Description & MODEL_DES.Robot_Description.$Shape} Robot_Description
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Robot_Description.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.MODEL_DES.Robot_Description(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.version = value;
                        else
                            delete message.version;
                        continue;
                    }
                case 12: {
                        if (wireType !== 2)
                            break;
                        if (!(message["function"] && message["function"].length))
                            message["function"] = [];
                        message["function"].push($root.MODEL_DES.Robot_Function.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a Robot_Description message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MODEL_DES.Robot_Description
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MODEL_DES.Robot_Description & MODEL_DES.Robot_Description.$Shape} Robot_Description
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Robot_Description.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Robot_Description message.
         * @function verify
         * @memberof MODEL_DES.Robot_Description
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Robot_Description.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.version != null && $Object.hasOwnProperty.call(message, "version"))
                if (!$util.isString(message.version))
                    return "version: string expected";
            if (message["function"] != null && $Object.hasOwnProperty.call(message, "function")) {
                if (!$Array.isArray(message["function"]))
                    return "function: array expected";
                for (let i = 0; i < message["function"].length; ++i) {
                    let error = $root.MODEL_DES.Robot_Function.verify(message["function"][i], _depth + 1);
                    if (error)
                        return "function." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Robot_Description message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MODEL_DES.Robot_Description
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MODEL_DES.Robot_Description} Robot_Description
         */
        Robot_Description.fromObject = function (object, _depth) {
            if (object instanceof $root.MODEL_DES.Robot_Description)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".MODEL_DES.Robot_Description: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.MODEL_DES.Robot_Description();
            if (object.version != null)
                if (typeof object.version !== "string" || object.version.length)
                    message.version = $String(object.version);
            if (object["function"]) {
                if (!$Array.isArray(object["function"]))
                    throw $TypeError(".MODEL_DES.Robot_Description.function: array expected");
                message["function"] = $Array(object["function"].length);
                for (let i = 0; i < object["function"].length; ++i) {
                    if (!$util.isObject(object["function"][i]))
                        throw $TypeError(".MODEL_DES.Robot_Description.function: object expected");
                    message["function"][i] = $root.MODEL_DES.Robot_Function.fromObject(object["function"][i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Robot_Description message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MODEL_DES.Robot_Description
         * @static
         * @param {MODEL_DES.Robot_Description} message Robot_Description
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Robot_Description.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object["function"] = [];
            if (options.defaults)
                object.version = "";
            if (message.version != null && $Object.hasOwnProperty.call(message, "version"))
                object.version = message.version;
            if (message["function"] && message["function"].length) {
                object["function"] = $Array(message["function"].length);
                for (let j = 0; j < message["function"].length; ++j)
                    object["function"][j] = $root.MODEL_DES.Robot_Function.toObject(message["function"][j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this Robot_Description to JSON.
         * @function toJSON
         * @memberof MODEL_DES.Robot_Description
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Robot_Description.prototype.toJSON = function() {
            return Robot_Description.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for Robot_Description
         * @function getTypeUrl
         * @memberof MODEL_DES.Robot_Description
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Robot_Description.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/MODEL_DES.Robot_Description";
        };

        return Robot_Description;
    })();

    return MODEL_DES;
})();

export {
  $root as default
};
