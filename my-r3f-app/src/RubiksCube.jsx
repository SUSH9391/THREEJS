// RubiksCube.jsx
import React, { useRef, useState, useMemo, useCallback, useImperativeHandle, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Shared geometry for better performance
const sharedGeometry = new THREE.BoxGeometry(0.98, 0.98, 0.98);

// Individual cubelet component for better performance
const Cubelet = React.memo(({ cubelet, positionKey, onClick, onPointerOver, onPointerOut }) => {
  return (
    <mesh
      position={cubelet.position}
      geometry={sharedGeometry}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <meshStandardMaterial attach="material-0" color={cubelet.colors.back} />
      <meshStandardMaterial attach="material-1" color={cubelet.colors.front} />
      <meshStandardMaterial attach="material-2" color={cubelet.colors.up} />
      <meshStandardMaterial attach="material-3" color={cubelet.colors.down} />
      <meshStandardMaterial attach="material-4" color={cubelet.colors.right} />
      <meshStandardMaterial attach="material-5" color={cubelet.colors.left} />
    </mesh>
  );
}, (prevProps, nextProps) => {
  // Only re-render if position or colors changed
  if (prevProps.positionKey !== nextProps.positionKey) return false;
  if (prevProps.cubelet.position[0] !== nextProps.cubelet.position[0] ||
      prevProps.cubelet.position[1] !== nextProps.cubelet.position[1] ||
      prevProps.cubelet.position[2] !== nextProps.cubelet.position[2]) return false;
  
  const prevColors = prevProps.cubelet.colors;
  const nextColors = nextProps.cubelet.colors;
  if (prevColors.back !== nextColors.back ||
      prevColors.front !== nextColors.front ||
      prevColors.up !== nextColors.up ||
      prevColors.down !== nextColors.down ||
      prevColors.right !== nextColors.right ||
      prevColors.left !== nextColors.left) return false;
  
  return true; // Props are equal, skip render
});

Cubelet.displayName = 'Cubelet';

const RubiksCube = forwardRef(({ cubeState, setCubeState, isAnimating, setIsAnimating }, ref) => {
  const [currentRotation, setCurrentRotation] = useState(null);
  const rotationRef = useRef({ angle: 0, target: 0 });
  const layerGroupsRef = useRef({});
  const cubeletRefs = useRef({});

  // Initialize layer groups
  React.useEffect(() => {
    const groups = {};
    ['F', 'B', 'L', 'R', 'U', 'D'].forEach(face => {
      groups[face] = React.createRef();
    });
    layerGroupsRef.current = groups;
  }, []);

  // Function to get cubelets in a specific layer
  const getLayerCubelets = (face, cubelets) => {
    switch (face) {
      case 'F': return cubelets.filter(c => c.position[2] === -1);
      case 'B': return cubelets.filter(c => c.position[2] === 1);
      case 'L': return cubelets.filter(c => c.position[0] === -1);
      case 'R': return cubelets.filter(c => c.position[0] === 1);
      case 'U': return cubelets.filter(c => c.position[1] === 1);
      case 'D': return cubelets.filter(c => c.position[1] === -1);
      default: return [];
    }
  };

  // Rotate a face (clockwise by default, counter-clockwise if inverted)
  const rotateFace = (face, clockwise = true) => {
    if (isAnimating || currentRotation) return;
    setIsAnimating(true);
    setCurrentRotation({ face, clockwise });
    rotationRef.current = { angle: 0, target: clockwise ? Math.PI / 2 : -Math.PI / 2 };
  };

  // Rotate positions around an axis
  const rotatePositions = (cubelets, face, clockwise) => {
    const newCubelets = cubelets.map(c => ({ 
      ...c, 
      position: [...c.position], 
      colors: { ...c.colors } 
    }));
    const layer = getLayerCubelets(face, newCubelets);
    
    // Create mapping for rotation
    const positionMap = new Map();
    
    layer.forEach(cubelet => {
      const [x, y, z] = cubelet.position;
      let newPos;
      
      if (face === 'F' || face === 'B') {
        if (clockwise) {
          newPos = [y, -x, z];
        } else {
          newPos = [-y, x, z];
        }
      } else if (face === 'L' || face === 'R') {
        if (clockwise) {
          newPos = [x, -z, y];
        } else {
          newPos = [x, z, -y];
        }
      } else if (face === 'U' || face === 'D') {
        if (clockwise) {
          newPos = [-z, y, x];
        } else {
          newPos = [z, y, -x];
        }
      }
      
      positionMap.set(`${x},${y},${z}`, newPos);
    });

    // Update positions and rotate colors
    newCubelets.forEach(cubelet => {
      const key = `${cubelet.position[0]},${cubelet.position[1]},${cubelet.position[2]}`;
      if (positionMap.has(key)) {
        const newPos = positionMap.get(key);
        cubelet.position = newPos;
        
        // Rotate colors based on face
        if (face === 'F' || face === 'B') {
          const temp = cubelet.colors.up;
          if (clockwise) {
            cubelet.colors.up = cubelet.colors.left;
            cubelet.colors.left = cubelet.colors.down;
            cubelet.colors.down = cubelet.colors.right;
            cubelet.colors.right = temp;
          } else {
            cubelet.colors.up = cubelet.colors.right;
            cubelet.colors.right = cubelet.colors.down;
            cubelet.colors.down = cubelet.colors.left;
            cubelet.colors.left = temp;
          }
        } else if (face === 'L' || face === 'R') {
          const temp = cubelet.colors.up;
          if (clockwise) {
            cubelet.colors.up = cubelet.colors.front;
            cubelet.colors.front = cubelet.colors.down;
            cubelet.colors.down = cubelet.colors.back;
            cubelet.colors.back = temp;
          } else {
            cubelet.colors.up = cubelet.colors.back;
            cubelet.colors.back = cubelet.colors.down;
            cubelet.colors.down = cubelet.colors.front;
            cubelet.colors.front = temp;
          }
        } else if (face === 'U' || face === 'D') {
          const temp = cubelet.colors.front;
          if (clockwise) {
            cubelet.colors.front = cubelet.colors.right;
            cubelet.colors.right = cubelet.colors.back;
            cubelet.colors.back = cubelet.colors.left;
            cubelet.colors.left = temp;
          } else {
            cubelet.colors.front = cubelet.colors.left;
            cubelet.colors.left = cubelet.colors.back;
            cubelet.colors.back = cubelet.colors.right;
            cubelet.colors.right = temp;
          }
        }
      }
    });

    return newCubelets;
  };

  // Determine which layers each cubelet belongs to
  const cubeletLayers = useMemo(() => {
    const layers = {};
    cubeState.forEach(cubelet => {
      const key = `${cubelet.position[0]},${cubelet.position[1]},${cubelet.position[2]}`;
      const layerList = [];
      const [x, y, z] = cubelet.position;
      if (z === -1) layerList.push('F');
      if (z === 1) layerList.push('B');
      if (x === -1) layerList.push('L');
      if (x === 1) layerList.push('R');
      if (y === 1) layerList.push('U');
      if (y === -1) layerList.push('D');
      layers[key] = layerList;
    });
    return layers;
  }, [cubeState]);

  // Animation loop - optimized with easing
  useFrame((state, delta) => {
    if (currentRotation && layerGroupsRef.current[currentRotation.face]?.current) {
      const group = layerGroupsRef.current[currentRotation.face].current;
      const speed = 4.5; // radians per second - smooth rotation speed
      const increment = delta * speed;
      const direction = currentRotation.clockwise ? 1 : -1;

      if (Math.abs(rotationRef.current.angle) < Math.abs(rotationRef.current.target)) {
        const rotationAmount = increment * direction;
        
        // Apply rotation to the group - smooth constant speed
        if (currentRotation.face === 'F' || currentRotation.face === 'B') {
          group.rotation.z += rotationAmount;
        } else if (currentRotation.face === 'L' || currentRotation.face === 'R') {
          group.rotation.x += rotationAmount;
        } else if (currentRotation.face === 'U' || currentRotation.face === 'D') {
          group.rotation.y += rotationAmount;
        }
        
        rotationRef.current.angle += increment;
      } else {
        // Snap to exact angle and update state
        if (currentRotation.face === 'F' || currentRotation.face === 'B') {
          group.rotation.z = Math.round(group.rotation.z / (Math.PI / 2)) * (Math.PI / 2);
        } else if (currentRotation.face === 'L' || currentRotation.face === 'R') {
          group.rotation.x = Math.round(group.rotation.x / (Math.PI / 2)) * (Math.PI / 2);
        } else if (currentRotation.face === 'U' || currentRotation.face === 'D') {
          group.rotation.y = Math.round(group.rotation.y / (Math.PI / 2)) * (Math.PI / 2);
        }
        
        // Update cube state
        const newState = rotatePositions(cubeState, currentRotation.face, currentRotation.clockwise);
        setCubeState(newState);
        
        // Reset rotation
        if (currentRotation.face === 'F' || currentRotation.face === 'B') {
          group.rotation.z = 0;
        } else if (currentRotation.face === 'L' || currentRotation.face === 'R') {
          group.rotation.x = 0;
        } else if (currentRotation.face === 'U' || currentRotation.face === 'D') {
          group.rotation.y = 0;
        }
        
        setCurrentRotation(null);
        setIsAnimating(false);
        rotationRef.current = { angle: 0, target: 0 };
      }
    }
  });

  // Expose rotateFace function to parent
  useImperativeHandle(ref, () => ({
    rotateFace
  }));

  // Handle double-click to rotate - allows orbit controls to work on single click
  const clickTimeoutRef = useRef(null);
  
  const handleClick = useCallback((e, cubelet) => {
    // For double-click detection
    if (clickTimeoutRef.current) {
      // Double click detected
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      
      e.stopPropagation();
      if (isAnimating || currentRotation) return;
      
      const [x, y, z] = cubelet.position;
      if (z === -1) rotateFace('F', true);
      else if (z === 1) rotateFace('B', true);
      else if (x === -1) rotateFace('L', true);
      else if (x === 1) rotateFace('R', true);
      else if (y === 1) rotateFace('U', true);
      else if (y === -1) rotateFace('D', true);
    } else {
      // Single click - set timeout, let orbit controls handle drag
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
      }, 300);
    }
  }, [isAnimating, currentRotation]);

  // Memoized pointer handlers - don't stop propagation to allow orbit controls
  const handlePointerOver = useCallback((e) => {
    // Only change cursor, don't stop propagation
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = 'default';
  }, []);

  // Get position key
  const getPositionKey = (pos) => `${pos[0]},${pos[1]},${pos[2]}`;

  // Render cubelets organized by layers
  // Each cubelet is rendered in the first layer group it belongs to
  return (
    <>
      {['F', 'B', 'L', 'R', 'U', 'D'].map(face => {
        const layerCubelets = getLayerCubelets(face, cubeState);
        const groupRef = layerGroupsRef.current[face] || React.createRef();
        if (!layerGroupsRef.current[face]) {
          layerGroupsRef.current[face] = groupRef;
        }

        return (
          <group key={`layer-${face}`} ref={groupRef}>
            {layerCubelets.map((cubelet) => {
              const positionKey = getPositionKey(cubelet.position);
              const layers = cubeletLayers[positionKey] || [];
              
              // Only render in the first layer this cubelet belongs to
              if (layers[0] !== face) return null;

              return (
                <Cubelet
                  key={positionKey}
                  cubelet={cubelet}
                  positionKey={positionKey}
                  onClick={(e) => handleClick(e, cubelet)}
                  onPointerOver={handlePointerOver}
                  onPointerOut={handlePointerOut}
                />
              );
            })}
          </group>
        );
      })}
    </>
  );
});

RubiksCube.displayName = 'RubiksCube';

export default RubiksCube;
