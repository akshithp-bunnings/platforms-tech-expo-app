/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/prop-types */
import React, { ReactNode } from 'react';
import Image from 'next/image';
import { event } from 'nextjs-google-analytics';
import { CustomCursorHover, CustomCursorState } from './CustomCursor';
import ExternalLinkIconSvg from './svg/ExternalLinkIconSvg';
import { TerminalWindowButton } from './TerminalWindowButton';
import { VideoPlayer } from './VideoPlayer';

// Updated Project type that matches our JSON structure
export type Project = {
  _id: string;
  title: string;
  shortTitle?: string;
  slug: { current: string };
  subTitle?: string;
  team?: string;
  description?: string;
  designers?: Array<{ name: string; url?: string }>;
  links?: Array<{ text: string; url: string }>;
  body?: any[];
  color1?: { hex: string };
};

const ExternalLink = ({
  href,
  cursor = 'external',
  children,
  onClick = () => {},
}: {
  href: string;
  children: ReactNode;
  cursor?: CustomCursorState;
  onClick?: () => void;
}) => (
  <CustomCursorHover cursor={cursor}>
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
          relative block p-2 pr-8 font-mono text-center border-[1px] border-[currentColor]
          hover:text-projectColor hover:border-projectColor hover:fill-projectColor
        "
      onClick={onClick}
    >
      {children}
      <span className="absolute top-0 grid w-6 h-full right-2 place-items-center fill-[currentColor]">
        <ExternalLinkIconSvg />
      </span>
    </a>
  </CustomCursorHover>
);

// Game button component specifically for Project Bootstrap
export const GameButton = ({ projectTitle }: { projectTitle: string }) => {
  // Only show for Project Bootstrap
  if (!projectTitle.toLowerCase().includes('bootstrap')) {
    return null;
  }

  return (
    <div className="my-8">
      <CustomCursorHover cursor="external">
        <a
          href="https://happy-smoke-05ff7f200.1.azurestaticapps.net/"
          rel="noreferrer"
          className="block"
          onClick={() => {
            event('game-button-clicked', {
              project: 'Project Bootstrap',
              url: 'https://happy-smoke-05ff7f200.1.azurestaticapps.net/',
            });
          }}
        >
          <TerminalWindowButton
            color="yellow"
            bgColor="black"
            className="w-full py-4 text-2xl font-bold bg-transparent"
          >
            🎮 Play the Bootstrap Simulator Game! 🎮
          </TerminalWindowButton>
        </a>
      </CustomCursorHover>
    </div>
  );
};

const P = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => <p className={`my-4 ${className}`}>{children}</p>;

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mt-16 font-mono text-2xl">{children}</h2>
);

export const ProjectHeader = ({ project }: { project: Project }) => (
  <>
    <h1
      className="font-mono leading-[1] mb-6 mt-12"
      style={{
        fontSize:
          (project?.title?.length ?? 0) > 15
            ? 'clamp(35px,3.5vw,55px)'
            : 'clamp(35px,6vw,85px)',
      }}
    >
      {project.title}
    </h1>
    {project.subTitle && (
      <h2 className="font-mono text-2xl">{project.subTitle}</h2>
    )}
    {project.team && (
      <dl className="mt-8 font-mono">
        <dt className="font-bold">Team</dt>
        <dd>{project.team}</dd>
      </dl>
    )}
    {/* Add game button for Project Bootstrap */}
    <GameButton projectTitle={project.title} />
  </>
);

function parseMarkdown(text: string) {
  // Handle bold text (**text**)
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export const ProjectBody = ({ project }: { project: Project }) => {
  if (!project?.body || !project.body.length) {
    return null;
  }

  return (
    <div className="my-8 tracking-wide">
      {project.body.map((block, index) => {
        // Text blocks (paragraphs, headings)
        if (block._type === 'text') {
          if (block.style === 'h1') {
            return (
              <h1 className="text-3xl font-mono my-6" key={index}>
                {block.content}
              </h1>
            );
          }
          if (block.style === 'h2') {
            return (
              <h2 className="text-2xl font-mono my-5" key={index}>
                {block.content}
              </h2>
            );
          }
          if (block.style === 'h3') {
            return (
              <h3
                className="text-xl font-mono my-4"
                key={index}
                dangerouslySetInnerHTML={{
                  __html: parseMarkdown(block.content),
                }}
              />
            );
          }
          if (block.style === 'h4') {
            return (
              <h3
                className=" font-mono my-4"
                key={index}
                dangerouslySetInnerHTML={{
                  __html: parseMarkdown(block.content),
                }}
              />
            );
          }
          if (block.style === 'list-item') {
            // Process markdown FIRST, before trying to extract numbers
            const processedContent = parseMarkdown(block.content);

            // Check if there's a number at the beginning after HTML tags are stripped
            const strippedContent = processedContent.replace(/<[^>]*>/g, '');
            const hasNumberPrefix = /^\d+\./.test(strippedContent);

            if (hasNumberPrefix) {
              // For numbered items where the number might be outside bold tags
              const match = processedContent.match(
                /^(?:<strong>)?(\d+\.)(?:<\/strong>)?\s*(.*)/
              );

              if (match) {
                const number = match[1]; // The number with period
                const content = match[2]; // The rest of the content with any HTML tags

                return (
                  <div key={index} className="ml-6 my-2 flex">
                    <div className="text-projectColor font-bold min-w-[2em]">
                      {number.replace(/<\/?strong>/g, '')}
                    </div>
                    <div
                      className="ml-2"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                );
              }
            }

            // Default case for any list item (including ones with bold numbers)
            return (
              <div key={index} className="ml-6 my-2">
                <div dangerouslySetInnerHTML={{ __html: processedContent }} />
              </div>
            );
          }
          // Default to paragraph
          return (
            <p className="my-4" key={index}>
              {block.content}
            </p>
          );
        }

        // Image blocks - Updated to use Next.js Image component
        if (block._type === 'image') {
          return (
            <figure key={index} className="my-8 ">
              <div className="relative w-full h-[350px]">
                <Image
                  src={block.url}
                  alt={block.alt || ''}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {block.caption && (
                <figcaption className="p-2 text-center text-lg">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        // Video blocks - Now using the VideoPlayer component
        if (block._type === 'video') {
          return (
            <figure key={index} className="my-8">
              <VideoPlayer
                src={block.url}
                poster={block.poster}
                caption={block.caption}
              />
            </figure>
          );
        }

        return null;
      })}
    </div>
  );
};

// Helper function to render text spans with marks
function renderSpans(spans: any[] = []) {
  return spans.map((span, i) => {
    // If it has a mark of type "link"
    if (span.marks?.includes('link') && span._key) {
      const linkData = span.markDefs?.find(
        (def: any) => def._key === span._key
      );
      if (linkData && linkData.href) {
        const target = linkData.href.startsWith('http') ? '_blank' : undefined;
        return (
          <a
            key={i}
            href={linkData.href}
            className="underline decoration-1 underline-offset-4 hover:text-projectColor"
            target={target}
            rel={target === '_blank' ? 'noindex nofollow' : ''}
          >
            {span.text}
          </a>
        );
      }
    }

    // Regular text
    return <span key={i}>{span.text}</span>;
  });
}
