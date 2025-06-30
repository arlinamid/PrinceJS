"use strict";

/**
 * AI-Based Level Generator for PrinceJS
 * Generates levels that are walkable, climbable, solvable, and have exits
 */
PrinceJS.LevelGenerator = {
  // Tile constants for easy reference
  TILES: {
    SPACE: 0,
    FLOOR: 1,
    SPIKES: 2,
    PILLAR: 3,
    GATE: 4,
    STUCK_BUTTON: 5,
    DROP_BUTTON: 6,
    TAPESTRY: 7,
    BOTTOM_BIG_PILLAR: 8,
    TOP_BIG_PILLAR: 9,
    POTION: 10,
    LOOSE_BOARD: 11,
    TAPESTRY_TOP: 12,
    MIRROR: 13,
    DEBRIS: 14,
    RAISE_BUTTON: 15,
    EXIT_LEFT: 16,
    EXIT_RIGHT: 17,
    CHOPPER: 18,
    TORCH: 19,
    WALL: 20,
    SKELETON: 21,
    SWORD: 22
  },

  POTIONS: {
    RECOVER: 1,
    ADD: 2,
    BUFFER: 3,
    FLIP: 4,
    DAMAGE: 5,
    SPECIAL: 6
  },

  /**
   * Generate a complete level with AI-driven design
   * @param {Object} options - Generation options
   * @returns {Object} Level JSON data
   */
  generateLevel: function(options = {}) {
    const config = {
      number: options.number || 1,
      name: options.name || `Generated Level ${options.number || 1}`,
      width: Math.max(3, Math.min(options.width || 5, 9)), // 3-9 rooms wide
      height: Math.max(3, Math.min(options.height || 4, 5)), // 3-5 rooms high
      type: options.type || 0, // 0 = dungeon, 1 = palace
      difficulty: options.difficulty || 'medium', // easy, medium, hard
      theme: options.theme || 'balanced' // balanced, combat, puzzle, parkour
    };

    // Initialize level structure
    const level = {
      number: config.number,
      name: config.name,
      size: {
        width: config.width,
        height: config.height
      },
      type: config.type,
      room: []
    };

    // Create room grid
    const roomGrid = this.createRoomGrid(config);
    
    // Generate base layout with paths
    this.generateBasePaths(roomGrid, config);
    
    // Add vertical connections (stairs, drops)
    this.addVerticalConnections(roomGrid, config);
    
    // Place start and exit
    this.placeStartAndExit(roomGrid, config);
    
    // Add puzzles and mechanisms
    this.addPuzzleElements(roomGrid, config);
    
    // Add enemies and items
    this.addGameplayElements(roomGrid, config);
    
    // Add decorative elements
    this.addDecorations(roomGrid, config);
    
    // Validate and fix connectivity
    this.validateAndFix(roomGrid, config);
    
    // Convert to level format
    level.room = this.convertToLevelFormat(roomGrid, config);
    
    console.log(`Generated level: ${config.name} (${config.width}x${config.height})`);
    return level;
  },

  /**
   * Create empty room grid
   */
  createRoomGrid: function(config) {
    const grid = [];
    let roomId = 1;
    
    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        const room = {
          id: roomId++,
          x: x,
          y: y,
          tiles: new Array(30).fill(null).map(() => ({ element: this.TILES.SPACE, modifier: 0 })),
          connections: { up: null, down: null, left: null, right: null },
          purpose: 'empty', // start, exit, combat, puzzle, transition
          hasPath: false,
          accessibility: { canReach: false, canExit: false }
        };
        grid.push(room);
      }
    }
    
    return grid;
  },

  /**
   * Generate base horizontal paths through rooms
   */
  generateBasePaths: function(roomGrid, config) {
    const width = config.width;
    const height = config.height;
    
    // Create main horizontal path on each floor
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const room = roomGrid[y * width + x];
        
        // Create floor on bottom row of each room
        for (let tileX = 0; tileX < 10; tileX++) {
          const tileIndex = 2 * 10 + tileX; // Bottom row
          room.tiles[tileIndex] = { element: this.TILES.FLOOR, modifier: 0 };
        }
        
        // Create basic walls
        for (let tileY = 0; tileY < 3; tileY++) {
          // Left wall
          room.tiles[tileY * 10 + 0] = { element: this.TILES.WALL, modifier: 0 };
          // Right wall
          room.tiles[tileY * 10 + 9] = { element: this.TILES.WALL, modifier: 0 };
        }
        
        room.hasPath = true;
      }
    }
    
    // Connect adjacent rooms horizontally
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width - 1; x++) {
        const currentRoom = roomGrid[y * width + x];
        const rightRoom = roomGrid[y * width + x + 1];
        
        currentRoom.connections.right = rightRoom.id;
        rightRoom.connections.left = currentRoom.id;
        
        // Remove wall between rooms
        currentRoom.tiles[2 * 10 + 9] = { element: this.TILES.FLOOR, modifier: 0 };
        rightRoom.tiles[2 * 10 + 0] = { element: this.TILES.FLOOR, modifier: 0 };
      }
    }
  },

  /**
   * Add vertical connections between floors
   */
  addVerticalConnections: function(roomGrid, config) {
    const width = config.width;
    const height = config.height;
    
    // Add stairs/platforms between floors
    for (let y = 0; y < height - 1; y++) {
      const connectionsToMake = Math.max(1, Math.floor(width / 2));
      const connectionPoints = [];
      
      // Choose random connection points
      for (let i = 0; i < connectionsToMake; i++) {
        const x = Math.floor(Math.random() * width);
        if (!connectionPoints.includes(x)) {
          connectionPoints.push(x);
        }
      }
      
      connectionPoints.forEach(x => {
        const upperRoom = roomGrid[y * width + x];
        const lowerRoom = roomGrid[(y + 1) * width + x];
        
        // Create connection
        upperRoom.connections.down = lowerRoom.id;
        lowerRoom.connections.up = upperRoom.id;
        
        // Create stairs or platform
        this.createVerticalConnection(upperRoom, lowerRoom, config);
      });
    }
  },

  /**
   * Create stairs or platform connection between two rooms
   */
  createVerticalConnection: function(upperRoom, lowerRoom, config) {
    const connectionType = Math.random();
    const position = Math.floor(Math.random() * 6) + 2; // Position 2-7
    
    if (connectionType < 0.4) {
      // Stairs down
      upperRoom.tiles[2 * 10 + position] = { element: this.TILES.FLOOR, modifier: 0 };
      upperRoom.tiles[2 * 10 + position + 1] = { element: this.TILES.FLOOR, modifier: 0 };
      lowerRoom.tiles[0 * 10 + position] = { element: this.TILES.FLOOR, modifier: 0 };
      lowerRoom.tiles[1 * 10 + position] = { element: this.TILES.FLOOR, modifier: 0 };
    } else if (connectionType < 0.7) {
      // Platform jump
      upperRoom.tiles[1 * 10 + position] = { element: this.TILES.FLOOR, modifier: 0 };
      lowerRoom.tiles[1 * 10 + position + 1] = { element: this.TILES.FLOOR, modifier: 0 };
    } else {
      // Drop down hole
      upperRoom.tiles[2 * 10 + position] = { element: this.TILES.SPACE, modifier: 0 };
      lowerRoom.tiles[0 * 10 + position] = { element: this.TILES.SPACE, modifier: 0 };
    }
  },

  /**
   * Place start position and exit door
   */
  placeStartAndExit: function(roomGrid, config) {
    const width = config.width;
    const height = config.height;
    
    // Start at bottom-left room
    const startRoom = roomGrid[(height - 1) * width + 0];
    startRoom.purpose = 'start';
    
    // Exit at top-right room or random upper room
    const exitX = width - 1;
    const exitY = Math.floor(Math.random() * Math.max(1, height - 1));
    const exitRoom = roomGrid[exitY * width + exitX];
    exitRoom.purpose = 'exit';
    
    // Place exit door
    const exitPos = Math.floor(Math.random() * 6) + 2;
    exitRoom.tiles[2 * 10 + exitPos] = { element: this.TILES.EXIT_RIGHT, modifier: 0 };
    
    // Ensure floor around exit
    exitRoom.tiles[2 * 10 + exitPos - 1] = { element: this.TILES.FLOOR, modifier: 0 };
    if (exitPos < 9) {
      exitRoom.tiles[2 * 10 + exitPos + 1] = { element: this.TILES.FLOOR, modifier: 0 };
    }
  },

  /**
   * Add puzzle elements like buttons, gates, and switches
   */
  addPuzzleElements: function(roomGrid, config) {
    const puzzleRooms = roomGrid.filter(room => 
      room.purpose === 'empty' && room.hasPath
    );
    
    const puzzleCount = Math.floor(puzzleRooms.length * 0.3); // 30% of rooms have puzzles
    
    for (let i = 0; i < puzzleCount && i < puzzleRooms.length; i++) {
      const room = puzzleRooms[i];
      room.purpose = 'puzzle';
      
      const puzzleType = Math.random();
      
      if (puzzleType < 0.4) {
        // Button and gate puzzle
        this.addButtonGatePuzzle(room, roomGrid, config);
      } else if (puzzleType < 0.7) {
        // Loose floor challenge
        this.addLooseFloorChallenge(room, config);
      } else {
        // Spikes and button timing
        this.addSpikesChallenge(room, config);
      }
    }
  },

  /**
   * Add button and gate puzzle
   */
  addButtonGatePuzzle: function(room, roomGrid, config) {
    const buttonPos = Math.floor(Math.random() * 6) + 2;
    const gatePos = Math.floor(Math.random() * 6) + 2;
    
    // Add button
    room.tiles[2 * 10 + buttonPos] = { 
      element: Math.random() < 0.5 ? this.TILES.RAISE_BUTTON : this.TILES.DROP_BUTTON, 
      modifier: room.id 
    };
    
    // Add gate (initially closed)
    room.tiles[1 * 10 + gatePos] = { element: this.TILES.GATE, modifier: 0 };
    
    // Ensure accessibility
    room.tiles[2 * 10 + buttonPos - 1] = { element: this.TILES.FLOOR, modifier: 0 };
    room.tiles[2 * 10 + buttonPos + 1] = { element: this.TILES.FLOOR, modifier: 0 };
  },

  /**
   * Add loose floor challenge
   */
  addLooseFloorChallenge: function(room, config) {
    const startPos = Math.floor(Math.random() * 4) + 2;
    const length = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < length && startPos + i < 8; i++) {
      room.tiles[2 * 10 + startPos + i] = { element: this.TILES.LOOSE_BOARD, modifier: 0 };
    }
    
    // Ensure safe platforms
    if (startPos > 1) {
      room.tiles[2 * 10 + startPos - 1] = { element: this.TILES.FLOOR, modifier: 0 };
    }
    if (startPos + length < 9) {
      room.tiles[2 * 10 + startPos + length] = { element: this.TILES.FLOOR, modifier: 0 };
    }
  },

  /**
   * Add spikes challenge
   */
  addSpikesChallenge: function(room, config) {
    const spikePos = Math.floor(Math.random() * 6) + 2;
    const buttonPos = spikePos + Math.floor(Math.random() * 3) + 2;
    
    // Add spikes
    room.tiles[2 * 10 + spikePos] = { element: this.TILES.SPIKES, modifier: 0 };
    
    // Add button to control spikes
    if (buttonPos < 9) {
      room.tiles[2 * 10 + buttonPos] = { element: this.TILES.DROP_BUTTON, modifier: spikePos };
    }
  },

  /**
   * Add gameplay elements like enemies, potions, and swords
   */
  addGameplayElements: function(roomGrid, config) {
    const gameplayRooms = roomGrid.filter(room => 
      room.purpose === 'empty' && room.hasPath
    );
    
    // Add potions
    const potionCount = Math.floor(gameplayRooms.length * 0.2);
    for (let i = 0; i < potionCount && i < gameplayRooms.length; i++) {
      const room = gameplayRooms[i];
      const pos = Math.floor(Math.random() * 6) + 2;
      const potionType = Math.floor(Math.random() * 6) + 1;
      
      room.tiles[1 * 10 + pos] = { element: this.TILES.POTION, modifier: potionType };
      room.tiles[2 * 10 + pos] = { element: this.TILES.FLOOR, modifier: 0 };
    }
    
    // Add swords
    if (config.difficulty !== 'easy') {
      const swordCount = Math.max(1, Math.floor(gameplayRooms.length * 0.1));
      for (let i = 0; i < swordCount && i < gameplayRooms.length; i++) {
        const room = gameplayRooms[Math.floor(Math.random() * gameplayRooms.length)];
        const pos = Math.floor(Math.random() * 6) + 2;
        
        room.tiles[1 * 10 + pos] = { element: this.TILES.SWORD, modifier: 0 };
        room.tiles[2 * 10 + pos] = { element: this.TILES.FLOOR, modifier: 0 };
      }
    }
    
    // Add guards/skeletons
    if (config.difficulty !== 'easy') {
      const enemyCount = Math.floor(gameplayRooms.length * 0.15);
      for (let i = 0; i < enemyCount && i < gameplayRooms.length; i++) {
        const room = gameplayRooms[Math.floor(Math.random() * gameplayRooms.length)];
        const pos = Math.floor(Math.random() * 6) + 2;
        
        room.tiles[1 * 10 + pos] = { element: this.TILES.SKELETON, modifier: 0 };
        room.tiles[2 * 10 + pos] = { element: this.TILES.FLOOR, modifier: 0 };
      }
    }
  },

  /**
   * Add decorative elements
   */
  addDecorations: function(roomGrid, config) {
    roomGrid.forEach(room => {
      // Add random torches
      if (Math.random() < 0.3) {
        const pos = Math.floor(Math.random() * 8) + 1;
        if (room.tiles[1 * 10 + pos].element === this.TILES.SPACE) {
          room.tiles[1 * 10 + pos] = { element: this.TILES.TORCH, modifier: 0 };
        }
      }
      
      // Add pillars for structure
      if (Math.random() < 0.2) {
        const pos = Math.floor(Math.random() * 8) + 1;
        if (room.tiles[1 * 10 + pos].element === this.TILES.SPACE) {
          room.tiles[1 * 10 + pos] = { element: this.TILES.PILLAR, modifier: 0 };
        }
      }
    });
  },

  /**
   * Validate level connectivity and fix issues
   */
  validateAndFix: function(roomGrid, config) {
    // Pathfinding validation
    this.validatePathfinding(roomGrid, config);
    
    // Fix isolated areas
    this.fixIsolatedAreas(roomGrid, config);
    
    // Ensure puzzle solvability
    this.validatePuzzles(roomGrid, config);
  },

  /**
   * Validate that all areas are reachable
   */
  validatePathfinding: function(roomGrid, config) {
    const width = config.width;
    const height = config.height;
    
    // Mark start room as reachable
    const startRoom = roomGrid[(height - 1) * width + 0];
    startRoom.accessibility.canReach = true;
    
    // Breadth-first search to mark reachable rooms
    const queue = [startRoom];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      // Check all connections
      ['up', 'down', 'left', 'right'].forEach(direction => {
        if (current.connections[direction]) {
          const connectedRoom = roomGrid.find(r => r.id === current.connections[direction]);
          if (connectedRoom && !connectedRoom.accessibility.canReach) {
            connectedRoom.accessibility.canReach = true;
            queue.push(connectedRoom);
          }
        }
      });
    }
  },

  /**
   * Fix isolated areas by adding connections
   */
  fixIsolatedAreas: function(roomGrid, config) {
    const unreachableRooms = roomGrid.filter(room => !room.accessibility.canReach);
    
    unreachableRooms.forEach(room => {
      // Find nearest reachable room and connect
      const reachableRooms = roomGrid.filter(r => r.accessibility.canReach);
      if (reachableRooms.length > 0) {
        const nearest = this.findNearestRoom(room, reachableRooms);
        this.createEmergencyConnection(room, nearest, config);
        room.accessibility.canReach = true;
      }
    });
  },

  /**
   * Find nearest room
   */
  findNearestRoom: function(sourceRoom, targetRooms) {
    let nearest = targetRooms[0];
    let minDistance = Math.abs(sourceRoom.x - nearest.x) + Math.abs(sourceRoom.y - nearest.y);
    
    targetRooms.forEach(room => {
      const distance = Math.abs(sourceRoom.x - room.x) + Math.abs(sourceRoom.y - room.y);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = room;
      }
    });
    
    return nearest;
  },

  /**
   * Create emergency connection between rooms
   */
  createEmergencyConnection: function(room1, room2, config) {
    const dx = room2.x - room1.x;
    const dy = room2.y - room1.y;
    
    if (Math.abs(dx) === 1 && dy === 0) {
      // Horizontal neighbors
      if (dx > 0) {
        room1.connections.right = room2.id;
        room2.connections.left = room1.id;
        room1.tiles[2 * 10 + 9] = { element: this.TILES.FLOOR, modifier: 0 };
        room2.tiles[2 * 10 + 0] = { element: this.TILES.FLOOR, modifier: 0 };
      } else {
        room1.connections.left = room2.id;
        room2.connections.right = room1.id;
        room1.tiles[2 * 10 + 0] = { element: this.TILES.FLOOR, modifier: 0 };
        room2.tiles[2 * 10 + 9] = { element: this.TILES.FLOOR, modifier: 0 };
      }
    } else if (dx === 0 && Math.abs(dy) === 1) {
      // Vertical neighbors
      if (dy > 0) {
        room1.connections.down = room2.id;
        room2.connections.up = room1.id;
      } else {
        room1.connections.up = room2.id;
        room2.connections.down = room1.id;
      }
      this.createVerticalConnection(dy < 0 ? room1 : room2, dy < 0 ? room2 : room1, config);
    }
  },

  /**
   * Validate puzzle solvability
   */
  validatePuzzles: function(roomGrid, config) {
    roomGrid.forEach(room => {
      if (room.purpose === 'puzzle') {
        // Ensure buttons are accessible
        for (let i = 0; i < 30; i++) {
          const tile = room.tiles[i];
          if ([this.TILES.RAISE_BUTTON, this.TILES.DROP_BUTTON].includes(tile.element)) {
            const x = i % 10;
            const y = Math.floor(i / 10);
            
            // Ensure floor access
            if (y === 2) { // Button on floor
              if (x > 0) room.tiles[y * 10 + x - 1] = { element: this.TILES.FLOOR, modifier: 0 };
              if (x < 9) room.tiles[y * 10 + x + 1] = { element: this.TILES.FLOOR, modifier: 0 };
            }
          }
        }
      }
    });
  },

  /**
   * Convert room grid to level format
   */
  convertToLevelFormat: function(roomGrid, config) {
    const levelRooms = [];
    const width = config.width;
    
    // Create empty slots for rooms
    for (let i = 0; i < width * config.height; i++) {
      levelRooms.push({ id: -1 });
    }
    
    // Fill in actual rooms
    roomGrid.forEach(room => {
      const index = room.y * width + room.x;
      levelRooms[index] = {
        id: room.id,
        tile: room.tiles
      };
    });
    
    return levelRooms;
  },

  /**
   * Generate a quick test level
   */
  generateTestLevel: function() {
    return this.generateLevel({
      number: 999,
      name: "AI Generated Test Level",
      width: 5,
      height: 3,
      type: 0,
      difficulty: 'medium',
      theme: 'balanced'
    });
  },

  /**
   * Generate a series of levels with increasing difficulty
   */
  generateLevelSeries: function(count = 5, startNumber = 100) {
    const levels = [];
    const difficulties = ['easy', 'easy', 'medium', 'medium', 'hard'];
    const themes = ['balanced', 'puzzle', 'combat', 'parkour', 'balanced'];
    
    for (let i = 0; i < count; i++) {
      const level = this.generateLevel({
        number: startNumber + i,
        name: `AI Level ${startNumber + i}`,
        width: Math.min(3 + Math.floor(i / 2), 7),
        height: Math.min(3 + Math.floor(i / 3), 5),
        difficulty: difficulties[i % difficulties.length],
        theme: themes[i % themes.length]
      });
      levels.push(level);
    }
    
    return levels;
  }
};

// Add to Utils for easy access
if (typeof PrinceJS !== 'undefined' && PrinceJS.Utils) {
  PrinceJS.Utils.generateLevel = PrinceJS.LevelGenerator.generateLevel.bind(PrinceJS.LevelGenerator);
  PrinceJS.Utils.generateTestLevel = PrinceJS.LevelGenerator.generateTestLevel.bind(PrinceJS.LevelGenerator);
  PrinceJS.Utils.generateLevelSeries = PrinceJS.LevelGenerator.generateLevelSeries.bind(PrinceJS.LevelGenerator);
}