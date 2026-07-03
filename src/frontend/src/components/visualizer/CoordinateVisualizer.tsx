import React, { useState, useEffect, useRef } from 'react';
import { Typography, Segmented } from 'antd';
import { useProjectStore } from '../../store/useProjectStore';

const { Text } = Typography;

interface ViewProps {
  type: 'iso' | 'top' | 'front' | 'side';
  width: number;
  height: number;
  components: any[];
  identity: any;
  activeId?: string;
  onSelect?: (id: string) => void;
  theme?: string;
}

// Theme-aware colors
const getThemeColors = (isDark: boolean) => ({
  background: isDark ? '#0d1117' : '#ffffff',
  grid: isDark ? '#30363d' : '#e5e7eb',
  axisX: isDark ? '#f87171' : '#dc2626',
  axisY: isDark ? '#4ade80' : '#16a34a',
  axisZ: isDark ? '#58a6ff' : '#2563eb',
  textPrimary: isDark ? '#f0f6fc' : '#1f2937',
  textSecondary: isDark ? '#8b949e' : '#6b7280',
  chassis: isDark ? ['#1f6feb', '#58a6ff'] : ['#1d4ed8', '#3b82f6'],
  glow: isDark ? 'rgba(88, 166, 255, 0.5)' : 'rgba(59, 130, 246, 0.3)',
});

/**
 * Unified 3D projector - consistent projection math
 * ISO: Isometric projection
 * Top: Orthographic top-down view (X,Y plane)
 * Front: Front view looking along -Y (X,Z plane)
 * Side: Side view looking along +X (Y,Z plane)
 */
const projectPoint = (
  x: number, y: number, z: number,
  type: 'iso' | 'top' | 'front' | 'side',
  centerX: number, centerY: number,
  scale: number
) => {
  if (type === 'iso') {
    const angle = Math.PI / 6; // 30 degrees
    const isoX = (x - y) * Math.cos(angle);
    const isoY = (x + y) * Math.sin(angle) - z;
    return { x: centerX + isoX * scale, y: centerY + isoY * scale };
  } else if (type === 'top') {
    // Top view: X is right, Y is up (screen Y is inverted)
    return { x: centerX + x * scale, y: centerY - y * scale };
  } else if (type === 'front') {
    // Front view: looking along -Y axis, X is right, Z is down (screen Y inverted)
    return { x: centerX + x * scale, y: centerY - z * scale };
  } else {
    // Side view: looking along +X axis, Y is right, Z is down (screen Y inverted)
    return { x: centerX + y * scale, y: centerY - z * scale };
  }
};

/**
 * Render chassis as full 3D box (for ISO) or rectangle (for Top/Front/Side)
 */
