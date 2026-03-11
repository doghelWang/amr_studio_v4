import time
import os
from datetime import datetime
import subprocess

PROJECT_ROOT = "/Users/wangfeifei/code/amr_studio_v4"
AUDIT_DIR = os.path.join(PROJECT_ROOT, "gemini_audits/sentinel_v2/reports")
ENGINE_PATH = os.path.join(PROJECT_ROOT, "backend/core/protobuf_engine.py")

def analyze_engine_compliance():
    """Detailed walkthrough of code to find gaps with template specs."""
    issues = []
    with open(ENGINE_PATH, 'r') as f:
        lines = f.readlines()
        content = "".join(lines)
        
        # Gap 1: Structural order
        if "new_parts.append(p)" in content:
            issues.append("🔴 [致命] 结构稳定性: 代码仍在使用 'filter + append' 逻辑，这会改变 Protobuf 原始字段顺序。建议工程师改为 'Anchor-based index replacement'。")
        
        # Gap 2: Sensor injection
        if "payload.sensors" in content and "locCoordNZ" not in content:
            issues.append("🔴 [缺失] 传感器注入: 发现 payload.sensors 处理逻辑不全，缺失 mountZ, Pitch, Roll 等 6D 位姿参数。")
            
        # Gap 3: Hardcoded indices
        if 'msg["5"][0]["4"]["1"]["9"]' in content:
            issues.append("🟡 [风险] 寻址脆性: 发现大量魔数索引（msg[\"5\"]...），建议全面迁移到语义化寻址 (ProtoNavigator)。")

    return issues

def perform_audit():
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    report_name = f"audit_v2_{int(time.time())}.md"
    report_path = os.path.join(AUDIT_DIR, report_name)
    
    compliance_issues = analyze_engine_compliance()
    
    report_content = f"""# AMR Studio V4 首席测试工程师审计报告 (Sentinel V2)

**评审时间**: {timestamp}
**职责角色**: Chief Test Engineer (Gemini CLI)
**授权状态**: 24小时无人值守模式 (ReadOnly Source Control)

## 一、 核心对齐度分析
与 `templates` 目标格式相比，当前后端实现存在的差距：

{chr(10).join(compliance_issues) if compliance_issues else "✅ 未发现明显对齐偏差。"}

## 二、 工程师协作建议 (Refactoring Guidance)
*针对下一班开发工程师的具体优化指令：*

1. **重构插入算法**: 在 `build_comp_desc` 中记录第一个 `motionCenterAttr` 的索引位置，进行原位替换。
2. **补全传感器描述**: 引入对 `locCoordNZ`, `locCoordPitch`, `locCoordRoll` 的注入。
3. **开发逆向解析器**: 建议在 `core/` 下新增 `model_parser.py` 模块，处理 `.model -> JSON` 的逻辑。

---
*本报告由 AI 哨兵自动生成，每 2 小时更新一次。*
"""
    with open(report_path, "w") as f:
        f.write(report_content)

if __name__ == "__main__":
    while True:
        try:
            perform_audit()
        except Exception as e:
            pass
        time.sleep(7200) # 每 2 小时巡检一次
