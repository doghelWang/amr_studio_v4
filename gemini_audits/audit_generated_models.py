import sys
import os
import json

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from core.model_parser import ModelParser

models = [
    "AMR_Differential.cmodel",
    "AMR_SingleSteer.cmodel",
    "AMR_DualSteer.cmodel",
    "AMR_QuadSteer.cmodel"
]

audit_report = "# AMR Studio Pro V4 — 生成模型全量审计报告\n\n"
audit_report += f"**审计时间**: 2026-03-13\n"
audit_report += f"**审计对象**: V4.9 引擎生成的 4 款高保真模型\n\n---\n\n"

for model_name in models:
    path = os.path.join(os.path.dirname(__file__), model_name)
    if not os.path.exists(path):
        continue
    
    print(f"Auditing {model_name}...")
    res = ModelParser.parse_modelset(path)
    config = res.get('config', {})
    identity = config.get('identity', {})
    
    audit_report += f"## 📦 模型名称: {model_name}\n"
    audit_report += f"*   **机器人标识**: {identity.get('robotName')}\n"
    audit_report += f"*   **底盘类型**: {identity.get('driveType')}\n"
    
    audit_report += f"### 1. 核心组件 (Standard Components)\n"
    audit_report += f"*   **轮组计数**: {len(config.get('wheels', []))} 组\n"
    audit_report += f"*   **传感器**: {len(config.get('sensors', []))} 个\n"
    for s in config.get('sensors', []):
        audit_report += f"    - {s.get('label')} (IP: {s.get('ipAddress', 'N/A')})\n"
    
    audit_report += f"### 2. 厂设/执行机构 (Actuators)\n"
    actuators = config.get('actuators', [])
    audit_report += f"*   **数量**: {len(actuators)} 个\n"
    for a in actuators:
        audit_report += f"    - {a.get('label')}\n"
        
    audit_report += f"### 3. 辅助设备 (Auxiliary)\n"
    aux = config.get('auxiliary', [])
    audit_report += f"*   **数量**: {len(aux)} 个\n"
    for x in aux:
        audit_report += f"    - {x.get('label')}\n"
    
    audit_report += "\n---\n\n"

with open("/Users/wangfeifei/code/amr_studio_v4/docs/GENERATED_MODELS_AUDIT.md", "w", encoding="utf-8") as f:
    f.write(audit_report)

print("Audit report generated: docs/GENERATED_MODELS_AUDIT.md")