const renderChassis = (
  type: 'iso' | 'top' | 'front' | 'side',
  width: number, length: number, height: number,
  centerX: number, centerY: number, scale: number,
  colors: any
) => {
  const cx = 0, cy = 0, cz = height / 2;

  if (type === 'iso') {
    // ISO projection - draw all faces
    const p = [
      projectPoint(cx - length/2, cy - width/2, cz - height, type, centerX, centerY, scale),
      projectPoint(cx + length/2, cy - width/2, cz - height, type, centerX, centerY, scale),
      projectPoint(cx + length/2, cy + width/2, cz - height, type, centerX, centerY, scale),
      projectPoint(cx - length/2, cy + width/2, cz - height, type, centerX, centerY, scale),
      projectPoint(cx - length/2, cy - width/2, cz, type, centerX, centerY, scale),
      projectPoint(cx + length/2, cy - width/2, cz, type, centerX, centerY, scale),
      projectPoint(cx + length/2, cy + width/2, cz, type, centerX, centerY, scale),
      projectPoint(cx - length/2, cy + width/2, cz, type, centerX, centerY, scale),
    ];

    return (
      <g>
        {/* Bottom face (ground level) */}
        <polygon points={`${p[0].x},${p[0].y} ${p[1].x},${p[1].y} ${p[2].x},${p[2].y} ${p[3].x},${p[3].y}`}
                 fill={colors.chassis[0]} opacity={0.2} />
        {/* Side faces */}
        <polygon points={`${p[0].x},${p[0].y} ${p[1].x},${p[1].y} ${p[5].x},${p[5].y} ${p[4].x},${p[4].y}`}
                 fill={colors.chassis[0]} opacity={0.4} stroke={colors.chassis[1]} />
        <polygon points={`${p[1].x},${p[1].y} ${p[2].x},${p[2].y} ${p[6].x},${p[6].y} ${p[5].x},${p[5].y}`}
                 fill={colors.chassis[0]} opacity={0.5} stroke={colors.chassis[1]} />
        {/* Top face */}
        <polygon points={`${p[4].x},${p[4].y} ${p[5].x},${p[5].y} ${p[6].x},${p[6].y} ${p[7].x},${p[7].y}`}
                 fill={colors.chassis[1]} opacity={0.3} stroke={colors.chassis[1]} strokeWidth={2} />
      </g>
    );
  } else if (type === 'top') {
    // Top view - draw chassis with wheel arches
    const p1 = projectPoint(cx - length/2, cy - width/2, 0, type, centerX, centerY, scale);
    const p2 = projectPoint(cx + length/2, cy + width/2, 0, type, centerX, centerY, scale);

    // Wheel dimensions for outline
    const wheelLen = 240; // wheel diameter
    const wheelWidth = 60;
    const archDepth = (wheelWidth / width) * (p2.y - p1.y) / 2; // scaled arch depth
    const archWidth = (wheelLen / length) * (p2.x - p1.x); // scaled arch width

    // Chassis body rectangle with cutouts
    const bodyWidth = p2.x - p1.x;
    const bodyHeight = p2.y - p1.y;
    const centerPx = (p1.x + p2.x) / 2;
    const centerPy = (p1.y + p2.y) / 2;

    // Create path with wheel arches
    // Layout: front-left, front-right, rear-right, rear-left arches
    const archPath = `
      M ${p1.x + bodyWidth * 0.15} ${p1.y}
      L ${p1.x + bodyWidth * 0.35} ${p1.y}
      Q ${p1.x + bodyWidth * 0.35} ${p1.y - archDepth} ${p1.x + bodyWidth * 0.35 + archWidth * 0.1} ${p1.y - archDepth}
      L ${p1.x + bodyWidth * 0.35 + archWidth * 0.9} ${p1.y - archDepth}
      Q ${p1.x + bodyWidth * 0.35 + archWidth} ${p1.y - archDepth} ${p1.x + bodyWidth * 0.35 + archWidth} ${p1.y}
      L ${p1.x + bodyWidth * 0.65} ${p1.y}
      Q ${p1.x + bodyWidth * 0.65} ${p1.y - archDepth} ${p1.x + bodyWidth * 0.65 + archWidth * 0.1} ${p1.y - archDepth}
      L ${p1.x + bodyWidth * 0.65 + archWidth * 0.9} ${p1.y - archDepth}
      Q ${p1.x + bodyWidth * 0.65 + archWidth} ${p1.y - archDepth} ${p1.x + bodyWidth * 0.65 + archWidth} ${p1.y}
      L ${p2.x} ${p1.y}
      L ${p2.x} ${p2.y}
      L ${p1.x + bodyWidth * 0.65 + archWidth} ${p2.y}
      Q ${p1.x + bodyWidth * 0.65 + archWidth} ${p2.y + archDepth} ${p1.x + bodyWidth * 0.65 + archWidth * 0.9} ${p2.y + archDepth}
      L ${p1.x + bodyWidth * 0.65 + archWidth * 0.1} ${p2.y + archDepth}
      Q ${p1.x + bodyWidth * 0.65} ${p2.y + archDepth} ${p1.x + bodyWidth * 0.65} ${p2.y}
      L ${p1.x + bodyWidth * 0.35 + archWidth} ${p2.y}
      Q ${p1.x + bodyWidth * 0.35 + archWidth} ${p2.y + archDepth} ${p1.x + bodyWidth * 0.35 + archWidth * 0.9} ${p2.y + archDepth}
      L ${p1.x + bodyWidth * 0.35 + archWidth * 0.1} ${p2.y + archDepth}
      Q ${p1.x + bodyWidth * 0.35} ${p2.y + archDepth} ${p1.x + bodyWidth * 0.35} ${p2.y}
      L ${p1.x} ${p2.y}
      Z
    `;

    return (
      <g>
        {/* Main chassis body with wheel arches */}
        <path d={archPath}
          fill={colors.chassis[1]} opacity={0.35}
          stroke={colors.chassis[1]} strokeWidth={2} />
        {/* Center line indicator */}
        <line x1={centerPx} y1={p1.y + 10} x2={centerPx} y2={p2.y - 10}
          stroke={colors.chassis[0]} strokeWidth={1} strokeDasharray="4 4" opacity={0.5} />
        {/* Center cross */}
        <line x1={p1.x + 20} y1={centerPy} x2={p2.x - 20} y2={centerPy}
          stroke={colors.chassis[0]} strokeWidth={1} strokeDasharray="4 4" opacity={0.5} />
        {/* Front arrow indicator */}
        <polygon
          points={`${centerPx},${p1.y + 30} ${centerPx - 8},${p1.y + 45} ${centerPx + 8},${p1.y + 45}`}
          fill={colors.axisY} opacity={0.8} />
        <text x={centerPx + 15} y={p1.y + 45} fill={colors.axisY} fontSize={10}>前</text>
      </g>
    );
  } else if (type === 'front') {
    // Front view: looking along -Y, see X (horizontal) and Z (vertical)
    // Width = chassisWidth (Y dimension), Height = chassisHeight
    const p1 = projectPoint(cx - width/2, 0, 0, type, centerX, centerY, scale);
    const p2 = projectPoint(cx + width/2, 0, height, type, centerX, centerY, scale);

    return (
      <g>
        {/* Chassis body rectangle */}
        <rect
          x={p1.x} y={p2.y}
          width={p2.x - p1.x} height={p1.y - p2.y}
          fill={colors.chassis[1]} opacity={0.35}
          stroke={colors.chassis[1]} strokeWidth={2} rx={4}
        />
        {/* Ground line */}
        <line x1={p1.x - 20} y1={p1.y} x2={p2.x + 20} y2={p1.y}
          stroke={colors.grid} strokeWidth={1} strokeDasharray="4 2" />
        {/* Center cross indicator */}
        <line x1={centerX} y1={p2.y + 10} x2={centerX} y2={p1.y - 10}
          stroke={colors.chassis[0]} strokeWidth={1} strokeDasharray="4 4" opacity={0.5} />
        {/* Front indicator arrow (pointing up since Front is at +X) */}
        <polygon
          points={`${centerX - 8},${p2.y + 35} ${centerX},${p2.y + 20} ${centerX + 8},${p2.y + 35}`}
          fill={colors.axisY} opacity={0.8} />
        <text x={centerX + 12} y={p2.y + 35} fill={colors.axisY} fontSize={10}>前</text>
        {/* Motion center dot (at ground level) */}
        <circle cx={centerX} cy={p1.y} r={5} fill={colors.axisY} opacity={0.6} />
      </g>
    );
  } else {
    // Side view: looking along +X, see Y (horizontal) and Z (vertical)
    // Width = chassisLength (X dimension), Height = chassisHeight
    const p1 = projectPoint(0, cy - length/2, 0, type, centerX, centerY, scale);
    const p2 = projectPoint(0, cy + length/2, height, type, centerX, centerY, scale);

    return (
      <g>
        {/* Chassis body rectangle */}
        <rect
          x={p1.x} y={p2.y}
          width={p2.x - p1.x} height={p1.y - p2.y}
          fill={colors.chassis[1]} opacity={0.35}
          stroke={colors.chassis[1]} strokeWidth={2} rx={4}
        />
        {/* Ground line */}
        <line x1={p1.x - 20} y1={p1.y} x2={p2.x + 20} y2={p1.y}
          stroke={colors.grid} strokeWidth={1} strokeDasharray="4 2" />
        {/* Center line */}
        <line x1={centerX} y1={p2.y + 10} x2={centerX} y2={p1.y - 10}
          stroke={colors.chassis[0]} strokeWidth={1} strokeDasharray="4 4" opacity={0.5} />
        {/* Left/Right labels - Head is +X direction (towards top in side view) */}
        <text x={p1.x + 5} y={p2.y + 35} fill={colors.axisX} fontSize={9}>尾</text>
        <text x={p2.x - 25} y={p2.y + 35} fill={colors.axisX} fontSize={9}>头</text>
        {/* Direction arrow pointing to Head (+X) */}
        <polygon
          points={`${p2.x - 30},${p2.y + 30} ${p2.x - 20},${p2.y + 20} ${p2.x - 40},${p2.y + 20}`}
          fill={colors.axisX} opacity={0.8} />
        {/* Motion center dot (at ground level, center Y) */}
        <circle cx={centerX} cy={p1.y} r={5} fill={colors.axisY} opacity={0.6} />
      </g>
    );
  }
};


