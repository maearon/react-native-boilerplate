// eslint.config.js
const { defineConfig } = require('eslint/config');
const pluginImport = require('eslint-plugin-import');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/no-unresolved': 'error',
      'import/order': 'warn',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json', // đảm bảo đúng tên file tsconfig
        },
      },
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
