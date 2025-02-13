import { createRequire } from 'module';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const tsNode = require('ts-node');
const tsConfigPaths = require('tsconfig-paths');

const tsConfig = require('./tsconfig.json');
const baseUrl = resolve(fileURLToPath(import.meta.url), tsConfig.compilerOptions.baseUrl);

tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
});

tsNode.register({
  project: './tsconfig.json',
  transpileOnly: true,
  loader: 'ts-node/esm',
});

import('./src/index.ts');