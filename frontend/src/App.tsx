import React, { useEffect } from 'react';
import { message, Tooltip } from 'antd';
import {
    RobotOutlined, BuildOutlined, AppstoreOutlined,
    AimOutlined, ApiOutlined, ThunderboltOutlined, AuditOutlined,
    ImportOutlined, ExportOutlined,
    UndoOutlined, RedoOutlined,
} from '@ant-design/icons';

import { useProjectStore, useUndoRedo } from './store/useProjectStore';
import { useUIStore } from './store/useUIStore';
import { ExportService } from './services/ExportService';
import { ImportService } from './store/ImportService';
import axios from 'axios';

import { IdentityStep } from './components/wizard/IdentityStep';
import { ChassisStep } from './components/wizard/ChassisStep';
import { ComponentLibraryStep } from './components/wizard/ComponentLibraryStep';
import { MountingStep } from './components/wizard/MountingStep';
import { WiringStep } from './components/wizard/WiringStep';
import { AbilityStep } from './components/wizard/AbilityStep';
import { AuditStep } from './components/wizard/AuditStep';

const STEPS = [
    { key: 'identity',   label: '身份信息',  icon: <RobotOutlined />,        desc: '机器人元数据' },
    { key: 'chassis',    label: '底盘参数',  icon: <BuildOutlined />,        desc: '物理尺寸' },
    { key: 'components', label: '组件库',    icon: <AppstoreOutlined />,     desc: '添加 & 配置' },
    { key: 'mounting',   label: '安装坐标',  icon: <AimOutlined />,          desc: '6-DOF 位姿' },
    { key: 'wiring',     label: '接口连线',  icon: <ApiOutlined />,          desc: '通信连接' },
    { key: 'abilities',  label: '功能映射',  icon: <ThunderboltOutlined />,  desc: '能力配置' },
    { key: 'audit',      label: '审计导出',  icon: <AuditOutlined />,        desc: '校验 & 导出' },
];

const STEP_COMPONENTS = [
    IdentityStep, ChassisStep, ComponentLibraryStep,
    MountingStep, WiringStep, AbilityStep, AuditStep,
];

export default function App() {
    const { config, isDirty, loadProject } = useProjectStore();
    const { undo, redo, canUndo, canRedo } = useUndoRedo();
    const { currentStep, setStep } = useUIStore();

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const mod = e.metaKey || e.ctrlKey;
            if (mod && e.key === 'z' && !e.shiftKey && canUndo) { e.preventDefault(); undo(); }
            if (mod && e.shiftKey && e.key === 'z' && canRedo) { e.preventDefault(); redo(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [canUndo, canRedo]);

    const handleImport = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.cmodel,.json';
        input.onchange = async (e: any) => {
            try {
                const file = e.target.files[0];
                let parsedConfig: any;

                if (file.name.endsWith('.cmodel')) {
                    const formData = new FormData();
                    formData.append('file', file);
                    // Use the current origin or a configurable base URL
                    const res = await axios.post('http://localhost:8002/api/v1/import/deserialize', formData);
                    parsedConfig = ImportService.parseCompDesc(res.data);
                } else {
                    const text = await file.text();
                    parsedConfig = ImportService.parseCompDesc(JSON.parse(text));
                }

                loadProject(parsedConfig as any);
                message.success(`已导入: ${file.name}`);
            } catch (err) { 
                console.error('Import Error:', err);
                message.error('导入失败，请检查文件格式'); 
            }
        };
        input.click();
    };

    const handleExport = () => {
        try {
            const exported = ExportService.exportToCompDesc(config);
            const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${config.identity.robotName}_v${config.identity.version}.cmodel`;
            a.click();
            URL.revokeObjectURL(url);
            message.success('导出成功');
        } catch { message.error('导出失败'); }
    };

    const StepComponent = STEP_COMPONENTS[currentStep];
    const currentStepInfo = STEPS[currentStep];

    return (
        <div className="app-layout">
            {/* ━━━ Sidebar ━━━ */}
            <aside className="app-sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon">⚡</div>
                    <span className="logo-text">AMR Studio</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">配置向导</div>
                    {STEPS.map((step, i) => (
                        <div
                            key={step.key}
                            className={`nav-item ${i === currentStep ? 'active' : ''}`}
                            onClick={() => setStep(i)}
                        >
                            <span className="nav-icon">{step.icon}</span>
                            <span className="nav-label">{step.label}</span>
                            {i === currentStep && (
                                <span className="nav-badge">{i + 1}/7</span>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <button className="sidebar-action-btn" onClick={handleImport}>
                        <ImportOutlined /> 导入 .cmodel
                    </button>
                    <button className="sidebar-action-btn primary" onClick={handleExport}>
                        <ExportOutlined /> 导出配置
                    </button>
                </div>
            </aside>

            {/* ━━━ Main ━━━ */}
            <main className="app-main">
                {/* Top Bar */}
                <header className="app-topbar">
                    <div className="topbar-breadcrumb">
                        <span className="step-number">Step {currentStep + 1}</span>
                        <span className="step-title">{currentStepInfo.label}</span>
                        <span className="step-desc">— {currentStepInfo.desc}</span>
                    </div>

                    <div className="topbar-actions">
                        <Tooltip title="撤销 ⌘Z">
                            <button className="topbar-btn" disabled={!canUndo} onClick={() => undo()}>
                                <UndoOutlined />
                            </button>
                        </Tooltip>
                        <Tooltip title="重做 ⌘⇧Z">
                            <button className="topbar-btn" disabled={!canRedo} onClick={() => redo()}>
                                <RedoOutlined />
                            </button>
                        </Tooltip>
                        <div className="topbar-divider" />
                        <span style={{
                            color: 'var(--text-muted)', fontSize: 12,
                            fontFamily: 'var(--font-mono)'
                        }}>
                            {config.identity.robotName}
                            {isDirty && <span style={{ color: 'var(--orange)', marginLeft: 6 }}>●</span>}
                        </span>
                    </div>
                </header>

                {/* Content */}
                <div className="content-area grid-bg">
                    <div className="content-grid content-enter" key={currentStep}>
                        <StepComponent />
                    </div>
                </div>
            </main>
        </div>
    );
}
