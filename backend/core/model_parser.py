
import blackboxprotobuf, struct, uuid, datetime
from typing import Optional

def _b(val, default=""):
    if isinstance(val, bytes): return val.decode("utf-8", errors="replace")
    return str(val) if val is not None else default

def _float(val, default=0.0):
    try:
        if isinstance(val, int): return struct.unpack("<d", struct.pack("<Q", val))[0]
        if isinstance(val, float): return val
    except: pass
    return default

def _get_param(part, key_name, default=0.0):
    params = part.get("3", [])
    if isinstance(params, dict): params = [params]
    for p in params:
        if isinstance(p, dict) and _b(p.get("1")) == key_name:
            return _float(p.get("2"), default)
    return default

def _find_part(parts, name):
    if not isinstance(parts, list): return None
    for p in parts:
        if isinstance(p, dict) and _b(p.get("1")) == name: return p
    return None

def _reverse_drive_type(s):
    return {"differential":"DIFFERENTIAL","steerChassis":"SINGLE_STEER","dualSteerChassis":"DUAL_STEER","quadSteerChassis":"QUAD_STEER","mecanumChassis":"MECANUM_4","omniChassis":"OMNI_3"}.get(s, "DIFFERENTIAL")

def _reverse_nav_method(s):
    return {"NAVI_SLAM":"LIDAR_SLAM","NAVI_REFLECTOR":"REFLECTOR","NAVI_NATURAL_CONTOUR":"NATURAL_CONTOUR","NAVI_VISUAL":"VISUAL_SLAM","NAVI_BARCODE":"BARCODE_GRID","NAVI_HYBRID":"HYBRID","NAVI_INERTANCE":"LIDAR_SLAM"}.get(s, "LIDAR_SLAM")

def parse_comp_desc(comp_path):
    with open(comp_path, "rb") as f:
        msg, _ = blackboxprotobuf.decode_message(f.read())
    robot_name = "Factory Default AMR"; version = "1.0"; drive_type = "DIFFERENTIAL"
    wheels = []; wheel_idx = 1; chassis_speed_idle = 1500.0; chassis_speed_full = 1200.0
    modules = msg.get("5", [])
    if isinstance(modules, dict): modules = [modules]
    for entry in modules:
        if not isinstance(entry, dict): continue
        mod_data = entry.get("4", {})
        if not isinstance(mod_data, dict): continue
        meta = mod_data.get("1", {})
        if not isinstance(meta, dict): continue
        attrs = mod_data.get("2", {})
        parts = attrs.get("1", []) if isinstance(attrs, dict) else []
        if isinstance(parts, dict): parts = [parts]
        def _meta_str(key):
            blk = meta.get(key, {})
            return _b(blk.get("10") if isinstance(blk, dict) else None)
        def _meta_enum(key):
            blk = meta.get(key, {})
            return _b(blk.get("21", {}).get("1") if isinstance(blk, dict) else None)
        main_type = _meta_enum("8"); sub_type = _meta_enum("9")
        if main_type == "chassis":
            robot_name = _meta_str("1") or robot_name; version = _meta_str("5") or version
            drive_type = _reverse_drive_type(sub_type)
            cp = _find_part(parts, "chassisAttr")
            if cp: chassis_speed_idle = _get_param(cp, "maxSpeed(Idle)", 1500.0); chassis_speed_full = _get_param(cp, "maxSpeed (Full Load)", 1200.0)
            mp_ = _find_part(parts, "motionCenterAttr")
            if mp_:
                w = {"id":str(uuid.uuid4()),"label":f"Wheel #{wheel_idx}","mountX":_get_param(mp_,"locCoordNX"),"mountY":_get_param(mp_,"locCoordNY"),"mountYaw":0.0,"orientation":"FRONT_LEFT","headOffsetIdle":_get_param(mp_,"headOffset(Idle)"),"tailOffsetIdle":_get_param(mp_,"tailOffset(Idle)"),"leftOffsetIdle":_get_param(mp_,"leftOffset(Idle)"),"rightOffsetIdle":_get_param(mp_,"rightOffset(Idle)"),"headOffsetFull":_get_param(mp_,"headOffset (Full Load)"),"tailOffsetFull":_get_param(mp_,"tailOffset (Full Load)"),"leftOffsetFull":_get_param(mp_,"leftOffset (Full Load)"),"rightOffsetFull":_get_param(mp_,"rightOffset (Full Load)"),"maxVelocityIdle":chassis_speed_idle,"maxAccIdle":500.0,"maxDecIdle":500.0,"maxVelocityFull":chassis_speed_full,"maxAccFull":500.0,"maxDecFull":500.0,"driverModel":"ZAPI","canBus":"CAN0","canNodeId":wheel_idx,"motorPolarity":"FORWARD","zeroPos":0.0,"leftLimit":-90.0,"rightLimit":90.0}
                wheels.append(w); wheel_idx += 1
        elif main_type == "driveWheel":
            driver = "ZAPI"
            aliases = meta.get("20", [])
            if isinstance(aliases, dict): aliases = [aliases]
            for a in aliases:
                if isinstance(a, dict) and _b(a.get("1")) == "module_srcname": driver = _b(a.get("10")); break
            if wheels:
                wa = _find_part(parts, "wheelAttr")
                if wa: wheels[-1]["leftLimit"] = _get_param(wa,"angleLmtNeg",-90.0); wheels[-1]["rightLimit"] = _get_param(wa,"angleLmtPos",90.0)
                wheels[-1]["driverModel"] = driver
    now = datetime.datetime.utcnow().isoformat()+"Z"
    return {"formatVersion":"1.0","meta":{"projectId":str(uuid.uuid4()),"projectName":robot_name,"createdAt":now,"modifiedAt":now,"author":"Factory","templateOrigin":"factory_default","formatVersion":"1.0"},"config":{"identity":{"robotName":robot_name,"version":version,"chassisLength":1200,"chassisWidth":800,"navigationMethod":"LIDAR_SLAM","driveType":drive_type},"mcu":{"model":"RK3588_CTRL_BOARD","canBuses":["CAN0","CAN1","CAN2"],"ethPorts":["ETH0","ETH1"]},"ioBoards":[],"wheels":wheels,"sensors":[],"ioPorts":[]},"snapshots":[]}