/**
 * Wheel visualization - draws as 3D cylinder-like shape
 */
const renderWheel = (
  type: 'iso' | 'top' | 'front' | 'side',
  x: number, y: number, z: number, yaw: number,
  centerX: number, centerY: number, scale: number,
  isActive: boolean, colors: any
) => {
  const wheelWidth = 60;  // Width of wheel
  const wheelLen = 240;   // Diameter of wheel
  const pos = projectPoint(x, y, z, type, centerX, centerY, scale);

  if (type === 'iso') {
    // ISO: Draw wheel as a disk seen from an angle
    // Wheel lies in Y-Z plane (width along Y, diameter along Z-X plane)
    return (
      <g transform={`rotate(${-yaw}, ${pos.x}, ${pos.y})`}>
        {/* Tire - as an ellipse representing the wheel disk */}
        <ellipse cx={pos.x} cy={pos.y} rx={wheelLen/2 * scale * 0.6} ry={wheelWidth/2 * scale}
                 fill="#374151" stroke={isActive ? colors.axisZ : '#4b5563'} strokeWidth={2} />
        {/* Hub cap */}
        <ellipse cx={pos.x} cy={pos.y} rx={30 * scale} ry={20 * scale}
                 fill={isActive ? colors.axisZ : '#6b7280'} />
        {/* Mount center */}
        <circle cx={pos.x} cy={pos.y} r={8 * scale} fill="#9ca3af" />
      </g>
    );
  } else {
    // Top view: Wheel seen from above - as an ellipse
    return (
      <g transform={`rotate(${-yaw}, ${pos.x}, ${pos.y})`}>
        {/* Tire - full wheel width visible from top */}
        <ellipse cx={pos.x} cy={pos.y} rx={wheelWidth/2 * scale} ry={wheelLen/2 * scale}
                 fill="#374151" stroke={isActive ? colors.axisZ : '#4b5563'} strokeWidth={2} />
        {/* Hub cap */}
        <ellipse cx={pos.x} cy={pos.y} rx={20 * scale} ry={30 * scale}
                 fill={isActive ? colors.axisZ : '#6b7280'} />
        {/* Axle center dot */}
        <circle cx={pos.x} cy={pos.y} r={6} fill="#9ca3af" />
      </g>
    );
  }
};

