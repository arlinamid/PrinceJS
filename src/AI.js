"use strict";

/**
 * Advanced AI System for PrinceJS
 * Implements minimax algorithm and patrol behaviors
 */

PrinceJS.AI = {
  // AI Types
  TYPES: {
    BASIC: 'basic',           // Original behavior
    MINIMAX: 'minimax',       // Strategic minimax AI
    PATROL: 'patrol',         // Patrol behavior
    AGGRESSIVE: 'aggressive', // Always attacking
    DEFENSIVE: 'defensive',   // Prioritizes blocking/retreating
    HUNTER: 'hunter'          // Seeks player actively
  },

  // Game state evaluation weights
  WEIGHTS: {
    HEALTH_ADVANTAGE: 100,
    POSITION_ADVANTAGE: 50,
    DISTANCE_FACTOR: 30,
    SWORD_ADVANTAGE: 80,
    ATTACK_OPPORTUNITY: 60
  },

  // Minimax search depth
  MAX_DEPTH: 3,

  /**
   * Main AI decision making function
   * @param {PrinceJS.Enemy} enemy - The enemy making the decision
   * @returns {string} - The action to take
   */
  makeDecision: function(enemy) {
    if (!enemy.opponent || !enemy.alive || !enemy.opponent.alive) {
      return this.getIdleAction(enemy);
    }

    switch (enemy.aiType || this.TYPES.BASIC) {
      case this.TYPES.MINIMAX:
        return this.minimaxDecision(enemy);
      case this.TYPES.PATROL:
        return this.patrolDecision(enemy);
      case this.TYPES.AGGRESSIVE:
        return this.aggressiveDecision(enemy);
      case this.TYPES.DEFENSIVE:
        return this.defensiveDecision(enemy);
      case this.TYPES.HUNTER:
        return this.hunterDecision(enemy);
      default:
        return this.basicDecision(enemy);
    }
  },

  /**
   * Minimax algorithm implementation
   * @param {PrinceJS.Enemy} enemy - The enemy
   * @returns {string} - Best action
   */
  minimaxDecision: function(enemy) {
    const gameState = this.createGameState(enemy);
    const result = this.minimax(gameState, this.MAX_DEPTH, true, -Infinity, Infinity);
    return result.action || this.basicDecision(enemy);
  },

  /**
   * Minimax algorithm with alpha-beta pruning
   * @param {Object} state - Game state
   * @param {number} depth - Search depth
   * @param {boolean} maximizing - Whether this is maximizing player
   * @param {number} alpha - Alpha value for pruning
   * @param {number} beta - Beta value for pruning
   * @returns {Object} - {score: number, action: string}
   */
  minimax: function(state, depth, maximizing, alpha, beta) {
    if (depth === 0 || this.isTerminalState(state)) {
      return { score: this.evaluateState(state), action: null };
    }

    const actions = this.getPossibleActions(state);
    let bestAction = null;

    if (maximizing) {
      let maxScore = -Infinity;

      for (const action of actions) {
        const newState = this.simulateAction(state, action, true);
        const result = this.minimax(newState, depth - 1, false, alpha, beta);

        if (result.score > maxScore) {
          maxScore = result.score;
          bestAction = action;
        }

        alpha = Math.max(alpha, result.score);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }

      return { score: maxScore, action: bestAction };
    } else {
      let minScore = Infinity;

      for (const action of actions) {
        const newState = this.simulateAction(state, action, false);
        const result = this.minimax(newState, depth - 1, true, alpha, beta);

        if (result.score < minScore) {
          minScore = result.score;
          bestAction = action;
        }

        beta = Math.min(beta, result.score);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }

      return { score: minScore, action: bestAction };
    }
  },

  /**
   * Create game state representation
   * @param {PrinceJS.Enemy} enemy - The enemy
   * @returns {Object} - Game state
   */
  createGameState: function(enemy) {
    return {
      enemy: {
        x: enemy.charX,
        y: enemy.charY,
        blockX: enemy.charBlockX,
        blockY: enemy.charBlockY,
        room: enemy.room,
        health: enemy.health,
        face: enemy.charFace,
        hasSword: enemy.hasSword,
        swordDrawn: enemy.swordDrawn,
        action: enemy.action
      },
      player: {
        x: enemy.opponent.charX,
        y: enemy.opponent.charY,
        blockX: enemy.opponent.charBlockX,
        blockY: enemy.opponent.charBlockY,
        room: enemy.opponent.room,
        health: enemy.opponent.health,
        face: enemy.opponent.charFace,
        hasSword: enemy.opponent.hasSword,
        swordDrawn: enemy.opponent.swordDrawn,
        action: enemy.opponent.action
      },
      distance: enemy.opponentDistance()
    };
  },

  /**
   * Evaluate game state for minimax
   * @param {Object} state - Game state
   * @returns {number} - State evaluation score
   */
  evaluateState: function(state) {
    let score = 0;

    // Health advantage
    const healthDiff = state.enemy.health - state.player.health;
    score += healthDiff * this.WEIGHTS.HEALTH_ADVANTAGE;

    // Position advantage
    if (state.enemy.room === state.player.room) {
      if (state.enemy.blockY < state.player.blockY) {
        score += this.WEIGHTS.POSITION_ADVANTAGE; // Higher ground advantage
      }

      // Distance factor
      const distance = Math.abs(state.distance);
      if (distance < 20) {
        score += this.WEIGHTS.DISTANCE_FACTOR; // Close combat advantage
      } else if (distance > 50) {
        score -= this.WEIGHTS.DISTANCE_FACTOR; // Too far away
      }
    }

    // Sword advantage
    if (state.enemy.hasSword && !state.player.hasSword) {
      score += this.WEIGHTS.SWORD_ADVANTAGE;
    } else if (!state.enemy.hasSword && state.player.hasSword) {
      score -= this.WEIGHTS.SWORD_ADVANTAGE;
    }

    // Attack opportunity
    if (state.enemy.swordDrawn && state.distance > 0 && state.distance < 15) {
      score += this.WEIGHTS.ATTACK_OPPORTUNITY;
    }

    return score;
  },

  /**
   * Get possible actions for current state
   * @param {Object} state - Game state
   * @returns {Array} - Array of possible actions
   */
  getPossibleActions: function(state) {
    const actions = [];

    if (state.enemy.swordDrawn) {
      actions.push('advance', 'retreat', 'strike', 'block', 'stand');
    } else {
      actions.push('engarde', 'advance', 'retreat', 'stand');
    }

    return actions;
  },

  /**
   * Simulate action and return new state
   * @param {Object} state - Current state
   * @param {string} action - Action to simulate
   * @param {boolean} isEnemy - Whether this is enemy's action
   * @returns {Object} - New state after action
   */
  simulateAction: function(state, action, isEnemy) {
    // Safe deep copy without circular references
    const newState = {
      enemy: { ...state.enemy },
      player: { ...state.player },
      distance: state.distance
    };

    if (isEnemy) {
      switch (action) {
        case 'advance':
          newState.enemy.x += newState.enemy.face * 7;
          newState.distance -= 7;
          break;
        case 'retreat':
          newState.enemy.x -= newState.enemy.face * 7;
          newState.distance += 7;
          break;
        case 'strike':
          if (Math.abs(newState.distance) < 15) {
            newState.player.health -= 1; // Potential damage
          }
          break;
        case 'engarde':
          newState.enemy.swordDrawn = true;
          break;
      }
    }

    return newState;
  },

  /**
   * Check if state is terminal
   * @param {Object} state - Game state
   * @returns {boolean} - Whether state is terminal
   */
  isTerminalState: function(state) {
    return state.enemy.health <= 0 || state.player.health <= 0;
  },

  /**
   * Patrol behavior implementation
   * @param {PrinceJS.Enemy} enemy - The enemy
   * @returns {string} - Action to take
   */
  patrolDecision: function(enemy) {
    // Initialize patrol data if not exists
    if (!enemy.patrolData) {
      enemy.patrolData = {
        startX: enemy.charBlockX,
        startRoom: enemy.room,
        patrolRange: 3,
        direction: enemy.charFace,
        waitTime: 0,
        alertLevel: 0
      };
    }

    const patrol = enemy.patrolData;

    // Check if player is detected
    if (this.canDetectPlayer(enemy)) {
      patrol.alertLevel = Math.min(patrol.alertLevel + 1, 100);

      if (patrol.alertLevel > 50) {
        // Switch to combat mode
        return this.aggressiveDecision(enemy);
      }
    } else {
      patrol.alertLevel = Math.max(patrol.alertLevel - 1, 0);
    }

    // Patrol behavior
    if (patrol.waitTime > 0) {
      patrol.waitTime--;
      return 'stand';
    }

    const distanceFromStart = Math.abs(enemy.charBlockX - patrol.startX);

    if (distanceFromStart >= patrol.patrolRange) {
      // Turn around
      patrol.direction *= -1;
      patrol.waitTime = 30; // Wait before changing direction
      return 'turn';
    }

    // Continue patrolling
    if (enemy.charFace !== patrol.direction) {
      return 'turn';
    }

    return 'advance';
  },

  /**
   * Aggressive AI behavior
   * @param {PrinceJS.Enemy} enemy - The enemy
   * @returns {string} - Action to take
   */
  aggressiveDecision: function(enemy) {
    const distance = enemy.opponentDistance();

    if (!enemy.swordDrawn && enemy.hasSword) {
      return 'engarde';
    }

    if (Math.abs(distance) < 15) {
      // In striking range
      if (Math.random() < 0.7) {
        return 'strike';
      }
    }

    if (distance > 35) {
      return 'advance';
    } else if (distance < -20) {
      return 'turn';
    } else if (distance < 12) {
      if (Math.random() < 0.3) {
        return 'retreat';
      } else {
        return 'strike';
      }
    }

    return 'advance';
  },

  /**
   * Defensive AI behavior
   * @param {PrinceJS.Enemy} enemy - The enemy
   * @returns {string} - Action to take
   */
  defensiveDecision: function(enemy) {
    const distance = enemy.opponentDistance();

    if (!enemy.swordDrawn && enemy.hasSword) {
      return 'engarde';
    }

    // Prioritize blocking and retreating
    if (Math.abs(distance) < 20) {
      if (enemy.opponent.action.includes('strike') || enemy.opponent.action.includes('advance')) {
        if (Math.random() < 0.8) {
          return 'block';
        } else {
          return 'retreat';
        }
      }
    }

    if (distance < 15 && enemy.health < enemy.opponent.health) {
      return 'retreat';
    }

    return this.basicDecision(enemy);
  },

  /**
   * Hunter AI behavior - actively seeks player
   * @param {PrinceJS.Enemy} enemy - The enemy
   * @returns {string} - Action to take
   */
  hunterDecision: function(enemy) {
    // If not in same room, move towards player
    if (enemy.room !== enemy.opponent.room) {
      return this.seekPlayer(enemy);
    }

    // If in same room, use aggressive tactics
    return this.aggressiveDecision(enemy);
  },

  /**
   * Basic AI decision (original behavior)
   * @param {PrinceJS.Enemy} enemy - The enemy
   * @returns {string} - Action to take
   */
  basicDecision: function(enemy) {
    const distance = enemy.opponentDistance();

    if (!enemy.swordDrawn) {
      if (enemy.canReachOpponent(enemy.lookBelow) || enemy.canSeeOpponent(enemy.lookBelow)) {
        if (!enemy.sneakUp || enemy.facingOpponent()) {
          return 'engarde';
        }
      }
      return 'stand';
    }

    if (distance >= 35) {
      return 'advance';
    } else if (distance < -20) {
      return 'turn';
    } else if (distance < 12) {
      if (enemy.charFace === enemy.opponent.charFace ||
          !['engarde', 'advance', 'retreat'].includes(enemy.opponent.action)) {
        return 'retreat';
      } else {
        return 'advance';
      }
    } else {
      // In range
      if (enemy.refracTimer === 0) {
        if (Math.random() * 256 < enemy.strikeProbability) {
          return 'strike';
        }
      }

      if (Math.random() * 256 < enemy.advanceProbability) {
        return 'advance';
      } else {
        return 'retreat';
      }
    }
  },

  /**
   * Get idle action when no opponent
   * @param {PrinceJS.Enemy} enemy - The enemy
   * @returns {string} - Idle action
   */
  getIdleAction: function(enemy) {
    if (enemy.aiType === this.TYPES.PATROL) {
      return this.patrolDecision(enemy);
    }
    return 'stand';
  },

  /**
   * Check if enemy can detect player
   * @param {PrinceJS.Enemy} enemy - The enemy
   * @returns {boolean} - Whether player is detected
   */
  canDetectPlayer: function(enemy) {
    if (!enemy.opponent) return false;

    const sameRoom = enemy.room === enemy.opponent.room;
    const distance = Math.abs(enemy.opponentDistance());
    const sameLevel = enemy.charBlockY === enemy.opponent.charBlockY;

    // Detection based on distance and line of sight
    if (sameRoom && sameLevel && distance < 100) {
      return true;
    }

    // Can hear player if very close
    if (distance < 30) {
      return true;
    }

    return false;
  },

  /**
   * Seek player behavior for hunter AI
   * @param {PrinceJS.Enemy} enemy - The enemy
   * @returns {string} - Action to take
   */
  seekPlayer: function(enemy) {
    // Simple pathfinding towards player's room
    const playerRoom = enemy.opponent.room;
    const currentRoom = enemy.room;

    if (currentRoom < playerRoom) {
      return 'advance'; // Move right
    } else if (currentRoom > playerRoom) {
      if (enemy.charFace === 1) {
        return 'turn';
      }
      return 'advance'; // Move left
    }

    return 'stand';
  },

  /**
   * Set AI type for an enemy
   * @param {PrinceJS.Enemy} enemy - The enemy
   * @param {string} aiType - AI type from PrinceJS.AI.TYPES
   */
  setAIType: function(enemy, aiType) {
    enemy.aiType = aiType;

    // Initialize specific AI data
    switch (aiType) {
      case this.TYPES.PATROL:
        enemy.patrolData = {
          startX: enemy.charBlockX,
          startRoom: enemy.room,
          patrolRange: 3,
          direction: enemy.charFace,
          waitTime: 0,
          alertLevel: 0
        };
        break;
      case this.TYPES.MINIMAX:
        enemy.searchDepth = this.MAX_DEPTH;
        break;
    }
  },

  /**
   * Update AI parameters for difficulty scaling
   * @param {PrinceJS.Enemy} enemy - The enemy
   * @param {number} level - Current level
   */
  updateAIForLevel: function(enemy, level) {
    // Scale AI difficulty based on level
    if (level >= 10) {
      enemy.searchDepth = Math.min(this.MAX_DEPTH + 1, 4);
      enemy.strikeProbability = Math.min(enemy.strikeProbability * 1.2, 255);
    }

    if (level >= 5) {
      // Increase detection range for patrol
      if (enemy.patrolData) {
        enemy.patrolData.patrolRange = Math.min(enemy.patrolData.patrolRange + 1, 5);
      }
    }
  }
};
