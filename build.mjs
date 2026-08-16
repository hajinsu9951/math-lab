// 소스 조각을 합쳐 dist/index.html (단일 파일) 을 만든다.
// 사용: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const src  = (f) => readFileSync(join(ROOT, 'src', f), 'utf8');

const out = [
  src('00-head.html'),
  '<style>',
  src('styles.css'),
  '</style>',
  src('01-body-top.html'),
  src('10-pane1-labs.html'),
  src('20-pane2-vibe.html'),
  src('32-pane4-design.html'),
  src('34-pane5-gallery.html'),
  src('30-pane3-flow.html'),
  '<script>',
  src('33-figs.js'),
  src('35-tex.js'),
  src('40-demos.js'),
  src('50-labs-spec.js'),
  src('60-engine.js'),
  src('70-design.js'),
  src('78-design-mini.js'),
  src('75-design-ui.js'),
  src('80-gallery.js'),
  '</script>',
  src('99-foot.html'),
].join('\n');

mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'index.html'), out, 'utf8');
console.log(`dist/index.html  ${out.length.toLocaleString()} bytes  (${out.split('\n').length} lines)`);
