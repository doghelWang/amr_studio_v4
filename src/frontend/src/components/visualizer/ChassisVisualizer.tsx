import React from 'react';
import { Typography } from 'antd';
import { ComponentConfig } from '../../store/types';

const { Text } = Typography;

interface Props {
  width: number;
  length: number;
  shape: 'BOX' | 'CYLINDER';
  headOffset: number;
  leftOffset: number;
  components?: ComponentConfig[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  previewScale?: number;
  svgSize?: number;
}

export const ChassisVisualizer: React.FC<Props> = ({
  width,
  length,
  shape,
  headOffset,
  leftOffset,
  components = [],
  selectedId,
  onSelect,
  previewScale = 0.12,
  svgSize = 240
}) => {
  const rectWidth = width * previewScale;
  const rectHeight = length * previewScale;
  const centerX = leftOffset * previewScale;
  const centerY = headOffset * previewScale;

  const wheels = components.filter(c => c.category === 'DRIVEWHEEL' || (c.alias || '').includes('轮'));

  return (
    <div style={{
      flex: 1, minHeight: '320px', background: 'var(--bg-main)',
      borderRadius: 8, border: '1px solid var(--border-default)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        <defs>
          <pattern id="grid-chassis" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-default)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-chassis)" />

        <g transform={`translate(${svgSize/2}, ${svgSize/2})`}>
          {shape === 'BOX' ? (
            <rect
              x={-centerX} y={-centerY}
              width={rectWidth} height={rectHeight}
              fill="var(--accent-soft)"
              stroke="var(--accent)"
              strokeWidth="1.5"
              rx="4"
            />
          ) : (
            <ellipse
              cx={rectWidth/2 - centerX} cy={rectHeight/2 - centerY}
              rx={rectWidth/2} ry={rectHeight/2}
              fill="var(--accent-soft)"
              stroke="var(--accent)"
              strokeWidth="1.5"
            />
          )}

          {wheels.map(wheel => {
            const wx = -(wheel.mountY || 0) * previewScale;
            const wy = -(wheel.mountX || 0) * previewScale;
            const isSelected = selectedId === wheel.id;
            const wWidth = 20 * previewScale;
            const wLength = 100 * previewScale;

            return (
              <g
                key={wheel.id}
                transform={`translate(${wx}, ${wy}) rotate(${wheel.mountYaw || 0})`}
                cursor="pointer"
                onClick={() => onSelect?.(wheel.id)}
              >
                <rect
                  x={-wWidth/2} y={-wLength/2}
                  width={wWidth} height={wLength}
                  fill={isSelected ? 'var(--accent)' : 'var(--accent)'}
                  fillOpacity={isSelected ? 1 : 0.6}
                  stroke={isSelected ? 'var(--text-primary)' : 'none'}
                  strokeWidth={isSelected ? 1 : 0}
                  rx="2"
                />
                <text
                  y={wLength/2 + 10}
                  fontSize="8"
                  fill={isSelected ? 'var(--text-primary)' : 'var(--text-muted)'}
                  textAnchor="middle"
                >
                  {wheel.alias}
                </text>
              </g>
            );
          })}

          <g transform="translate(0, 0)">
            <line x1="-15" y1="0" x2="15" y2="0" stroke="var(--red)" strokeWidth="2" strokeOpacity="0.8" />
            <line x1="0" y1="-15" x2="0" y2="15" stroke="var(--red)" strokeWidth="2" strokeOpacity="0.8" />
            <circle r="4" fill="var(--red)" />
            <text x="8" y="-8" fill="var(--red)" fontSize="9" fontWeight="bold">Motion Center</text>
          </g>
        </g>

        <g transform={`translate(${svgSize/2}, 25)`}>
          <text fill="var(--success)" fontSize="10" textAnchor="middle" fontWeight="bold">FRONT (Head)</text>
          <path d="M -5 5 L 0 0 L 5 5" fill="none" stroke="var(--success)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};
