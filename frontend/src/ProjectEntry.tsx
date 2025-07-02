import React, { Ref, useMemo, useRef, useState, useEffect } from 'react';
import { MathUtils, Mesh, Object3D, FrontSide, TextureLoader } from 'three';
import {
  extend,
  ReactThreeFiber,
  useFrame,
  useThree,
} from '@react-three/fiber';
import { useEventListener, useInterval } from 'usehooks-ts';
import { animated, config, useSpring } from '@react-spring/three';
import { RoundedBoxGeometry } from 'three-stdlib';
import { MeshDistortMaterial } from '@react-three/drei';
import { event } from 'nextjs-google-analytics';
import { Project } from './ProjectContent';
import { CoffeeVideoMaterial } from './CoffeeVideoMaterial';
import { ThreeButton } from './ThreeButton';
import colors from './colors';
import { ProjectHtmlModal } from './ProjectHtmlModal';
import { useBreakpoints } from './useBreakpoints';
import { CoordArray } from './CoordArray';
import { useHasNoMouse } from './useHasNoMouse';
import { ProjectTitlePreview } from './ProjectTitlePreview';
import { useSceneController } from './SceneController';
import { useDevicePerformance } from './useDevicePerformance';

const ROTATION_MAX_SPEED = 0.01;
const MAX_WANDER_DISTANCE = 0.5;

const getRandomCubeOffset = (): CoordArray => [
  (Math.random() * 2 - 1) * MAX_WANDER_DISTANCE,
  (Math.random() * 2 - 1) * MAX_WANDER_DISTANCE,
  (Math.random() * 2 - 1) * MAX_WANDER_DISTANCE,
];

const circle = Math.PI * 2;

extend({ RoundedBoxGeometry });

/* eslint-disable no-unused-vars */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      roundedBoxGeometry: ReactThreeFiber.Object3DNode<
        RoundedBoxGeometry,
        typeof RoundedBoxGeometry
      >;
    }
  }
}

