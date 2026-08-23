import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'node:fs';
const data = new Uint8Array(fs.readFileSync(process.argv[2]));
const doc = await getDocument({ data, useSystemFonts: true }).promise;
console.log('pages:', doc.numPages);
const N = Math.min(doc.numPages, 12);
for (let i = 1; i <= N; i++) {
  const pg = await doc.getPage(i);
  const tc = await pg.getTextContent();
  const txt = tc.items.map(it => it.str).join(' ').replace(/\s+/g, ' ').trim();
  console.log(`\n=== p${i} ===\n` + txt.slice(0, 1200));
}
