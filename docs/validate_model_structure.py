import os
import zipfile

target = "/tmp/QuadModelSet.zip"
ref_func = "/Users/wangfeifei/code/py_embed_ctrl/docs/v4_design/FuncDesc.model"

if not os.path.exists(target):
    print("QuadModelSet.zip not found!")
    exit(1)

with zipfile.ZipFile(target, 'r') as z:
    z.extractall("/tmp/quad_dump")

def count_str_in_file(path, target_bytes):
    with open(path, "rb") as f:
        data = f.read()
    return data.count(target_bytes)

print("--- FuncDesc.model checks ---")
print("NAVI_SLAM in ref:", count_str_in_file(ref_func, b"NAVI_SLAM"))
target_func = "/tmp/quad_dump/FuncDesc.model"
if os.path.exists(target_func):
    print("NAVI_SLAM in target:", count_str_in_file(target_func, b"NAVI_SLAM"))
else:
    print("Target FuncDesc.model not found in zip")

print("\n--- CompDesc.model counts (Quad Steer = 4 wheels) ---")
comp_path = "/tmp/quad_dump/CompDesc.model"
if os.path.exists(comp_path):
    print("Base Chassis (底盘参数):", count_str_in_file(comp_path, b'\xe5\xba\x95\xe7\x9b\x98\xe5\x8f\x82\xe6\x95\xb0'))
    print("Motion Centers (运动中心参数) expected 4:", count_str_in_file(comp_path, b'\xe8\xbf\x90\xe5\x8a\xa8\xe4\xb8\xad\xe5\xbf\x83\xe5\x8f\x82\xe6\x95\xb0'))
    print("Wheel Properties (轮组属性) expected 4:", count_str_in_file(comp_path, b'\xe8\xbd\xae\xe7\xbb\x84\xe5\xb1\x9e\xe6\x80\xa7'))
else:
    print("Target CompDesc.model not found in zip")
