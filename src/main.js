/**
 * PrinceJS - Main Entry Point
 * Enhanced Prince of Persia implementation
 */

// For Phase 1, we'll use the legacy Phaser script approach
// This will be replaced with proper Phaser 3.9 ES6 imports in Phase 2

console.log("%cSource: https://github.com/oklemenz/PrinceJS", "color: blue; font-size:20px; font-weight: bold;");
console.log("%cEnhanced Version - Phase 1 Development", "color: green; font-size:14px; font-weight: bold;");

/**
 * Load legacy scripts dynamically
 */
async function loadHybridScripts() {
  const scripts = [
    "/lib/phaser_v3.9.js", // Load Phaser 3.9 only
    "/src/enhanced/core/compatibility.js", // PrinceJS namespace and constants
    "/src/enhanced/core/utils-compat.js", // Minimal utils for Phaser 3
    "/src/enhanced/scenes/BootScene.js", // Enhanced Phaser 3 BootScene
    "/src/enhanced/scenes/PreloaderScene.js" // Enhanced Phaser 3 PreloaderScene
    // Other legacy scripts will be loaded only if needed
    /*'/src/Preloader.js',
    '/src/Game.js',
    '/src/Title.js',
    '/src/EndTitle.js',
    '/src/Credits.js',
    '/src/Cutscene.js',
    '/src/Scene.js',
    '/src/Level.js',
    '/src/LevelBuilder.js',
    '/src/Actor.js',
    '/src/Fighter.js',
    '/src/Enemy.js',
    '/src/Kid.js',
    '/src/Mouse.js',
    '/src/Interface.js',
    '/src/tiles/Base.js',
    '/src/tiles/Button.js',
    '/src/tiles/Chopper.js',
    '/src/tiles/Clock.js',
    '/src/tiles/ExitDoor.js',
    '/src/tiles/Gate.js',
    '/src/tiles/Loose.js',
    '/src/tiles/Mirror.js',
    '/src/tiles/Potion.js',
    '/src/tiles/Skeleton.js',
    '/src/tiles/Spikes.js',
    '/src/tiles/Star.js',
    '/src/tiles/Sword.js',
    '/src/tiles/Torch.js'*/
  ];

  // Load scripts sequentially to maintain dependencies
  for (const src of scripts) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}

/**
 * Initialize the game when everything is loaded
 */
async function initializeGame() {
  try {
    // Load all scripts first (hybrid approach)
    await loadHybridScripts();

    // Check if PrinceJS namespace exists
    if (typeof window.PrinceJS === "undefined") {
      console.error("PrinceJS namespace not found after loading scripts.");
      console.log(
        "Available namespaces:",
        Object.keys(window).filter((key) => key.includes("Prince"))
      );
      return;
    }

    console.log("✅ PrinceJS namespace loaded successfully");
    console.log("Available PrinceJS modules:", Object.keys(window.PrinceJS));

    // Check if enhanced scenes are available
    if (window.PrinceJS.Enhanced && window.PrinceJS.Enhanced.BootScene) {
      console.log("🎯 Enhanced Phaser 3 scenes detected! Starting modern game...");
      initializeEnhancedGame();
    } else {
      console.log("⚠️ Enhanced scenes not available, falling back to legacy...");
      initializeLegacySystem();
    }

    console.log("🎮 PrinceJS Enhanced Version Started!");
  } catch (error) {
    console.error("Failed to load scripts:", error);
  }
}

/**
 * Initialize the enhanced Phaser 3 game system
 */
