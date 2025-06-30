// Load Phaser 2.x library first as a script
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Create the global PrinceJS object manually before loading modules
function initializePrinceJS() {
  // Create the global PrinceJS object (mirroring Boot.js structure)
  window.PrinceJS = {};

  const PrinceJS = window.PrinceJS;

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
    Axis: { LX: 0, LY: 1, RX: 2, RY: 3 }
  };

  PrinceJS.Restart = function () {
    PrinceJS.Utils.clearQuery();
    PrinceJS.Init();
    PrinceJS.Utils.applyQuery();
  };
}

// Load modules sequentially to ensure proper dependency order
async function loadGameModules() {
  try {
    // Load Boot.js first to add the Boot state
    await import('./Boot.js');

    // Load core modules
    await import('./Utils.js');
    await import('./AI.js');

    // Load game state modules
    await import('./Preloader.js');
    await import('./Game.js');
    await import('./Title.js');
    await import('./EndTitle.js');
    await import('./Credits.js');
    await import('./Cutscene.js');
    await import('./Scene.js');

    // Load game logic modules
    await import('./Level.js');
    await import('./LevelBuilder.js');
    await import('./LevelGenerator.js');
    await import('./Interface.js');

    // Load actor modules
    await import('./Actor.js');
    await import('./Fighter.js');
    await import('./Enemy.js');
    await import('./Kid.js');
    await import('./Mouse.js');

    // Load tile modules
    await import('./tiles/Base.js');
    await import('./tiles/Button.js');
    await import('./tiles/Chopper.js');
    await import('./tiles/Clock.js');
    await import('./tiles/ExitDoor.js');
    await import('./tiles/Gate.js');
    await import('./tiles/Loose.js');
    await import('./tiles/Mirror.js');
    await import('./tiles/Potion.js');
    await import('./tiles/Skeleton.js');
    await import('./tiles/Spikes.js');
    await import('./tiles/Star.js');
    await import('./tiles/Sword.js');
    await import('./tiles/Torch.js');

    console.log('All game modules loaded successfully');
  } catch (error) {
    console.error('Error loading game modules:', error);
    throw error;
  }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load Phaser first
    await loadScript('/phaser.min.js');
    console.log('Phaser loaded successfully');

    // Initialize PrinceJS global object
    initializePrinceJS();
    console.log('PrinceJS object initialized');

    // Load game modules in the correct order
    await loadGameModules();

    // Initialize the game
    const game = new Phaser.Game(640, 400, Phaser.AUTO, 'gameContainer', null, false, false);

    game.state.add('Boot', PrinceJS.Boot);
    game.state.add('Preloader', PrinceJS.Preloader);
    game.state.add('Game', PrinceJS.Game);
    game.state.add('Title', PrinceJS.Title);
    game.state.add('EndTitle', PrinceJS.EndTitle);
    game.state.add('Credits', PrinceJS.Credits);
    game.state.add('Cutscene', PrinceJS.Cutscene);
    game.state.start('Boot');

    console.log('Game initialized successfully');
  } catch (error) {
    console.error('Failed to load Phaser or game modules:', error);
  }
});
 