import React, { useEffect, useRef } from 'react';
import { Layout, Menu, Button, Tooltip, Badge, Dropdown, Tag, App as AntdApp, Modal, Space } from 'antd';
import {
    SaveOutlined, FolderOpenOutlined, FileAddOutlined,
    UndoOutlined, RedoOutlined, SafetyOutlined,
    CloudDownloadOutlined, ThunderboltOutlined,
    RobotOutlined, ControlOutlined, DashboardOutlined,
    RadarChartOutlined, ApiOutlined, NodeIndexOutlined, ApartmentOutlined
} from '@ant-design/icons';
import axios from 'axios';

import { useProjectStore, useUndoRedo } from './store/useProjectStore';
import { useUIStore } from './store/useUIStore';
import { saveProject, fetchProjectList, fetchProjectFile, autosaveDraft } from './services/projectFileService';
import { fetchBackendTemplates, loadBackendTemplate } from './services/templateService';
import type { BackendTemplateInfo } from './services/templateService';

import { IdentityForm } from './components/IdentityForm';
import { ControlBoardForm } from './components/ControlBoardForm';
import { DriveForm } from './components/DriveForm';
import { SensorForm } from './components/SensorForm';
import { IOForm } from './components/IOForm';
import { RobotCanvas } from './components/RobotCanvas';
import { WiringCanvas } from './components/WiringCanvas';
import { DriveTypeConfirmDialog } from './components/DriveTypeConfirmDialog';
import { HealthDashboard } from './components/HealthDashboard';
import { StatusBar } from './layout/StatusBar';
import { ModelZipImportModal } from './components/ModelZipImportModal';
import { WizardBuilder } from './components/WizardBuilder';

const { Header, Content, Sider } = Layout;

const NAV_ITEMS = [
    { key: 'identity', icon: <RobotOutlined />, label: '基础信息' },
    { key: 'control', icon: <ControlOutlined />, label: '控制板配置' },
    { key: 'drive', icon: <DashboardOutlined />, label: '轮组驱动' },
    { key: 'sensor', icon: <RadarChartOutlined />, label: '传感器模块' },
    { key: 'io', icon: <ApiOutlined />, label: 'IO 映射' },
    { key: 'blueprint', icon: <NodeIndexOutlined />, label: '安装蓝图 ↗' },
    { key: 'wiring', icon: <ApartmentOutlined />, label: '电气连接图 ↗' },
];

