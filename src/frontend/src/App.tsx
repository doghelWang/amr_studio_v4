/**
 * AMR Studio V4 - 主入口 (Main Application)
 * 该组件是整个配置平台的容器，负责：
 * 1. 协调向导流程 (Wizard Flow) 与步骤渲染。
 * 2. 处理全局异步操作 (导入 .cmodel, 导出配置)。
 * 3. 注册全局快捷键 (撤销/重做)。
 * 4. 控制欢迎页 (Welcome Screen) 与主操作区之间的切换。
 */

import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import {
    RobotOutlined, BuildOutlined, AppstoreOutlined,
    AimOutlined, ApiOutlined, ThunderboltOutlined, AuditOutlined,
} from '@ant-design/icons';

import { useProjectStore, useUndoRedo } from './store/useProjectStore';
import { useUIStore } from './store/useUIStore';
import { ExportService } from './services/ExportService';
import { ImportService } from './store/ImportService';
import { WelcomeScreen } from './components/WelcomeScreen';
import axios from 'axios';

import { 
    apiFetchAbilities, 
    apiUpdateAbilities, 
    apiUpdateComponent,
    apiFetchComponentDetails,
    apiInitSandbox
} from './services/api_v2';

import { IdentityStep } from './components/wizard/IdentityStep';
import { ChassisStep } from './components/wizard/ChassisStep';
import { ComponentLibraryStep } from './components/wizard/ComponentLibraryStep';
import { MountingStep } from './components/wizard/MountingStep';
import { WiringStep } from './components/wizard/WiringStep';
import { AbilityStep } from './components/wizard/AbilityStep';
import { AuditStep } from './components/wizard/AuditStep';

// 导入布局组件
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

/** 配置向导定义：定义每一步的 Key、标签、图标与描述 */
const STEPS = [
    { key: 'identity',   label: '身份信息',  icon: <RobotOutlined />,        desc: '机器人元数据' },
    { key: 'chassis',    label: '底盘与动力', icon: <BuildOutlined />,        desc: '尺寸 & 动力' },
    { key: 'components', label: '电气装配',  icon: <AppstoreOutlined />,     desc: '核心 & 感知' },
    { key: 'mounting',   label: '安装坐标',  icon: <AimOutlined />,          desc: '6-DOF 位姿' },
    { key: 'wiring',     label: '接口连线',  icon: <ApiOutlined />,          desc: '通信连接' },
    { key: 'abilities',  label: '功能映射',  icon: <ThunderboltOutlined />,  desc: '能力配置' },
    { key: 'audit',      label: '审计导出',  icon: <AuditOutlined />,        desc: '校验 & 导出' },
];

const STEP_COMPONENTS = [
    IdentityStep, ChassisStep, ComponentLibraryStep,
    MountingStep, WiringStep, AbilityStep, AuditStep,
];

const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    // If we are on a known frontend dev port, point to 8002
    if (['3000', '3001', '5173'].includes(window.location.port)) {
      const url = `http://${window.location.hostname}:8002`;
      (window as any).BACKEND_URL = url;
      return url;
    }
    // If we are already on 8002 or something else, use origin
    (window as any).BACKEND_URL = window.location.origin;
    return window.location.origin;
  }
  return "http://localhost:8002";
};
const BACKEND_URL = getBackendUrl();

