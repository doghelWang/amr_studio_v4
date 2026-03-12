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

    const reset = () => { setParsed(null); setError(null); };

    const handleUpload = async (file: File) => {
        setLoading(true);
        setError(null);
        setParsed(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('http://localhost:8000/api/v1/import', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Import failed');
            }
            const data = await res.json();
            setParsed({ 
                project: data.config ? { ...data.config, meta: { ...data.config.meta, projectId: data.config.meta?.projectId || 'imported' } } : data,
                raw_tree: data.raw_tree
            });
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
        return false; 
    };

    const formatTreeData = (data: any, keyPrefix = '0'): any => {
        if (typeof data !== 'object' || data === null) return [{ title: String(data), key: keyPrefix }];
        return Object.entries(data).map(([k, v], idx) => {
            const key = `${keyPrefix}-${idx}`;
            if (typeof v === 'object' && v !== null) {
                return { title: `Tag ${k}`, key, children: formatTreeData(v, key) };
            }
            return { title: `Tag ${k}: ${String(v)}`, key };
        });
    };

    const handleLoadIntoEditor = () => {
        if (!parsed) return;
        useProjectStore.getState().loadProject(parsed.project);
        message.success(`已载入并建立基因底座: ${parsed.project.meta.projectName}`);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: '#00d2ff', fontWeight: 'bold' }}>
                    <DeploymentUnitOutlined style={{ marginRight: 8 }} />
                    {item.label}
                </span>
                <Tag color="orange">{item.type}</Tag>
            </div>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>UUID: {item.id}</div>
            <Descriptions column={2} size="small" colon={false}>
                {Object.entries(item.details || {}).map(([k, v]: [string, any]) => (
                    <Descriptions.Item key={k} label={<span style={{color: '#666'}}>{k}</span>}>
                        <span style={{color: '#bbb'}}>{typeof v === 'number' ? v.toFixed(2) : String(v)}</span>
                    </Descriptions.Item>
                ))}
            </Descriptions>
        </div>
    );

    return (
        <Modal
            title="📂 深度导入 & 动态结构熔接 (V4 Hybrid)"
            open={open}
            onCancel={() => { onClose(); reset(); }}
            width={1000}
            footer={parsed ? [
                <Button key="cancel" onClick={() => { onClose(); reset(); }}>取消</Button>,
                <Button key="load" type="primary" icon={<RobotOutlined />} onClick={handleLoadIntoEditor}>
                    建立基因底座并载入
                </Button>
            ] : null}
        >
            {!parsed ? (
                <div style={{ padding: '16px 0' }}>
                    <Dragger
                        accept=".zip,.cmodel"
                        showUploadList={false}
                        beforeUpload={(file) => { handleUpload(file); return false; }}
                        style={{ background: '#0a0d14', border: '1px dashed #2a2d38' }}
                    >
                        <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: '#00d2ff', fontSize: 40 }} /></p>
                        <p style={{ color: '#ccc', fontSize: 14, margin: '8px 0' }}>拖拽工业模型文件到此处</p>
                        <p style={{ color: '#666', fontSize: 12 }}>系统将自动提取“基因底座”，确保后续增删组件时的模型完整性</p>
                    </Dragger>
                    {loading && <div style={{ marginTop: 16, textAlign: 'center' }}><Spin tip="正在穿透二进制结构..." /></div>}
                    {error && <Alert message={`解析失败: ${error}`} type="error" style={{ marginTop: 12 }} />}
                </div>
            ) : (
                <Tabs
                    items={[
                        {
                            key: 'parsed',
                            label: '🤖 核心组件',
                            children: (
                                <Descriptions bordered column={2} size="small" style={{ background: '#0a0d14' }}>
                                    <Descriptions.Item label="机器人名称">{identity?.robotName}</Descriptions.Item>
                                    <Descriptions.Item label="驱动类型"><Tag color="blue">{identity?.driveType}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="轮组计数">{wheels.length} 组</Descriptions.Item>
                                    <Descriptions.Item label="传感器">{sensors.length} 个</Descriptions.Item>
                                    <Descriptions.Item label="IO 模块">{ioBoards.length} 块</Descriptions.Item>
                                </Descriptions>
                            )
                        },
                        {
                            key: 'others',
                            label: `📦 厂设/非标部件 (${others.length})`,
                            children: (
                                <div style={{ maxHeight: 400, overflow: 'auto', padding: '0 8px' }}>
                                    {others.length > 0 ? others.map(renderOtherCard) : <Alert message="该模型仅包含标准组件" />}
                                </div>
                            )
                        },
                        {
                            key: 'raw',
                            label: '🌳 原始报文树',
                            children: (
                                <div style={{ maxHeight: 400, overflow: 'auto', background: '#05070a', padding: 8, borderRadius: 4 }}>
                                    <Tree
                                        showIcon
                                        defaultExpandAll={false}
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
