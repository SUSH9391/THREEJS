// --- src/App.jsx ---
import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene'

// Initial cube state: 3x3x3 array of cubelets
const initCube = () => {
  const cube = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cube.push({
          position: [x, y, z],
          colors: {
            up: 'white',
            down: 'yellow',
            left: 'orange',
            right: 'red',
            front: 'blue',
            back: 'green'
          }
        });
      }
    }
  }
  return cube;
};

export default function App() {
  const [cubeState, setCubeState] = useState(initCube());
  const [moves, setMoves] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const shuffleCube = () => {
    if (isAnimating) return;
    const newMoves = [];
    const faces = ['F', 'B', 'L', 'R', 'U', 'D'];
    for (let i = 0; i < 20; i++) {
      const face = faces[Math.floor(Math.random() * 6)];
      newMoves.push(face);
      // Note: rotateFace will be called in RubiksCube, but for now, we store moves
    }
    setMoves(newMoves);
    // TODO: Trigger rotations sequentially
  };

  const solveCube = () => {
    if (isAnimating) return;
    const reversedMoves = [...moves].reverse().map(move => {
      // Reverse move: F -> F', etc. For simplicity, assume clockwise is positive, counter is negative
      return move + "'"; // Placeholder
    });
    setMoves(reversedMoves);
    // TODO: Trigger rotations sequentially
  };

  return (
    <div className="app">
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
        <button onClick={shuffleCube} disabled={isAnimating}>Shuffle</button>
        <button onClick={solveCube} disabled={isAnimating}>Solve</button>
      </div>
      <Canvas camera={{ position: [3, 3, 3], fov: 60 }}>
        <Scene cubeState={cubeState} setCubeState={setCubeState} moves={moves} setMoves={setMoves} isAnimating={isAnimating} setIsAnimating={setIsAnimating} />
      </Canvas>
    </div>
  );
}
