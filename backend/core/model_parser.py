import blackboxprotobuf
import os
import zipfile
import tempfile
import uuid
import struct
from collections import deque
from core.protobuf_navigator import ProtoNavigator

class ModelParser:
    MAX_DEPTH = 15
    MAX_NODES = 5000
    MAX_STR_LEN = 256

    @staticmethod
    def uint64_to_float(val_int: int) -> float:
        try: return struct.unpack('<d', struct.pack('<Q', val_int))[0]
        except: return 0.0

    @classmethod
    def smart_extract(cls, data):
        """
        Hyper-safe BFS extraction that avoids list truncation.
        Limits total nodes instead to safely handle deep/wide industrial configs.
        """
        results = {}
        if not data: return results
        queue = deque([(data, 0)])
        visited = 0
        
        while queue and visited < cls.MAX_NODES:
            curr, depth = queue.popleft()
            visited += 1
            if depth > cls.MAX_DEPTH: continue
            
            if isinstance(curr, list):
                # Process up to 200 items to capture 64-channel IO boards without freezing on point clouds
                for item in curr[:200]:
                    queue.append((item, depth + 1))
            elif isinstance(curr, dict):
                k = curr.get("1") or curr.get(1)
                if isinstance(k, bytes):
                    k_s = k.decode('utf-8', errors='ignore')
                    if "17" in curr: results[k_s] = cls.uint64_to_float(curr["17"])
                    elif "12" in curr: results[k_s] = int(curr["12"])
                    elif "10" in curr:
                        v = curr["10"]
                        if isinstance(v, bytes): results[k_s] = v.decode('utf-8', errors='ignore')[:cls.MAX_STR_LEN]
                
                for k_id, v in curr.items():
                    # Intelligent skipping of massive blob/point-cloud maps 
                    # 16=NavMap, 18=DenseCloud in typical proprietary schemes
                    if str(k_id) in ["16", "18", "19"]: 
                        continue
                    if isinstance(v, (dict, list)):
                        queue.append((v, depth + 1))
        return results

    @classmethod
    def get_raw_tree_safe(cls, data, depth=0):
        """Pruned tree strictly for Frontend UI Raw Rendering."""
        if depth > 3: return "..." 
        
        if isinstance(data, list):
            count = len(data)
            base = [cls.get_raw_tree_safe(i, depth + 1) for i in data[:5]]
            if count > 5: base.append(f"({count - 5} more items...)")
            return base
        elif isinstance(data, dict):
            res = {}
            all_keys = list(data.keys())
            display_keys = [k for k in all_keys if str(k) not in ["16", "18", "19"]][:10]
            for k in display_keys:
                v = data[k]
                if isinstance(v, bytes):
                    try: res[str(k)] = v.decode('utf-8')[:32] + "..." if len(v) > 32 else v.decode('utf-8')
                    except: res[str(k)] = f"HEX:{v.hex()[:10]}..."
                else:
                    res[str(k)] = cls.get_raw_tree_safe(v, depth + 1)
            if len(all_keys) > 10: res["_"] = "..."
            return res
        return data

    @classmethod
    def parse_modelset(cls, zip_path: str, return_raw=False, logger=None) -> dict:
        def log(msg):
            if logger: logger(msg)
            else: print(msg)
            
        log("[Backend 🏭] 收到解析请求，正在解包...")
        with tempfile.TemporaryDirectory() as tmp_dir:
            with zipfile.ZipFile(zip_path, 'r') as zf:
                zf.extractall(tmp_dir)
            
            comp_path = os.path.join(tmp_dir, 'CompDesc.model')
            with open(comp_path, 'rb') as f:
                content = f.read()
                size_mb = len(content) / (1024 * 1024)
                log(f"[Backend 🏭] 核心模块读取成功 (大小: {size_mb:.2f} MB)")
                if size_mb > 50: raise ValueError("File exceeds 50MB limit")
                
                log("[Backend 🏭] ⚠️ 开始执行深度二进制解码 (如果卡死，则说明是 blackboxprotobuf 遇到超大点云陷入死循环)...")
                import time
                st = time.time()
                comp_msg, _ = blackboxprotobuf.decode_message(content)
                log(f"[Backend 🏭] ✅ 二进制解码完成！耗时: {time.time() - st:.2f} 秒")
            
            log("[Backend 🏭] 开始执行工业树提取...")
            
            sensors = []
            io_boards = []
            wheels = []
            others = []
            
            robot_name = "Industrial_AMR"
            try:
                name_bytes = ProtoNavigator.safe_get_path(comp_msg, ["5", "4", "1", "1", "10"])
                if name_bytes: robot_name = name_bytes.decode('utf-8', errors='ignore')
            except: pass

            module_list = comp_msg.get("5", [])
            if isinstance(module_list, dict): module_list = [module_list]

            log(f"[Backend 🏭] 发现总计 {len(module_list)} 个 Tag 5 模块，开始执行边界裁剪提取...")

            for entry in module_list[:200]: # Cap modules to prevent runaway parsing
                m_data = entry.get("4", {})
                m_name = (ProtoNavigator.safe_get_path(entry, ["4", "1", "1", "10"]) or b"").decode('utf-8', errors='ignore')
                m_uuid = (ProtoNavigator.safe_get_path(entry, ["4", "1", "4", "10"]) or b"").decode('utf-8', errors='ignore')
                
                # Prevent Phantom UUIDs that drop off when generated
                if not m_uuid: m_uuid = f"virtual-uuid-{uuid.uuid4().hex[:8]}"

                if not m_name: continue
                
                params = cls.smart_extract(m_data)

                if "chassis" in m_name.lower():
                    robot_name = m_name
                    parts = ProtoNavigator.safe_get_path(m_data, ["2", "1"]) or []
                    if isinstance(parts, dict): parts = [parts]
                    for i, p in enumerate(parts[:200]): # Cap wheel scan
                        if isinstance(p, dict) and p.get("2") == b'\xe8\xbf\x90\xe5\x8a\xa8\xe4\xb8\xad\xe5\xbf\x83\xe5\x8f\x82\xe6\x95\xb0':
                            ext = cls.smart_extract(p)
                            wheels.append({"id": f"wheel_{i+1}", "label": f"Wheel {i+1}", "mountX": ext.get("locCoordNX", 0.0)})
                
                elif "laser" in m_name.lower() or "camera" in m_name.lower() or params.get("locCoordX") is not None:
                    sensors.append({
                        "id": m_uuid, "label": m_name, "model": m_name,
                        "mountX": params.get("locCoordX", 0.0), "mountY": params.get("locCoordY", 0.0),
                        "mountZ": params.get("locCoordZ", 0.0), "yaw": params.get("locCoordYAW", 0.0),
                        "ip": params.get("ipAddress") or params.get("ip"),
                        "port": params.get("port")
                    })
                elif "io" in m_name.lower() or "button" in m_name.lower():
                    io_boards.append({
                        "id": m_uuid, "model": m_name, "canNodeId": params.get("nodeId", 110)
                    })
                else:
                    others.append({"id": m_uuid, "label": m_name, "type": "MODULE"})

            log(f"[Backend 🏭] 🏁 组装完毕: 提取了 {len(wheels)} 轮组, {len(sensors)} 传感器, {len(io_boards)} IO板, {len(others)} 其他组件.")

            result = {
                "config": {
                    "meta": { "projectId": str(uuid.uuid4()), "projectName": robot_name },
                    "identity": { "robotName": robot_name, "driveType": "DIFF", "version": "1.0" },
                    "wheels": wheels, "sensors": sensors, "ioBoards": io_boards, "ioPorts": [], "others": others
                }
            }
            if return_raw:
                result["raw_tree"] = cls.get_raw_tree_safe(comp_msg.get("5", []))
            return result
