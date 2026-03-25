import React, { useMemo, useState, useEffect } from 'react';
import { Row, Col, Tag, Button, Space } from 'antd';
import { AuditOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined, SafetyCertificateOutlined, DownloadOutlined, ExportOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import type { RobotConfig, ComponentConfig, ValidationIssue } from '../../store/types';

function runAudit(config: RobotConfig): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const components = config.components;

    if (components.length === 0) {
        issues.push({ severity: 'WARNING', message: '未添加任何组件', nodeId: '' });
    }

    // 1. Component Audits
    for (const comp of components) {
        // A. Attribute Validation (Must-fill & Range)
        const allAttrs = comp.privateAttrs.flatMap(g => g.elements);
        for (const attr of allAttrs) {
            const val = attr.value;
            
            // Must-fill check
            if (attr.boolMustfill && (val === '' || val === null || val === undefined)) {
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
        }

        // B. Interface Connection Check (Communication only)
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

    config.abilities.functionAbility.forEach(func => {
        func.childFunction.forEach(child => {
            child.attr.forEach(common => checkAbilityAttr(common, `${func.desc} > ${child.desc}`));
        });
    });

    return issues;
}

export const AuditStep: React.FC = () => {
    const { config } = useProjectStore();
    const [results, setResults] = useState<ValidationIssue[]>([]); // Changed AuditResult[] to ValidationIssue[] for consistency

    const handleExport = () => {
        const dataStr = JSON.stringify(config, null, 4);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `${config.identity.robotName || 'amr'}_${new Date().toISOString().slice(0, 10)}.cmodel`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const issues = useMemo(() => runAudit(config), [config]);

    // The useEffect block from the instruction was incomplete and seemed to re-calculate issues.
    // Keeping the useMemo for issues as it's more appropriate for derived state.
    // If `results` state is intended to be used, it needs a clear purpose.
    // For now, `issues` from useMemo is used for display.
    useEffect(() => {
        // This block was incomplete in the instruction.
        // If `results` state is meant to store filtered issues, it would be set here.
        // For example: setResults(issues.filter(i => i.severity === 'ERROR' || i.severity === 'WARNING'));
    }, [issues]);


    const errors = issues.filter(i => i.severity === 'ERROR');
    const warnings = issues.filter(i => i.severity === 'WARNING');
    const isClean = errors.length === 0;

    return (
        <>
            <div className="section-header">
                <div className="section-icon"><AuditOutlined /></div>
                <div>
                    <h2 className="section-title">配置审计 & 校验</h2>
                    <div className="section-subtitle">自动验证配置完整性，检查必填项和接口定义</div>
                </div>
            </div>

            {/* Stats Row */}
            <Row gutter={16}>
                <Col span={8}>
                    <div className="glass-card stat-card">
                        <div className={`stat-value ${isClean ? 'success' : 'danger'}`}>
                            {config.components.length}
                        </div>
                        <div className="stat-label">组件总数</div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="glass-card stat-card">
                        <div className={`stat-value ${errors.length === 0 ? 'success' : 'danger'}`}>
                            {errors.length}
                        </div>
                        <div className="stat-label">错误</div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="glass-card stat-card">
                        <div className={`stat-value ${warnings.length === 0 ? 'success' : 'warning'}`}>
                            {warnings.length}
                        </div>
                        <div className="stat-label">警告</div>
                    </div>
                </Col>
            </Row>

            {/* Issues */}
            {issues.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                    <CheckCircleOutlined style={{ fontSize: 48, color: 'var(--green)', marginBottom: 'var(--space-md)' }} />
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>全部检查通过</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 'var(--space-xs)' }}>配置无错误，可以导出</div>
                    <Space style={{ marginTop: 'var(--space-lg)' }}>
                        <Button 
                            icon={<DownloadOutlined />} 
                            onClick={handleExport}
                            style={{ background: 'rgba(88,166,255,0.1)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                        >
                            导出 .cmodel 配置
                        </Button>
                        <Button type="primary">确认并完成配置</Button>
                    </Space>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: 'var(--space-md)' }}>
                    {issues.map((issue, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-md)',
                                padding: 'var(--space-sm) var(--space-md)',
                                borderRadius: 'var(--radius-sm)',
                                marginBottom: 'var(--space-xs)',
                                background: issue.severity === 'ERROR' ? 'var(--red-soft)' : 'var(--orange-soft)',
                            }}
                        >
                            {issue.severity === 'ERROR'
                                ? <CloseCircleOutlined style={{ color: 'var(--red)', fontSize: 14 }} />
                                : <WarningOutlined style={{ color: 'var(--orange)', fontSize: 14 }} />
                            }
                            <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{issue.message}</span>
                            <Tag className={issue.severity === 'ERROR' ? 'tag-red' : 'tag-orange'} style={{ marginLeft: 'auto' }}>
                                {issue.severity}
                            </Tag>
                        </div>
                    ))}
                    <Space style={{ marginTop: 'var(--space-md)', justifyContent: 'flex-end', width: '100%' }}>
                        <Button 
                            icon={<DownloadOutlined />} 
                            onClick={handleExport}
                            style={{ background: 'rgba(88,166,255,0.1)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                        >
                            导出 .cmodel 配置
                        </Button>
                        <Button type="primary">确认并完成配置</Button>
                    </Space>
                </div>
            )}
        </>
    );
};
