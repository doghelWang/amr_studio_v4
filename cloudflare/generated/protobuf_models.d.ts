import * as $protobuf from "protobufjs";
import Long = require("long");

/** Namespace AMR_MODEL_NSP. */
export namespace AMR_MODEL_NSP {

    /** MESSAGE_BASE_DATA_TYPE enum. */
    enum MESSAGE_BASE_DATA_TYPE {

        /** DATA_BYTES value */
        DATA_BYTES = 0,

        /** DATA_STRING value */
        DATA_STRING = 1,

        /** DATA_IP value */
        DATA_IP = 3,

        /** DATA_BOOL value */
        DATA_BOOL = 4,

        /** DATA_INT32 value */
        DATA_INT32 = 5,

        /** DATA_UINT32 value */
        DATA_UINT32 = 6,

        /** DATA_INT64 value */
        DATA_INT64 = 7,

        /** DATA_UINT64 value */
        DATA_UINT64 = 8,

        /** DATA_FLOAT value */
        DATA_FLOAT = 9,

        /** DATA_DOUBLE value */
        DATA_DOUBLE = 10,

        /** DATA_COMBOX value */
        DATA_COMBOX = 11,

        /** DATA_FIXED_E value */
        DATA_FIXED_E = 12
    }

    /** MESSAGE_SHAPE_TYPE enum. */
    enum MESSAGE_SHAPE_TYPE {

        /** ENUM_SPHERE value */
        ENUM_SPHERE = 0,

        /** ENUM_BOX value */
        ENUM_BOX = 1,

        /** ENUM_CYLINDER value */
        ENUM_CYLINDER = 2
    }

    /**
     * Properties of a Message_Combox_Item.
     * @deprecated Use AMR_MODEL_NSP.Message_Combox_Item.$Properties instead.
     */
    interface IMessage_Combox_Item extends AMR_MODEL_NSP.Message_Combox_Item.$Properties {
    }

    /** Represents a Message_Combox_Item. */
    class Message_Combox_Item {

        /**
         * Constructs a new Message_Combox_Item.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Combox_Item.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Combox_Item key. */
        key: string;

        /** Message_Combox_Item desc. */
        desc: string;

        /** Message_Combox_Item arrayCmobEle. */
        arrayCmobEle: AMR_MODEL_NSP.Message_Base_Element.$Properties[];

        /**
         * Creates a new Message_Combox_Item instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Combox_Item instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Combox_Item.$Shape): AMR_MODEL_NSP.Message_Combox_Item & AMR_MODEL_NSP.Message_Combox_Item.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Combox_Item.$Properties): AMR_MODEL_NSP.Message_Combox_Item;

        /**
         * Encodes the specified Message_Combox_Item message. Does not implicitly {@link AMR_MODEL_NSP.Message_Combox_Item.verify|verify} messages.
         * @param message Message_Combox_Item message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Combox_Item.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Combox_Item message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Combox_Item.verify|verify} messages.
         * @param message Message_Combox_Item message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Combox_Item.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Combox_Item message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Combox_Item & AMR_MODEL_NSP.Message_Combox_Item.$Shape} Message_Combox_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Combox_Item & AMR_MODEL_NSP.Message_Combox_Item.$Shape;

        /**
         * Decodes a Message_Combox_Item message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Combox_Item & AMR_MODEL_NSP.Message_Combox_Item.$Shape} Message_Combox_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Combox_Item & AMR_MODEL_NSP.Message_Combox_Item.$Shape;

        /**
         * Verifies a Message_Combox_Item message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Combox_Item message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Combox_Item
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Combox_Item;

        /**
         * Creates a plain object from a Message_Combox_Item message. Also converts values to other types if specified.
         * @param message Message_Combox_Item
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Combox_Item, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Combox_Item to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Combox_Item
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Combox_Item {

        /** Properties of a Message_Combox_Item. */
        interface $Properties {

            /** Message_Combox_Item key */
            key?: (string|null);

            /** Message_Combox_Item desc */
            desc?: (string|null);

            /** Message_Combox_Item arrayCmobEle */
            arrayCmobEle?: (AMR_MODEL_NSP.Message_Base_Element.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Combox_Item. */
        type $Shape = AMR_MODEL_NSP.Message_Combox_Item.$Properties;
    }

    /**
     * Properties of a Message_Combox_Type.
     * @deprecated Use AMR_MODEL_NSP.Message_Combox_Type.$Properties instead.
     */
    interface IMessage_Combox_Type extends AMR_MODEL_NSP.Message_Combox_Type.$Properties {
    }

    /** Represents a Message_Combox_Type. */
    class Message_Combox_Type {

        /**
         * Constructs a new Message_Combox_Type.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Combox_Type.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Combox_Type typeKey. */
        typeKey: string;

        /** Message_Combox_Type typeDesc. */
        typeDesc: string;

        /** Message_Combox_Type typeGroups. */
        typeGroups: AMR_MODEL_NSP.Message_Combox_Item.$Properties[];

        /**
         * Creates a new Message_Combox_Type instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Combox_Type instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Combox_Type.$Shape): AMR_MODEL_NSP.Message_Combox_Type & AMR_MODEL_NSP.Message_Combox_Type.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Combox_Type.$Properties): AMR_MODEL_NSP.Message_Combox_Type;

        /**
         * Encodes the specified Message_Combox_Type message. Does not implicitly {@link AMR_MODEL_NSP.Message_Combox_Type.verify|verify} messages.
         * @param message Message_Combox_Type message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Combox_Type.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Combox_Type message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Combox_Type.verify|verify} messages.
         * @param message Message_Combox_Type message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Combox_Type.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Combox_Type message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Combox_Type & AMR_MODEL_NSP.Message_Combox_Type.$Shape} Message_Combox_Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Combox_Type & AMR_MODEL_NSP.Message_Combox_Type.$Shape;

        /**
         * Decodes a Message_Combox_Type message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Combox_Type & AMR_MODEL_NSP.Message_Combox_Type.$Shape} Message_Combox_Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Combox_Type & AMR_MODEL_NSP.Message_Combox_Type.$Shape;

        /**
         * Verifies a Message_Combox_Type message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Combox_Type message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Combox_Type
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Combox_Type;

        /**
         * Creates a plain object from a Message_Combox_Type message. Also converts values to other types if specified.
         * @param message Message_Combox_Type
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Combox_Type, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Combox_Type to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Combox_Type
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Combox_Type {

        /** Properties of a Message_Combox_Type. */
        interface $Properties {

            /** Message_Combox_Type typeKey */
            typeKey?: (string|null);

            /** Message_Combox_Type typeDesc */
            typeDesc?: (string|null);

            /** Message_Combox_Type typeGroups */
            typeGroups?: (AMR_MODEL_NSP.Message_Combox_Item.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Combox_Type. */
        type $Shape = AMR_MODEL_NSP.Message_Combox_Type.$Properties;
    }

    /**
     * Properties of a Message_Base_Element.
     * @deprecated Use AMR_MODEL_NSP.Message_Base_Element.$Properties instead.
     */
    interface IMessage_Base_Element extends AMR_MODEL_NSP.Message_Base_Element.$Properties {
    }

    /** Represents a Message_Base_Element. */
    class Message_Base_Element {

        /**
         * Constructs a new Message_Base_Element.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Base_Element.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Base_Element key. */
        key: string;

        /** Message_Base_Element type. */
        type: AMR_MODEL_NSP.MESSAGE_BASE_DATA_TYPE;

        /** Message_Base_Element stringValue. */
        stringValue: string;

        /** Message_Base_Element boolValue. */
        boolValue: boolean;

        /** Message_Base_Element int32Value. */
        int32Value: number;

        /** Message_Base_Element uint32Value. */
        uint32Value: number;

        /** Message_Base_Element int64Value. */
        int64Value: (number|Long);

        /** Message_Base_Element uint64Value. */
        uint64Value: (number|Long);

        /** Message_Base_Element floatValue. */
        floatValue: number;

        /** Message_Base_Element doubleValue. */
        doubleValue: number;

        /** Message_Base_Element bytesValue. */
        bytesValue: Uint8Array;

        /** Message_Base_Element ipValue. */
        ipValue: string;

        /** Message_Base_Element stringFix. */
        stringFix: string;

        /** Message_Base_Element comboType. */
        comboType?: (AMR_MODEL_NSP.Message_Combox_Type.$Properties|null);

        /** Message_Base_Element int32Maxvalue. */
        int32Maxvalue: number;

        /** Message_Base_Element uint32Maxvalue. */
        uint32Maxvalue: number;

        /** Message_Base_Element int64Maxvalue. */
        int64Maxvalue: (number|Long);

        /** Message_Base_Element uint64Maxvalue. */
        uint64Maxvalue: (number|Long);

        /** Message_Base_Element floatMaxvalue. */
        floatMaxvalue: number;

        /** Message_Base_Element doubleMaxvalue. */
        doubleMaxvalue: number;

        /** Message_Base_Element int32Minvalue. */
        int32Minvalue: number;

        /** Message_Base_Element uint32Minvalue. */
        uint32Minvalue: number;

        /** Message_Base_Element int64Minvalue. */
        int64Minvalue: (number|Long);

        /** Message_Base_Element uint64Minvalue. */
        uint64Minvalue: (number|Long);

        /** Message_Base_Element floatMinvalue. */
        floatMinvalue: number;

        /** Message_Base_Element doubleMinvalue. */
        doubleMinvalue: number;

        /** Message_Base_Element unit. */
        unit: string;

        /** Message_Base_Element desc. */
        desc: string;

        /** Message_Base_Element boolParse. */
        boolParse: boolean;

        /** Message_Base_Element boolHide. */
        boolHide: boolean;

        /** Message_Base_Element boolNoeditable. */
        boolNoeditable: boolean;

        /** Message_Base_Element boolMustfill. */
        boolMustfill: boolean;

        /** Message_Base_Element boolBasic. */
        boolBasic: boolean;

        /** Message_Base_Element fixedSource. */
        fixedSource: string[];

        /**
         * Creates a new Message_Base_Element instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Base_Element instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Base_Element.$Shape): AMR_MODEL_NSP.Message_Base_Element & AMR_MODEL_NSP.Message_Base_Element.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Base_Element.$Properties): AMR_MODEL_NSP.Message_Base_Element;

        /**
         * Encodes the specified Message_Base_Element message. Does not implicitly {@link AMR_MODEL_NSP.Message_Base_Element.verify|verify} messages.
         * @param message Message_Base_Element message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Base_Element.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Base_Element message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Base_Element.verify|verify} messages.
         * @param message Message_Base_Element message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Base_Element.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Base_Element message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Base_Element & AMR_MODEL_NSP.Message_Base_Element.$Shape} Message_Base_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Base_Element & AMR_MODEL_NSP.Message_Base_Element.$Shape;

        /**
         * Decodes a Message_Base_Element message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Base_Element & AMR_MODEL_NSP.Message_Base_Element.$Shape} Message_Base_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Base_Element & AMR_MODEL_NSP.Message_Base_Element.$Shape;

        /**
         * Verifies a Message_Base_Element message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Base_Element message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Base_Element
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Base_Element;

        /**
         * Creates a plain object from a Message_Base_Element message. Also converts values to other types if specified.
         * @param message Message_Base_Element
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Base_Element, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Base_Element to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Base_Element
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Base_Element {

        /** Properties of a Message_Base_Element. */
        interface $Properties {

            /** Message_Base_Element key */
            key?: (string|null);

            /** Message_Base_Element type */
            type?: (AMR_MODEL_NSP.MESSAGE_BASE_DATA_TYPE|null);

            /** Message_Base_Element stringValue */
            stringValue?: (string|null);

            /** Message_Base_Element boolValue */
            boolValue?: (boolean|null);

            /** Message_Base_Element int32Value */
            int32Value?: (number|null);

            /** Message_Base_Element uint32Value */
            uint32Value?: (number|null);

            /** Message_Base_Element int64Value */
            int64Value?: (number|Long|null);

            /** Message_Base_Element uint64Value */
            uint64Value?: (number|Long|null);

            /** Message_Base_Element floatValue */
            floatValue?: (number|null);

            /** Message_Base_Element doubleValue */
            doubleValue?: (number|null);

            /** Message_Base_Element bytesValue */
            bytesValue?: (Uint8Array|null);

            /** Message_Base_Element ipValue */
            ipValue?: (string|null);

            /** Message_Base_Element stringFix */
            stringFix?: (string|null);

            /** Message_Base_Element comboType */
            comboType?: (AMR_MODEL_NSP.Message_Combox_Type.$Properties|null);

            /** Message_Base_Element int32Maxvalue */
            int32Maxvalue?: (number|null);

            /** Message_Base_Element uint32Maxvalue */
            uint32Maxvalue?: (number|null);

            /** Message_Base_Element int64Maxvalue */
            int64Maxvalue?: (number|Long|null);

            /** Message_Base_Element uint64Maxvalue */
            uint64Maxvalue?: (number|Long|null);

            /** Message_Base_Element floatMaxvalue */
            floatMaxvalue?: (number|null);

            /** Message_Base_Element doubleMaxvalue */
            doubleMaxvalue?: (number|null);

            /** Message_Base_Element int32Minvalue */
            int32Minvalue?: (number|null);

            /** Message_Base_Element uint32Minvalue */
            uint32Minvalue?: (number|null);

            /** Message_Base_Element int64Minvalue */
            int64Minvalue?: (number|Long|null);

            /** Message_Base_Element uint64Minvalue */
            uint64Minvalue?: (number|Long|null);

            /** Message_Base_Element floatMinvalue */
            floatMinvalue?: (number|null);

            /** Message_Base_Element doubleMinvalue */
            doubleMinvalue?: (number|null);

            /** Message_Base_Element unit */
            unit?: (string|null);

            /** Message_Base_Element desc */
            desc?: (string|null);

            /** Message_Base_Element boolParse */
            boolParse?: (boolean|null);

            /** Message_Base_Element boolHide */
            boolHide?: (boolean|null);

            /** Message_Base_Element boolNoeditable */
            boolNoeditable?: (boolean|null);

            /** Message_Base_Element boolMustfill */
            boolMustfill?: (boolean|null);

            /** Message_Base_Element boolBasic */
            boolBasic?: (boolean|null);

