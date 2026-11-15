import { useMemo, useState } from 'react';
import { buses, ifaceValue, interfacesOf, link, links, mainTypeOf, modules, nameOf, portLabel, unlink, type Port } from '@amr/core';
import { idOf, useStore } from '../store';

const BUS_TYPES = new Set(['CAN', 'RS485', 'RS422', 'ETH']);
const COUNTERPART: Record<string, string> = { DI: 'DO', DO: 'DI', PI: 'PO', PO: 'PI', AI: 'AO', AO: 'AI' };
const show = (v: unknown) => (v === undefined || v === '' ? '—' : String(v));

function Connect() {
  const { project, rev, edit, notify } = useStore();
  const [a, setA] = useState('');
  const [ap, setAp] = useState('');
  const [b, setB] = useState('');
  const [bp, setBp] = useState('');
  const mods = useMemo(() => (project ? modules(project).filter((m) => interfacesOf(m.comp).length) : []), [project, rev]); // eslint-disable-line react-hooks/exhaustive-deps
  const ma = mods.find((m) => idOf(m) === a), mb = mods.find((m) => idOf(m) === b);
  const portA = ma && interfacesOf(ma.comp).find((i) => i.interface_uuid === ap);
  const want = portA ? COUNTERPART[portA.type] ?? portA.type : undefined;
  const targets = mb && want ? interfacesOf(mb.comp).filter((i) => i.type === want) : [];
  const candidates = want ? mods.filter((m) => m !== ma && interfacesOf(m.comp).some((i) => i.type === want)) : [];

  const onConnect = () => {
    const err = edit((p) => link(p, ap, bp));
    if (err) notify('error', err);
    else { notify('ok', 'Connected'); setBp(''); }
  };
  return (
    <div className="connect">
      <b>New connection</b>
      <select value={a} onChange={(e) => { setA(e.target.value); setAp(''); setB(''); setBp(''); }} aria-label="From module">
        <option value="">From module…</option>
        {mods.map((m) => <option key={idOf(m)} value={idOf(m)}>{nameOf(m.comp)}</option>)}
      </select>
      <select value={ap} disabled={!ma} onChange={(e) => { setAp(e.target.value); setB(''); setBp(''); }} aria-label="From port">
        <option value="">Port…</option>
        {ma && interfacesOf(ma.comp).map((i) => <option key={i.interface_uuid} value={i.interface_uuid}>{i.key} ({i.type}){i.linked_interface_uuid.length ? ' · in use' : ''}</option>)}
      </select>
      <span>↔</span>
      <select value={b} disabled={!portA} onChange={(e) => { setB(e.target.value); setBp(''); }} aria-label="To module">
        <option value="">{portA ? (candidates.length ? 'To module…' : `No other module has a ${want} port`) : 'To module…'}</option>
        {candidates.map((m) => <option key={idOf(m)} value={idOf(m)}>{nameOf(m.comp)}</option>)}
      </select>
      <select value={bp} disabled={!mb} onChange={(e) => setBp(e.target.value)} aria-label="To port">
        <option value="">Port…</option>
        {targets.map((i) => <option key={i.interface_uuid} value={i.interface_uuid}>{i.key} ({i.type}){i.linked_interface_uuid.length ? ' · in use' : ''}</option>)}
      </select>
      <button className="primary" disabled={!ap || !bp} onClick={onConnect}>Connect</button>
    </div>
  );
}

export function WiringTab() {
  const { project, rev, edit, select, report } = useStore();
  const data = useMemo(() => {
    if (!project) return null;
    const all = links(project);
    const busList = buses(project).filter((x) => BUS_TYPES.has(x.type)).map((bus) => {
      // the controller's port names the bus
      const head = bus.ports.find((pt) => mainTypeOf(pt.module.comp) === 'mainCPU') ?? bus.ports[0];
      return { type: bus.type, head, ports: [head, ...bus.ports.filter((x) => x !== head)] };
    }).sort((x, y) => x.type.localeCompare(y.type) || portLabel(x.head).localeCompare(portLabel(y.head)));
    const p2p = all.filter((l) => !BUS_TYPES.has(l.a.iface.type));
    return { busList, p2p, all };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, rev]);
  if (!project || !data) return null;

  const flagged = new Set((report?.findings ?? []).filter((f) => f.level !== 'info' && f.path?.startsWith('if/')).map((f) => `${f.module}|${f.path!.split('/')[1]}`));
  const disconnect = (pt: Port) => edit((p) => { for (const u of [...pt.iface.linked_interface_uuid]) unlink(p, pt.iface.interface_uuid, u); });
  const cols = (type: string) => (type === 'CAN' ? ['nodeId', 'baudrate', 'protocol', 'resistor'] : type === 'ETH' ? ['ip', 'port', 'speed'] : ['baudrate', 'protocol', 'dataBits', 'stopBits']);

  return (
    <div className="wiring">
      <Connect />
      {data.all.length === 0 && <p className="empty">No connections yet. Use the form above to connect two ports.</p>}
      {data.busList.map((bus) => (
        <section key={bus.head.iface.interface_uuid} className="bus">
          <h3><span className="tag">{bus.type}</span> {portLabel(bus.head)} <span className="muted">· {bus.ports.length} ports</span></h3>
          <table>
            <thead><tr><th>Port</th>{cols(bus.type).map((c) => <th key={c}>{c}</th>)}<th /></tr></thead>
            <tbody>
              {bus.ports.map((pt) => (
                <tr key={pt.iface.interface_uuid} className={flagged.has(`${nameOf(pt.module.comp)}|${pt.iface.key}`) ? 'bad' : ''}>
                  <td><button className="link" onClick={() => select(idOf(pt.module), 'properties')}>{nameOf(pt.module.comp)}</button>.{pt.iface.key}</td>
                  {cols(bus.type).map((c) => <td key={c}>{show(ifaceValue(pt.iface, c))}</td>)}
                  <td className="right">{pt !== bus.head && <button className="ghost danger" onClick={() => disconnect(pt)}>Disconnect</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
      {data.p2p.length > 0 && (
        <section className="bus">
          <h3>Point-to-point <span className="muted">· {data.p2p.length} links</span></h3>
          <table>
            <thead><tr><th>From</th><th>Type</th><th>To</th><th>Type</th><th /></tr></thead>
            <tbody>
              {data.p2p.map((l) => (
                <tr key={`${l.a.iface.interface_uuid}|${l.b.iface.interface_uuid}`} className={l.reciprocal ? '' : 'bad'}>
                  <td><button className="link" onClick={() => select(idOf(l.a.module), 'properties')}>{nameOf(l.a.module.comp)}</button>.{l.a.iface.key}</td>
                  <td>{l.a.iface.type}</td>
                  <td><button className="link" onClick={() => select(idOf(l.b.module), 'properties')}>{nameOf(l.b.module.comp)}</button>.{l.b.iface.key}</td>
                  <td>{l.b.iface.type}{!l.reciprocal && ' · one end only'}</td>
                  <td className="right"><button className="ghost danger" onClick={() => edit((p) => unlink(p, l.a.iface.interface_uuid, l.b.iface.interface_uuid))}>Disconnect</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
