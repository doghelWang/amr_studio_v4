import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Card, Col, Empty, Input, InputNumber, Row, Select, Space, Tag, Tooltip, Typography, Radio } from 'antd';
import {
  ApiOutlined,
  ApartmentOutlined,
  BranchesOutlined,
  ClusterOutlined,
  CrownOutlined,
  DisconnectOutlined,
  NodeIndexOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import type { ComponentConfig, InterfaceConfig, ElectricalConnection } from '../../store/types';
import { buildConnections } from '../../store/types';

const { Text, Title } = Typography;

const ConnectionList: React.FC<{ connections: ElectricalConnection[] }> = ({ connections }) => {
  if (connections.length === 0) {
    return <Empty description="当前没有建立任何电气连接关系" />;
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {connections.map(conn => {
        const hasError = conn.diagnostics.length > 0;
        return (
          <div
            key={conn.id}
            style={{
              padding: 16,
              borderRadius: 16,
              border: hasError ? '1px solid var(--danger)' : '1px solid var(--border-default)',
              background: hasError ? 'rgba(255,77,79,0.03)' : 'var(--bg-card)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <Space>
                <Tag color="blue" style={{ margin: 0, fontWeight: 600 }}>{conn.interfaceType}</Tag>
                <Tag style={{ margin: 0, textTransform: 'capitalize' }}>{conn.kind.replace('_', ' ')}</Tag>
              </Space>
              {hasError && (
                <Tag color="error" style={{ margin: 0 }}>有异常</Tag>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              {/* Source */}
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>源组件 (Source)</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginTop: 4 }}>
                  {conn.sourceComponentName}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  端口: {conn.sourceInterfaceKey}
                </div>
              </div>

              {/* Direction Indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px' }}>
                <span style={{ fontSize: 20, color: 'var(--accent)' }}>
                  {conn.direction === 'source_to_target' ? '→' : conn.direction === 'target_to_source' ? '←' : '↔'}
                </span>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {conn.direction.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Target */}
              <div style={{ flex: 1, minWidth: 150, textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>目标组件 (Target)</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginTop: 4 }}>
                  {conn.targetComponentName}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  端口: {conn.targetInterfaceKey}
                </div>
              </div>
            </div>

            {hasError && (
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(255,77,79,0.06)',
                  border: '1px solid rgba(255,77,79,0.15)',
                  fontSize: 12,
                  color: 'var(--danger)',
                  display: 'grid',
                  gap: 4
                }}
              >
                {conn.diagnostics.map((d, index) => (
                  <div key={index}>• {d}</div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

type BusFamilyKey = 'CAN' | 'ETH' | 'RS485';

type InterfaceNode = {
  component: ComponentConfig;
  iface: InterfaceConfig;
};

type BusRoot = InterfaceNode;
type CanvasHit = { x: number; y: number; width: number; height: number; interfaceUuid: string };

const BUS_FAMILIES: Array<{ key: BusFamilyKey; label: string; match: string[]; color: string; protocol: string }> = [
  { key: 'CAN', label: 'CAN Bus', match: ['CAN'], color: '#d9a441', protocol: 'CANopen / CAN' },
  { key: 'ETH', label: 'Ethernet', match: ['ETH', 'ETHERNET', 'NETWORK'], color: '#58a6ff', protocol: 'Ethernet / TCP-IP' },
  { key: 'RS485', label: 'RS485 / Serial', match: ['RS485', 'RS232', 'UART', 'SERIAL'], color: '#58c98d', protocol: 'Modbus RTU / Serial' },
];

const MASTER_CATEGORIES = ['MAINCPU', 'INTERGRATEDCONTROLLER', 'CONTROL', 'IO_BOARD'];

const getBusFamily = (type?: string): BusFamilyKey | null => {
  const upper = (type || '').toUpperCase();
  const family = BUS_FAMILIES.find(item => item.match.some(match => upper.includes(match)));
  return family?.key || null;
};

const getFamilyMeta = (family: BusFamilyKey) => BUS_FAMILIES.find(item => item.key === family)!;

const isMasterComponent = (component: ComponentConfig) => MASTER_CATEGORIES.includes(component.category);

const getComponentName = (component: ComponentConfig) => component.alias || component.name;

const shortenComponentName = (component: ComponentConfig, maxLength = 18) => {
  const raw = getComponentName(component).replace(/\s+/g, ' ').trim();
  if (raw.length <= maxLength) return raw;

  const preferred = [component.name, component.srcName, component.type].find(Boolean);
  if (preferred && preferred.length <= maxLength) return preferred;

  return `${raw.slice(0, maxLength - 1)}…`;
};

const collectChildren = (components: ComponentConfig[], parentInterfaceUuid: string, family: BusFamilyKey): InterfaceNode[] => {
  const children: InterfaceNode[] = [];
  components.forEach(component => {
    (component.interfaces || []).forEach(iface => {
      if (getBusFamily(iface.type) !== family) return;
      if ((iface.linkedInterfaceUuid || []).includes(parentInterfaceUuid)) {
        children.push({ component, iface });
      }
    });
  });
  return children.sort((a, b) => getComponentName(a.component).localeCompare(getComponentName(b.component), 'zh-CN'));
};

const findInterfaceNode = (components: ComponentConfig[], interfaceUuid?: string | null): InterfaceNode | undefined => {
  if (!interfaceUuid) return undefined;
  for (const component of components) {
    const iface = (component.interfaces || []).find(item => item.interfaceUuid === interfaceUuid);
    if (iface) return { component, iface };
  }
  return undefined;
};

const getInterfaceRuntimeLabel = (iface: InterfaceConfig) => {
  const params = (iface.interfaceParams || {}) as Record<string, any>;
  const parts: string[] = [];

  if (iface.type === 'CAN') {
    parts.push(`Baud ${(params.baudRate || 500000) / 1000}k`);
    if (params.canId !== undefined) parts.push(`Node ${params.canId}`);
  } else if (['ETH', 'ETHERNET', 'NETWORK'].includes(iface.type)) {
    parts.push(params.ipAddress || '192.168.1.10');
  } else if (['RS485', 'RS232', 'SERIAL'].includes(iface.type)) {
    parts.push(`Baud ${params.baudRate || 115200}`);
    if (params.stationId !== undefined) parts.push(`Addr ${params.stationId}`);
  }

  return parts.length ? parts.join(' · ') : '未配置运行参数';
};

const BusStationCard: React.FC<{
  family: BusFamilyKey;
  node: InterfaceNode;
  components: ComponentConfig[];
  rootInterfaceUuid: string;
  depth?: number;
  selectedInterfaceUuid?: string;
  onSelect: (ifaceUuid: string) => void;
}> = ({ family, node, components, rootInterfaceUuid, depth = 0, selectedInterfaceUuid, onSelect }) => {
  const { linkInterface } = useProjectStore();
  const familyMeta = getFamilyMeta(family);
  const children = useMemo(
    () => collectChildren(components, node.iface.interfaceUuid, family),
    [components, node.iface.interfaceUuid, family]
  );

  const attachOptions = useMemo(() => {
    return components.flatMap(component =>
      (component.interfaces || [])
        .filter(iface => {
          if (getBusFamily(iface.type) !== family) return false;
          if ((iface.linkedInterfaceUuid || []).length > 0) return false;
          if (iface.interfaceUuid === rootInterfaceUuid) return false;
          if (iface.interfaceUuid === node.iface.interfaceUuid) return false;
          if (isMasterComponent(component)) return false;
          return true;
        })
        .map(iface => ({
          label: `${getComponentName(component)} · ${iface.key}`,
          value: `${component.id}:${iface.interfaceUuid}`,
        }))
    );
  }, [components, family, node.iface.interfaceUuid, rootInterfaceUuid]);

  const isSelected = selectedInterfaceUuid === node.iface.interfaceUuid;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div
        onClick={() => onSelect(node.iface.interfaceUuid)}
        style={{
          borderRadius: 16,
          border: isSelected ? `1px solid ${familyMeta.color}` : '1px solid var(--border-default)',
          background: isSelected
            ? `linear-gradient(180deg, ${familyMeta.color}14, transparent), var(--bg-card-strong)`
            : 'var(--bg-card)',
          boxShadow: isSelected ? `0 0 0 4px ${familyMeta.color}14` : 'var(--shadow-sm)',
          cursor: 'pointer',
          padding: 12,
          minWidth: 156,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div>
            <Space size={6} wrap>
              <Tag color={depth === 0 ? 'gold' : 'blue'} style={{ margin: 0 }}>
                {depth === 0 ? 'MASTER' : 'SLAVE'}
              </Tag>
              <Tag style={{ margin: 0, background: `${familyMeta.color}20`, border: `1px solid ${familyMeta.color}44`, color: 'var(--text-secondary)' }}>
                {node.iface.key}
              </Tag>
            </Space>
            <Tooltip title={getComponentName(node.component)}>
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-bright)', lineHeight: 1.2 }}>
                {shortenComponentName(node.component)}
              </div>
            </Tooltip>
            <div style={{ marginTop: 4, fontSize: 11, color: familyMeta.color }}>
              {node.iface.type}
            </div>
          </div>

          {depth > 0 && (
            <Button
              size="small"
              danger
              icon={<DisconnectOutlined />}
              onClick={(event) => {
                event.stopPropagation();
                linkInterface(node.component.id, node.iface.interfaceUuid, null);
              }}
            >
              断开
            </Button>
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <Select
            size="small"
            placeholder="挂接下级"
            options={attachOptions}
            allowClear
            onClick={event => event.stopPropagation()}
            onChange={(value) => {
              if (!value) return;
              const [componentId, ifaceUuid] = value.split(':');
              linkInterface(componentId, ifaceUuid, node.iface.interfaceUuid);
            }}
          />
        </div>
      </div>

      {children.length > 0 && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', paddingLeft: 28 }}>
          {children.map(child => (
            <div key={child.iface.interfaceUuid} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div
                style={{
                  width: 28,
                  height: 2,
                  borderRadius: 999,
                  background: familyMeta.color,
                  boxShadow: `0 0 12px ${familyMeta.color}55`,
                }}
              />
              <BusStationCard
                family={family}
                node={child}
                components={components}
                rootInterfaceUuid={rootInterfaceUuid}
                depth={depth + 1}
                selectedInterfaceUuid={selectedInterfaceUuid}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CanBusCanvas: React.FC<{
  root: BusRoot;
  children: InterfaceNode[];
  selectedInterfaceUuid?: string;
  onSelect: (ifaceUuid: string) => void;
}> = ({ root, children, selectedInterfaceUuid, onSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hitboxesRef = useRef<CanvasHit[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    hitboxesRef.current = [];

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#101a27';
    ctx.fillRect(0, 0, width, height);

    const masterBox = { x: 34, y: 26, width: 184, height: 86 };
    const busY = 132;
    const busStartX = masterBox.x + masterBox.width + 20;
    const busEndX = width - 42;

    const drawRounded = (x: number, y: number, w: number, h: number, r: number, fill: string, stroke: string, lineWidth = 1) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    };

    const drawLabel = (text: string, x: number, y: number, color: string, font = '12px sans-serif') => {
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    };

    drawRounded(masterBox.x, masterBox.y, masterBox.width, masterBox.height, 16,
      selectedInterfaceUuid === root.iface.interfaceUuid ? 'rgba(217,164,65,0.16)' : 'rgba(255,255,255,0.03)',
      selectedInterfaceUuid === root.iface.interfaceUuid ? '#d9a441' : 'rgba(255,255,255,0.12)',
      1.5
    );
    drawLabel('MASTER', masterBox.x + 14, masterBox.y + 22, '#f4c55d', 'bold 11px sans-serif');
    drawLabel(root.iface.key, masterBox.x + 86, masterBox.y + 22, '#c7d2e0', '11px sans-serif');
    drawLabel(shortenComponentName(root.component, 20), masterBox.x + 14, masterBox.y + 48, '#ffffff', 'bold 13px sans-serif');
    drawLabel('CAN Bus Controller', masterBox.x + 14, masterBox.y + 68, '#d9a441', '11px sans-serif');
    hitboxesRef.current.push({ ...masterBox, interfaceUuid: root.iface.interfaceUuid });

    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = 7;
    const gradient = ctx.createLinearGradient(busStartX, busY, busEndX, busY);
    gradient.addColorStop(0, 'rgba(217,164,65,1)');
    gradient.addColorStop(1, 'rgba(217,164,65,0.45)');
    ctx.strokeStyle = gradient;
    ctx.moveTo(busStartX, busY);
    ctx.lineTo(busEndX, busY);
    ctx.stroke();

    drawLabel(`Shared Line · ${root.iface.key}`, busEndX - 124, busY - 18, '#d3b67a', '11px sans-serif');

    const gap = children.length > 0 ? (busEndX - (busStartX + 48)) / (children.length + 1) : 0;
    children.forEach((child, index) => {
      const anchorX = busStartX + 48 + gap * (index + 1);
      const nodeBox = { x: anchorX - 72, y: 154, width: 144, height: 72 };

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#d9a441';
      ctx.moveTo(anchorX, busY);
      ctx.lineTo(anchorX, nodeBox.y);
      ctx.stroke();

      drawRounded(
        nodeBox.x,
        nodeBox.y,
        nodeBox.width,
        nodeBox.height,
        14,
        selectedInterfaceUuid === child.iface.interfaceUuid ? 'rgba(217,164,65,0.14)' : 'rgba(255,255,255,0.03)',
        selectedInterfaceUuid === child.iface.interfaceUuid ? '#d9a441' : 'rgba(255,255,255,0.12)',
        1.2
      );
      drawLabel('NODE', nodeBox.x + 12, nodeBox.y + 20, '#6bb2ff', 'bold 10px sans-serif');
      drawLabel(child.iface.key, nodeBox.x + 54, nodeBox.y + 20, '#c7d2e0', '10px sans-serif');
      drawLabel(shortenComponentName(child.component, 18), nodeBox.x + 12, nodeBox.y + 42, '#ffffff', 'bold 12px sans-serif');
      drawLabel('CAN member', nodeBox.x + 12, nodeBox.y + 60, '#d9a441', '10px sans-serif');
      hitboxesRef.current.push({ ...nodeBox, interfaceUuid: child.iface.interfaceUuid });
    });
  }, [children, root, selectedInterfaceUuid]);

  return (
    <canvas
      ref={canvasRef}
      width={920}
      height={250}
      onClick={(event) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        const hit = hitboxesRef.current.find(box => x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height);
        if (hit) onSelect(hit.interfaceUuid);
      }}
      style={{
        width: '100%',
        height: '250px',
        display: 'block',
        borderRadius: 18,
        border: '1px solid var(--border-default)',
        background: '#101a27',
        cursor: 'pointer',
      }}
    />
  );
};

const CanRailCard: React.FC<{
  root: BusRoot;
  components: ComponentConfig[];
  selectedInterfaceUuid?: string;
  onSelectInterface: (ifaceUuid: string) => void;
}> = ({ root, components, selectedInterfaceUuid, onSelectInterface }) => {
  const { linkInterface } = useProjectStore();
  const family = 'CAN' as const;
  const children = useMemo(
    () => collectChildren(components, root.iface.interfaceUuid, family),
    [components, root.iface.interfaceUuid]
  );
  const selectedChild = children.find(child => child.iface.interfaceUuid === selectedInterfaceUuid);
  const attachOptions = useMemo(() => {
    return components.flatMap(component =>
      (component.interfaces || [])
        .filter(iface => {
          if (getBusFamily(iface.type) !== family) return false;
          if ((iface.linkedInterfaceUuid || []).length > 0) return false;
          if (iface.interfaceUuid === root.iface.interfaceUuid) return false;
          if (isMasterComponent(component)) return false;
          return true;
        })
        .map(iface => ({
          label: `${getComponentName(component)} · ${iface.key}`,
          value: `${component.id}:${iface.interfaceUuid}`,
        }))
    );
  }, [components, root.iface.interfaceUuid]);

  return (
    <Card
      styles={{ body: { padding: 18 } }}
      style={{
        borderRadius: 22,
        border: '1px solid rgba(217,164,65,0.28)',
        background: 'linear-gradient(180deg, rgba(217,164,65,0.12), transparent), var(--bg-card)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Space>
          <CrownOutlined style={{ color: 'gold' }} />
          <Tooltip title={getComponentName(root.component)}>
            <Text strong>{shortenComponentName(root.component, 22)}</Text>
          </Tooltip>
        </Space>
        <Tag style={{ margin: 0, background: 'rgba(217,164,65,0.12)', border: '1px solid rgba(217,164,65,0.3)', color: 'var(--text-secondary)' }}>
          Shared Line · {root.iface.key}
        </Tag>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        <CanBusCanvas
          root={root}
          children={children}
          selectedInterfaceUuid={selectedInterfaceUuid}
          onSelect={onSelectInterface}
        />

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 220 }}>
            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>加入共享 CAN 成员</Text>
            <Select
              size="small"
              placeholder="选择 CAN 节点"
              options={attachOptions}
              allowClear
              onChange={(value) => {
                if (!value) return;
                const [componentId, ifaceUuid] = value.split(':');
                linkInterface(componentId, ifaceUuid, root.iface.interfaceUuid);
              }}
            />
          </div>

          {selectedChild && (
            <Button
              danger
              icon={<DisconnectOutlined />}
              onClick={() => linkInterface(selectedChild.component.id, selectedChild.iface.interfaceUuid, null)}
            >
              断开选中成员
            </Button>
          )}
        </div>

        {children.length === 0 && (
          <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-hover)', color: 'var(--text-muted)', fontSize: 12 }}>
            这是一条共享 CAN 总线。节点并联挂接在同一条线上，而不是形成严格的主从级联。
          </div>
        )}
      </div>
    </Card>
  );
};

const PlcRailCard: React.FC<{
  family: BusFamilyKey;
  root: BusRoot;
  components: ComponentConfig[];
  selectedInterfaceUuid?: string;
  onSelectInterface: (ifaceUuid: string) => void;
}> = ({ family, root, components, selectedInterfaceUuid, onSelectInterface }) => {
  if (family === 'CAN') {
    return (
      <CanRailCard
        root={root}
        components={components}
        selectedInterfaceUuid={selectedInterfaceUuid}
        onSelectInterface={onSelectInterface}
      />
    );
  }

  const familyMeta = getFamilyMeta(family);
  const children = useMemo(
    () => collectChildren(components, root.iface.interfaceUuid, family),
    [components, root.iface.interfaceUuid, family]
  );

  return (
    <Card
      styles={{ body: { padding: 18 } }}
      style={{
        borderRadius: 22,
        border: `1px solid ${familyMeta.color}28`,
        background: `linear-gradient(180deg, ${familyMeta.color}12, transparent), var(--bg-card)`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Space>
          <CrownOutlined style={{ color: 'gold' }} />
          <Tooltip title={getComponentName(root.component)}>
            <Text strong>{shortenComponentName(root.component, 22)}</Text>
          </Tooltip>
        </Space>
        <Tag style={{ margin: 0, background: `${familyMeta.color}1c`, border: `1px solid ${familyMeta.color}33`, color: 'var(--text-secondary)' }}>
          Rail · {root.iface.key}
        </Tag>
      </div>

      <div
        style={{
          borderRadius: 16,
          padding: 16,
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', overflowX: 'auto', paddingBottom: 4 }}>
          <BusStationCard
            family={family}
            node={root}
            components={components}
            rootInterfaceUuid={root.iface.interfaceUuid}
            selectedInterfaceUuid={selectedInterfaceUuid}
            onSelect={onSelectInterface}
          />
        </div>

        {children.length === 0 && (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: 'var(--bg-hover)', color: 'var(--text-muted)', fontSize: 12 }}>
            这条总线还没有挂接从站。像 PLC 组网一样，从当前主站端口开始逐级挂接设备。
          </div>
        )}
      </div>
    </Card>
  );
};

const PortParamPanel: React.FC<{
  node?: InterfaceNode;
  family: BusFamilyKey;
  components: ComponentConfig[];
}> = ({ node, family, components }) => {
  const { updateInterfaceParams } = useProjectStore();

  if (!node) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="从左侧总线轨道中选择一个端口" />;
  }

  const params = (node.iface.interfaceParams || {}) as Record<string, any>;
  const upstreamNode = findInterfaceNode(components, (node.iface.linkedInterfaceUuid || [])[0]);
  const downstreamNodes = collectChildren(components, node.iface.interfaceUuid, family);

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div>
        <Text type="secondary" style={{ fontSize: 11 }}>当前端口</Text>
        <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700, color: 'var(--text-bright)' }}>
          <Tooltip title={getComponentName(node.component)}>
            <span>{shortenComponentName(node.component, 24)}</span>
          </Tooltip>
        </div>
        <div style={{ marginTop: 4, color: 'var(--text-muted)', fontSize: 12 }}>
          {node.iface.key} · {node.iface.type}
        </div>
      </div>

      {(family === 'CAN' || family === 'RS485') && (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>波特率</Text>
          <Select
            style={{ width: '100%' }}
            value={params.baudRate || (family === 'CAN' ? 500000 : 115200)}
            onChange={value => updateInterfaceParams(node.component.id, node.iface.interfaceUuid, { baudRate: value })}
            options={family === 'CAN'
              ? [
                  { label: '125k', value: 125000 },
                  { label: '250k', value: 250000 },
                  { label: '500k', value: 500000 },
                  { label: '1M', value: 1000000 },
                ]
              : [
                  { label: '9600', value: 9600 },
                  { label: '19200', value: 19200 },
                  { label: '38400', value: 38400 },
                  { label: '115200', value: 115200 },
                ]}
          />
        </div>
      )}

      {family === 'CAN' && (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>节点 ID</Text>
          <InputNumber
            style={{ width: '100%' }}
            value={params.canId ?? 0}
            min={0}
            max={2047}
            onChange={value => updateInterfaceParams(node.component.id, node.iface.interfaceUuid, { canId: value ?? 0 })}
          />
        </div>
      )}

      {family === 'RS485' && (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>站号</Text>
          <InputNumber
            style={{ width: '100%' }}
            value={params.stationId ?? 1}
            min={1}
            max={247}
            onChange={value => updateInterfaceParams(node.component.id, node.iface.interfaceUuid, { stationId: value ?? 1 })}
          />
        </div>
      )}

      {family === 'ETH' && (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>IP 地址</Text>
          <Input
            value={params.ipAddress || '192.168.1.10'}
            onChange={event => updateInterfaceParams(node.component.id, node.iface.interfaceUuid, { ipAddress: event.target.value })}
          />
        </div>
      )}

      <div style={{ padding: 12, borderRadius: 14, background: 'var(--bg-hover)', border: '1px solid var(--border-default)' }}>
        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>连接关系</Text>
        <div style={{ display: 'grid', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
          <div>
            上联端口: {upstreamNode ? `${shortenComponentName(upstreamNode.component, 20)} · ${upstreamNode.iface.key}` : '未连接'}
          </div>
          <div>
            当前端口: {`${shortenComponentName(node.component, 20)} · ${node.iface.key}`}
          </div>
          <div>
            下联端口: {downstreamNodes.length
              ? downstreamNodes.map(child => `${shortenComponentName(child.component, 18)} · ${child.iface.key}`).join(' / ')
              : '无下级'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const WiringStep: React.FC<{ onExport?: () => void }> = () => {
  const { config } = useProjectStore();
  const components = config.components as ComponentConfig[];
  const [family, setFamily] = useState<BusFamilyKey>('CAN');
  const [selectedInterfaceUuid, setSelectedInterfaceUuid] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<'rail' | 'list'>('rail');

  const busSummary = useMemo(() => {
    return BUS_FAMILIES.map(item => ({
      ...item,
      count: components.reduce(
        (total, component) => total + (component.interfaces || []).filter(iface => getBusFamily(iface.type) === item.key).length,
        0
      ),
    }));
  }, [components]);

  const roots = useMemo<BusRoot[]>(() => {
    return components
      .filter(isMasterComponent)
      .flatMap(component =>
        (component.interfaces || [])
          .filter(iface => getBusFamily(iface.type) === family)
          .map(iface => ({ component, iface }))
      );
  }, [components, family]);

  const selectedNode = useMemo(() => {
    if (!selectedInterfaceUuid) return undefined;
    for (const component of components) {
      const iface = (component.interfaces || []).find(item => item.interfaceUuid === selectedInterfaceUuid);
      if (iface) return { component, iface };
    }
    return undefined;
  }, [components, selectedInterfaceUuid]);

  const idleNodes = useMemo(() => {
    return components
      .filter(component => !isMasterComponent(component))
      .flatMap(component =>
        (component.interfaces || [])
          .filter(iface => getBusFamily(iface.type) === family)
          .filter(iface => (iface.linkedInterfaceUuid || []).length === 0)
          .map(iface => ({ component, iface }))
      );
  }, [components, family]);

  const connections = useMemo(() => buildConnections(components), [components]);
  const filteredConnections = useMemo(() => {
    return connections.filter(conn => getBusFamily(conn.interfaceType) === family);
  }, [connections, family]);

  useEffect(() => {
    if (!selectedInterfaceUuid && roots.length) {
      setSelectedInterfaceUuid(roots[0].iface.interfaceUuid);
      return;
    }
    if (selectedInterfaceUuid) {
      const exists = components.some(component => (component.interfaces || []).some(iface => iface.interfaceUuid === selectedInterfaceUuid));
      if (!exists) setSelectedInterfaceUuid(roots[0]?.iface.interfaceUuid);
    }
  }, [components, roots, selectedInterfaceUuid]);

  return (
    <div style={{ padding: '0 8px 14px' }}>
      <div className="section-header" style={{ marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <ApiOutlined />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, fontSize: 20, fontFamily: 'var(--font-display)' }}>
              6. 电气连接拓扑
            </Title>
            <Text type="secondary">
              每个主站端口都是一条独立总线轨道。在此处配置各模块之间的总线拓扑与接口布线。完整的设备接口参数矩阵请见步骤 5。
            </Text>
          </div>
        </div>

        <Space wrap>
          <Radio.Group
            value={viewMode}
            onChange={e => setViewMode(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="small"
            style={{ marginRight: 16 }}
          >
            <Radio.Button value="rail">组态拓扑</Radio.Button>
            <Radio.Button value="list">连接清单</Radio.Button>
          </Radio.Group>

          {busSummary.map(item => (
            <Tag
              key={item.key}
              style={{
                margin: 0,
                padding: '6px 10px',
                borderRadius: 999,
                cursor: 'pointer',
                background: family === item.key ? `${item.color}22` : 'var(--bg-card)',
                border: family === item.key ? `1px solid ${item.color}55` : '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
              }}
              onClick={() => setFamily(item.key)}
            >
              {item.label} · {item.count}
            </Tag>
          ))}
        </Space>
      </div>

      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 18 }}
        message="PLC 组态逻辑"
        description="左侧每张轨道卡代表一条主站总线资源。把从站端口挂到上级站点后，就形成 master → slave → slave of slave 的链路；页面只编辑现有 linkedInterfaceUuid 与 interfaceParams，不改后端 schema。"
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={16}>
          <Card styles={{ body: { padding: 18 } }}>
            {viewMode === 'rail' ? (
              <>
                <Space style={{ marginBottom: 16 }}>
                  <BranchesOutlined style={{ color: getFamilyMeta(family).color }} />
                  <Text strong>{getFamilyMeta(family).label} 主站轨道</Text>
                  <Tag style={{ margin: 0 }}>{getFamilyMeta(family).protocol}</Tag>
                </Space>

                {roots.length ? (
                  <div style={{ display: 'grid', gap: 16 }}>
                    {roots.map(root => (
                      <PlcRailCard
                        key={root.iface.interfaceUuid}
                        family={family}
                        root={root}
                        components={components}
                        selectedInterfaceUuid={selectedInterfaceUuid}
                        onSelectInterface={setSelectedInterfaceUuid}
                      />
                    ))}
                  </div>
                ) : (
                  <Empty description={`当前没有 ${getFamilyMeta(family).label} 主站端口`} />
                )}
              </>
            ) : (
              <>
                <Space style={{ marginBottom: 16 }}>
                  <UnorderedListOutlined style={{ color: getFamilyMeta(family).color }} />
                  <Text strong>{getFamilyMeta(family).label} 连接清单</Text>
                  <Tag style={{ margin: 0 }}>{filteredConnections.length} 条连接</Tag>
                </Space>
                <ConnectionList connections={filteredConnections} />
              </>
            )}
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Space direction="vertical" size={18} style={{ width: '100%' }}>
            <Card styles={{ body: { padding: 16 } }}>
              <Space style={{ marginBottom: 10 }}>
                <ApartmentOutlined style={{ color: 'var(--accent)' }} />
                <Text strong>未入网设备池</Text>
              </Space>
              {idleNodes.length ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  {idleNodes.map(node => (
                    <button
                      key={node.iface.interfaceUuid}
                      onClick={() => setSelectedInterfaceUuid(node.iface.interfaceUuid)}
                      style={{
                        textAlign: 'left',
                        padding: 12,
                        borderRadius: 14,
                        border: selectedInterfaceUuid === node.iface.interfaceUuid ? '1px solid var(--border-accent)' : '1px solid var(--border-default)',
                        background: selectedInterfaceUuid === node.iface.interfaceUuid ? 'var(--accent-soft)' : 'var(--bg-hover)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      <Tooltip title={getComponentName(node.component)}>
                        <div style={{ fontWeight: 700 }}>{shortenComponentName(node.component, 22)}</div>
                      </Tooltip>
                      <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                        {node.iface.key} · {node.iface.type}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前族的从站端口都已入网" />
              )}
            </Card>

            <Card styles={{ body: { padding: 16 } }}>
              <Space style={{ marginBottom: 10 }}>
                <SettingOutlined style={{ color: 'var(--warning)' }} />
                <Text strong>端口参数面板</Text>
              </Space>
              <PortParamPanel node={selectedNode} family={family} components={components} />
            </Card>

            <Card styles={{ body: { padding: 16 } }}>
              <Space style={{ marginBottom: 10 }}>
                <ClusterOutlined style={{ color: getFamilyMeta(family).color }} />
                <Text strong>诊断摘要</Text>
              </Space>
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ padding: 12, borderRadius: 14, background: 'var(--bg-hover)', border: '1px solid var(--border-default)' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>主站轨道数</Text>
                  <div style={{ marginTop: 4, fontSize: 20, fontFamily: 'var(--font-display)', color: 'var(--text-bright)' }}>
                    {roots.length}
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 14, background: 'var(--bg-hover)', border: '1px solid var(--border-default)' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>未入网端口</Text>
                  <div style={{ marginTop: 4, fontSize: 20, fontFamily: 'var(--font-display)', color: 'var(--text-bright)' }}>
                    {idleNodes.length}
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 14, background: 'var(--bg-hover)', border: '1px solid var(--border-default)' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>当前协议</Text>
                  <div style={{ marginTop: 4, fontSize: 15, color: getFamilyMeta(family).color }}>
                    {getFamilyMeta(family).protocol}
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 14, background: 'var(--bg-hover)', border: '1px solid var(--border-default)' }}>
                  <Space style={{ marginBottom: 6 }}>
                    <NodeIndexOutlined style={{ color: 'var(--accent)' }} />
                    <Text strong style={{ fontSize: 12 }}>设计规则</Text>
                  </Space>
                  <div style={{ display: 'grid', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <div>1. 主站端口是总线起点，不是普通设备节点。</div>
                    <div>2. 从站始终挂到某个上级端口，形成分层链路。</div>
                    <div>3. 总线参数在这里配置，设备属性仍在原有组件模型中维护。</div>
                  </div>
                </div>
              </div>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default WiringStep;
