import React, { useEffect, useRef } from 'react';
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

import { 
    apiFetchAbilities, 
    apiUpdateAbilities, 
    apiUpdateComponent,
    apiFetchComponentDetails
} from './services/api_v2';

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

const BACKEND_URL = "http://localhost:8002";

export default function App() {
    const { config, isDirty, loadProject, projectId, setProjectId } = useProjectStore();
    const { undo, redo, canUndo, canRedo } = useUndoRedo();
    const { currentStep, setStep } = useUIStore();
    const [messageApi, contextHolder] = message.useMessage();
    const importRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => importRef.current?.click();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const mod = e.metaKey || e.ctrlKey;
            if (mod && e.key === 'z' && !e.shiftKey && canUndo) { e.preventDefault(); undo(); }
            if (mod && e.shiftKey && e.key === 'z' && canRedo) { e.preventDefault(); redo(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [canUndo, canRedo]);

    const printAudit = (title: string, audit: string[]) => {
        if (!audit) return;
        console.group(`%c 📊 ${title} Audit Log`, 'color: #1890ff; font-weight: bold;');
        audit.forEach(line => console.log(line));
        console.groupEnd();
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            messageApi.loading({ content: `正在解析 ${file.name}...`, key: 'import' });
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(`${BACKEND_URL}/api/v1/models/upload`, formData);
            if (res.data.status === 'success') {
                const pId = res.data.project_id;
                printAudit(`Import [${pId}]`, res.data.audit);
                const abilitiesRaw = await apiFetchAbilities(pId);
                const abilities = ImportService.parseAbilities(abilitiesRaw);
                const parsed = ImportService.parseCompDesc(res.data.full_json);
                const fullConfig: any = { identity: parsed.identity, components: parsed.components, abilities };
                setProjectId(pId);
                loadProject(fullConfig);
                messageApi.success({ content: `成功导入: ${file.name}`, key: 'import' });
            }
        } catch (err) { 
            console.error('Import Error:', err);
            messageApi.error({ content: '导入失败', key: 'import' }); 
        } finally {
            // Reset input so the same file can be imported again
            e.target.value = '';
        }
    };

    const handleExport = async () => {
        if (!projectId) return messageApi.warning("请先导入！");
        try {
            messageApi.loading({ content: '正在执行构建前校验...', key: 'export', duration: 0 });
            
            // ━━━ PRE-EXPORT INTEGRITY AUDIT ━━━
            const motorLeft = config.components.find(c => c.name === 'motor-left' || c.alias.includes('电机'));
            if (motorLeft) {
                const serverData = await apiFetchComponentDetails(projectId, motorLeft.id);
                console.group('%c 🔍 Pre-Export Integrity Audit', 'color: #722ed1; font-weight: bold;');
                const findVal = (nodes: any[], key: string): any => {
                    for (let n of nodes) {
                        if (n.key === key) return n.double_value || n.float_value || n.int32_value || n.bool_value || n.string_value;
                        if (n.combo_type?.type_groups) {
                            for (let g of n.combo_type.type_groups) {
                                const res = findVal(g.array_cmob_ele || [], key);
                                if (res !== undefined) return res;
                            }
                        }
                    }
                };
                const ratio = findVal(serverData.private_attr?.private_attrs?.flatMap((g: any) => g.array_base_ele || []) || [], 'gearRatio') 
                           || findVal(serverData.private_attr?.private_attrs?.flatMap((g: any) => g.array_base_ele || []) || [], 'reductionRatio');
                console.log(`[${motorLeft.name}] gearRatio/reductionRatio on SERVER: %c${ratio}`, 'color: #52c41a; font-weight: bold;');
                console.groupEnd();
            }

            messageApi.loading({ content: '正在同步全局配置与连线...', key: 'export', duration: 0 });
            const mappedAbilities = ExportService.exportAbilities(config.abilities);
            await apiUpdateAbilities(projectId, mappedAbilities);
            
            const chassis = config.components.find(c => c.category === 'CHASSIS');
            if (chassis) {
                await apiUpdateComponent(projectId, chassis.id, {
                    general_attr: { 
                        module_name: { string_value: config.identity.robotName },
                        module_shape: { shape_type: 'ENUM_BOX', box: { size_len: config.identity.chassisLength, size_width: config.identity.chassisWidth, size_height: config.identity.chassisHeight } }
                    }
                });
            }

            await Promise.all(config.components.map(c => apiUpdateComponent(projectId, c.id, {
                struct_param: { extend_params: [
                    { key: 'locCoordX', double_value: c.mountX }, { key: 'locCoordY', double_value: c.mountY }, { key: 'locCoordZ', double_value: c.mountZ },
                    { key: 'locCoordROLL', double_value: c.mountRoll }, { key: 'locCoordPITCH', double_value: c.mountPitch }, { key: 'locCoordYAW', double_value: c.mountYaw }
                ]}
            })));

            messageApi.loading({ content: '云端重组 CModel 中...', key: 'export', duration: 0 });
            const res = await axios.post(`${BACKEND_URL}/api/v1/models/${projectId}/compile`);
            
            if (res.data.status === 'success') {
                printAudit(`Export [${projectId}]`, res.data.audit);
                const link = document.createElement('a');
                link.href = `${BACKEND_URL}${res.data.download_url}`;
                link.setAttribute('download', `${projectId}_packed.cmodel`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                messageApi.success({ content: '模型构建成功并下载！', key: 'export' });
            }
        } catch (err) { 
            console.error('Export Error:', err);
            messageApi.error({ content: '构建失败', key: 'export' }); 
        }
    };

    const StepComponent = STEP_COMPONENTS[currentStep];
    const currentStepInfo = STEPS[currentStep];

    return (
        <div className="app-layout">
            {contextHolder}
            <aside className="app-sidebar">
                <div className="sidebar-logo"><div className="logo-icon">⚡</div><span className="logo-text">AMR Studio</span></div>
                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">配置向导</div>
                    {STEPS.map((step, i) => (
                        <div key={step.key} className={`nav-item ${i === currentStep ? 'active' : ''}`} onClick={() => setStep(i)}>
                            <span className="nav-icon">{step.icon}</span><span className="nav-label">{step.label}</span>
                            {i === currentStep && <span className="nav-badge">{i + 1}/7</span>}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-bottom">
                    <input 
                        id="cmodel-import-input"
                        type="file" 
                        ref={importRef} 
                        style={{ display: 'none' }} 
                        accept=".cmodel,.json"
                        onChange={handleImport}
                    />
                    <button className="sidebar-action-btn" onClick={handleImportClick}><ImportOutlined /> 导入 .cmodel</button>
                    <button className="sidebar-action-btn primary" onClick={handleExport}><ExportOutlined /> 导出配置</button>
                </div>
            </aside>
            <main className="app-main">
                <header className="app-topbar">
                    <div className="topbar-breadcrumb">
                        <span className="step-number">Step {currentStep + 1}</span>
                        <span className="step-title">{currentStepInfo.label}</span>
                        <span className="step-desc">— {currentStepInfo.desc}</span>
                    </div>
                    <div className="topbar-actions">
                        <Tooltip title="撤销 ⌘Z"><button className="topbar-btn" disabled={!canUndo} onClick={() => undo()}><UndoOutlined /></button></Tooltip>
                        <Tooltip title="重做 ⌘⇧Z"><button className="topbar-btn" disabled={!canRedo} onClick={() => redo()}><RedoOutlined /></button></Tooltip>
                        <div className="topbar-divider" />
                        <span style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                            {config.identity.robotName} {isDirty && <span style={{ color: 'var(--orange)', marginLeft: 6 }}>●</span>}
                        </span>
                    </div>
                </header>
                <div className="content-area grid-bg">
                    <div className="content-grid content-enter" key={currentStep}><StepComponent /></div>
                </div>
            </main>
        </div>
    );
}
