import React from 'react';
import { Modal, Upload, Button, message, Descriptions, Tag, Tabs, Table, Spin, Alert } from 'antd';
import { InboxOutlined, RobotOutlined } from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import type { AmrProject } from '../store/types';

const { Dragger } = Upload;

interface ModelZipImportModalProps {
    open: boolean;
    onClose: () => void;
}

interface ParsedModelData {
    project: AmrProject & { _manifest?: any; _sourceFile?: string };
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
            setParsed({ project: data });
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
        return false; // prevent antd from auto-uploading
    };

    const handleLoadIntoEditor = () => {
        if (!parsed) return;
        useProjectStore.getState().loadProject(parsed.project);
        message.success(`已载入: ${parsed.project.meta.projectName}`);
        onClose();
        reset();
    };

    const cfg = parsed?.project.config;
    const identity = cfg?.identity;
    const wheels = cfg?.wheels ?? [];
    const sensors = cfg?.sensors ?? [];
    const ioPorts = cfg?.ioPorts ?? [];
    const ioBoards = cfg?.ioBoards ?? [];

    const driveTypeLabel: Record<string, string> = {
        DIFFERENTIAL: '差速双驱 Differential',
        SINGLE_STEER: '单舵轮 Single Steer',
        DUAL_STEER: '双舵轮 Dual Steer',
        QUAD_STEER: '四舵轮 Quad Steer',
        MECANUM_4: '麦克纳姆 Mecanum-4',
        OMNI_3: '三轮全向 Omni-3',
    };

    const wheelColumns = [
        { title: 'ID', dataIndex: 'canNodeId', key: 'canNodeId', width: 60 },
        { title: '标签', dataIndex: 'label', key: 'label' },
        { title: 'X (mm)', dataIndex: 'mountX', key: 'mountX', render: (v: number) => v?.toFixed(1) },
        { title: 'Y (mm)', dataIndex: 'mountY', key: 'mountY', render: (v: number) => v?.toFixed(1) },
        { title: 'CAN Bus', dataIndex: 'canBus', key: 'canBus' },
        { title: '驱动器', dataIndex: 'driverModel', key: 'driverModel' },
        { title: 'v空载 mm/s', dataIndex: 'maxVelocityIdle', key: 'maxVelocityIdle', render: (v: number) => v?.toFixed(0) },
        { title: 'v满载 mm/s', dataIndex: 'maxVelocityFull', key: 'maxVelocityFull', render: (v: number) => v?.toFixed(0) },
    ];

    const sensorColumns = [
        { title: '标签', dataIndex: 'label', key: 'label', width: 120 },
        { title: '类型', dataIndex: 'type', key: 'type', width: 90 },
        { title: '型号', dataIndex: 'model', key: 'model' },
        {
            title: '通信接口', key: 'netInfo', render: (_: any, r: any) => {
                if (r.ip) return <Tag color="blue">IP: {r.ip}:{r.port || 80}</Tag>;
                if (r.canNodeId) return <Tag color="purple">CAN Node: {r.canNodeId}</Tag>;
                return '-';
            }
        },
        { title: 'X (mm)', dataIndex: 'mountX', key: 'mountX', render: (v: number) => (v ?? 0).toFixed(1), width: 80 },
        { title: 'Y (mm)', dataIndex: 'mountY', key: 'mountY', render: (v: number) => (v ?? 0).toFixed(1), width: 80 },
        { title: '导航', dataIndex: 'usageNavi', key: 'usageNavi', render: (v: boolean) => v ? <Tag color="green">✓</Tag> : <Tag color="default">-</Tag>, width: 70 },
    ];

    const ioBoardColumns = [
        { title: '板卡型号', dataIndex: 'model', key: 'model' },
        { title: '总线类型', key: 'bus', render: () => <Tag color="blue">CAN</Tag> },
        { title: '节点 ID', dataIndex: 'canNodeId', key: 'canNodeId', render: (v: number) => <Tag color="purple">{v ?? '-'}</Tag> },
        { title: '支持通道数', dataIndex: 'channels', key: 'channels', render: (v: number) => v ?? '16 DI / 16 DO' },
    ];

    const ioColumns = [
        { title: '端口类型', dataIndex: 'port', key: 'port', width: 100 },
        { title: '物理来源', dataIndex: 'originModel', key: 'originModel', render: (v: string) => v ? <Tag>{v}</Tag> : '-' },
        { title: '业务逻辑绑定', dataIndex: 'logicBind', key: 'logicBind' },
    ];

    const manifestItems = parsed?.project._manifest?.ModelFileDesc ?? [];

    return (
        <Modal
            title="📂 导入 ModelSet ZIP"
            open={open}
            onCancel={() => { onClose(); reset(); }}
            width={820}
            footer={parsed ? [
                <Button key="cancel" onClick={() => { onClose(); reset(); }}>关闭</Button>,
                <Button key="load" type="primary" icon={<RobotOutlined />} onClick={handleLoadIntoEditor}>
                    载入到编辑器
                </Button>
            ] : null}
        >
            {!parsed ? (
                <div style={{ padding: '16px 0' }}>
                    <Dragger
                        accept=".zip"
                        showUploadList={false}
                        beforeUpload={(file) => { handleUpload(file); return false; }}
                        style={{ background: '#0a0d14', border: '1px dashed #2a2d38' }}
                    >
                        <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: '#00d2ff', fontSize: 40 }} /></p>
                        <p style={{ color: '#ccc', fontSize: 14, margin: '8px 0' }}>拖拽 ModelSet ZIP 文件到此处，或 <span style={{ color: '#00d2ff' }}>点击选择文件</span></p>
                        <p style={{ color: '#666', fontSize: 12 }}>支持导入包含 CompDesc.model / FuncDesc.model / AbiSet.model 的 ZIP 包</p>
                    </Dragger>
                    {loading && <div style={{ marginTop: 16, textAlign: 'center' }}><Spin tip="正在解析 Protobuf 数据..." /></div>}
                    {error && <Alert message={`解析失败: ${error}`} type="error" style={{ marginTop: 12 }} />}
                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <Button
                            type="link"
                            href="http://localhost:8000/api/v1/templates/download"
                            target="_blank"
                        >
                            ⬇ 下载工厂出厂模板 ZIP
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    <Alert
                        type="success"
                        message={`✅ 解析成功: ${parsed.project._sourceFile}`}
                        style={{ marginBottom: 12 }}
                    />
                    <Tabs
                        size="small"
                        items={[
                            {
                                key: 'identity',
                                label: '📋 基础信息',
                                children: (
                                    <Descriptions bordered column={2} size="small">
                                        <Descriptions.Item label="机器人名称">{identity?.robotName}</Descriptions.Item>
                                        <Descriptions.Item label="版本">{identity?.version}</Descriptions.Item>
                                        <Descriptions.Item label="驱动类型">
                                            <Tag color="blue">{driveTypeLabel[identity?.driveType ?? ''] || identity?.driveType}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="导航方式">
                                            <Tag color="cyan">{identity?.navigationMethod}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="底盘长度">{identity?.chassisLength} mm</Descriptions.Item>
                                        <Descriptions.Item label="底盘宽度">{identity?.chassisWidth} mm</Descriptions.Item>
                                        <Descriptions.Item label="轮组数量"><Tag color="orange">{wheels.length} 组</Tag></Descriptions.Item>
                                        <Descriptions.Item label="传感器数量"><Tag color="green">{sensors.length} 个</Tag></Descriptions.Item>
                                        <Descriptions.Item label="IO 映射"><Tag>{ioPorts.length} 条</Tag></Descriptions.Item>
                                        <Descriptions.Item label="IO 板"><Tag>{ioBoards.length} 块</Tag></Descriptions.Item>
                                    </Descriptions>
                                ),
                            },
                            {
                                key: 'wheels',
                                label: `⚙️ 轮组 (${wheels.length})`,
                                children: wheels.length > 0 ? (
                                    <Table
                                        dataSource={wheels.map((w, i) => ({ ...w, key: i }))}
                                        columns={wheelColumns}
                                        size="small"
                                        pagination={false}
                                        scroll={{ x: true }}
                                    />
                                ) : <Alert type="info" message="无轮组数据（模板可能未包含轮组配置块）" />,
                            },
                            {
                                key: 'sensors',
                                label: `📡 传感器 (${sensors.length})`,
                                children: sensors.length > 0 ? (
                                    <Table
                                        dataSource={sensors.map((s, i) => ({ ...s, key: i }))}
                                        columns={sensorColumns}
                                        size="small"
                                        pagination={false}
                                    />
                                ) : <Alert type="info" message="无传感器数据（AbiSet.model 中通常定义通用能力，具体传感器在项目配置中）" />,
                            },
                            {
                                key: 'io_boards',
                                label: `🔌 IO 板卡 (${ioBoards.length})`,
                                children: ioBoards.length > 0 ? (
                                    <Table
                                        dataSource={ioBoards.map((b: any, i: number) => ({ ...b, key: i }))}
                                        columns={ioBoardColumns}
                                        size="small"
                                        pagination={false}
                                    />
                                ) : <Alert type="info" message="无 IO 板卡扩展配置" />,
                            },
                            {
                                key: 'io',
                                label: `💡 IO 映射/交互 (${ioPorts.length})`,
                                children: ioPorts.length > 0 ? (
                                    <Table
                                        dataSource={ioPorts.map((p, i) => ({ ...p, key: i }))}
                                        columns={ioColumns}
                                        size="small"
                                        pagination={false}
                                    />
                                ) : <Alert type="info" message="无交互映射配置" />,
                            },
                            {
                                key: 'manifest',
                                label: '📦 文件清单',
                                children: (
                                    <Descriptions bordered size="small" column={1}>
                                        {manifestItems.map((item: any) => (
                                            <Descriptions.Item key={item.name} label={item.name}>
                                                <Tag>{item.type}</Tag>
                                                <span style={{ color: '#888', fontSize: 11, marginLeft: 8 }}>MD5: {item.md5}</span>
                                            </Descriptions.Item>
                                        ))}
                                    </Descriptions>
                                ),
                            },
                        ]}
                    />
                </div>
            )}
        </Modal>
    );
};
