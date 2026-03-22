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

import { 
    apiFetchAbilities, 
    apiUpdateAbilities, 
    apiUpdateComponent,
    apiCompileAndDownload 
} from './services/api_v2';

export default function App() {
    const { config, isDirty, loadProject, projectId, setProjectId } = useProjectStore();
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

    // 1. Fetch abilities when project changes
    useEffect(() => {
        if (projectId) {
            apiFetchAbilities(projectId).then(abilitiesRaw => {
                const abilities = ImportService.parseAbilities(abilitiesRaw);
                // Merge with existing config
                loadProject({ ...config, abilities });
            }).catch(err => console.error("Failed to fetch abilities:", err));
        }
    }, [projectId]);

    const handleImport = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.cmodel,.json';
        input.onchange = async (e: any) => {
            try {
                const file = e.target.files[0];
                const formData = new FormData();
                formData.append('file', file);
                const res = await axios.post('http://localhost:8005/api/v1/models/upload', formData);
                if (res.data.status === 'success') {
                    console.log('Upload Success, Project ID:', res.data.project_id);
                    const pId = res.data.project_id;
                    setProjectId(pId);
                    try {
                        const parsedConfig = ImportService.parseCompDesc(res.data.full_json);
                        // Fetch and deeply parse abilities
                        const abilitiesRaw = await apiFetchAbilities(pId);
                        const abilities = ImportService.parseAbilities(abilitiesRaw);
                        loadProject({ ...parsedConfig, abilities } as any);
                        message.success(`已导入并打散模块: ${file.name}`);
                    } catch (err) {
                        console.error('Hydration parsing failed:', err);
                        message.warning('模块打散成功但本地全景树渲染遇到异常，请查阅控制台');
                    }
                }
            } catch (err) { 
                console.error('Import Error:', err);
                message.error('导入失败，请检查服务状态'); 
            }
        };
        input.click();
    };

    const handleExport = async () => {
        if (!projectId) {
            message.warning("无活跃工程，请先导入！");
            return;
        }
        try {
            message.loading({ content: '正在同步修改到云端...', key: 'export', duration: 0 });
            
            // 1. Sync Abilities
            await apiUpdateAbilities(projectId, config.abilities);
            
            // 2. Sync modified components (Simplified: sync all for robustness)
            // In a real app, we would only sync dirty ones.
            const syncTasks = config.components.map(c => {
                const payload = ExportService.exportToCompDesc({ ...config, components: [c] }).more_module_info[0].module_componets[0];
                return apiUpdateComponent(projectId, c.id, payload);
            });
            await Promise.all(syncTasks);

            message.loading({ content: '云端正在拼装重构 CModel...', key: 'export', duration: 0 });
            
            // 3. Compile & Download
            await apiCompileAndDownload(projectId);
            
            message.success({ content: '模型封装并成功下载！', key: 'export' });
        } catch (err) { 
            console.error('Export/Compile Error:', err);
            message.error({ content: '后端同步或编译失败，请检查协议一致性', key: 'export' }); 
        }
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
