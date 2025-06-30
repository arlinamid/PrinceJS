# 🚀 Enhanced PrinceJS - Modern Architecture

This directory contains the enhanced, modern implementation of PrinceJS using ES6+ modules and component-based architecture.

## 📁 Directory Structure

### `core/`

Core game engine components and fundamental systems.

- Game loop management
- State management
- Configuration system
- Event system

### `components/`

Reusable game components following composition over inheritance.

- Component base classes
- Behavior components
- Rendering components
- Physics components

### `systems/`

Game systems that operate on entities with specific components.

- Physics system
- Rendering system
- Input system
- Audio system
- AI system (Phase 4)
- Multiplayer system (Phase 4)

### `entities/`

Game entities composed of components.

- Player entity
- Enemy entities
- Environment entities
- UI entities

### `ui/`

User interface components and systems.

- Menu systems
- HUD components
- Settings interfaces
- Multiplayer lobby (Phase 4)

### `utils/`

Utility functions and helper classes.

- Math utilities
- Asset helpers
- Performance utilities
- Debug tools

## 🔄 Migration Strategy

During Phase 2, legacy code from `src/` will be gradually migrated to this enhanced structure:

1. **Phase 2A**: Core systems (Boot, Preloader)
2. **Phase 2B**: Actor and Level systems
3. **Phase 2C**: Character systems (Fighter, Kid, Enemy)
4. **Phase 2D**: Tile systems and utilities

## 🛠️ Development Guidelines

### Code Standards

- Use ES6+ features (classes, modules, arrow functions)
- Follow TSDoc comment standards
- Implement component-based architecture
- Write unit tests for all new components

### Naming Conventions

- Classes: `PascalCase` (e.g., `PlayerController`)
- Functions: `camelCase` (e.g., `updatePosition`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_HEALTH`)
- Files: `PascalCase.js` for classes, `camelCase.js` for utilities

### Import/Export Patterns

```javascript
// Named exports for utilities
export { mathUtils, assetLoader };

// Default exports for classes
export default class PlayerController {
  // Implementation
}

// Mixed exports
export default GameEngine;
export { EventBus, Config };
```

## 🧪 Testing

Each component should have corresponding test files in the same directory:

- `Component.js` - Implementation
- `Component.test.js` - Unit tests
- `Component.integration.js` - Integration tests (optional)

## 📈 Progress Tracking

This directory will grow during the migration phases:

- **Phase 1**: Directory structure and documentation ✅
- **Phase 2**: Core system migration (Weeks 3-8)
- **Phase 3**: Enhanced features (Weeks 9-14)
- **Phase 4**: Advanced features (AI, Multiplayer) (Weeks 15-22)

---

_Last Updated: Phase 1 - Foundation Setup_
