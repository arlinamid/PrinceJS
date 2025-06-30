"use strict";

PrinceJS.Utils = {
  convertX: function (x) {
    return Math.floor((x * 320) / 140);
  },

  convertXtoBlockX: function (x) {
    return Math.floor((x - 7) / 14);
  },

  convertYtoBlockY: function (y) {
    return Math.floor(y / PrinceJS.BLOCK_HEIGHT);
  },

  convertBlockXtoX: function (block) {
    return block * 14 + 7;
  },

  convertBlockYtoY: function (block) {
    return (block + 1) * PrinceJS.BLOCK_HEIGHT - 10;
  },

  delayed: function (fn, millis) {
    return new Promise((resolve) => {
      setTimeout(() => {
        Promise.resolve()
          .then(() => {
            return fn && fn();
          })
          .then((result) => {
            resolve(result);
          });
      }, millis);
    });
  },

  delayedCancelable: function (fn, millis) {
    let timeout;
    return {
      cancel: () => {
        clearTimeout(timeout);
      },
      promise: new Promise((resolve) => {
        timeout = setTimeout(() => {
          Promise.resolve()
            .then(() => {
              return fn && fn();
            })
            .then((result) => {
              resolve(result);
            });
        }, millis);
      })
    };
  },

  perform: function (fn, millis) {
    return new Promise((resolve) => {
      const result = fn && fn();
      setTimeout(() => {
        resolve(result);
      }, millis);
    });
  },

  flashScreen: function (game, count, color, time) {
    for (let i = 0; i < count * 2; i++) {
      PrinceJS.Utils.delayed(() => {
        game.stage.backgroundColor = i % 2 === 0 ? color : 0x000000;
        PrinceJS.InterfaceCurrent.flash(game.stage.backgroundColor);
      }, time * i);
    }
  },

  flashPattern: function (game, color, pattern) {
    return pattern.reduce((promise, time) => {
      return promise.then(() => {
        PrinceJS.Utils.flashScreen(game, 1, color, time);
        return PrinceJS.Utils.delayed(undefined, 4 * time);
      });
    }, Promise.resolve());
  },

  flashRedDamage: function (game) {
    PrinceJS.Utils.flashPattern(game, PrinceJS.Level.FLASH_RED, [25]);
  },

  flashRedPotion: function (game) {
    PrinceJS.Utils.flashPattern(game, PrinceJS.Level.FLASH_RED, [50, 25, 25]);
  },

  flashGreenPotion: function (game) {
    PrinceJS.Utils.flashPattern(game, PrinceJS.Level.FLASH_GREEN, [50, 25, 25]);
  },

  flashYellowSword: function (game) {
    PrinceJS.Utils.flashPattern(game, PrinceJS.Level.FLASH_YELLOW, [50, 25, 25, 50, 25, 25, 25]);
  },

  flashWhiteShadowMerge: function (game) {
    PrinceJS.Utils.flashPattern(
      game,
      PrinceJS.Level.FLASH_WHITE,
      [50, 25, 25, 50, 25, 25, 25, 50, 25, 25, 50, 25, 25, 25]
    );
  },

  flashWhiteVizierVictory: function (game) {
    PrinceJS.Utils.flashPattern(game, PrinceJS.Level.FLASH_WHITE, [25, 25, 100, 100, 50, 50, 25, 25, 50]);
  },

  random: function (max) {
    return Math.floor(Math.random() * Math.floor(max));
  },

  continueGame: function (game) {
    return PrinceJS.Utils.pointerPressed(game) || PrinceJS.Utils.gamepadAnyPressed(game);
  },

  gamepadButtonPressedCheck: function (game, buttons, name = "default") {
    if (this[`_${name}Pressed`]) {
      return false;
    }
    let pressed = false;
    const pad = game.input.gamepad.pad1;
    if (pad && pad.connected) {
      if (!buttons) {
        buttons = Object.keys(pad._rawPad.buttons).map((button) => parseInt(button));
      }
      for (const button of buttons) {
        if (pad.justPressed(button)) {
          pressed = true;
        }
      }
    }
    if (pressed) {
      this[`_${name}Pressed`] = true;
      PrinceJS.Utils.delayed(() => {
        this[`_${name}Pressed`] = false;
      }, 500);
    }
    return pressed;
  },

  gamepadButtonDownCheck: function (game, buttons) {
    const pad = game.input.gamepad.pad1;
    if (pad && pad.connected) {
      if (!buttons) {
        buttons = Object.keys(pad._rawPad.buttons).map((button) => parseInt(button));
      }
      for (const button of buttons) {
        if (pad.isDown(button)) {
          return true;
        }
      }
    }
    return false;
  },

  gamepadAxisCheck: function (game, axes, comparison) {
    const pad = game.input.gamepad.pad1;
    if (pad && pad.connected) {
      for (const axis of axes) {
        if (comparison === "<" && pad.axis(axis) < -0.75) {
          return true;
        } else if (comparison === ">" && pad.axis(axis) > 0.75) {
          return true;
        }
      }
    }
    return false;
  },

  gamepadAnyPressed: function (game) {
    return PrinceJS.Utils.gamepadButtonPressedCheck(game);
  },

  gamepadUpPressed: function (game) {
    return (
      PrinceJS.Utils.gamepadButtonDownCheck(game, [
        PrinceJS.Gamepad.A,
        PrinceJS.Gamepad.R,
        PrinceJS.Gamepad.ZR,
        PrinceJS.Gamepad.DPadU
      ]) || PrinceJS.Utils.gamepadAxisCheck(game, [PrinceJS.Gamepad.Axis.LY, PrinceJS.Gamepad.Axis.RY], "<")
    );
  },

  gamepadDownPressed: function (game) {
    return (
      PrinceJS.Utils.gamepadButtonDownCheck(game, [PrinceJS.Gamepad.DPadD]) ||
      PrinceJS.Utils.gamepadAxisCheck(game, [PrinceJS.Gamepad.Axis.LY, PrinceJS.Gamepad.Axis.RY], ">")
    );
  },

  gamepadLeftPressed: function (game) {
    return (
      PrinceJS.Utils.gamepadButtonDownCheck(game, [PrinceJS.Gamepad.DPadL]) ||
      PrinceJS.Utils.gamepadAxisCheck(game, [PrinceJS.Gamepad.Axis.LX, PrinceJS.Gamepad.Axis.RX], "<")
    );
  },

  gamepadRightPressed: function (game) {
    return (
      PrinceJS.Utils.gamepadButtonDownCheck(game, [PrinceJS.Gamepad.DPadR]) ||
      PrinceJS.Utils.gamepadAxisCheck(game, [PrinceJS.Gamepad.Axis.LX, PrinceJS.Gamepad.Axis.RX], ">")
    );
  },

  gamepadActionPressed: function (game) {
    return PrinceJS.Utils.gamepadButtonDownCheck(game, [
      PrinceJS.Gamepad.B,
      PrinceJS.Gamepad.Y,
      PrinceJS.Gamepad.L,
      PrinceJS.Gamepad.ZL
    ]);
  },

  gamepadInfoPressed: function (game) {
    return PrinceJS.Utils.gamepadButtonPressedCheck(game, [PrinceJS.Gamepad.X], "info");
  },

  gamepadPreviousPressed: function (game) {
    return PrinceJS.Utils.gamepadButtonPressedCheck(game, [PrinceJS.Gamepad.Minus], "previous");
  },

  gamepadNextPressed: function (game) {
    return PrinceJS.Utils.gamepadButtonPressedCheck(game, [PrinceJS.Gamepad.Plus], "next");
  },

  pointerPressed: function (game) {
    const pointerPressed = this._pointerPressed;
    this._pointerPressed = PrinceJS.Utils.pointerDown(game);
    return pointerPressed && !this._pointerPressed;
  },

  pointerDown: function (game) {
    if (game.input.activePointer.leftButton && game.input.activePointer.leftButton.isDown) {
      return true;
    }
    if (game.input.activePointer.isDown) {
      return true;
    }
    if (game.input.pointer1.isDown) {
      return true;
    }
    return game.input.pointer2.isDown;
  },

  effectivePointer: function (game) {
    const width = document.getElementsByTagName("canvas")[0].getBoundingClientRect().width;
    const height = document.getElementsByTagName("canvas")[0].getBoundingClientRect().height;
    const size = PrinceJS.Utils.effectiveScreenSize(game);
    const x =
      game.input.activePointer.x ||
      (game.input.pointer1.isDown && game.input.pointer1.x) ||
      (game.input.pointer2.isDown && game.input.pointer2.x) ||
      0;
    const y =
      game.input.activePointer.y ||
      (game.input.pointer1.isDown && game.input.pointer1.y) ||
      (game.input.pointer2.isDown && game.input.pointer2.y) ||
      0;
    return {
      x: x - (width - size.width) / 2,
      y: y - (height - size.height) / 2
    };
  },

  effectiveScreenSize: function (game) {
    const width = document.getElementsByTagName("canvas")[0].getBoundingClientRect().width;
    const height = document.getElementsByTagName("canvas")[0].getBoundingClientRect().height;
    if (width / height >= PrinceJS.WORLD_RATIO) {
      return {
        width: height * PrinceJS.WORLD_RATIO,
        height
      };
    } else {
      return {
        width,
        height: width / PrinceJS.WORLD_RATIO
      };
    }
  },

  gameContainer: function () {
    return document.getElementById("gameContainer");
  },

  resetFlipScreen: function () {
    PrinceJS.Utils.gameContainer().classList.remove("flipped");
  },

  toggleFlipScreen: function () {
    PrinceJS.Utils.gameContainer().classList.toggle("flipped");
  },

  isScreenFlipped: function () {
    return PrinceJS.Utils.gameContainer().classList.contains("flipped");
  },

  setRemainingMinutesTo15() {
    if (PrinceJS.Utils.getRemainingMinutes() > 15) {
      PrinceJS.Utils.minutes = 15;
      const date = new Date();
      date.setMinutes(date.getMinutes() - (60 - PrinceJS.Utils.minutes));
      PrinceJS.startTime = date;
      PrinceJS.Utils.updateQuery();
    }
  },

  resetRemainingMinutesTo60() {
    PrinceJS.Utils.minutes = 60;
    PrinceJS.startTime = undefined;
    PrinceJS.endTime = undefined;
    PrinceJS.Utils.updateQuery();
  },

  getDeltaTime: function () {
    if (!PrinceJS.startTime) {
      return {
        minutes: -1,
        seconds: -1
      };
    }
    const diff = (PrinceJS.endTime || new Date()).getTime() - PrinceJS.startTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor(diff / 1000) % 60;
    return { minutes, seconds };
  },

  getRemainingMinutes: function () {
    const deltaTime = PrinceJS.Utils.getDeltaTime();
    return Math.min(60, Math.max(0, 60 - deltaTime.minutes));
  },

  getRemainingSeconds: function () {
    const deltaTime = PrinceJS.Utils.getDeltaTime();
    return Math.min(60, Math.max(0, 60 - deltaTime.seconds));
  },

  applyStrength: function (value) {
    if (PrinceJS.strength >= 0 && PrinceJS.strength < 100) {
      return Math.ceil((value * PrinceJS.strength) / 100);
    }
    return value;
  },

  applyQuery: function () {
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
      PrinceJS.Utils.gameContainer().style["max-width"] = PrinceJS.screenWidth + "px";
    }
  },

  updateQuery: function () {
    PrinceJS.minutes = PrinceJS.Utils.getRemainingMinutes();
    if (PrinceJS.shortcut) {
      PrinceJS.Utils.setHistoryState({
        l: PrinceJS.currentLevel,
        h: PrinceJS.maxHealth,
        t: PrinceJS.minutes,
        s: PrinceJS.strength,
        w: PrinceJS.screenWidth,
        _: true
      });
    } else {
      PrinceJS.Utils.setHistoryState({
        level: PrinceJS.currentLevel,
        health: PrinceJS.maxHealth,
        time: PrinceJS.minutes,
        strength: PrinceJS.strength,
        width: PrinceJS.screenWidth
      });
    }
  },

  restoreQuery: function () {
    if (PrinceJS.Utils.getRemainingMinutes() < PrinceJS.minutes) {
      const date = new Date();
      date.setMinutes(date.getMinutes() - (60 - PrinceJS.minutes));
      PrinceJS.startTime = date;
    }
  },

  clearQuery: function () {
    if (PrinceJS.shortcut) {
      PrinceJS.Utils.setHistoryState({
        s: PrinceJS.strength,
        w: PrinceJS.screenWidth,
        _: true
      });
    } else {
      PrinceJS.Utils.setHistoryState({
        strength: PrinceJS.strength,
        width: PrinceJS.screenWidth
      });
    }
  },

  setHistoryState(state) {
    history.replaceState(
      null,
      null,
      "?" +
        Object.keys(state)
          .map((key) => key + "=" + state[key])
          .join("&")
    );
  },

  // === CHEAT MENU SYSTEM ===

  CheatMenu: {
    isOpen: false,
    selectedIndex: 0,
    selectedTab: 0,
    context: null, // 'game' or 'title'

    getTabs: function() {
      if (this.context === 'game') {
        return [
          { name: 'General', key: 'general' },
          { name: 'Player', key: 'player' },
          { name: 'AI', key: 'ai' },
          { name: 'Level', key: 'level' }
        ];
      } else {
        return [
          { name: 'General', key: 'general' },
          { name: 'Game', key: 'game' },
          { name: 'Generator', key: 'generator' }
        ];
      }
    },

    getItemsForTab: function(tabKey) {
      if (this.context === 'game') {
        switch (tabKey) {
          case 'general':
            return [
              { text: 'Infinite Health', key: 'health', value: PrinceJS.cheats?.infiniteHealth || false },
              { text: 'Infinite Time', key: 'time', value: PrinceJS.cheats?.infiniteTime || false },
              { text: 'God Mode', key: 'god', value: PrinceJS.cheats?.godMode || false },
              { text: 'Toggle Flip', key: 'flip', action: 'toggleFlip' }
            ];
          case 'player':
            return [
              { text: 'Add Life', key: 'addLife', action: 'addLife' },
              { text: 'Full Health', key: 'fullHealth', action: 'fullHealth' },
              { text: 'Get Sword', key: 'sword', action: 'getSword' }
            ];
          case 'ai':
            return [
              { text: 'Set Enemy AI', key: 'setAI', action: 'setEnemyAI' },
              { text: 'Minimax AI', key: 'minimax', value: PrinceJS.cheats?.minimaxAI || false },
              { text: 'Patrol AI', key: 'patrol', value: PrinceJS.cheats?.patrolAI || false },
              { text: 'AI Debug', key: 'aiDebug', value: PrinceJS.cheats?.aiDebug || false }
            ];
          case 'level':
            return [
              { text: 'Level Skip', key: 'skip', action: 'levelSkip' },
              { text: 'Open Exit', key: 'exit', action: 'openExit' },
              { text: 'Kill Enemies', key: 'killEnemies', action: 'killEnemies' }
            ];
        }
      } else {
        switch (tabKey) {
          case 'general':
            return [
              { text: 'Infinite Health', key: 'health', value: PrinceJS.cheats?.infiniteHealth || false },
              { text: 'Infinite Time', key: 'time', value: PrinceJS.cheats?.infiniteTime || false },
              { text: 'God Mode', key: 'god', value: PrinceJS.cheats?.godMode || false },
              { text: 'Toggle Flip', key: 'flip', action: 'toggleFlip' }
            ];
          case 'game':
            return [
              { text: 'Select Level', key: 'selectLevel', action: 'selectLevel' },
              { text: 'Max Health', key: 'maxHealth', action: 'setMaxHealth' },
              { text: 'Reset Game', key: 'reset', action: 'resetGame' }
            ];
          case 'generator':
            return [
              { text: 'Generate Level', key: 'generateLevel', action: 'generateLevel' },
              { text: 'Custom Level', key: 'customLevel', action: 'generateCustomLevel' },
              { text: 'Level Series', key: 'levelSeries', action: 'generateLevelSeries' }
            ];
        }
      }
      return [];
    },

    getCurrentItems: function() {
      const tabs = this.getTabs();
      const currentTab = tabs[this.selectedTab];
      const items = this.getItemsForTab(currentTab.key);
      items.push({ text: 'Close Menu', key: 'close', action: 'close' });
      return items;
    },

    toggle: function(context) {
      this.context = context || this.context;
      this.isOpen = !this.isOpen;
      this.selectedIndex = 0;
      this.selectedTab = 0;

      if (this.isOpen) {
        this.show();
      } else {
        this.hide();
      }
    },

    show: function() {
      if (!this.menuContainer) {
        this.createMenu();
      }
      this.menuContainer.style.display = 'block';
      this.updateDisplay();
    },

    hide: function() {
      if (this.menuContainer) {
        this.menuContainer.style.display = 'none';
      }
    },

    createMenu: function() {
      // Create menu container
      this.menuContainer = document.createElement('div');
      this.menuContainer.id = 'cheatMenu';
      this.menuContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 280px;
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid #fff;
        color: #fff;
        font-family: monospace;
        font-size: 14px;
        z-index: 10000;
        padding: 10px;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      `;

      // Create title
      const title = document.createElement('div');
      title.textContent = 'CHEAT MENU';
      title.style.cssText = `
        text-align: center;
        font-weight: bold;
        margin-bottom: 10px;
        color: #ff0;
        border-bottom: 1px solid #fff;
        padding-bottom: 5px;
      `;
      this.menuContainer.appendChild(title);

      // Create tab bar
      this.tabBar = document.createElement('div');
      this.tabBar.style.cssText = `
        display: flex;
        margin-bottom: 10px;
        border-bottom: 1px solid #666;
        padding-bottom: 5px;
      `;
      this.menuContainer.appendChild(this.tabBar);

      // Create menu items container
      this.menuList = document.createElement('div');
      this.menuContainer.appendChild(this.menuList);

      // Create instructions
      const instructions = document.createElement('div');
      instructions.innerHTML = `
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #666; font-size: 12px;">
          <div>↑↓ Navigate | ←→ Switch Tabs</div>
          <div>Enter/Space Select | ESC Close</div>
        </div>
      `;
      this.menuContainer.appendChild(instructions);

      document.body.appendChild(this.menuContainer);
    },

    updateDisplay: function() {
      if (!this.menuList || !this.tabBar) return;

      // Update tab bar
      this.tabBar.innerHTML = '';
      const tabs = this.getTabs();
      tabs.forEach((tab, index) => {
        const tabDiv = document.createElement('div');
        tabDiv.style.cssText = `
          flex: 1;
          text-align: center;
          padding: 3px 5px;
          cursor: pointer;
          border: 1px solid #666;
          margin-right: 2px;
          font-size: 12px;
          ${index === this.selectedTab ? 'background: rgba(255, 255, 255, 0.2); color: #ff0;' : 'background: rgba(255, 255, 255, 0.1);'}
        `;
        tabDiv.textContent = tab.name;
        this.tabBar.appendChild(tabDiv);
      });

      // Update menu items
      this.menuList.innerHTML = '';
      const items = this.getCurrentItems();

      items.forEach((item, index) => {
        const div = document.createElement('div');
        div.style.cssText = `
          padding: 3px 5px;
          cursor: pointer;
          ${index === this.selectedIndex ? 'background: rgba(255, 255, 255, 0.3); color: #ff0;' : ''}
        `;

        let text = item.text;
        if (item.value !== undefined) {
          text += `: ${item.value ? 'ON' : 'OFF'}`;
        }

        div.textContent = (index === this.selectedIndex ? '> ' : '  ') + text;
        this.menuList.appendChild(div);
      });
    },

    navigate: function(direction) {
      if (!this.isOpen) return;

      if (direction === 'left' || direction === 'right') {
        const tabs = this.getTabs();
        if (direction === 'left') {
          this.selectedTab = Math.max(0, this.selectedTab - 1);
        } else {
          this.selectedTab = Math.min(tabs.length - 1, this.selectedTab + 1);
        }
        this.selectedIndex = 0; // Reset selection when switching tabs
      } else {
        const items = this.getCurrentItems();
        if (direction === 'up') {
          this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        } else if (direction === 'down') {
          this.selectedIndex = Math.min(items.length - 1, this.selectedIndex + 1);
        }
      }

      this.updateDisplay();
    },

    select: function() {
      if (!this.isOpen) return;

      const items = this.getCurrentItems();
      const item = items[this.selectedIndex];
      if (!item) return;

      if (item.action) {
        this.executeAction(item.action);
      } else if (item.value !== undefined) {
        item.value = !item.value;
        this.applyCheat(item.key, item.value);
      }

      this.updateDisplay();
    },

    executeAction: function(action) {
      switch (action) {
        case 'close':
          this.toggle();
          break;
        case 'levelSkip':
          this.cheatLevelSkip();
          break;
        case 'addLife':
          this.cheatAddLife();
          break;
        case 'fullHealth':
          this.cheatFullHealth();
          break;
        case 'getSword':
          this.cheatGetSword();
          break;
        case 'openExit':
          this.cheatOpenExit();
          break;
        case 'killEnemies':
          this.cheatKillEnemies();
          break;
        case 'toggleFlip':
          PrinceJS.Utils.toggleFlipScreen();
          this.showNotification('Screen Flipped!');
          break;
        case 'selectLevel':
          this.cheatSelectLevel();
          break;
        case 'setMaxHealth':
          this.cheatSetMaxHealth();
          break;
        case 'resetGame':
          this.cheatResetGame();
          break;
        case 'setEnemyAI':
          this.cheatSetEnemyAI();
          break;
        case 'generateLevel':
          this.cheatGenerateLevel();
          break;
        case 'generateCustomLevel':
          this.cheatGenerateCustomLevel();
          break;
        case 'generateLevelSeries':
          this.cheatGenerateLevelSeries();
          break;
      }
    },

    applyCheat: function(key, value) {
      PrinceJS.cheats = PrinceJS.cheats || {};

      switch (key) {
        case 'health':
          PrinceJS.cheats.infiniteHealth = value;
          this.showNotification(`Infinite Health ${value ? 'ON' : 'OFF'}`);
          break;
        case 'time':
          PrinceJS.cheats.infiniteTime = value;
          if (value) {
            PrinceJS.Utils.resetRemainingMinutesTo60();
          }
          this.showNotification(`Infinite Time ${value ? 'ON' : 'OFF'}`);
          break;
        case 'god':
          PrinceJS.cheats.godMode = value;
          this.showNotification(`God Mode ${value ? 'ON' : 'OFF'}`);
          break;
        case 'minimax':
          PrinceJS.cheats.minimaxAI = value;
          this.toggleMinimaxAI(value);
          this.showNotification(`Minimax AI ${value ? 'ON' : 'OFF'}`);
          break;
        case 'patrol':
          PrinceJS.cheats.patrolAI = value;
          this.togglePatrolAI(value);
          this.showNotification(`Patrol AI ${value ? 'ON' : 'OFF'}`);
          break;
        case 'aiDebug':
          PrinceJS.cheats.aiDebug = value;
          this.showNotification(`AI Debug ${value ? 'ON' : 'OFF'}`);
          break;
      }
    },

    cheatLevelSkip: function() {
      if (this.context === 'game' && window.PrinceJS_Game_Instance) {
        window.PrinceJS_Game_Instance.nextLevel(PrinceJS.currentLevel, true);
        this.showNotification('Level Skipped!');
        this.toggle();
      }
    },

    cheatAddLife: function() {
      if (this.context === 'game' && window.PrinceJS_Game_Instance && window.PrinceJS_Game_Instance.kid) {
        window.PrinceJS_Game_Instance.kid.addLife();
        this.showNotification('Life Added!');
      }
    },

    cheatFullHealth: function() {
      if (this.context === 'game' && window.PrinceJS_Game_Instance && window.PrinceJS_Game_Instance.kid) {
        const kid = window.PrinceJS_Game_Instance.kid;
        kid.health = kid.maxHealth;
        if (window.PrinceJS_Game_Instance.ui) {
          window.PrinceJS_Game_Instance.ui.setPlayerLive(kid);
        }
        this.showNotification('Health Restored!');
      }
    },

    cheatGetSword: function() {
      if (this.context === 'game' && window.PrinceJS_Game_Instance && window.PrinceJS_Game_Instance.kid) {
        window.PrinceJS_Game_Instance.kid.hasSword = true;
        this.showNotification('Sword Acquired!');
      }
    },

    cheatOpenExit: function() {
      if (this.context === 'game' && window.PrinceJS_Game_Instance && window.PrinceJS_Game_Instance.level) {
        window.PrinceJS_Game_Instance.level.exitDoorOpen = true;
        this.showNotification('Exit Door Opened!');
      }
    },

    cheatKillEnemies: function() {
      if (this.context === 'game' && window.PrinceJS_Game_Instance && window.PrinceJS_Game_Instance.enemies) {
        let killedCount = 0;
        window.PrinceJS_Game_Instance.enemies.forEach(enemy => {
          if (enemy.alive) {
            enemy.die();
            killedCount++;
          }
        });
        this.showNotification(`${killedCount} Enemies Defeated!`);
      }
    },

    cheatSelectLevel: function() {
      const level = prompt('Enter level number (1-14 or 90+):');
      if (level) {
        const levelNum = parseInt(level, 10);
        if (!isNaN(levelNum) && ((levelNum >= 1 && levelNum <= 14) || levelNum >= 90)) {
          PrinceJS.currentLevel = levelNum;
          this.showNotification(`Level set to ${levelNum}`);
          this.toggle();
        }
      }
    },

    cheatSetMaxHealth: function() {
      const health = prompt('Enter max health (3-10):');
      if (health) {
        const healthNum = parseInt(health, 10);
        if (!isNaN(healthNum) && healthNum >= 3 && healthNum <= 10) {
          PrinceJS.maxHealth = healthNum;
          this.showNotification(`Max health set to ${healthNum}`);
        }
      }
    },

    cheatResetGame: function() {
      if (confirm('Reset all game progress?')) {
        PrinceJS.currentLevel = 1;
        PrinceJS.maxHealth = 3;
        PrinceJS.cheats = {};
        PrinceJS.Utils.resetRemainingMinutesTo60();
        this.showNotification('Game Reset!');
        this.toggle();
      }
    },

    showNotification: function(message) {
      if (window.PrinceJS_Game_Instance && window.PrinceJS_Game_Instance.ui) {
        window.PrinceJS_Game_Instance.ui.showCheatNotification(message);
      } else {
        // For title screen, use browser alert or create temporary notification
        console.log('CHEAT:', message);

        // Create temporary notification for title screen
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.9);
          color: #fff;
          padding: 20px;
          border: 2px solid #fff;
          font-family: monospace;
          font-size: 16px;
          z-index: 10001;
          text-align: center;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 2000);
      }
    },

    handleInput: function(keyCode) {
      if (!this.isOpen) return false;

      switch (keyCode) {
        case 38: // Up arrow
        case 87: // W
          this.navigate('up');
          return true;
        case 40: // Down arrow
        case 83: // S
          this.navigate('down');
          return true;
        case 37: // Left arrow
        case 65: // A
          this.navigate('left');
          return true;
        case 39: // Right arrow
        case 68: // D
          this.navigate('right');
          return true;
        case 13: // Enter
        case 32: // Space
          this.select();
          return true;
        case 27: // Escape
          this.toggle();
          return true;
      }

      return false;
    },

    // AI Helper Methods
    cheatSetEnemyAI: function() {
      const aiTypes = [
        'basic', 'minimax', 'patrol', 'aggressive', 'defensive', 'hunter'
      ];

      const choice = prompt(
        'Select AI type:\n' +
        '0: Basic\n' +
        '1: Minimax\n' +
        '2: Patrol\n' +
        '3: Aggressive\n' +
        '4: Defensive\n' +
        '5: Hunter\n' +
        '\nEnter number (0-5):'
      );

      if (choice !== null) {
        const index = parseInt(choice, 10);
        if (!isNaN(index) && index >= 0 && index < aiTypes.length) {
          this.setAllEnemyAI(aiTypes[index]);
          this.showNotification(`All enemies set to ${aiTypes[index]} AI`);
        }
      }
    },

    setAllEnemyAI: function(aiType) {
      if (window.PrinceJS_Game_Instance && window.PrinceJS_Game_Instance.enemies) {
        window.PrinceJS_Game_Instance.enemies.forEach(enemy => {
          if (enemy && enemy.setAIType) {
            enemy.setAIType(aiType);
          }
        });
      }
    },

    toggleMinimaxAI: function(enabled) {
      if (window.PrinceJS_Game_Instance && window.PrinceJS_Game_Instance.enemies) {
        window.PrinceJS_Game_Instance.enemies.forEach(enemy => {
          if (enemy) {
            if (enabled) {
              enemy.setAIType('minimax');
            } else {
              enemy.disableAdvancedAI();
            }
          }
        });
      }
    },

    togglePatrolAI: function(enabled) {
      if (window.PrinceJS_Game_Instance && window.PrinceJS_Game_Instance.enemies) {
        window.PrinceJS_Game_Instance.enemies.forEach(enemy => {
          if (enemy) {
            if (enabled) {
              enemy.setAIType('patrol');
            } else {
              enemy.disableAdvancedAI();
            }
          }
        });
      }
    },

    // Level Generation Methods
    cheatGenerateLevel: function() {
      if (!PrinceJS.LevelGenerator) {
        this.showNotification('Level Generator not available');
        return;
      }

      const options = {
        number: 999,
        name: "AI Generated Level",
        width: 5,
        height: 3,
        type: 0,
        difficulty: 'medium',
        theme: 'balanced'
      };

      try {
        const level = PrinceJS.LevelGenerator.generateLevel(options);
        
        // Save to custom maps directory
        this.saveGeneratedLevel(level);
        this.showNotification(`Generated: ${level.name}`);
        
        // Ask if user wants to play it immediately
        setTimeout(() => {
          if (confirm('Level generated! Play it now?')) {
            this.cheatLoadGeneratedLevel(level);
          }
        }, 100);
      } catch (error) {
        console.error('Level generation failed:', error);
        this.showNotification('Level generation failed');
      }
    },

    cheatGenerateCustomLevel: function() {
      if (!PrinceJS.LevelGenerator) {
        this.showNotification('Level Generator not available');
        return;
      }

      const width = prompt('Level width (3-9 rooms):', '5');
      const height = prompt('Level height (3-5 rooms):', '3');
      const difficulty = prompt('Difficulty (easy/medium/hard):', 'medium');
      const theme = prompt('Theme (balanced/puzzle/combat/parkour):', 'balanced');
      const name = prompt('Level name:', 'Custom AI Level');

      if (width && height) {
        const options = {
          number: 998,
          name: name || 'Custom AI Level',
          width: Math.max(3, Math.min(parseInt(width) || 5, 9)),
          height: Math.max(3, Math.min(parseInt(height) || 3, 5)),
          type: 0,
          difficulty: difficulty || 'medium',
          theme: theme || 'balanced'
        };

        try {
          const level = PrinceJS.LevelGenerator.generateLevel(options);
          this.saveGeneratedLevel(level);
          this.showNotification(`Generated: ${level.name}`);
          
          setTimeout(() => {
            if (confirm('Custom level generated! Play it now?')) {
              this.cheatLoadGeneratedLevel(level);
            }
          }, 100);
        } catch (error) {
          console.error('Custom level generation failed:', error);
          this.showNotification('Level generation failed');
        }
      }
    },

    cheatGenerateLevelSeries: function() {
      if (!PrinceJS.LevelGenerator) {
        this.showNotification('Level Generator not available');
        return;
      }

      const count = prompt('How many levels to generate?', '5');
      const startNumber = prompt('Starting level number?', '100');

      if (count) {
        try {
          const levels = PrinceJS.LevelGenerator.generateLevelSeries(
            parseInt(count) || 5,
            parseInt(startNumber) || 100
          );
          
          levels.forEach(level => this.saveGeneratedLevel(level));
          this.showNotification(`Generated ${levels.length} levels`);
        } catch (error) {
          console.error('Level series generation failed:', error);
          this.showNotification('Level series generation failed');
        }
      }
    },

    cheatLoadGeneratedLevel: function(level) {
      if (window.PrinceJS_Game_Instance && level) {
        try {
          // Store the generated level data
          window.PrinceJS_Generated_Level = level;
          
          // Restart with the generated level
          if (window.PrinceJS_Game_Instance.game) {
            // Switch to the generated level
            PrinceJS.currentLevel = level.number;
            window.PrinceJS_Game_Instance.game.state.start('Game');
            this.showNotification(`Loading: ${level.name}`);
          }
        } catch (error) {
          console.error('Failed to load generated level:', error);
          this.showNotification('Failed to load level');
        }
      }
    },

    saveGeneratedLevel: function(level) {
      try {
        // Save to localStorage for persistence
        const savedLevels = JSON.parse(localStorage.getItem('PrinceJS_Generated_Levels') || '{}');
        savedLevels[level.number] = level;
        localStorage.setItem('PrinceJS_Generated_Levels', JSON.stringify(savedLevels));
        
        // Also save as downloadable JSON
        const dataStr = JSON.stringify(level, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        // Create a temporary download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `level${level.number}.json`;
        document.body.appendChild(link);
        
        console.log(`Generated level saved: ${level.name}`);
        console.log('Download link created (auto-download disabled for UX)');
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to save generated level:', error);
      }
    }
  },

  // Global cheat key handler
  handleCheatKeys: function(keyCode, context) {
    // F1 - Toggle cheat menu
    if (keyCode === 112) {
      PrinceJS.Utils.CheatMenu.toggle(context);
      return true;
    }

    // Handle cheat menu input
    if (PrinceJS.Utils.CheatMenu.isOpen) {
      return PrinceJS.Utils.CheatMenu.handleInput(keyCode);
    }

    // Quick cheats (when menu is closed)
    if (!PrinceJS.Utils.CheatMenu.isOpen) {
      switch (keyCode) {
        case 72: // H - Health cheat
          if (context === 'game' && window.PrinceJS_Game_Instance) {
            PrinceJS.Utils.CheatMenu.cheatFullHealth();
            return true;
          }
          break;
        case 84: // T - Time cheat
          if (context === 'game') {
            PrinceJS.Utils.resetRemainingMinutesTo60();
            return true;
          }
          break;
        case 78: // N - Next level
          if (context === 'game' && window.PrinceJS_Game_Instance) {
            PrinceJS.Utils.CheatMenu.cheatLevelSkip();
            return true;
          }
          break;
      }
    }

    return false;
  },

  // Apply active cheats during gameplay
  applyCheats: function(gameInstance) {
    if (!PrinceJS.cheats) return;

    // Infinite health
    if (PrinceJS.cheats.infiniteHealth && gameInstance.kid) {
      if (gameInstance.kid.health < gameInstance.kid.maxHealth) {
        gameInstance.kid.health = gameInstance.kid.maxHealth;
      }
    }

    // Infinite time
    if (PrinceJS.cheats.infiniteTime) {
      PrinceJS.Utils.resetRemainingMinutesTo60();
    }

    // God mode (prevents damage)
    if (PrinceJS.cheats.godMode && gameInstance.kid) {
      // GOD mode is now integrated into damage system
      if (gameInstance.kid.health < gameInstance.kid.maxHealth) {
        gameInstance.kid.health = gameInstance.kid.maxHealth;
      }
    }

    // Apply AI cheats
    if (gameInstance.enemies && gameInstance.enemies.length > 0) {
      // Enable patrol AI if cheat is active
      if (PrinceJS.cheats.patrolAI) {
        gameInstance.enemies.forEach(enemy => {
          if (enemy && !enemy.useAdvancedAI) {
            enemy.setAIType('patrol');
          }
        });
      }

      // Enable minimax AI if cheat is active
      if (PrinceJS.cheats.minimaxAI) {
        gameInstance.enemies.forEach(enemy => {
          if (enemy && !enemy.useAdvancedAI) {
            enemy.setAIType('minimax');
          }
        });
      }
    }
  }
};
