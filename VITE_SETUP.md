# Vite Integration for PrinceJS

This document explains the Vite setup that has been added to the PrinceJS project for modern development workflow.

## What was added

1. **Vite configuration** (`vite.config.js`)
2. **Updated package.json scripts** with Vite commands
3. **Modern entry point** (`src/main.js`) that properly initializes the global PrinceJS object and loads game modules
4. **Updated project structure** for Vite compatibility
5. **Fixed asset paths** for Vite's public directory structure
6. **Enhanced scaling and fullscreen support**

## New npm scripts

- `npm run dev` - Start Vite development server (with hot reload)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm start` - Alias for `npm run dev`

## Development workflow

1. Run `npm run dev` to start the development server
2. Open `http://localhost:8080` (or the URL shown in terminal)
3. The server will automatically reload when you make changes to the code
4. The game should display in fullscreen with proper scaling

## Production build

1. Run `npm run build` to create optimized production files in `dist/` directory
2. Run `npm run preview` to test the production build locally

## Key technical changes

### Global Object Initialization

- The original code relied on a global `PrinceJS` object created in `Boot.js`
- In the Vite module system, this caused "PrinceJS is not defined" errors
- **Solution**: `main.js` now manually creates the global `PrinceJS` object before loading any modules
- `Boot.js` was simplified to only define the Boot state, not the global object

### Module Loading Order

- All game modules are loaded sequentially to ensure proper dependency resolution
- Phaser 2.x library is loaded first via script injection to maintain compatibility
- The global PrinceJS object is initialized before any game modules are imported

### Enhanced Scaling & Fullscreen Support

- **Phaser Scale Manager**: Configured with `SHOW_ALL` mode in Boot.js for proper responsive scaling
- **CSS Improvements**: Added flexbox centering and enhanced image rendering
- **Proper Asset Paths**: Fixed CSS and asset loading for Vite's public directory
- **Pixel-Perfect Rendering**: Added crisp-edges for retro game aesthetics
- **Responsive Design**: Game scales properly to fill screen while maintaining aspect ratio
- **Proper Initialization**: Scale manager is configured after Phaser is fully initialized

### Asset Path Updates

- Updated HTML asset references to work with Vite's public directory structure
- Changed incorrect asset paths to match the actual file locations
- Fixed CSS loading which was preventing proper fullscreen scaling

## Files modified

- `package.json` - Added Vite scripts
- `vite.config.js` - Created Vite configuration
- `src/main.js` - Created main entry point with proper initialization and enhanced Phaser scaling
- `src/Boot.js` - Simplified to remove global object creation
- `index.html` - Updated to use Vite module system and fixed asset paths
- `public/assets/web/game.css` - Enhanced with better scaling and centering
- `public/` - Moved assets and libraries to Vite's public directory

## Scaling Features

The game now properly scales to fullscreen with:

- **Aspect Ratio Preservation**: Game maintains 16:10 ratio (640×400)
- **Responsive Scaling**: Adapts to any screen size while keeping proportions
- **Pixel-Perfect Rendering**: Crisp pixel art without blurring
- **Centered Display**: Game is centered on screen with black letterboxing as needed
- **Touch/Mobile Support**: Proper viewport handling for mobile devices

## Troubleshooting

### Common issues resolved:

1. **"PrinceJS is not defined"** - Fixed by proper global object initialization in main.js
2. **Asset path warnings** - Fixed by updating paths to match Vite's public directory structure
3. **Phaser module loading issues** - Fixed by loading Phaser as a script rather than ES6 module
4. **Game not scaling properly** - Fixed by correcting CSS paths and adding Phaser scale manager configuration
5. **Small game window** - Fixed by enabling proper fullscreen CSS and enhanced scale manager
6. **Scale manager null error** - Fixed by moving scale configuration to Boot.js where Phaser is fully initialized

The setup now works seamlessly with both development and production builds while maintaining full compatibility with the original game code and providing excellent fullscreen scaling.
