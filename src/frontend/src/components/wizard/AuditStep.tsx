import React, { useMemo, useState, useEffect } from 'react';
import { Row, Col, Tag, Button, Space, Typography } from 'antd';
import { 
    AuditOutlined, CheckCircleOutlined, WarningOutlined, 
    CloseCircleOutlined, SafetyCertificateOutlined, 
    DownloadOutlined, ExportOutlined 
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import type { RobotConfig, ComponentConfig, ValidationIssue } from '../../store/types';
import { buildElectricalConnections, countInterfaces, summarizeElectricalConnections } from '../../store/domain/electrical';
import { summarizeFunctionProcesses } from '../../store/domain/functions';
import { buildAttributesFromSchema } from '../../store/SchemaEngine';

const { Text } = Typography;

function runAudit(config: RobotConfig): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const components = config.components;
    const connections = buildElectricalConnections(components);
    const connectionSummary = summarizeElectricalConnections(connections);
    const functionSummary = summarizeFunctionProcesses(config.functionProcesses, config.rawFuncDesc);

    if (components.length === 0) {
        issues.push({ severity: 'WARNING', message: '未添加任何组件', nodeId: '' });
    }

    if (connectionSummary.errorCount > 0) {
        issues.push({
            severity: 'ERROR',
            message: `电气连接存在 ${connectionSummary.errorCount} 个错误，请在“接口连线 > 连接清单”中处理。`,
            nodeId: '',
        });
    }

    if (connections.length === 0) {
        issues.push({
            severity: 'WARNING',
            message: '当前没有可审计的电气连接实体；如果模型需要真实接线，请先建立接口连接。',
            nodeId: '',
        });
    }

    // 1. Component Audits
    for (const comp of components) {
        // [REFAC] Recursive Attribute Validation
        const validateAttr = (attr: any) => {
            const val = attr.value;
            const isSystemField = ['softwareSpec', 'chipPlatform', 'offsetAddress'].includes(attr.key);

            // Must-fill check: Skip if hidden OR if it is a system-managed field (ISS-Audit-Final)
            if (!attr.boolHide && !isSystemField && attr.boolMustfill && (val === '' || val === null || val === undefined)) {
                issues.push({
                    severity: 'ERROR',
                    message: `[${comp.alias || comp.name}] 必填属性 "${attr.desc || attr.key}" 未设置`,
                    nodeId: comp.id,
                });
            }

            // Range check
            if (typeof val === 'number') {
                if (attr.minValue !== undefined && val < attr.minValue) {
                    issues.push({
                        severity: 'ERROR',
                        message: `[${comp.alias || comp.name}] 属性 "${attr.desc || attr.key}" 低于最小值 (${attr.minValue})`,
                        nodeId: comp.id,
                    });
                }
                if (attr.maxValue !== undefined && val > attr.maxValue) {
                    issues.push({
                        severity: 'ERROR',
                        message: `[${comp.alias || comp.name}] 属性 "${attr.desc || attr.key}" 高于最大值 (${attr.maxValue})`,
                        nodeId: comp.id,
                    });
                }
            }

            // [NEW] Recursively check nested attributes in ComboBoxes
            const combo = attr.comboType || attr.combo_type;
            if (combo && combo.typeKey) {
                const activeGroup = (combo.typeGroups || []).find((g: any) => g.key === combo.typeKey);
                const subAttrs = activeGroup?.arrayCmobEle || activeGroup?.array_cmob_ele || activeGroup?.arrayAttr || [];
                subAttrs.forEach(validateAttr);
            }
        };

        comp.privateAttrs.forEach(g => {
            const elements = g.elements || (g as any).arrayBaseEle || (g as any).array_base_ele || [];
            elements.forEach(validateAttr);
        });

        // B. Interface Connection Check... (remains same)
        const COMMUNICATION_TYPES = ['CAN', 'ETHERNET', 'RS485', 'RS232', 'LIN', 'NETWORK'];
        for (const iface of comp.interfaces) {
            const isComm = COMMUNICATION_TYPES.includes(iface.type.toUpperCase());
            if (isComm && (!iface.linkedInterfaceUuid || iface.linkedInterfaceUuid.length === 0)) {
                issues.push({
                    severity: 'WARNING',
                    message: `[${comp.alias || comp.name}] 通信接口 "${iface.key}" (${iface.type}) 尚未物理连线`,
                    nodeId: comp.id,
                });
            }
        }
    }

    // 2. Ability Mapping Audits (Recursive check for deep mappings)
    const checkAbilityAttr = (attr: any, path: string) => {
        if (attr.key.startsWith('related') && attr.value) {
            const targetComp = components.find(c => c.id === attr.value);
            if (!targetComp) {
                issues.push({
                    severity: 'ERROR',
                    message: `功能映射 [${path}]：关联的组件已丢失`,
                    nodeId: 'ability_error'
                });
            }
        }
        
        // Recurse into COMBOX/ARRAY
        if (attr.type === 'DATA_COMBOX' || attr.type === 'COMBOX') {
            const combo = attr.comboType || attr.comboxParam;
            const groups = combo?.typeGroups || combo?.options || [];
            const activeGroup = groups.find((g: any) => g.key === attr.value);
            activeGroup?.arrayCmobEle?.forEach((sub: any) => checkAbilityAttr(sub, `${path} > ${activeGroup.desc || activeGroup.key}`));
        }
        
        if (attr.type === 'ARRAY' && attr.arrayParam) {
            attr.arrayParam.attrParams?.forEach((sub: any) => checkAbilityAttr(sub, path));
        }
    };

    if (config.abilities && config.abilities.functionAbility) {
        config.abilities.functionAbility.forEach(func => {
            func.childFunction.forEach(child => {
                child.attr.forEach(common => checkAbilityAttr(common, `${func.desc} > ${child.desc}`));
            });
        });
    }

    if (!config.abilities?.componentAbility?.length) {
        issues.push({
            severity: 'WARNING',
            message: 'componentAbility 为空或未加载；如原始模型包含组件能力，需要确认导入/导出链路是否保留。',
            nodeId: 'ability_warning',
        });
    }

    if (functionSummary.processCount === 0 && functionSummary.rawFunctionCount === 0) {
        issues.push({
            severity: 'WARNING',
            message: 'FuncDesc 功能过程未加载；前端不会自动猜测生成功能过程。',
            nodeId: 'function_warning',
        });
    }

    // 3. Topology Validation Rules (§10, §11)
    const wheels = components.filter(c => c.category === 'DRIVEWHEEL');
    const steerWheels = wheels.filter(w => (w.type || '').toLowerCase().includes('steer'));
    const motors = components.filter(c => c.category === 'MOTOR');

    // Reference diffSteerWheel modules require an external steering encoder.
    // Use the schema fallback for legacy imported components whose groups exist
    // but contain no renderable elements.
    const readWheelAttribute = (wheel: ComponentConfig, key: string): any => {
        const hasElements = wheel.privateAttrs.some(group => group.elements?.length > 0);
        const groups = hasElements ? wheel.privateAttrs : buildAttributesFromSchema(wheel.type || wheel.subModuleTypeKey || '');
        const visit = (elements: any[]): any => {
            for (const element of elements) {
                if (element.key === key) return element;
                for (const group of element.comboType?.typeGroups || []) {
                    const nested = visit(group.arrayCmobEle || []);
                    if (nested) return nested;
                }
            }
            return undefined;
        };
        for (const group of groups) {
            const found = visit(group.elements || []);
            if (found) return found;
        }
        return undefined;
    };

    wheels.filter(w => w.type === 'diffSteerWheel').forEach(wheel => {
        const angleSensor = readWheelAttribute(wheel, 'angleSensorType');
        const angleType = angleSensor?.comboType?.typeKey || angleSensor?.value;
        const activeGroup = (angleSensor?.comboType?.typeGroups || []).find((group: any) => group.key === angleType);
        const relatedEncoder = (activeGroup?.arrayCmobEle || []).find((element: any) => element.key === 'relatedEncode');
        const external = typeof angleType === 'string' && angleType.endsWith('_EXTERNAL');
        if (!external) {
            issues.push({
                severity: 'ERROR',
                message: `[${wheel.alias || wheel.name}] 差速舵轮必须使用外置编码器反馈`,
                nodeId: wheel.id,
            });
        } else if (!relatedEncoder?.value) {
            issues.push({
                severity: 'ERROR',
                message: `[${wheel.alias || wheel.name}] 外置编码器未关联，无法完成差速舵轮转向反馈配置`,
                nodeId: wheel.id,
            });
        }
    });

    // 3a. Drive Type ↔ Wheel Count Consistency
    const driveType = config.identity?.driveType;
    if (driveType === 'DUAL_STEER' && steerWheels.length !== 2) {
        issues.push({
            severity: 'ERROR',
            message: `驱动类型"双舵轮"需要恰好 2 个舵轮组件，当前 ${steerWheels.length} 个`,
            nodeId: '',
        });
    } else if (driveType === 'QUAD_STEER' && steerWheels.length < 4) {
        issues.push({
            severity: 'ERROR',
            message: `驱动类型"四舵轮"需要至少 4 个舵轮组件，当前 ${steerWheels.length} 个`,
            nodeId: '',
        });
    } else if (driveType === 'STANDARD_DIFF' && wheels.length < 2) {
        issues.push({
            severity: 'WARNING',
            message: `驱动类型"差速"通常需要 2 个驱动轮，当前 ${wheels.length} 个`,
            nodeId: '',
        });
    }

    // 3b. Motor must have Driver parent
    motors.forEach(m => {
        const parent = components.find(c => c.id === m.parentNodeUuid);
        if (!parent || parent.category !== 'DRIVER') {
            issues.push({
                severity: 'WARNING',
                message: `[${m.alias || m.name}] 电机未关联至驱动器 (parentNodeUuid 应指向 DRIVER)`,
                nodeId: m.id,
            });
        }
    });

    // 3c. CAN Bus connectivity check
    const canInterfaces = components.flatMap(c => 
        c.interfaces.filter(i => i.type === 'CAN').map(i => ({ comp: c, iface: i }))
    );
    if (canInterfaces.length > 0) {
        const connectedCan = canInterfaces.filter(ci => 
            ci.iface.linkedInterfaceUuid && ci.iface.linkedInterfaceUuid.length > 0
        );
        if (connectedCan.length === 0) {
            issues.push({
                severity: 'WARNING',
                message: '存在 CAN 接口但均未建立连接，总线拓扑不完整',
                nodeId: '',
            });
        }
    }

    // 3d. IO Signal Direction Inversion Check (§11)
    const ioInterfaces = components.flatMap(c => 
        c.interfaces.filter(i => ['DI', 'DO'].includes(i.type)).map(i => ({ comp: c, iface: i }))
    );
    ioInterfaces.forEach(({ comp, iface }) => {
        if (iface.linkedInterfaceUuid && iface.linkedInterfaceUuid.length > 0) {
            for (const linkedUuid of iface.linkedInterfaceUuid) {
                // Find the target interface
                const target = components.flatMap(c => c.interfaces).find(i => i.interfaceUuid === linkedUuid);
                if (target) {
                    // DI must connect to DO, DO must connect to DI
                    if (iface.type === 'DI' && target.type !== 'DO') {
                        issues.push({
                            severity: 'ERROR',
                            message: `[${comp.alias || comp.name}] DI 接口 "${iface.key}" 应连接到 DO 端口，当前连接至 ${target.type}`,
                            nodeId: comp.id,
                        });
                    } else if (iface.type === 'DO' && target.type !== 'DI') {
                        issues.push({
                            severity: 'ERROR',
                            message: `[${comp.alias || comp.name}] DO 接口 "${iface.key}" 应连接到 DI 端口，当前连接至 ${target.type}`,
                            nodeId: comp.id,
                        });
                    }
                }
            }
        }
    });

    return issues;
}