/**
 * LiDAR visualization - as sensor head with scan indication
 */
const renderLidar = (
  type: 'iso' | 'top' | 'front' | 'side',
  x: number, y: number, z: number, yaw: number,
  centerX: number, centerY: number, scale: number,
  isActive: boolean, colors: any, fovRange: number = 800
) => {
  const pos = projectPoint(x, y, z, type, centerX, centerY, scale);

  if (type === 'iso') {
    // ISO: Sensor as a box on top
    const size = 50 * scale;
    return (
      <g>
        {/* Sensor base - 增大更明显 */}
        <rect x={pos.x - size/2} y={pos.y - size/2} width={size} height={size}
              fill={isActive ? colors.axisZ : '#ff7b72'} opacity={0.9} rx={4} />
        {/* Sensor border */}
        <rect x={pos.x - size/2} y={pos.y - size/2} width={size} height={size}
              fill="none" stroke={isActive ? colors.axisZ : '#ff7b72'} strokeWidth={3} rx={4} />
        {/* Sensor top - spinning head representation */}
        <ellipse cx={pos.x} cy={pos.y - size/2} rx={size * 0.7} ry={size * 0.35}
                 fill="#374151" stroke={isActive ? colors.axisZ : '#ff7b72'} strokeWidth={2} />
        {/* Center indicator - 更大更明显 */}
        <circle cx={pos.x} cy={pos.y} r={10 * scale} fill="#fff" />
        <circle cx={pos.x} cy={pos.y} r={6 * scale} fill={isActive ? colors.axisZ : '#ff7b72'} />
        {/* Scanning beam effect (ISO view) */}
        <line x1={pos.x} y1={pos.y - size/2}
              x2={pos.x + 30 * scale} y2={pos.y - size * 0.8}
              stroke="#ff7b72" strokeWidth={3} opacity={0.6} />
      </g>
    );
  } else {
    // Top view: Show FOV cone
    const segments = 24;
    const startRad = (-yaw - 135) * Math.PI / 180; // 270 deg FOV
    const pts = [pos];

    for (let i = 0; i <= segments; i++) {
      const rad = startRad + (i / segments) * (270 * Math.PI / 180);
      const dist = fovRange * scale;
      pts.push({
        x: centerX + (x + Math.cos(rad) * fovRange) * scale,
        y: centerY - (y + Math.sin(rad) * fovRange) * scale
      });
    }

    const pointsStr = pts.map(p => `${p.x},${p.y}`).join(' ');

    return (
      <g>
        {/* FOV wedge - 增加填充透明度 */}
        <polygon points={pointsStr} fill="#ff7b72" opacity={0.15} stroke="#ff7b72" strokeWidth={2} />
        {/* Scan arc circles - 添加多层扫描线效果 */}
        {[0.3, 0.6, 0.9].map((r, i) => {
          const arcPts = [];
          for (let j = 0; j <= segments; j++) {
            const rad = startRad + (j / segments) * (270 * Math.PI / 180);
            arcPts.push({
              x: centerX + (x + Math.cos(rad) * fovRange * r) * scale,
              y: centerY - (y + Math.sin(rad) * fovRange * r) * scale
            });
          }
          const arcStr = arcPts.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
          return (
            <path key={i} d={arcStr} fill="none" stroke="#ff7b72"
                  strokeWidth={1.5 - i * 0.3} opacity={0.6 - i * 0.2} />
          );
        })}
        {/* Direction line - 加粗 */}
        <line x1={pos.x} y1={pos.y}
              x2={centerX + (x + Math.cos(-yaw * Math.PI/180) * 100) * scale}
              y2={centerY - (y + Math.sin(-yaw * Math.PI/180) * 100) * scale}
              stroke="#ff7b72" strokeWidth={4} />
        {/* Direction line glow */}
        <line x1={pos.x} y1={pos.y}
              x2={centerX + (x + Math.cos(-yaw * Math.PI/180) * 100) * scale}
              y2={centerY - (y + Math.sin(-yaw * Math.PI/180) * 100) * scale}
              stroke="#ff7b72" strokeWidth={8} opacity={0.3} />
        {/* Sensor body - 增大更明显 */}
        <circle cx={pos.x} cy={pos.y} r={22 * scale} fill="#ff7b72" opacity={0.4} />
        <circle cx={pos.x} cy={pos.y} r={22 * scale} fill="none" stroke="#ff7b72" strokeWidth={3} />
        <circle cx={pos.x} cy={pos.y} r={14 * scale} fill={isActive ? colors.axisZ : '#fff'} stroke="#ff7b72" strokeWidth={2} />
        {/* Spinning indicator */}
        <circle cx={pos.x} cy={pos.y} r={18 * scale} fill="none" stroke="#ff7b72" strokeWidth={1.5}
                strokeDasharray="10 5" opacity={0.8} />
        {/* Center dot */}
        <circle cx={pos.x} cy={pos.y} r={6 * scale} fill="#ff7b72" />
      </g>
    );
  }
};

