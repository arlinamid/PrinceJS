### 📁 **Main Game Files**

#### **1. Boot.js** - Game Bootstrap & Configuration

- **Purpose**: Initializes the game engine and global constants
- **Key Features**:
  - Defines screen dimensions (`320x200` scaled by factor of 2)
  - Sets up world bounds and block sizes
  - Initializes game state variables (health, time, level)
  - Configures gamepad controls mapping
  - Handles game restart functionality

#### **2. Preloader.js** - Asset Management

- **Purpose**: Loads all game assets (graphics, audio, animations)
- **Assets Loaded**:
  - Character sprites: Kid, Princess, Guards, Jaffar, Shadow, Skeleton
  - Environment: Dungeon/Palace tilesets, general UI elements
  - Audio: 22 music tracks + 33 sound effects
  - Animation data: JSON files for character movements
- **Features**: Loading screen with progress indication

#### **3. Game.js** - Main Game State Manager (860 lines!)

- **Purpose**: Core gameplay logic and level management
- **Key Responsibilities**:
  - Level loading and initialization
  - Enemy management and AI coordination
  - Special event handling for each level (1-14)
  - Camera and room management
  - Game timer and health system
  - Victory/defeat conditions
- **Special Events**: Level-specific scripted sequences (mirror scene, shadow encounters, etc.)

#### **4. Interface.js** - UI System

- **Purpose**: Manages game HUD and user interface
- **Features**:
  - Health indicators for player and enemies
  - Timer display and countdown warnings
  - Flash effects (red/green/yellow/white)
  - Game state messages ("Press to Continue", "Game Paused")
  - Level progression indicators

### 🎭 **Character System**

#### **5. Actor.js** - Base Character Class

- **Purpose**: Foundation for all animated characters
- **Features**:
  - Animation frame management
  - Command processing system (255 command slots)
  - Position and facing direction handling
  - Base movement and rendering logic

#### **6. Fighter.js** - Combat Character Base (1402 lines!)

- **Purpose**: Extended Actor class for combat-capable characters
- **Combat System**:
  - Sword combat mechanics (strike, block, advance, retreat)
  - Health and damage system
  - Opponent detection and engagement
  - Physics (gravity, velocity, collision)
  - Environmental hazards (spikes, choppers, falling)

#### **7. Kid.js** - Main Player Character (1763 lines!)

- **Purpose**: The Prince character with full player control
- **Unique Features**:
  - Keyboard/gamepad input handling
  - Special abilities (potion effects, shadow merging)
  - Level progression triggers
  - Complex movement system (running, jumping, climbing, hanging)
  - Interaction with environment objects

#### **8. Enemy.js** - AI-Controlled Opponents

- **Purpose**: Enemy characters with combat AI
- **AI Features**:
  - Skill-based behavior (12 different skill levels)
  - Combat probability calculations
  - Pathfinding and opponent tracking
  - Color variants for different guard types
  - Special behaviors for Jaffar and Shadow

#### **9. Mouse.js** - Special NPC Character

- **Purpose**: Small character for specific level events
- **Features**: Simple movement and button activation

### 🏰 **Level System**

#### **10. Level.js** - Level Data Management

- **Purpose**: Manages level structure and tile system
- **Features**:
  - Room-based level structure (10x3 tile rooms)
  - 32 different tile types (walls, floors, traps, objects)
  - Tile masking system for visual effects
  - Event system for interactive elements

#### **11. LevelBuilder.js** - Level Construction

- **Purpose**: Builds levels from JSON data
- **Features**:
  - Procedural wall pattern generation
  - Tile placement and linking
  - Room connection management
  - Special object initialization (gates, buttons, potions)

### 🎬 **Presentation Layer**

#### **12. Title.js** - Title Screen

- **Purpose**: Game introduction and menu
- **Features**: Animated title sequence with music

#### **13. Cutscene.js** - Story Sequences

- **Purpose**: Manages story cutscenes between levels
- **Features**:
  - Scripted actor movements
  - Music and sound synchronization
  - Scene transitions and effects

#### **14. Credits.js** - End Credits

- **Purpose**: Game completion sequence

#### **15. EndTitle.js** - Victory Screen

- **Purpose**: Final victory presentation

#### **16. Scene.js** - Cutscene Environment

- **Purpose**: Manages cutscene backgrounds and objects
- **Features**: Animated torches and decorative elements

### 🧩 **Tile System** (tiles/ directory)

The game uses a sophisticated tile-based level system with specialized tile classes:

#### **Base.js** - Foundation Tile Class

- **Purpose**: Base functionality for all tile types
- **Features**: Collision detection, masking, debris effects

#### **Interactive Tiles**:

- **Button.js**: Pressure plates that trigger events
- **Gate.js**: Animated gates (raise/lower mechanisms)
- **ExitDoor.js**: Level exit doors
- **Mirror.js**: Special mirror tile for shadow sequences

#### **Hazard Tiles**:

- **Spikes.js**: Deadly spike traps
- **Chopper.js**: Guillotine blade traps
- **Loose.js**: Collapsing floor tiles

#### **Object Tiles**:

- **Potion.js**: Health/special effect potions
- **Sword.js**: Weapon pickups
- **Skeleton.js**: Skeleton enemy spawners
- **Torch.js**: Animated fire effects
- **Star.js**: Decorative elements

### 🛠️ **Utility System**

#### **17. Utils.js** - Helper Functions

- **Purpose**: Common utility functions and game helpers
- **Features**:
  - Coordinate conversion functions
  - Time management utilities
  - Screen effects and flashing
  - Input handling helpers
  - URL parameter management

### 🎮 **Game Features**

#### **Combat System**:

- Real-time sword fighting with timing-based mechanics
- Block, strike, advance, retreat actions
- Enemy AI with 12 skill levels
- Health system with visual indicators

#### **Physics Engine**:

- Gravity and velocity simulation
- Collision detection with environment
- Character positioning and movement
- Room-to-room transitions

#### **Level Progression**:

- 14 main levels + custom level support
- Time-based gameplay (60-minute limit)
- Progressive difficulty scaling
- Special story events and sequences

#### **Audio System**:

- 22 music tracks for different situations
- 33 sound effects for actions and environment
- Context-sensitive audio triggers

### 🎯 **Technical Highlights**

1. **Modular Architecture**: Clean separation of concerns with specialized classes
2. **Command Pattern**: Flexible animation system using command processing
3. **State Management**: Comprehensive game state tracking and persistence
4. **Event System**: Decoupled communication between game components
5. **Asset Pipeline**: Efficient loading and management of game resources
