/**
 * Browser walkthrough against the built app (vite preview + the real Worker API in-process).
 * Run from the repo root:  npm run build && node apps/web/e2e/walkthrough.cjs [screenshot-dir]
 */
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('node:child_process');
const { mkdirSync, existsSync } = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const ROOT = path.resolve(__dirname, '../../..');
const SHOTS = path.resolve(process.argv[2] || path.join(ROOT, 'docs/screenshots'));
const PORT = 4179;
const URL_ = `http://localhost:${PORT}/`;
const FIX = (n) => path.join(ROOT, 'fixtures', n);
const steps = [];
const step = async (name, fn) => {
  await fn();
  steps.push(name);
  console.log(`ok  ${name}`);
};

(async () => {
  mkdirSync(SHOTS, { recursive: true });
  const server = spawn('node', ['--import', 'tsx', path.join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--port', String(PORT), '--strictPort'], { cwd: path.join(ROOT, 'apps/web'), stdio: 'pipe' });
  await new Promise((resolve, reject) => {
    server.stdout.on('data', (d) => String(d).includes('localhost') && resolve());
    server.stderr.on('data', (d) => process.stderr.write(d));
    server.on('exit', (c) => reject(new Error(`preview server exited (${c})`)));
    setTimeout(() => reject(new Error('preview server did not start')), 20000);
  });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1360, height: 860 }, acceptDownloads: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('dialog', (d) => d.accept());
  const shot = async (n) => {
    const toast = page.locator('.toast');
    if (await toast.count()) await toast.click().catch(() => {});
    await page.screenshot({ path: path.join(SHOTS, `${n}.png`) });
  };
  const counts = async () => (await page.locator('.counts').innerText()).replace(/\s+/g, ' ');
  const field = (p) => page.locator(`.field[data-path="${p}"]`);
  const setField = async (p, v) => {
    const input = field(p).locator('input[type="text"]');
    await input.fill(String(v));
    await input.blur();
  };

  try {
    await step('welcome screen loads', async () => {
      await page.goto(URL_);
      await page.getByText('Drop a .cmodel file here').waitFor();
      await shot('01-welcome');
    });
    await step('a file that is not a cmodel is refused with an explanation', async () => {
      await page.getByTestId('file-input').setInputFiles(path.join(ROOT, 'package.json'));
      await page.locator('.toast.error').waitFor();
      assert.match(await page.locator('.toast.error').innerText(), /Not a \.cmodel file/);
    });
    await step('open the two-lidar model: 22 modules, 1 error, 2 warnings', async () => {
      await page.getByTestId('file-input').setInputFiles(FIX('diff-2lidar.cmodel'));
      await page.locator('.bar').waitFor();
      assert.match(await page.locator('.bar').innerText(), /22 modules/);
      assert.match(await counts(), /1 error 2 warnings/);
      assert.equal(await page.locator('.tree .item').count(), 22);
    });
    await step('module search filters the tree', async () => {
      await page.getByLabel('Search modules').fill('laser');
      assert.equal(await page.locator('.tree .item').count(), 2);
      await page.getByLabel('Search modules').fill('');
    });
    await step('properties show the lidar parameters; flagged field is marked', async () => {
      await page.locator('.tree .item', { hasText: 'laser-front' }).click();
      await page.locator('.props h2', { hasText: 'laser-front' }).waitFor();
      assert.equal(await field('if/ETH_1/param/ip').locator('input').inputValue(), '192.168.1.88');
      assert.match(await field('struct/locCoordYAW').getAttribute('class'), /bad/);
      await shot('02-properties');
    });
    await step('an invalid value is rejected and the old value kept', async () => {
      await setField('if/ETH_1/param/port', 'abc');
      assert.match(await field('if/ETH_1/param/port').locator('.note').innerText(), /expects a number/);
      assert.equal(await field('if/ETH_1/param/port').locator('input').inputValue(), '8080');
    });
    await step('fix lidar yaw → heading warning clears', async () => {
      await setField('struct/locCoordYAW', 45);
      assert.match(await counts(), /1 error 1 warning/);
    });
    await step('fix duplicate CAN node ID → error clears', async () => {
      await page.locator('.tree .item', { hasText: 'driver-left' }).click();
      await page.locator('.props h2', { hasText: 'driver-left' }).waitFor();
      await setField('if/CAN_1/param/nodeId', 3);
      assert.match(await counts(), /0 errors 1 warning/);
    });
    await step('wiring tab lists buses and their node IDs', async () => {
      await page.getByRole('tab', { name: 'Wiring' }).click();
      const can2 = page.locator('.bus', { hasText: 'MainController.CAN_2' });
      await can2.waitFor();
      assert.equal(await can2.locator('tbody tr').count(), 3);
      await shot('03-wiring');
    });
    await step('disconnect and reconnect a port through the form', async () => {
      const can2 = page.locator('.bus', { hasText: 'MainController.CAN_2' });
      await can2.locator('tr', { hasText: 'driver-right' }).getByRole('button', { name: 'Disconnect' }).click();
      assert.equal(await can2.locator('tbody tr').count(), 2);
      await page.getByLabel('From module').selectOption({ label: 'G_MainController' }).catch(async () => page.getByLabel('From module').selectOption({ label: 'MainController' }));
      await page.getByLabel('From port').selectOption({ index: await page.getByLabel('From port').locator('option', { hasText: /^CAN_2 / }).evaluate((o) => o.index) });
      await page.getByLabel('To module').selectOption({ label: 'driver-right' });
      await page.getByLabel('To port').selectOption({ index: 1 });
      await page.getByRole('button', { name: 'Connect', exact: true }).click();
      await page.waitForFunction(() => document.querySelectorAll('.bus').length > 0);
      assert.equal(await page.locator('.bus', { hasText: 'MainController.CAN_2' }).locator('tbody tr').count(), 3);
    });
    await step('rebind the obstacle laser → last warning clears', async () => {
      await page.getByRole('tab', { name: 'Functions' }).click();
      const row = page.locator('tr', { has: page.locator('select') }).filter({ has: page.locator('option[value="laser-C200"]:checked') }).first();
      await row.locator('select').selectOption('laser-front');
      assert.match(await counts(), /0 errors 0 warnings/);
      await shot('04-functions');
    });
    await step('validate tab shows a clean result; notes can be shown', async () => {
      await page.getByRole('tab', { name: 'Validate' }).click();
      await page.getByText('No errors or warnings.').waitFor();
      await page.locator('.chip.info input').check();
      assert.ok((await page.locator('.findings li').count()) > 5);
      await shot('05-validate');
    });
    await step('undo brings the warning back, redo clears it again', async () => {
      await page.getByRole('button', { name: 'Undo' }).click();
      assert.match(await counts(), /0 errors 1 warning/);
      await page.getByRole('button', { name: 'Redo' }).click();
      assert.match(await counts(), /0 errors 0 warnings/);
    });
    await step('compare with the original file shows exactly the three edits', async () => {
      await page.getByRole('tab', { name: 'Compare' }).click();
      await page.getByTestId('compare-input').setInputFiles(FIX('diff-2lidar.cmodel'));
      await page.locator('.summary').waitFor();
      assert.match(await page.locator('.summary').innerText(), /^3 differences/);
      await shot('06-compare');
    });
    await step('catalog: find a controller product and add it', async () => {
      await page.getByRole('tab', { name: 'Catalog' }).click();
      await page.getByLabel('Search catalog').fill('R318AT');
      await page.locator('tr', { hasText: 'MCPU-RA-MC-R318AT' }).getByRole('button', { name: 'Add' }).click();
      await page.locator('.props h2').waitFor();
      assert.match(await page.locator('.bar').innerText(), /23 modules/);
      await page.getByRole('tab', { name: 'Catalog' }).click();
      await shot('07-catalog');
    });
    const exported = path.join(SHOTS, 'exported.cmodel');
    await step('export downloads a cmodel that the CLI accepts with 0 errors', async () => {
      const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export .cmodel' }).click()]);
      await dl.saveAs(exported);
      assert.ok(existsSync(exported));
      const out = execFileSync('npx', ['tsx', 'packages/cli/src/main.ts', 'check', exported, '--level', 'error'], { cwd: ROOT }).toString();
      assert.match(out, /0 error\(s\)/);
      const info = execFileSync('npx', ['tsx', 'packages/cli/src/main.ts', 'info', exported], { cwd: ROOT }).toString();
      assert.match(info, /23 modules/);
    });
    await step('save to server, close, reopen from the saved list', async () => {
      await page.getByRole('button', { name: 'Save to server' }).click();
      await page.locator('.toast.ok').waitFor();
      await page.getByRole('button', { name: 'Close' }).click();
      await page.locator('.saved').waitFor();
      await page.locator('.saved button.link').first().click();
      await page.locator('.bar').waitFor();
      assert.match(await page.locator('.bar').innerText(), /23 modules/);
      assert.match(await counts(), /0 errors 0 warnings/);
    });
    await step('a production model with 41 modules opens and is error-free', async () => {
      await page.getByRole('button', { name: 'Close' }).click();
      await page.getByTestId('file-input').setInputFiles(FIX('mq-q3-actuator.cmodel'));
      await page.locator('.bar').waitFor();
      assert.match(await page.locator('.bar').innerText(), /41 modules/);
      assert.match(await counts(), /0 errors/);
      await page.locator('.tree .item', { hasText: 'lifter' }).click();
      await shot('08-production-model');
    });
    await step('narrow screen layout has no horizontal overflow', async () => {
      await page.setViewportSize({ width: 390, height: 800 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert.ok(overflow <= 1, `page overflows by ${overflow}px`);
      await shot('09-narrow');
    });
    await step('no console or page errors during the walkthrough', async () => {
      assert.deepEqual(errors, []);
    });
    console.log(`\n${steps.length} steps passed`);
  } catch (err) {
    await shot('failure').catch(() => {});
    console.error(`\nFAILED after ${steps.length} steps: ${err.message}`);
    if (errors.length) console.error('browser errors:', errors);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.kill();
  }
})();
