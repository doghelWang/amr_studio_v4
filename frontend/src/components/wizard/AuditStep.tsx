import React, { useMemo, useState, useEffect } from 'react';
import { Row, Col, Tag, Button, Space, Typography } from 'antd';
import { 
    AuditOutlined, CheckCircleOutlined, WarningOutlined, 
    CloseCircleOutlined, SafetyCertificateOutlined, 
    DownloadOutlined, ExportOutlined 
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import type { RobotConfig, ComponentConfig, ValidationIssue } from '../../store/types';

const { Text } = Typography;

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

    if (config.abilities && config.abilities.functionAbility) {
        config.abilities.functionAbility.forEach(func => {
            func.childFunction.forEach(child => {
                child.attr.forEach(common => checkAbilityAttr(common, `${func.desc} > ${child.desc}`));
            });
        });
    }

    return issues;
}

export const AuditStep: React.FC<{ onExport?: () => void }> = ({ onExport }) => {
    const { config } = useProjectStore();
    
    // Derived state via useMemo
    const issues = useMemo(() => runAudit(config), [config]);

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
            <Row gutter={24} style={{ marginBottom: 32 }}>
                <Col span={8}>
                    <div className="glass-card stat-card" style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                        <div className={`stat-value ${isClean ? 'success' : 'danger'}`} style={{ fontSize: 32, fontWeight: 700, color: isClean ? '#52c41a' : '#ff4d4f' }}>
                            {config.components.length}
                        </div>
                        <div className="stat-label" style={{ color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>组件总数</div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="glass-card stat-card" style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                        <div className={`stat-value ${errors.length === 0 ? 'success' : 'danger'}`} style={{ fontSize: 32, fontWeight: 700, color: errors.length === 0 ? '#52c41a' : '#ff4d4f' }}>
                            {errors.length}
                        </div>
                        <div className="stat-label" style={{ color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>错误</div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="glass-card stat-card" style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                        <div className={`stat-value ${warnings.length === 0 ? 'success' : 'warning'}`} style={{ fontSize: 32, fontWeight: 700, color: warnings.length === 0 ? '#52c41a' : '#faad14' }}>
                            {warnings.length}
                        </div>
                        <div className="stat-label" style={{ color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>警告</div>
                    </div>
                </Col>
            </Row>

            {/* Issues */}
            {issues.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '60px 40px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(82,196,26,0.1)' }}>
                    <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 24 }} />
                    <div style={{ fontSize: 20, fontWeight: 600, color: '#f0f6fc' }}>全部检查通过</div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 12, marginBottom: 32 }}>本地状态验证闭环，准备好进行二进制构建。</div>
                    <Space size="large">
                        <Button 
                            size="large"
                            icon={<DownloadOutlined />} 
                            onClick={handleExport}
                            style={{ background: 'rgba(88,166,255,0.1)', color: '#58a6ff', border: '1px solid rgba(88,166,255,0.2)', height: 48, borderRadius: 8 }}
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
                <div className="glass-card" style={{ padding: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 16 }}>
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
                                <span style={{ fontSize: 14, color: '#f0f6fc', flex: 1 }}>{issue.message}</span>
                                <Tag color={issue.severity === 'ERROR' ? 'error' : 'warning'}>
                                    {issue.severity}
                                </Tag>
                            </div>
                        ))}
                    </div>
                    <Divider style={{ margin: '24px 0', borderColor: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                        <Button 
                            icon={<DownloadOutlined />} 
                            onClick={handleExport}
                            style={{ background: 'rgba(88,166,255,0.1)', color: '#58a6ff', border: '1px solid rgba(88,166,255,0.2)', height: 40, borderRadius: 6 }}
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
    <div style={{ ...style, borderBottom: `1px solid ${borderColor || 'rgba(255,255,255,0.1)'}` }} />
);
