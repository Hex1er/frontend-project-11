import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.js'],
    plugins: {
      js,
      stylistic,
    },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'stylistic/quotes': ['error', 'single'],
      'stylistic/semi': ['error', 'never'],
      'stylistic/operator-linebreak': ['error', 'before'],
    },
  },
])
