// eslint.config.js (flat config)
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,

  // (опционально) игнорируем сборку
  { ignores: ['dist/**'] },

  // ТЕСТЫ: включаем Node-глобалы (process и пр.)
  {
    files: ['test/**/*.{js,jsx}', '**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.node,       // дает process, __dirname и т.п.
        ...globals.es2021,
      },
    },
    // страховка: даже если глобалы не подтянутся — не валим сборку
    rules: {
      'no-undef': 'off',
    },
  },
];
