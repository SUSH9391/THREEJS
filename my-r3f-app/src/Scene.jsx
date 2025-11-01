import React, { Suspense } from 'react'
import { Html, Stats, PresentationControls, OrbitControls } from '@react-three/drei'
import RubiksCube from './RubiksCube'

export default function Scene({ cubeState, setCubeState, moves, setMoves, isAnimating, setIsAnimating }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      <Suspense fallback={<Html>Loading Rubik's Cube...</Html>}>
        <PresentationControls polar={[-0.9, 0.9]} azimuth={[-0.9, 0.9]}>
          <RubiksCube cubeState={cubeState} setCubeState={setCubeState} moves={moves} setMoves={setMoves} isAnimating={isAnimating} setIsAnimating={setIsAnimating} />
          <OrbitControls makeDefault/>
        </PresentationControls>
      </Suspense>

      <Stats />
    </>
  )
}
