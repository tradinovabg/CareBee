/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,

  env: { browser: true, es2021: true },

  extends: ['eslint:recommended'],

  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },

  overrides: [
    {
      files: ['test/**', '**/*.test.js'],
      env: { node: true },                 // включает Node-глобалы в тестах
      globals: { process: 'readonly' },    // на всякий случай явно разрешаем process
      // при желании можно полностью вырубить правило:
      // rules: { 'no-undef': 'off' },
    },
  ],
};

