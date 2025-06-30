/**
 * PrinceJS Enhanced - Utils Compatibility
 * Minimal utils for Phaser 3 scenes without Phaser 2 dependencies
 */

window.PrinceJS = window.PrinceJS || {};

PrinceJS.Utils = {
  // Query parameter handling
  applyQuery() {
    const query = new URLSearchParams(window.location.search);
    if (query.get("level") || query.get("l")) {
      const queryLevel = parseInt(query.get("level") || query.get("l"), 10);
      if ((!isNaN(queryLevel) && queryLevel >= 1 && queryLevel <= 14) || queryLevel >= 90) {
        PrinceJS.currentLevel = queryLevel;
      }
    }
    if (query.get("health") || query.get("h")) {
      const queryHealth = parseInt(query.get("health") || query.get("h"), 10);
      if (!isNaN(queryHealth) && queryHealth >= 3 && queryHealth <= 10) {
        PrinceJS.maxHealth = queryHealth;
      }
    }
    if (query.get("time") || query.get("t")) {
      const queryTime = parseInt(query.get("time") || query.get("t"), 10);
      if (!isNaN(queryTime) && queryTime >= 1 && queryTime <= 60) {
        PrinceJS.minutes = queryTime;
      }
    }
    if (query.get("strength") || query.get("s")) {
      const queryStrength = parseInt(query.get("strength") || query.get("s"), 10);
      if (!isNaN(queryStrength) && queryStrength >= 0 && queryStrength <= 100) {
        PrinceJS.strength = queryStrength;
      }
    }
    if (query.get("width") || query.get("w")) {
      const queryWidth = parseInt(query.get("width") || query.get("w"), 10);
      if (!isNaN(queryWidth) && queryWidth > 0) {
        PrinceJS.screenWidth = queryWidth;
      }
    }
    if (query.get("shortcut") || query.get("_")) {
      PrinceJS.shortcut = (query.get("shortcut") || query.get("_")) === "true";
    }
  },

  applyScreenWidth() {
    if (PrinceJS.screenWidth > 0) {
      const container = document.getElementById("gameContainer") || document.getElementById("legacyContainer");
      if (container) {
        container.style["max-width"] = PrinceJS.screenWidth + "px";
      }
    }
  },

  // Phaser 3 compatible pointer handling
  pointerPressed(scene) {
    // For Phaser 3, we use the scene's input system
    if (scene && scene.input) {
      const pointer = scene.input.activePointer;
      return pointer && pointer.justReleased;
    }
    return false;
  }
};

console.log("✅ PrinceJS Utils compatibility loaded");
