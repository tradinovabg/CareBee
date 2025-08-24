// eslint.config.js
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  // База от @eslint/js
  js.configs.recommended,

  // Конфиг для обычного кода (браузер + JSX)
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser, // window, document и т.п.
      },
    },
    plugins: { react, 'react-hooks': reactHooks },
    rules: {
      'react/react-in-jsx-scope': 'off', // React 17+
      'react/prop-types': 'off',
    },
    settings: { react: { version: 'detect' } },
  },

  // Переопределения для тестов (Node-глобалы, включая process)
  {
    files: ['**/*.test.{js,jsx}', 'test/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.node, // добавит process, __dirname и т.п.
      },
    },
  },
];
