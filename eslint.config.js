// eslint.config.js (flat config)
import js from '@eslint/js';
import globals from 'globals';

export default [
  // Базовые рекомендации ESLint
  js.configs.recommended,

  // Глобалы для браузера и Node в основном коде
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Оверрайд для тестов: разрешаем process и node-глобалы
  {
    files: ['test/**', '**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        process: 'readonly',
      },
    },
  },

  // Если у вас есть дополнительные правила/плагины —
  // оставьте их ниже этим объектом.
  // { ...ваш остальной конфиг... }
];
