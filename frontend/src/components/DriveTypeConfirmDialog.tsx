import React from 'react';
import { Modal, Button, Alert, Space } from 'antd';
import { WarningOutlined, SaveOutlined } from '@ant-design/icons';
import { useUIStore } from '../store/useUIStore';
import { useProjectStore } from '../store/useProjectStore';
import { DRIVE_TYPE_LABELS } from '../store/types';
import { saveProject } from '../services/projectFileService';

export const DriveTypeConfirmDialog: React.FC = () => {
    const { isDriveConfirmOpen, pendingDriveType, currentDriveType, closeDriveConfirm } = useUIStore();
    const { setDriveTypeImmediate, meta, config, snapshots } = useProjectStore();


    if (!isDriveConfirmOpen || !pendingDriveType) return null;

    const fromLabel = currentDriveType ? DRIVE_TYPE_LABELS[currentDriveType] : '';
    const toLabel = DRIVE_TYPE_LABELS[pendingDriveType];

    const doSwitch = () => {
        setDriveTypeImmediate(pendingDriveType);
        closeDriveConfirm();
    };

    const handleSaveAndSwitch = async () => {
        try {
            await saveProject({ formatVersion: '1.0', meta, config, snapshots });
            doSwitch();
        } catch {
            // user cancelled save → don't switch
        }
    };

    const handleDirectSwitch = () => {
        doSwitch();
    };

    return (
        <Modal
            title={<><WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />切换驱动拓扑</>}
            open={isDriveConfirmOpen}
            footer={null}
            onCancel={closeDriveConfirm}
            width={480}
            maskClosable={false}
        >
            <div style={{ lineHeight: 2, marginBottom: 16 }}>
                <div>您正在将驱动类型从:</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#faad14', marginLeft: 16 }}>{fromLabel}</div>
                <div>切换为:</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#00d2ff', marginLeft: 16 }}>{toLabel}</div>
            </div>

            <Alert
                type="warning"
                showIcon
                style={{ marginBottom: 20 }}
                message="此操作将重置所有轮组参数至默认值"
                description={
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                        <li>当前轮组配置（CAN ID、驱动器、运动参数等）将全部清除</li>
                        <li>建议先保存当前配置再切换</li>
                    </ul>
                }
            />

            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={closeDriveConfirm}>取消</Button>
                <Button danger onClick={handleDirectSwitch}>直接切换（丢弃现有配置）</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveAndSwitch}>
                    保存后再切换
                </Button>
            </Space>
        </Modal>
    );
};
