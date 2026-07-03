import React from 'react';
import { Tooltip, Button } from 'antd';
import { UndoOutlined, RedoOutlined, SaveOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
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
  const { theme, setTheme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

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
        <Tooltip title={`当前模式：${isDarkMode ? '暗黑' : '明亮'}，点击快速切换`}>
          <div className="theme-toggle" style={{ marginRight: 8 }}>
            <button
              className={`theme-option ${isDarkMode ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              type="button"
            >
              <span className="theme-toggle-icon"><MoonOutlined /></span>
              <span className="theme-label">暗黑</span>
            </button>
            <button
              className={`theme-option ${!isDarkMode ? 'active' : ''}`}
              onClick={() => setTheme('light')}
              type="button"
            >
              <span className="theme-toggle-icon"><SunOutlined /></span>
              <span className="theme-label">明亮</span>
            </button>
            <button
              className="theme-swap-btn"
              onClick={toggleTheme}
              type="button"
              aria-label="切换主题"
            >
              {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            </button>
          </div>
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
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            保存
          </Button>
        </Tooltip>

        <div className="topbar-divider" />

        <span className={`project-chip ${isDirty ? 'dirty' : ''}`}>
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
