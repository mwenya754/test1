// ESLint configuration file
// ESLint helps identify and report errors in JavaScript code to maintain code quality

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore the dist folder (compiled output)
  globalIgnores(['dist']),
  {
    // Apply linting rules to all JS and JSX files
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,           // Use recommended JavaScript rules
      reactHooks.configs.flat.recommended,  // Use React Hooks best practices
      reactRefresh.configs.vite,        // Support React Refresh for hot module reloading
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,         // Allow browser global variables
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },   // Enable JSX syntax support
        sourceType: 'module',
      },
    },
    rules: {
      // Allow unused variables if they start with uppercase letters or underscores (React components, constants)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