/**
 * Camera visualization
 */
const renderCamera = (
  type: 'iso' | 'top' | 'front' | 'side',
  x: number, y: number, z: number, yaw: number,
  centerX: number, centerY: number, scale: number,
  isActive: boolean, colors: any
) => {
  const pos = projectPoint(x, y, z, type, centerX, centerY, scale);
  const size = 30 * scale;

  if (type === 'iso') {
    return (
      <g transform={`rotate(${-yaw}, ${pos.x}, ${pos.y})`}>
        {/* Camera body */}
        <rect x={pos.x - size/2} y={pos.y - size/2} width={size} height={size * 1.2}
              fill="#ffa657" opacity={0.8} rx={4} />
        {/* Lens */}
        <rect x={pos.x + size/3} y={pos.y - size/4} width={size/3} height={size/2}
              fill="#374151" />
        <circle cx={pos.x + size/2} cy={pos.y} r={6} fill={isActive ? colors.axisZ : '#fff'} />
      </g>
    );
  } else {
    // Top view
    return (
      <g transform={`rotate(${-yaw}, ${pos.x}, ${pos.y})`}>
        {/* FOV cone */}
        <polygon
          points={`${pos.x},${pos.y} ${pos.x + 80*scale},${pos.y - 45*scale} ${pos.x + 80*scale},${pos.y + 45*scale}`}
          fill="#ffa657" opacity={0.1} />
        {/* Camera body */}
        <rect x={pos.x - size/2} y={pos.y - size/2} width={size} height={size}
              fill="#ffa657" opacity={0.8} rx={4} />
        {/* Lens */}
        <circle cx={pos.x + size/3} cy={pos.y} r={8} fill="#374151" />
        <circle cx={pos.x + size/3} cy={pos.y} r={4} fill={isActive ? colors.axisZ : '#fff'} />
      </g>
    );
  }
};

