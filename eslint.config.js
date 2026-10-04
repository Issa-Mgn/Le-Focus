import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        // Vite remplace `process.env.NODE_ENV` au build (voir src/main.jsx,
        // src/config/performance.config.js, src/utils/performanceBanner.js, etc.)
        process: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
    },
    rules: {
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Règles issues du React Compiler (eslint-plugin-react-hooks v7).
      // Désactivées : le projet n'active pas le React Compiler et ces patterns
      // (hydratation depuis localStorage, accès à un ref dans le cleanup) sont volontaires.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
    },
  },
  {
    // Le code des Netlify Functions s'exécute côté Node.
    files: ['netlify/**/*.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
])
