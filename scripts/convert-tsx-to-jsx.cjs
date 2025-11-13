// CommonJS converter (use with node when project is type:module)
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

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

function convertFile(filePath) {
  const rel = path.relative(root, filePath);
  console.log('Converting', rel);
  const src = fs.readFileSync(filePath, 'utf8');

  const transpiled = ts.transpileModule(src, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ES2019,
      module: ts.ModuleKind.ESNext,
      allowJs: true,
      esModuleInterop: true,
    },
    fileName: path.basename(filePath),
  });

  let out = transpiled.outputText;
  out = out.replace(/^import\s+type\s+.*;\r?\n/gm, '');
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
