import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
            globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        URLSearchParams: 'readonly',
        history: 'readonly',
        prompt: 'readonly',
        confirm: 'readonly',
        alert: 'readonly',

        // Phaser 2.x globals
        Phaser: 'readonly',

        // Game globals
        PrinceJS: 'writable'
      }
    },
    rules: {
      // ES2022 specific rules - enforced for new code
      'prefer-const': 'warn',
      'no-var': 'warn',
      'object-shorthand': 'off', // Too many violations in existing code
      'prefer-arrow-callback': 'off', // Legacy codebase uses function declarations
      'prefer-template': 'off', // Too many string concatenations to fix

      // Standard rules - relaxed for game development
      semi: ['error', 'always'],
      quotes: 'off', // Mixed quotes in existing codebase
      indent: 'off', // Existing code uses inconsistent indentation
      'comma-dangle': 'off',
      'space-before-function-paren': 'off',
      'keyword-spacing': 'warn',
      'space-infix-ops': 'warn',
      'eol-last': 'warn',
      'no-trailing-spaces': 'warn',

      // Relaxed rules for game development
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_'
        }
      ],
      camelcase: 'off', // Game code uses various naming conventions

      // Allow console for debugging and cheat system
      'no-console': 'off',

      // Game-specific allowances
      'no-magic-numbers': 'off',
      'max-len': 'off', // Some lines are long due to game logic
      complexity: 'off', // Game logic can be complex
      'no-plusplus': 'off',
      'no-continue': 'off',
      'no-bitwise': 'off',
      'no-undef': 'error' // Still catch undefined variables
    }
  },
  {
    // Ignore patterns
    ignores: ['lib/**', 'public/**', 'dist/**', 'node_modules/**', 'converter/**', '*.min.js', 'vite.config.js']
  },
  {
    // Stricter rules for main entry files and new code
    files: ['src/main.js', 'eslint.config.js'],
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-console': 'warn'
    }
  }
];