function initializeEnhancedGame() {
  console.log("🚀 Initializing Phaser 3 enhanced game system...");

  // Create Phaser 3 game configuration
  const gameConfig = {
    type: Phaser.AUTO,
    width: 640,
    height: 400,
    parent: "gameContainer",
    backgroundColor: "#000000",

    // Scene configuration
    scene: [
      PrinceJS.Enhanced.BootScene,
      PrinceJS.Enhanced.PreloaderScene
      // PrinceJS.Enhanced.GameScene,  // Next to migrate
      // etc.
    ],

    // Input configuration
    input: {
      keyboard: true,
      gamepad: true,
      mouse: true,
      touch: true
    },

    // Audio configuration
    audio: {
      disableWebAudio: false
    },

    // Render configuration
    render: {
      pixelArt: true,
      antialias: false
    },

    // Scale configuration
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 640,
      height: 400
    },

    // Physics configuration (for future use)
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    }
  };

  // Create Phaser 3 game instance
  const game = new Phaser.Game(gameConfig);

  // Store reference for migration tracking
  window.PrinceJS.enhancedGame = game;

  // Make sure the Phaser 3 container is visible
  document.getElementById("gameContainer").style.display = "block";
  document.getElementById("legacyContainer").style.display = "none";

  console.log("✅ Phaser 3.9 enhanced game initialized successfully!");
}

/**
 * Load legacy Phaser 2 scripts when needed
 */
async function loadLegacyScripts() {
  console.log("📦 Loading legacy Phaser 2 scripts for fallback...");

  const legacyScripts = [
    "/lib/phaser.min.js", // Phaser 2.6.2
    "/src/Boot.js",
    "/src/Utils.js",
    "/src/Preloader.js",
    "/src/Game.js",
    "/src/Title.js",
    "/src/EndTitle.js",
    "/src/Credits.js",
    "/src/Cutscene.js",
    "/src/Scene.js",
    "/src/Level.js",
    "/src/LevelBuilder.js",
    "/src/Actor.js",
    "/src/Fighter.js",
    "/src/Enemy.js",
    "/src/Kid.js",
    "/src/Mouse.js",
    "/src/Interface.js",
    "/src/tiles/Base.js",
    "/src/tiles/Button.js",
    "/src/tiles/Chopper.js",
    "/src/tiles/Clock.js",
    "/src/tiles/ExitDoor.js",
    "/src/tiles/Gate.js",
    "/src/tiles/Loose.js",
    "/src/tiles/Mirror.js",
    "/src/tiles/Potion.js",
    "/src/tiles/Skeleton.js",
    "/src/tiles/Spikes.js",
    "/src/tiles/Star.js",
    "/src/tiles/Sword.js",
    "/src/tiles/Torch.js"
  ];

  // Load scripts sequentially
  for (const src of legacyScripts) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  console.log("✅ Legacy scripts loaded successfully");
}

/**
 * Temporary legacy initialization for Phase 2.1
 * This will be removed as we complete scene migration
 */
async function initializeLegacySystem() {
  console.log("🔄 Initializing legacy Phaser 2 system for compatibility...");

  // First, hide the Phaser 3 container and show legacy container
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("legacyContainer").style.display = "block";

  // Stop Phaser 3 game if running
  if (window.PrinceJS.enhancedGame) {
    window.PrinceJS.enhancedGame.destroy(true);
  }

  // Load legacy scripts first
  await loadLegacyScripts();

  // Create legacy Phaser 2 game instance for compatibility
  const legacyGame = new Phaser.Game(640, 400, Phaser.AUTO, "legacyContainer", null, false, false);

  // Add legacy game states
  legacyGame.state.add("Boot", PrinceJS.Boot);
  legacyGame.state.add("Preloader", PrinceJS.Preloader);
  legacyGame.state.add("Game", PrinceJS.Game);
  legacyGame.state.add("Title", PrinceJS.Title);
  legacyGame.state.add("EndTitle", PrinceJS.EndTitle);
  legacyGame.state.add("Credits", PrinceJS.Credits);
  legacyGame.state.add("Cutscene", PrinceJS.Cutscene);

  // Start the legacy game
  legacyGame.state.start("Boot");

  // Store reference for future migration
  window.PrinceJS.legacyGame = legacyGame;

  console.log("✅ Legacy system initialized. Game should work as before.");
}

// Make initializeLegacySystem globally available
window.initializeLegacySystem = initializeLegacySystem;

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGame);
} else {
  initializeGame();
}
