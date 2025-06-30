# Advanced AI System for PrinceJS

## Overview

The AI system introduces sophisticated enemy behaviors using minimax algorithm, patrol patterns, and other advanced decision-making strategies. This enhances gameplay by providing more challenging and realistic enemy encounters.

## AI Types

### 1. Basic AI (`basic`)
- **Description**: Original enemy behavior from the base game
- **Behavior**: Simple distance-based decisions with probability tables
- **Use Case**: Maintains original game feel for traditional levels

### 2. Minimax AI (`minimax`)
- **Description**: Strategic AI using minimax algorithm with alpha-beta pruning
- **Features**:
  - Evaluates multiple moves ahead (configurable depth)
  - Considers health advantage, position, sword status
  - Makes optimal tactical decisions
- **Depth**: 3 moves by default (configurable)
- **Use Case**: Boss fights, challenging encounters

### 3. Patrol AI (`patrol`)
- **Description**: Guards that patrol designated areas and become alert when detecting players
- **Features**:
  - Patrols within a defined range from starting position
  - Alert level system (0-100)
  - Switches to aggressive mode when alert level > 50
  - Returns to patrol when player is no longer detected
- **Detection**: Based on distance, line of sight, and same room/level
- **Use Case**: Stealth gameplay, area denial

### 4. Aggressive AI (`aggressive`)
- **Description**: Always seeks combat and attacks aggressively
- **Features**:
  - High strike probability (70%)
  - Prefers advancing over retreating
  - Quick to engage with sword
- **Use Case**: Action-heavy encounters, late-game enemies

### 5. Defensive AI (`defensive`)
- **Description**: Prioritizes blocking and retreating over attacking
- **Features**:
  - High block probability (80%)
  - Retreats when health is lower than player
  - Defensive positioning
- **Use Case**: Tank-like enemies, teaching blocking mechanics

### 6. Hunter AI (`hunter`)
- **Description**: Actively seeks the player across rooms
- **Features**:
  - Simple pathfinding between rooms
  - Switches to aggressive mode when in same room as player
  - Never gives up the chase
- **Use Case**: Persistent threats, chase sequences

## Integration

### Setting AI Types

```javascript
// Set individual enemy AI
enemy.setAIType('minimax');

// Enable advanced AI with level scaling
enemy.enableAdvancedAI();

// Disable advanced AI (revert to basic)
enemy.disableAdvancedAI();
```

### Cheat Menu Controls

Access the cheat menu with **F1** and navigate to AI controls:

- **Set Enemy AI**: Choose AI type for all enemies
- **Toggle Minimax AI**: Enable/disable minimax for all enemies
- **Toggle Patrol AI**: Enable/disable patrol for all enemies
- **Show AI Debug**: Display AI decision-making information

## Configuration

### AI Weights (Minimax)

The minimax AI uses these evaluation weights:

```javascript
WEIGHTS: {
  HEALTH_ADVANTAGE: 100,    // Health difference importance
  POSITION_ADVANTAGE: 50,   // Height/position advantage
  DISTANCE_FACTOR: 30,      // Optimal combat distance
  SWORD_ADVANTAGE: 80,      // Having sword vs opponent
  ATTACK_OPPORTUNITY: 60    // Chance for successful attack
}
```

### Patrol Configuration

```javascript
patrolData: {
  startX: number,          // Starting X position
  startRoom: number,       // Starting room
  patrolRange: 3,          // Blocks to patrol (default: 3)
  direction: number,       // Patrol direction (-1 or 1)
  waitTime: 0,            // Frames to wait at patrol endpoints
  alertLevel: 0           // Alert level (0-100)
}
```

## Performance Considerations

### Minimax Optimization
- **Alpha-beta pruning**: Reduces search space significantly
- **Depth limiting**: Prevents excessive computation
- **State caching**: Could be added for repeated positions
- **Early termination**: Stops at terminal states

### Frame Rate Impact
- Minimax AI: ~1-2ms per decision (depth 3)
- Patrol AI: ~0.1ms per decision
- Other AI types: <0.1ms per decision

### Memory Usage
- Each enemy with advanced AI: ~1KB additional memory
- Game state simulation: Temporary, cleaned up after decision

## Game Balance

