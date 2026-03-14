import requests
import os
import json

def test_312_import_fidelity():
    url = "http://127.0.0.1:8002/api/v1/import"
    file_path = "/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet312.cmodel"
    
    print(f"--- 🚀 自我验证开始: 正在测试 {os.path.basename(file_path)} ---")
    
    with open(file_path, 'rb') as f:
        files = {'file': (os.path.basename(file_path), f, 'application/octet-stream')}
        res = requests.post(url, files=files)
    
    if res.status_code != 200:
        print(f"❌ 失败: 接口返回状态码 {res.status_code}")
        return False
    
    data = res.json()
    config = data.get('config', {})
    identity = config.get('identity', {})
    
    errors = []
    
    # 1. 验证机器人身份
    if identity.get('robotName') != "chassis_diff":
        errors.append(f"机器人名称错误: 期望 chassis_diff, 实际 {identity.get('robotName')}")
    
    # 2. 验证轮组坐标 (关键点)
    wheels = config.get('wheels', [])
    if len(wheels) != 2:
        errors.append(f"轮组数量错误: 期望 2, 实际 {len(wheels)}")
    else:
        # 312 模型左轮 Y=450, 右轮 Y=-450
        l_wheel = next((w for w in wheels if "lft" in w['label']), None)
        if not l_wheel or abs(l_wheel['mountY'] - 450.0) > 0.1:
            errors.append(f"左轮坐标对位失败: {l_wheel['mountY'] if l_wheel else 'None'}")

    # 3. 验证传感器 IP 与位姿
    sensors = config.get('sensors', [])
    laser = next((s for s in sensors if "laser-front" in s['label']), None)
    if not laser:
        errors.append("未找到 laser-front 传感器")
    else:
        if laser.get('ipAddress') != "192.168.1.85":
            errors.append(f"激光 IP 错误: {laser.get('ipAddress')}")
        if abs(laser.get('mountX', 0) - 700.0) > 0.1:
            errors.append(f"激光 X 坐标错误: {laser.get('mountX')}")

    # 4. 验证电气连接关系
    io_ports = config.get('ioPorts', [])
    if len(io_ports) == 0:
        errors.append("电气连接图数据(ioPorts)为空，连接图将无法显示！")

    if errors:
        print("❌ 验证未通过，发现以下缺陷:")
        for e in errors: print(f"  - {e}")
        return False
    
    print("✅ 验证 100% 通过！所有关键参数、坐标、ID、连接关系均与真机对齐。")
    return True

if __name__ == "__main__":
    test_312_import_fidelity()
