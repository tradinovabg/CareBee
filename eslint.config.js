// eslint.config.js (ESLint v9, flat config)
import js from '@eslint/js';
import globals from 'globals';

export default [
  // База от ESLint
  js.configs.recommended,

  // Общие настройки для .js/.jsx
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // Тесты: разрешаем node-глобалы, в т.ч. process
  {
    files: ['test/**', '**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        process: 'readonly',
      },
    },
  },
];

