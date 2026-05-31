const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const distIndex = path.resolve(__dirname, '..', 'dist', 'index.html');
if (!fs.existsSync(distIndex)) {
  console.error('dist/index.html not found — run a build first');
  process.exit(2);
}

const html = fs.readFileSync(distIndex, 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
const { window } = dom;
const { document } = window;

// attach globals for axe
global.window = window;
global.document = document;
global.Node = window.Node;
const axe = require('axe-core');

// Quick diagnostic: list anchors not contained in a landmark element
const anchors = Array.from(document.querySelectorAll('a'));
const notInLandmark = anchors.filter((a) => !a.closest('main, [role="main"], nav, [role="navigation"], header, [role="banner"], footer, [role="contentinfo"], aside, [role="complementary"]'));
if (notInLandmark.length > 0) {
  console.log('Anchors not in landmarks:');
  notInLandmark.forEach((a) => console.log(' -', a.outerHTML ? a.outerHTML.slice(0, 200) : a.href));
}

(async () => {
  try {
    const results = await axe.run(document);
    if (results.violations.length === 0) {
      console.log('No accessibility violations found by axe-core');
      process.exit(0);
    }
    console.log(`Found ${results.violations.length} accessibility violation(s)`);
    results.violations.forEach((v, idx) => {
      console.log(`\n${idx + 1}) ${v.id} — ${v.description} (impact: ${v.impact})`);
      v.nodes.forEach((n, i) => {
        console.log(`  - Target: ${n.target.join(', ')}`);
        console.log(`    Failure summary: ${n.failureSummary}`);
      });
    });
    process.exit(1);
  } catch (err) {
    console.error('Error running axe:', err);
    process.exit(2);
  }
})();
