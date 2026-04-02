import sys
from pathlib import Path

# Add src/backend to path to import schemas
backend_dir = Path(__file__).parent.absolute()
sys.path.append(str(backend_dir))

from skills_v2.schemas_pb.controller_model_comp_desc_pb2 import Message_Module_Info

def safe_print_element(ele):
    """Helper to print Message_Base_Element content."""
    val = "None"
    if ele.HasField('string_value'): val = ele.string_value
    elif ele.HasField('int32_value'): val = ele.int32_value
    elif ele.HasField('double_value'): val = ele.double_value
    elif ele.HasField('bool_value'): val = ele.bool_value
    elif ele.HasField('combo_type'): val = f"[Combo: {ele.combo_type.type_key}]"
    
    print(f"    - {ele.key}: {val} ({ele.desc})")

def audit_model(file_path):
    print(f"=== DEEP INTERFACE AUDIT: {file_path} ===")
    
    with open(file_path, 'rb') as f:
        raw = f.read()
    
    msg = Message_Module_Info()
    msg.ParseFromString(raw)
    
    print(f"Model Version: {msg.model_version}")
    
    for comp in msg.module_componets:
        ga = comp.general_attr
        m_name = ga.module_name.string_value
        m_type = ga.main_module_type.combo_type.type_key
        
        print(f"\nMODULE: {m_name} (Type: {m_type})")
        
        # Print General Attributes
        print("  [General Attributes]")
        safe_print_element(ga.module_name)
        safe_print_element(ga.sub_sys_type)
        safe_print_element(ga.main_module_type)
        
        # Print Private Attributes
        print("  [Private Attributes]")
        for grp in comp.private_attr.private_attrs:
            print(f"    Group: {grp.key} ({grp.desc})")
            for ele in grp.array_base_ele:
                safe_print_element(ele)
                
        # Print Interfaces
        print("  [Interfaces]")
        for itf_grp in comp.interface_params.interface_Group:
            print(f"    Interface: {itf_grp.key} (Type: {itf_grp.type})")
            for ele in itf_grp.interface_params.interface_params_array:
                safe_print_element(ele)

if __name__ == "__main__":
    # Update this path to a valid .model file if needed
    model_path = backend_dir / 'templates' / 'CompDesc.model'
    if model_path.exists():
        audit_model(model_path)
    else:
        print(f"Template not found at {model_path}")
