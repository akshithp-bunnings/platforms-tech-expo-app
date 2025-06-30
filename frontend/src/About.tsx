import { useFrame } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import { MathUtils, PerspectiveCamera } from 'three';
import { useEventListener, useWindowSize } from 'usehooks-ts';
import { Html } from '@react-three/drei';
import { event } from 'nextjs-google-analytics';
import { CoordArray } from './CoordArray';
import { CustomCursorHover } from './CustomCursor';
import { SceneName, useSceneController } from './SceneController';
import { Typewriter, TIME_PER_CHAR } from './Typewriter';
import { useBreakpoints } from './useBreakpoints';
// import { SkillArtWindow } from './SkillArtWindow';
import { SlideName } from './SlideName';
import { ImageWindow } from './ImageWindow';
import { TextWindow } from './TextWindow'; // Keep for now, used in the transition
import { TerminalButton } from './TerminalButton';
import { TestimonialsWindow } from './TestimonialsWindow'; // Re-added import
// import colors from './colors';
import { TerminalWindowButton } from './TerminalWindowButton';
import { aboutContent } from './aboutContent';
import teamimage from '../public/teamMemberImages/platform_gang.png';
import { TeamMemberWindow } from './TeamMemberWindow';
import { useDevicePerformance } from './useDevicePerformance';
import servicesOpsTeam from '../public/teamMemberImages/serviceops.png';

export const Slides = ({
  slide,
  setScene,
  setSlide,
}: {
  slide: SlideName;
  setScene: (_scene: SceneName) => void;
  setSlide: (_slide: SlideName) => void;
}) => {
  const devicePerformance = useDevicePerformance();
  const breakpoints = useBreakpoints();
  const breakpoint = breakpoints.about;
  // Add state to track which team's testimonials are selected
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);

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
        <Typewriter delay={text2Delay}>{aboutContent.intro[1]}</Typewriter>
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
      {/* Updated to use testimonials window */}
      {slide === 'mission' && (
        <div
          className={`
      grid h-full
      pointer-events-none
      absolute top-0 left-0 w-full
      ${
        breakpoints.about
          ? 'grid-cols-[65%_1fr]'
          : 'grid-rows-[max-content_1fr]'
      }
    `}
        >
          <TestimonialsWindow
            title="TEAM_INFO.exe"
            className={`
        relative self-baseline pointer-events-auto
        ${
          breakpoints.about
            ? 'max-w-[1000px] w-[120%] h-[85%]'
            : `w-[95%] max-w-[40em] justify-self-start`
        }
      `}
            delay={devicePerformance === 'low' ? 500 : 1000}
            topColor="cyan"
            color="lime"
            optimizeForPerformance={devicePerformance === 'low'}
            selectedTeamIndex={selectedTeamIndex}
            setSelectedTeamIndex={setSelectedTeamIndex}
          >
            <div className="mt-4 text-center">
              <TerminalButton
                onClick={() => {
                  // No need to reset selectedTeamIndex here, just change slides
                  setSlide('skills');
                }}
                className="text-[0.8em] mt-2"
              >
                Meet the team →
              </TerminalButton>
            </div>
          </TestimonialsWindow>

          {/* Core Platforms image - only show when Core Platforms tab is selected (index 0) */}
          {selectedTeamIndex === 0 && (
            <ImageWindow
              delay={300}
              title="PLATFORM_GANG.jpg"
              positions={['center']}
              topColor="yellow"
              className={`
          ${
            breakpoints.about
              ? `self-end min-h-[14em] h-[16em] ml-[2em] mb-[1em] mr-[-6em]`
              : `min-w-[300px] aspect-[9/8] justify-self-end mt-[2em]`
          }
        `}
              srcs={[teamimage]}
              alts={['Platform Tribe team image']}
            />
          )}

          {/* ServiceOps image - only show when ServiceOps tab is selected (index 1) */}
          {selectedTeamIndex === 1 && (
            <ImageWindow
              delay={300}
              title="SERVICE_OPS.jpg"
              positions={['center']}
              topColor="purple"
              className={`
          ${
            breakpoints.about
              ? `self-end min-h-[14em] h-[16em] ml-[2em] mb-[1em] mr-[-6em]`
              : `min-w-[300px] aspect-[9/8] justify-self-end mt-[2em]`
          }
        `}
              srcs={[servicesOpsTeam]}
              alts={['Service Ops team image']}
            />
          )}
        </div>
      )}
      {slide === 'skills' && (
        <div
          className={`
          absolute top-0 left-0 w-full h-full
          grid
          ${breakpoint ? ' grid-rows-[1fr_1em]' : ' grid-rows-[1fr_6em]'}
          pointer-events-none
        `}
        >
          <TeamMemberWindow
            className="w-full h-full pointer-events-auto"
            title={`${
              aboutContent.testimonials[selectedTeamIndex]?.teamName ||
              'TEAM_MEMBERS'
            }.exe`}
            color="black"
            topColor="pink"
            teamMembers={aboutContent.teamMembers.filter((member) => {
              // Filter team members based on the selected team
              const teamName =
                aboutContent.testimonials[selectedTeamIndex]?.teamName;
              if (teamName === 'Core Platforms') {
                return member.team === 'CorePlatforms';
              } else if (teamName === 'ServiceOps') {
                return member.team === 'ServiceOps';
              }
              return false; // Don't show any if no match
            })}
            setScene={setScene}
            setSlide={setSlide}
            // Add team switching capability
            teamSwitcher={
              <div className="flex gap-2 mb-4">
                {aboutContent.testimonials.map((team, idx) => (
                  <button
                    key={team.teamName}
                    className={`px-4 py-2 font-mono ${
                      selectedTeamIndex === idx
                        ? 'bg-blue text-white'
                        : 'text-gray-400 hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedTeamIndex(idx)}
                  >
                    {team.teamName}
                  </button>
                ))}
              </div>
            }
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
  const position: CoordArray = [-1, 0.7, 1.8];
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
    const planeWidthInPixels =
      (planeSizeInWorldUnits[0] / worldCameraWidth) * windowSize.width;

    /** Height of our plane in screen pixels */
    const planeHeightInPixels =
      (planeSizeInWorldUnits[1] / worldCameraHeight) * windowSize.height;

    // Apply sizing to our terminal div via CSS vars - increased scale factor
    terminalDivRef.current.style.setProperty(
      '--terminal-width',
      `min(${windowSize.width * 0.95}px, ${planeWidthInPixels * 1.1}px)`
    );
    terminalDivRef.current.style.setProperty(
      '--terminal-height',
      `min(90 * var(--vh), ${planeHeightInPixels * 1.1}px)`
    );
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
    <group position={position} rotation={[0, 0, Math.PI / 40]}>
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