            /** Message_Base_Element fixedSource */
            fixedSource?: (string[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Base_Element. */
        type $Shape = AMR_MODEL_NSP.Message_Base_Element.$Properties;
    }

    /**
     * Properties of a Message_Base_Group_Element.
     * @deprecated Use AMR_MODEL_NSP.Message_Base_Group_Element.$Properties instead.
     */
    interface IMessage_Base_Group_Element extends AMR_MODEL_NSP.Message_Base_Group_Element.$Properties {
    }

    /** Represents a Message_Base_Group_Element. */
    class Message_Base_Group_Element {

        /**
         * Constructs a new Message_Base_Group_Element.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Base_Group_Element.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Base_Group_Element key. */
        key: string;

        /** Message_Base_Group_Element desc. */
        desc: string;

        /** Message_Base_Group_Element arrayBaseEle. */
        arrayBaseEle: AMR_MODEL_NSP.Message_Base_Element.$Properties[];

        /** Message_Base_Group_Element boolDeprecated. */
        boolDeprecated: boolean;

        /**
         * Creates a new Message_Base_Group_Element instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Base_Group_Element instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Base_Group_Element.$Shape): AMR_MODEL_NSP.Message_Base_Group_Element & AMR_MODEL_NSP.Message_Base_Group_Element.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Base_Group_Element.$Properties): AMR_MODEL_NSP.Message_Base_Group_Element;

        /**
         * Encodes the specified Message_Base_Group_Element message. Does not implicitly {@link AMR_MODEL_NSP.Message_Base_Group_Element.verify|verify} messages.
         * @param message Message_Base_Group_Element message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Base_Group_Element.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Base_Group_Element message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Base_Group_Element.verify|verify} messages.
         * @param message Message_Base_Group_Element message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Base_Group_Element.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Base_Group_Element message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Base_Group_Element & AMR_MODEL_NSP.Message_Base_Group_Element.$Shape} Message_Base_Group_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Base_Group_Element & AMR_MODEL_NSP.Message_Base_Group_Element.$Shape;

        /**
         * Decodes a Message_Base_Group_Element message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Base_Group_Element & AMR_MODEL_NSP.Message_Base_Group_Element.$Shape} Message_Base_Group_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Base_Group_Element & AMR_MODEL_NSP.Message_Base_Group_Element.$Shape;

        /**
         * Verifies a Message_Base_Group_Element message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Base_Group_Element message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Base_Group_Element
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Base_Group_Element;

        /**
         * Creates a plain object from a Message_Base_Group_Element message. Also converts values to other types if specified.
         * @param message Message_Base_Group_Element
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Base_Group_Element, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Base_Group_Element to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Base_Group_Element
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Base_Group_Element {

        /** Properties of a Message_Base_Group_Element. */
        interface $Properties {

            /** Message_Base_Group_Element key */
            key?: (string|null);

            /** Message_Base_Group_Element desc */
            desc?: (string|null);

            /** Message_Base_Group_Element arrayBaseEle */
            arrayBaseEle?: (AMR_MODEL_NSP.Message_Base_Element.$Properties[]|null);

            /** Message_Base_Group_Element boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Base_Group_Element. */
        type $Shape = AMR_MODEL_NSP.Message_Base_Group_Element.$Properties;
    }

    /**
     * Properties of a Message_Sphere.
     * @deprecated Use AMR_MODEL_NSP.Message_Sphere.$Properties instead.
     */
    interface IMessage_Sphere extends AMR_MODEL_NSP.Message_Sphere.$Properties {
    }

    /** Represents a Message_Sphere. */
    class Message_Sphere {

        /**
         * Constructs a new Message_Sphere.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Sphere.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Sphere diameter. */
        diameter: number;

        /** Message_Sphere boolDeprecated. */
        boolDeprecated: boolean;

        /**
         * Creates a new Message_Sphere instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Sphere instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Sphere.$Shape): AMR_MODEL_NSP.Message_Sphere & AMR_MODEL_NSP.Message_Sphere.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Sphere.$Properties): AMR_MODEL_NSP.Message_Sphere;

        /**
         * Encodes the specified Message_Sphere message. Does not implicitly {@link AMR_MODEL_NSP.Message_Sphere.verify|verify} messages.
         * @param message Message_Sphere message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Sphere.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Sphere message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Sphere.verify|verify} messages.
         * @param message Message_Sphere message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Sphere.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Sphere message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Sphere & AMR_MODEL_NSP.Message_Sphere.$Shape} Message_Sphere
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Sphere & AMR_MODEL_NSP.Message_Sphere.$Shape;

        /**
         * Decodes a Message_Sphere message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Sphere & AMR_MODEL_NSP.Message_Sphere.$Shape} Message_Sphere
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Sphere & AMR_MODEL_NSP.Message_Sphere.$Shape;

        /**
         * Verifies a Message_Sphere message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Sphere message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Sphere
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Sphere;

        /**
         * Creates a plain object from a Message_Sphere message. Also converts values to other types if specified.
         * @param message Message_Sphere
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Sphere, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Sphere to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Sphere
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Sphere {

        /** Properties of a Message_Sphere. */
        interface $Properties {

            /** Message_Sphere diameter */
            diameter?: (number|null);

            /** Message_Sphere boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Sphere. */
        type $Shape = AMR_MODEL_NSP.Message_Sphere.$Properties;
    }

    /**
     * Properties of a Message_BOX.
     * @deprecated Use AMR_MODEL_NSP.Message_BOX.$Properties instead.
     */
    interface IMessage_BOX extends AMR_MODEL_NSP.Message_BOX.$Properties {
    }

    /** Represents a Message_BOX. */
    class Message_BOX {

        /**
         * Constructs a new Message_BOX.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_BOX.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_BOX sizeLen. */
        sizeLen: number;

        /** Message_BOX sizeWidth. */
        sizeWidth: number;

        /** Message_BOX sizeHeight. */
        sizeHeight: number;

        /** Message_BOX boolDeprecated. */
        boolDeprecated: boolean;

        /**
         * Creates a new Message_BOX instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_BOX instance
         */
        static create(properties: AMR_MODEL_NSP.Message_BOX.$Shape): AMR_MODEL_NSP.Message_BOX & AMR_MODEL_NSP.Message_BOX.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_BOX.$Properties): AMR_MODEL_NSP.Message_BOX;

        /**
         * Encodes the specified Message_BOX message. Does not implicitly {@link AMR_MODEL_NSP.Message_BOX.verify|verify} messages.
         * @param message Message_BOX message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_BOX.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_BOX message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_BOX.verify|verify} messages.
         * @param message Message_BOX message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_BOX.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_BOX message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_BOX & AMR_MODEL_NSP.Message_BOX.$Shape} Message_BOX
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_BOX & AMR_MODEL_NSP.Message_BOX.$Shape;

        /**
         * Decodes a Message_BOX message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_BOX & AMR_MODEL_NSP.Message_BOX.$Shape} Message_BOX
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_BOX & AMR_MODEL_NSP.Message_BOX.$Shape;

        /**
         * Verifies a Message_BOX message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_BOX message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_BOX
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_BOX;

        /**
         * Creates a plain object from a Message_BOX message. Also converts values to other types if specified.
         * @param message Message_BOX
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_BOX, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_BOX to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_BOX
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_BOX {

        /** Properties of a Message_BOX. */
        interface $Properties {

            /** Message_BOX sizeLen */
            sizeLen?: (number|null);

            /** Message_BOX sizeWidth */
            sizeWidth?: (number|null);

            /** Message_BOX sizeHeight */
            sizeHeight?: (number|null);

            /** Message_BOX boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_BOX. */
        type $Shape = AMR_MODEL_NSP.Message_BOX.$Properties;
    }

    /**
     * Properties of a Message_CYLINDER.
     * @deprecated Use AMR_MODEL_NSP.Message_CYLINDER.$Properties instead.
     */
    interface IMessage_CYLINDER extends AMR_MODEL_NSP.Message_CYLINDER.$Properties {
    }

    /** Represents a Message_CYLINDER. */
    class Message_CYLINDER {

        /**
         * Constructs a new Message_CYLINDER.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_CYLINDER.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_CYLINDER diameter. */
        diameter: number;

        /** Message_CYLINDER height. */
        height: number;

        /** Message_CYLINDER boolDeprecated. */
        boolDeprecated: boolean;

        /**
         * Creates a new Message_CYLINDER instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_CYLINDER instance
         */
        static create(properties: AMR_MODEL_NSP.Message_CYLINDER.$Shape): AMR_MODEL_NSP.Message_CYLINDER & AMR_MODEL_NSP.Message_CYLINDER.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_CYLINDER.$Properties): AMR_MODEL_NSP.Message_CYLINDER;

        /**
         * Encodes the specified Message_CYLINDER message. Does not implicitly {@link AMR_MODEL_NSP.Message_CYLINDER.verify|verify} messages.
         * @param message Message_CYLINDER message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_CYLINDER.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_CYLINDER message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_CYLINDER.verify|verify} messages.
         * @param message Message_CYLINDER message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_CYLINDER.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_CYLINDER message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_CYLINDER & AMR_MODEL_NSP.Message_CYLINDER.$Shape} Message_CYLINDER
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_CYLINDER & AMR_MODEL_NSP.Message_CYLINDER.$Shape;

        /**
         * Decodes a Message_CYLINDER message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_CYLINDER & AMR_MODEL_NSP.Message_CYLINDER.$Shape} Message_CYLINDER
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_CYLINDER & AMR_MODEL_NSP.Message_CYLINDER.$Shape;

        /**
         * Verifies a Message_CYLINDER message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_CYLINDER message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_CYLINDER
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_CYLINDER;

        /**
         * Creates a plain object from a Message_CYLINDER message. Also converts values to other types if specified.
         * @param message Message_CYLINDER
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_CYLINDER, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_CYLINDER to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_CYLINDER
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_CYLINDER {

        /** Properties of a Message_CYLINDER. */
        interface $Properties {

            /** Message_CYLINDER diameter */
            diameter?: (number|null);

            /** Message_CYLINDER height */
            height?: (number|null);

            /** Message_CYLINDER boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_CYLINDER. */
        type $Shape = AMR_MODEL_NSP.Message_CYLINDER.$Properties;
    }

    /**
     * Properties of a Message_Module_Shape.
     * @deprecated Use AMR_MODEL_NSP.Message_Module_Shape.$Properties instead.
     */
    interface IMessage_Module_Shape extends AMR_MODEL_NSP.Message_Module_Shape.$Properties {
    }

    /** Represents a Message_Module_Shape. */
    class Message_Module_Shape {

        /**
         * Constructs a new Message_Module_Shape.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Module_Shape.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Module_Shape shapeType. */
        shapeType: AMR_MODEL_NSP.MESSAGE_SHAPE_TYPE;

        /** Message_Module_Shape boolDeprecated. */
        boolDeprecated: boolean;

        /** Message_Module_Shape sphere. */
        sphere?: (AMR_MODEL_NSP.Message_Sphere.$Properties|null);

        /** Message_Module_Shape box. */
        box?: (AMR_MODEL_NSP.Message_BOX.$Properties|null);

        /** Message_Module_Shape cylinder. */
        cylinder?: (AMR_MODEL_NSP.Message_CYLINDER.$Properties|null);

        /**
         * Creates a new Message_Module_Shape instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Module_Shape instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Module_Shape.$Shape): AMR_MODEL_NSP.Message_Module_Shape & AMR_MODEL_NSP.Message_Module_Shape.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Module_Shape.$Properties): AMR_MODEL_NSP.Message_Module_Shape;

        /**
         * Encodes the specified Message_Module_Shape message. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Shape.verify|verify} messages.
         * @param message Message_Module_Shape message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Module_Shape.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Module_Shape message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Shape.verify|verify} messages.
         * @param message Message_Module_Shape message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Module_Shape.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Module_Shape message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Module_Shape & AMR_MODEL_NSP.Message_Module_Shape.$Shape} Message_Module_Shape
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Module_Shape & AMR_MODEL_NSP.Message_Module_Shape.$Shape;

        /**
         * Decodes a Message_Module_Shape message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Module_Shape & AMR_MODEL_NSP.Message_Module_Shape.$Shape} Message_Module_Shape
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Module_Shape & AMR_MODEL_NSP.Message_Module_Shape.$Shape;

        /**
         * Verifies a Message_Module_Shape message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Module_Shape message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Module_Shape
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Module_Shape;

        /**
         * Creates a plain object from a Message_Module_Shape message. Also converts values to other types if specified.
         * @param message Message_Module_Shape
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Module_Shape, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Module_Shape to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Module_Shape
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Module_Shape {

        /** Properties of a Message_Module_Shape. */
        interface $Properties {

            /** Message_Module_Shape shapeType */
            shapeType?: (AMR_MODEL_NSP.MESSAGE_SHAPE_TYPE|null);

            /** Message_Module_Shape boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Message_Module_Shape sphere */
            sphere?: (AMR_MODEL_NSP.Message_Sphere.$Properties|null);

            /** Message_Module_Shape box */
            box?: (AMR_MODEL_NSP.Message_BOX.$Properties|null);

            /** Message_Module_Shape cylinder */
            cylinder?: (AMR_MODEL_NSP.Message_CYLINDER.$Properties|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Module_Shape. */
        type $Shape = AMR_MODEL_NSP.Message_Module_Shape.$Properties;
    }

    /**
     * Properties of a Message_Module_General_Attribute.
     * @deprecated Use AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties instead.
     */
    interface IMessage_Module_General_Attribute extends AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties {
    }

    /** Represents a Message_Module_General_Attribute. */
    class Message_Module_General_Attribute {

        /**
         * Constructs a new Message_Module_General_Attribute.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Module_General_Attribute moduleName. */
        moduleName?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

        /** Message_Module_General_Attribute moduleDesc. */
        moduleDesc?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

        /** Message_Module_General_Attribute moduleUuid. */
        moduleUuid?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

        /** Message_Module_General_Attribute versionInfo. */
        versionInfo?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

        /** Message_Module_General_Attribute module_3dIcon. */
        module_3dIcon?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

        /** Message_Module_General_Attribute subSysType. */
        subSysType?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

        /** Message_Module_General_Attribute mainModuleType. */
        mainModuleType?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

        /** Message_Module_General_Attribute subModuleType. */
        subModuleType?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

        /** Message_Module_General_Attribute venderName. */
        venderName?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

        /** Message_Module_General_Attribute moduleDscType. */
        moduleDscType?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

        /** Message_Module_General_Attribute moduleIcon. */
        moduleIcon?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

        /** Message_Module_General_Attribute moduleShape. */
        moduleShape?: (AMR_MODEL_NSP.Message_Module_Shape.$Properties|null);

        /** Message_Module_General_Attribute boolDeprecated. */
        boolDeprecated: boolean;

        /** Message_Module_General_Attribute extendParams. */
        extendParams: AMR_MODEL_NSP.Message_Base_Element.$Properties[];

        /**
         * Creates a new Message_Module_General_Attribute instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Module_General_Attribute instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Module_General_Attribute.$Shape): AMR_MODEL_NSP.Message_Module_General_Attribute & AMR_MODEL_NSP.Message_Module_General_Attribute.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties): AMR_MODEL_NSP.Message_Module_General_Attribute;

        /**
         * Encodes the specified Message_Module_General_Attribute message. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_General_Attribute.verify|verify} messages.
         * @param message Message_Module_General_Attribute message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Module_General_Attribute message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_General_Attribute.verify|verify} messages.
         * @param message Message_Module_General_Attribute message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Module_General_Attribute message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Module_General_Attribute & AMR_MODEL_NSP.Message_Module_General_Attribute.$Shape} Message_Module_General_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Module_General_Attribute & AMR_MODEL_NSP.Message_Module_General_Attribute.$Shape;

        /**
         * Decodes a Message_Module_General_Attribute message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Module_General_Attribute & AMR_MODEL_NSP.Message_Module_General_Attribute.$Shape} Message_Module_General_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Module_General_Attribute & AMR_MODEL_NSP.Message_Module_General_Attribute.$Shape;

        /**
         * Verifies a Message_Module_General_Attribute message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Module_General_Attribute message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Module_General_Attribute
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Module_General_Attribute;

        /**
         * Creates a plain object from a Message_Module_General_Attribute message. Also converts values to other types if specified.
         * @param message Message_Module_General_Attribute
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Module_General_Attribute, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Module_General_Attribute to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Module_General_Attribute
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Module_General_Attribute {

        /** Properties of a Message_Module_General_Attribute. */
        interface $Properties {

            /** Message_Module_General_Attribute moduleName */
            moduleName?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

            /** Message_Module_General_Attribute moduleDesc */
            moduleDesc?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

            /** Message_Module_General_Attribute moduleUuid */
            moduleUuid?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

            /** Message_Module_General_Attribute versionInfo */
            versionInfo?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

            /** Message_Module_General_Attribute module_3dIcon */
            module_3dIcon?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

            /** Message_Module_General_Attribute subSysType */
            subSysType?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

            /** Message_Module_General_Attribute mainModuleType */
            mainModuleType?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

            /** Message_Module_General_Attribute subModuleType */
            subModuleType?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

            /** Message_Module_General_Attribute venderName */
            venderName?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

            /** Message_Module_General_Attribute moduleDscType */
            moduleDscType?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

            /** Message_Module_General_Attribute moduleIcon */
            moduleIcon?: (AMR_MODEL_NSP.Message_Base_Element.$Properties|null);

            /** Message_Module_General_Attribute moduleShape */
            moduleShape?: (AMR_MODEL_NSP.Message_Module_Shape.$Properties|null);

            /** Message_Module_General_Attribute boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Message_Module_General_Attribute extendParams */
            extendParams?: (AMR_MODEL_NSP.Message_Base_Element.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Module_General_Attribute. */
        type $Shape = AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties;
    }

    /**
     * Properties of a Message_Struct_Param.
     * @deprecated Use AMR_MODEL_NSP.Message_Struct_Param.$Properties instead.
     */
    interface IMessage_Struct_Param extends AMR_MODEL_NSP.Message_Struct_Param.$Properties {
    }

    /** Represents a Message_Struct_Param. */
    class Message_Struct_Param {

        /**
         * Constructs a new Message_Struct_Param.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Struct_Param.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Struct_Param extendParams. */
        extendParams: AMR_MODEL_NSP.Message_Base_Element.$Properties[];

        /** Message_Struct_Param segmentedLimitsParams. */
        segmentedLimitsParams: AMR_MODEL_NSP.Message_Base_Group_Element.$Properties[];

        /** Message_Struct_Param boolDeprecated. */
        boolDeprecated: boolean;

        /**
         * Creates a new Message_Struct_Param instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Struct_Param instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Struct_Param.$Shape): AMR_MODEL_NSP.Message_Struct_Param & AMR_MODEL_NSP.Message_Struct_Param.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Struct_Param.$Properties): AMR_MODEL_NSP.Message_Struct_Param;

        /**
         * Encodes the specified Message_Struct_Param message. Does not implicitly {@link AMR_MODEL_NSP.Message_Struct_Param.verify|verify} messages.
         * @param message Message_Struct_Param message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Struct_Param.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Struct_Param message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Struct_Param.verify|verify} messages.
         * @param message Message_Struct_Param message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Struct_Param.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Struct_Param message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Struct_Param & AMR_MODEL_NSP.Message_Struct_Param.$Shape} Message_Struct_Param
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Struct_Param & AMR_MODEL_NSP.Message_Struct_Param.$Shape;

        /**
         * Decodes a Message_Struct_Param message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Struct_Param & AMR_MODEL_NSP.Message_Struct_Param.$Shape} Message_Struct_Param
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Struct_Param & AMR_MODEL_NSP.Message_Struct_Param.$Shape;

        /**
         * Verifies a Message_Struct_Param message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Struct_Param message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Struct_Param
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Struct_Param;

        /**
         * Creates a plain object from a Message_Struct_Param message. Also converts values to other types if specified.
         * @param message Message_Struct_Param
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Struct_Param, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Struct_Param to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Struct_Param
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Struct_Param {

        /** Properties of a Message_Struct_Param. */
        interface $Properties {

            /** Message_Struct_Param extendParams */
            extendParams?: (AMR_MODEL_NSP.Message_Base_Element.$Properties[]|null);

            /** Message_Struct_Param segmentedLimitsParams */
            segmentedLimitsParams?: (AMR_MODEL_NSP.Message_Base_Group_Element.$Properties[]|null);

            /** Message_Struct_Param boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Struct_Param. */
        type $Shape = AMR_MODEL_NSP.Message_Struct_Param.$Properties;
    }

    /**
     * Properties of a Message_Module_Private_Attribute.
     * @deprecated Use AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties instead.
     */
    interface IMessage_Module_Private_Attribute extends AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties {
    }

    /** Represents a Message_Module_Private_Attribute. */
    class Message_Module_Private_Attribute {

        /**
         * Constructs a new Message_Module_Private_Attribute.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Module_Private_Attribute privateAttrs. */
        privateAttrs: AMR_MODEL_NSP.Message_Base_Group_Element.$Properties[];

        /** Message_Module_Private_Attribute boolDeprecated. */
        boolDeprecated: boolean;

        /**
         * Creates a new Message_Module_Private_Attribute instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Module_Private_Attribute instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Module_Private_Attribute.$Shape): AMR_MODEL_NSP.Message_Module_Private_Attribute & AMR_MODEL_NSP.Message_Module_Private_Attribute.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties): AMR_MODEL_NSP.Message_Module_Private_Attribute;

        /**
         * Encodes the specified Message_Module_Private_Attribute message. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Private_Attribute.verify|verify} messages.
         * @param message Message_Module_Private_Attribute message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Module_Private_Attribute message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Private_Attribute.verify|verify} messages.
         * @param message Message_Module_Private_Attribute message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Module_Private_Attribute message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Module_Private_Attribute & AMR_MODEL_NSP.Message_Module_Private_Attribute.$Shape} Message_Module_Private_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Module_Private_Attribute & AMR_MODEL_NSP.Message_Module_Private_Attribute.$Shape;

        /**
         * Decodes a Message_Module_Private_Attribute message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Module_Private_Attribute & AMR_MODEL_NSP.Message_Module_Private_Attribute.$Shape} Message_Module_Private_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Module_Private_Attribute & AMR_MODEL_NSP.Message_Module_Private_Attribute.$Shape;

        /**
         * Verifies a Message_Module_Private_Attribute message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Module_Private_Attribute message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Module_Private_Attribute
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Module_Private_Attribute;

        /**
         * Creates a plain object from a Message_Module_Private_Attribute message. Also converts values to other types if specified.
         * @param message Message_Module_Private_Attribute
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Module_Private_Attribute, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Module_Private_Attribute to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Module_Private_Attribute
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Module_Private_Attribute {

        /** Properties of a Message_Module_Private_Attribute. */
        interface $Properties {

            /** Message_Module_Private_Attribute privateAttrs */
            privateAttrs?: (AMR_MODEL_NSP.Message_Base_Group_Element.$Properties[]|null);

            /** Message_Module_Private_Attribute boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Module_Private_Attribute. */
        type $Shape = AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties;
    }

    /**
     * Properties of a Message_Bus_Interface_Element.
     * @deprecated Use AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties instead.
     */
    interface IMessage_Bus_Interface_Element extends AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties {
    }

    /** Represents a Message_Bus_Interface_Element. */
    class Message_Bus_Interface_Element {

        /**
         * Constructs a new Message_Bus_Interface_Element.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Bus_Interface_Element busInterfaceType. */
        busInterfaceType: string;

        /** Message_Bus_Interface_Element busInterfaceSubType. */
        busInterfaceSubType: string;

        /** Message_Bus_Interface_Element busInterfaceNums. */
        busInterfaceNums: number;

        /** Message_Bus_Interface_Element boolDeprecated. */
        boolDeprecated: boolean;

        /**
         * Creates a new Message_Bus_Interface_Element instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Bus_Interface_Element instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Bus_Interface_Element.$Shape): AMR_MODEL_NSP.Message_Bus_Interface_Element & AMR_MODEL_NSP.Message_Bus_Interface_Element.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties): AMR_MODEL_NSP.Message_Bus_Interface_Element;

        /**
         * Encodes the specified Message_Bus_Interface_Element message. Does not implicitly {@link AMR_MODEL_NSP.Message_Bus_Interface_Element.verify|verify} messages.
         * @param message Message_Bus_Interface_Element message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Bus_Interface_Element message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Bus_Interface_Element.verify|verify} messages.
         * @param message Message_Bus_Interface_Element message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Bus_Interface_Element message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Bus_Interface_Element & AMR_MODEL_NSP.Message_Bus_Interface_Element.$Shape} Message_Bus_Interface_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Bus_Interface_Element & AMR_MODEL_NSP.Message_Bus_Interface_Element.$Shape;

        /**
         * Decodes a Message_Bus_Interface_Element message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Bus_Interface_Element & AMR_MODEL_NSP.Message_Bus_Interface_Element.$Shape} Message_Bus_Interface_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Bus_Interface_Element & AMR_MODEL_NSP.Message_Bus_Interface_Element.$Shape;

        /**
         * Verifies a Message_Bus_Interface_Element message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Bus_Interface_Element message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Bus_Interface_Element
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Bus_Interface_Element;

        /**
         * Creates a plain object from a Message_Bus_Interface_Element message. Also converts values to other types if specified.
         * @param message Message_Bus_Interface_Element
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Bus_Interface_Element, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Bus_Interface_Element to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Bus_Interface_Element
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Bus_Interface_Element {

        /** Properties of a Message_Bus_Interface_Element. */
        interface $Properties {

            /** Message_Bus_Interface_Element busInterfaceType */
            busInterfaceType?: (string|null);

            /** Message_Bus_Interface_Element busInterfaceSubType */
            busInterfaceSubType?: (string|null);

            /** Message_Bus_Interface_Element busInterfaceNums */
            busInterfaceNums?: (number|null);

            /** Message_Bus_Interface_Element boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Bus_Interface_Element. */
        type $Shape = AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties;
    }

    /**
     * Properties of a Message_Interface_Ability.
     * @deprecated Use AMR_MODEL_NSP.Message_Interface_Ability.$Properties instead.
     */
    interface IMessage_Interface_Ability extends AMR_MODEL_NSP.Message_Interface_Ability.$Properties {
    }

    /** Represents a Message_Interface_Ability. */
    class Message_Interface_Ability {

        /**
         * Constructs a new Message_Interface_Ability.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Interface_Ability.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Interface_Ability busInterfaceAbility. */
        busInterfaceAbility: AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties[];

        /** Message_Interface_Ability boolDeprecated. */
        boolDeprecated: boolean;

        /**
         * Creates a new Message_Interface_Ability instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Interface_Ability instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Interface_Ability.$Shape): AMR_MODEL_NSP.Message_Interface_Ability & AMR_MODEL_NSP.Message_Interface_Ability.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Interface_Ability.$Properties): AMR_MODEL_NSP.Message_Interface_Ability;

        /**
         * Encodes the specified Message_Interface_Ability message. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Ability.verify|verify} messages.
         * @param message Message_Interface_Ability message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Interface_Ability.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Interface_Ability message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Ability.verify|verify} messages.
         * @param message Message_Interface_Ability message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Interface_Ability.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Interface_Ability message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Interface_Ability & AMR_MODEL_NSP.Message_Interface_Ability.$Shape} Message_Interface_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Interface_Ability & AMR_MODEL_NSP.Message_Interface_Ability.$Shape;

        /**
         * Decodes a Message_Interface_Ability message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Interface_Ability & AMR_MODEL_NSP.Message_Interface_Ability.$Shape} Message_Interface_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Interface_Ability & AMR_MODEL_NSP.Message_Interface_Ability.$Shape;

        /**
         * Verifies a Message_Interface_Ability message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Interface_Ability message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Interface_Ability
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Interface_Ability;

        /**
         * Creates a plain object from a Message_Interface_Ability message. Also converts values to other types if specified.
         * @param message Message_Interface_Ability
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Interface_Ability, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Interface_Ability to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Interface_Ability
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Interface_Ability {

        /** Properties of a Message_Interface_Ability. */
        interface $Properties {

            /** Message_Interface_Ability busInterfaceAbility */
            busInterfaceAbility?: (AMR_MODEL_NSP.Message_Bus_Interface_Element.$Properties[]|null);

            /** Message_Interface_Ability boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Interface_Ability. */
        type $Shape = AMR_MODEL_NSP.Message_Interface_Ability.$Properties;
    }

    /**
     * Properties of a Message_Interface_Attribute.
     * @deprecated Use AMR_MODEL_NSP.Message_Interface_Attribute.$Properties instead.
     */
    interface IMessage_Interface_Attribute extends AMR_MODEL_NSP.Message_Interface_Attribute.$Properties {
    }

    /** Represents a Message_Interface_Attribute. */
    class Message_Interface_Attribute {

        /**
         * Constructs a new Message_Interface_Attribute.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Interface_Attribute.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Interface_Attribute interfaceParamsArray. */
        interfaceParamsArray: AMR_MODEL_NSP.Message_Base_Element.$Properties[];

        /** Message_Interface_Attribute boolDeprecated. */
        boolDeprecated: boolean;

        /**
         * Creates a new Message_Interface_Attribute instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Interface_Attribute instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Interface_Attribute.$Shape): AMR_MODEL_NSP.Message_Interface_Attribute & AMR_MODEL_NSP.Message_Interface_Attribute.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Interface_Attribute.$Properties): AMR_MODEL_NSP.Message_Interface_Attribute;

        /**
         * Encodes the specified Message_Interface_Attribute message. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Attribute.verify|verify} messages.
         * @param message Message_Interface_Attribute message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Interface_Attribute.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Interface_Attribute message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Attribute.verify|verify} messages.
         * @param message Message_Interface_Attribute message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Interface_Attribute.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Interface_Attribute message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Interface_Attribute & AMR_MODEL_NSP.Message_Interface_Attribute.$Shape} Message_Interface_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Interface_Attribute & AMR_MODEL_NSP.Message_Interface_Attribute.$Shape;

        /**
         * Decodes a Message_Interface_Attribute message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Interface_Attribute & AMR_MODEL_NSP.Message_Interface_Attribute.$Shape} Message_Interface_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Interface_Attribute & AMR_MODEL_NSP.Message_Interface_Attribute.$Shape;

        /**
         * Verifies a Message_Interface_Attribute message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Interface_Attribute message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Interface_Attribute
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Interface_Attribute;

        /**
         * Creates a plain object from a Message_Interface_Attribute message. Also converts values to other types if specified.
         * @param message Message_Interface_Attribute
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Interface_Attribute, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Interface_Attribute to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Interface_Attribute
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Interface_Attribute {

        /** Properties of a Message_Interface_Attribute. */
        interface $Properties {

            /** Message_Interface_Attribute interfaceParamsArray */
            interfaceParamsArray?: (AMR_MODEL_NSP.Message_Base_Element.$Properties[]|null);

            /** Message_Interface_Attribute boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Interface_Attribute. */
        type $Shape = AMR_MODEL_NSP.Message_Interface_Attribute.$Properties;
    }

    /**
     * Properties of a Message_Interface_Param_Group.
     * @deprecated Use AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties instead.
     */
    interface IMessage_Interface_Param_Group extends AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties {
    }

    /** Represents a Message_Interface_Param_Group. */
    class Message_Interface_Param_Group {

        /**
         * Constructs a new Message_Interface_Param_Group.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Interface_Param_Group key. */
        key: string;

        /** Message_Interface_Param_Group type. */
        type: string;

        /** Message_Interface_Param_Group path. */
        path: string;

        /** Message_Interface_Param_Group desc. */
        desc: string;

        /** Message_Interface_Param_Group interfaceUuid. */
        interfaceUuid: string;

        /** Message_Interface_Param_Group linkedInterfaceUuid. */
        linkedInterfaceUuid: string[];

        /** Message_Interface_Param_Group linkAttrs. */
        linkAttrs: AMR_MODEL_NSP.Message_Combox_Item.$Properties[];

        /** Message_Interface_Param_Group interfaceAttrs. */
        interfaceAttrs?: (AMR_MODEL_NSP.Message_Interface_Attribute.$Properties|null);

        /** Message_Interface_Param_Group interfaceParams. */
        interfaceParams?: (AMR_MODEL_NSP.Message_Interface_Attribute.$Properties|null);

        /** Message_Interface_Param_Group boolDeprecated. */
        boolDeprecated: boolean;

        /**
         * Creates a new Message_Interface_Param_Group instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Interface_Param_Group instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Interface_Param_Group.$Shape): AMR_MODEL_NSP.Message_Interface_Param_Group & AMR_MODEL_NSP.Message_Interface_Param_Group.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties): AMR_MODEL_NSP.Message_Interface_Param_Group;

        /**
         * Encodes the specified Message_Interface_Param_Group message. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Param_Group.verify|verify} messages.
         * @param message Message_Interface_Param_Group message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Interface_Param_Group message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Param_Group.verify|verify} messages.
         * @param message Message_Interface_Param_Group message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Interface_Param_Group message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Interface_Param_Group & AMR_MODEL_NSP.Message_Interface_Param_Group.$Shape} Message_Interface_Param_Group
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Interface_Param_Group & AMR_MODEL_NSP.Message_Interface_Param_Group.$Shape;

        /**
         * Decodes a Message_Interface_Param_Group message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Interface_Param_Group & AMR_MODEL_NSP.Message_Interface_Param_Group.$Shape} Message_Interface_Param_Group
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Interface_Param_Group & AMR_MODEL_NSP.Message_Interface_Param_Group.$Shape;

        /**
         * Verifies a Message_Interface_Param_Group message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Interface_Param_Group message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Interface_Param_Group
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Interface_Param_Group;

        /**
         * Creates a plain object from a Message_Interface_Param_Group message. Also converts values to other types if specified.
         * @param message Message_Interface_Param_Group
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Interface_Param_Group, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Interface_Param_Group to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Interface_Param_Group
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Interface_Param_Group {

        /** Properties of a Message_Interface_Param_Group. */
        interface $Properties {

            /** Message_Interface_Param_Group key */
            key?: (string|null);

            /** Message_Interface_Param_Group type */
            type?: (string|null);

            /** Message_Interface_Param_Group path */
            path?: (string|null);

            /** Message_Interface_Param_Group desc */
            desc?: (string|null);

            /** Message_Interface_Param_Group interfaceUuid */
            interfaceUuid?: (string|null);

            /** Message_Interface_Param_Group linkedInterfaceUuid */
            linkedInterfaceUuid?: (string[]|null);

            /** Message_Interface_Param_Group linkAttrs */
            linkAttrs?: (AMR_MODEL_NSP.Message_Combox_Item.$Properties[]|null);

            /** Message_Interface_Param_Group interfaceAttrs */
            interfaceAttrs?: (AMR_MODEL_NSP.Message_Interface_Attribute.$Properties|null);

            /** Message_Interface_Param_Group interfaceParams */
            interfaceParams?: (AMR_MODEL_NSP.Message_Interface_Attribute.$Properties|null);

            /** Message_Interface_Param_Group boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Interface_Param_Group. */
        type $Shape = AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties;
    }

    /**
     * Properties of a Message_Interface_Param.
     * @deprecated Use AMR_MODEL_NSP.Message_Interface_Param.$Properties instead.
     */
    interface IMessage_Interface_Param extends AMR_MODEL_NSP.Message_Interface_Param.$Properties {
    }

    /** Represents a Message_Interface_Param. */
    class Message_Interface_Param {

        /**
         * Constructs a new Message_Interface_Param.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Interface_Param.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Interface_Param interface_Group. */
        interface_Group: AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties[];

        /** Message_Interface_Param nodePosX. */
        nodePosX: number;

        /** Message_Interface_Param nodePosY. */
        nodePosY: number;

        /** Message_Interface_Param boolDeprecated. */
        boolDeprecated: boolean;

        /**
         * Creates a new Message_Interface_Param instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Interface_Param instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Interface_Param.$Shape): AMR_MODEL_NSP.Message_Interface_Param & AMR_MODEL_NSP.Message_Interface_Param.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Interface_Param.$Properties): AMR_MODEL_NSP.Message_Interface_Param;

        /**
         * Encodes the specified Message_Interface_Param message. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Param.verify|verify} messages.
         * @param message Message_Interface_Param message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Interface_Param.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Interface_Param message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Interface_Param.verify|verify} messages.
         * @param message Message_Interface_Param message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Interface_Param.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Interface_Param message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Interface_Param & AMR_MODEL_NSP.Message_Interface_Param.$Shape} Message_Interface_Param
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Interface_Param & AMR_MODEL_NSP.Message_Interface_Param.$Shape;

        /**
         * Decodes a Message_Interface_Param message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Interface_Param & AMR_MODEL_NSP.Message_Interface_Param.$Shape} Message_Interface_Param
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Interface_Param & AMR_MODEL_NSP.Message_Interface_Param.$Shape;

        /**
         * Verifies a Message_Interface_Param message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Interface_Param message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Interface_Param
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Interface_Param;

        /**
         * Creates a plain object from a Message_Interface_Param message. Also converts values to other types if specified.
         * @param message Message_Interface_Param
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Interface_Param, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Interface_Param to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Interface_Param
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Interface_Param {

        /** Properties of a Message_Interface_Param. */
        interface $Properties {

            /** Message_Interface_Param interface_Group */
            interface_Group?: (AMR_MODEL_NSP.Message_Interface_Param_Group.$Properties[]|null);

            /** Message_Interface_Param nodePosX */
            nodePosX?: (number|null);

            /** Message_Interface_Param nodePosY */
            nodePosY?: (number|null);

            /** Message_Interface_Param boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Interface_Param. */
        type $Shape = AMR_MODEL_NSP.Message_Interface_Param.$Properties;
    }

    /**
     * Properties of a Message_Module_Componets.
     * @deprecated Use AMR_MODEL_NSP.Message_Module_Componets.$Properties instead.
     */
    interface IMessage_Module_Componets extends AMR_MODEL_NSP.Message_Module_Componets.$Properties {
    }

    /** Represents a Message_Module_Componets. */
    class Message_Module_Componets {

        /**
         * Constructs a new Message_Module_Componets.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Module_Componets.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Module_Componets generalAttr. */
        generalAttr?: (AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties|null);

        /** Message_Module_Componets privateAttr. */
        privateAttr?: (AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties|null);

        /** Message_Module_Componets interfaceAbility. */
        interfaceAbility?: (AMR_MODEL_NSP.Message_Interface_Ability.$Properties|null);

        /** Message_Module_Componets interfaceParams. */
        interfaceParams?: (AMR_MODEL_NSP.Message_Interface_Param.$Properties|null);

        /** Message_Module_Componets structParam. */
        structParam?: (AMR_MODEL_NSP.Message_Struct_Param.$Properties|null);

        /** Message_Module_Componets boolDeprecated. */
        boolDeprecated: boolean;

        /** Message_Module_Componets boolDisable. */
        boolDisable: boolean;

        /**
         * Creates a new Message_Module_Componets instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Module_Componets instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Module_Componets.$Shape): AMR_MODEL_NSP.Message_Module_Componets & AMR_MODEL_NSP.Message_Module_Componets.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Module_Componets.$Properties): AMR_MODEL_NSP.Message_Module_Componets;

        /**
         * Encodes the specified Message_Module_Componets message. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Componets.verify|verify} messages.
         * @param message Message_Module_Componets message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Module_Componets.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Module_Componets message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Componets.verify|verify} messages.
         * @param message Message_Module_Componets message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Module_Componets.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Module_Componets message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Module_Componets & AMR_MODEL_NSP.Message_Module_Componets.$Shape} Message_Module_Componets
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Module_Componets & AMR_MODEL_NSP.Message_Module_Componets.$Shape;

        /**
         * Decodes a Message_Module_Componets message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Module_Componets & AMR_MODEL_NSP.Message_Module_Componets.$Shape} Message_Module_Componets
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Module_Componets & AMR_MODEL_NSP.Message_Module_Componets.$Shape;

        /**
         * Verifies a Message_Module_Componets message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Module_Componets message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Module_Componets
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Module_Componets;

        /**
         * Creates a plain object from a Message_Module_Componets message. Also converts values to other types if specified.
         * @param message Message_Module_Componets
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Module_Componets, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Module_Componets to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Module_Componets
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Module_Componets {

        /** Properties of a Message_Module_Componets. */
        interface $Properties {

            /** Message_Module_Componets generalAttr */
            generalAttr?: (AMR_MODEL_NSP.Message_Module_General_Attribute.$Properties|null);

            /** Message_Module_Componets privateAttr */
            privateAttr?: (AMR_MODEL_NSP.Message_Module_Private_Attribute.$Properties|null);

            /** Message_Module_Componets interfaceAbility */
            interfaceAbility?: (AMR_MODEL_NSP.Message_Interface_Ability.$Properties|null);

            /** Message_Module_Componets interfaceParams */
            interfaceParams?: (AMR_MODEL_NSP.Message_Interface_Param.$Properties|null);

            /** Message_Module_Componets structParam */
            structParam?: (AMR_MODEL_NSP.Message_Struct_Param.$Properties|null);

            /** Message_Module_Componets boolDeprecated */
            boolDeprecated?: (boolean|null);

            /** Message_Module_Componets boolDisable */
            boolDisable?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Module_Componets. */
        type $Shape = AMR_MODEL_NSP.Message_Module_Componets.$Properties;
    }

    /**
     * Properties of a Message_Module_Info.
     * @deprecated Use AMR_MODEL_NSP.Message_Module_Info.$Properties instead.
     */
    interface IMessage_Module_Info extends AMR_MODEL_NSP.Message_Module_Info.$Properties {
    }

    /** Represents a Message_Module_Info. */
    class Message_Module_Info {

        /**
         * Constructs a new Message_Module_Info.
         * @param [properties] Properties to set
         */
        constructor(properties?: AMR_MODEL_NSP.Message_Module_Info.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Module_Info moduleGroupName. */
        moduleGroupName: string;

        /** Message_Module_Info moduleGroupUuid. */
        moduleGroupUuid: string;

        /** Message_Module_Info moduleSys. */
        moduleSys: string;

        /** Message_Module_Info moduleComponets. */
        moduleComponets: AMR_MODEL_NSP.Message_Module_Componets.$Properties[];

        /** Message_Module_Info moreModuleInfo. */
        moreModuleInfo: AMR_MODEL_NSP.Message_Module_Info.$Properties[];

        /** Message_Module_Info modelVersion. */
        modelVersion: string;

        /**
         * Creates a new Message_Module_Info instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Module_Info instance
         */
        static create(properties: AMR_MODEL_NSP.Message_Module_Info.$Shape): AMR_MODEL_NSP.Message_Module_Info & AMR_MODEL_NSP.Message_Module_Info.$Shape;
        static create(properties?: AMR_MODEL_NSP.Message_Module_Info.$Properties): AMR_MODEL_NSP.Message_Module_Info;

        /**
         * Encodes the specified Message_Module_Info message. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Info.verify|verify} messages.
         * @param message Message_Module_Info message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: AMR_MODEL_NSP.Message_Module_Info.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Module_Info message, length delimited. Does not implicitly {@link AMR_MODEL_NSP.Message_Module_Info.verify|verify} messages.
         * @param message Message_Module_Info message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: AMR_MODEL_NSP.Message_Module_Info.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Module_Info message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {AMR_MODEL_NSP.Message_Module_Info & AMR_MODEL_NSP.Message_Module_Info.$Shape} Message_Module_Info
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AMR_MODEL_NSP.Message_Module_Info & AMR_MODEL_NSP.Message_Module_Info.$Shape;

        /**
         * Decodes a Message_Module_Info message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {AMR_MODEL_NSP.Message_Module_Info & AMR_MODEL_NSP.Message_Module_Info.$Shape} Message_Module_Info
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AMR_MODEL_NSP.Message_Module_Info & AMR_MODEL_NSP.Message_Module_Info.$Shape;

        /**
         * Verifies a Message_Module_Info message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Module_Info message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Module_Info
         */
        static fromObject(object: { [k: string]: any }): AMR_MODEL_NSP.Message_Module_Info;

        /**
         * Creates a plain object from a Message_Module_Info message. Also converts values to other types if specified.
         * @param message Message_Module_Info
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: AMR_MODEL_NSP.Message_Module_Info, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Module_Info to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Module_Info
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Module_Info {

        /** Properties of a Message_Module_Info. */
        interface $Properties {

            /** Message_Module_Info moduleGroupName */
            moduleGroupName?: (string|null);

            /** Message_Module_Info moduleGroupUuid */
            moduleGroupUuid?: (string|null);

            /** Message_Module_Info moduleSys */
            moduleSys?: (string|null);

            /** Message_Module_Info moduleComponets */
            moduleComponets?: (AMR_MODEL_NSP.Message_Module_Componets.$Properties[]|null);

            /** Message_Module_Info moreModuleInfo */
            moreModuleInfo?: (AMR_MODEL_NSP.Message_Module_Info.$Properties[]|null);

            /** Message_Module_Info modelVersion */
            modelVersion?: (string|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Module_Info. */
        type $Shape = AMR_MODEL_NSP.Message_Module_Info.$Properties;
    }
}

/** Namespace MODEL_ABI. */
export namespace MODEL_ABI {

    /** MESSAGE_ATTRIBUTE_TYPE enum. */
    enum MESSAGE_ATTRIBUTE_TYPE {

        /** BYTES_E value */
        BYTES_E = 0,

        /** STRING_E value */
        STRING_E = 1,

        /** IP_E value */
        IP_E = 3,

        /** BOOL_E value */
        BOOL_E = 4,

        /** INT32_E value */
        INT32_E = 5,

        /** UINT32_E value */
        UINT32_E = 6,

        /** INT64_E value */
        INT64_E = 7,

        /** UINT64_E value */
        UINT64_E = 8,

        /** FLOAT_E value */
        FLOAT_E = 9,

        /** DOUBLE_E value */
        DOUBLE_E = 10,

        /** FIXED_E value */
        FIXED_E = 11,

        /** DATA_COMBOX_E value */
        DATA_COMBOX_E = 12
    }

    /** MESSAGE_ATTRIBUTE_OPTION enum. */
    enum MESSAGE_ATTRIBUTE_OPTION {

        /** REQUIRED_E value */
        REQUIRED_E = 0,

        /** OPTIONAL_E value */
        OPTIONAL_E = 1
    }

    /** COMBOX_SOURCE_TYPE enum. */
    enum COMBOX_SOURCE_TYPE {

        /** NORMAL_E value */
        NORMAL_E = 0,

        /** CUSTOM_E value */
        CUSTOM_E = 1
    }

    /** COMMON_ATTR_TYPE enum. */
    enum COMMON_ATTR_TYPE {

        /** COMBOX_E value */
        COMBOX_E = 0,

        /** ARRAY_E value */
        ARRAY_E = 1
    }

    /**
     * Properties of a Message_Combox_Item.
     * @deprecated Use MODEL_ABI.Message_Combox_Item.$Properties instead.
     */
    interface IMessage_Combox_Item extends MODEL_ABI.Message_Combox_Item.$Properties {
    }

    /** Represents a Message_Combox_Item. */
    class Message_Combox_Item {

        /**
         * Constructs a new Message_Combox_Item.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Message_Combox_Item.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Combox_Item key. */
        key: string;

        /** Message_Combox_Item desc. */
        desc: string;

        /** Message_Combox_Item arrayCmobEle. */
        arrayCmobEle: MODEL_ABI.Message_Attribute.$Properties[];

        /**
         * Creates a new Message_Combox_Item instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Combox_Item instance
         */
        static create(properties: MODEL_ABI.Message_Combox_Item.$Shape): MODEL_ABI.Message_Combox_Item & MODEL_ABI.Message_Combox_Item.$Shape;
        static create(properties?: MODEL_ABI.Message_Combox_Item.$Properties): MODEL_ABI.Message_Combox_Item;

        /**
         * Encodes the specified Message_Combox_Item message. Does not implicitly {@link MODEL_ABI.Message_Combox_Item.verify|verify} messages.
         * @param message Message_Combox_Item message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Message_Combox_Item.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Combox_Item message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Combox_Item.verify|verify} messages.
         * @param message Message_Combox_Item message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Message_Combox_Item.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Combox_Item message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Combox_Item & MODEL_ABI.Message_Combox_Item.$Shape} Message_Combox_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Message_Combox_Item & MODEL_ABI.Message_Combox_Item.$Shape;

        /**
         * Decodes a Message_Combox_Item message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Combox_Item & MODEL_ABI.Message_Combox_Item.$Shape} Message_Combox_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Message_Combox_Item & MODEL_ABI.Message_Combox_Item.$Shape;

        /**
         * Verifies a Message_Combox_Item message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Combox_Item message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Combox_Item
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Message_Combox_Item;

        /**
         * Creates a plain object from a Message_Combox_Item message. Also converts values to other types if specified.
         * @param message Message_Combox_Item
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Message_Combox_Item, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Combox_Item to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Combox_Item
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Combox_Item {

        /** Properties of a Message_Combox_Item. */
        interface $Properties {

            /** Message_Combox_Item key */
            key?: (string|null);

            /** Message_Combox_Item desc */
            desc?: (string|null);

            /** Message_Combox_Item arrayCmobEle */
            arrayCmobEle?: (MODEL_ABI.Message_Attribute.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Combox_Item. */
        type $Shape = MODEL_ABI.Message_Combox_Item.$Properties;
    }

    /**
     * Properties of a Message_Combox_Type.
     * @deprecated Use MODEL_ABI.Message_Combox_Type.$Properties instead.
     */
    interface IMessage_Combox_Type extends MODEL_ABI.Message_Combox_Type.$Properties {
    }

    /** Represents a Message_Combox_Type. */
    class Message_Combox_Type {

        /**
         * Constructs a new Message_Combox_Type.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Message_Combox_Type.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Combox_Type typeKey. */
        typeKey: string;

        /** Message_Combox_Type typeDesc. */
        typeDesc: string;

        /** Message_Combox_Type typeGroups. */
        typeGroups: MODEL_ABI.Message_Combox_Item.$Properties[];

        /**
         * Creates a new Message_Combox_Type instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Combox_Type instance
         */
        static create(properties: MODEL_ABI.Message_Combox_Type.$Shape): MODEL_ABI.Message_Combox_Type & MODEL_ABI.Message_Combox_Type.$Shape;
        static create(properties?: MODEL_ABI.Message_Combox_Type.$Properties): MODEL_ABI.Message_Combox_Type;

        /**
         * Encodes the specified Message_Combox_Type message. Does not implicitly {@link MODEL_ABI.Message_Combox_Type.verify|verify} messages.
         * @param message Message_Combox_Type message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Message_Combox_Type.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Combox_Type message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Combox_Type.verify|verify} messages.
         * @param message Message_Combox_Type message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Message_Combox_Type.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Combox_Type message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Combox_Type & MODEL_ABI.Message_Combox_Type.$Shape} Message_Combox_Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Message_Combox_Type & MODEL_ABI.Message_Combox_Type.$Shape;

        /**
         * Decodes a Message_Combox_Type message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Combox_Type & MODEL_ABI.Message_Combox_Type.$Shape} Message_Combox_Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Message_Combox_Type & MODEL_ABI.Message_Combox_Type.$Shape;

        /**
         * Verifies a Message_Combox_Type message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Combox_Type message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Combox_Type
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Message_Combox_Type;

        /**
         * Creates a plain object from a Message_Combox_Type message. Also converts values to other types if specified.
         * @param message Message_Combox_Type
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Message_Combox_Type, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Combox_Type to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Combox_Type
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Combox_Type {

        /** Properties of a Message_Combox_Type. */
        interface $Properties {

            /** Message_Combox_Type typeKey */
            typeKey?: (string|null);

            /** Message_Combox_Type typeDesc */
            typeDesc?: (string|null);

            /** Message_Combox_Type typeGroups */
            typeGroups?: (MODEL_ABI.Message_Combox_Item.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Combox_Type. */
        type $Shape = MODEL_ABI.Message_Combox_Type.$Properties;
    }

    /**
     * Properties of a Message_Attribute.
     * @deprecated Use MODEL_ABI.Message_Attribute.$Properties instead.
     */
    interface IMessage_Attribute extends MODEL_ABI.Message_Attribute.$Properties {
    }

    /** Represents a Message_Attribute. */
    class Message_Attribute {

        /**
         * Constructs a new Message_Attribute.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Message_Attribute.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Attribute key. */
        key: string;

        /** Message_Attribute desc. */
        desc: string;

        /** Message_Attribute tips. */
        tips: string;

        /** Message_Attribute maxCount. */
        maxCount: number;

        /** Message_Attribute type. */
        type: MODEL_ABI.MESSAGE_ATTRIBUTE_TYPE;

        /** Message_Attribute stringValue. */
        stringValue: string;

        /** Message_Attribute boolValue. */
        boolValue: boolean;

        /** Message_Attribute int32Value. */
        int32Value: number;

        /** Message_Attribute uint32Value. */
        uint32Value: number;

        /** Message_Attribute int64Value. */
        int64Value: (number|Long);

        /** Message_Attribute uint64Value. */
        uint64Value: (number|Long);

        /** Message_Attribute floatValue. */
        floatValue: number;

        /** Message_Attribute doubleValue. */
        doubleValue: number;

        /** Message_Attribute bytesValue. */
        bytesValue: Uint8Array;

        /** Message_Attribute stringFix. */
        stringFix: string;

        /** Message_Attribute comboType. */
        comboType?: (MODEL_ABI.Message_Combox_Type.$Properties|null);

        /** Message_Attribute int32Maxvalue. */
        int32Maxvalue: number;

        /** Message_Attribute uint32Maxvalue. */
        uint32Maxvalue: number;

        /** Message_Attribute int64Maxvalue. */
        int64Maxvalue: (number|Long);

        /** Message_Attribute uint64Maxvalue. */
        uint64Maxvalue: (number|Long);

        /** Message_Attribute floatMaxvalue. */
        floatMaxvalue: number;

        /** Message_Attribute doubleMaxvalue. */
        doubleMaxvalue: number;

        /** Message_Attribute int32Minvalue. */
        int32Minvalue: number;

        /** Message_Attribute uint32Minvalue. */
        uint32Minvalue: number;

        /** Message_Attribute int64Minvalue. */
        int64Minvalue: (number|Long);

        /** Message_Attribute uint64Minvalue. */
        uint64Minvalue: (number|Long);

        /** Message_Attribute floatMinvalue. */
        floatMinvalue: number;

        /** Message_Attribute doubleMinvalue. */
        doubleMinvalue: number;

        /** Message_Attribute unit. */
        unit: string;

        /** Message_Attribute fixedSource. */
        fixedSource: string[];

        /** Message_Attribute copyEnable. */
        copyEnable: boolean;

        /** Message_Attribute option. */
        option: MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION;

        /**
         * Creates a new Message_Attribute instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Attribute instance
         */
        static create(properties: MODEL_ABI.Message_Attribute.$Shape): MODEL_ABI.Message_Attribute & MODEL_ABI.Message_Attribute.$Shape;
        static create(properties?: MODEL_ABI.Message_Attribute.$Properties): MODEL_ABI.Message_Attribute;

        /**
         * Encodes the specified Message_Attribute message. Does not implicitly {@link MODEL_ABI.Message_Attribute.verify|verify} messages.
         * @param message Message_Attribute message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Message_Attribute.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Attribute message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Attribute.verify|verify} messages.
         * @param message Message_Attribute message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Message_Attribute.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Attribute message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Attribute & MODEL_ABI.Message_Attribute.$Shape} Message_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Message_Attribute & MODEL_ABI.Message_Attribute.$Shape;

        /**
         * Decodes a Message_Attribute message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Attribute & MODEL_ABI.Message_Attribute.$Shape} Message_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Message_Attribute & MODEL_ABI.Message_Attribute.$Shape;

        /**
         * Verifies a Message_Attribute message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Attribute message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Attribute
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Message_Attribute;

        /**
         * Creates a plain object from a Message_Attribute message. Also converts values to other types if specified.
         * @param message Message_Attribute
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Message_Attribute, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Attribute to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Attribute
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Attribute {

        /** Properties of a Message_Attribute. */
        interface $Properties {

            /** Message_Attribute key */
            key?: (string|null);

            /** Message_Attribute desc */
            desc?: (string|null);

            /** Message_Attribute tips */
            tips?: (string|null);

            /** Message_Attribute maxCount */
            maxCount?: (number|null);

            /** Message_Attribute type */
            type?: (MODEL_ABI.MESSAGE_ATTRIBUTE_TYPE|null);

            /** Message_Attribute stringValue */
            stringValue?: (string|null);

            /** Message_Attribute boolValue */
            boolValue?: (boolean|null);

            /** Message_Attribute int32Value */
            int32Value?: (number|null);

            /** Message_Attribute uint32Value */
            uint32Value?: (number|null);

            /** Message_Attribute int64Value */
            int64Value?: (number|Long|null);

            /** Message_Attribute uint64Value */
            uint64Value?: (number|Long|null);

            /** Message_Attribute floatValue */
            floatValue?: (number|null);

            /** Message_Attribute doubleValue */
            doubleValue?: (number|null);

            /** Message_Attribute bytesValue */
            bytesValue?: (Uint8Array|null);

            /** Message_Attribute stringFix */
            stringFix?: (string|null);

            /** Message_Attribute comboType */
            comboType?: (MODEL_ABI.Message_Combox_Type.$Properties|null);

            /** Message_Attribute int32Maxvalue */
            int32Maxvalue?: (number|null);

            /** Message_Attribute uint32Maxvalue */
            uint32Maxvalue?: (number|null);

            /** Message_Attribute int64Maxvalue */
            int64Maxvalue?: (number|Long|null);

            /** Message_Attribute uint64Maxvalue */
            uint64Maxvalue?: (number|Long|null);

            /** Message_Attribute floatMaxvalue */
            floatMaxvalue?: (number|null);

            /** Message_Attribute doubleMaxvalue */
            doubleMaxvalue?: (number|null);

            /** Message_Attribute int32Minvalue */
            int32Minvalue?: (number|null);

            /** Message_Attribute uint32Minvalue */
            uint32Minvalue?: (number|null);

            /** Message_Attribute int64Minvalue */
            int64Minvalue?: (number|Long|null);

            /** Message_Attribute uint64Minvalue */
            uint64Minvalue?: (number|Long|null);

            /** Message_Attribute floatMinvalue */
            floatMinvalue?: (number|null);

            /** Message_Attribute doubleMinvalue */
            doubleMinvalue?: (number|null);

            /** Message_Attribute unit */
            unit?: (string|null);

            /** Message_Attribute fixedSource */
            fixedSource?: (string[]|null);

            /** Message_Attribute copyEnable */
            copyEnable?: (boolean|null);

            /** Message_Attribute option */
            option?: (MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Attribute. */
        type $Shape = MODEL_ABI.Message_Attribute.$Properties;
    }

    /**
     * Properties of a Message_Custom_Combox_Element.
     * @deprecated Use MODEL_ABI.Message_Custom_Combox_Element.$Properties instead.
     */
    interface IMessage_Custom_Combox_Element extends MODEL_ABI.Message_Custom_Combox_Element.$Properties {
    }

    /** Represents a Message_Custom_Combox_Element. */
    class Message_Custom_Combox_Element {

        /**
         * Constructs a new Message_Custom_Combox_Element.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Message_Custom_Combox_Element.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Custom_Combox_Element key. */
        key: string;

        /** Message_Custom_Combox_Element desc. */
        desc: string;

        /** Message_Custom_Combox_Element arrayAttr. */
        arrayAttr: MODEL_ABI.Message_ArrayAttr.$Properties[];

        /** Message_Custom_Combox_Element comboxAttr. */
        comboxAttr: MODEL_ABI.Message_ComboAttr.$Properties[];

        /**
         * Creates a new Message_Custom_Combox_Element instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Custom_Combox_Element instance
         */
        static create(properties: MODEL_ABI.Message_Custom_Combox_Element.$Shape): MODEL_ABI.Message_Custom_Combox_Element & MODEL_ABI.Message_Custom_Combox_Element.$Shape;
        static create(properties?: MODEL_ABI.Message_Custom_Combox_Element.$Properties): MODEL_ABI.Message_Custom_Combox_Element;

        /**
         * Encodes the specified Message_Custom_Combox_Element message. Does not implicitly {@link MODEL_ABI.Message_Custom_Combox_Element.verify|verify} messages.
         * @param message Message_Custom_Combox_Element message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Message_Custom_Combox_Element.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Custom_Combox_Element message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Custom_Combox_Element.verify|verify} messages.
         * @param message Message_Custom_Combox_Element message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Message_Custom_Combox_Element.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Custom_Combox_Element message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Custom_Combox_Element & MODEL_ABI.Message_Custom_Combox_Element.$Shape} Message_Custom_Combox_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Message_Custom_Combox_Element & MODEL_ABI.Message_Custom_Combox_Element.$Shape;

        /**
         * Decodes a Message_Custom_Combox_Element message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Custom_Combox_Element & MODEL_ABI.Message_Custom_Combox_Element.$Shape} Message_Custom_Combox_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Message_Custom_Combox_Element & MODEL_ABI.Message_Custom_Combox_Element.$Shape;

        /**
         * Verifies a Message_Custom_Combox_Element message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Custom_Combox_Element message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Custom_Combox_Element
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Message_Custom_Combox_Element;

        /**
         * Creates a plain object from a Message_Custom_Combox_Element message. Also converts values to other types if specified.
         * @param message Message_Custom_Combox_Element
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Message_Custom_Combox_Element, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Custom_Combox_Element to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Custom_Combox_Element
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Custom_Combox_Element {

        /** Properties of a Message_Custom_Combox_Element. */
        interface $Properties {

            /** Message_Custom_Combox_Element key */
            key?: (string|null);

            /** Message_Custom_Combox_Element desc */
            desc?: (string|null);

            /** Message_Custom_Combox_Element arrayAttr */
            arrayAttr?: (MODEL_ABI.Message_ArrayAttr.$Properties[]|null);

            /** Message_Custom_Combox_Element comboxAttr */
            comboxAttr?: (MODEL_ABI.Message_ComboAttr.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Custom_Combox_Element. */
        type $Shape = MODEL_ABI.Message_Custom_Combox_Element.$Properties;
    }

    /**
     * Properties of a Message_Custom_ComboAttr.
     * @deprecated Use MODEL_ABI.Message_Custom_ComboAttr.$Properties instead.
     */
    interface IMessage_Custom_ComboAttr extends MODEL_ABI.Message_Custom_ComboAttr.$Properties {
    }

    /** Represents a Message_Custom_ComboAttr. */
    class Message_Custom_ComboAttr {

        /**
         * Constructs a new Message_Custom_ComboAttr.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Message_Custom_ComboAttr.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Custom_ComboAttr element. */
        element: MODEL_ABI.Message_Custom_Combox_Element.$Properties[];

        /** Message_Custom_ComboAttr defaultSelect. */
        defaultSelect: string;

        /**
         * Creates a new Message_Custom_ComboAttr instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Custom_ComboAttr instance
         */
        static create(properties: MODEL_ABI.Message_Custom_ComboAttr.$Shape): MODEL_ABI.Message_Custom_ComboAttr & MODEL_ABI.Message_Custom_ComboAttr.$Shape;
        static create(properties?: MODEL_ABI.Message_Custom_ComboAttr.$Properties): MODEL_ABI.Message_Custom_ComboAttr;

        /**
         * Encodes the specified Message_Custom_ComboAttr message. Does not implicitly {@link MODEL_ABI.Message_Custom_ComboAttr.verify|verify} messages.
         * @param message Message_Custom_ComboAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Message_Custom_ComboAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Custom_ComboAttr message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Custom_ComboAttr.verify|verify} messages.
         * @param message Message_Custom_ComboAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Message_Custom_ComboAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Custom_ComboAttr message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Custom_ComboAttr & MODEL_ABI.Message_Custom_ComboAttr.$Shape} Message_Custom_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Message_Custom_ComboAttr & MODEL_ABI.Message_Custom_ComboAttr.$Shape;

        /**
         * Decodes a Message_Custom_ComboAttr message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Custom_ComboAttr & MODEL_ABI.Message_Custom_ComboAttr.$Shape} Message_Custom_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Message_Custom_ComboAttr & MODEL_ABI.Message_Custom_ComboAttr.$Shape;

        /**
         * Verifies a Message_Custom_ComboAttr message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Custom_ComboAttr message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Custom_ComboAttr
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Message_Custom_ComboAttr;

        /**
         * Creates a plain object from a Message_Custom_ComboAttr message. Also converts values to other types if specified.
         * @param message Message_Custom_ComboAttr
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Message_Custom_ComboAttr, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Custom_ComboAttr to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Custom_ComboAttr
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Custom_ComboAttr {

        /** Properties of a Message_Custom_ComboAttr. */
        interface $Properties {

            /** Message_Custom_ComboAttr element */
            element?: (MODEL_ABI.Message_Custom_Combox_Element.$Properties[]|null);

            /** Message_Custom_ComboAttr defaultSelect */
            defaultSelect?: (string|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Custom_ComboAttr. */
        type $Shape = MODEL_ABI.Message_Custom_ComboAttr.$Properties;
    }

    /**
     * Properties of a Message_Normal_Combox_Element.
     * @deprecated Use MODEL_ABI.Message_Normal_Combox_Element.$Properties instead.
     */
    interface IMessage_Normal_Combox_Element extends MODEL_ABI.Message_Normal_Combox_Element.$Properties {
    }

    /** Represents a Message_Normal_Combox_Element. */
    class Message_Normal_Combox_Element {

        /**
         * Constructs a new Message_Normal_Combox_Element.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Message_Normal_Combox_Element.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Normal_Combox_Element sourcePath. */
        sourcePath: string;

        /**
         * Creates a new Message_Normal_Combox_Element instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Normal_Combox_Element instance
         */
        static create(properties: MODEL_ABI.Message_Normal_Combox_Element.$Shape): MODEL_ABI.Message_Normal_Combox_Element & MODEL_ABI.Message_Normal_Combox_Element.$Shape;
        static create(properties?: MODEL_ABI.Message_Normal_Combox_Element.$Properties): MODEL_ABI.Message_Normal_Combox_Element;

        /**
         * Encodes the specified Message_Normal_Combox_Element message. Does not implicitly {@link MODEL_ABI.Message_Normal_Combox_Element.verify|verify} messages.
         * @param message Message_Normal_Combox_Element message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Message_Normal_Combox_Element.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Normal_Combox_Element message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Normal_Combox_Element.verify|verify} messages.
         * @param message Message_Normal_Combox_Element message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Message_Normal_Combox_Element.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Normal_Combox_Element message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Normal_Combox_Element & MODEL_ABI.Message_Normal_Combox_Element.$Shape} Message_Normal_Combox_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Message_Normal_Combox_Element & MODEL_ABI.Message_Normal_Combox_Element.$Shape;

        /**
         * Decodes a Message_Normal_Combox_Element message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Normal_Combox_Element & MODEL_ABI.Message_Normal_Combox_Element.$Shape} Message_Normal_Combox_Element
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Message_Normal_Combox_Element & MODEL_ABI.Message_Normal_Combox_Element.$Shape;

        /**
         * Verifies a Message_Normal_Combox_Element message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Normal_Combox_Element message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Normal_Combox_Element
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Message_Normal_Combox_Element;

        /**
         * Creates a plain object from a Message_Normal_Combox_Element message. Also converts values to other types if specified.
         * @param message Message_Normal_Combox_Element
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Message_Normal_Combox_Element, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Normal_Combox_Element to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Normal_Combox_Element
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Normal_Combox_Element {

        /** Properties of a Message_Normal_Combox_Element. */
        interface $Properties {

            /** Message_Normal_Combox_Element sourcePath */
            sourcePath?: (string|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Normal_Combox_Element. */
        type $Shape = MODEL_ABI.Message_Normal_Combox_Element.$Properties;
    }

    /**
     * Properties of a Message_Normal_ComboAttr.
     * @deprecated Use MODEL_ABI.Message_Normal_ComboAttr.$Properties instead.
     */
    interface IMessage_Normal_ComboAttr extends MODEL_ABI.Message_Normal_ComboAttr.$Properties {
    }

    /** Represents a Message_Normal_ComboAttr. */
    class Message_Normal_ComboAttr {

        /**
         * Constructs a new Message_Normal_ComboAttr.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Message_Normal_ComboAttr.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Normal_ComboAttr element. */
        element: MODEL_ABI.Message_Normal_Combox_Element.$Properties[];

        /**
         * Creates a new Message_Normal_ComboAttr instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Normal_ComboAttr instance
         */
        static create(properties: MODEL_ABI.Message_Normal_ComboAttr.$Shape): MODEL_ABI.Message_Normal_ComboAttr & MODEL_ABI.Message_Normal_ComboAttr.$Shape;
        static create(properties?: MODEL_ABI.Message_Normal_ComboAttr.$Properties): MODEL_ABI.Message_Normal_ComboAttr;

        /**
         * Encodes the specified Message_Normal_ComboAttr message. Does not implicitly {@link MODEL_ABI.Message_Normal_ComboAttr.verify|verify} messages.
         * @param message Message_Normal_ComboAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Message_Normal_ComboAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Normal_ComboAttr message, length delimited. Does not implicitly {@link MODEL_ABI.Message_Normal_ComboAttr.verify|verify} messages.
         * @param message Message_Normal_ComboAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Message_Normal_ComboAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Normal_ComboAttr message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_Normal_ComboAttr & MODEL_ABI.Message_Normal_ComboAttr.$Shape} Message_Normal_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Message_Normal_ComboAttr & MODEL_ABI.Message_Normal_ComboAttr.$Shape;

        /**
         * Decodes a Message_Normal_ComboAttr message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_Normal_ComboAttr & MODEL_ABI.Message_Normal_ComboAttr.$Shape} Message_Normal_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Message_Normal_ComboAttr & MODEL_ABI.Message_Normal_ComboAttr.$Shape;

        /**
         * Verifies a Message_Normal_ComboAttr message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Normal_ComboAttr message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Normal_ComboAttr
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Message_Normal_ComboAttr;

        /**
         * Creates a plain object from a Message_Normal_ComboAttr message. Also converts values to other types if specified.
         * @param message Message_Normal_ComboAttr
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Message_Normal_ComboAttr, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Normal_ComboAttr to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Normal_ComboAttr
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Normal_ComboAttr {

        /** Properties of a Message_Normal_ComboAttr. */
        interface $Properties {

            /** Message_Normal_ComboAttr element */
            element?: (MODEL_ABI.Message_Normal_Combox_Element.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Normal_ComboAttr. */
        type $Shape = MODEL_ABI.Message_Normal_ComboAttr.$Properties;
    }

    /**
     * Properties of a Message_ComboAttr.
     * @deprecated Use MODEL_ABI.Message_ComboAttr.$Properties instead.
     */
    interface IMessage_ComboAttr extends MODEL_ABI.Message_ComboAttr.$Properties {
    }

    /** Represents a Message_ComboAttr. */
    class Message_ComboAttr {

        /**
         * Constructs a new Message_ComboAttr.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Message_ComboAttr.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_ComboAttr key. */
        key: string;

        /** Message_ComboAttr desc. */
        desc: string;

        /** Message_ComboAttr tips. */
        tips: string;

        /** Message_ComboAttr comboxSource. */
        comboxSource: MODEL_ABI.COMBOX_SOURCE_TYPE;

        /** Message_ComboAttr customCombox. */
        customCombox?: (MODEL_ABI.Message_Custom_ComboAttr.$Properties|null);

        /** Message_ComboAttr normalCombox. */
        normalCombox?: (MODEL_ABI.Message_Normal_ComboAttr.$Properties|null);

        /**
         * Creates a new Message_ComboAttr instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_ComboAttr instance
         */
        static create(properties: MODEL_ABI.Message_ComboAttr.$Shape): MODEL_ABI.Message_ComboAttr & MODEL_ABI.Message_ComboAttr.$Shape;
        static create(properties?: MODEL_ABI.Message_ComboAttr.$Properties): MODEL_ABI.Message_ComboAttr;

        /**
         * Encodes the specified Message_ComboAttr message. Does not implicitly {@link MODEL_ABI.Message_ComboAttr.verify|verify} messages.
         * @param message Message_ComboAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Message_ComboAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_ComboAttr message, length delimited. Does not implicitly {@link MODEL_ABI.Message_ComboAttr.verify|verify} messages.
         * @param message Message_ComboAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Message_ComboAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_ComboAttr message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_ComboAttr & MODEL_ABI.Message_ComboAttr.$Shape} Message_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Message_ComboAttr & MODEL_ABI.Message_ComboAttr.$Shape;

        /**
         * Decodes a Message_ComboAttr message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_ComboAttr & MODEL_ABI.Message_ComboAttr.$Shape} Message_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Message_ComboAttr & MODEL_ABI.Message_ComboAttr.$Shape;

        /**
         * Verifies a Message_ComboAttr message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_ComboAttr message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_ComboAttr
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Message_ComboAttr;

        /**
         * Creates a plain object from a Message_ComboAttr message. Also converts values to other types if specified.
         * @param message Message_ComboAttr
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Message_ComboAttr, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_ComboAttr to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_ComboAttr
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_ComboAttr {

        /** Properties of a Message_ComboAttr. */
        interface $Properties {

            /** Message_ComboAttr key */
            key?: (string|null);

            /** Message_ComboAttr desc */
            desc?: (string|null);

            /** Message_ComboAttr tips */
            tips?: (string|null);

            /** Message_ComboAttr comboxSource */
            comboxSource?: (MODEL_ABI.COMBOX_SOURCE_TYPE|null);

            /** Message_ComboAttr customCombox */
            customCombox?: (MODEL_ABI.Message_Custom_ComboAttr.$Properties|null);

            /** Message_ComboAttr normalCombox */
            normalCombox?: (MODEL_ABI.Message_Normal_ComboAttr.$Properties|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_ComboAttr. */
        type $Shape = MODEL_ABI.Message_ComboAttr.$Properties;
    }

    /**
     * Properties of a Message_ArrayAttr.
     * @deprecated Use MODEL_ABI.Message_ArrayAttr.$Properties instead.
     */
    interface IMessage_ArrayAttr extends MODEL_ABI.Message_ArrayAttr.$Properties {
    }

    /** Represents a Message_ArrayAttr. */
    class Message_ArrayAttr {

        /**
         * Constructs a new Message_ArrayAttr.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Message_ArrayAttr.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_ArrayAttr groupKey. */
        groupKey: string;

        /** Message_ArrayAttr groupName. */
        groupName: string;

        /** Message_ArrayAttr option. */
        option: MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION;

        /** Message_ArrayAttr attrParams. */
        attrParams: MODEL_ABI.Message_Attribute.$Properties[];

        /**
         * Creates a new Message_ArrayAttr instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_ArrayAttr instance
         */
        static create(properties: MODEL_ABI.Message_ArrayAttr.$Shape): MODEL_ABI.Message_ArrayAttr & MODEL_ABI.Message_ArrayAttr.$Shape;
        static create(properties?: MODEL_ABI.Message_ArrayAttr.$Properties): MODEL_ABI.Message_ArrayAttr;

        /**
         * Encodes the specified Message_ArrayAttr message. Does not implicitly {@link MODEL_ABI.Message_ArrayAttr.verify|verify} messages.
         * @param message Message_ArrayAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Message_ArrayAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_ArrayAttr message, length delimited. Does not implicitly {@link MODEL_ABI.Message_ArrayAttr.verify|verify} messages.
         * @param message Message_ArrayAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Message_ArrayAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_ArrayAttr message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_ArrayAttr & MODEL_ABI.Message_ArrayAttr.$Shape} Message_ArrayAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Message_ArrayAttr & MODEL_ABI.Message_ArrayAttr.$Shape;

        /**
         * Decodes a Message_ArrayAttr message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_ArrayAttr & MODEL_ABI.Message_ArrayAttr.$Shape} Message_ArrayAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Message_ArrayAttr & MODEL_ABI.Message_ArrayAttr.$Shape;

        /**
         * Verifies a Message_ArrayAttr message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_ArrayAttr message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_ArrayAttr
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Message_ArrayAttr;

        /**
         * Creates a plain object from a Message_ArrayAttr message. Also converts values to other types if specified.
         * @param message Message_ArrayAttr
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Message_ArrayAttr, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_ArrayAttr to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_ArrayAttr
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_ArrayAttr {

        /** Properties of a Message_ArrayAttr. */
        interface $Properties {

            /** Message_ArrayAttr groupKey */
            groupKey?: (string|null);

            /** Message_ArrayAttr groupName */
            groupName?: (string|null);

            /** Message_ArrayAttr option */
            option?: (MODEL_ABI.MESSAGE_ATTRIBUTE_OPTION|null);

            /** Message_ArrayAttr attrParams */
            attrParams?: (MODEL_ABI.Message_Attribute.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_ArrayAttr. */
        type $Shape = MODEL_ABI.Message_ArrayAttr.$Properties;
    }

    /**
     * Properties of a Message_CommonAttr.
     * @deprecated Use MODEL_ABI.Message_CommonAttr.$Properties instead.
     */
    interface IMessage_CommonAttr extends MODEL_ABI.Message_CommonAttr.$Properties {
    }

    /** Represents a Message_CommonAttr. */
    class Message_CommonAttr {

        /**
         * Constructs a new Message_CommonAttr.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Message_CommonAttr.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_CommonAttr key. */
        key: string;

        /** Message_CommonAttr type. */
        type: MODEL_ABI.COMMON_ATTR_TYPE;

        /** Message_CommonAttr comboxParam. */
        comboxParam?: (MODEL_ABI.Message_ComboAttr.$Properties|null);

        /** Message_CommonAttr arrayParam. */
        arrayParam?: (MODEL_ABI.Message_ArrayAttr.$Properties|null);

        /** Message_CommonAttr cloneEnable. */
        cloneEnable: boolean;

        /**
         * Creates a new Message_CommonAttr instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_CommonAttr instance
         */
        static create(properties: MODEL_ABI.Message_CommonAttr.$Shape): MODEL_ABI.Message_CommonAttr & MODEL_ABI.Message_CommonAttr.$Shape;
        static create(properties?: MODEL_ABI.Message_CommonAttr.$Properties): MODEL_ABI.Message_CommonAttr;

        /**
         * Encodes the specified Message_CommonAttr message. Does not implicitly {@link MODEL_ABI.Message_CommonAttr.verify|verify} messages.
         * @param message Message_CommonAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Message_CommonAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_CommonAttr message, length delimited. Does not implicitly {@link MODEL_ABI.Message_CommonAttr.verify|verify} messages.
         * @param message Message_CommonAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Message_CommonAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_CommonAttr message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Message_CommonAttr & MODEL_ABI.Message_CommonAttr.$Shape} Message_CommonAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Message_CommonAttr & MODEL_ABI.Message_CommonAttr.$Shape;

        /**
         * Decodes a Message_CommonAttr message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Message_CommonAttr & MODEL_ABI.Message_CommonAttr.$Shape} Message_CommonAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Message_CommonAttr & MODEL_ABI.Message_CommonAttr.$Shape;

        /**
         * Verifies a Message_CommonAttr message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_CommonAttr message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_CommonAttr
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Message_CommonAttr;

        /**
         * Creates a plain object from a Message_CommonAttr message. Also converts values to other types if specified.
         * @param message Message_CommonAttr
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Message_CommonAttr, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_CommonAttr to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_CommonAttr
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_CommonAttr {

        /** Properties of a Message_CommonAttr. */
        interface $Properties {

            /** Message_CommonAttr key */
            key?: (string|null);

            /** Message_CommonAttr type */
            type?: (MODEL_ABI.COMMON_ATTR_TYPE|null);

            /** Message_CommonAttr comboxParam */
            comboxParam?: (MODEL_ABI.Message_ComboAttr.$Properties|null);

            /** Message_CommonAttr arrayParam */
            arrayParam?: (MODEL_ABI.Message_ArrayAttr.$Properties|null);

            /** Message_CommonAttr cloneEnable */
            cloneEnable?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_CommonAttr. */
        type $Shape = MODEL_ABI.Message_CommonAttr.$Properties;
    }

    /**
     * Properties of a Child_Function_Ability.
     * @deprecated Use MODEL_ABI.Child_Function_Ability.$Properties instead.
     */
    interface IChild_Function_Ability extends MODEL_ABI.Child_Function_Ability.$Properties {
    }

    /** Represents a Child_Function_Ability. */
    class Child_Function_Ability {

        /**
         * Constructs a new Child_Function_Ability.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Child_Function_Ability.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Child_Function_Ability type. */
        type: string;

        /** Child_Function_Ability desc. */
        desc: string;

        /** Child_Function_Ability tips. */
        tips: string;

        /** Child_Function_Ability key. */
        key: string;

        /** Child_Function_Ability attr. */
        attr: MODEL_ABI.Message_CommonAttr.$Properties[];

        /** Child_Function_Ability cloneEnable. */
        cloneEnable: boolean;

        /**
         * Creates a new Child_Function_Ability instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Child_Function_Ability instance
         */
        static create(properties: MODEL_ABI.Child_Function_Ability.$Shape): MODEL_ABI.Child_Function_Ability & MODEL_ABI.Child_Function_Ability.$Shape;
        static create(properties?: MODEL_ABI.Child_Function_Ability.$Properties): MODEL_ABI.Child_Function_Ability;

        /**
         * Encodes the specified Child_Function_Ability message. Does not implicitly {@link MODEL_ABI.Child_Function_Ability.verify|verify} messages.
         * @param message Child_Function_Ability message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Child_Function_Ability.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Child_Function_Ability message, length delimited. Does not implicitly {@link MODEL_ABI.Child_Function_Ability.verify|verify} messages.
         * @param message Child_Function_Ability message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Child_Function_Ability.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Child_Function_Ability message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Child_Function_Ability & MODEL_ABI.Child_Function_Ability.$Shape} Child_Function_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Child_Function_Ability & MODEL_ABI.Child_Function_Ability.$Shape;

        /**
         * Decodes a Child_Function_Ability message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Child_Function_Ability & MODEL_ABI.Child_Function_Ability.$Shape} Child_Function_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Child_Function_Ability & MODEL_ABI.Child_Function_Ability.$Shape;

        /**
         * Verifies a Child_Function_Ability message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Child_Function_Ability message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Child_Function_Ability
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Child_Function_Ability;

        /**
         * Creates a plain object from a Child_Function_Ability message. Also converts values to other types if specified.
         * @param message Child_Function_Ability
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Child_Function_Ability, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Child_Function_Ability to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Child_Function_Ability
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Child_Function_Ability {

        /** Properties of a Child_Function_Ability. */
        interface $Properties {

            /** Child_Function_Ability type */
            type?: (string|null);

            /** Child_Function_Ability desc */
            desc?: (string|null);

            /** Child_Function_Ability tips */
            tips?: (string|null);

            /** Child_Function_Ability key */
            key?: (string|null);

            /** Child_Function_Ability attr */
            attr?: (MODEL_ABI.Message_CommonAttr.$Properties[]|null);

            /** Child_Function_Ability cloneEnable */
            cloneEnable?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Child_Function_Ability. */
        type $Shape = MODEL_ABI.Child_Function_Ability.$Properties;
    }

    /**
     * Properties of a Function_Ability.
     * @deprecated Use MODEL_ABI.Function_Ability.$Properties instead.
     */
    interface IFunction_Ability extends MODEL_ABI.Function_Ability.$Properties {
    }

    /** Represents a Function_Ability. */
    class Function_Ability {

        /**
         * Constructs a new Function_Ability.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Function_Ability.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Function_Ability type. */
        type: string;

        /** Function_Ability desc. */
        desc: string;

        /** Function_Ability tips. */
        tips: string;

        /** Function_Ability childFunction. */
        childFunction: MODEL_ABI.Child_Function_Ability.$Properties[];

        /**
         * Creates a new Function_Ability instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Function_Ability instance
         */
        static create(properties: MODEL_ABI.Function_Ability.$Shape): MODEL_ABI.Function_Ability & MODEL_ABI.Function_Ability.$Shape;
        static create(properties?: MODEL_ABI.Function_Ability.$Properties): MODEL_ABI.Function_Ability;

        /**
         * Encodes the specified Function_Ability message. Does not implicitly {@link MODEL_ABI.Function_Ability.verify|verify} messages.
         * @param message Function_Ability message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Function_Ability.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Function_Ability message, length delimited. Does not implicitly {@link MODEL_ABI.Function_Ability.verify|verify} messages.
         * @param message Function_Ability message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Function_Ability.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Function_Ability message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Function_Ability & MODEL_ABI.Function_Ability.$Shape} Function_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Function_Ability & MODEL_ABI.Function_Ability.$Shape;

        /**
         * Decodes a Function_Ability message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Function_Ability & MODEL_ABI.Function_Ability.$Shape} Function_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Function_Ability & MODEL_ABI.Function_Ability.$Shape;

        /**
         * Verifies a Function_Ability message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Function_Ability message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Function_Ability
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Function_Ability;

        /**
         * Creates a plain object from a Function_Ability message. Also converts values to other types if specified.
         * @param message Function_Ability
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Function_Ability, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Function_Ability to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Function_Ability
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Function_Ability {

        /** Properties of a Function_Ability. */
        interface $Properties {

            /** Function_Ability type */
            type?: (string|null);

            /** Function_Ability desc */
            desc?: (string|null);

            /** Function_Ability tips */
            tips?: (string|null);

            /** Function_Ability childFunction */
            childFunction?: (MODEL_ABI.Child_Function_Ability.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Function_Ability. */
        type $Shape = MODEL_ABI.Function_Ability.$Properties;
    }

    /**
     * Properties of a Component_Ability.
     * @deprecated Use MODEL_ABI.Component_Ability.$Properties instead.
     */
    interface IComponent_Ability extends MODEL_ABI.Component_Ability.$Properties {
    }

    /** Represents a Component_Ability. */
    class Component_Ability {

        /**
         * Constructs a new Component_Ability.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Component_Ability.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Component_Ability type. */
        type: string;

        /** Component_Ability entity. */
        entity: string[];

        /**
         * Creates a new Component_Ability instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Component_Ability instance
         */
        static create(properties: MODEL_ABI.Component_Ability.$Shape): MODEL_ABI.Component_Ability & MODEL_ABI.Component_Ability.$Shape;
        static create(properties?: MODEL_ABI.Component_Ability.$Properties): MODEL_ABI.Component_Ability;

        /**
         * Encodes the specified Component_Ability message. Does not implicitly {@link MODEL_ABI.Component_Ability.verify|verify} messages.
         * @param message Component_Ability message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Component_Ability.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Component_Ability message, length delimited. Does not implicitly {@link MODEL_ABI.Component_Ability.verify|verify} messages.
         * @param message Component_Ability message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Component_Ability.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Component_Ability message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Component_Ability & MODEL_ABI.Component_Ability.$Shape} Component_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Component_Ability & MODEL_ABI.Component_Ability.$Shape;

        /**
         * Decodes a Component_Ability message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Component_Ability & MODEL_ABI.Component_Ability.$Shape} Component_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Component_Ability & MODEL_ABI.Component_Ability.$Shape;

        /**
         * Verifies a Component_Ability message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Component_Ability message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Component_Ability
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Component_Ability;

        /**
         * Creates a plain object from a Component_Ability message. Also converts values to other types if specified.
         * @param message Component_Ability
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Component_Ability, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Component_Ability to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Component_Ability
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Component_Ability {

        /** Properties of a Component_Ability. */
        interface $Properties {

            /** Component_Ability type */
            type?: (string|null);

            /** Component_Ability entity */
            entity?: (string[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Component_Ability. */
        type $Shape = MODEL_ABI.Component_Ability.$Properties;
    }

    /**
     * Properties of a Controller_Ability.
     * @deprecated Use MODEL_ABI.Controller_Ability.$Properties instead.
     */
    interface IController_Ability extends MODEL_ABI.Controller_Ability.$Properties {
    }

    /** Represents a Controller_Ability. */
    class Controller_Ability {

        /**
         * Constructs a new Controller_Ability.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_ABI.Controller_Ability.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Controller_Ability version. */
        version: string;

        /** Controller_Ability componentAbility. */
        componentAbility: MODEL_ABI.Component_Ability.$Properties[];

        /** Controller_Ability functionAbility. */
        functionAbility: MODEL_ABI.Function_Ability.$Properties[];

        /**
         * Creates a new Controller_Ability instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Controller_Ability instance
         */
        static create(properties: MODEL_ABI.Controller_Ability.$Shape): MODEL_ABI.Controller_Ability & MODEL_ABI.Controller_Ability.$Shape;
        static create(properties?: MODEL_ABI.Controller_Ability.$Properties): MODEL_ABI.Controller_Ability;

        /**
         * Encodes the specified Controller_Ability message. Does not implicitly {@link MODEL_ABI.Controller_Ability.verify|verify} messages.
         * @param message Controller_Ability message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_ABI.Controller_Ability.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Controller_Ability message, length delimited. Does not implicitly {@link MODEL_ABI.Controller_Ability.verify|verify} messages.
         * @param message Controller_Ability message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_ABI.Controller_Ability.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Controller_Ability message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_ABI.Controller_Ability & MODEL_ABI.Controller_Ability.$Shape} Controller_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_ABI.Controller_Ability & MODEL_ABI.Controller_Ability.$Shape;

        /**
         * Decodes a Controller_Ability message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_ABI.Controller_Ability & MODEL_ABI.Controller_Ability.$Shape} Controller_Ability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_ABI.Controller_Ability & MODEL_ABI.Controller_Ability.$Shape;

        /**
         * Verifies a Controller_Ability message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Controller_Ability message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Controller_Ability
         */
        static fromObject(object: { [k: string]: any }): MODEL_ABI.Controller_Ability;

        /**
         * Creates a plain object from a Controller_Ability message. Also converts values to other types if specified.
         * @param message Controller_Ability
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_ABI.Controller_Ability, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Controller_Ability to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Controller_Ability
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Controller_Ability {

        /** Properties of a Controller_Ability. */
        interface $Properties {

            /** Controller_Ability version */
            version?: (string|null);

            /** Controller_Ability componentAbility */
            componentAbility?: (MODEL_ABI.Component_Ability.$Properties[]|null);

            /** Controller_Ability functionAbility */
            functionAbility?: (MODEL_ABI.Function_Ability.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Controller_Ability. */
        type $Shape = MODEL_ABI.Controller_Ability.$Properties;
    }
}

/** Namespace MODEL_DES. */
export namespace MODEL_DES {

    /** MESSAGE_ATTRIBUTE_TYPE enum. */
    enum MESSAGE_ATTRIBUTE_TYPE {

        /** BYTES_E value */
        BYTES_E = 0,

        /** STRING_E value */
        STRING_E = 1,

        /** IP_E value */
        IP_E = 3,

        /** BOOL_E value */
        BOOL_E = 4,

        /** INT32_E value */
        INT32_E = 5,

        /** UINT32_E value */
        UINT32_E = 6,

        /** INT64_E value */
        INT64_E = 7,

        /** UINT64_E value */
        UINT64_E = 8,

        /** FLOAT_E value */
        FLOAT_E = 9,

        /** DOUBLE_E value */
        DOUBLE_E = 10,

        /** FIXED_E value */
        FIXED_E = 11,

        /** DATA_COMBOX_E value */
        DATA_COMBOX_E = 12
    }

    /** MESSAGE_ATTRIBUTE_OPTION enum. */
    enum MESSAGE_ATTRIBUTE_OPTION {

        /** REQUIRED_E value */
        REQUIRED_E = 0,

        /** OPTIONAL_E value */
        OPTIONAL_E = 1
    }

    /** COMMON_ATTR_TYPE enum. */
    enum COMMON_ATTR_TYPE {

        /** COMBOX_E value */
        COMBOX_E = 0,

        /** ARRAY_E value */
        ARRAY_E = 1
    }

    /**
     * Properties of a Message_Combox_Item.
     * @deprecated Use MODEL_DES.Message_Combox_Item.$Properties instead.
     */
    interface IMessage_Combox_Item extends MODEL_DES.Message_Combox_Item.$Properties {
    }

    /** Represents a Message_Combox_Item. */
    class Message_Combox_Item {

        /**
         * Constructs a new Message_Combox_Item.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_DES.Message_Combox_Item.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Combox_Item key. */
        key: string;

        /** Message_Combox_Item desc. */
        desc: string;

        /** Message_Combox_Item arrayCmobEle. */
        arrayCmobEle: MODEL_DES.Message_Attribute.$Properties[];

        /**
         * Creates a new Message_Combox_Item instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Combox_Item instance
         */
        static create(properties: MODEL_DES.Message_Combox_Item.$Shape): MODEL_DES.Message_Combox_Item & MODEL_DES.Message_Combox_Item.$Shape;
        static create(properties?: MODEL_DES.Message_Combox_Item.$Properties): MODEL_DES.Message_Combox_Item;

        /**
         * Encodes the specified Message_Combox_Item message. Does not implicitly {@link MODEL_DES.Message_Combox_Item.verify|verify} messages.
         * @param message Message_Combox_Item message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_DES.Message_Combox_Item.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Combox_Item message, length delimited. Does not implicitly {@link MODEL_DES.Message_Combox_Item.verify|verify} messages.
         * @param message Message_Combox_Item message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_DES.Message_Combox_Item.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Combox_Item message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_DES.Message_Combox_Item & MODEL_DES.Message_Combox_Item.$Shape} Message_Combox_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_DES.Message_Combox_Item & MODEL_DES.Message_Combox_Item.$Shape;

        /**
         * Decodes a Message_Combox_Item message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_DES.Message_Combox_Item & MODEL_DES.Message_Combox_Item.$Shape} Message_Combox_Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_DES.Message_Combox_Item & MODEL_DES.Message_Combox_Item.$Shape;

        /**
         * Verifies a Message_Combox_Item message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Combox_Item message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Combox_Item
         */
        static fromObject(object: { [k: string]: any }): MODEL_DES.Message_Combox_Item;

        /**
         * Creates a plain object from a Message_Combox_Item message. Also converts values to other types if specified.
         * @param message Message_Combox_Item
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_DES.Message_Combox_Item, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Combox_Item to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Combox_Item
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Combox_Item {

        /** Properties of a Message_Combox_Item. */
        interface $Properties {

            /** Message_Combox_Item key */
            key?: (string|null);

            /** Message_Combox_Item desc */
            desc?: (string|null);

            /** Message_Combox_Item arrayCmobEle */
            arrayCmobEle?: (MODEL_DES.Message_Attribute.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Combox_Item. */
        type $Shape = MODEL_DES.Message_Combox_Item.$Properties;
    }

    /**
     * Properties of a Message_Combox_Type.
     * @deprecated Use MODEL_DES.Message_Combox_Type.$Properties instead.
     */
    interface IMessage_Combox_Type extends MODEL_DES.Message_Combox_Type.$Properties {
    }

    /** Represents a Message_Combox_Type. */
    class Message_Combox_Type {

        /**
         * Constructs a new Message_Combox_Type.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_DES.Message_Combox_Type.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Combox_Type typeKey. */
        typeKey: string;

        /** Message_Combox_Type typeDesc. */
        typeDesc: string;

        /** Message_Combox_Type typeGroups. */
        typeGroups: MODEL_DES.Message_Combox_Item.$Properties[];

        /**
         * Creates a new Message_Combox_Type instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Combox_Type instance
         */
        static create(properties: MODEL_DES.Message_Combox_Type.$Shape): MODEL_DES.Message_Combox_Type & MODEL_DES.Message_Combox_Type.$Shape;
        static create(properties?: MODEL_DES.Message_Combox_Type.$Properties): MODEL_DES.Message_Combox_Type;

        /**
         * Encodes the specified Message_Combox_Type message. Does not implicitly {@link MODEL_DES.Message_Combox_Type.verify|verify} messages.
         * @param message Message_Combox_Type message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_DES.Message_Combox_Type.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Combox_Type message, length delimited. Does not implicitly {@link MODEL_DES.Message_Combox_Type.verify|verify} messages.
         * @param message Message_Combox_Type message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_DES.Message_Combox_Type.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Combox_Type message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_DES.Message_Combox_Type & MODEL_DES.Message_Combox_Type.$Shape} Message_Combox_Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_DES.Message_Combox_Type & MODEL_DES.Message_Combox_Type.$Shape;

        /**
         * Decodes a Message_Combox_Type message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_DES.Message_Combox_Type & MODEL_DES.Message_Combox_Type.$Shape} Message_Combox_Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_DES.Message_Combox_Type & MODEL_DES.Message_Combox_Type.$Shape;

        /**
         * Verifies a Message_Combox_Type message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Combox_Type message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Combox_Type
         */
        static fromObject(object: { [k: string]: any }): MODEL_DES.Message_Combox_Type;

        /**
         * Creates a plain object from a Message_Combox_Type message. Also converts values to other types if specified.
         * @param message Message_Combox_Type
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_DES.Message_Combox_Type, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Combox_Type to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Combox_Type
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Combox_Type {

        /** Properties of a Message_Combox_Type. */
        interface $Properties {

            /** Message_Combox_Type typeKey */
            typeKey?: (string|null);

            /** Message_Combox_Type typeDesc */
            typeDesc?: (string|null);

            /** Message_Combox_Type typeGroups */
            typeGroups?: (MODEL_DES.Message_Combox_Item.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Combox_Type. */
        type $Shape = MODEL_DES.Message_Combox_Type.$Properties;
    }

    /**
     * Properties of a Message_Attribute.
     * @deprecated Use MODEL_DES.Message_Attribute.$Properties instead.
     */
    interface IMessage_Attribute extends MODEL_DES.Message_Attribute.$Properties {
    }

    /** Represents a Message_Attribute. */
    class Message_Attribute {

        /**
         * Constructs a new Message_Attribute.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_DES.Message_Attribute.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_Attribute key. */
        key: string;

        /** Message_Attribute type. */
        type: MODEL_DES.MESSAGE_ATTRIBUTE_TYPE;

        /** Message_Attribute stringValue. */
        stringValue: string;

        /** Message_Attribute boolValue. */
        boolValue: boolean;

        /** Message_Attribute int32Value. */
        int32Value: number;

        /** Message_Attribute uint32Value. */
        uint32Value: number;

        /** Message_Attribute int64Value. */
        int64Value: (number|Long);

        /** Message_Attribute uint64Value. */
        uint64Value: (number|Long);

        /** Message_Attribute floatValue. */
        floatValue: number;

        /** Message_Attribute doubleValue. */
        doubleValue: number;

        /** Message_Attribute bytesValue. */
        bytesValue: Uint8Array;

        /** Message_Attribute stringFix. */
        stringFix: string;

        /** Message_Attribute comboType. */
        comboType?: (MODEL_DES.Message_Combox_Type.$Properties|null);

        /** Message_Attribute fixedSource. */
        fixedSource: string[];

        /** Message_Attribute unit. */
        unit: string;

        /**
         * Creates a new Message_Attribute instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_Attribute instance
         */
        static create(properties: MODEL_DES.Message_Attribute.$Shape): MODEL_DES.Message_Attribute & MODEL_DES.Message_Attribute.$Shape;
        static create(properties?: MODEL_DES.Message_Attribute.$Properties): MODEL_DES.Message_Attribute;

        /**
         * Encodes the specified Message_Attribute message. Does not implicitly {@link MODEL_DES.Message_Attribute.verify|verify} messages.
         * @param message Message_Attribute message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_DES.Message_Attribute.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_Attribute message, length delimited. Does not implicitly {@link MODEL_DES.Message_Attribute.verify|verify} messages.
         * @param message Message_Attribute message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_DES.Message_Attribute.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_Attribute message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_DES.Message_Attribute & MODEL_DES.Message_Attribute.$Shape} Message_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_DES.Message_Attribute & MODEL_DES.Message_Attribute.$Shape;

        /**
         * Decodes a Message_Attribute message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_DES.Message_Attribute & MODEL_DES.Message_Attribute.$Shape} Message_Attribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_DES.Message_Attribute & MODEL_DES.Message_Attribute.$Shape;

        /**
         * Verifies a Message_Attribute message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_Attribute message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_Attribute
         */
        static fromObject(object: { [k: string]: any }): MODEL_DES.Message_Attribute;

        /**
         * Creates a plain object from a Message_Attribute message. Also converts values to other types if specified.
         * @param message Message_Attribute
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_DES.Message_Attribute, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_Attribute to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_Attribute
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_Attribute {

        /** Properties of a Message_Attribute. */
        interface $Properties {

            /** Message_Attribute key */
            key?: (string|null);

            /** Message_Attribute type */
            type?: (MODEL_DES.MESSAGE_ATTRIBUTE_TYPE|null);

            /** Message_Attribute stringValue */
            stringValue?: (string|null);

            /** Message_Attribute boolValue */
            boolValue?: (boolean|null);

            /** Message_Attribute int32Value */
            int32Value?: (number|null);

            /** Message_Attribute uint32Value */
            uint32Value?: (number|null);

            /** Message_Attribute int64Value */
            int64Value?: (number|Long|null);

            /** Message_Attribute uint64Value */
            uint64Value?: (number|Long|null);

            /** Message_Attribute floatValue */
            floatValue?: (number|null);

            /** Message_Attribute doubleValue */
            doubleValue?: (number|null);

            /** Message_Attribute bytesValue */
            bytesValue?: (Uint8Array|null);

            /** Message_Attribute stringFix */
            stringFix?: (string|null);

            /** Message_Attribute comboType */
            comboType?: (MODEL_DES.Message_Combox_Type.$Properties|null);

            /** Message_Attribute fixedSource */
            fixedSource?: (string[]|null);

            /** Message_Attribute unit */
            unit?: (string|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_Attribute. */
        type $Shape = MODEL_DES.Message_Attribute.$Properties;
    }

    /**
     * Properties of a Message_ComboAttr.
     * @deprecated Use MODEL_DES.Message_ComboAttr.$Properties instead.
     */
    interface IMessage_ComboAttr extends MODEL_DES.Message_ComboAttr.$Properties {
    }

    /** Represents a Message_ComboAttr. */
    class Message_ComboAttr {

        /**
         * Constructs a new Message_ComboAttr.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_DES.Message_ComboAttr.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_ComboAttr combName. */
        combName: string;

        /** Message_ComboAttr key. */
        key: string;

        /** Message_ComboAttr desc. */
        desc: string;

        /** Message_ComboAttr arrayAttr. */
        arrayAttr: MODEL_DES.Message_ArrayAttr.$Properties[];

        /** Message_ComboAttr comboxAttr. */
        comboxAttr: MODEL_DES.Message_ComboAttr.$Properties[];

        /**
         * Creates a new Message_ComboAttr instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_ComboAttr instance
         */
        static create(properties: MODEL_DES.Message_ComboAttr.$Shape): MODEL_DES.Message_ComboAttr & MODEL_DES.Message_ComboAttr.$Shape;
        static create(properties?: MODEL_DES.Message_ComboAttr.$Properties): MODEL_DES.Message_ComboAttr;

        /**
         * Encodes the specified Message_ComboAttr message. Does not implicitly {@link MODEL_DES.Message_ComboAttr.verify|verify} messages.
         * @param message Message_ComboAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_DES.Message_ComboAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_ComboAttr message, length delimited. Does not implicitly {@link MODEL_DES.Message_ComboAttr.verify|verify} messages.
         * @param message Message_ComboAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_DES.Message_ComboAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_ComboAttr message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_DES.Message_ComboAttr & MODEL_DES.Message_ComboAttr.$Shape} Message_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_DES.Message_ComboAttr & MODEL_DES.Message_ComboAttr.$Shape;

        /**
         * Decodes a Message_ComboAttr message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_DES.Message_ComboAttr & MODEL_DES.Message_ComboAttr.$Shape} Message_ComboAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_DES.Message_ComboAttr & MODEL_DES.Message_ComboAttr.$Shape;

        /**
         * Verifies a Message_ComboAttr message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_ComboAttr message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_ComboAttr
         */
        static fromObject(object: { [k: string]: any }): MODEL_DES.Message_ComboAttr;

        /**
         * Creates a plain object from a Message_ComboAttr message. Also converts values to other types if specified.
         * @param message Message_ComboAttr
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_DES.Message_ComboAttr, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_ComboAttr to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_ComboAttr
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_ComboAttr {

        /** Properties of a Message_ComboAttr. */
        interface $Properties {

            /** Message_ComboAttr combName */
            combName?: (string|null);

            /** Message_ComboAttr key */
            key?: (string|null);

            /** Message_ComboAttr desc */
            desc?: (string|null);

            /** Message_ComboAttr arrayAttr */
            arrayAttr?: (MODEL_DES.Message_ArrayAttr.$Properties[]|null);

            /** Message_ComboAttr comboxAttr */
            comboxAttr?: (MODEL_DES.Message_ComboAttr.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_ComboAttr. */
        type $Shape = MODEL_DES.Message_ComboAttr.$Properties;
    }

    /**
     * Properties of a Message_ArrayAttr.
     * @deprecated Use MODEL_DES.Message_ArrayAttr.$Properties instead.
     */
    interface IMessage_ArrayAttr extends MODEL_DES.Message_ArrayAttr.$Properties {
    }

    /** Represents a Message_ArrayAttr. */
    class Message_ArrayAttr {

        /**
         * Constructs a new Message_ArrayAttr.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_DES.Message_ArrayAttr.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_ArrayAttr groupKey. */
        groupKey: string;

        /** Message_ArrayAttr groupName. */
        groupName: string;

        /** Message_ArrayAttr option. */
        option: MODEL_DES.MESSAGE_ATTRIBUTE_OPTION;

        /** Message_ArrayAttr attrParams. */
        attrParams: MODEL_DES.Message_Attribute.$Properties[];

        /**
         * Creates a new Message_ArrayAttr instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_ArrayAttr instance
         */
        static create(properties: MODEL_DES.Message_ArrayAttr.$Shape): MODEL_DES.Message_ArrayAttr & MODEL_DES.Message_ArrayAttr.$Shape;
        static create(properties?: MODEL_DES.Message_ArrayAttr.$Properties): MODEL_DES.Message_ArrayAttr;

        /**
         * Encodes the specified Message_ArrayAttr message. Does not implicitly {@link MODEL_DES.Message_ArrayAttr.verify|verify} messages.
         * @param message Message_ArrayAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_DES.Message_ArrayAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_ArrayAttr message, length delimited. Does not implicitly {@link MODEL_DES.Message_ArrayAttr.verify|verify} messages.
         * @param message Message_ArrayAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_DES.Message_ArrayAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_ArrayAttr message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_DES.Message_ArrayAttr & MODEL_DES.Message_ArrayAttr.$Shape} Message_ArrayAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_DES.Message_ArrayAttr & MODEL_DES.Message_ArrayAttr.$Shape;

        /**
         * Decodes a Message_ArrayAttr message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_DES.Message_ArrayAttr & MODEL_DES.Message_ArrayAttr.$Shape} Message_ArrayAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_DES.Message_ArrayAttr & MODEL_DES.Message_ArrayAttr.$Shape;

        /**
         * Verifies a Message_ArrayAttr message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_ArrayAttr message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_ArrayAttr
         */
        static fromObject(object: { [k: string]: any }): MODEL_DES.Message_ArrayAttr;

        /**
         * Creates a plain object from a Message_ArrayAttr message. Also converts values to other types if specified.
         * @param message Message_ArrayAttr
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_DES.Message_ArrayAttr, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_ArrayAttr to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_ArrayAttr
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_ArrayAttr {

        /** Properties of a Message_ArrayAttr. */
        interface $Properties {

            /** Message_ArrayAttr groupKey */
            groupKey?: (string|null);

            /** Message_ArrayAttr groupName */
            groupName?: (string|null);

            /** Message_ArrayAttr option */
            option?: (MODEL_DES.MESSAGE_ATTRIBUTE_OPTION|null);

            /** Message_ArrayAttr attrParams */
            attrParams?: (MODEL_DES.Message_Attribute.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_ArrayAttr. */
        type $Shape = MODEL_DES.Message_ArrayAttr.$Properties;
    }

    /**
     * Properties of a Message_CommonAttr.
     * @deprecated Use MODEL_DES.Message_CommonAttr.$Properties instead.
     */
    interface IMessage_CommonAttr extends MODEL_DES.Message_CommonAttr.$Properties {
    }

    /** Represents a Message_CommonAttr. */
    class Message_CommonAttr {

        /**
         * Constructs a new Message_CommonAttr.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_DES.Message_CommonAttr.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Message_CommonAttr key. */
        key: string;

        /** Message_CommonAttr type. */
        type: MODEL_DES.COMMON_ATTR_TYPE;

        /** Message_CommonAttr comboxParam. */
        comboxParam?: (MODEL_DES.Message_ComboAttr.$Properties|null);

        /** Message_CommonAttr arrayParam. */
        arrayParam?: (MODEL_DES.Message_ArrayAttr.$Properties|null);

        /** Message_CommonAttr cloneEnable. */
        cloneEnable: boolean;

        /**
         * Creates a new Message_CommonAttr instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message_CommonAttr instance
         */
        static create(properties: MODEL_DES.Message_CommonAttr.$Shape): MODEL_DES.Message_CommonAttr & MODEL_DES.Message_CommonAttr.$Shape;
        static create(properties?: MODEL_DES.Message_CommonAttr.$Properties): MODEL_DES.Message_CommonAttr;

        /**
         * Encodes the specified Message_CommonAttr message. Does not implicitly {@link MODEL_DES.Message_CommonAttr.verify|verify} messages.
         * @param message Message_CommonAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_DES.Message_CommonAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Message_CommonAttr message, length delimited. Does not implicitly {@link MODEL_DES.Message_CommonAttr.verify|verify} messages.
         * @param message Message_CommonAttr message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_DES.Message_CommonAttr.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Message_CommonAttr message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_DES.Message_CommonAttr & MODEL_DES.Message_CommonAttr.$Shape} Message_CommonAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_DES.Message_CommonAttr & MODEL_DES.Message_CommonAttr.$Shape;

        /**
         * Decodes a Message_CommonAttr message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_DES.Message_CommonAttr & MODEL_DES.Message_CommonAttr.$Shape} Message_CommonAttr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_DES.Message_CommonAttr & MODEL_DES.Message_CommonAttr.$Shape;

        /**
         * Verifies a Message_CommonAttr message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Message_CommonAttr message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message_CommonAttr
         */
        static fromObject(object: { [k: string]: any }): MODEL_DES.Message_CommonAttr;

        /**
         * Creates a plain object from a Message_CommonAttr message. Also converts values to other types if specified.
         * @param message Message_CommonAttr
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_DES.Message_CommonAttr, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Message_CommonAttr to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Message_CommonAttr
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Message_CommonAttr {

        /** Properties of a Message_CommonAttr. */
        interface $Properties {

            /** Message_CommonAttr key */
            key?: (string|null);

            /** Message_CommonAttr type */
            type?: (MODEL_DES.COMMON_ATTR_TYPE|null);

            /** Message_CommonAttr comboxParam */
            comboxParam?: (MODEL_DES.Message_ComboAttr.$Properties|null);

            /** Message_CommonAttr arrayParam */
            arrayParam?: (MODEL_DES.Message_ArrayAttr.$Properties|null);

            /** Message_CommonAttr cloneEnable */
            cloneEnable?: (boolean|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Message_CommonAttr. */
        type $Shape = MODEL_DES.Message_CommonAttr.$Properties;
    }

    /**
     * Properties of a Robot_Child_Function.
     * @deprecated Use MODEL_DES.Robot_Child_Function.$Properties instead.
     */
    interface IRobot_Child_Function extends MODEL_DES.Robot_Child_Function.$Properties {
    }

    /** Represents a Robot_Child_Function. */
    class Robot_Child_Function {

        /**
         * Constructs a new Robot_Child_Function.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_DES.Robot_Child_Function.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Robot_Child_Function type. */
        type: string;

        /** Robot_Child_Function desc. */
        desc: string;

        /** Robot_Child_Function key. */
        key: string;

        /** Robot_Child_Function attr. */
        attr: MODEL_DES.Message_CommonAttr.$Properties[];

        /**
         * Creates a new Robot_Child_Function instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Robot_Child_Function instance
         */
        static create(properties: MODEL_DES.Robot_Child_Function.$Shape): MODEL_DES.Robot_Child_Function & MODEL_DES.Robot_Child_Function.$Shape;
        static create(properties?: MODEL_DES.Robot_Child_Function.$Properties): MODEL_DES.Robot_Child_Function;

        /**
         * Encodes the specified Robot_Child_Function message. Does not implicitly {@link MODEL_DES.Robot_Child_Function.verify|verify} messages.
         * @param message Robot_Child_Function message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_DES.Robot_Child_Function.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Robot_Child_Function message, length delimited. Does not implicitly {@link MODEL_DES.Robot_Child_Function.verify|verify} messages.
         * @param message Robot_Child_Function message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_DES.Robot_Child_Function.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Robot_Child_Function message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_DES.Robot_Child_Function & MODEL_DES.Robot_Child_Function.$Shape} Robot_Child_Function
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_DES.Robot_Child_Function & MODEL_DES.Robot_Child_Function.$Shape;

        /**
         * Decodes a Robot_Child_Function message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_DES.Robot_Child_Function & MODEL_DES.Robot_Child_Function.$Shape} Robot_Child_Function
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_DES.Robot_Child_Function & MODEL_DES.Robot_Child_Function.$Shape;

        /**
         * Verifies a Robot_Child_Function message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Robot_Child_Function message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Robot_Child_Function
         */
        static fromObject(object: { [k: string]: any }): MODEL_DES.Robot_Child_Function;

        /**
         * Creates a plain object from a Robot_Child_Function message. Also converts values to other types if specified.
         * @param message Robot_Child_Function
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_DES.Robot_Child_Function, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Robot_Child_Function to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Robot_Child_Function
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Robot_Child_Function {

        /** Properties of a Robot_Child_Function. */
        interface $Properties {

            /** Robot_Child_Function type */
            type?: (string|null);

            /** Robot_Child_Function desc */
            desc?: (string|null);

            /** Robot_Child_Function key */
            key?: (string|null);

            /** Robot_Child_Function attr */
            attr?: (MODEL_DES.Message_CommonAttr.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Robot_Child_Function. */
        type $Shape = MODEL_DES.Robot_Child_Function.$Properties;
    }

    /**
     * Properties of a Robot_Function.
     * @deprecated Use MODEL_DES.Robot_Function.$Properties instead.
     */
    interface IRobot_Function extends MODEL_DES.Robot_Function.$Properties {
    }

    /** Represents a Robot_Function. */
    class Robot_Function {

        /**
         * Constructs a new Robot_Function.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_DES.Robot_Function.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Robot_Function type. */
        type: string;

        /** Robot_Function desc. */
        desc: string;

        /** Robot_Function childFunction. */
        childFunction: MODEL_DES.Robot_Child_Function.$Properties[];

        /**
         * Creates a new Robot_Function instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Robot_Function instance
         */
        static create(properties: MODEL_DES.Robot_Function.$Shape): MODEL_DES.Robot_Function & MODEL_DES.Robot_Function.$Shape;
        static create(properties?: MODEL_DES.Robot_Function.$Properties): MODEL_DES.Robot_Function;

        /**
         * Encodes the specified Robot_Function message. Does not implicitly {@link MODEL_DES.Robot_Function.verify|verify} messages.
         * @param message Robot_Function message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_DES.Robot_Function.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Robot_Function message, length delimited. Does not implicitly {@link MODEL_DES.Robot_Function.verify|verify} messages.
         * @param message Robot_Function message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_DES.Robot_Function.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Robot_Function message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_DES.Robot_Function & MODEL_DES.Robot_Function.$Shape} Robot_Function
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_DES.Robot_Function & MODEL_DES.Robot_Function.$Shape;

        /**
         * Decodes a Robot_Function message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_DES.Robot_Function & MODEL_DES.Robot_Function.$Shape} Robot_Function
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_DES.Robot_Function & MODEL_DES.Robot_Function.$Shape;

        /**
         * Verifies a Robot_Function message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Robot_Function message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Robot_Function
         */
        static fromObject(object: { [k: string]: any }): MODEL_DES.Robot_Function;

        /**
         * Creates a plain object from a Robot_Function message. Also converts values to other types if specified.
         * @param message Robot_Function
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_DES.Robot_Function, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Robot_Function to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Robot_Function
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Robot_Function {

        /** Properties of a Robot_Function. */
        interface $Properties {

            /** Robot_Function type */
            type?: (string|null);

            /** Robot_Function desc */
            desc?: (string|null);

            /** Robot_Function childFunction */
            childFunction?: (MODEL_DES.Robot_Child_Function.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Robot_Function. */
        type $Shape = MODEL_DES.Robot_Function.$Properties;
    }

    /**
     * Properties of a Robot_Description.
     * @deprecated Use MODEL_DES.Robot_Description.$Properties instead.
     */
    interface IRobot_Description extends MODEL_DES.Robot_Description.$Properties {
    }

    /** Represents a Robot_Description. */
    class Robot_Description {

        /**
         * Constructs a new Robot_Description.
         * @param [properties] Properties to set
         */
        constructor(properties?: MODEL_DES.Robot_Description.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** Robot_Description version. */
        version: string;

        /** Robot_Description function. */
        function: MODEL_DES.Robot_Function.$Properties[];

        /**
         * Creates a new Robot_Description instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Robot_Description instance
         */
        static create(properties: MODEL_DES.Robot_Description.$Shape): MODEL_DES.Robot_Description & MODEL_DES.Robot_Description.$Shape;
        static create(properties?: MODEL_DES.Robot_Description.$Properties): MODEL_DES.Robot_Description;

        /**
         * Encodes the specified Robot_Description message. Does not implicitly {@link MODEL_DES.Robot_Description.verify|verify} messages.
         * @param message Robot_Description message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: MODEL_DES.Robot_Description.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Robot_Description message, length delimited. Does not implicitly {@link MODEL_DES.Robot_Description.verify|verify} messages.
         * @param message Robot_Description message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: MODEL_DES.Robot_Description.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Robot_Description message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {MODEL_DES.Robot_Description & MODEL_DES.Robot_Description.$Shape} Robot_Description
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MODEL_DES.Robot_Description & MODEL_DES.Robot_Description.$Shape;

        /**
         * Decodes a Robot_Description message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {MODEL_DES.Robot_Description & MODEL_DES.Robot_Description.$Shape} Robot_Description
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MODEL_DES.Robot_Description & MODEL_DES.Robot_Description.$Shape;

        /**
         * Verifies a Robot_Description message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Robot_Description message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Robot_Description
         */
        static fromObject(object: { [k: string]: any }): MODEL_DES.Robot_Description;

        /**
         * Creates a plain object from a Robot_Description message. Also converts values to other types if specified.
         * @param message Robot_Description
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: MODEL_DES.Robot_Description, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Robot_Description to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for Robot_Description
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace Robot_Description {

        /** Properties of a Robot_Description. */
        interface $Properties {

            /** Robot_Description version */
            version?: (string|null);

            /** Robot_Description function */
            "function"?: (MODEL_DES.Robot_Function.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a Robot_Description. */
        type $Shape = MODEL_DES.Robot_Description.$Properties;
    }
}
