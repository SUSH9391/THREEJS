// RubiksCube.jsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function RubiksCube({ cubeState, setCubeState, moves, setMoves, isAnimating, setIsAnimating }) {
  const groupRef = useRef();
  const [rotatingFace, setRotatingFace] = React.useState(null);
  const [rotationAngle, setRotationAngle] = React.useState(0);
  const [targetAngle, setTargetAngle] = React.useState(0);

  // Function to get color based on face
  const getColor = (cubelet, face) => {
    return cubelet.colors[face];
  };

  // Function to rotate face
  const rotateFace = (face) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setRotatingFace(face);
    setRotationAngle(0);
    setTargetAngle(Math.PI / 2); // 90 degrees
  };

  // Animation loop
  useFrame((state, delta) => {
    if (rotatingFace && groupRef.current) {
      const speed = 2; // radians per second
      const increment = delta * speed;
      if (rotationAngle < targetAngle) {
        groupRef.current.rotation.z += increment;
        setRotationAngle(prev => prev + increment);
      } else {
        // Snap to exact 90 degrees
        groupRef.current.rotation.z = Math.round(groupRef.current.rotation.z / (Math.PI / 2)) * (Math.PI / 2);
        // Update cube state
        updateCubeState(rotatingFace);
        setRotatingFace(null);
        setIsAnimating(false);
      }
    }
  });

  // Update cube state after rotation
  const updateCubeState = (face) => {
    // Placeholder: For now, just log. Need to implement actual state update
    console.log(`Rotated face: ${face}`);
    // TODO: Update positions and colors based on rotation
  };

  // Handle click on cubelet to rotate face
  const handleClick = (cubelet) => {
    // Determine which face was clicked based on position
    // For simplicity, assume clicking on front face rotates front
    rotateFace('F');
  };

  return (
    <>
      {cubeState.map((cubelet, index) => (
        <mesh key={index} position={cubelet.position} onClick={() => handleClick(cubelet)}>
          <boxGeometry args={[0.98, 0.98, 0.98]} />
          <meshStandardMaterial attach="material-0" color={getColor(cubelet, 'back')} />  {/* +Z */}
          <meshStandardMaterial attach="material-1" color={getColor(cubelet, 'front')} /> {/* -Z */}
          <meshStandardMaterial attach="material-2" color={getColor(cubelet, 'up')} />    {/* +Y */}
          <meshStandardMaterial attach="material-3" color={getColor(cubelet, 'down')} />  {/* -Y */}
          <meshStandardMaterial attach="material-4" color={getColor(cubelet, 'right')} /> {/* +X */}
          <meshStandardMaterial attach="material-5" color={getColor(cubelet, 'left')} />  {/* -X */}
        </mesh>
      ))}
      {/* Group for rotating layer */}
      <group ref={groupRef}>
        {/* TODO: Add meshes for the layer being rotated */}
      </group>
    </>
  );
}
