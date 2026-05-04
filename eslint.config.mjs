import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Ignored paths
  {
    ignores: [
      '.next/**',
      '.claude/**',
      'node_modules/**',
      'storybook-static/**',
      'coverage/**',
      'parsnipscrawl-design-system-v4.html',
    ],
  },

  // JS recommended
  js.configs.recommended,

  // TypeScript recommended
  ...tseslint.configs.recommended,

  // React hooks
  {
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  // jsx-a11y
  jsxA11y.flatConfigs.recommended,

  // Globals (browser + Node for config files)
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Prettier — must be last so it wins over formatting rules
  prettier,
);