export const ProjectEntry = ({
  project,
  basePosition,
  open,
  setOpen,
  hovering,
  someProjectIsOpen,
  setHovering,
}: {
  project: Project;
  basePosition: CoordArray;
  open: boolean;
  setOpen: (_open: boolean) => void;
  someProjectIsOpen: boolean;
  hovering: boolean;
  setHovering: (_hovering: boolean) => void;
}) => {
  const breakpoints = useBreakpoints();
  const devicePerformance = useDevicePerformance();
  const { gl } = useThree();

  // Only update directions at longer intervals on low-end devices
  const directionInterval = useMemo(
    () => (devicePerformance === 'low' ? 10000 : Math.random() * 5000 + 2500),
    [devicePerformance]
  );

  const [cubeFloatingOffset, setCubeFloatingOffset] = useState<CoordArray>(
    getRandomCubeOffset()
  );

  // Only animate floating when visible and not on low-end devices
  const shouldAnimateFloat = !open && (devicePerformance !== 'low' || hovering);

  const { animatedCubeFloatingOffset } = useSpring({
    animatedCubeFloatingOffset: open
      ? ([0, 0, 0] as CoordArray)
      : cubeFloatingOffset,
    config: {
      duration: open ? 100 : directionInterval,
      // Skip the animation entirely for non-visible elements
      immediate: !shouldAnimateFloat,
    },
  });

  useInterval(() => {
    // Only update floating positions when necessary
    if (shouldAnimateFloat) {
      setCubeFloatingOffset(getRandomCubeOffset());
    }
  }, directionInterval);

  const cubeRef = useRef<Mesh>();
  const rotationSpeeds = useRef({
    x: (Math.random() * 2 - 1) * ROTATION_MAX_SPEED,
    y: (Math.random() * 2 - 1) * ROTATION_MAX_SPEED,
    z: (Math.random() * 2 - 1) * ROTATION_MAX_SPEED,
  });

  const objectAimedAtCamera = useMemo(() => new Object3D(), []);
  const frameSkip = useRef(0);

  // Reduce geometry complexity based on device performance
  const cubeSegments = devicePerformance === 'low' ? 3 : 4;
  const sphereSegments = devicePerformance === 'low' ? 10 : 20;

  // Throttle animation updates based on device performance
  const frameSkipRate = devicePerformance === 'low' ? 3 : 1;

  useFrame(({ camera }) => {
    if (!cubeRef.current) return;

    // Skip frames for performance
    frameSkip.current = (frameSkip.current + 1) % frameSkipRate;
    if (frameSkip.current !== 0 && !hovering && !open) return;

    if (hovering || open) {
      cubeRef.current.getWorldPosition(objectAimedAtCamera.position);
      objectAimedAtCamera.lookAt(camera.position);

      const { x, y, z } = cubeRef.current.rotation;
      cubeRef.current.rotation.x = MathUtils.lerp(
        x,
        Math.round(x / circle) * circle + objectAimedAtCamera.rotation.x,
        0.1
      );
      cubeRef.current.rotation.y = MathUtils.lerp(
        y,
        Math.round(y / circle) * circle + objectAimedAtCamera.rotation.y,
        0.1
      );
      cubeRef.current.rotation.z = MathUtils.lerp(
        z,
        Math.round(z / circle) * circle + objectAimedAtCamera.rotation.z,
        0.1
      );
    } else {
      // Only rotate cubes that are likely to be visible
      const dist = camera.position.distanceTo(cubeRef.current.position);
      if (dist < 15) {
        cubeRef.current.rotation.x += rotationSpeeds.current.x;
        cubeRef.current.rotation.y += rotationSpeeds.current.y;
        cubeRef.current.rotation.z += rotationSpeeds.current.z;
      }
    }
  });

  const hasNoMouse = useHasNoMouse();
  let cubeScale = 1;
  if (hovering) {
    cubeScale = devicePerformance === 'low' ? 2 : 3;
    if (breakpoints.projects) {
      cubeScale = devicePerformance === 'low' ? 2.5 : 3;
    }
  }
  if (open) cubeScale = 0.8;

  const cubePosition: CoordArray = open ? [0.2, 0, 4] : basePosition;

  const { animatedCubePosition } = useSpring({
    animatedCubePosition: cubePosition,
    config:
      devicePerformance === 'low'
        ? { ...config.stiff, friction: 22 }
        : config.stiff,
  });

  const { animatedCubeScale } = useSpring({
    animatedCubeScale: cubeScale,
    config:
      devicePerformance === 'low'
        ? { ...config.wobbly, friction: 15 }
        : config.wobbly,
  });

  const { scene } = useSceneController();
  const active = hovering || open;

  const textureLoader = useMemo(() => new TextureLoader(), []);

  const distortSpeed = devicePerformance === 'low' ? 3 : 6;
  const distortAmount = devicePerformance === 'low' ? 0.3 : 0.5;

  useEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
    }
  });

  // Prepare assets early when hovering to reduce lag when opening
  useEffect(() => {
    if (hovering && !open) {
      // Preload the project thumbnail
      const textureUrl = `/videos/${project?.slug?.current}-thumb.jpg`;

      // Use the proper Three.js way to preload textures
      textureLoader.load(textureUrl, (texture) => {
        // Texture loaded successfully
        texture.needsUpdate = true;

        // Optional: Force a rendering update to ensure texture is uploaded to GPU
        if (gl) {
          gl.renderLists.dispose();
        }
      });
    }
  }, [hovering, open, project?.slug?.current, gl]);

  return (
    <>
      <group position={basePosition}>
        {scene === 'projects' && !someProjectIsOpen && (
          <ThreeButton
            position={[0, 0, 0]}
            width={2}
            height={2}
            description=""
            activationMsg=""
            cursor="open-project"
            onClick={() => {
              setOpen(true);
              event('project-opened', {
                project: project?.slug?.current ?? 'unset',
              });
            }}
            onFocus={() => {
              setHovering(true);
            }}
            onBlur={() => {
              setHovering(false);
            }}
          />
        )}

        <animated.group position={animatedCubeFloatingOffset}>
          {/* Only render glow effect when active or on medium+ performance devices */}
          {(active || devicePerformance !== 'low') && (
            <mesh position={[0, 0, -0.2]} scale={[1, 1, 0.1]}>
              <sphereBufferGeometry
                args={[1, sphereSegments, sphereSegments]}
                attach="geometry"
              />
              <MeshDistortMaterial
                color={colors.cyan}
                speed={distortSpeed}
                radius={1}
                distort={distortAmount}
                transparent
                opacity={0.4}
                roughness={0}
                side={FrontSide}
              />
            </mesh>
          )}
        </animated.group>
      </group>
      <animated.group position={animatedCubePosition}>
        <animated.group
          position={animatedCubeFloatingOffset}
          scale={animatedCubeScale}
        >
          <mesh ref={cubeRef as Ref<Mesh>} renderOrder={active ? 1 : 0}>
            <roundedBoxGeometry
              args={[1, 1, 1, cubeSegments, 0.1]}
              attach="geometry"
            />
            <CoffeeVideoMaterial
              videoSrc={`/videos/${project?.slug?.current}.mp4`}
              thumbSrc={`/videos/${project?.slug?.current}-thumb.jpg`}
              active={active}
            />
          </mesh>
        </animated.group>
      </animated.group>

      {open && (
        <ProjectHtmlModal
          project={project}
          position={breakpoints.projectOpen ? [-1.6, 0, 4.5] : [0, -0.6, 4.5]}
          setOpen={setOpen}
        />
      )}

      {/* Only render title preview when hovering to save resources */}
      {hovering && (
        <ProjectTitlePreview
          project={project}
          basePosition={basePosition}
          visible={hovering}
        />
      )}
    </>
  );
};
