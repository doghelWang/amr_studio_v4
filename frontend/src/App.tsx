import React, { useEffect, useRef } from 'react';
import { Layout, Menu, Button, Tooltip, Badge, Dropdown, Modal, message, Tag } from 'antd';
import type { MenuProps } from 'antd';
import {
    SaveOutlined, FolderOpenOutlined, FileAddOutlined,
    UndoOutlined, RedoOutlined, SafetyOutlined,
    CloudDownloadOutlined,
    RobotOutlined, ControlOutlined, DashboardOutlined,
    RadarChartOutlined, ApiOutlined, NodeIndexOutlined, ApartmentOutlined
} from '@ant-design/icons';
import axios from 'axios';

import { useProjectStore, useUndoRedo } from './store/useProjectStore';
import { useUIStore } from './store/useUIStore';
import { saveProject, fetchProjectList, fetchProjectFile, autosaveDraft, clearDraft, clearFileHandle } from './services/projectFileService';
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
    const { meta, config, snapshots, isDirty, validation, loadProject, resetProject } = useProjectStore();
    const { undo, redo, canUndo, canRedo } = useUndoRedo();
    const { activePanel, setActivePanel, toggleHealthDashboard } = useUIStore();
    const autosaveRef = useRef<ReturnType<typeof setInterval>>();

    // Autosave every 30s
    useEffect(() => {
        autosaveRef.current = setInterval(() => {
            autosaveDraft({ formatVersion: '1.0', meta, config, snapshots });
        }, 30_000);
        return () => clearInterval(autosaveRef.current);
    }, [meta, config, snapshots]);

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
    const [projectList, setProjectList] = React.useState<Array<{ filename: string, robotName: string, lastModified: number }>>([]);
    const [loadingProjects, setLoadingProjects] = React.useState(false);
    const [factoryTemplates, setFactoryTemplates] = React.useState<BackendTemplateInfo[]>([]);
    const [importModalVisible, setImportModalVisible] = React.useState(false);

    const handleSave = async () => {
        try {
            await saveProject({ formatVersion: '1.0', meta, config, snapshots });
            message.success('项目已同步保存至云端');
        } catch { message.error('云端同步失败，请检查网络'); }
    };

    const handleOpen = async () => {
        if (isDirty) {
            Modal.confirm({
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
            setProjectList(list);
            setFactoryTemplates(templates);
        } catch (e) {
            message.error((e as Error).message);
        } finally {
            setLoadingProjects(false);
        }
    };

    const doOpen = async (filename: string) => {
        setProjectModalVisible(false);
        const hide = message.loading('正在拉取配置...', 0);
        try {
            const project = await fetchProjectFile(filename);
            loadProject(project);
            message.success(`已装载: ${project.meta.projectName}`);
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
            if (!project) { message.error('无法载入模板'); return; }
            useProjectStore.getState().loadProject(project);
            clearFileHandle();
            message.success(`已载入: ${project.meta.projectName}`);
        } catch { message.error('模板载入失败'); }
        finally { hide(); }
    };

    const handleNew = () => {
        if (isDirty) {
            Modal.confirm({
                title: '当前项目有未保存的更改',
                content: '新建项目将丢弃当前配置，是否继续？',
                okText: '新建', cancelText: '取消',
                onOk: () => { resetProject(); clearFileHandle(); clearDraft(); },
            });
        } else { resetProject(); clearFileHandle(); clearDraft(); }
    };

    const [loading, setLoading] = React.useState(false);

    const handleCompile = async () => {
        if (!validation.isCompilable) {
            Modal.warning({ title: '配置存在错误', content: '请修复所有错误后再编译。点击顶栏"健康度"查看详情。' });
            return;
        }
        setLoading(true);
        try {
            useProjectStore.getState().createSnapshot(`编译快照 ${new Date().toLocaleString('zh-CN')}`);

            const payload = {
                robotName: config.identity.robotName,
                version: config.identity.version,
                // Send raw frontend enum - backend now handles DIFFERENTIAL, MECANUM_4 etc. directly
                driveType: config.identity.driveType,
                wheels: config.wheels,
                // Send sensors with mountX/mountY/mountYaw - backend schema now accepts these directly
                sensors: config.sensors,
                ioPorts: config.ioPorts
            };

            const res = await axios.post('http://localhost:8000/api/v1/generate', payload, { responseType: 'blob' });
            const url = URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `${meta.projectName.replace(/\s/g, '_')}_ModelSet.zip`;
            document.body.appendChild(a); a.click(); a.remove();
            URL.revokeObjectURL(url);
            message.success('ModelSet 编译完成！');
        } catch (e: any) {
            let errMsg = '编译失败，请检查后端服务';
            if (axios.isAxiosError(e) && e.response?.data) {
                // If the response is a blob, we have to read it asynchronously to get the JSON error
                if (e.response.data instanceof Blob) {
                    const text = await e.response.data.text();
                    try {
                        const json = JSON.parse(text);
                        if (json.detail) errMsg = `校验错误: ${JSON.stringify(json.detail)}`;
                    } catch { }
                }
            }
            message.error(errMsg, 8); // show for 8 seconds
        }
        finally { setLoading(false); }
    };

    const compileMenu: MenuProps['items'] = [
        { key: 'compile', label: '编译 ModelSet.zip', onClick: handleCompile },
        { key: 'snapshot', label: '创建版本快照', onClick: () => useProjectStore.getState().createSnapshot(`手动快照 ${new Date().toLocaleString('zh-CN')}`) },
    ];

    const renderContent = () => {
        switch (activePanel) {
            case 'identity': return <IdentityForm />;
            case 'control': return <ControlBoardForm />;
            case 'drive': return <DriveForm />;
            case 'sensor': return <SensorForm />;
            case 'io': return <IOForm />;
            case 'blueprint': return <RobotCanvas />;
            case 'wiring': return <WiringCanvas />;
        }
    };

    const errorCount = validation.errors.length;
    const warnCount = validation.warnings.length;

    return (
        <Layout style={{ minHeight: '100vh', background: '#090b10' }}>
            {/* Top App Bar */}
            <Header style={{
                height: 48, padding: '0 16px',
                background: '#0f1117', borderBottom: '1px solid #1a1d28',
                display: 'flex', alignItems: 'center', gap: 8,
                justifyContent: 'space-between',
            }}>
                {/* Left: logo + file ops */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#00d2ff', fontWeight: 800, fontSize: 15, letterSpacing: 1, marginRight: 8 }}>
                        ⚡ AMR Studio
                    </span>
                    <Tooltip title="新建项目 (Ctrl+N)">
                        <Button size="small" type="text" icon={<FileAddOutlined />} onClick={handleNew} />
                    </Tooltip>
                    <Tooltip title="打开项目 (Ctrl+O)">
                        <Button size="small" type="text" icon={<FolderOpenOutlined />} onClick={handleOpen} />
                    </Tooltip>
                    <Tooltip title="保存项目 (Ctrl+S)">
                        <Button size="small" type="text"
                            icon={<SaveOutlined style={{ color: isDirty ? '#faad14' : undefined }} />}
                            onClick={handleSave}
                        />
                    </Tooltip>
                    <Tooltip title="导入 ModelSet ZIP">
                        <Button size="small" type="text"
                            icon={<CloudDownloadOutlined style={{ color: '#00d2ff' }} />}
                            onClick={() => setImportModalVisible(true)}
                        />
                    </Tooltip>
                    <span style={{ color: '#333', margin: '0 4px' }}>│</span>
                    <Tooltip title="撤销 (Ctrl+Z)">
                        <Button size="small" type="text" icon={<UndoOutlined />} disabled={!canUndo} onClick={() => undo()} />
                    </Tooltip>
                    <Tooltip title="重做 (Ctrl+Shift+Z)">
                        <Button size="small" type="text" icon={<RedoOutlined />} disabled={!canRedo} onClick={() => redo()} />
                    </Tooltip>
                </div>

                {/* Center: project name + dirty indicator */}
                <div style={{ color: '#666', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#aaa' }}>{meta.projectName}</span>
                    {isDirty && <Tag color="warning" style={{ margin: 0, fontSize: 10 }}>● 未保存</Tag>}
                </div>

                {/* Right: health + compile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tooltip title="查看配置健康度">
                        <Badge count={errorCount} size="small" offset={[-4, 4]}>
                            <Button
                                size="small" type="text"
                                icon={<SafetyOutlined style={{ color: errorCount > 0 ? '#ff4d4f' : warnCount > 0 ? '#faad14' : '#52c41a' }} />}
                                onClick={toggleHealthDashboard}
                            />
                        </Badge>
                    </Tooltip>
                    <Dropdown menu={{ items: compileMenu }} placement="bottomRight">
                        <Button
                            type="primary" size="small"
                            icon={<CloudDownloadOutlined />}
                            loading={loading}
                            disabled={!validation.isCompilable}
                            style={{ fontWeight: 700 }}
                        >
                            编译 ▾
                        </Button>
                    </Dropdown>
                </div>
            </Header>

            <Layout style={{ flex: 1 }}>
                {/* Sidebar */}
                <Sider width={200} theme="dark" style={{ borderRight: '1px solid #1a1d28' }}>
                    <Menu
                        theme="dark" mode="inline"
                        selectedKeys={[activePanel]}
                        onClick={e => setActivePanel(e.key as any)}
                        items={NAV_ITEMS}
                        style={{ borderRight: 0, marginTop: 4 }}
                    />
                </Sider>

                {/* Main */}
                <Layout style={{ display: 'flex', flexDirection: 'column' }}>
                    <Content style={{
                        background: '#090b10', overflowY: 'auto',
                        flex: 1, paddingBottom: 40,
                    }}>
                        {renderContent()}
                    </Content>
                    <StatusBar />
                </Layout>
            </Layout>

            {/* Global Overlays */}
            <DriveTypeConfirmDialog />
            <HealthDashboard />
            <ModelZipImportModal open={importModalVisible} onClose={() => setImportModalVisible(false)} />
            <Modal
                title="打开云端项目"
                open={projectModalVisible}
                onCancel={() => setProjectModalVisible(false)}
                footer={null}
                width={520}
            >
                {/* Factory Templates Section */}
                {factoryTemplates.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>🏭 工厂出厂模板</div>
                        {factoryTemplates.map(t => (
                            <div
                                key={t.id}
                                onClick={() => doLoadTemplate(t.id)}
                                style={{
                                    padding: '10px 14px', marginBottom: 6,
                                    background: '#1a1d28', border: '1px solid #252836',
                                    borderRadius: 6, cursor: 'pointer',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}
                            >
                                <div>
                                    <strong style={{ color: '#00d2ff' }}>{t.name}</strong>
                                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{t.description} • v{t.version}</div>
                                </div>
                                <Tag color="blue" style={{ fontSize: 10 }}>出厂模板</Tag>
                            </div>
                        ))}
                        <div style={{ borderTop: '1px solid #252836', marginBottom: 12 }} />
                    </div>
                )}
                {/* Saved Projects Section */}
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>☁️ 云端已保存项目</div>
                {loadingProjects ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>正在扫描云端数据库...</div>
                ) : projectList.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>云端暂无已保存的项目</div>
                ) : (
                    <Menu
                        mode="inline"
                        style={{ border: '1px solid #252836', borderRadius: 8 }}
                        items={projectList.map(p => ({
                            key: p.filename,
                            label: (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>{p.robotName}</strong>
                                    <span style={{ color: '#aaa', fontSize: 12 }}>
                                        {new Date(p.lastModified * 1000).toLocaleString('zh-CN')}
                                    </span>
                                </div>
                            ),
                            onClick: () => doOpen(p.filename)
                        }))}
                    />
                )}
            </Modal>
        </Layout >
    );
}
