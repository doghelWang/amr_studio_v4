#!/usr/bin/env node
/** `amr` — command-line front end to @amr/core. */
import { writeFileSync } from 'node:fs';
import {
  bindings, diffProjects, findModule, links, mainTypeOf, modules, nameOf, portLabel, productOf, rows, setAttr, subTypeOf,
  toPlain, validate, vendorOf, CmodelError, EditError, type Level,
} from '@amr/core';
import { readCmodel, writeCmodel } from '@amr/core/node';

const USAGE = `amr <command>

  info   <file.cmodel>                         modules, links and function bindings
  params <file.cmodel> <module> [--all]        parameters of one module (--all includes hidden ones)
  check  <file.cmodel> [--json] [--level L]    validate; exit code 1 when there are errors
  diff   <a.cmodel> <b.cmodel> [--json]        semantic differences
  set    <file.cmodel> <module> <path> <value> [-o out.cmodel]   edit one parameter
  json   <file.cmodel> [-o out.json]           dump the decoded model as JSON
`;

const pad = (s: unknown, n: number) => String(s).padEnd(n).slice(0, Math.max(n, String(s).length));
const flag = (args: string[], name: string): boolean => {
  const i = args.indexOf(name);
  if (i >= 0) args.splice(i, 1);
  return i >= 0;
};
const opt = (args: string[], name: string): string | undefined => {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};

export function run(argv: string[], out: (s: string) => void = console.log): number {
  const args = [...argv];
  const cmd = args.shift();
  const need = (n: number) => {
    if (args.length < n) throw new CmodelError(`"${cmd}" needs ${n} argument(s)\n\n${USAGE}`);
  };
  switch (cmd) {
    case 'info': {
      need(1);
      const p = readCmodel(args[0]);
      const mods = modules(p);
      out(`${p.name}: ${mods.length} modules, ${links(p).length} links, ${bindings(p).length} function bindings`);
      out(`files: ${p.desc.map((d) => `${d.name} (${d.type})`).join(', ')}`);
      for (const issue of p.loadIssues) out(`! ${issue}`);
      out('');
      out(`${pad('MODULE', 26)} ${pad('MAIN TYPE', 22)} ${pad('SUB TYPE', 26)} ${pad('VENDOR', 12)} MODEL`);
      for (const m of mods) out(`${pad(nameOf(m.comp), 26)} ${pad(mainTypeOf(m.comp), 22)} ${pad(subTypeOf(m.comp), 26)} ${pad(vendorOf(m.comp), 12)} ${productOf(m.comp)}${m.comp.bool_disable ? '  [disabled]' : ''}`);
      out('');
      out('LINKS');
      for (const l of links(p)) out(`  ${portLabel(l.a)} ↔ ${portLabel(l.b)}${l.reciprocal ? '' : '  (one end only)'}`);
      return 0;
    }
    case 'params': {
      const all = flag(args, '--all');
      need(2);
      const p = readCmodel(args[0]);
      const m = findModule(p, args[1]);
      if (!m) throw new CmodelError(`No module "${args[1]}" in ${args[0]}`);
      for (const r of rows(m.comp)) {
        if (r.hidden && !all) continue;
        const range = r.min !== undefined || r.max !== undefined ? ` [${r.min ?? ''} … ${r.max ?? ''}]` : '';
        out(`${pad(r.path, 58)} = ${r.value}${r.unit ? ' ' + r.unit : ''}${range}  ${r.desc}`);
      }
      return 0;
    }
    case 'check': {
      const json = flag(args, '--json');
      const level = opt(args, '--level') as Level | undefined;
      need(1);
      const report = validate(readCmodel(args[0]));
      const rank: Record<Level, number> = { error: 0, warning: 1, info: 2 };
      const shown = report.findings.filter((f) => rank[f.level] <= rank[level ?? 'info']);
      if (json) out(JSON.stringify({ ...report, findings: shown }, null, 2));
      else {
        for (const f of shown) out(`${pad(f.level.toUpperCase(), 8)}${pad(f.rule, 24)} ${pad(f.module ?? '-', 22)} ${f.message}`);
        out(`\n${report.errors} error(s), ${report.warnings} warning(s), ${report.infos} note(s)`);
      }
      return report.errors ? 1 : 0;
    }
    case 'diff': {
      const json = flag(args, '--json');
      need(2);
      const d = diffProjects(readCmodel(args[0]), readCmodel(args[1]));
      if (json) {
        out(JSON.stringify(d, null, 2));
        return d.total ? 1 : 0;
      }
      const show = (v: unknown) => (v === undefined ? '—' : String(v));
      if (d.removed.length) out(`only in A: ${d.removed.join(', ')}`);
      if (d.added.length) out(`only in B: ${d.added.join(', ')}`);
      for (const m of d.modules) {
        out(`\n${m.module}`);
        for (const c of m.changes) out(`  ${pad(c.path, 56)} ${show(c.a)}  →  ${show(c.b)}`);
      }
      for (const [title, list] of [['functions', d.functions], ['capability library', d.abilities], ['other files', d.files]] as const) {
        if (!list.length) continue;
        out(`\n${title}`);
        for (const c of list.slice(0, 200)) out(`  ${pad(c.path, 56)} ${show(c.a)}  →  ${show(c.b)}`);
        if (list.length > 200) out(`  … ${list.length - 200} more`);
      }
      out(`\n${d.total} difference(s)`);
      return d.total ? 1 : 0;
    }
    case 'set': {
      const outFile = opt(args, '-o');
      need(4);
      const p = readCmodel(args[0]);
      const m = findModule(p, args[1]);
      if (!m) throw new CmodelError(`No module "${args[1]}" in ${args[0]}`);
      setAttr(p, m, args[2], args[3]);
      writeCmodel(outFile ?? args[0], p);
      out(`${args[1]} ${args[2]} = ${args[3]}  → ${outFile ?? args[0]}`);
      return 0;
    }
    case 'json': {
      const outFile = opt(args, '-o');
      need(1);
      const p = readCmodel(args[0]);
      const text = JSON.stringify({ comp: toPlain('comp', p.comp), func: toPlain('func', p.func), abi: toPlain('abi', p.abi) }, null, 2);
      if (outFile) writeFileSync(outFile, text);
      else out(text);
      return 0;
    }
    default:
      out(USAGE);
      return cmd ? 2 : 0;
  }
}

if (process.argv[1] && /main\.[tj]s$/.test(process.argv[1])) {
  try {
    process.exitCode = run(process.argv.slice(2));
  } catch (err) {
    if (err instanceof CmodelError || err instanceof EditError || (err as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error(`amr: ${(err as Error).message}`);
      process.exitCode = 2;
    } else throw err;
  }
}
