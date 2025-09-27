// eslint.config.cjs
const js = require("@eslint/js");
const react = require("eslint-plugin-react");
const hooks = require("eslint-plugin-react-hooks");
const a11y = require("eslint-plugin-jsx-a11y");
const prettier = require("eslint-plugin-prettier");
const ts = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  // Ignore globs (replaces .eslintignore)
  { ignores: ["node_modules/**", "dist/**", "build/**", ".vercel/**", "public/**"] },

  // ✅ JS/JSX with Babel parser (handles JSX so no "<" parse errors)
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: require("@babel/eslint-parser"),
      parserOptions: {
        requireConfigFile: false,
        babelOptions: { presets: [require("@babel/preset-react")] }
      },
      globals: {
        window: "readonly",
        document: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly"
      }
    },
    plugins: { react, "react-hooks": hooks, "jsx-a11y": a11y, prettier },
    settings: { react: { version: "detect" } },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...hooks.configs.recommended.rules,
      ...a11y.configs.recommended.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "prettier/prettier": [
        "error",
        { singleQuote: true, semi: true, tabWidth: 2, trailingComma: "es5", endOfLine: "auto" }
      ]
    }
  },

  // ✅ TS/TSX with TypeScript parser
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        window: "readonly",
        document: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly"
      }
    },
    plugins: { "@typescript-eslint": ts, react, "react-hooks": hooks, "jsx-a11y": a11y, prettier },
    settings: { react: { version: "detect" } },
    rules: {
      ...ts.configs.recommended.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "react/no-unescaped-entities": "warn",
      "prettier/prettier": [
        "error",
        { singleQuote: true, semi: true, tabWidth: 2, trailingComma: "es5", endOfLine: "auto" }
      ]
    }
  },

  // Node config files (silence __dirname/require/module)
  {
    files: ["vite.config.js", "tailwind.config.js", "**/*.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { module: "writable", require: "writable", __dirname: "writable", process: "readonly" }
    },
    rules: { "no-undef": "off" }
  }
];
