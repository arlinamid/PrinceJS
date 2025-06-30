# Cheat System Documentation - PrinceJS

This document describes the comprehensive cheat menu system added to the PrinceJS game.

## Overview

The cheat system provides both an interactive graphical menu and quick keyboard shortcuts for testing, debugging, and enhancing gameplay. It works in both the title screen and during gameplay.

## Activation

### Main Cheat Menu
- **F1** - Toggle the cheat menu (works on both title screen and in-game)

### Quick Cheat Keys (In-Game Only)
- **H** - Restore full health instantly
- **T** - Reset time to 60 minutes
- **N** - Skip to next level

## Cheat Menu Features

### Universal Cheats (Available Everywhere)
- **Infinite Health** - Player health never decreases
- **Infinite Time** - Timer stays at 60 minutes
- **God Mode** - Complete invincibility (enhanced version of infinite health)
- **Toggle Flip** - Flip the game screen upside down

### In-Game Only Cheats
- **Level Skip** - Immediately advance to the next level
- **Add Life** - Add one health point to current health
- **Full Health** - Instantly restore health to maximum
- **Get Sword** - Give the player a sword if they don't have one
- **Open Exit** - Open the exit door for the current level
- **Kill Enemies** - Defeat all enemies in the current level

### AI Controls (In-Game Only)
- **Set Enemy AI** - Choose AI type for all enemies (Basic, Minimax, Patrol, Aggressive, Defensive, Hunter)
- **Toggle Minimax AI** - Enable/disable strategic minimax AI for all enemies
- **Toggle Patrol AI** - Enable/disable patrol behavior for all enemies
- **Show AI Debug** - Display AI decision-making information (future feature)

### Title Screen Only Cheats
- **Select Level** - Jump to any level (1-14 or 90+)
- **Max Health** - Set maximum health (3-10)
- **Reset Game** - Reset all progress and cheats

## Menu Navigation

- **↑/↓ or W/S** - Navigate through menu options
- **Enter or Space** - Select/toggle the highlighted option
- **ESC** - Close the cheat menu
- **F1** - Toggle menu open/closed

## Technical Implementation

### Files Modified
- `src/Utils.js` - Main cheat system implementation
- `src/Game.js` - In-game cheat integration and keyboard handling
- `src/Title.js` - Title screen cheat integration
- `src/Interface.js` - Cheat notification system

### Key Components

#### PrinceJS.Utils.CheatMenu
The main cheat menu object that handles:
- Menu creation and display
- Navigation and selection
- Context switching between game/title modes
- Cheat execution and notifications

#### Cheat State Storage
Cheats are stored in the global `PrinceJS.cheats` object:
```javascript
PrinceJS.cheats = {
  infiniteHealth: boolean,
  infiniteTime: boolean,
  godMode: boolean
}
```

#### Global Game Reference
The active game instance is stored in `window.PrinceJS_Game_Instance` for cheat access.

### Menu Styling
The cheat menu features a retro terminal-style appearance:
- Black background with white borders
- Monospace font
- Yellow highlights for selected items
- Fixed position overlay that doesn't interfere with gameplay

## Usage Examples

### Quick Health Restore
1. Press **H** during gameplay for instant full health

### Level Testing
1. At title screen, press **F1**
2. Select "Select Level"
3. Enter desired level number
4. Press Enter to confirm

### God Mode Gaming
1. Press **F1** during gameplay
2. Navigate to "God Mode"
3. Press Enter to toggle ON
4. Player becomes invincible

### Enemy Testing
1. Start any level with enemies
2. Press **F1**
3. Select "Kill Enemies"
4. All enemies are instantly defeated

## Notifications

The system provides visual feedback for all cheat actions:
- In-game: Notifications appear in the game's UI text area
- Title screen: Temporary overlay notifications
- Status display: Active cheats are shown in the UI when no other text is displayed

## Cheat Persistence

- Toggle cheats (Infinite Health, Time, God Mode) persist across levels
- Action cheats (Add Life, Kill Enemies) are immediate and don't persist
- Title screen settings (Level, Max Health) affect new games

## Developer Notes

### Adding New Cheats
1. Add item to `getItems()` function in `PrinceJS.Utils.CheatMenu`
2. Implement action in `executeAction()` method
3. Add notification message for user feedback

### Cheat Safety
- All cheats include proper null checks and validation
- Menu state is properly managed to prevent conflicts
- Cheats don't interfere with core game mechanics
- Game input is completely blocked when cheat menu is open
- Game world updates are paused while menu is active

## Keyboard Reference

| Key | Action | Context |
|-----|--------|---------|
| F1 | Toggle Cheat Menu | Always |
| H | Quick Health Restore | In-Game |
| T | Quick Time Reset | In-Game |
| N | Quick Level Skip | In-Game |
| ↑/↓ | Navigate Menu | Menu Open |
| Enter/Space | Select Item | Menu Open |
| ESC | Close Menu | Menu Open |

## Troubleshooting

### Menu Not Appearing
- Ensure F1 key is not captured by browser
- Check console for JavaScript errors
- Verify game is properly loaded

### Cheats Not Working
- Check that you're in the correct context (game vs title)
- Verify the cheat applies to current game state
- Check browser console for error messages

### Visual Issues
- Menu uses high z-index (10000) to appear above game
- If menu is hidden, check CSS conflicts
- Menu auto-adjusts to different screen sizes

### Input Issues
- All game input is blocked when cheat menu is open (by design)
- Character will not respond to movement keys while menu is active
- Game world is paused during cheat menu usage

## Advanced AI System Integration

The cheat system now includes controls for the advanced AI system:

### AI Types Available
- **Basic**: Original game behavior (default)
- **Minimax**: Strategic AI using minimax algorithm with 3-move lookahead
- **Patrol**: Guards patrol areas and become alert when detecting players
- **Aggressive**: Always attacks with 70% strike probability
- **Defensive**: Prioritizes blocking (80% probability) and retreating
- **Hunter**: Actively seeks player across rooms

### AI Configuration
Use "Set Enemy AI" to choose from the 6 available AI types for all enemies in the current level. Changes take effect immediately.

### AI Testing
- **Toggle Minimax AI**: Quick switch for testing strategic AI
- **Toggle Patrol AI**: Quick switch for testing patrol behaviors
- Individual enemies retain their AI settings when toggling

### Performance Notes
- Minimax AI uses more CPU (~1-2ms per decision)
- Patrol AI is lightweight (~0.1ms per decision)
- AI debug mode will show decision-making process (when implemented)

For detailed AI documentation, see `AI_SYSTEM.md`.

## Future Enhancements

Potential additions to the cheat system:
- Save/load cheat configurations
- Custom key bindings
- Network-safe cheats for multiplayer
- AI debug information display
- Level editor integration 