### Level Scaling
- **Levels 1-4**: Basic AI recommended
- **Levels 5-9**: Mix of aggressive/defensive AI
- **Levels 10-14**: Minimax AI for increased challenge
- **Custom levels**: Any AI type based on design intent

### Difficulty Progression
```javascript
// Automatic scaling based on level
if (level >= 10) {
  enemy.searchDepth = Math.min(MAX_DEPTH + 1, 4);
  enemy.strikeProbability *= 1.2;
}
```

## Technical Implementation

### Architecture
```
PrinceJS.AI (AI.js)
├── Decision Making
│   ├── makeDecision(enemy)
│   ├── minimaxDecision(enemy)
│   └── [other AI type decisions]
├── Minimax Algorithm
│   ├── minimax(state, depth, maximizing, alpha, beta)
│   ├── evaluateState(state)
│   └── simulateAction(state, action, isEnemy)
├── State Management
│   ├── createGameState(enemy)
│   ├── getPossibleActions(state)
│   └── isTerminalState(state)
└── Utility Functions
    ├── canDetectPlayer(enemy)
    ├── seekPlayer(enemy)
    └── setAIType(enemy, aiType)
```

### Enemy Integration
```javascript
// In Enemy.js updateBehaviour()
if (typeof PrinceJS.AI !== 'undefined' && this.useAdvancedAI) {
  this.updateAdvancedBehaviour();
  return;
}
// ... original behavior as fallback
```

## Debugging

### AI Debug Mode
Enable through cheat menu to see:
- Current AI decision
- State evaluation scores
- Minimax tree exploration
- Patrol state information

### Console Output
```javascript
// Example debug output
AI Decision: advance (score: 75)
State: { health: 3, distance: 25, sword: true }
Minimax explored: 12 nodes, depth: 3
```

## Examples

### Creating a Challenging Boss
```javascript
const jaffar = new PrinceJS.Enemy(game, level, location, direction, room, 11, 0, 'jaffar', 'boss');
jaffar.setAIType('minimax');
jaffar.searchDepth = 4; // Deeper search for boss
```

### Setting Up Patrol Guards
```javascript
const guard1 = new PrinceJS.Enemy(game, level, 23, 1, 1, 3, 1, 'guard', 'patrol1');
guard1.setAIType('patrol');
guard1.patrolData.patrolRange = 5; // Wider patrol area
```

### Mixed AI Encounter
```javascript
// Tank guard (defensive)
guard1.setAIType('defensive');

// Aggressive attacker
guard2.setAIType('aggressive');

// Smart commander (minimax)
commander.setAIType('minimax');
```

## Future Enhancements

### Planned Features
- **Cooperative AI**: Multiple enemies coordinating attacks
- **Learning AI**: Adapts to player behavior over time
- **Scripted Behaviors**: Predefined action sequences
- **Formation Fighting**: Group tactics and positioning

### Advanced Minimax
- **Deeper Search**: Configurable depth up to 6 moves
- **Better Evaluation**: More sophisticated state scoring
- **Quiescence Search**: Extended search in tactical situations
- **Opening Book**: Predefined good moves for common situations

### Patrol Enhancements
- **Waypoint System**: Define specific patrol routes
- **Group Patrols**: Multiple guards patrolling together
- **Alarm System**: Guards can alert others when detecting player
- **Investigation Mode**: Guards check last known player position

## Troubleshooting

### Common Issues

**Q: AI enemies are not using advanced behaviors**
A: Ensure AI.js is loaded before Enemy.js and call `enemy.enableAdvancedAI()`

**Q: Minimax AI is too slow**
A: Reduce search depth or optimize evaluation function

**Q: Patrol AI doesn't detect player**
A: Check detection ranges and ensure enemies are in appropriate positions

**Q: Cheat menu AI controls don't work**
A: Verify game instance is properly stored in `window.PrinceJS_Game_Instance`

### Performance Issues
- Monitor frame rate with AI debug enabled
- Reduce minimax depth for weaker devices
- Limit number of minimax enemies per level
- Use simpler AI types for background enemies

## Compatibility

### Browser Support
- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Mobile**: Reduced minimax depth recommended

### Game Versions
- Compatible with existing save files
- AI preferences not saved between sessions
- Original game behavior preserved when AI disabled 