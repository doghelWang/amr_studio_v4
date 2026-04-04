import React, { useState, useEffect } from 'react';
import { Tag, Tooltip, Space, Divider } from 'antd';
import {
  CodeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { VERSION_INFO } from '../version';
import { apiFetchBackendVersion } from '../services/api_v2';

interface BackendVersion {
  backendVersion: string;
  buildDate: string;
  commitHash: string;
  serviceStartTime: string;
}

export const VersionInfo: React.FC = () => {
  const [backendInfo, setBackendInfo] = useState<BackendVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackendVersion = async () => {
      try {
        const data = await apiFetchBackendVersion();
        setBackendInfo(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch backend version:', err);
        setError('后端未连接');
      } finally {
        setLoading(false);
      }
    };

    fetchBackendVersion();
    // Refresh every 30 seconds
    const interval = setInterval(fetchBackendVersion, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const shortenCommit = (hash: string) => hash?.substring(0, 8) || 'N/A';

  return (
    <div
      style={{
        background: 'rgba(13, 17, 23, 0.9)',
        border: '1px solid rgba(56, 139, 253, 0.2)',
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 800,
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <ThunderboltOutlined style={{ color: '#4096ff', fontSize: 16 }} />
        <span style={{ color: '#f0f6fc', fontSize: 14, fontWeight: 600 }}>
          系统版本信息
        </span>
      </div>

      <Divider style={{ margin: '8px 0', borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* Frontend Version */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Tag
          color="blue"
          style={{
            margin: 0,
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
          }}
        >
          <span style={{ opacity: 0.7 }}>前端:</span>
          <span style={{ fontWeight: 600 }}>v{VERSION_INFO.version}</span>
        </Tag>
        <Tooltip title={`Commit: ${VERSION_INFO.commitHash}`}>
          <span style={{ color: '#8b949e', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CodeOutlined />
            {shortenCommit(VERSION_INFO.commitHash)}
          </span>
        </Tooltip>
        <span style={{ color: '#8b949e', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <CalendarOutlined />
          {VERSION_INFO.buildDate}
        </span>
      </div>

      {/* Backend Version */}
      {loading ? (
        <div style={{ color: '#8b949e', fontSize: 12 }}>
          正在获取后端版本信息...
        </div>
      ) : error ? (
        <Tag color="error" style={{ margin: 0, fontSize: 12 }}>
          <InfoCircleOutlined style={{ marginRight: 4 }} />
          {error}
        </Tag>
      ) : backendInfo ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Tag
            color="green"
            style={{
              margin: 0,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
            }}
          >
            <span style={{ opacity: 0.7 }}>后端:</span>
            <span style={{ fontWeight: 600 }}>v{backendInfo.backendVersion}</span>
          </Tag>
          <Tooltip title={`Commit: ${backendInfo.commitHash}`}>
            <span style={{ color: '#8b949e', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CodeOutlined />
              {shortenCommit(backendInfo.commitHash)}
            </span>
          </Tooltip>
          <span style={{ color: '#8b949e', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CalendarOutlined />
            {backendInfo.buildDate}
          </span>
          <Tooltip title={`服务启动时间: ${formatDate(backendInfo.serviceStartTime)}`}>
            <span style={{ color: '#8b949e', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ClockCircleOutlined />
              已运行 {calculateUptime(backendInfo.serviceStartTime)}
            </span>
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
};

// Calculate uptime from start time
function calculateUptime(startTime: string): string {
  try {
    const start = new Date(startTime).getTime();
    const now = Date.now();
    const diff = now - start;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}天${hours}小时`;
    if (hours > 0) return `${hours}小时${minutes}分钟`;
    return `${minutes}分钟`;
  } catch {
    return '未知';
  }
}
