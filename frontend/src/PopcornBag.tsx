import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from '@react-three/fiber';
import { useSpring, animated, config } from '@react-spring/three';
import { Text } from '@react-three/drei';
import { ThreeButton } from './ThreeButton';
import { useBreakpoints } from './useBreakpoints';
import { useSceneController } from './SceneController';
import { useTrueAfterDelay } from './useTrueAfterDelay';
import { fontUrls } from './typography';

export function PopcornBag() {
  const breakpoints = useBreakpoints();
  const sceneController = useSceneController();
  const { scene } = sceneController;

  // Animation timing
  let time = 450;
  const projectButtonVisible1 = useTrueAfterDelay((time += 1000));
  const projectButtonVisible2 = useTrueAfterDelay((time += 1000));
  const bagButtonEnabled = useTrueAfterDelay(time);
  const [hovering, setHovering] = useState(false);

  // Set up hover effects
  let bagHoverRotation = 0;
  if (scene === 'menu' && hovering) bagHoverRotation = Math.PI / 6;
  if (scene === 'projects' && hovering) bagHoverRotation = -Math.PI / 6;

  // Position based on scene and breakpoints
  let position = breakpoints.menu ? [3.5, 0.4, 3.5] : [0.2, 1.9, 3.8];
  let rotation = [0, 0, 0];

  if (scene === 'projects' || scene === 'project-open') {
    position = [1.5, -6.5, 3.02];
    rotation = [0.0, 0.0, 2 + Math.PI * 2];

    if (breakpoints.projects) {
      position = [4, -10.5, 3.02];
      rotation = [0.0, 0.0, 1.88 + Math.PI * 2];
    }
  }

  const spilled = scene === 'projects' || scene === 'project-open';

  // Animation for position and rotation
  const { animatedPosition, animatedRotation } = useSpring({
    animatedPosition: position,
    animatedRotation: [
      rotation[0],
      rotation[1],
      rotation[2] + bagHoverRotation,
    ],
    config: config.wobbly,
  });

  // Load SVG data for popcorn bag elements
  const bagOutlineData = useLoader(
    SVGLoader,
    '/popcorn/popcorn-bag-outline.svg'
  );
  const stripesData = useLoader(SVGLoader, '/popcorn/stripes.svg');
  const textData = useLoader(SVGLoader, '/popcorn/text.svg');
  const kernelsData = useLoader(SVGLoader, '/popcorn/popcorn-kernels.svg');

  // References for animation
  const bagRef = useRef();
  const kernelsRef = useRef();

  // Gentle floating animation
  useFrame(({ clock }) => {
    if (bagRef.current) {
      bagRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.03;
    }

    if (kernelsRef.current) {
      // Make kernels float slightly more for a dynamic effect
      kernelsRef.current.position.y =
        0.1 + Math.sin(clock.getElapsedTime() * 0.8) * 0.05;
      kernelsRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() * 0.3) * 0.02;
    }
  });

  // Function to create SVG meshes with proper layering
  const createSvgMesh = (pathData, color, zOffset = 0, extrusion = 0.05) => {
    if (!pathData) return null;

    const shapes = [];
    pathData.paths.forEach((path) => {
      const shape = path.toShapes(false);
      shapes.push(...shape);
    });

    return shapes.map((shape, i) => (
      <mesh key={`svg-${color}-${i}`} position={[0, 0, zOffset]}>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: extrusion,
              bevelEnabled: false,
            },
          ]}
        />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
    ));
  };

  return (
    <animated.group position={animatedPosition} rotation={animatedRotation}>
      {/* Main bag container with proper scaling */}
      <group
        ref={bagRef}
        scale={[0.003, 0.003, 0.003]}
        rotation={[0, 0, Math.PI]} // Flip to correct orientation
      >
        {/* === ASSEMBLY ORDER: FROM BOTTOM TO TOP === */}

        {/* 1. Bag Outline - Yellow */}
        <group scale={[0.5, 0.5, 0.5]}>
          {createSvgMesh(bagOutlineData, '#FFD700', 0, 0.1)}
        </group>

        {/* 2. Stripes - Red */}
        <group scale={[0.6, 0.5, 0.5]} position={[110, 70, 0.1]}>
          {createSvgMesh(stripesData, '#FF4500', 0, 0.1)}
        </group>

        {/* 4. Kernels - Cream - POSITION AT TOP OF BAG */}
        <group
          scale={[0.8, 0.8, 0.6]}
          position={[-80, -240, 0.3]} // Highest Y value places at top
        >
          {createSvgMesh(kernelsData, '#FFFDD0', 0, 0.15)}
        </group>
      </group>

      {/* Button text overlay */}
      <Text
        position={[-0.7, -1.05, 0.1]}
        rotation={[0, 0, 0]}
        color={'#0000FF'}
        anchorX="center"
        anchorY="middle"
        fontSize={0.5}
        font={fontUrls.bryantBold}
        visible={projectButtonVisible1}
      >
        {scene === 'projects' || scene === 'project-open'
          ? 'Back'.toUpperCase()
          : 'Proj\nects'.toUpperCase()}
      </Text>

      {/* Interactive buttons */}
      {bagButtonEnabled && scene === 'menu' && (
        <ThreeButton
          position={[0, 0, 0]}
          width={2}
          height={2}
          description={'A popcorn bag with the word "Projects" on it.'}
          activationMsg="Popcorn bag tips over, kernels spill everywhere, a project carousel animates into view."
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
          cursor="spill"
          onClick={() => sceneController.setScene('projects')}
        />
      )}

      {bagButtonEnabled && scene === 'projects' && (
        <ThreeButton
          position={[0, 0, 0]}
          width={1.5}
          height={1.5}
          description={'A spilled popcorn bag with the word "Back" on it'}
          activationMsg="Popcorn bag uprights itself, the project carousel slides out of view."
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
          cursor="spill"
          onClick={() => sceneController.setScene('menu')}
        />
      )}
    </animated.group>
  );
}
