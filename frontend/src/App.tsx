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
    apiFetchComponentDetails
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
    const { config, isDirty, loadProject, resetProject, projectId, setProjectId, fetchSchemas } = useProjectStore();
    const { undo, redo, canUndo, canRedo } = useUndoRedo();
    const { currentStep, setStep } = useUIStore();
    const [messageApi, contextHolder] = message.useMessage();

    // 初始加载：获取 XML 元数据注册表
    useEffect(() => {
        fetchSchemas();
    }, [fetchSchemas]);
    const importRef = useRef<HTMLInputElement>(null);
    
    // 欢迎屏幕控制：首屏加载或主动切换时显示
    const [showWelcome, setShowWelcome] = useState(true);

    const handleImportClick = () => importRef.current?.click();

    /** 注册全局键盘监听：Ctrl+Z / Ctrl+Shift+Z 撤销重做 */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const mod = e.metaKey || e.ctrlKey;
            if (mod && e.key === 'z' && !e.shiftKey && canUndo) { e.preventDefault(); undo(); }
            if (mod && e.shiftKey && e.key === 'z' && canRedo) { e.preventDefault(); redo(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [canUndo, canRedo]);

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
        setProjectId(null);
        setStep(0);
        setShowWelcome(false);
    };

    /** 
     * 处理配置导出：
     * 1. 深度校验核心参数。
     * 2. 将前端状态同步到后端沙箱。
     * 3. 触发后端 CModel 构建。
     * 4. 自动下载生成的文件。
     */
    const handleExport = async () => {
        if (!projectId) return messageApi.warning("请先导入！");
        try {
            messageApi.loading({ content: '正在执行构建前校验...', key: 'export', duration: 0 });
            
            // 数据一致性审计 (示例：电机减速比校验)
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
                console.log(`[${motorLeft.name}] gearRatio on SERVER: %c${ratio}`, 'color: #52c41a; font-weight: bold;');
                console.groupEnd();
            }

            // 同步步骤：Abilities -> Chassis Identity -> Component Positions
            messageApi.loading({ content: '正在同步配置...', key: 'export', duration: 0 });
            if (config.abilities && config.abilities.functionAbility && config.abilities.functionAbility.length > 0) {
                const mappedAbilities = ExportService.exportAbilities(config.abilities);
                await apiUpdateAbilities(projectId, mappedAbilities);
            }
            
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

            // 触发二进制构建
            messageApi.loading({ content: '云端构建 CModel 中...', key: 'export', duration: 0 });
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
            
            {/* 欢迎引导页 */}
            {showWelcome && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
                    <WelcomeScreen
                        onCreateNew={handleCreateNew}
                        onImport={handleImport}
                    />
                </div>
            )}

            {/* 侧边导航 */}
            <Sidebar 
                steps={STEPS}
                currentStep={currentStep}
                onStepChange={setStep}
                onNewProject={() => setShowWelcome(true)}
                onImport={handleImportClick}
                onExport={handleExport}
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
