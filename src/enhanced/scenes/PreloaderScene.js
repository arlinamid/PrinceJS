/**
 * PrinceJS Enhanced - Preloader Scene (Phaser 3)
 * Migrated from Preloader.js (Phaser 2)
 */

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloaderScene" });
  }

  init() {
    console.log("PreloaderScene init() called");
  }

  preload() {
    console.log("PreloaderScene preload() started");

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Add loading text using plain text since bitmap font isn't loaded yet
    const loadingText = this.add.text(centerX, centerY - 30, "Loading... 0%", {
      fontSize: "20px",
      color: "#ffffff",
      fontFamily: "Arial"
    });
    loadingText.setOrigin(0.5, 0.5);

    // Create progress bar background
    const progressBarWidth = 320;
    const progressBarHeight = 20;
    const progressBarX = centerX - progressBarWidth / 2;
    const progressBarY = centerY;

    // Progress bar background (dark gray)
    const progressBarBg = this.add.rectangle(centerX, progressBarY, progressBarWidth, progressBarHeight, 0x222222);
    progressBarBg.setStrokeStyle(2, 0xffffff);

    // Progress bar fill (golden yellow - Prince of Persia style)
    const progressBar = this.add.rectangle(progressBarX + 2, progressBarY, 0, progressBarHeight - 4, 0xffd700);
    progressBar.setOrigin(0, 0.5);

    // Add some style text
    const styleText = this.add.text(centerX, centerY + 40, "Prince of Persia - Enhanced Edition", {
      fontSize: "16px",
      color: "#888888",
      fontFamily: "Arial"
    });
    styleText.setOrigin(0.5, 0.5);

    // Show loading progress
    this.load.on("progress", (value) => {
      const percent = Math.floor(value * 100);
      console.log("Loading progress:", percent + "%");
      loadingText.setText("Loading... " + percent + "%");

      // Update progress bar width with smooth animation
      const targetWidth = (progressBarWidth - 4) * value;
      this.tweens.add({
        targets: progressBar,
        width: targetWidth,
        duration: 100,
        ease: "Power2"
      });
    });

    this.load.on("complete", () => {
      console.log("All assets loaded!");
      loadingText.destroy();
      progressBarBg.destroy();
      progressBar.destroy();
      styleText.destroy();
    });

    // Load texture atlases (Phaser 3 uses 'atlas' instead of 'atlasJSONHash')
    this.load.atlas("kid", "assets/gfx/kid.png", "assets/gfx/kid.json");
    this.load.atlas("princess", "assets/gfx/princess.png", "assets/gfx/princess.json");
    this.load.atlas("vizier", "assets/gfx/vizier.png", "assets/gfx/vizier.json");
    this.load.atlas("mouse", "assets/gfx/mouse.png", "assets/gfx/mouse.json");
    this.load.atlas("guard-1", "assets/gfx/guard-1.png", "assets/gfx/guard-1.json");
    this.load.atlas("guard-2", "assets/gfx/guard-2.png", "assets/gfx/guard-2.json");
    this.load.atlas("guard-3", "assets/gfx/guard-3.png", "assets/gfx/guard-3.json");
    this.load.atlas("guard-4", "assets/gfx/guard-4.png", "assets/gfx/guard-4.json");
    this.load.atlas("guard-5", "assets/gfx/guard-5.png", "assets/gfx/guard-5.json");
    this.load.atlas("guard-6", "assets/gfx/guard-6.png", "assets/gfx/guard-6.json");
    this.load.atlas("guard-7", "assets/gfx/guard-7.png", "assets/gfx/guard-7.json");
    this.load.atlas("fatguard", "assets/gfx/fatguard.png", "assets/gfx/fatguard.json");
    this.load.atlas("jaffar", "assets/gfx/jaffar.png", "assets/gfx/jaffar.json");
    this.load.atlas("skeleton", "assets/gfx/skeleton.png", "assets/gfx/skeleton.json");
    this.load.atlas("shadow", "assets/gfx/shadow.png", "assets/gfx/shadow.json");
    this.load.atlas("dungeon", "assets/gfx/dungeon.png", "assets/gfx/dungeon.json");
    this.load.atlas("palace", "assets/gfx/palace.png", "assets/gfx/palace.json");
    this.load.atlas("general", "assets/gfx/general.png", "assets/gfx/general.json");
    this.load.atlas("sword", "assets/gfx/sword.png", "assets/gfx/sword.json");
    this.load.atlas("title", "assets/gfx/title.png", "assets/gfx/title.json");
    this.load.atlas("cutscene", "assets/gfx/cutscene.png", "assets/gfx/cutscene.json");

    // Load JSON animation data
    this.load.json("kid-anims", "assets/anims/kid.json");
    this.load.json("sword-anims", "assets/anims/sword.json");
    this.load.json("fighter-anims", "assets/anims/fighter.json");
    this.load.json("princess-anims", "assets/anims/princess.json");
    this.load.json("shadow-anims", "assets/anims/shadow.json");
    this.load.json("vizier-anims", "assets/anims/vizier.json");
    this.load.json("mouse-anims", "assets/anims/mouse.json");

    // Load Music (Phaser 3 uses this.load.audio directly)
    this.load.audio("PrologueA", "assets/music/01_Prologue_A.mp3");
    this.load.audio("PrologueB", "assets/music/02_Prologue_B.mp3");
    this.load.audio("Danger", "assets/music/06_Danger.mp3");
    this.load.audio("Accident", "assets/music/07_Accident.mp3");
    this.load.audio("Potion1", "assets/music/08_Potion_1.mp3");
    this.load.audio("Victory", "assets/music/09_Victory.mp3");
    this.load.audio("Prince", "assets/music/11_Prince.mp3");
    this.load.audio("Potion2", "assets/music/14_Potion_2.mp3");

    // Load SFX
    this.load.audio("FreeFallLand", "assets/sfx/01_Free_fall_land.mp3");
    this.load.audio("LooseFloorLands", "assets/sfx/02_Loose_floor_lands.mp3");
    this.load.audio("LooseFloorShakes1", "assets/sfx/03_Loose_floor_shakes.mp3");
    this.load.audio("GateComingDownSlow", "assets/sfx/04_Gate_coming_down_slow.mp3");
    this.load.audio("GateRising", "assets/sfx/05_Gate_rising.mp3");
    this.load.audio("GateReachesBottomClang", "assets/sfx/06_Gate_reaches_bottom_clang.mp3");
    this.load.audio("GateStopsAtTop", "assets/sfx/07_Gate_stops_at_top.mp3");
    this.load.audio("BumpIntoWallSoft", "assets/sfx/08_Bump_into_wall_soft.mp3");
    this.load.audio("BumpIntoWallHard", "assets/sfx/09_Bump_into_wall_hard.mp3");
    this.load.audio("SwordClash", "assets/sfx/10_Sword_clash.mp3");
    this.load.audio("StabAir", "assets/sfx/11_Stab_air.mp3");
    this.load.audio("StabOpponent", "assets/sfx/12_Stab_opponent.mp3");
    this.load.audio("StabbedByOpponent", "assets/sfx/13_Stabbed_by_opponent.mp3");
    this.load.audio("MediumLandingOof", "assets/sfx/14_Medium_landing_oof.mp3");
    this.load.audio("SoftLanding", "assets/sfx/15_Soft_landing.mp3");
    this.load.audio("UnsheatheSword", "assets/sfx/16_Unsheathe_sword.mp3");
    this.load.audio("LooseFloorShakes3", "assets/sfx/17_Loose_floor_shakes_3.mp3");
    this.load.audio("LooseFloorShakes2", "assets/sfx/18_Loose_floor_shakes_2.mp3");
    this.load.audio("FloorButton", "assets/sfx/19_Floor_button.mp3");
    this.load.audio("Footsteps", "assets/sfx/20_Footsteps.mp3");
    this.load.audio("BonesLeapToLife", "assets/sfx/21_Bones_leap_to_life.mp3");
    this.load.audio("Mirror", "assets/sfx/22_Mirror.mp3");
    this.load.audio("HalvedByChopper", "assets/sfx/23_Halved_by_chopper.mp3");
    this.load.audio("SlicerBladesClash", "assets/sfx/24_Slicer_blades_clash.mp3");
    this.load.audio("HardLandingSplat", "assets/sfx/25_Hard_landing_splat.mp3");
    this.load.audio("ImpaledBySpikes", "assets/sfx/26_Impaled_by_spikes.mp3");
    this.load.audio("DoorSqueak", "assets/sfx/27_Door_squeak.mp3");
    this.load.audio("FallingFloorLands", "assets/sfx/28_Falling_floor_lands.mp3");
    this.load.audio("EntranceDoorCloses", "assets/sfx/29_Entrance_door_closes.mp3");
    this.load.audio("ExitDoorOpening", "assets/sfx/30_Exit_door_opening.mp3");
    this.load.audio("DrinkPotionGlugGlug", "assets/sfx/31_Drink_potion_glug_glug.mp3");
    this.load.audio("Beep", "assets/sfx/32_Beep.mp3");
    this.load.audio("SpikedBySpikes", "assets/sfx/33_Spiked_by_spikes.mp3");
  }

  create() {
    console.log("PreloaderScene create() called");

    // Create text now that assets are loaded
    this.text = this.add.bitmapText(
      PrinceJS.SCREEN_WIDTH * 0.5,
      PrinceJS.SCREEN_HEIGHT * 0.5,
      "font",
      "Press to Start",
      16
    );
    this.text.setOrigin(0.5, 0.5);

    console.log("Bitmap text created at:", PrinceJS.SCREEN_WIDTH * 0.5, PrinceJS.SCREEN_HEIGHT * 0.5);

    // Set up input handlers (Phaser 3 style)
    this.input.keyboard.on("keydown", this.start, this);

    // Handle pointer input for starting
    this.input.on("pointerdown", () => {
      console.log("Pointer down detected");
      // Resume audio context on first click (browser requirement)
      if (this.sound.context && this.sound.context.state === "suspended") {
        this.sound.context.resume();
      }
      this.start();
    });

    // Enable gamepad support
    if (this.input.gamepad) {
      this.input.gamepad.start();
    }

    // Prevent right-click context menu
    this.game.canvas.oncontextmenu = function (event) {
      event.preventDefault();
    };

    console.log("✅ PreloaderScene (Phaser 3) assets loaded successfully!");
    console.log("Waiting for user input to start...");
  }

  update() {
    // Update is not needed since we handle input via events
  }

  start() {
    console.log("PreloaderScene start() called");
    console.log("SKIP_TITLE:", PrinceJS.SKIP_TITLE);

    // Start the appropriate scene
    if (PrinceJS.SKIP_TITLE) {
      console.log("Skipping title, going to game...");
      // For now, fall back to legacy system since GameScene isn't migrated yet
      this.scene.stop();
      window.initializeLegacySystem();
    } else {
      console.log("Going to title screen...");
      // For now, fall back to legacy system since TitleScene isn't migrated yet
      this.scene.stop();
      window.initializeLegacySystem();
    }
  }
}

// Register this scene globally for PrinceJS
window.PrinceJS = window.PrinceJS || {};
window.PrinceJS.Enhanced = window.PrinceJS.Enhanced || {};
window.PrinceJS.Enhanced.PreloaderScene = PreloaderScene;
