/* eslint-disable @next/next/no-img-element */
import React, { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import { event } from 'nextjs-google-analytics';
import { TerminalWindowProps } from './TerminalWindowProps';
import { TerminalWindow } from './TerminalWindow';
import { Typewriter } from './Typewriter';
import { useBreakpoints } from './useBreakpoints';
import { aboutContent } from './aboutContent';
import { TerminalButton } from './TerminalButton';

const { testimonials } = aboutContent;

type Testimonial = (typeof testimonials)[number];

// Manually decide which testimony should dictate window length
const longestTestimonial = testimonials[0];

// Helper function to split mission text into paragraphs
const formatMissionText = (missionText: string) => {
  return missionText
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter((p) => p.length > 0);
};

export const QuoteFigure = ({
  testimonial,
  hidden = false,
}: {
  testimonial: Testimonial;
  hidden?: boolean;
}) => {
  // Get paragraphs by splitting the mission text
  const paragraphs = formatMissionText(testimonial.teamMission);

  return (
    <figure
      className={`${hidden ? 'invisible' : ''} col-[1/-1] row-[1/-1]`}
      aria-hidden={hidden}
    >
      <blockquote className="space-y-4">
        {hidden ? (
          // For hidden version (sizing), keep paragraphs separate
          paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
        ) : (
          // For visible version, use a single Typewriter for continuous flow
          <div className="text-black whitespace-pre-line">
            <Typewriter timePerChar={2}>{paragraphs.join('\n\n')}</Typewriter>
          </div>
        )}
      </blockquote>
    </figure>
  );
};

export const TestimonialsWindow = ({
  children,
  ...terminalWindowProps
}: {
  children: ReactNode;
} & Omit<TerminalWindowProps, 'children'>) => {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const breakpoints = useBreakpoints();
  const breakpoint = breakpoints.about;

  const testimonial = testimonials?.[selectedTeamIndex];

  // Extract the child's onClick handler if it exists
  const childButton = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === 'div'
  ) as React.ReactElement | undefined;

  const childClickHandler = childButton?.props?.children?.props?.onClick;

  useEffect(() => {
    event('testimonial-viewed', {
      label: testimonial?.teamName,
    });
  }, [testimonial?.teamName]);

  return (
    <TerminalWindow {...terminalWindowProps}>
      <div className="flex flex-col p-[1em]">
        {/* Horizontal tabs at the top */}
        <div className="flex justify-center mb-6">
          <ul className="flex gap-2 border-b border-gray-700 w-full">
            {testimonials.map(({ teamName }, index) => (
              <li key={teamName} className="flex-1">
                <button
                  onClick={() => {
                    setSelectedTeamIndex(index);
                  }}
                  type="button"
                  className={`
                    w-full py-2 px-4 font-mono text-center rounded-t-lg
                    ${
                      selectedTeamIndex === index
                        ? 'bg-[#bdffbd] text-black font-bold border-2 border-b-0 border-gray-600'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }
                  `}
                >
                  {teamName}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content area with mission text */}
        <div className="bg-[#bdffbd] text-[1em] p-[1.5em] grid min-h-[400px] flex-grow">
          {/* A hidden div with the longest testimonial which will be used to size */}
          <QuoteFigure testimonial={longestTestimonial} hidden />
          <QuoteFigure testimonial={testimonial} />
        </div>

        {/* Button to meet the team */}
        <div className="mt-6 text-center">
          <TerminalButton
            onClick={() => {
              // Call the parent's handler and pass the selected team index
              if (childClickHandler) {
                childClickHandler(selectedTeamIndex);
              }
            }}
            className="text-[1em] px-6 py-2 bg-violet"
          >
            Meet {testimonial?.teamName} team →
          </TerminalButton>
        </div>
      </div>
    </TerminalWindow>
  );
};
