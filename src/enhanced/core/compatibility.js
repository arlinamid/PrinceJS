/**
 * PrinceJS Enhanced - Compatibility Layer
 * Provides PrinceJS namespace and utilities without Phaser 2 dependencies
 */

// Initialize PrinceJS namespace if not already created
window.PrinceJS = window.PrinceJS || {};

// Copy constants from Boot.js
PrinceJS.SCALE_FACTOR = 2;

PrinceJS.SCREEN_WIDTH = 320;
PrinceJS.SCREEN_HEIGHT = 200;

PrinceJS.WORLD_WIDTH = PrinceJS.SCREEN_WIDTH * PrinceJS.SCALE_FACTOR;
PrinceJS.WORLD_HEIGHT = PrinceJS.SCREEN_HEIGHT * PrinceJS.SCALE_FACTOR;
PrinceJS.WORLD_RATIO = PrinceJS.WORLD_WIDTH / PrinceJS.WORLD_HEIGHT;

PrinceJS.BLOCK_WIDTH = 32;
PrinceJS.BLOCK_HEIGHT = 63;

PrinceJS.ROOM_HEIGHT = PrinceJS.BLOCK_HEIGHT * 3;
PrinceJS.ROOM_WIDTH = PrinceJS.SCREEN_WIDTH;

PrinceJS.UI_HEIGHT = 8;

PrinceJS.SKIP_TITLE = false;
PrinceJS.SKIP_CUTSCENES = false;

// Initialize game state
PrinceJS.Init = function () {
  PrinceJS.currentLevel = 1;
  PrinceJS.maxHealth = 3;
  PrinceJS.currentHealth = null;
  PrinceJS.minutes = 60;
  PrinceJS.startTime = undefined;
  PrinceJS.endTime = undefined;
  PrinceJS.strength = 100;
  PrinceJS.screenWidth = 0;
  PrinceJS.shortcut = false;
  PrinceJS.danger = null;
  PrinceJS.skipShowLevel = false;
};

// Gamepad constants
PrinceJS.Gamepad = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  L: 4,
  R: 5,
  ZL: 6,
  ZR: 7,
  Minus: 8,
  Plus: 9,
  DPadU: 12,
  DPadD: 13,
  DPadL: 14,
  DPadR: 15,
  Axis: {
    LX: 0,
    LY: 1,
    RX: 2,
    RY: 3
  }
};

// Initialize on load
PrinceJS.Init();

console.log("✅ PrinceJS compatibility layer loaded");
