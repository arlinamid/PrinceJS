# 🔄 Phase 2: Phaser 2→3 Migration Plan

## 🎯 **THE HARDEST PART - SYSTEMATIC MIGRATION STRATEGY**

**Goal**: Migrate from Phaser 2.6.2 to Phaser 3.9 while preserving all game functionality

---

## 🚨 **CRITICAL DIFFERENCES: PHASER 2 vs 3**

### **Architecture Changes**

| **Aspect**               | **Phaser 2.6.2**                                    | **Phaser 3.9**                                 |
| ------------------------ | --------------------------------------------------- | ---------------------------------------------- |
| **Game Creation**        | `new Phaser.Game(width, height, renderer, element)` | `new Phaser.Game(config)`                      |
| **States**               | `game.state.add()` / `game.state.start()`           | **Scenes**: `scene.start()` / `scene.launch()` |
| **Game Object Creation** | `game.add.sprite()`                                 | `this.add.sprite()` (Scene context)            |
| **Input**                | `game.input.keyboard`                               | `this.input.keyboard` (Scene context)          |
| **Audio**                | `game.sound.add()`                                  | `this.sound.add()` (Scene context)             |
| **Scaling**              | `world.scale.set()`                                 | Camera zoom & CSS scaling                      |
| **Groups**               | `game.add.group()`                                  | `this.add.group()` or `this.add.container()`   |

---

## 📋 **MIGRATION ROADMAP - 12 STEPS**

### **Step 1: Create Phaser 3 Configuration** ⏱️ 30 min

- [x] Switch from Phaser 2.6.2 to Phaser 3.9 script
- [x] Create modern game configuration object
- [x] Set up Scene manager system
- [x] Configure input, audio, and rendering systems

### **Step 2: Convert States to Scenes** ⏱️ 2 hours

- [x] **Boot** → **BootScene**
- [x] **Preloader** → **PreloaderScene**
- [ ] **Game** → **GameScene** (main game logic)
- [ ] **Title** → **TitleScene**
- [ ] **EndTitle** → **EndTitleScene**
- [ ] **Credits** → **CreditsScene**
- [ ] **Cutscene** → **CutsceneScene**

### **Step 3: Update Game Object Creation** ⏱️ 3 hours

- [ ] Replace `game.add.*` with `this.add.*`
- [ ] Update sprite creation and positioning
- [ ] Convert bitmap fonts and text objects
- [ ] Update particle systems and effects

### **Step 4: Migrate Input System** ⏱️ 1 hour

- [ ] Convert keyboard input handling
- [ ] Update gamepad input system
- [ ] Migrate mouse/touch input events
- [ ] Update interactive object handling

### **Step 5: Update Audio System** ⏱️ 45 min

- [ ] Convert audio loading and playback
- [ ] Update sound event handling
- [ ] Migrate audio groups and mixing

### **Step 6: Fix Physics Integration** ⏱️ 1.5 hours

- [ ] Update collision detection systems
- [ ] Convert physics bodies and constraints
- [ ] Migrate movement and physics logic

### **Step 7: Update Animation System** ⏱️ 2 hours

- [ ] Convert sprite animations
- [ ] Update tween system
- [ ] Migrate timeline and sequence animations

### **Step 8: Migrate Level System** ⏱️ 2.5 hours

- [ ] Update tilemap loading and rendering
- [ ] Convert level builder logic
- [ ] Migrate room transition system

### **Step 9: Convert UI System** ⏱️ 1.5 hours

- [ ] Update interface rendering
- [ ] Convert UI interactions and positioning
- [ ] Migrate HUD and overlay systems

### **Step 10: Update Actor System** ⏱️ 3 hours

- [ ] Convert Kid (player) logic
- [ ] Migrate Enemy AI system
- [ ] Update Fighter combat system
- [ ] Convert Actor base class

### **Step 11: Fix Rendering & Camera** ⏱️ 1 hour

- [ ] Update camera systems
- [ ] Convert scaling and viewport logic
- [ ] Fix rendering order and effects

### **Step 12: Testing & Validation** ⏱️ 2 hours

- [ ] Test all game functionality
- [ ] Verify performance improvements
- [ ] Fix any remaining issues

**Total Estimated Time: 20 hours**

---

## 🛠️ **IMMEDIATE IMPLEMENTATION PLAN**

### **Phase 2.1: Foundation (Steps 1-2)** - THIS SESSION

1. **Switch to Phaser 3.9** - Update script loading
2. **Create Game Configuration** - Modern Phaser 3 setup
3. **Convert Boot Scene** - First scene migration
4. **Basic Scene Structure** - Scene manager setup

### **Phase 2.2: Core Systems (Steps 3-5)** - NEXT SESSION

1. **Game Object Migration** - Sprites, rendering
2. **Input System Update** - Keyboard, gamepad, mouse
3. **Audio System Migration** - Sound loading and playback

### **Phase 2.3: Game Logic (Steps 6-8)** - FOLLOWING SESSION

1. **Physics & Collision** - Movement and interaction
2. **Animation System** - Sprites and tweens
3. **Level System** - Tilemap and room logic

### **Phase 2.4: Finalization (Steps 9-12)** - FINAL SESSION

1. **UI & Interface** - HUD and menus
2. **Actor Systems** - Player and enemy logic
3. **Testing & Polish** - Verification and optimization

---

## 🔧 **KEY TECHNICAL CHALLENGES**

### **1. Scene Lifecycle Management**

```javascript
// Phaser 2 (State-based)
game.state.add("Boot", PrinceJS.Boot);
game.state.start("Boot");

// Phaser 3 (Scene-based)
class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }
  preload() {
    /* ... */
  }
  create() {
    /* ... */
  }
}
```

### **2. Game Object Context Changes**

```javascript
// Phaser 2 (Global game reference)
this.game.add.sprite(x, y, "texture");

// Phaser 3 (Scene context)
this.add.sprite(x, y, "texture");
```

### **3. Input System Restructure**

```javascript
// Phaser 2
this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

// Phaser 3
this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
```

### **4. Scale and Camera System**

```javascript
// Phaser 2 (World scaling)
this.world.scale.set(PrinceJS.SCALE_FACTOR);

// Phaser 3 (Camera system)
this.cameras.main.setZoom(PrinceJS.SCALE_FACTOR);
```

---

## 📊 **SUCCESS METRICS**

### **Technical Objectives**

- ✅ All 7 scenes migrate successfully
- ✅ Game runs at 60 FPS (performance improvement)
- ✅ All input systems functional
- ✅ Audio system working correctly
- ✅ Level loading and rendering intact
- ✅ Combat and physics systems operational

### **Functional Verification**

- ✅ Player movement and actions working
- ✅ Enemy AI functioning correctly
- ✅ Level progression system intact
- ✅ UI and interface fully functional
- ✅ Audio and visual effects preserved
- ✅ Save/load system operational

---

## 🚀 **READY TO START PHASE 2.1!**

**Let's begin with the most critical foundation step:**

1. **Switch to Phaser 3.9** - Update main.js script loading
2. **Create Phaser 3 Configuration** - Modern game setup
3. **Convert Boot Scene** - First scene migration

This systematic approach ensures we maintain functionality while upgrading the engine. Each step builds upon the previous one, allowing for testing and validation at every stage.

---

_The hardest part of the entire upgrade - but with careful planning and systematic execution, we'll preserve the classic Prince of Persia experience while gaining modern Phaser 3 capabilities!_
