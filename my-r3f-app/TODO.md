# TODO: Implement Rubik's Cube Rotation, Shuffle, and Solve

## Step 1: Define Cube State Structure
- [x] Create initCube() function to initialize 3x3x3 array with positions and colors.
- [x] Each cubelet: { position: [x,y,z], colors: { up: 'white', down: 'yellow', left: 'orange', right: 'red', front: 'blue', back: 'green' } }

## Step 2: Update App.jsx
- [x] Add useState for cubeState, moves (array of moves), isAnimating (boolean).
- [x] Add shuffleCube and solveCube functions.
- [x] Add UI buttons for Shuffle and Solve outside Canvas.
- [x] Pass props to RubiksCube: cubeState, setCubeState, moves, setMoves, isAnimating, setIsAnimating.

## Step 3: Rewrite RubiksCube.jsx
- [x] Use cubeState to render meshes.
- [x] Add onClick to each mesh to trigger rotateFace based on face clicked.
- [x] Implement rotateFace: group layer, animate with useFrame, update state after animation.
- [x] Use useRef for groupRef to animate rotation.

## Step 4: Implement Shuffle
- [ ] shuffleCube: Loop 20 times, random face, call rotateFace, store move in moves.

## Step 5: Implement Solve
- [ ] solveCube: Reverse moves array, call rotateFace for each reversed move.

## Step 6: Implement actual state updates for rotations
- [ ] Update positions and colors when rotating a face.
- [ ] Group the correct layer meshes into the groupRef for animation.

## Step 7: Test and Verify
- [ ] Run app, test clicking faces to rotate.
- [ ] Test shuffle button.
- [ ] Test solve button.
