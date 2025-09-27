// eslint.config.cjs (only the JS/JSX block shown)
const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const hooks = require('eslint-plugin-react-hooks');
const a11y = require('eslint-plugin-jsx-a11y');
const prettier = require('eslint-plugin-prettier');
// ... (ts imports stay)

module.exports = [
  { ignores: ['node_modules/**', 'dist/**', 'build/**', '.vercel/**', 'public/**'] },

  // ✅ JS/JSX with Babel parser (handles JSX reliably)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: require.resolve('@babel/eslint-parser'),
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: [require.resolve('@babel/preset-react')], // enables JSX parsing
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    plugins: { react, 'react-hooks': hooks, 'jsx-a11y': a11y, prettier },
    settings: { react: { version: 'detect' } },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...hooks.configs.recommended.rules,
      ...a11y.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'prettier/prettier': [
        'error',
        { singleQuote: true, semi: true, tabWidth: 2, trailingComma: 'es5', endOfLine: 'auto' },
      ],
    },
  },

  // (TS/TSX block stays with @typescript-eslint/parser)
  // (Node config files block stays the same)
];
