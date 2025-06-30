/**
 * PrinceJS Enhanced - Boot Scene (Phaser 3)
 * Migrated from Boot.js (Phaser 2)
 */

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Load the bitmap font (same as Phaser 2 version)
    this.load.bitmapFont("font", "assets/font/prince_0.png", "assets/font/prince.fnt");
  }

  create() {
    // Set up the world scale using camera zoom (Phaser 3 approach)
    this.cameras.main.setZoom(PrinceJS.SCALE_FACTOR);

    // Apply query parameters and screen width (keeping same logic)
    PrinceJS.Utils.applyQuery();
    PrinceJS.Utils.applyScreenWidth();

    // Start the next scene (Preloader)
    this.scene.start("PreloaderScene");

    console.log("✅ BootScene (Phaser 3) initialized successfully!");
  }
}

// Register this scene globally for PrinceJS
window.PrinceJS = window.PrinceJS || {};
window.PrinceJS.Enhanced = window.PrinceJS.Enhanced || {};
window.PrinceJS.Enhanced.BootScene = BootScene;
