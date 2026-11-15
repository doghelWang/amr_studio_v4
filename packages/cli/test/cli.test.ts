import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { run } from '../src/main';

const cli = (...args: string[]) => {
  const lines: string[] = [];
  const code = run(args, (s) => lines.push(s));
  return { code, text: lines.join('\n') };
};

describe('amr CLI', () => {
  it('info lists modules and links', () => {
    const { code, text } = cli('info', 'fixtures/mq-q3.cmodel');
    expect(code).toBe(0);
    expect(text).toContain('31 modules');
    expect(text).toMatch(/laser-Front\s+sensor\s+laser\s+WHST/);
    expect(text).toContain('MainController.CAN_2 ↔ servo_driver_L.CAN_1');
  });
  it('params shows a module', () => {
    const { text } = cli('params', 'fixtures/diff-2lidar.cmodel', 'laser-C200');
    expect(text).toMatch(/if\/ETH_1\/param\/ip\s+= 192\.168\.1\.111/);
  });
  it('check exits 1 on errors and 0 on a clean model', () => {
    const bad = cli('check', 'fixtures/diff-2lidar.cmodel');
    expect(bad.code).toBe(1);
    expect(bad.text).toContain('can.nodeId');
    expect(cli('check', 'fixtures/mq-q3.cmodel', '--level', 'error').code).toBe(0);
    const j = JSON.parse(cli('check', 'fixtures/diff-2lidar.cmodel', '--json').text);
    expect(j.errors).toBe(1);
  });
  it('diff reports differences', () => {
    const d = cli('diff', 'fixtures/modelset.cmodel', 'fixtures/modelset-wide.cmodel');
    expect(d.code).toBe(1);
    expect(d.text).toContain('20 difference(s)');
    expect(d.text).toMatch(/wheelSpace\s+603\s+→\s+840/);
    expect(cli('diff', 'fixtures/modelset.cmodel', 'fixtures/modelset.cmodel').code).toBe(0);
  });
  it('set edits a parameter and the result fixes the finding', () => {
    const out = join(mkdtempSync(join(tmpdir(), 'amr-')), 'fixed.cmodel');
    expect(cli('set', 'fixtures/diff-2lidar.cmodel', 'driver-left', 'if/CAN_1/param/nodeId', '3', '-o', out).code).toBe(0);
    expect(readFileSync(out).length).toBeGreaterThan(1000);
    expect(cli('check', out, '--level', 'error').code).toBe(0);
    expect(cli('diff', 'fixtures/diff-2lidar.cmodel', out).text).toContain('1 difference(s)');
  });
  it('explains bad input', () => {
    expect(() => cli('params', 'fixtures/mq-q3.cmodel', 'nope')).toThrow(/No module "nope"/);
    expect(cli('wat').code).toBe(2);
  });
});
