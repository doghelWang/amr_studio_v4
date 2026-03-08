import React from 'react';
import { Drawer, List, Tag, Button, Empty } from 'antd';
import {
    CloseCircleFilled, WarningFilled, CheckCircleFilled, ArrowRightOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import { useUIStore } from '../store/useUIStore';
import type { ValidationIssue } from '../store/types';

const SEVERITY_COLORS = { ERROR: '#ff4d4f', WARNING: '#faad14' };
const PANEL_LABELS: Record<string, string> = {
    identity: '基础信息', control: '控制板', drive: '轮组驱动',
    sensor: '传感器', io: 'IO映射', blueprint: '蓝图', wiring: '电气图',
};

const IssueItem: React.FC<{ issue: ValidationIssue; onJump: () => void }> = ({ issue, onJump }) => (
    <List.Item
        actions={[
            issue.panelKey && (
                <Button type="link" size="small" icon={<ArrowRightOutlined />} onClick={onJump}>
                    {PANEL_LABELS[issue.panelKey] ?? issue.panelKey}
                </Button>
            )
        ]}
        style={{ padding: '8px 0' }}
    >
        <List.Item.Meta
            avatar={issue.severity === 'ERROR'
                ? <CloseCircleFilled style={{ color: SEVERITY_COLORS.ERROR, fontSize: 16 }} />
                : <WarningFilled style={{ color: SEVERITY_COLORS.WARNING, fontSize: 16 }} />}
            title={<span style={{ fontSize: 13 }}>{issue.message}</span>}
            description={<code style={{ fontSize: 11, color: '#888' }}>{issue.code}</code>}
        />
    </List.Item>
);

export const HealthDashboard: React.FC = () => {
    const { validation } = useProjectStore();
    const { isHealthDashboardOpen, toggleHealthDashboard, setActivePanel } = useUIStore();

    const { errors, warnings, isCompilable } = validation;

    const jump = (panelKey: string) => {
        setActivePanel(panelKey as any);
        toggleHealthDashboard();
    };

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    配置健康度
                    {isCompilable
                        ? <Tag color="success" icon={<CheckCircleFilled />}>可编译</Tag>
                        : <Tag color="error" icon={<CloseCircleFilled />}>有错误，无法编译</Tag>}
                </div>
            }
            open={isHealthDashboardOpen}
            onClose={toggleHealthDashboard}
            placement="right"
            width={480}
        >
            {errors.length === 0 && warnings.length === 0 && (
                <Empty description="所有检查通过 ✅" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {errors.length > 0 && (
                <>
                    <div style={{ color: SEVERITY_COLORS.ERROR, fontWeight: 600, marginBottom: 8 }}>
                        ⛔ {errors.length} 个错误（需修复后方可编译）
                    </div>
                    <List
                        dataSource={errors}
                        renderItem={item => <IssueItem issue={item} onJump={() => jump(item.panelKey)} />}
                        size="small"
                    />
                </>
            )}
            {warnings.length > 0 && (
                <div style={{ marginTop: errors.length > 0 ? 24 : 0 }}>
                    <div style={{ color: SEVERITY_COLORS.WARNING, fontWeight: 600, marginBottom: 8 }}>
                        ⚠️ {warnings.length} 个警告（不影响编译但需关注）
                    </div>
                    <List
                        dataSource={warnings}
                        renderItem={item => <IssueItem issue={item} onJump={() => jump(item.panelKey)} />}
                        size="small"
                    />
                </div>
            )}
        </Drawer>
    );
};
