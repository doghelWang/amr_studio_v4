import React from 'react';
import { 
    PlusOutlined, 
    ImportOutlined, 
    ExportOutlined 
} from '@ant-design/icons';
import { MainModuleType } from '../../store/types';

interface SidebarProps {
    steps: any[];
    currentStep: number;
    onStepChange: (index: number) => void;
    onNewProject: () => void;
    onImport: () => void;
    onExport: () => void;
}

/**
 * 后台配置平台 - 侧边导航栏
 * 包含：
 * 1. 品牌 Logo。
 * 2. 9步向导式配置入口。
 * 3. 底部底座操作（新建、导入、导出）。
 */
export const Sidebar: React.FC<SidebarProps> = ({
    steps,
    currentStep,
    onStepChange,
    onNewProject,
    onImport,
    onExport
}) => {
    return (
        <aside className="app-sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">⚡</div>
                <span className="logo-text">AMR Studio</span>
            </div>
            
            <nav className="sidebar-nav">
                <div className="sidebar-section-label">配置向导</div>
                {steps.map((step, i) => (
                    <div 
                        key={step.key} 
                        className={`nav-item ${i === currentStep ? 'active' : ''}`} 
                        onClick={() => onStepChange(i)}
                    >
                        <span className="nav-icon">{step.icon}</span>
                        <span className="nav-label">{step.label}</span>
                        {i === currentStep && <span className="nav-badge">{i + 1}/{steps.length}</span>}
                    </div>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <button className="sidebar-action-btn" onClick={onNewProject}>
                    <PlusOutlined /> 新建项目
                </button>
                <button className="sidebar-action-btn" onClick={onImport}>
                    <ImportOutlined /> 导入 .cmodel
                </button>
                <button className="sidebar-action-btn primary" onClick={onExport}>
                    <ExportOutlined /> 导出配置
                </button>
            </div>
        </aside>
    );
};
