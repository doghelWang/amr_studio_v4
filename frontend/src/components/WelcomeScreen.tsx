import React, { useRef } from 'react';
import { Typography, Button, Space, Divider, Tag } from 'antd';
import {
    PlusCircleOutlined, ImportOutlined, RobotOutlined,
    ThunderboltOutlined, RadarChartOutlined, DeploymentUnitOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface Props {
    onCreateNew: () => void;
    onImport: (file: File) => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onCreateNew, onImport }) => {
    const importRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onImport(file);
        e.target.value = '';
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary, #0d1117)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* ── Background glow ── */}
            <div style={{
                position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
                width: 600, height: 600,
                background: 'radial-gradient(circle, rgba(56,139,253,0.07) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* ── Logo ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'linear-gradient(135deg, #1677ff, #0d5fdb)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 24px rgba(22,119,255,0.35)',
                    fontSize: 26,
                }}>⚡</div>
                <Title level={2} style={{ margin: 0, color: '#f0f6fc', fontWeight: 700, letterSpacing: -0.5 }}>
                    AMR Studio
                </Title>
            </div>
            <Text type="secondary" style={{ fontSize: 14, marginBottom: 48, textAlign: 'center' }}>
                工业级移动机器人配置平台 · V4
            </Text>

            {/* ── Two Option Cards ── */}
            <div style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 720 }}>
                {/* Create New */}
                <div
                    onClick={onCreateNew}
                    style={{
                        flex: 1, cursor: 'pointer', padding: 32,
                        background: 'linear-gradient(145deg, rgba(22,119,255,0.12), rgba(22,119,255,0.04))',
                        border: '1.5px solid rgba(22,119,255,0.35)',
                        borderRadius: 16,
                        transition: 'all 0.2s ease',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(22,119,255,0.75)';
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(22,119,255,0.35)';
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    }}
                >
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'rgba(22,119,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <PlusCircleOutlined style={{ fontSize: 30, color: '#4096ff' }} />
                    </div>
                    <Title level={4} style={{ margin: 0, color: '#f0f6fc' }}>从头创建新机型</Title>
                    <Text type="secondary" style={{ textAlign: 'center', fontSize: 13, lineHeight: 1.6 }}>
                        启动 7 步引导向导，从身份信息开始，<br />逐步完成底盘、组件库、接口连线等全部配置。
                    </Text>
                    {/* Feature tags */}
                    <Space wrap size={6} style={{ justifyContent: 'center' }}>
                        <Tag color="blue" icon={<RobotOutlined />} style={{ margin: 0 }}>底盘配置</Tag>
                        <Tag color="cyan" icon={<DeploymentUnitOutlined />} style={{ margin: 0 }}>核心控制板</Tag>
                        <Tag color="green" icon={<ThunderboltOutlined />} style={{ margin: 0 }}>动力系统</Tag>
                        <Tag color="purple" icon={<RadarChartOutlined />} style={{ margin: 0 }}>感知避障</Tag>
                    </Space>
                    <Button
                        type="primary" size="large" icon={<ArrowRightOutlined />}
                        style={{ marginTop: 8, width: '100%' }}
                        onClick={e => { e.stopPropagation(); onCreateNew(); }}
                    >
                        开始创建
                    </Button>
                </div>

                {/* Import Existing */}
                <div
                    onClick={() => importRef.current?.click()}
                    style={{
                        flex: 1, cursor: 'pointer', padding: 32,
                        background: 'linear-gradient(145deg, rgba(82,196,26,0.08), rgba(82,196,26,0.02))',
                        border: '1.5px solid rgba(82,196,26,0.25)',
                        borderRadius: 16,
                        transition: 'all 0.2s ease',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(82,196,26,0.6)';
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(82,196,26,0.25)';
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    }}
                >
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'rgba(82,196,26,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <ImportOutlined style={{ fontSize: 30, color: '#52c41a' }} />
                    </div>
                    <Title level={4} style={{ margin: 0, color: '#f0f6fc' }}>导入已有模型文件</Title>
                    <Text type="secondary" style={{ textAlign: 'center', fontSize: 13, lineHeight: 1.6 }}>
                        导入现有的 <Text code style={{ fontSize: 12 }}>.cmodel</Text> 文件，<br />
                        在已有配置基础上继续修改、审计和导出。
                    </Text>
                    <Space wrap size={6} style={{ justifyContent: 'center' }}>
                        <Tag style={{ margin: 0 }}>差速底盘</Tag>
                        <Tag style={{ margin: 0 }}>单/双舵轮</Tag>
                        <Tag style={{ margin: 0 }}>全向底盘</Tag>
                        <Tag style={{ margin: 0 }}>自定义机型</Tag>
                    </Space>
                    <Button
                        size="large" icon={<ImportOutlined />}
                        style={{ marginTop: 8, width: '100%', borderColor: '#52c41a', color: '#52c41a' }}
                        onClick={e => { e.stopPropagation(); importRef.current?.click(); }}
                    >
                        选择 .cmodel 文件
                    </Button>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={importRef}
                type="file"
                accept=".cmodel,.json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <Divider style={{ maxWidth: 720, borderColor: 'rgba(255,255,255,0.06)', marginTop: 40 }} />
            <Text type="secondary" style={{ fontSize: 11, opacity: 0.4 }}>
                AMR Studio V4 · HIKROBOT · 支持差速 / 舵轮 / 全向底盘机型配置
            </Text>
        </div>
    );
};
