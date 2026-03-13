import React from 'react';
import { Modal, Upload, Button, message, Descriptions, Tag, Tabs, Table, Spin, Alert, Tree } from 'antd';
import { InboxOutlined, RobotOutlined, ClusterOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import type { AmrProject } from '../store/types';

const { Dragger } = Upload;

interface ModelZipImportModalProps {
    open: boolean;
    onClose: () => void;
}

interface ParsedModelData {
    project: AmrProject & { _manifest?: any; _sourceFile?: string };
    raw_tree?: any;
}

export const ModelZipImportModal: React.FC<ModelZipImportModalProps> = ({ open, onClose }) => {
    const [loading, setLoading] = React.useState(false);
    const [parsed, setParsed] = React.useState<ParsedModelData | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [debugLogs, setDebugLogs] = React.useState<string[]>([]);
    const pollIntervalRef = React.useRef<any>(null);

    const reset = () => { setParsed(null); setError(null); setDebugLogs([]); };

    const handleUpload = async (file: File) => {
        console.log("[Debug] 🟢 上传开始:", file.name, "大小:", (file.size / 1024).toFixed(2), "KB");
        setLoading(true);
        setError(null);
        setParsed(null);
        setDebugLogs(["[Frontend] 🟢 上传开始，等待后端提取..."]);
        
        // Start polling logs
        pollIntervalRef.current = setInterval(async () => {
            try {
                const logRes = await fetch('http://localhost:8000/api/v1/debug/logs');
                if (logRes.ok) {
                    const logData = await logRes.json();
                    if (logData.logs && logData.logs.length > 0) {
                        setDebugLogs(prev => [...prev, ...logData.logs]);
                    }
                }
            } catch (e) { /* ignore polling errors */ }
        }, 800);
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const startTime = performance.now();
            const res = await fetch('http://localhost:8000/api/v1/import', {
                method: 'POST',
                body: formData,
            });
            
            if (!res.ok) {
                const err = await res.json();
                console.error("[Debug] 🔴 后端报错:", err);
                throw new Error(err.detail || 'Import failed');
            }
            
            const data = await res.json();
            const endTime = performance.now();
            console.log("[Debug] 🟡 后端响应完成，耗时:", (endTime - startTime).toFixed(2), "ms");
            console.log("[Debug] 🟡 数据摘要 - 传感器:", data.config?.sensors?.length, "其他:", data.config?.others?.length);
            
            setParsed({ 
                project: data.config ? { ...data.config, snapshots: data.config.snapshots || [] } : data,
                raw_tree: data.raw_tree
            });
        } catch (e: any) {
            console.error("[Debug] 🔴 导入异常:", e);
            setError(e.message);
        } finally {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setLoading(false);
        }
        return false; 
    };

    // 优化后的极速 Tree 渲染
    const formatTreeData = (data: any, keyPrefix = '0', depth = 0): any => {
        if (depth > 2) return [{ title: '...', key: `${keyPrefix}-more` }]; // 深度限制到 2 层
        if (typeof data !== 'object' || data === null) return [{ title: String(data), key: keyPrefix }];
        
        return Object.entries(data).slice(0, 15).map(([k, v], idx) => {
            const key = `${keyPrefix}-${idx}`;
            if (typeof v === 'object' && v !== null) {
                return { title: `T${k}`, key, children: formatTreeData(v, key, depth + 1) };
            }
            return { title: `T${k}: ${String(v).substring(0, 30)}`, key };
        });
    };

    const handleLoadIntoEditor = () => {
        if (!parsed) return;
        useProjectStore.getState().loadProject(parsed.project);
        message.success(`已载入: ${parsed.project.meta?.projectName || '项目'}`);
        onClose();
        reset();
    };

    const cfg = parsed?.project.config || (parsed?.project as any);
    const identity = cfg?.identity;
    const wheels = cfg?.wheels ?? [];
    const sensors = cfg?.sensors ?? [];
    const ioBoards = cfg?.ioBoards ?? [];
    const others = cfg?.others ?? [];

    const renderOtherCard = (item: any) => (
        <div key={item.id} style={{ background: '#141a21', padding: 12, borderRadius: 6, marginBottom: 12, border: '1px solid #2a2d38' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#00d2ff', fontWeight: 'bold' }}>
                    <DeploymentUnitOutlined style={{ marginRight: 8 }} />
                    {item.label}
                </span>
                <Tag color="orange">{item.type}</Tag>
            </div>
        </div>
    );

    return (
        <Modal
            title="📂 深度导入 (Debug Mode)"
            open={open}
            onCancel={() => { onClose(); reset(); }}
            width={800}
            footer={parsed ? [
                <Button key="load" type="primary" icon={<RobotOutlined />} onClick={handleLoadIntoEditor}>
                    确认载入
                </Button>
            ] : null}
        >
            {!parsed ? (
                <div style={{ padding: '32px 0' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center' }}>
                            <Spin size="large" />
                            <div style={{ marginTop: 16, color: '#00d2ff' }}>正在深度解析二进制结构，请稍候...</div>
                            <div style={{ marginTop: 20, textAlign: 'left', background: '#05070a', padding: 12, borderRadius: 6, maxHeight: 150, overflowY: 'auto', border: '1px solid #2a2d38', display: 'flex', flexDirection: 'column' }}>
                                {debugLogs.map((log, i) => (
                                    <span key={i} style={{ color: '#00d2ff', fontSize: 13, fontFamily: 'monospace', marginBottom: 4 }}>
                                        {log}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Dragger
                            accept=".zip,.cmodel"
                            showUploadList={false}
                            beforeUpload={(file) => { handleUpload(file); return false; }}
                            style={{ background: '#0a0d14', border: '1px dashed #2a2d38' }}
                        >
                            <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: '#00d2ff' }} /></p>
                            <p style={{ color: '#ccc' }}>点击或拖拽 CMODEL 文件至此处</p>
                        </Dragger>
                    )}
                    {error && <Alert message={`解析失败: ${error}`} type="error" style={{ marginTop: 12 }} showIcon />}
                </div>
            ) : (
                <Tabs
                    items={[
                        {
                            key: 'parsed',
                            label: '🤖 核心组件',
                            children: (
                                <Descriptions bordered column={2} size="small" style={{ background: '#0a0d14' }}>
                                    <Descriptions.Item label="名称">{identity?.robotName}</Descriptions.Item>
                                    <Descriptions.Item label="轮组">{wheels.length} 组</Descriptions.Item>
                                    <Descriptions.Item label="传感器">{sensors.length} 个</Descriptions.Item>
                                    <Descriptions.Item label="其他">{others.length} 个</Descriptions.Item>
                                </Descriptions>
                            )
                        },
                        {
                            key: 'raw',
                            label: '🌳 协议骨架',
                            children: (
                                <div style={{ maxHeight: 300, overflow: 'auto', background: '#05070a', padding: 8 }}>
                                    <Tree
                                        showIcon
                                        treeData={formatTreeData(parsed.raw_tree)}
                                        icon={<ClusterOutlined style={{ color: '#00d2ff' }} />}
                                        style={{ background: 'transparent', color: '#aaa' }}
                                    />
                                </div>
                            )
                        }
                    ]}
                />
            )}
        </Modal>
    );
};
