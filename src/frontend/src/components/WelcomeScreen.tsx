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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 22% 18%, var(--accent-soft), transparent 26%), radial-gradient(circle at 82% 16%, rgba(81, 204, 138, 0.12), transparent 20%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 1180,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <BackendSwitcher
            backendBase={backendBase}
            backendStatus={backendStatus}
            onRefresh={onRefreshBackend}
            compact
          />
        </div>

        <div
          style={{
            marginBottom: 30,
            padding: '22px 26px',
            borderRadius: 28,
            border: '1px solid var(--border-default)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent), var(--bg-card)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 22,
                background: 'linear-gradient(135deg, var(--accent), var(--accent-strong))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)',
                color: '#fff',
                fontSize: 30,
              }}
            >
              ⚡
            </div>
            <div>
              <Text style={{ display: 'block', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Mobile Robot Configuration Deck
              </Text>
              <Title level={1} style={{ margin: '4px 0 6px', color: 'var(--text-bright)', fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
                AMR Studio
              </Title>
              <Text type="secondary" style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
                用一套前后端一致的数据流程，完成机型创建、导入编辑、审计导出。
              </Text>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              '7-step guided build',
              'Schema-safe editing',
              'Cloud compile pipeline',
              'Import / round-trip ready'
            ].map((label) => (
              <Tag
                key={label}
                style={{
                  margin: 0,
                  padding: '6px 10px',
                  borderRadius: 999,
                  border: '1px solid var(--border-default)',
                  background: 'var(--bg-hover)',
                  color: 'var(--text-secondary)',
                  fontSize: 11,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </Tag>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, width: '100%', alignItems: 'stretch', flexWrap: 'wrap' }}>
        {/* 1. Create New */}
        <div
          onClick={onCreateNew}
          className="welcome-card"
          style={{
            flex: '1 1 300px', cursor: 'pointer', padding: '32px 24px',
            background: 'linear-gradient(180deg, var(--accent-soft), transparent), var(--bg-card)',
            border: '1px solid var(--border-accent)',
            borderRadius: 24,
            transition: 'all 0.3s ease',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            position: 'relative',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-strong))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <PlusCircleOutlined style={{ fontSize: 28 }} />
          </div>
          <Title level={4} style={{ margin: 0, color: 'var(--text-bright)', fontSize: 20, fontFamily: 'var(--font-display)' }}>从头创建新机型</Title>
          <Text type="secondary" style={{ textAlign: 'center', fontSize: 13, lineHeight: 1.7, minHeight: 56, color: 'var(--text-secondary)' }}>
            进入完整向导，从身份信息、底盘动力到功能映射，逐步建立一台新的 AMR。
          </Text>
          <Space wrap size={4} style={{ justifyContent: 'center', margin: '8px 0' }}>
            <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>向导模式</Tag>
            <Tag color="geekblue" style={{ fontSize: 10, margin: 0 }}>标准化构建</Tag>
            <Tag color="cyan" style={{ fontSize: 10, margin: 0 }}>适合新项目</Tag>
          </Space>
          <Button
            type="primary" block size="large" icon={<ArrowRightOutlined />}
            style={{ marginTop: 'auto', height: 44 }}
            onClick={e => { e.stopPropagation(); onCreateNew(); }}
          >
            立即开始
          </Button>
        </div>

        {/* 2. Load Saved */}
        <div
          style={{
            flex: '1.2 1 360px', padding: '32px 24px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03), transparent), var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 24,
            transition: 'all 0.3s ease',
            display: 'flex', flexDirection: 'column', gap: 14,
            boxShadow: 'var(--shadow-md)',
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
            borderRadius: 18,
            padding: 10,
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
            flex: '1 1 300px', cursor: 'pointer', padding: '32px 24px',
            background: 'linear-gradient(180deg, rgba(81, 204, 138, 0.08), transparent), var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 24,
            transition: 'all 0.3s ease',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: 'linear-gradient(135deg, var(--success), #2a9b66)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 18px 42px rgba(63, 129, 88, 0.22)',
          }}>
            <FileSearchOutlined style={{ fontSize: 28 }} />
          </div>
          <Title level={4} style={{ margin: 0, color: 'var(--text-bright)', fontSize: 20, fontFamily: 'var(--font-display)' }}>打开 CModel 文件</Title>
          <Text type="secondary" style={{ textAlign: 'center', fontSize: 13, lineHeight: 1.7, minHeight: 56, color: 'var(--text-secondary)' }}>
            直接加载已有的二进制模型，进行逆向解析与修改。
          </Text>
          <Space wrap size={4} style={{ justifyContent: 'center', margin: '8px 0' }}>
            <Tag color="green" style={{ fontSize: 10, margin: 0 }}>二进制解析</Tag>
            <Tag color="cyan" style={{ fontSize: 10, margin: 0 }}>快速导出</Tag>
          </Space>
          <Button
            size="large" block icon={<ImportOutlined />}
            style={{ marginTop: 'auto', borderColor: 'var(--success)', color: 'var(--success)', height: 44 }}
            onClick={e => { e.stopPropagation(); importRef.current?.click(); }}
          >
            导入文件
          </Button>
        </div>
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

      <Divider style={{ width: '100%', maxWidth: 920, borderColor: 'var(--border-default)', marginTop: 36, marginBottom: 18 }} />
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
        <span>AMR Studio V4</span>
        <span>HIKROBOT workflow</span>
        <span>支持差速 / 舵轮 / 全向底盘机型配置</span>
      </div>

      <style>{`
        .welcome-card:hover { border-color: var(--accent) !important; transform: translateY(-6px); }
        .saved-project-item:hover { background: var(--accent-soft) !important; }
        .saved-project-item:hover .item-arrow { opacity: 0.7 !important; transform: translateX(4px); transition: all 0.2s; }
      `}</style>
    </div>
  );
};
