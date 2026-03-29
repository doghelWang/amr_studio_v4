import React, { useState } from 'react';
import { Tooltip, Button, message } from 'antd';
import { UndoOutlined, RedoOutlined, SaveOutlined } from '@ant-design/icons';

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
 * 2. 撤销/重做全局操作入口。
 * 3. 项目状态显示 (机器人名称、脏数据标记)。
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
    const [saving, setSaving] = useState(false);

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
