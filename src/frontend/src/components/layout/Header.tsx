import React from 'react';
import { Tooltip, Button } from 'antd';
import { UndoOutlined, RedoOutlined, SaveOutlined, BulbOutlined, SettingOutlined } from '@ant-design/icons';
import { useTheme } from '../../store/useThemeStore';

interface HeaderProps {
  currentStep: number;
  stepLabel: string;
  stepDesc: string;
  robotName: string;
  isDirty: boolean;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave: () => Promise<void>;
}

/**
 * 后台配置平台 - 顶栏 (Topbar)
 * 包含：
 * 1. 步骤指示器 (Breadcrumb) 与描述。
 * 2. 撤销/重做/保存全局操作。
 * 3. 主题切换 (Cyber / Industrial)。
 * 4. 项目状态显示。
 */
export const Header: React.FC<HeaderProps> = ({
  currentStep,
  stepLabel,
  stepDesc,
  robotName,
  isDirty,
  undo,
  redo,
  canUndo,
  canRedo,
  onSave
}) => {
  const [saving, setSaving] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <header className="app-topbar">
      <div className="topbar-breadcrumb">
        <span className="step-number">Step {currentStep + 1}</span>
        <span className="step-title">{stepLabel}</span>
        <span className="step-desc">— {stepDesc}</span>
      </div>

      <div className="topbar-actions">
        {/* Theme Toggle Button */}
        <Tooltip title={`当前主题: ${theme === 'cyber' ? '赛博科技' : '工业经典'} (点击切换)`}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            style={{ marginRight: 8 }}
          >
            <span className="theme-toggle-icon">
              {theme === 'cyber' ? <BulbOutlined /> : <SettingOutlined />}
            </span>
            <span className="theme-label" style={{ fontSize: 11, fontWeight: 500 }}>
              {theme === 'cyber' ? '赛博模式' : '工业模式'}
            </span>
          </button>
        </Tooltip>

        <div className="topbar-divider" />

        <Tooltip title="撤销 ⌘Z">
          <button
            className="topbar-btn"
            disabled={!canUndo}
            onClick={undo}
          >
            <UndoOutlined />
          </button>
        </Tooltip>

        <Tooltip title="重做 ⌘⇧Z">
          <button
            className="topbar-btn"
            disabled={!canRedo}
            onClick={redo}
          >
            <RedoOutlined />
          </button>
        </Tooltip>

        <div className="topbar-divider" />

        <Tooltip title="保存项目到后端">
          <Button
            type="text"
            size="small"
            loading={saving}
            icon={<SaveOutlined />}
            className="topbar-btn-save"
            onClick={handleSave}
            style={{
              color: isDirty ? '#177ddc' : 'var(--text-muted)',
              fontWeight: isDirty ? 700 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            保存
          </Button>
        </Tooltip>

        <div className="topbar-divider" />

        <span style={{
          color: 'var(--text-muted)',
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          display: 'flex',
          alignItems: 'center'
        }}>
          {robotName || '未命名机器人'}
          {isDirty && (
            <Tooltip title="存在未保存的更改">
              <span style={{ color: '#faad14', marginLeft: 6 }}>●</span>
            </Tooltip>
          )}
        </span>
      </div>
    </header>
  );
};