export default function App() {
    const { message, modal } = AntdApp.useApp();
    const { meta, config, snapshots, isDirty, validation, loadProject } = useProjectStore();
    const { undo, redo, canUndo, canRedo } = useUndoRedo();
    const { activePanel, setActivePanel, toggleHealthDashboard } = useUIStore();
    const autosaveRef = useRef<ReturnType<typeof setInterval>>();

    // Autosave stub
    useEffect(() => {
        autosaveRef.current = setInterval(() => {
            autosaveDraft(); 
        }, 30_000);
        return () => clearInterval(autosaveRef.current);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const mod = e.metaKey || e.ctrlKey;
            if (mod && e.key === 'z' && !e.shiftKey && canUndo) { e.preventDefault(); undo(); }
            if (mod && e.shiftKey && e.key === 'z' && canRedo) { e.preventDefault(); redo(); }
            if (mod && e.key === 's') { e.preventDefault(); handleSave(); }
            if (mod && e.key === 'b') { e.preventDefault(); handleCompile(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [canUndo, canRedo, meta, config, snapshots]);

    const [projectModalVisible, setProjectModalVisible] = React.useState(false);
    const [projectList, setProjectList] = React.useState<any[]>([]);
    const [loadingProjects, setLoadingProjects] = React.useState(false);
    const [factoryTemplates, setFactoryTemplates] = React.useState<BackendTemplateInfo[]>([]);
    const [importModalVisible, setImportModalVisible] = React.useState(false);
    const [wizardVisible, setWizardVisible] = React.useState(false);

    const handleSave = async () => {
        try {
            await saveProject({ formatVersion: '1.0', meta, config, snapshots });
            message.success('项目已同步保存至云端');
        } catch { message.error('云端同步失败，请检查网络'); }
    };

    const handleOpen = async () => {
        if (isDirty) {
            modal.confirm({
                title: '当前项目有未保存的更改',
                content: '打开新项目将丢失未保存的内容，是否继续？',
                okText: '继续打开', cancelText: '取消',
                onOk: openProjectModal,
            });
        } else openProjectModal();
    };

    const openProjectModal = async () => {
        setProjectModalVisible(true);
        setLoadingProjects(true);
        try {
            const [list, templates] = await Promise.all([
                fetchProjectList(),
                fetchBackendTemplates()
            ]);
            setProjectList((list as any).projects || list);
            setFactoryTemplates(templates);
        } catch (e) {
            message.error(`获取项目失败: ${(e as Error).message}`);
        } finally {
            setLoadingProjects(false);
        }
    };

    const doOpen = async (projectId: string) => {
        setProjectModalVisible(false);
        const hide = message.loading('正在拉取配置...', 0);
        try {
            const project = await fetchProjectFile(projectId);
            loadProject(project);
            message.success(`已装载项目`);
        } catch (e) {
            message.error(`装载失败: ${(e as Error).message}`);
        } finally {
            hide();
        }
    };

    const doLoadTemplate = async (templateId: string) => {
        setProjectModalVisible(false);
        const hide = message.loading('正在载入工厂模板...', 0);
        try {
            const project = await loadBackendTemplate(templateId);
            if (project) {
                loadProject(project);
                message.success(`已加载模板`);
            }
        } catch (e) {
            message.error('模板加载失败');
        } finally {
            hide();
        }
    };

    const handleCompile = async () => {
        const hide = message.loading('正在生成二进制模型...', 0);
        try {
            const response = await axios.post('http://localhost:8002/api/v1/generate', {
                meta, config, snapshots, formatVersion: '1.0'
            }, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${meta.projectName || 'ModelSet'}.cmodel`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success('CModel 已成功生成并导出');
        } catch (e) {
            message.error('编译生成失败');
        } finally {
            hide();
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#000' }}>
            <Sider width={220} theme="dark" style={{ borderRight: '1px solid #1a1d28' }}>
                <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
                    <div style={{ width: 32, height: 32, background: '#00d2ff', borderRadius: 8, marginRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ThunderboltOutlined style={{ color: '#000', fontSize: 18 }} />
                    </div>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>AMR STUDIO <span style={{ color: '#00d2ff' }}>V4</span></span>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[activePanel]}
                    items={NAV_ITEMS}
                    onClick={({ key }) => setActivePanel(key as any)}
                    style={{ background: 'transparent' }}
                />
            </Sider>

            <Layout>
                <Header style={{ background: '#000', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1d28' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Dropdown menu={{
                            items: [
                                { key: 'new', icon: <FileAddOutlined />, label: '新建工程', onClick: () => setWizardVisible(true) },
                                { key: 'open', icon: <FolderOpenOutlined />, label: '打开工程...', onClick: handleOpen },
                                { key: 'import', icon: <CloudDownloadOutlined />, label: '从 .cmodel 导入', onClick: () => setImportModalVisible(true) },
                                { type: 'divider' },
                                { key: 'save', icon: <SaveOutlined />, label: '保存工程', onClick: handleSave },
                            ]
                        }}>
                            <Button type="text" style={{ color: '#aaa' }}>文件</Button>
                        </Dropdown>
                        <Space size={4}>
                            <Tooltip title="撤销"><Button type="text" icon={<UndoOutlined />} disabled={!canUndo} onClick={() => undo()} style={{ color: '#aaa' }} /></Tooltip>
                            <Tooltip title="重做"><Button type="text" icon={<RedoOutlined />} disabled={!canRedo} onClick={() => redo()} style={{ color: '#aaa' }} /></Tooltip>
                        </Space>
                    </div>

                    <Space size={16}>
                        <Badge count={validation.errors.length} size="small">
                            <Button icon={<SafetyOutlined />} style={{ background: '#1a1d28', border: '1px solid #252836', color: validation.errors.length > 0 ? '#ff4d4f' : '#52c41a' }}>
                                实时校验
                            </Button>
                        </Badge>
                        <Button type="primary" icon={<ThunderboltOutlined />} onClick={handleCompile}>
                            编译模型
                        </Button>
                    </Space>
                </Header>

                <Content style={{ overflowY: 'auto' }}>
                    {activePanel === 'identity' && <IdentityForm />}
                    {activePanel === 'control' && <ControlBoardForm />}
                    {activePanel === 'drive' && <DriveForm />}
                    {activePanel === 'sensor' && <SensorForm />}
                    {activePanel === 'io' && <IOForm />}
                    {activePanel === 'blueprint' && <RobotCanvas />}
                    {activePanel === 'wiring' && <WiringCanvas />}
                </Content>

                <StatusBar />
            </Layout>

            <DriveTypeConfirmDialog />
            <HealthDashboard />
            <ModelZipImportModal open={importModalVisible} onClose={() => setImportModalVisible(false)} />
            <WizardBuilder open={wizardVisible} onClose={() => setWizardVisible(false)} />
            <Modal
                title="打开云端项目"
                open={projectModalVisible}
                onCancel={() => setProjectModalVisible(false)}
                footer={null}
                width={520}
            >
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 8 }}>☁️ 云端已保存项目</div>
                {loadingProjects ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>正在扫描...</div>
                ) : (
                    <Menu
                        theme="dark"
                        mode="inline"
                        style={{ border: '1px solid #252836', borderRadius: 8, background: 'transparent' }}
                        items={projectList.map(p => ({
                            key: p.id,
                            label: (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>{p.robotName}</strong>
                                    <span style={{ color: '#666', fontSize: 11 }}>{new Date(p.lastModified * 1000).toLocaleString()}</span>
                                </div>
                            ),
                            onClick: () => doOpen(p.id)
                        }))}
                    />
                )}
            </Modal>
        </Layout >
    );
}
