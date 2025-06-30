# ESLint Setup for PrinceJS

This document explains the ESLint configuration for the PrinceJS project, which has been set up with ES2022 standards while maintaining compatibility with the existing game codebase.

## Configuration Overview

The project uses ESLint 8.x with a flat configuration format (`eslint.config.js`) that enforces ES2022 standards while being practical for the existing game code.

### Key Features

- **ES2022 Support**: Modern JavaScript features and syntax
- **Relaxed Legacy Rules**: Accommodates existing game code patterns
- **Gradual Modernization**: Warns about opportunities to use modern syntax
- **Game-Specific Allowances**: Permits common game development patterns

## Configuration Files

- `eslint.config.js` - Main ESLint configuration using flat config format
- `.eslintignore` - Files and directories to exclude from linting
- `package.json` - Contains linting scripts

## Scripts

```bash
# Check for linting issues without fixing
npm run lint:check

# Fix auto-fixable linting issues
npm run lint

# Format code with Prettier
npm run format

# Check formatting without fixing
npm run format:check

# Run both formatting and linting
npm run code-quality
```

## Rules Configuration

### Strict Rules (Errors)

- `no-undef` - Catch undefined variables
- `semi` - Require semicolons
- `prefer-const` and `no-var` for main entry files

### Relaxed Rules (Warnings or Off)

- `quotes` - Mixed quotes allowed in existing code
- `indent` - Inconsistent indentation allowed
- `object-shorthand` - Not enforced due to legacy code
- `prefer-template` - String concatenation allowed
- `complexity` - Complex game logic allowed
- `max-len` - No line length limits

### Game-Specific Allowances

- `no-magic-numbers` - Numbers in game logic are acceptable
- `no-plusplus` - Increment/decrement operators allowed
- `no-console` - Console statements only warn (useful for debugging)
- `camelcase` - Various naming conventions allowed

## Globals Defined

The configuration includes globals for:

- Browser APIs (`window`, `document`, `console`, etc.)
- Timer functions (`setTimeout`, `clearTimeout`, etc.)
- Phaser 2.x framework (`Phaser`)
- Game namespace (`PrinceJS`)

## Integration with Vite

The ESLint configuration works seamlessly with the Vite development setup:

- Linting runs independently of the build process
- ES2022 modules work correctly with both ESLint and Vite
- Development workflow remains fast and efficient

## Usage Examples

### Check specific files

```bash
npx eslint src/main.js src/Boot.js
```

### Fix specific files

```bash
npx eslint src/main.js --fix
```

### Lint all source files

```bash
npm run lint:check
```

### Fix all auto-fixable issues

```bash
npm run lint
```

## Common Warnings and How to Address Them

### 1. "prefer-const" warnings

```javascript
// Before (warning)
let x = 10;

// After (no warning)
const x = 10;
```

### 2. "no-unused-vars" warnings

```javascript
// Before (warning)
function handler(event, data) {
  console.log(event);
}

// After (no warning)
function handler(event, _data) {
  console.log(event);
}
```

### 3. "no-console" warnings

These are only warnings and can be left in for debugging. For production:

```javascript
// Replace console.log with proper logging or remove
if (process.env.NODE_ENV !== "production") {
  console.log("Debug info");
}
```

## Migration Strategy

The configuration is designed for gradual modernization:

1. **Phase 1** (Current): Catch errors, warn about modernization opportunities
2. **Phase 2** (Future): Gradually enforce stricter rules as code is refactored
3. **Phase 3** (Long-term): Full ES2022 compliance with strict rules

## Customization

To adjust rules for your workflow:

1. Edit `eslint.config.js`
2. Test with `npm run lint:check`
3. Run `npm run lint` to auto-fix when ready

### Example: Making a rule stricter

```javascript
// In eslint.config.js
rules: {
  'prefer-const': 'error', // Change from 'warn' to 'error'
}
```

### Example: Adding file-specific rules

```javascript
{
  files: ['src/tiles/*.js'],
  rules: {
    'prefer-const': 'off' // Disable for tile files
  }
}
```

## Troubleshooting

### ESLint not finding files

Check that files aren't in the ignore list in `eslint.config.js` or `.eslintignore`.

### Configuration errors

Validate the flat config format - it's different from legacy `.eslintrc` format.

### Performance issues

Add more patterns to the `ignores` array to exclude unnecessary files.

## Benefits

- **Modern Development**: ES2022 features and best practices
- **Gradual Adoption**: No need to rewrite entire codebase immediately
- **Consistent Style**: Automated formatting and style checking
- **Error Prevention**: Catch common JavaScript mistakes
- **Team Collaboration**: Shared coding standards
