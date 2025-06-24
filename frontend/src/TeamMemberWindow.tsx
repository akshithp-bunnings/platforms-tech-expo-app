import React, { useState } from 'react';
import { TerminalWindow } from './TerminalWindow';
import { TerminalWindowButton } from './TerminalWindowButton';
import Image from 'next/image';
import { SceneName } from './SceneController';
import { SlideName } from './SlideName';

export const TeamMemberWindow = ({
  className,
  title,
  color,
  topColor,
  teamMembers,
  setScene,
  setSlide,
  teamSwitcher,
}: {
  className: string;
  title: string;
  color: string;
  topColor: string;
  teamMembers: any[];
  setScene: (_scene: SceneName) => void;
  setSlide: (_slide: SlideName) => void;
  teamSwitcher?: React.ReactNode;
}) => {
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const currentMember = teamMembers[currentMemberIndex];

  const nextMember = () => {
    if (teamMembers.length <= 1) return;
    setCurrentMemberIndex((prevIndex) =>
      prevIndex === teamMembers.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevMember = () => {
    if (teamMembers.length <= 1) return;
    setCurrentMemberIndex((prevIndex) =>
      prevIndex === 0 ? teamMembers.length - 1 : prevIndex - 1
    );
  };

  // Reset the index when team changes
  React.useEffect(() => {
    setCurrentMemberIndex(0);
  }, [teamMembers]);

  return (
    <TerminalWindow
      className={`${className} max-h-[55vh]`}
      title={title}
      color={color}
      topColor={topColor}
      withMinimize={false}
      withMaximize={false}
    >
      {/* Team Switcher UI */}
      {teamSwitcher && (
        <div className="border-b border-gray-700 mb-2 px-4 pt-3 bg- text-white">
          {teamSwitcher}
        </div>
      )}

      {/* Show team members if any exist */}
      {teamMembers.length > 0 && currentMember ? (
        <div className="h-full grid grid-cols-[40%_60%] gap-6 p-6">
          {/* Left side - Photo */}
          <div className="flex items-center justify-center border-2 border-white p-2">
            <div className="relative w-full h-full">
              <Image
                src={currentMember.photo}
                alt={currentMember.name}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          </div>

          {/* Right side - Member info */}
          <div className="flex flex-col text-white justify-between h-full p-2">
            {/* <div>
              <h2 className="text-2xl font-bold font-mono mb-2">
                {currentMember.name}
              </h2>
              <h3 className="text-lg font-semibold font-mono mb-4 text-blue-300">
                {currentMember.title}
              </h3>
              <p className="font-mono">{currentMember.description}</p>
            </div> */}
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold font-mono mb-6 text-white">
                {currentMember.name}
              </h2>
              <h3 className="text-2xl font-semibold font-mono text-blue-300 leading-relaxed">
                {currentMember.title}
              </h3>
              <h3 className="text-2xl font-semibold font-mono text-blue-300 leading-relaxed">
                {currentMember.aura}
              </h3>
            </div>

            {teamMembers.length > 1 && (
              <div className="flex justify-between mt-4 mb-14">
                {' '}
                {/* Added bottom margin to prevent overlap */}
                <TerminalWindowButton onClick={prevMember} color="blue">
                  Previous
                </TerminalWindowButton>
                <TerminalWindowButton onClick={nextMember} color="blue">
                  Next
                </TerminalWindowButton>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center p-4">
          <div className="text-white text-center">
            <p className="text-xl font-mono mb-4">
              No team members found for this team.
            </p>
            <p className="text-sm font-mono">
              Try selecting a different team or check your data source.
            </p>
          </div>
        </div>
      )}

      <div className="absolute right-2 bottom-2 z-10">
        {' '}
        {/* Added z-index */}
        <TerminalWindowButton
          onClick={() => {
            // Go back to testimonials instead of menu
            setSlide('mission');
          }}
          color="red"
        >
          Go Back
        </TerminalWindowButton>
      </div>
    </TerminalWindow>
  );
};
