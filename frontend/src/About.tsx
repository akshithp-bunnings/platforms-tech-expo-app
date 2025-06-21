import { useFrame } from '@react-three/fiber';
import React, {
  useRef, useState,
} from 'react';
import { MathUtils, PerspectiveCamera } from 'three';
import { useEventListener, useWindowSize } from 'usehooks-ts';
import { Html } from '@react-three/drei';
import { event } from 'nextjs-google-analytics';
import { CoordArray } from './CoordArray';
import { CustomCursorHover } from './CustomCursor';
import { SceneName, useSceneController } from './SceneController';
import { Typewriter, TIME_PER_CHAR } from './Typewriter';
import { useBreakpoints } from './useBreakpoints';
import { SkillArtWindow } from './SkillArtWindow';
import { SlideName } from './SlideName';
import { ImageWindow } from './ImageWindow';
import { TextWindow } from './TextWindow';
import { TerminalButton } from './TerminalButton';
// TestimonialsWindow import removed
import colors from './colors';
import { TerminalWindowButton } from './TerminalWindowButton';
import { aboutContent } from './aboutContent';
import teamimage from '../public/teamMemberImages/platform_gang.png'
import { TeamMemberWindow } from './TeamMemberWindow';
// Removed hailey image since it was used in testimonials section

export const Slides = ({
  slide, setScene, setSlide,
}:{
  slide:SlideName,
  setScene:(_scene:SceneName)=>void,
  setSlide:(_slide:SlideName)=>void
}) => {
  const breakpoints = useBreakpoints();
  const breakpoint = breakpoints.about;

  const { scene } = useSceneController();

  if (slide === 'intro') {
    const text1Delay = 800;
    const text2Delay = text1Delay + 22 * TIME_PER_CHAR + 100;
    const buttonDelay = text2Delay + 23 * TIME_PER_CHAR + 300;
    return (
      <div className="p-[1em] font-mono text-white text-[2em]">
        <Typewriter delay={text1Delay} hideCaratAtEnd>
          {aboutContent.intro[0]}
        </Typewriter>
        <Typewriter delay={text2Delay}>
          {aboutContent.intro[1]}
        </Typewriter>
        <div className="grid place-items-center mt-[2em]">
          <TerminalButton
            onClick={() => {
              setScene('about');
              setSlide('mission');
            }}
            delay={buttonDelay}
            className="text-[max(1.2em,16px)]"
            tabIndex={scene === 'menu' ? 0 : -1}
          >
            ABOUT_OUR_TEAM
          </TerminalButton>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Updated conditions to only check for mission or skills */}
      {(slide === 'mission' || slide === 'skills') && (
        <div
          className={`
          grid h-full
          pointer-events-none
          absolute top-0 left-0 w-full
          ${breakpoints.about ? 'grid-cols-[65%_1fr]' : 'grid-rows-[max-content_1fr]'}
        `}
        >
          <TextWindow
            title="CORE_PLATFORMS.exe"
            className={`
            relative self-baseline
            ${breakpoints.about ? '' : `
              w-[90%] max-w-[30em] justify-self-start
            `}
            transition-transform duration-[1s]
            ${slide === 'mission' ? '' : 'translate-x-[-80%] translate-y-[-40%]'}
          `}
            delay={1000}
            topColor="violet"
            wrapperClassName="p-[1em]"
            texts={aboutContent.mission}
            buttonColor="pink"
            buttonText="Want to meet the team?"
            onClick={() => {
              // Changed to go directly to skills
              setSlide('skills');
            }}
            disabled={slide !== 'mission'}
          />
          <ImageWindow
            delay={300}
            title="PLATFORM_GANG.jpg"
            positions={['center']}
            topColor="yellow"
            className={`
            ${breakpoints.about ? `
             self-end min-h-[14em] h-[16em] ml-[-2em] mb-[1em] mr-[-2em]
            ` : `
              min-w-[300px]
              aspect-[9/8]
              justify-self-end  mt-[2em]
            `}

            transition-transform duration-[1s]
            ${slide === 'mission' ? '' : 'translate-x-[20%] translate-y-[70%]'}
          `}
            srcs={[teamimage]}
            alts={['Crayon illustration of Bryant from decades ago.']}
          />
        </div>
      )}
      
      {/* Testimonials section removed */}
      
      {(slide === 'skills') && (
        <div
          className={`
          absolute top-0 left-0 w-full h-full
          grid
          ${breakpoint ? ' grid-rows-[1fr_1em]' : ' grid-rows-[1fr_6em]'}
          pointer-events-none
        `}
        >
          {/* <SkillArtWindow
            className="w-full h-full"
            title="PAINT_TO_SEE_THE_TEAM"
            color="white"
            topColor="white"
            setScene={setScene}
            setSlide={setSlide}
          /> */}
          <TeamMemberWindow
            className="w-full h-full pointer-events-auto"
            title="TEAM_MEMBERS.exe"
            color="white"
            topColor="red"
            teamMembers={aboutContent.teamMembers}
            setScene={setScene}
            setSlide={setSlide}
          />
        </div>
      )}
    </>
  );
};