/**
 * Generic component marker
 */
const renderComponentMarker = (
  type: 'iso' | 'top' | 'front' | 'side',
  x: number, y: number, z: number, category: string,
  centerX: number, centerY: number, scale: number,
  isActive: boolean, colors: any
) => {
  const pos = projectPoint(x, y, z, type, centerX, centerY, scale);
  const size = isActive ? 12 : 8;

  const categoryColors: Record<string, string> = {
    SENSOR: '#ff7b72',
    DRIVER: '#ffa657',
    MOTOR: '#4ade80',
    BATTERY: '#a78bfa',
    MAINCPU: colors.axisZ,
    default: colors.textSecondary,
  };

  const color = categoryColors[category] || categoryColors.default;

  return (
    <g>
      <circle cx={pos.x} cy={pos.y} r={size}
              fill={isActive ? colors.axisZ : color}
              stroke={colors.background} strokeWidth={2} />
      {isActive && (
        <circle cx={pos.x} cy={pos.y} r={size + 4}
                fill="none" stroke={colors.axisZ} strokeWidth={2}
                opacity={0.6} />
      )}
    </g>
  );
};

const ViewRenderer: React.FC<ViewProps> = ({ type, width, height, components, identity, activeId, onSelect, theme }) => {
  const isDark = theme !== 'light' && theme !== 'industrial';
  const colors = getThemeColors(isDark);

  const { chassisLength = 1200, chassisWidth = 800, chassisHeight = 400 } = identity;

  // Calculate scale based on view type
  const getScale = () => {
    const maxDim = type === 'iso'
      ? Math.max(chassisLength, chassisWidth, 2000)
      : Math.max(chassisLength, chassisWidth, 1500);
    return Math.min(width, height) / (maxDim * 1.2);
  };
  const scale = getScale();
  const centerX = width / 2;
  const centerY = height / 2;

  // Grid
  const gridSpacing = 500;
  const gridRange = 2500;

  return (
    <svg width={width} height={height}
         style={{ background: colors.background, borderRadius: 8,
                  boxShadow: `inset 0 0 30px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'}` }}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Grid */}
      <g opacity={isDark ? 0.1 : 0.2}>
        {Array.from({ length: Math.ceil(gridRange * 2 / gridSpacing) + 1 }, (_, i) => {
          const v = -gridRange + i * gridSpacing;
          const p1h = projectPoint(v, -gridRange, 0, type, centerX, centerY, scale);
          const p2h = projectPoint(v, gridRange, 0, type, centerX, centerY, scale);
          const p1v = projectPoint(-gridRange, v, 0, type, centerX, centerY, scale);
          const p2v = projectPoint(gridRange, v, 0, type, centerX, centerY, scale);
          return (
            <React.Fragment key={v}>
              <line x1={p1h.x} y1={p1h.y} x2={p2h.x} y2={p2h.y}
                    stroke={colors.grid} strokeWidth={1} />
              <line x1={p1v.x} y1={p1v.y} x2={p2v.x} y2={p2v.y}
                    stroke={colors.grid} strokeWidth={1} />
            </React.Fragment>
          );
        })}
        {/* Center axes */}
        <line x1={projectPoint(0, -gridRange, 0, type, centerX, centerY, scale).x}
              y1={projectPoint(0, -gridRange, 0, type, centerX, centerY, scale).y}
              x2={projectPoint(0, gridRange, 0, type, centerX, centerY, scale).x}
              y2={projectPoint(0, gridRange, 0, type, centerX, centerY, scale).y}
              stroke={colors.axisX} strokeWidth={2} />
        <line x1={projectPoint(-gridRange, 0, 0, type, centerX, centerY, scale).x}
              y1={projectPoint(-gridRange, 0, 0, type, centerX, centerY, scale).y}
              x2={projectPoint(gridRange, 0, 0, type, centerX, centerY, scale).x}
              y2={projectPoint(gridRange, 0, 0, type, centerX, centerY, scale).y}
              stroke={colors.axisY} strokeWidth={2} />
      </g>

      {/* Chassis */}
      {renderChassis(type, chassisWidth, chassisLength, chassisHeight, centerX, centerY, scale, colors)}

      {/* Components - sorted by Z so front objects render on top */}
      {[...components]
        .filter(c => c.category !== 'CHASSIS')
        .sort((a, b) => (a.mountZ || 0) - (b.mountZ || 0))
        .map(c => {
        const isActive = c.id === activeId;
        const { mountX: x = 0, mountY: y = 0, mountZ: z = 0, mountYaw: yaw = 0 } = c;
        const pos = projectPoint(x, y, z, type, centerX, centerY, scale);

        const isWheel = c.type?.toLowerCase().includes('wheel') || c.category === 'DRIVEWHEEL';
        const isLidar = c.type?.toLowerCase().includes('laser') || c.type?.toLowerCase().includes('lidar');
        const isCamera = c.type?.toLowerCase().includes('camera');

        return (
          <g key={c.id} onClick={() => onSelect?.(c.id)} style={{ cursor: 'pointer' }}>
            {/* Component visualization */}
            {isWheel ? (
              renderWheel(type, x, y, z, yaw, centerX, centerY, scale, isActive, colors)
            ) : isLidar ? (
              renderLidar(type, x, y, z, yaw, centerX, centerY, scale, isActive, colors)
            ) : isCamera ? (
              renderCamera(type, x, y, z, yaw, centerX, centerY, scale, isActive, colors)
            ) : (
              renderComponentMarker(type, x, y, z, c.category, centerX, centerY, scale, isActive, colors)
            )}

            {/* Label for active component */}
            {isActive && (
              <text x={pos.x + 15} y={pos.y - 15}
                    fill={colors.axisZ} fontSize={12} fontWeight="bold"
                    style={{ pointerEvents: 'none',
                            stroke: colors.background, strokeWidth: 3, paintOrder: 'stroke' }}>
                {c.alias || c.name}
              </text>
            )}
          </g>
        );
      })}

      {/* View label */}
      <g style={{ pointerEvents: 'none' }}>
        <rect x={12} y={height - 30} width={80} height={18} rx={3}
              fill={isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)'} />
        <text x={18} y={height - 18} fill={colors.textPrimary} fontSize={11}>
          {type === 'iso' ? '轴侧视图' : type === 'top' ? '俯视图' : type === 'front' ? '正视图' : '侧视图'}
        </text>
      </g>
    </svg>
  );
};

