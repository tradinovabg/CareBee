// eslint.config.js — ESLint 9 flat config
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';

export default [
  // База от ESLint
  js.configs.recommended,

  // Фронтенд: src/** — включаем JSX и браузерные глобалы
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser, // window, document и т.п.
      },
    },
    plugins: { react },
    settings: { react: { version: 'detect' } },
    rules: {
      // для React 17+
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },

  // Тесты: включаем Node-глобалы (process и т.п.)
  {
    files: ['test/**/*', '**/*.test.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    // если вдруг останется жалоба на переобъявление process — можно временно выключить
    // rules: { 'no-redeclare': 'off' },
  },
];