export function ComputerTerminal() {
  const { scene, setScene } = useSceneController();

  const [slide, _setSlide] = useState<SlideName>('intro');
  const setSlide = (name: SlideName) => {
    event('about-slide', {
      slide: name,
    });
    _setSlide(name);
  };

  // Position and size of plane that our div should cover as closely as possible
  const position:CoordArray = [-1, 0.7, 1.8];
  // Increased the size slightly for better readability
  const planeSizeInWorldUnits = [2.7, 2.2];

  // Canvas is full window
  const windowSize = useWindowSize();

  const breakpoints = useBreakpoints();

  // The div we will style
  const terminalDivRef = useRef<HTMLDivElement>(null);

  useFrame(({ camera }) => {
    if (!terminalDivRef.current) return;

    // get FOV in radians
    const perspectiveCamera = camera as PerspectiveCamera;
    const vFOV = MathUtils.degToRad(perspectiveCamera.fov);

    /** Distance of plane from camera */
    const dist = Math.abs(perspectiveCamera.position.z - position[2]);

    /** Height of full plane in view of camera at this dist */
    const worldCameraHeight = 2 * Math.tan(vFOV / 2) * dist;

    /** Width of full plane in view of camera at this dist */
    const worldCameraWidth = worldCameraHeight * perspectiveCamera.aspect;

    /** Width of our plane in screen pixels */
    const planeWidthInPixels = (planeSizeInWorldUnits[0] / worldCameraWidth) * windowSize.width;

    /** Height of our plane in screen pixels */
    const planeHeightInPixels = (planeSizeInWorldUnits[1] / worldCameraHeight) * windowSize.height;

    // Apply sizing to our terminal div via CSS vars - increased scale factor
    terminalDivRef.current.style.setProperty('--terminal-width', `min(${windowSize.width * 0.95}px, ${planeWidthInPixels * 1.1}px)`);
    terminalDivRef.current.style.setProperty('--terminal-height', `min(90 * var(--vh), ${planeHeightInPixels * 1.1}px)`);
  });

  // Exit on escape key
  useEventListener('keypress', (e) => {
    if (e.key === 'Escape') {
      if (scene === 'about') {
        setScene('menu');
        setSlide('intro');
      }
    }
  });

  return (
    <group
      position={position}
      rotation={[0, 0, Math.PI / 40]}
    >
      <Html>
        <CustomCursorHover cursor="terminal">
          <div
            className={`
                ${breakpoints.about ? 'rotate-[-5deg]' : 'rotate-[-4deg]'}
                 -translate-x-1/2 -translate-y-1/2
                w-[var(--terminal-width)] h-[var(--terminal-height)]
              `}
            style={{
              fontSize: 'calc(var(--terminal-width)/38)', // Slightly larger font
            }}
            ref={terminalDivRef}
          >
            <Slides slide={slide} setSlide={setSlide} setScene={setScene} />

            {slide !== 'intro' && (
            <div
              className={`absolute
                text-[max(0.7em,16px)]
                right-0
                top-0
                z-[-1]
              `}
            >
              <TerminalButton
                onClick={() => {
                  setScene('menu');
                  setSlide('intro');
                }}
                delay={500}
                className="font-mono"
              >
                {breakpoints.about ? 'BACK_TO_MENU' : 'BACK'}
              </TerminalButton>
            </div>
            )}
          </div>
        </CustomCursorHover>
      </Html>
    </group>
  );
}