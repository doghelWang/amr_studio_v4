import React from 'react';

export const DifferentialDiagram: React.FC<{ width?: number; height?: number }> = ({ width = 200, height = 120 }) => (
    <svg width={width} height={height} viewBox="0 0 200 120" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
        {/* Chassis Outline */}
        <rect x="40" y="20" width="120" height="80" rx="10" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="4 2" />
        {/* Left Wheel */}
        <rect x="25" y="30" width="15" height="60" rx="3" fill="var(--accent)" />
        <line x1="40" y1="60" x2="60" y2="60" stroke="var(--accent)" strokeWidth="2" />
        {/* Right Wheel */}
        <rect x="160" y="30" width="15" height="60" rx="3" fill="var(--accent)" />
        <line x1="140" y1="60" x2="160" y2="60" stroke="var(--accent)" strokeWidth="2" />
        {/* Center Point */}
        <circle cx="100" cy="60" r="4" fill="#ff4d4f" />
        <text x="100" y="110" textAnchor="middle" fontSize="10" fill="var(--text-muted)">标准差速 (Standard Diff)</text>
    </svg>
);

export const SteerWheelDiagram: React.FC<{ width?: number; height?: number }> = ({ width = 200, height = 120 }) => (
    <svg width={width} height={height} viewBox="0 0 200 120" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
        <rect x="40" y="20" width="120" height="80" rx="10" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="4 2" />
        {/* Steer Wheel at front */}
        <g transform="rotate(20, 100, 30)">
            <rect x="90" y="10" width="20" height="40" rx="4" fill="var(--accent)" />
        </g>
        {/* Rotation Arrow */}
        <path d="M 80 20 A 25 25 0 0 1 120 20" fill="none" stroke="#58a6ff" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#58a6ff" />
            </marker>
        </defs>
        <circle cx="100" cy="60" r="3" fill="var(--text-muted)" />
        <text x="100" y="110" textAnchor="middle" fontSize="10" fill="var(--text-muted)">舵轮驱动 (Steer Wheel)</text>
    </svg>
);

export const OmniWheelDiagram: React.FC<{ width?: number; height?: number }> = ({ width = 200, height = 120 }) => (
    <svg width={width} height={height} viewBox="0 0 200 120" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
        <rect x="50" y="20" width="100" height="80" rx="8" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="4 2" />
        {/* 4 Mecanum wheels */}
        <rect x="35" y="25" width="15" height="30" rx="2" fill="var(--accent)" />
        <rect x="150" y="25" width="15" height="30" rx="2" fill="var(--accent)" />
        <rect x="35" y="65" width="15" height="30" rx="2" fill="var(--accent)" />
        <rect x="150" y="65" width="15" height="30" rx="2" fill="var(--accent)" />
        {/* Rotation Indicators */}
        <path d="M 100 40 L 120 60 L 100 80 L 80 60 Z" fill="rgba(88,166,255,0.2)" stroke="#58a6ff" strokeWidth="1" />
        <text x="100" y="110" textAnchor="middle" fontSize="10" fill="var(--text-muted)">全向麦轮 (Mecanum/Omni)</text>
    </svg>
);
