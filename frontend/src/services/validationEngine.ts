// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Validation Engine — 14-rule pure function validator
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import type {
    RobotConfig, ValidationIssue, ValidationResult
} from '../store/types';

// ━━━ Helper utilities ━━━

function findDuplicates<T>(arr: T[]): T[] {
    return arr.filter((v, i) => arr.indexOf(v) !== i);
}

function isValidIPv4(ip: string): boolean {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) &&
        ip.split('.').every(n => parseInt(n) <= 255);
}

// ━━━ Rule implementations ━━━

export function runValidation(config: RobotConfig): ValidationResult {
    const issues: ValidationIssue[] = [];

    const { identity, mcu, wheels, sensors, ioBoards } = config;

    // ── Rule 1: Required fields ──────────────────────
    if (!identity.robotName?.trim()) {
        issues.push({ code: 'REQUIRED_FIELD_EMPTY', severity: 'ERROR', message: '机器人名称为必填项', panelKey: 'identity', nodeId: '', fieldPath: 'robotName' });
    }
    if (!identity.version?.trim()) {
        issues.push({ code: 'REQUIRED_FIELD_EMPTY', severity: 'ERROR', message: 'ModelSet 版本号为必填项', panelKey: 'identity', nodeId: '', fieldPath: 'version' });
    }
    if (identity.version && !/^\d+\.\d+$/.test(identity.version)) {
        issues.push({ code: 'VERSION_FORMAT', severity: 'WARNING', message: '建议使用 X.Y 格式版本号', panelKey: 'identity', nodeId: '', fieldPath: 'version' });
    }

    // ── Rule 2: CAN Node ID conflict ─────────────────
    const allCanDevices = [
        ...wheels.map(w => ({ id: w.id, label: w.label, canBus: w.canBus, canNodeId: w.canNodeId, panel: 'drive' as const })),
        ...ioBoards.map(b => ({ id: b.id, label: b.label, canBus: b.canBus, canNodeId: b.canNodeId, panel: 'control' as const }))
    ];

    const busBuckets: Record<string, typeof allCanDevices> = {};
    for (const dev of allCanDevices) {
        if (!busBuckets[dev.canBus]) busBuckets[dev.canBus] = [];
        busBuckets[dev.canBus].push(dev);
    }
    for (const [bus, devs] of Object.entries(busBuckets)) {
        const ids = devs.map(d => d.canNodeId);
        const dups = findDuplicates(ids);
        for (const dupId of [...new Set(dups)]) {
            const conflicted = devs.filter(d => d.canNodeId === dupId);
            conflicted.forEach(d => {
                issues.push({
                    code: 'CAN_ID_CONFLICT', severity: 'ERROR',
                    message: `${bus} 上 ID=${dupId} 冲突: ${conflicted.map(c => c.label).join(' / ')}`,
                    panelKey: d.panel, nodeId: d.id, fieldPath: 'canNodeId'
                });
            });
        }
        // Rule 2b: Node ID range
        for (const dev of devs) {
            if (dev.canNodeId < 1 || dev.canNodeId > 126) {
                issues.push({ code: 'CAN_ID_OUT_OF_RANGE', severity: 'ERROR', message: `Node ID 必须在 1-126 范围内 (当前: ${dev.canNodeId})`, panelKey: dev.panel, nodeId: dev.id, fieldPath: 'canNodeId' });
            }
        }
        // Rule 2c: Bus not declared
        if (bus && !mcu.canBuses.includes(bus)) {
            devs.forEach(d => {
                issues.push({ code: 'CAN_BUS_NOT_DECLARED', severity: 'ERROR', message: `${bus} 未在 MCU 中声明`, panelKey: d.panel, nodeId: d.id, fieldPath: 'canBus' });
            });
        }
        // Rule 2d: Bus overloaded
        if (devs.length > 8) {
            issues.push({ code: 'CAN_BUS_OVERLOADED', severity: 'WARNING', message: `${bus} 上设备数 ${devs.length}/8，建议拆分到其他总线`, panelKey: 'control', nodeId: '', fieldPath: 'canBus' });
        }
    }

    // ── Rule 3: Ethernet sensor validation ───────────
    const ethSensors = sensors.filter(s => s.connType === 'ETHERNET');
    const sensorIPs = ethSensors.map(s => s.ipAddress);
    const dupIPs = findDuplicates(sensorIPs.filter(Boolean));

    for (const s of ethSensors) {
        if (!s.ipAddress?.trim()) {
            issues.push({ code: 'ETH_IP_EMPTY', severity: 'ERROR', message: 'Ethernet 传感器必须填写 IP 地址', panelKey: 'sensor', nodeId: s.id, fieldPath: 'ipAddress' });
        } else if (!isValidIPv4(s.ipAddress)) {
            issues.push({ code: 'ETH_IP_INVALID', severity: 'ERROR', message: `IP 格式无效: ${s.ipAddress}`, panelKey: 'sensor', nodeId: s.id, fieldPath: 'ipAddress' });
        } else if (dupIPs.includes(s.ipAddress)) {
            issues.push({ code: 'ETH_IP_CONFLICT', severity: 'ERROR', message: `IP ${s.ipAddress} 被多个传感器使用`, panelKey: 'sensor', nodeId: s.id, fieldPath: 'ipAddress' });
        }
        if (s.ethPort && !mcu.ethPorts.includes(s.ethPort)) {
            issues.push({ code: 'ETH_PORT_NOT_DECLARED', severity: 'ERROR', message: `${s.ethPort} 未在 MCU 中声明`, panelKey: 'sensor', nodeId: s.id, fieldPath: 'ethPort' });
        }
    }

    // Eth port oversubscribed
    const ethPortBuckets: Record<string, string[]> = {};
    for (const s of ethSensors) {
        if (s.ethPort) {
            if (!ethPortBuckets[s.ethPort]) ethPortBuckets[s.ethPort] = [];
            ethPortBuckets[s.ethPort].push(s.label);
        }
    }
    for (const [port, names] of Object.entries(ethPortBuckets)) {
        if (names.length > 1) {
            issues.push({ code: 'ETH_PORT_OVERSUBSCRIBED', severity: 'ERROR', message: `MCU 网口 ${port} 被 ${names.join(', ')} 占用`, panelKey: 'sensor', nodeId: '', fieldPath: 'ethPort' });
        }
    }

    // ── Rule 4: Sensor usage / steer limits ──────────
    for (const s of sensors) {
        if (!s.usageNavi && !s.usageObs) {
            issues.push({ code: 'SENSOR_NO_USAGE', severity: 'WARNING', message: `传感器 ${s.model} 未声明用途（导航/避障）`, panelKey: 'sensor', nodeId: s.id, fieldPath: 'usageNavi' });
        }
    }

    if (sensors.length > 0 && !sensors.some(s => s.usageNavi)) {
        issues.push({ code: 'NO_SENSOR_FOR_NAV', severity: 'WARNING', message: '未声明任何导航传感器', panelKey: 'sensor', nodeId: '', fieldPath: 'usageNavi' });
    }

    // Steer wheel zero pos check
    const isSteer = ['SINGLE_STEER', 'DUAL_STEER', 'QUAD_STEER'].includes(identity.driveType);
    if (isSteer) {
        for (const w of wheels) {
            if (w.zeroPos === 0) {
                issues.push({ code: 'STEER_ZERO_NOT_SET', severity: 'WARNING', message: `${w.label} 舵轮零位为 0，请确认已调零`, panelKey: 'drive', nodeId: w.id, fieldPath: 'zeroPos' });
            }
        }
    }

    return {
        errors: issues.filter(i => i.severity === 'ERROR'),
        warnings: issues.filter(i => i.severity === 'WARNING'),
        isCompilable: !issues.some(i => i.severity === 'ERROR'),
    };
}