export default function App() {
    const { 
        config, isDirty, loadProject, resetProject, projectId, setProjectId, fetchSchemas,
        saveProject, listSavedProjects, loadProjectByName 
    } = useProjectStore();
    const { undo, redo, canUndo, canRedo } = useUndoRedo();
    const { currentStep, setStep } = useUIStore();
    const [messageApi, contextHolder] = message.useMessage();
    const [backendStatus, setBackendStatus] = useState<any>(null);

    // 初始加载：获取 XML 元数据注册表 + 后端状态
    useEffect(() => {
        fetchSchemas();
        
        // Fetch backend status info (2026-04-04)
        axios.get(`${BACKEND_URL}/api/v1/system/version`)
            .then(res => {
                console.log("[DEBUG] Backend Version Info:", res.data);
                setBackendStatus(res.data);
            })
            .catch(err => console.error("Failed to fetch backend status", err));
    }, [fetchSchemas]);
    const importRef = useRef<HTMLInputElement>(null);
    
    // 欢迎屏幕控制：首屏加载或主动切换时显示
    const [showWelcome, setShowWelcome] = useState(true);

    const handleImportClick = () => importRef.current?.click();

    /** 注册全局键盘监听：Ctrl+Z / Ctrl+Shift+Z 撤销重做 + Ctrl+S 保存 */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const mod = e.metaKey || e.ctrlKey;
            
            // Undo/Redo
            if (mod && e.key === 'z' && !e.shiftKey && canUndo) { e.preventDefault(); undo(); }
            if (mod && e.shiftKey && e.key === 'z' && canRedo) { e.preventDefault(); redo(); }
            
            // Save: Ctrl+S
            if (mod && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [canUndo, canRedo, isDirty, config.identity.robotName]);

    // Browser close/refresh protection: warn if unsaved changes exist
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '存在未保存的更改，确定离开？';
            }
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [isDirty]);

    /** 辅助函数：格式化打印审计日志到控制台 */
    const printAudit = (title: string, audit: string[]) => {
        if (!audit) return;
        console.group(`%c 📊 ${title} Audit Log`, 'color: #1890ff; font-weight: bold;');
        audit.forEach(line => console.log(line));
        console.groupEnd();
    };

    /** 
     * 处理配置导入：
     * 1. 上传文件到后端解压。
     * 2. 获取解析后的 JSON。
     * 3. 同步能力集配置。
     * 4. 更新 Zustand Store 启动配置向导。
     */
    const handleImport = async (e: React.ChangeEvent<HTMLInputElement> | File) => {
        const file = e instanceof File ? e : e.target.files?.[0];
        if (!file) return;
        setShowWelcome(false);
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
                const { schemaRegistry } = useProjectStore.getState();
                const parsed = ImportService.parseCompDesc(res.data.full_json, schemaRegistry);
                const fullConfig: any = { identity: parsed.identity, components: parsed.components, abilities };
                setProjectId(pId);
                loadProject(fullConfig);
                messageApi.success({ content: `成功导入: ${file.name}`, key: 'import' });
            }
        } catch (err) { 
            console.error('Import Error:', err);
            messageApi.error({ content: '导入失败', key: 'import' }); 
        } finally {
            if (!(e instanceof File) && e.target) e.target.value = '';
        }
    };

    const handleCreateNew = () => {
        resetProject();
        // [FIX] Generate a local projectId so handleExport doesn't fail with "请先导入"
        const newId = `new_proj_${Math.random().toString(36).substring(2, 9)}`;
        setProjectId(newId); 
        setStep(0);
        setShowWelcome(false);
    };

    const handleSave = async () => {
        try {
            messageApi.loading({ content: '正在保存项目...', key: 'save' });
            await saveProject();
            messageApi.success({ content: '项目已成功保存到服务器', key: 'save' });
        } catch (err: any) {
            const detail = err.response?.data?.detail || '网络连接失败';
            messageApi.error({ content: `保存失败: ${detail}`, key: 'save' });
        }
    };

    const handleLoadSaved = async (name: string) => {
        try {
            messageApi.loading({ content: `正在从服务器加载 ${name}...`, key: 'load_saved' });
            const ok = await loadProjectByName(name);
            if (ok) {
                setShowWelcome(false);
                setStep(0);
                messageApi.success({ content: `成功加载项目: ${name}`, key: 'load_saved' });
            } else {
                messageApi.error({ content: '加载失败', key: 'load_saved' });
            }
        } catch (err) {
            messageApi.error({ content: '加载请求出错', key: 'load_saved' });
        }
    };

    const handleExport = async () => {
        let currentProjectId = projectId;
        
        if (!currentProjectId) {
            const name = config.identity.robotName || 'Draft';
            const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            currentProjectId = `proj_${safeName}_${Date.now().toString(36)}`;
            setProjectId(currentProjectId);
            console.warn(`[DEBUG] Store had no projectId, auto-generated: ${currentProjectId}`);
        }

        console.group('%c 🚀 Starting Cloud Build Process', 'color: #1890ff; font-weight: bold; font-size: 12px;');
        console.log('[DEBUG] Target Project ID:', currentProjectId);
        console.log('[DEBUG] Current Config:', config);

        try {
            messageApi.loading({ content: '正在初始化构建环境...', key: 'export', duration: 0 });
            const initRes = await apiInitSandbox(currentProjectId, config);
            console.log('[DEBUG] 1. Init Sandbox Response:', initRes);

            messageApi.loading({ content: '正在同步配置...', key: 'export', duration: 0 });
            
            // Sync Abilities
            if (config.abilities?.functionAbility?.length > 0) {
                const mappedAbilities = ExportService.exportAbilities(config.abilities);
                const abiRes = await apiUpdateAbilities(currentProjectId, mappedAbilities);
                console.error('2. Ability Sync Response:', abiRes);
            }
            
            // Sync Chassis
            const chassis = config.components.find(c => c.category === 'CHASSIS');
            if (chassis) {
                const chassisUpdate = {
                    general_attr: { 
                        module_name: { string_value: config.identity.robotName },
                        module_shape: { shape_type: 'ENUM_BOX', box: { size_len: config.identity.chassisLength, size_width: config.identity.chassisWidth, size_height: config.identity.chassisHeight } }
                    }
                };
                const chassisRes = await apiUpdateComponent(currentProjectId, chassis.id, chassisUpdate);
                console.log('[DEBUG] 3. Chassis Sync Response:', chassisRes);
            }

            // Sync All Components (Positions)
            console.error('4. Syncing component positions...');
            await Promise.all(config.components.map(c => apiUpdateComponent(currentProjectId, c.id, {
                struct_param: { extend_params: [
                    { key: 'locCoordX', double_value: c.mountX }, { key: 'locCoordY', double_value: c.mountY }, { key: 'locCoordZ', double_value: c.mountZ },
                    { key: 'locCoordROLL', double_value: c.mountRoll }, { key: 'locCoordPITCH', double_value: c.mountPitch }, { key: 'locCoordYAW', double_value: c.mountYaw }
                ]}
            })));

            // Trigger Binary Build
            messageApi.loading({ content: '云端构建 CModel 中...', key: 'export', duration: 0 });
            console.log(`[DEBUG] 5. Requesting compile for: ${currentProjectId}`);
            const res = await axios.post(`${BACKEND_URL}/api/v1/models/${currentProjectId}/compile`);
            console.log('[DEBUG] 6. Final Compile Response:', res.data);
            
            if (res.data.status === 'success') {
                printAudit(`Export [${currentProjectId}]`, res.data.audit);
                
                // 1. Download .cmodel
                const linkModel = document.createElement('a');
                linkModel.href = `${BACKEND_URL}${res.data.download_url}`;
                linkModel.setAttribute('download', `${currentProjectId}_packed.cmodel`);
                document.body.appendChild(linkModel);
                linkModel.click();
                linkModel.remove();

                // 2. Download Module List CSV (2026-04-04 Added)
                if (res.data.module_list_url) {
                    setTimeout(() => {
                        const linkCsv = document.createElement('a');
                        linkCsv.href = `${BACKEND_URL}${res.data.module_list_url}`;
                        linkCsv.setAttribute('download', `${currentProjectId}_module_list.csv`);
                        document.body.appendChild(linkCsv);
                        linkCsv.click();
                        linkCsv.remove();
                    }, 500); // Slight delay to avoid browser blocking multiple downloads
                }

                messageApi.success({ content: '成果物与模块清单构建成功并下载！', key: 'export' });
            } else {
                console.error('[DEBUG] Build failed with non-success status:', res.data);
                throw new Error(res.data.detail || 'Build script returned error');
            }
        } catch (err: any) { 
            console.error('%c ❌ Build Error Details:', 'color: #ff4d4f; font-weight: bold;');
            console.error('Status:', err.response?.status);
            console.error('Server Data:', err.response?.data);
            console.error('Full Error Object:', err);
            
            const serverMsg = err.response?.data?.detail || err.message || 'Unknown error';
            messageApi.error({ content: `构建失败: ${serverMsg}`, key: 'export' }); 
        } finally {
            console.groupEnd();
        }
    };

    const StepComponent = STEP_COMPONENTS[currentStep];
    const currentStepInfo = STEPS[currentStep];

    if (showWelcome) {
        return (
            <div className="app-layout">
                {contextHolder}
                <WelcomeScreen
                    onCreateNew={handleCreateNew}
                    onImport={handleImport}
                    onLoadSaved={handleLoadSaved}
                    listSavedProjects={listSavedProjects}
                />
            </div>
        );
    }

    return (
        <div className="app-layout">
            {contextHolder}
            
            {/* 侧边导航 */}
            <Sidebar 
                steps={STEPS}
                currentStep={currentStep}
                onStepChange={setStep}
                onNewProject={() => setShowWelcome(true)}
                onImport={handleImportClick}
                onExport={handleExport}
                backendStatus={backendStatus}
            />

            <main className="app-main">
                {/* 顶部工具栏 */}
                <Header 
                    currentStep={currentStep}
                    stepLabel={currentStepInfo.label}
                    stepDesc={currentStepInfo.desc}
                    robotName={config.identity.robotName}
                    isDirty={isDirty}
                    undo={undo}
                    redo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onSave={handleSave}
                />

                <div className="content-area grid-bg">
                    <div className="content-grid content-enter" key={currentStep}>
                        <StepComponent onExport={handleExport} />
                    </div>
                </div>

                {/* 隐藏的导入 Input */}
                <input 
                    id="cmodel-import-input"
                    type="file" 
                    ref={importRef} 
                    style={{ display: 'none' }} 
                    accept=".cmodel,.json"
                    onChange={(e) => handleImport(e)}
                />
            </main>
        </div>
    );
}

