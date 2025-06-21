import React, { useState } from 'react';
import { TerminalWindow } from './TerminalWindow';
import { TerminalWindowButton } from './TerminalWindowButton';
import Image from 'next/image';

export const TeamMemberWindow = ({
  className,
  title,
  color,
  topColor,
  teamMembers,
  setScene,
  setSlide,
}: {
  className: string;
  title: string;
  color: string;
  topColor: string;
  teamMembers: any[];
  setScene: (_scene: SceneName) => void;
  setSlide: (_slide: SlideName) => void;
}) => {
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const currentMember = teamMembers[currentMemberIndex];

  const nextMember = () => {
    setCurrentMemberIndex((prevIndex) => 
      prevIndex === teamMembers.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevMember = () => {
    setCurrentMemberIndex((prevIndex) => 
      prevIndex === 0 ? teamMembers.length - 1 : prevIndex - 1
    );
  };

  return (
    <TerminalWindow
      className={`${className} max-h-[55vh]`}
      title={title}
      color={color}
      topColor={topColor}
      withMinimize={false}
      withMaximize={false}
    >
      <div className="h-full grid grid-cols-[45%_55%] gap-4 p-4">
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
        <div className="flex flex-col justify-between h-full p-2">
          <div>
            <h2 className="text-2xl font-bold font-mono mb-2">{currentMember.name}</h2>
            <h3 className="text-lg font-semibold font-mono mb-4 text-blue-300">{currentMember.title}</h3>
            <p className="font-mono">{currentMember.description}</p>
          </div>
          
          <div className="flex justify-between mt-4">
            <TerminalWindowButton 
              onClick={prevMember} 
              color="blue"
            >
              Previous Team Member
            </TerminalWindowButton>
            <TerminalWindowButton 
              onClick={nextMember} 
              color="blue"
            >
              Next Team Member
            </TerminalWindowButton>
          </div>
        </div>
      </div>

      <div className="absolute right-2">
        <TerminalWindowButton
          onClick={() => {
            setScene('menu');
            setSlide('intro');
          }}
          color="red"
        >
          Back to Menu
        </TerminalWindowButton>
      </div>
    </TerminalWindow>
  );
};