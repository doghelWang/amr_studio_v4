"""
AMR Studio V4 Model Splitter
该模块负责将庞大的 CompDesc.json (包含全车所有组件) 拆分为一个轻量级的 Blueprint (蓝图) 
以及一系列独立的模块 JSON 文件。这种“分而治之”的设计允许前端按需载入组件配置。
"""

import json
import os
import argparse

def split_comp_desc(json_path, output_dir):
    """
    主切割逻辑：
    - 读取 CompDesc.json。
    - 递归遍历 jsonTree。
    - 提取 moduleComponets 中的组件配置，保存为独立文件。
    - 在原始 JSON 中用 "$ref": "modules/filename" 替换原组件内容。
    - 最终输出轻量级的 blueprint_CompDesc.json。
    """
    print(f"Reading {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    os.makedirs(output_dir, exist_ok=True)
    modules_dir = os.path.join(output_dir, "modules")
    os.makedirs(modules_dir, exist_ok=True)
    
    module_count = 0

    def recurse(node):
        """递归遍历模型树，寻找组件定义节点"""
        nonlocal module_count
        if isinstance(node, dict):
            # ━━━ 关键：适配不同协议版本的 Key 命名 (Camel vs Snake) ━━━
            comp_key = "moduleComponets" if "moduleComponets" in node else "module_componets"
            info_key = "moreModuleInfo" if "moreModuleInfo" in node else "more_module_info"

            # 发现组件节点
            if comp_key in node and isinstance(node[comp_key], list):
                for i, comp in enumerate(node[comp_key]):
                    # 分片文件名只是内部存储标识，不从模型字段推断，也不写回模型语义。
                    filename = f"module_{module_count:06d}.json"
                    filepath = os.path.join(modules_dir, filename)
                    
                    # 写入独立模块文件
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(comp, f, ensure_ascii=False, indent=2)
                    
                    # 在 Blueprint 中保留引用指针，用于前端 Lazy Loading
                    node[comp_key][i] = {"$ref": f"modules/{filename}"}
                    module_count += 1
            
            # 继续递归遍历子节点 (moreModuleInfo)
            if info_key in node and isinstance(node[info_key], list):
                for sub_group in node[info_key]:
                    recurse(sub_group)

    recurse(data)
    
    # 保存精简后的蓝图文件
    blueprint_path = os.path.join(output_dir, "blueprint_CompDesc.json")
    with open(blueprint_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Split complete. Extracted {module_count} modules.")
    print(f"Blueprint saved to: {blueprint_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Split CompDesc.json into blueprint and modules")
    parser.add_argument("json_path", help="Path to CompDesc.json")
    parser.add_argument("output_dir", help="Directory to save blueprint and modules")
    args = parser.parse_args()
    split_comp_desc(args.json_path, args.output_dir)
