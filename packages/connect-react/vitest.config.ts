import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// The monorepo hoists next@14 (React 18) to the root while this package pins
// React 19 as a devDependency, so the component under test and
// `@testing-library/react` can otherwise resolve to two different React copies,
// which throws "Objects are not valid as a React child" at render time. Alias
// both React packages to the single root copy (by directory, so subpath imports
// like `react/jsx-runtime` and `react-dom/client` keep resolving). `@testing-
// library/react@16` and this component both support React 18, so aligning tests
// on the root copy is safe.
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const rootRequire = createRequire(resolve(rootDir, 'noop.js'));
const reactDir = dirname(rootRequire.resolve('react/package.json'));
const reactDomDir = dirname(rootRequire.resolve('react-dom/package.json'));

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: reactDir,
      'react-dom': reactDomDir,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