export const AuditStep: React.FC<{ onExport?: () => void }> = ({ onExport }) => {
    const { config } = useProjectStore();
    
    // Derived state via useMemo
    const issues = useMemo(() => runAudit(config), [config]);
    const connections = useMemo(() => buildElectricalConnections(config.components), [config.components]);
    const connectionSummary = useMemo(() => summarizeElectricalConnections(connections), [connections]);
    const functionSummary = useMemo(() => summarizeFunctionProcesses(config.functionProcesses, config.rawFuncDesc), [config.functionProcesses, config.rawFuncDesc]);
    const interfaceCount = useMemo(() => countInterfaces(config.components), [config.components]);

    const handleExport = () => {
        const dataStr = JSON.stringify(config, null, 4);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `${config.identity.robotName || 'amr'}_${new Date().toISOString().slice(0, 10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        linkElement.remove();
    };

    const errors = issues.filter(i => i.severity === 'ERROR');
    const warnings = issues.filter(i => i.severity === 'WARNING');
    const isClean = errors.length === 0;

    return (
        <div style={{ padding: '0 24px' }}>
            <div className="section-header" style={{ marginBottom: 32 }}>
                <div className="section-icon"><AuditOutlined /></div>
                <div>
                    <h2 className="section-title">配置审计 & 校验</h2>
                    <div className="section-subtitle">自动验证配置完整性，检查必填项和接口定义</div>
                </div>
            </div>

            {/* Stats Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                <Col span={6}>
                    <div className="glass-card stat-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-hover)', borderRadius: 12 }}>
                        <div className={`stat-value ${isClean ? 'success' : 'danger'}`} style={{ fontSize: 32, fontWeight: 700, color: isClean ? '#52c41a' : '#ff4d4f' }}>
                            {config.components.length}
                        </div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', marginTop: 8 }}>组件总数</div>
                    </div>
                </Col>
                <Col span={6}>
                    <div className="glass-card stat-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-hover)', borderRadius: 12 }}>
                        <div className="stat-value" style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>
                            {interfaceCount}
                        </div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', marginTop: 8 }}>接口总数</div>
                    </div>
                </Col>
                <Col span={6}>
                    <div className="glass-card stat-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-hover)', borderRadius: 12 }}>
                        <div className={`stat-value ${connectionSummary.errorCount === 0 ? 'success' : 'danger'}`} style={{ fontSize: 32, fontWeight: 700, color: connectionSummary.errorCount === 0 ? '#52c41a' : '#ff4d4f' }}>
                            {connections.length}
                        </div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', marginTop: 8 }}>电气连接</div>
                    </div>
                </Col>
                <Col span={6}>
                    <div className="glass-card stat-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-hover)', borderRadius: 12 }}>
                        <div className={`stat-value ${errors.length === 0 ? 'success' : 'danger'}`} style={{ fontSize: 32, fontWeight: 700, color: errors.length === 0 ? '#52c41a' : '#ff4d4f' }}>
                            {errors.length}
                        </div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', marginTop: 8 }}>错误</div>
                    </div>
                </Col>
                <Col span={6}>
                    <div className="glass-card stat-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-hover)', borderRadius: 12 }}>
                        <div className={`stat-value ${warnings.length === 0 ? 'success' : 'warning'}`} style={{ fontSize: 32, fontWeight: 700, color: warnings.length === 0 ? '#52c41a' : '#faad14' }}>
                            {warnings.length}
                        </div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', marginTop: 8 }}>警告</div>
                    </div>
                </Col>
                <Col span={6}>
                    <div className="glass-card stat-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-hover)', borderRadius: 12 }}>
                        <div className="stat-value" style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>
                            {config.abilities?.componentAbility?.length || 0}
                        </div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', marginTop: 8 }}>组件能力</div>
                    </div>
                </Col>
                <Col span={6}>
                    <div className="glass-card stat-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-hover)', borderRadius: 12 }}>
                        <div className="stat-value" style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>
                            {config.abilities?.functionAbility?.length || 0}
                        </div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', marginTop: 8 }}>功能能力</div>
                    </div>
                </Col>
                <Col span={6}>
                    <div className="glass-card stat-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-hover)', borderRadius: 12 }}>
                        <div className={`stat-value ${functionSummary.processCount ? 'success' : 'warning'}`} style={{ fontSize: 32, fontWeight: 700, color: functionSummary.processCount ? '#52c41a' : '#faad14' }}>
                            {functionSummary.processCount || functionSummary.rawFunctionCount}
                        </div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', marginTop: 8 }}>功能过程</div>
                    </div>
                </Col>
            </Row>

            {/* Issues */}
            {issues.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--bg-hover)', borderRadius: 16, border: '1px solid var(--success)' }}>
                    <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 24 }} />
                    <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>全部检查通过</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 12, marginBottom: 32 }}>本地状态验证闭环，准备好进行二进制构建。</div>
                    <Space size="large">
                        <Button 
                            size="large"
                            icon={<DownloadOutlined />} 
                            onClick={handleExport}
                            style={{ background: 'var(--accent-soft)', color: '#58a6ff', border: '1px solid rgba(88,166,255,0.2)', height: 48, borderRadius: 8 }}
                        >
                            仅导出本地 JSON
                        </Button>
                        <Button 
                            type="primary" 
                            size="large"
                            icon={<ExportOutlined />}
                            onClick={onExport}
                            style={{ height: 48, padding: '0 32px', borderRadius: 8 }}
                        >
                            完成并云端编译
                        </Button>
                    </Space>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: 24, background: 'var(--bg-hover)', borderRadius: 16 }}>
                    <div style={{ maxHeight: 400, overflowY: 'auto', marginBottom: 24 }}>
                        {issues.map((issue, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '12px 16px',
                                    borderRadius: 8,
                                    marginBottom: 8,
                                    background: issue.severity === 'ERROR' ? 'rgba(255,77,79,0.05)' : 'rgba(250,173,20,0.05)',
                                    border: `1px solid ${issue.severity === 'ERROR' ? 'rgba(255,77,79,0.1)' : 'rgba(250,173,20,0.1)'}`
                                }}
                            >
                                {issue.severity === 'ERROR'
                                    ? <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
                                    : <WarningOutlined style={{ color: '#faad14', fontSize: 16 }} />
                                }
                                <span style={{ fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>{issue.message}</span>
                                <Tag color={issue.severity === 'ERROR' ? 'error' : 'warning'}>
                                    {issue.severity}
                                </Tag>
                            </div>
                        ))}
                    </div>
                    <Divider style={{ margin: '24px 0', borderColor: 'var(--border-default)' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                        <Button 
                            icon={<DownloadOutlined />} 
                            onClick={handleExport}
                            style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-accent)', height: 40, borderRadius: 6 }}
                        >
                            仅导出本地 JSON
                        </Button>
                        <Button 
                            type="primary" 
                            icon={<ExportOutlined />}
                            onClick={onExport}
                            style={{ height: 40, padding: '0 24px', borderRadius: 6 }}
                        >
                            完成并云端编译
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Divider = ({ style, borderColor }: any) => (
    <div style={{ ...style, borderBottom: `1px solid ${borderColor || 'var(--border-default)'}` }} />
);
