import React from 'react';
import { 
    PlusOutlined, 
    ImportOutlined, 
    ExportOutlined,
    GlobalOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { VERSION_INFO } from '../../version';
import { BackendSwitcher } from '../BackendSwitcher';

interface SidebarProps {
    steps: any[];
    currentStep: number;
    onStepChange: (index: number) => void;
    onNewProject: () => void;
    onImport: () => void;
    onExport: () => void;
    backendStatus?: any;
    backendBase: string;
    onRefreshBackend: () => void;
}

/**
 * 后台配置平台 - 侧边导航栏
 * 包含：
 * 1. 品牌 Logo。
 * 2. 9步向导式配置入口。
 * 3. 底部操作（新建、导入、导出）。
 * 4. 服务状态信息 (2026-04-04 Added)。
 */
export const Sidebar: React.FC<SidebarProps> = ({
    steps,
    currentStep,
    onStepChange,
    onNewProject,
    onImport,
    onExport,
    backendStatus,
    backendBase,
    onRefreshBackend
}) => {
    const formatDate = (isoStr?: string) => {
        if (!isoStr) return '--:--:--';
        try {
            const date = new Date(isoStr);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch (e) {
            return '--:--:--';
        }
    };

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
                {/* 服务状态面板 */}
                <div className="service-status-panel">
                    <div className="status-group">
                        <div className="status-title">
                            <GlobalOutlined /> <span>Frontend</span>
                        </div>
                        <div className="status-item">v{VERSION_INFO.version} | {formatDate(VERSION_INFO.startTime)}</div>
                        <div className="status-item addr">{window.location.origin}</div>
                    </div>
                    <BackendSwitcher
                        backendBase={backendBase}
                        backendStatus={backendStatus}
                        onRefresh={onRefreshBackend}
                    />
                </div>

                <div className="sidebar-actions">
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
            </div>
            <style>{`
                .sidebar-bottom {
                    padding-top: 16px;
                    border-top: 1px solid var(--border-default);
                    margin-top: 16px;
                }
                .service-status-panel {
                    background: var(--bg-hover);
                    border: 1px solid var(--border-default);
                    border-radius: 8px;
                    padding: 10px;
                    margin-bottom: 16px;
                    font-size: 11px;
                    box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
                }
                .status-group {
                    margin-bottom: 10px;
                }
                .status-group:last-child {
                    margin-bottom: 0;
                }
                .status-title {
                    color: var(--accent);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 4px;
                    font-weight: 600;
                }
                .status-item {
                    color: var(--text-secondary);
                    padding-left: 18px;
                    line-height: 1.5;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .status-item.addr {
                    color: var(--text-muted);
                    font-family: var(--font-mono);
                    font-size: 10px;
                }
                .offline { 
                    color: #f85149; 
                    font-weight: bold;
                }
                .sidebar-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .sidebar-action-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 10px;
                    border-radius: 6px;
                    border: 1px solid var(--border-default);
                    background: transparent;
                    color: var(--text-primary);
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.2s;
                }
                .sidebar-action-btn:hover {
                    background: var(--border-default);
                }
                .sidebar-action-btn.primary {
                    background: var(--accent);
                    border-color: var(--accent);
                    color: white;
                    font-weight: 600;
                }
                .sidebar-action-btn.primary:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
            `}</style>
        </aside>
    );
};
