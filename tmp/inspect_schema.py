import sys
import os

# Add schemas_pb to path
sys.path.insert(0, os.path.join(os.getcwd(), "backend", "skills_v2", "schemas_pb"))

try:
    import controller_model_comp_desc_pb2
    import controller_model_abi_set_pb2
    from google.protobuf.json_format import MessageToDict, ParseDict

    def inspect_msg(msg_class, label):
        print(f"\n--- Schema Inspection: {label} ---")
        msg = msg_class()
        # Create a dummy dict with both cases to see what ParseDict accepts
        # This is a trick to see what the library thinks are valid fields
        fields = [f.name for f in msg.DESCRIPTOR.fields]
        print(f"Original Proto Field Names: {fields}")
        
        # Test serialization defaults
        from google.protobuf.json_format import MessageToJson
        json_camel = MessageToJson(msg)
        print(f"Default JSON Mapping (CamelCase?): {list(json.loads(json_camel).keys()) if json_camel != '{}' else 'Empty'}")

    import json
    inspect_msg(controller_model_comp_desc_pb2.Message_Module_Info, "CompDesc Root")
    inspect_msg(controller_model_comp_desc_pb2.Message_Module_Componets, "Component")
    inspect_msg(controller_model_comp_desc_pb2.Message_Combo_Element, "ComboElement")
    inspect_msg(controller_model_abi_set_pb2.Controller_Ability, "AbilitySet Root")

except Exception as e:
    print(f"Error: {e}")
