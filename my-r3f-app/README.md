# Rubik's Cube - Interactive 3D Web Application

An interactive, fully playable 3D Rubik's Cube built with React Three Fiber and Three.js. Rotate faces, shuffle the cube, and view it from any angle with smooth animations and optimized performance.

![Rubik's Cube](https://img.shields.io/badge/React-19.1.1-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.181.0-green) ![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)

## 🎮 Features

- **Fully Interactive Rubik's Cube**: A 3x3x3 cube with proper rotation mechanics
- **Smooth Animations**: Fluid 90-degree rotations with optimized frame timing
- **Multiple Control Methods**:
  - Keyboard shortcuts (F, R, U, B, L, D)
  - On-screen control buttons
  - Double-click cubelet faces to rotate
- **Camera Controls**: 
  - Orbit around the cube
  - Pan and zoom for better viewing
  - Smooth damping for natural movement
- **Cube Operations**:
  - Shuffle: Randomly scramble the cube (20 moves)
  - Reset: Return to solved state
  - Move history tracking
- **Performance Optimized**: 
  - Shared geometry across cubelets
  - Memoized components
  - Efficient rendering (only 27 cubelets)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd my-r3f-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## 🎯 How to Play

### Rotating Faces

**Keyboard Controls:**
- `F` - Rotate Front face (clockwise)
- `R` - Rotate Right face (clockwise)
- `U` - Rotate Up face (clockwise)
- `B` - Rotate Back face (clockwise)
- `L` - Rotate Left face (clockwise)
- `D` - Rotate Down face (clockwise)

**Mouse Controls:**
- **Double-click** on any cubelet face to rotate that layer
- Use the on-screen buttons to rotate specific faces

**Face Notation:**
- **F** = Front (Blue)
- **B** = Back (Green)
- **L** = Left (Orange)
- **R** = Right (Red)
- **U** = Up (White)
- **D** = Down (Yellow)

### Camera Controls

- **Rotate**: Left-click and drag to orbit around the cube
- **Pan**: Right-click and drag to move the view
- **Zoom**: Scroll wheel to zoom in/out

### Cube Operations

- **Shuffle**: Click the "Shuffle" button to randomly scramble the cube with 20 moves
- **Reset**: Click the "Reset" button to return the cube to its solved state
- **Move History**: View all moves made in the control panel

## 🏗️ Project Structure

```
my-r3f-app/
├── src/
│   ├── App.jsx           # Main application component with state management
│   ├── Scene.jsx         # Three.js scene setup with lighting and controls
│   ├── RubiksCube.jsx    # Core cube component with rotation logic
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite configuration
```

## 🛠️ Technologies Used

- **React 19.1.1** - UI library
- **React Three Fiber 9.4.0** - React renderer for Three.js
- **Three.js 0.181.0** - 3D graphics library
- **@react-three/drei 10.7.6** - Useful helpers for R3F (OrbitControls, Stats)
- **Vite 7.1.7** - Build tool and dev server

## 📝 Key Implementation Details

### Cube State Management

The cube state is stored as an array of 27 cubelets, each containing:
- `position`: [x, y, z] coordinates (-1, 0, 1)
- `colors`: Object with 6 face colors (up, down, left, right, front, back)

### Rotation System

- Each face rotation animates smoothly over ~0.35 seconds (4.5 rad/s)
- Cubelets are grouped by layer (F, B, L, R, U, D) for efficient rotation
- Position and color updates occur after animation completes
- Rotations use proper 3D axis transformations

### Performance Optimizations

- **Shared Geometry**: All cubelets share the same BoxGeometry instance
- **Memoization**: Cubelet components use React.memo with custom comparison
- **Single Rendering**: Each cubelet renders only once (not duplicated across layers)
- **Optimized Callbacks**: Event handlers are memoized to prevent re-renders
- **Canvas Settings**: DPR scaling and performance monitoring enabled

## 🎨 Customization

### Changing Colors

Edit the `initCube()` function in `src/App.jsx` to change the default cube colors:

```javascript
colors: {
  up: 'white',
  down: 'yellow',
  left: 'orange',
  right: 'red',
  front: 'blue',
  back: 'green'
}
```

### Adjusting Animation Speed

Modify the `speed` variable in `src/RubiksCube.jsx`:

```javascript
const speed = 4.5; // radians per second
```

### Camera Position

Change the initial camera position in `src/App.jsx`:

```javascript
camera={{ position: [4, 4, 4], fov: 50 }}
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- 3D graphics powered by [Three.js](https://threejs.org/)
- UI components from [@react-three/drei](https://github.com/pmndrs/drei)

## 🐛 Known Issues

- Rotations must complete before starting a new one (prevents state conflicts)
- Double-click timing window is 300ms (may need adjustment for some users)

## 🚧 Future Enhancements

Potential features for future versions:
- Counter-clockwise rotation support (press Shift + face key)
- Auto-solve algorithm visualization
- Save/load cube states
- Timer and move counter for speedcubing
- Custom color schemes
- Different cube sizes (2x2, 4x4, etc.)

---

Enjoy solving! 🎉
