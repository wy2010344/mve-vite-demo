#!/usr/bin/env node
/**
 * Prepare package.json for standalone deployment (GitHub Pages).
 * Replaces workspace:* and catalog: with concrete npm versions,
 * and removes private @repo/* packages not available on npm.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Versions for workspace:* packages (published on npm)
const WORKSPACE_VERSIONS = {
  'mve-core': '4.0.1',
  'mve-dom': '4.0.1',
  'mve-dom-helper': '4.0.1',
  'mve-helper': '4.0.1',
  'daisy-mobile-helper': '2.0.1',
  'wy-helper': '1.1.1',
  'wy-dom-helper': '2.0.1',
};

// Versions for catalog: deps (from monorepo pnpm-workspace.yaml)
const CATALOG_VERSIONS = {
  'typescript': '^6.0.2',
  '@commitlint/cli': '^21.0.1',
  '@commitlint/config-conventional': '^21.0.1',
  'tailwindcss': '^4.1.16',
  '@tailwindcss/vite': '^4.1.14',
  '@tailwindcss/typography': '^0.5.16',
  'daisyui': '^5.0.42',
  'vite': '^8.0.14',
  '@faker-js/faker': '^10.4.0',
  '@floating-ui/dom': '^1.7.2',
  '@types/d3': '^7.4.3',
  '@types/node': '^25.5.0',
  '@types/culori': '^4.0.1',
  '@types/lodash': '^4.17.21',
  'csstype': '^3.1.3',
  'd3': '^7.9.0',
  'd3-binarytree': '^1.0.2',
  'd3-octree': '^1.1.0',
  'd3-quadtree': '^3.0.1',
  'dexie': '^4.2.0',
  'history': '^5.3.0',
  'immutable': '^5.1.5',
  'konva': '^10.0.12',
  'linebreak': '^1.1.0',
  'lodash': '^4.18.1',
  'lottie-web': '^5.12.2',
  'marked': '^18.0.4',
  'motion': '^12.23.0',
  'mve-icons': '^6.0.0',
  'three': '^0.184.0',
  'tyme4ts': '^1.3.4',
  'husky': '^9.1.7',
  'lint-staged': '^17.0.5',
  'commitizen': '^4.3.1',
  'cz-conventional-changelog': '^3.3.0',
};

// Private workspace packages to remove (not on npm)
const PRIVATE_PACKAGES = ['@repo/eslint-config', '@repo/prettier-config'];

// Read package.json
const pkgPath = resolve(root, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
  if (!pkg[field]) continue;

  // Remove private packages
  for (const name of PRIVATE_PACKAGES) {
    if (pkg[field][name]) {
      delete pkg[field][name];
      console.log(`  ✗ ${name}: removed (private)`);
    }
  }

  // Replace workspace:* and catalog:
  for (const [name, spec] of Object.entries(pkg[field])) {
    if (spec === 'workspace:*' || spec === 'workspace:^') {
      const version = WORKSPACE_VERSIONS[name];
      if (version) {
        const newSpec = `^${version}`;
        console.log(`  ✓ ${name}: ${spec} → ${newSpec}`);
        pkg[field][name] = newSpec;
      } else {
        console.warn(`  ⚠ ${name}: unknown workspace package, removing`);
        delete pkg[field][name];
      }
    } else if (spec === 'catalog:') {
      const version = CATALOG_VERSIONS[name];
      if (version) {
        console.log(`  ✓ ${name}: catalog: → ${version}`);
        pkg[field][name] = version;
      } else {
        console.warn(`  ⚠ ${name}: unknown catalog dep, keeping as-is`);
      }
    } else if (spec === 'catalog:^') {
      // Some catalog entries may use catalog:^ format
      const lookup = name; // catalog:^ is same as catalog:, version is already ^
      const version = CATALOG_VERSIONS[name] || CATALOG_VERSIONS[lookup];
      if (version) {
        console.log(`  ✓ ${name}: catalog:^ → ${version}`);
        pkg[field][name] = version;
      } else {
        console.warn(`  ⚠ ${name}: unknown catalog dep, keeping as-is`);
      }
    }
  }
}

// Remove prepare script (husky) for CI
if (pkg.scripts?.prepare) {
  delete pkg.scripts.prepare;
  console.log('  ✗ scripts.prepare removed (not needed in CI)');
}

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`\n✅ Done. Updated ${resolve(root, 'package.json')}`);
