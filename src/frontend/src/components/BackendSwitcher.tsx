import React, { useState } from 'react';
import { Button, Input, Modal, Space, Tooltip, message } from 'antd';
import { ApiOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import {
  getDefaultBackendBase,
  resetBackendBase,
  setBackendBase,
} from '../services/backendConfig';

interface BackendSwitcherProps {
  backendBase: string;
  backendStatus?: any;
  onRefresh: () => void;
  compact?: boolean;
}

const normalizeUrl = (value: string) => value.trim().replace(/\/+$/, '');

export const BackendSwitcher: React.FC<BackendSwitcherProps> = ({
  backendBase,
  backendStatus,
  onRefresh,
  compact = false,
}) => {
  const [open, setOpen] = useState(false);
  const [draftUrl, setDraftUrl] = useState(backendBase);
  const [testing, setTesting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const openEditor = () => {
    setDraftUrl(backendBase);
    setOpen(true);
  };

  const applyUrl = (value: string) => {
    const nextUrl = normalizeUrl(value);
    if (!/^https?:\/\/[^/]+/.test(nextUrl)) {
      messageApi.error('请输入完整地址，例如 http://116.62.39.177:8003');
      return;
    }
    setBackendBase(nextUrl);
    setOpen(false);
    messageApi.success('后端地址已切换');
  };

  const testConnection = async () => {
    const candidate = normalizeUrl(draftUrl);
    setTesting(true);
    try {
      const res = await axios.get(`${candidate}/api/v1/system/version`, { timeout: 5000 });
      messageApi.success(`连接成功：${res.data.backendVersion || 'unknown'}`);
    } catch (err: any) {
      messageApi.error(`连接失败：${err.message || 'unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const resetToDefault = () => {
    const defaultUrl = resetBackendBase();
    setDraftUrl(defaultUrl);
    setOpen(false);
    messageApi.success('已恢复默认后端地址');
  };

  return (
    <>
      {contextHolder}
      <div className={compact ? 'backend-switcher compact' : 'backend-switcher'}>
        <div className="backend-switcher-main">
          <div className="backend-switcher-title">
            <ApiOutlined />
            <span>Backend</span>
            <span className={backendStatus ? 'backend-dot online' : 'backend-dot offline'} />
          </div>
          <div className="backend-switcher-url" title={backendBase}>{backendBase}</div>
          {backendStatus && (
            <div className="backend-switcher-meta">
              v{backendStatus.backendVersion} | {backendStatus.commitHash || backendStatus.buildDate || 'running'}
            </div>
          )}
        </div>
        <Space size={4}>
          <Tooltip title="刷新后端状态">
            <Button size="small" type="text" icon={<ReloadOutlined />} onClick={onRefresh} />
          </Tooltip>
          <Tooltip title="切换后端地址">
            <Button size="small" type="text" icon={<SettingOutlined />} onClick={openEditor} />
          </Tooltip>
        </Space>
      </div>

      <Modal
        title="后端服务地址"
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="default" onClick={resetToDefault}>
            默认
          </Button>,
          <Button key="test" loading={testing} onClick={testConnection}>
            测试
          </Button>,
          <Button key="save" type="primary" onClick={() => applyUrl(draftUrl)}>
            保存
          </Button>,
        ]}
      >
        <Input
          value={draftUrl}
          onChange={(e) => setDraftUrl(e.target.value)}
          onPressEnter={() => applyUrl(draftUrl)}
          placeholder={getDefaultBackendBase()}
          spellCheck={false}
        />
      </Modal>

      <style>{`
        .backend-switcher {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 10px;
          border: 1px solid var(--border-default);
          border-radius: 8px;
          background: var(--bg-hover);
          min-width: 0;
        }
        .backend-switcher.compact {
          max-width: 440px;
          width: 100%;
          margin-left: auto;
        }
        .backend-switcher-main {
          min-width: 0;
        }
        .backend-switcher-title {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--accent);
          font-weight: 600;
          font-size: 12px;
        }
        .backend-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .backend-dot.online {
          background: var(--success);
        }
        .backend-dot.offline {
          background: #f85149;
        }
        .backend-switcher-url {
          margin-top: 4px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .backend-switcher-meta {
          margin-top: 3px;
          color: var(--text-secondary);
          font-size: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </>
  );
};
