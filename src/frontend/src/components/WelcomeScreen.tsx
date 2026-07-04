import React, { useRef, useEffect, useState } from 'react';
import { Typography, Button, Space, Divider, Tag, List, Badge, Spin, Skeleton } from 'antd';
import {  PlusCircleOutlined, ImportOutlined, RobotOutlined,  ArrowRightOutlined, HistoryOutlined, FileSearchOutlined } from '@ant-design/icons';
import { BackendSwitcher } from './BackendSwitcher';

const { Title, Text } = Typography;

interface Props {
  onCreateNew: () => void;
  onImport: (file: File) => void;
  onLoadSaved: (name: string) => void;
  listSavedProjects: () => Promise<any[]>;
  backendBase: string;
  backendStatus?: any;
  onRefreshBackend: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({
  onCreateNew,
  onImport,
  onLoadSaved,
  listSavedProjects,
  backendBase,
  backendStatus,
  onRefreshBackend,
}) => {
  const importRef = useRef<HTMLInputElement>(null);
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      try {
        const list = await listSavedProjects();
        setSavedProjects(list);
      } catch (err) {
        console.error('Failed to load saved projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [listSavedProjects, backendBase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImport(file);
    e.target.value = '';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ── Background glow ── */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 800,
        background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        top: 24,
        right: 24,
        zIndex: 2,
        width: 420,
        maxWidth: 'calc(100% - 48px)',
      }}>
        <BackendSwitcher backendBase={backendBase} backendStatus={backendStatus} onRefresh={onRefreshBackend} compact />
      </div>

      {/* ── Logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: 'linear-gradient(135deg, var(--accent), var(--accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)',
          fontSize: 26,
        }}>⚡</div>
        <Title level={2} style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 700, letterSpacing: -0.5 }}>
          AMR Studio
        </Title>
      </div>
      <Text type="secondary" style={{ fontSize: 14, marginBottom: 48, textAlign: 'center', color: 'var(--text-secondary)' }}>
        工业级移动机器人配置平台 · V4
      </Text>

      {/* ── Three Option Cards ── */}
      <div style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 1100, alignItems: 'stretch' }}>
        {/* 1. Create New */}
        <div
          onClick={onCreateNew}
          className="welcome-card"
          style={{
            flex: 1, cursor: 'pointer', padding: '32px 24px',
            background: 'var(--accent-soft)',
            border: '1.5px solid var(--border-accent)',
            borderRadius: 20,
            transition: 'all 0.3s ease',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            position: 'relative',
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--bg-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PlusCircleOutlined style={{ fontSize: 26, color: 'var(--accent)' }} />
          </div>
          <Title level={4} style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18 }}>从头创建新机型</Title>
          <Text type="secondary" style={{ textAlign: 'center', fontSize: 12, lineHeight: 1.6, minHeight: 40, color: 'var(--text-secondary)' }}>
            启动 7 步引导向导，从身份信息开始，逐步完成底盘、组件库配置。
          </Text>
          <Space wrap size={4} style={{ justifyContent: 'center', margin: '8px 0' }}>
            <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>向导模式</Tag>
            <Tag color="geekblue" style={{ fontSize: 10, margin: 0 }}>标准化构建</Tag>
          </Space>
          <Button
            type="primary" block size="large" icon={<ArrowRightOutlined />}
            style={{ marginTop: 'auto' }}
            onClick={e => { e.stopPropagation(); onCreateNew(); }}
          >
            立即开始
          </Button>
        </div>

        {/* 2. Load Saved */}
        <div
          style={{
            flex: 1.2, padding: '32px 24px',
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-default)',
            borderRadius: 20,
            transition: 'all 0.3s ease',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--bg-hover)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <HistoryOutlined style={{ fontSize: 16, color: 'var(--warning)' }} />
            </div>
            <Title level={4} style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18 }}>打开已有项目</Title>
            <Badge count={savedProjects.length} overflowCount={16} style={{ backgroundColor: 'var(--warning)' }} />
          </div>

          <div style={{
            flex: 1,
            background: 'var(--bg-input)',
            borderRadius: 12,
            padding: 8,
            minHeight: 180,
            maxHeight: 240,
            overflowY: 'auto',
            border: '1px solid var(--border-default)'
          }}>
            {loading ? (
              <div style={{ padding: 20 }}><Skeleton active paragraph={{ rows: 3 }} title={false} /></div>
            ) : savedProjects.length > 0 ? (
              <List
                size="small"
                dataSource={savedProjects}
                renderItem={(item) => (
                  <List.Item
                    className="saved-project-item"
                    onClick={() => onLoadSaved(item.name)}
                    style={{
                      cursor: 'pointer',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: 8,
                      marginBottom: 4,
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                      <RobotOutlined style={{ color: 'var(--warning)', opacity: 0.7 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          color: 'var(--text-primary)', fontSize: 13, fontWeight: 500,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {item.name}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                          {new Date(item.mtime * 1000).toLocaleString()}
                        </div>
                      </div>
                      <ArrowRightOutlined className="item-arrow" style={{ fontSize: 12, opacity: 0 }} />
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                <HistoryOutlined style={{ fontSize: 32, marginBottom: 8, color: 'var(--text-muted)' }} />
                <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>暂无保存项目</Text>
              </div>
            )}
          </div>
          <Text type="secondary" style={{ textAlign: 'center', fontSize: 11, fontStyle: 'italic', color: 'var(--text-muted)' }}>
            后端临时空间，最大支持 16 个项目。
          </Text>
        </div>

        {/* 3. Import CModel */}
        <div
          onClick={() => importRef.current?.click()}
          style={{
            flex: 1, cursor: 'pointer', padding: '32px 24px',
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-default)',
            borderRadius: 20,
            transition: 'all 0.3s ease',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.15,
          }}>
            <FileSearchOutlined style={{ fontSize: 26, color: 'var(--success)' }} />
          </div>
          <Title level={4} style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18 }}>打开 CModel 文件</Title>
          <Text type="secondary" style={{ textAlign: 'center', fontSize: 12, lineHeight: 1.6, minHeight: 40, color: 'var(--text-secondary)' }}>
            直接加载已有的二进制模型，进行逆向解析与修改。
          </Text>
          <Space wrap size={4} style={{ justifyContent: 'center', margin: '8px 0' }}>
            <Tag color="green" style={{ fontSize: 10, margin: 0 }}>二进制解析</Tag>
            <Tag color="cyan" style={{ fontSize: 10, margin: 0 }}>快速导出</Tag>
          </Space>
          <Button
            size="large" block icon={<ImportOutlined />}
            style={{ marginTop: 'auto', borderColor: 'var(--success)', color: 'var(--success)' }}
            onClick={e => { e.stopPropagation(); importRef.current?.click(); }}
          >
            导入文件
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={importRef}
        type="file"
        accept=".cmodel,.json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Divider style={{ maxWidth: 800, borderColor: 'var(--border-default)', marginTop: 48 }} />
      <Text type="secondary" style={{ fontSize: 11, opacity: 0.6, color: 'var(--text-muted)' }}>
        AMR Studio V4 · HIKROBOT · 支持差速 / 舵轮 / 全向底盘机型配置
      </Text>

      <style>{`
        .welcome-card:hover { border-color: var(--accent) !important; transform: translateY(-4px); }
        .saved-project-item:hover { background: var(--accent-soft) !important; }
        .saved-project-item:hover .item-arrow { opacity: 0.7 !important; transform: translateX(4px); transition: all 0.2s; }
      `}</style>
    </div>
  );
};
