const fs = require('fs');
const path = require('path');

const TESTS_DIR = './tests';

function getAllTestFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllTestFiles(fullPath));
    } else if (item.endsWith('.test.ts') || item.endsWith('.spec.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllTestFiles(TESTS_DIR);
let updatedCount = 0;
let skippedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // Step 1: Replace the import line
  if (content.includes("from '@playwright/test'")) {
    // Calculate relative path from test file to utils/fixtures
    const relPath = path.relative(path.dirname(file), path.join(TESTS_DIR, 'utils/fixtures'))
      .replace(/\\/g, '/'); // Windows fix

    content = content.replace(
      /import\s*\{([^}]+)\}\s*from\s*'@playwright\/test'/g,
      `import {$1} from '${relPath}'`
    );
    changed = true;
  }

  // Step 2: Remove test.use({ storageState: ... }) line
  if (content.includes('storageState')) {
    content = content.replace(/test\.use\(\s*\{[^}]*storageState[^}]*\}\s*\);\s*\n?/g, '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✅ Updated: ${file}`);
    updatedCount++;
  } else {
    console.log(`⏭️  Skipped (no changes needed): ${file}`);
    skippedCount++;
  }
}

console.log(`\n🎉 Done! Updated: ${updatedCount} files | Skipped: ${skippedCount} files`);