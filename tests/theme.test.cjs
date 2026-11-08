const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const source = readFileSync(require('node:path').join(__dirname, '../dist/theme.js'), 'utf8');

function page({ saved = null, dark = false, blocked = false } = {}) {
  const events = {};
  const root = { dataset: {} };
  const label = {};
  const attributes = {};
  const button = {
    hidden: true,
    setAttribute: (key, value) => { attributes[key] = value; },
    querySelector: () => label,
    addEventListener: (_, listener) => { events.click = listener; }
  };
  const system = {
    matches: dark,
    addEventListener: (_, listener) => { events.system = listener; }
  };
  let ready = false;
  let stored = saved;
  runInNewContext(source, {
    document: {
      documentElement: root,
      querySelectorAll: () => ready ? [button] : [],
      addEventListener: (_, listener) => { events.ready = listener; }
    },
    window: {
      matchMedia: () => system,
      addEventListener: (_, listener) => { events.storage = listener; }
    },
    localStorage: {
      getItem: () => { if (blocked) throw Error('Storage unavailable'); return stored; },
      setItem: (_, value) => { if (blocked) throw Error('Storage unavailable'); stored = value; }
    }
  });
  const initial = root.dataset.theme;
  ready = true;
  events.ready();
  return { root, button, label, attributes, events, system, initial, stored: () => stored };
}

test('applies system preference before DOM ready and exposes accessible control', () => {
  for (const dark of [true, false]) {
    const p = page({ dark });
    assert.equal(p.initial, dark ? 'dark' : 'light');
    assert.equal(p.button.hidden, false);
    assert.equal(p.attributes['aria-pressed'], String(dark));
    assert.equal(p.attributes['aria-label'], `Switch to ${dark ? 'light' : 'dark'} mode`);
  }
});
test('saved choice overrides system and survives a new page load', () => {
  const p = page({ saved: 'light', dark: true });
  assert.equal(p.initial, 'light');
  p.events.click();
  assert.equal(p.root.dataset.theme, 'dark');
  assert.equal(p.stored(), 'dark');
  assert.equal(page({ saved: p.stored() }).initial, 'dark');
  p.events.click();
  assert.equal(p.label.textContent, 'Dark mode');
});
test('toggle works when browser storage is unavailable', () => {
  const p = page({ blocked: true });
  p.events.click();
  assert.equal(p.root.dataset.theme, 'dark');
});
test('system changes apply until the visitor explicitly chooses a theme', () => {
  const p = page();
  p.system.matches = true;
  p.events.system();
  assert.equal(p.root.dataset.theme, 'dark');
  p.events.click();
  p.events.system();
  assert.equal(p.root.dataset.theme, 'light');
});
test('other tabs synchronize and clearing storage restores system preference', () => {
  const p = page();
  p.events.storage({ key: 'alicia-theme', newValue: 'dark' });
  assert.equal(p.root.dataset.theme, 'dark');
  p.events.storage({ key: null, newValue: null });
  assert.equal(p.root.dataset.theme, 'light');
});
test('invalid stored values fall back to the system', () => {
  assert.equal(page({ saved: 'invalid', dark: true }).initial, 'dark');
});
