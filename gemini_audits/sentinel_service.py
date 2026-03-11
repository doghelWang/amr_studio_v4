import time
import os
import json
from datetime import datetime

PROJECT_ROOT = "/Users/wangfeifei/code/amr_studio_v4"
AUDIT_DIR = os.path.join(PROJECT_ROOT, "gemini_audits/sentinel_reports")

def perform_audit():
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    report_name = f"sentinel_audit_{int(time.time())}.md"
    report_path = os.path.join(AUDIT_DIR, report_name)
    
    findings = []
    risks = []
    
    # 1. Check Engine Logic (Regression Detection)
    engine_path = os.path.join(PROJECT_ROOT, "backend/core/protobuf_engine.py")
    if os.path.exists(engine_path):
        with open(engine_path, 'r') as f:
            content = f.read()
            if "new_parts.append(p)" in content and "motionCenterAttr" in content:
                findings.append("⚠️ [发现] 后端引擎仍在使用 '过滤追加' 模式，存在二进制结构重排风险。")
                risks.append("🔴 结构稳定性风险：高")
            else:
                findings.append("✅ [状态] 后端引擎结构处理逻辑正常。")
    
    # 2. Check Schema Alignment (Full Load parameters)
    schema_path = os.path.join(PROJECT_ROOT, "backend/schemas/api.py")
    if os.path.exists(schema_path):
        with open(schema_path, 'r') as f:
            content = f.read()
            if "headOffsetFull" in content:
                findings.append("✅ [状态] 后端数据模型已对齐双状态参数。")
            else:
                findings.append("❌ [异常] 后端模型缺失 Full Load 参数定义。")
                risks.append("🔴 功能完备性风险：高")

    # 3. Project Data Audit
    projects_dir = os.path.join(PROJECT_ROOT, "backend/saved_projects")
    if os.path.exists(projects_dir):
        files = [f for f in os.listdir(projects_dir) if f.endswith('.json')]
        findings.append(f"ℹ️ [数据] 当前保存的项目总数: {len(files)}")
    
    # Generate Report
    report_content = f"""# AMR Studio V4 自动化评审报告 (Sentinel)

**评审时间**: {timestamp}
**审核模式**: 自动化结构审计 (2小时/周期)

## 一、 核心实现审计状态
{chr(10).join(findings)}

## 二、 风险预警
{chr(10).join(risks) if risks else "✅ 当前未检测到核心阻断性风险。"}

## 三、 下一步建议
1. 检查 `protobuf_engine.py` 中的插入算法。
2. 确保所有传感器 6D 位姿参数在成果物中完整映射。
"""
    with open(report_path, "w") as f:
        f.write(report_content)

if __name__ == "__main__":
    while True:
        try:
            perform_audit()
        except Exception as e:
            with open(os.path.join(AUDIT_DIR, "error.log"), "a") as f:
                f.write(f"{datetime.now()}: {str(e)}\n")
        
        time.sleep(7200) # 每 2 小时运行一次
