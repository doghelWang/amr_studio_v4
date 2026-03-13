import React from 'react';
import { Modal, Upload, Button, message, Descriptions, Tabs, Spin, Alert } from 'antd';
import { InboxOutlined, RobotOutlined } from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import type { AmrProject } from '../store/types';

const { Dragger } = Upload;

interface ModelZipImportModalProps {
    open: boolean;
    onClose: () => void;
}

interface ParsedModelData {
    project: AmrProject;
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
        setLoading(true);
        setError(null);
        setParsed(null);
        setDebugLogs(["[Frontend] 🟢 启动上传..."]);
        
        pollIntervalRef.current = setInterval(async () => {
            try {
                const logRes = await fetch('http://localhost:8002/api/v1/debug/logs');
                if (logRes.ok) {
                    const logData = await logRes.json();
                    if (logData.logs?.length > 0) setDebugLogs(prev => [...prev, ...logData.logs]);
                }
            } catch (e) {}
        }, 800);
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('http://localhost:8002/api/v1/import', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('后端解析失败');
            
            const data = await res.json();
            setParsed({ project: data, raw_tree: data.raw_tree });
        } catch (e: any) {
            setError(e.message);
        } finally {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setLoading(false);
        }
        return false; 
    };

    const handleLoadIntoEditor = () => {
        if (!parsed) return;
        const finalProject = { ...parsed.project, snapshots: parsed.project.snapshots || [] };
        useProjectStore.getState().loadProject(finalProject);
        message.success(`项目已载入`);
        onClose();
        reset();
    };

    const projectObj = parsed?.project;
    const config = projectObj?.config;
    const identity = config?.identity;

    return (
        <Modal
            title="📂 工业模型导入"
            open={open}
            onCancel={() => { onClose(); reset(); }}
            width={800}
            footer={parsed ? [
                <Button key="load" type="primary" icon={<RobotOutlined />} onClick={handleLoadIntoEditor}>
                    载入编辑器
                </Button>
            ] : null}
        >
            {!parsed ? (
                <div style={{ padding: '32px 0' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center' }}>
                            <Spin size="large" />
                            <div style={{ marginTop: 20, textAlign: 'left', background: '#05070a', padding: 12, maxHeight: 150, overflowY: 'auto' }}>
                                {debugLogs.map((log, i) => <div key={i} style={{ color: '#00d2ff', fontSize: 12 }}>{log}</div>)}
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
                            <p style={{ color: '#ccc' }}>拖拽 .cmodel 文件至此处进行全量解析</p>
                        </Dragger>
                    )}
                    {error && <Alert message={`错误: ${error}`} type="error" style={{ marginTop: 12 }} showIcon />}
                </div>
            ) : (
                <Tabs
                    items={[
                        {
                            key: 'parsed',
                            label: '🤖 组件摘要',
                            children: (
                                <Descriptions bordered column={2} size="small" style={{ background: '#0a0d14' }}>
                                    <Descriptions.Item label="名称">{identity?.robotName}</Descriptions.Item>
                                    <Descriptions.Item label="底盘类型">{identity?.driveType}</Descriptions.Item>
                                    <Descriptions.Item label="轮组计数">{config?.wheels?.length} 组</Descriptions.Item>
                                    <Descriptions.Item label="传感器">{config?.sensors?.length} 个</Descriptions.Item>
                                    <Descriptions.Item label="执行机构">{config?.actuators?.length} 个</Descriptions.Item>
                                    <Descriptions.Item label="辅助设备">{config?.auxiliary?.length} 个</Descriptions.Item>
                                </Descriptions>
                            )
                        }
                    ]}
                />
            )}
        </Modal>
    );
};
