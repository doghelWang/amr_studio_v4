import React, { useMemo, useState } from 'react';
import { Row, Col, Table, Card, Select, InputNumber, Input, Tag, Space, Typography, Tooltip, Empty, List } from 'antd';
import { 
  ApiOutlined, 
  SettingOutlined, 
  SearchOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { ComponentConfig, InterfaceConfig, buildConnections } from '../../store/types';

const { Text, Title } = Typography;

interface InterfaceRow {
  key: string; // unique row key
  componentId: string;
  componentName: string;
  interfaceUuid: string;
  interfaceKey: string; // e.g. "CAN_1"
  interfaceType: string; // e.g. "CAN"
  linkedUuids: string[];
  params: Record<string, any>;
}

export const ElectricalInterfaceMatrixStep: React.FC<{ onExport?: () => void }> = () => {
  const { config, updateInterfaceParams } = useProjectStore();
  const components = config.components as ComponentConfig[];
  
  const [selectedCompId, setSelectedCompId] = useState<string | 'ALL'>('ALL');
  const [selectedRowKey, setSelectedRowKey] = useState<string | undefined>();

  // Get all connections to check link status
  const connections = useMemo(() => buildConnections(components), [components]);
  
  // Map of interfaceUuid -> connected count
  const connectionMap = useMemo(() => {
    const map = new Map<string, number>();
    connections.forEach(conn => {
      map.set(conn.sourceInterfaceUuid, (map.get(conn.sourceInterfaceUuid) || 0) + 1);
      if (conn.targetInterfaceUuid) {
        map.set(conn.targetInterfaceUuid, (map.get(conn.targetInterfaceUuid) || 0) + 1);
      }
    });
    return map;
  }, [connections]);

  // Build rows for the interface matrix table
  const allRows = useMemo<InterfaceRow[]>(() => {
    const rows: InterfaceRow[] = [];
    components.forEach(comp => {
      (comp.interfaces || []).forEach(iface => {
        rows.push({
          key: `${comp.id}_${iface.interfaceUuid}`,
          componentId: comp.id,
          componentName: comp.alias || comp.name,
          interfaceUuid: iface.interfaceUuid,
          interfaceKey: iface.key,
          interfaceType: iface.type,
          linkedUuids: iface.linkedInterfaceUuid || [],
          params: iface.interfaceParams || {}
        });
      });
    });
    return rows;
  }, [components]);

  // Filtered rows based on selected component
  const filteredRows = useMemo(() => {
    if (selectedCompId === 'ALL') return allRows;
    return allRows.filter(r => r.componentId === selectedCompId);
  }, [allRows, selectedCompId]);

  // Selected row for details panel
  const selectedRow = useMemo(() => {
    if (!selectedRowKey) return undefined;
    return allRows.find(r => r.key === selectedRowKey);
  }, [allRows, selectedRowKey]);

  // Set default selection on mount or component filter change
  React.useEffect(() => {
    if (filteredRows.length > 0 && (!selectedRowKey || !filteredRows.some(r => r.key === selectedRowKey))) {
      setSelectedRowKey(filteredRows[0].key);
    }
  }, [filteredRows, selectedRowKey]);

  const columns = [
    {
      title: '所属组件',
      dataIndex: 'componentName',
      key: 'componentName',
      ellipsis: true,
      width: '28%',
      render: (text: string) => <Text strong style={{ color: 'var(--text-bright)' }}>{text}</Text>
    },
    {
      title: '接口标识',
      dataIndex: 'interfaceKey',
      key: 'interfaceKey',
      width: '20%'
    },
    {
      title: '物理类型',
      dataIndex: 'interfaceType',
      key: 'interfaceType',
      width: '18%',
      render: (type: string) => {
        const upper = type.toUpperCase();
        let color = 'default';
        if (upper === 'CAN') color = 'blue';
        else if (upper === 'ETH' || upper === 'ETHERNET') color = 'purple';
        else if (upper === 'RS485') color = 'cyan';
        else if (['DI', 'DO'].includes(upper)) color = 'orange';
        else if (['BAT', 'POWER'].includes(upper)) color = 'red';
        return <Tag color={color} style={{ fontSize: 11 }}>{type}</Tag>;
      }
    },
    {
      title: '状态',
      key: 'status',
      width: '18%',
      render: (_: any, record: InterfaceRow) => {
        const connCount = connectionMap.get(record.interfaceUuid) || 0;
        if (connCount > 0) {
          return <Tag color="success" icon={<CheckCircleOutlined />}>已连接</Tag>;
        }
        const isComm = ['CAN', 'RS485', 'ETH', 'UART'].includes(record.interfaceType.toUpperCase());
        return isComm ? (
          <Tag color="warning" icon={<ExclamationCircleOutlined />}>未连线</Tag>
        ) : (
          <Tag color="default">空闲</Tag>
        );
      }
    },
    {
      title: '参数完整度',
      key: 'completeness',
      width: '16%',
      render: (_: any, record: InterfaceRow) => {
        const upperType = record.interfaceType.toUpperCase();
        const params = record.params;
        let complete = true;

        if (upperType === 'CAN') {
          complete = params.canId !== undefined && params.baudRate !== undefined;
        } else if (upperType === 'RS485') {
          complete = params.stationId !== undefined && params.baudRate !== undefined;
        } else if (upperType === 'ETH') {
          complete = params.ipAddress !== undefined && params.ipAddress !== '';
        }

        return complete ? (
          <span style={{ color: '#52c41a', fontSize: 12 }}>完整</span>
        ) : (
          <span style={{ color: '#ff4d4f', fontSize: 12 }}>缺失</span>
        );
      }
    }
  ];

  return (
    <div style={{ padding: '0 8px 14px' }}>
      <div className="section-header" style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <ApiOutlined style={{ fontSize: 18 }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, fontSize: 20, fontFamily: 'var(--font-display)' }}>
              5. 电气接口矩阵
            </Title>
            <Text type="secondary">
              在组网连接前对所有端口进行参数化配置。在此处统一设定各接口的总线波特率、CAN 节点 ID、串口站号或以太网 IP 地址。
            </Text>
          </div>
        </div>
      </div>

      <Row gutter={[20, 20]}>
        {/* Left Side: Component Filters */}
        <Col xs={24} md={6}>
          <Card 
            title={<Space><SearchOutlined /><span>组件筛选</span></Space>}
            styles={{ body: { padding: 12 } }}
            style={{ borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
          >
            <List
              size="small"
              dataSource={[{ id: 'ALL', alias: '全部组件', name: '全部组件', category: 'ALL' }, ...components]}
              renderItem={(comp) => (
                <List.Item
                  onClick={() => setSelectedCompId(comp.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: selectedCompId === comp.id ? 'var(--accent-soft)' : 'transparent',
                    border: 'none',
                    marginBottom: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Text strong={selectedCompId === comp.id} style={{ color: selectedCompId === comp.id ? 'var(--accent)' : 'var(--text-primary)', fontSize: 12 }}>
                    {comp.id === 'ALL' ? comp.alias : (comp.alias || comp.name)}
                  </Text>
                  {comp.category !== 'ALL' && <Tag style={{ margin: 0, fontSize: 9 }}>{comp.category}</Tag>}
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Center: Interfaces Matrix Table */}
        <Col xs={24} md={12}>
          <Card 
            styles={{ body: { padding: 0 } }}
            style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
          >
            <Table
              dataSource={filteredRows}
              columns={columns}
              pagination={false}
              size="small"
              rowClassName={(record) => record.key === selectedRowKey ? 'selected-table-row' : ''}
              onRow={(record) => ({
                onClick: () => setSelectedRowKey(record.key),
                style: { cursor: 'pointer' }
              })}
              locale={{ emptyText: <Empty description="当前组件无电气接口" /> }}
            />
          </Card>
        </Col>

        {/* Right Side: Parameter Editor Panel */}
        <Col xs={24} md={6}>
          <Card
            title={<Space><SettingOutlined /><span>参数配置面板</span></Space>}
            style={{ borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
          >
            {selectedRow ? (
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>所选接口</Text>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-bright)', marginTop: 4 }}>
                    {selectedRow.componentName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    端口: <span style={{ color: 'var(--accent)' }}>{selectedRow.interfaceKey}</span> ({selectedRow.interfaceType})
                  </div>
                </div>

                {/* CAN Parameter Editor */}
                {selectedRow.interfaceType.toUpperCase() === 'CAN' && (
                  <>
                    <div>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>波特率</Text>
                      <Select
                        style={{ width: '100%' }}
                        value={selectedRow.params.baudRate || 500000}
                        onChange={value => updateInterfaceParams(selectedRow.componentId, selectedRow.interfaceUuid, { ...selectedRow.params, baudRate: value })}
                        options={[
                          { label: '125 kbps', value: 125000 },
                          { label: '250 kbps', value: 250000 },
                          { label: '500 kbps', value: 500000 },
                          { label: '1 Mbps', value: 1000000 },
                        ]}
                      />
                    </div>
                    <div>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>节点 ID (canId)</Text>
                      <InputNumber
                        style={{ width: '100%' }}
                        value={selectedRow.params.canId ?? 0}
                        min={0}
                        max={2047}
                        onChange={value => updateInterfaceParams(selectedRow.componentId, selectedRow.interfaceUuid, { ...selectedRow.params, canId: value ?? 0 })}
                      />
                    </div>
                  </>
                )}

                {/* RS485 Parameter Editor */}
                {selectedRow.interfaceType.toUpperCase() === 'RS485' && (
                  <>
                    <div>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>波特率</Text>
                      <Select
                        style={{ width: '100%' }}
                        value={selectedRow.params.baudRate || 115200}
                        onChange={value => updateInterfaceParams(selectedRow.componentId, selectedRow.interfaceUuid, { ...selectedRow.params, baudRate: value })}
                        options={[
                          { label: '9600 bps', value: 9600 },
                          { label: '19200 bps', value: 19200 },
                          { label: '38400 bps', value: 38400 },
                          { label: '115200 bps', value: 115200 },
                        ]}
                      />
                    </div>
                    <div>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>Modbus 从站站号 (stationId)</Text>
                      <InputNumber
                        style={{ width: '100%' }}
                        value={selectedRow.params.stationId ?? 1}
                        min={1}
                        max={247}
                        onChange={value => updateInterfaceParams(selectedRow.componentId, selectedRow.interfaceUuid, { ...selectedRow.params, stationId: value ?? 1 })}
                      />
                    </div>
                  </>
                )}

                {/* ETH Parameter Editor */}
                {(selectedRow.interfaceType.toUpperCase() === 'ETH' || selectedRow.interfaceType.toUpperCase() === 'ETHERNET') && (
                  <div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>IP 地址</Text>
                    <Input
                      value={selectedRow.params.ipAddress || ''}
                      placeholder="例如 192.168.192.10"
                      onChange={event => updateInterfaceParams(selectedRow.componentId, selectedRow.interfaceUuid, { ...selectedRow.params, ipAddress: event.target.value })}
                    />
                  </div>
                )}

                {/* General/Read-Only Info */}
                {!['CAN', 'RS485', 'ETH', 'ETHERNET'].includes(selectedRow.interfaceType.toUpperCase()) && (
                  <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-default)', fontSize: 12, color: 'var(--text-muted)' }}>
                    此接口类型 ({selectedRow.interfaceType}) 不需要设定物理总线参数。
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <div>UUID: <Text code style={{ fontSize: 10 }}>{selectedRow.interfaceUuid.slice(0, 8)}...</Text></div>
                  <div style={{ marginTop: 4 }}>
                    物理连线: {selectedRow.linkedUuids.length > 0 ? (
                      <span style={{ color: '#52c41a' }}>已接入 ({selectedRow.linkedUuids.length} 个引脚)</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>未接线</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="请选择一个接口进行配置" />
            )}
          </Card>
        </Col>
      </Row>

      <style>{`
        .selected-table-row {
          background-color: var(--accent-soft) !important;
        }
        .selected-table-row td {
          border-bottom-color: var(--accent) !important;
        }
      `}</style>
    </div>
  );
};

export default ElectricalInterfaceMatrixStep;
