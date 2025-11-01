// --- src/App.jsx ---
import React, { useState, useRef, useEffect } from 'react'
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
  const cubeRef = useRef(null);
  const shuffleQueueRef = useRef(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isAnimating) return;
      
      const key = e.key.toLowerCase();
      let face = null;
      let clockwise = true;
      
      switch (key) {
        case 'f':
          face = 'F';
          clockwise = true;
          break;
        case 'r':
          face = 'R';
          clockwise = true;
          break;
        case 'u':
          face = 'U';
          clockwise = true;
          break;
        case 'b':
          face = 'B';
          clockwise = true;
          break;
        case 'l':
          face = 'L';
          clockwise = true;
          break;
        case 'd':
          face = 'D';
          clockwise = true;
          break;
        case 'z': // Counter-clockwise variants (Shift + letter)
          if (e.shiftKey) {
            face = 'F';
            clockwise = false;
          }
          break;
        default:
          return;
      }
      
      if (face && cubeRef.current) {
        cubeRef.current.rotateFace(face, clockwise);
        setMoves(prev => [...prev, clockwise ? face : face + "'"]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating]);

  // Handle shuffle queue
  useEffect(() => {
    if (!isAnimating && shuffleQueueRef.current && shuffleQueueRef.current.length > 0) {
      const [face, clockwise, movesArray] = shuffleQueueRef.current.shift();
      if (cubeRef.current) {
        cubeRef.current.rotateFace(face, clockwise);
        movesArray.push(clockwise ? face : face + "'");
        if (shuffleQueueRef.current.length === 0) {
          setMoves(movesArray);
          shuffleQueueRef.current = null;
        }
      }
    }
  }, [isAnimating]);

  const shuffleCube = () => {
    if (isAnimating || shuffleQueueRef.current) return;
    const faces = ['F', 'B', 'L', 'R', 'U', 'D'];
    const newMoves = [];
    const queue = [];
    
    for (let i = 0; i < 20; i++) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      const clockwise = Math.random() > 0.5;
      queue.push([face, clockwise, newMoves]);
    }
    
    shuffleQueueRef.current = queue;
    
    // Trigger first rotation
    if (queue.length > 0 && cubeRef.current) {
      const [face, clockwise, movesArray] = queue.shift();
      cubeRef.current.rotateFace(face, clockwise);
      movesArray.push(clockwise ? face : face + "'");
    }
  };

  const resetCube = () => {
    if (isAnimating) return;
    setCubeState(initCube());
    setMoves([]);
  };

  const rotateFace = (face, clockwise = true) => {
    if (cubeRef.current && !isAnimating) {
      cubeRef.current.rotateFace(face, clockwise);
      setMoves(prev => [...prev, clockwise ? face : face + "'"]);
    }
  };

  return (
    <div className="app">
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        zIndex: 1,
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Rubik's Cube Controls</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>Keyboard:</strong> F, R, U, B, L, D (clockwise)
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Mouse:</strong> Double-click on a cubelet face to rotate that layer
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Orbit:</strong> Left-click + drag to rotate | Right-click + drag to pan | Scroll to zoom
          </div>
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <button onClick={() => rotateFace('F')} disabled={isAnimating} style={{ padding: '5px 10px', cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
              F
            </button>
            <button onClick={() => rotateFace('B')} disabled={isAnimating} style={{ padding: '5px 10px', cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
              B
            </button>
            <button onClick={() => rotateFace('L')} disabled={isAnimating} style={{ padding: '5px 10px', cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
              L
            </button>
            <button onClick={() => rotateFace('R')} disabled={isAnimating} style={{ padding: '5px 10px', cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
              R
            </button>
            <button onClick={() => rotateFace('U')} disabled={isAnimating} style={{ padding: '5px 10px', cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
              U
            </button>
            <button onClick={() => rotateFace('D')} disabled={isAnimating} style={{ padding: '5px 10px', cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
              D
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button onClick={shuffleCube} disabled={isAnimating} style={{ padding: '8px 15px', cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
            Shuffle
          </button>
          <button onClick={resetCube} disabled={isAnimating} style={{ padding: '8px 15px', cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
            Reset
          </button>
        </div>

        {moves.length > 0 && (
          <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.8 }}>
            <strong>Moves:</strong> {moves.join(' ')}
          </div>
        )}
      </div>
      <Canvas 
        camera={{ position: [4, 4, 4], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Scene 
          cubeRef={cubeRef}
          cubeState={cubeState} 
          setCubeState={setCubeState} 
          isAnimating={isAnimating} 
          setIsAnimating={setIsAnimating} 
        />
      </Canvas>
    </div>
  );
}
