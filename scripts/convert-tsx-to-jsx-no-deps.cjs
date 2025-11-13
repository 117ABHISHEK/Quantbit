// Lightweight no-deps converter: strips common TypeScript syntax from .tsx files and writes .jsx outputs.
// This is a heuristic converter (regex-based). It works for common patterns but may need manual fixes.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const clientSrc = path.join(root, 'client', 'src');

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results.push(...walk(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

function stripTypes(src) {
  let out = src;

  // remove import type lines
  out = out.replace(/^import\s+type\s+.*;\r?\n/gm, '');

  // remove 'export type' and 'type' aliases (single-line or multi-line) - basic
  out = out.replace(/export\s+type\s+[^=]+=[\s\S]*?;\r?\n/gm, '');
  out = out.replace(/type\s+[^=]+=[\s\S]*?;\r?\n/gm, '');

  // remove interface blocks
  out = out.replace(/export\s+interface\s+\w+\s+\{[\s\S]*?\}\r?\n/gm, '');
  out = out.replace(/interface\s+\w+\s+\{[\s\S]*?\}\r?\n/gm, '');

  // remove generic type params like <T, U extends ...> in identifiers (e.g., useState<Type>)
  out = out.replace(/([A-Za-z0-9_\)\]])<[^>]+>/g, '$1');

  // remove simple ': Type' annotations in params and variables
  // e.g., (a: string, b: number) => (a, b)
  out = out.replace(/:\s*([A-Za-z0-9_\[\]\|<>\.\s\?]+)/g, '');

  // remove return types function foo(): Type {
  out = out.replace(/\)\s*:\s*[^\{\n]+\s*\{/g, ') {');

  // remove 'as Type' casts
  out = out.replace(/\s+as\s+[A-Za-z0-9_\[\]\.\<\>\|\s]+/g, '');

  // remove 'implements' clauses on classes
  out = out.replace(/implements\s+[A-Za-z0-9_,\s<>]+/g, '');

  // remove 'declare' keywords
  out = out.replace(/\bdeclare\s+/g, '');

  return out;
}

function convertFile(filePath) {
  const rel = path.relative(root, filePath);
  console.log('Converting', rel);
  const src = fs.readFileSync(filePath, 'utf8');

  const out = stripTypes(src);

  const outPath = filePath.replace(/\.tsx?$/, '.jsx');
  fs.writeFileSync(outPath, out, 'utf8');
}

function main() {
  if (!fs.existsSync(clientSrc)) {
    console.error('client/src not found at', clientSrc);
    process.exit(1);
  }

  const all = walk(clientSrc).filter((p) => p.endsWith('.tsx'));
  if (all.length === 0) {
    console.log('No .tsx files found under client/src');
    return;
  }

  const backupDir = path.join(root, 'backup_tsx_' + Date.now());
  fs.mkdirSync(backupDir, { recursive: true });
  console.log('Creating backup of .tsx files at', backupDir);
  all.forEach((f) => {
    const rel = path.relative(root, f);
    const dest = path.join(backupDir, rel);
    const destDir = path.dirname(dest);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(f, dest);
  });

  all.forEach(convertFile);

  console.log('\nConversion complete. .jsx files created alongside original .tsx files.');
  console.log('Please review and then (optionally) delete original .tsx files or keep TypeScript sources.');
}

main();
