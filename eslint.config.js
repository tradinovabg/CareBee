// flat-config
import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,

  // ваш основной конфиг (если есть)…

  // тесты запускаются в node:
  {
    files: ['test/**/*', '**/*.test.js'],
    languageOptions: {
      globals: { ...globals.node },   // process и др. в тестах
    },
  },
  // браузерные глобалы для клиентского кода:
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
]
