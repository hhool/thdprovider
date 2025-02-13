import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { ESLint } from 'eslint';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';

const compat = new FlatCompat({
  baseDirectory: import.meta.url,
});

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['node_modules/', 'dist/'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      // add your custom rules here
    },
  },
];