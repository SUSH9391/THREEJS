import React, { Suspense } from 'react'
import { Html, Stats, OrbitControls } from '@react-three/drei'
import RubiksCube from './RubiksCube'

export default function Scene({ cubeRef, cubeState, setCubeState, isAnimating, setIsAnimating }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.4} />

      <Suspense fallback={<Html>Loading Rubik's Cube...</Html>}>
        <OrbitControls 
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={15}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.8}
          zoomSpeed={0.8}
          panSpeed={0.8}
          target={[0, 0, 0]}
          autoRotate={false}
        />
        <RubiksCube 
          ref={cubeRef}
          cubeState={cubeState} 
          setCubeState={setCubeState} 
          isAnimating={isAnimating} 
          setIsAnimating={setIsAnimating} 
        />
      </Suspense>

      <Stats />
    </>
  )
}
