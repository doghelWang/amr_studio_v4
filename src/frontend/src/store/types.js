/**
 * Zero-Omission Data Model for AMR Studio V4.
 * Precisely aligned with controller_model_comp_desc.proto
 */
export const DRIVE_TYPE_LABELS = {
    STANDARD_DIFF: '标准差速 Differential',
    SINGLE_STEER: '单舵轮 Single Steer',
    DUAL_STEER: '双舵轮 Dual Steer',
    QUAD_STEER: '四舵轮 Quad Steer',
};
export const NAV_METHOD_LABELS = {
    LASER_SLAM: '激光 SLAM',
    REFLECTOR: '激光反射板',
    QR_CODE: '二维码',
    VISUAL_SLAM: '视觉 SLAM',
    HYBRID: '混合导航',
};
export const getInterfaceKind = (type) => {
    const upper = (type || '').toUpperCase();
    if (['CAN', 'RS485', 'RS232', 'UART', 'ETH', 'ETHERNET', 'NETWORK'].includes(upper)) {
        return 'communication_bus';
    }
    if (['DI', 'DO', 'AI', 'AO'].includes(upper)) {
        return 'io_signal';
    }
    if (['BAT', 'POWER'].includes(upper)) {
        return 'power';
    }
    if (['SPI'].includes(upper)) {
        return 'onboard';
    }
    if (['SPK', 'LVDS', 'SMA'].includes(upper)) {
        return 'audio_video';
    }
    return 'unknown';
};
export const buildConnections = (components) => {
    const connections = [];
    const processed = new Set();
    const ifaceMap = new Map();
    components.forEach(c => {
        (c.interfaces || []).forEach(i => {
            ifaceMap.set(i.interfaceUuid, { comp: c, iface: i });
        });
    });
    components.forEach(c => {
        (c.interfaces || []).forEach(i => {
            (i.linkedInterfaceUuid || []).forEach(targetUuid => {
                const target = ifaceMap.get(targetUuid);
                if (!target) {
                    const connId = `conn_missing_${i.interfaceUuid}_${targetUuid}`;
                    if (!processed.has(connId)) {
                        processed.add(connId);
                        connections.push({
                            id: connId,
                            kind: getInterfaceKind(i.type),
                            interfaceType: i.type,
                            sourceComponentId: c.id,
                            sourceComponentName: c.alias || c.name,
                            sourceInterfaceUuid: i.interfaceUuid,
                            sourceInterfaceKey: i.key,
                            targetComponentId: '',
                            targetComponentName: '未知/已丢失',
                            targetInterfaceUuid: targetUuid,
                            targetInterfaceKey: '未知',
                            direction: 'unknown',
                            diagnostics: [`连接的目标接口已丢失: ${targetUuid}`]
                        });
                    }
                    return;
                }
                const connId = [i.interfaceUuid, targetUuid].sort().join('_');
                if (processed.has(connId))
                    return;
                processed.add(connId);
                let direction = 'bidirectional';
                const typeUpper = i.type.toUpperCase();
                if (typeUpper === 'DO') {
                    direction = 'source_to_target';
                }
                else if (typeUpper === 'DI') {
                    direction = 'target_to_source';
                }
                else if (['BAT', 'POWER'].includes(typeUpper)) {
                    direction = 'source_to_target';
                }
                const diagnostics = [];
                if (i.type.toUpperCase() !== target.iface.type.toUpperCase()) {
                    const isCompatIO = (typeUpper === 'DI' && target.iface.type.toUpperCase() === 'DO') ||
                        (typeUpper === 'DO' && target.iface.type.toUpperCase() === 'DI');
                    if (!isCompatIO) {
                        diagnostics.push(`接口类型不兼容: ${i.type} 和 ${target.iface.type}`);
                    }
                }
                connections.push({
                    id: connId,
                    kind: getInterfaceKind(i.type),
                    interfaceType: i.type,
                    sourceComponentId: c.id,
                    sourceComponentName: c.alias || c.name,
                    sourceInterfaceUuid: i.interfaceUuid,
                    sourceInterfaceKey: i.key,
                    targetComponentId: target.comp.id,
                    targetComponentName: target.comp.alias || target.comp.name,
                    targetInterfaceUuid: target.iface.interfaceUuid,
                    targetInterfaceKey: target.iface.key,
                    direction,
                    diagnostics
                });
            });
        });
    });
    return connections;
};
//# sourceMappingURL=types.js.map