interface CoordinateVisualizerProps {
  activeId?: string;
  onSelect?: (id: string) => void;
  viewMode?: 'split' | 'iso';
}

export const CoordinateVisualizer: React.FC<CoordinateVisualizerProps> = ({
  activeId, onSelect, viewMode = 'split'
}) => {
  const { config } = useProjectStore();
  const { components, identity } = config;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [activeView, setActiveView] = useState<'iso' | 'top'>('iso');

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (viewMode === 'iso') {
    return (
      <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'center' }}>
          <Segmented
            value={activeView}
            onChange={(v) => setActiveView(v as typeof activeView)}
            options={[
              { value: 'iso', label: '轴侧' },
              { value: 'top', label: '俯视' },
            ]}
            size="small"
          />
        </div>
        <div style={{ flex: 1, minHeight: 0, padding: '0 12px 12px' }}>
          <ViewRenderer
            type={activeView}
            width={dimensions.width - 24}
            height={dimensions.height - 60}
            components={components}
            identity={identity}
            activeId={activeId}
            onSelect={onSelect}
            theme={currentTheme}
          />
        </div>
      </div>
    );
  }

  // Split view mode - main ISO + top subview
  const subHeight = Math.min(dimensions.height * 0.35, 200);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ flex: '1 1 auto', minHeight: 0 }}>
        <ViewRenderer
          type="iso"
          width={dimensions.width - 24}
          height={dimensions.height - subHeight - 36}
          components={components}
          identity={identity}
          activeId={activeId}
          onSelect={onSelect}
          theme={currentTheme}
        />
      </div>
      <div style={{ height: subHeight, flexShrink: 0 }}>
        <ViewRenderer
          type="top"
          width={dimensions.width - 24}
          height={subHeight}
          components={components}
          identity={identity}
          activeId={activeId}
          onSelect={onSelect}
          theme={currentTheme}
        />
      </div>
    </div>
  );
};
