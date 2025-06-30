module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  globals: {
    // Phaser 2.6.2 globals (during transition phase)
    Phaser: "readonly",
    PrinceJS: "writable",

    // Game-specific globals
    game: "writable"
  },
  rules: {
    // Modern JavaScript preferences
    "prefer-const": "error",
    "prefer-arrow-functions": "off", // Will enable gradually
    "no-var": "error",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

    // Code quality
    "no-console": "off", // Allow console for game debugging
    "no-debugger": "warn",
    "no-unreachable": "error",

    // Style preferences
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "comma-dangle": ["error", "never"],

    // ES6+ features
    "arrow-spacing": "error",
    "template-curly-spacing": "error",
    "object-shorthand": "error",

    // During migration phase - relaxed rules
    "no-undef": "warn", // Will be stricter after module migration
    strict: "off" // Allow non-strict mode during transition
  },
  overrides: [
    {
      // Legacy game files (before migration)
      files: ["src/**/*.js", "!src/main.js"],
      rules: {
        "no-var": "warn", // More lenient for legacy code
        "prefer-const": "warn"
      }
    },
    {
      // Modern ES6+ files
      files: ["src/main.js", "vite.config.js", "src/enhanced/**/*.js"],
      rules: {
        "no-var": "error",
        "prefer-const": "error",
        "no-undef": "error"
      }
    }
  ]
};
