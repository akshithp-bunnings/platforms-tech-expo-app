/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/prop-types */
import React, { ReactNode, useMemo } from 'react';
import { event } from 'nextjs-google-analytics';
import { CustomCursorHover, CustomCursorState } from './CustomCursor';
import ExternalLinkIconSvg from './svg/ExternalLinkIconSvg';
import { contactHref } from './contactHref';

// Updated Project type that matches our JSON structure
export type Project = {
  _id: string;
  title: string;
  shortTitle?: string;
  slug: { current: string };
  subTitle?: string;
  client?: string;
  description?: string;
  designers?: Array<{ name: string; url?: string }>;
  links?: Array<{ text: string; url: string }>;
  body?: any[];
  color1?: { hex: string };
};

const ExternalLink = ({
  href, cursor = 'external', children, onClick = () => {},
}: { href: string; children: ReactNode; cursor?: CustomCursorState; onClick?: ()=>void}) => (
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
      <span className="absolute top-0 grid w-6 h-full right-2 place-items-center fill-[currentColor]"><ExternalLinkIconSvg /></span>
    </a>
  </CustomCursorHover>
);

const P = ({ children, className = '' }: { children: ReactNode; className?: string; }) => (<p className={`my-4 ${className}`}>{children}</p>);

const H2 = ({ children }: { children: ReactNode; }) => (
  <h2
    className="mt-16 font-mono text-2xl"
  >
    {children}
  </h2>
);

export const ProjectHeader = ({ project }: { project: Project; }) => (
  <>
    <h1
      className="font-mono leading-[1] mb-6 mt-12"
      style={{
        fontSize: (project?.title?.length ?? 0) > 15 ? 'clamp(35px,3.5vw,55px)' : 'clamp(35px,6vw,85px)',
      }}
    >
      {project.title}
    </h1>
    {project.subTitle && (
      <h2 className="font-mono text-2xl">
        {project.subTitle}
      </h2>
    )}
    {(project.designers?.length || project.client) && (
      <div className="grid grid-cols-2 gap-8">
        {project.client && (
          <dl className="mt-8 font-mono">
            <dt className="font-bold">Client</dt>
            <dd>{project.client}</dd>
          </dl>
        )}
        {project.designers?.length && (
          <dl className="mt-8 font-mono">
            <dt className="font-bold">Design</dt>
            <dd>
              <ul>
                {project.designers.map((designer) => (
                  <li key={designer.name}>
                    {designer.url ? (
                      <CustomCursorHover cursor="external">
                        <a
                          href={designer.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block p-0 underline decoration-1 underline-offset-4 hover:text-projectColor hover:border-b-projectColor"
                        >
                          {designer.name}
                        </a>
                      </CustomCursorHover>
                    ) : designer.name}
                  </li>
                ))}
              </ul>
            </dd>
          </dl>
        )}
      </div>
    )}
    {project.links?.length && (
      <ul className="col-span-2 mt-8">
        {project.links.map((link) => (
          <li className="mt-4 first:mt-0" key={link.url}>
            <ExternalLink href={link.url ?? ''}>{link.text}</ExternalLink>
          </li>
        ))}
      </ul>
    )}
  </>
);

export const ProjectBody = ({ project }: { project: Project; }) => useMemo(() => {
  // If there's no body content, show the description
  if (!project?.body || !project.body.length) {
    return (
      <div className="my-8 tracking-wide">
        <P>{project.description || ''}</P>
      </div>
    );
  }
  
  // Simple rendering of body content from JSON
  return (
    <div className="my-8 tracking-wide">
      {project.body.map((block, index) => {
        // Handle basic block text
        if (block._type === 'block') {
          const style = block.style || 'normal';
          
          // Handle different block styles
          if (style === 'h2') {
            return <H2 key={index}>{renderSpans(block.children)}</H2>;
          }
          
          if (style === 'h3') {
            return <h3 className="my-4 font-mono" key={index}>{renderSpans(block.children)}</h3>;
          }
          
          // Default to paragraph
          return <P key={index}>{renderSpans(block.children)}</P>;
        }
        
        // Handle image figures
        if (block._type === 'imageFigure' && block.image) {
          return (
            <figure key={index} className="border-[1px] border-[currentColor]">
              <img
                src={block.image.url || ''}
                alt={block.alt || ''}
              />
            </figure>
          );
        }
        
        // Handle Vimeo videos
        if (block._type === 'vimeo' && block.id) {
          return (
            <div key={index} className="my-8 border-[1px] border-[currentColor]">
              <iframe
                src={`https://player.vimeo.com/video/${block.id}`}
                width="100%"
                height="400"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Embedded Vimeo"
              ></iframe>
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
}, [project]);

// Helper function to render text spans with marks
function renderSpans(spans: any[] = []) {
  return spans.map((span, i) => {
    // If it has a mark of type "link"
    if (span.marks?.includes('link') && span._key) {
      const linkData = span.markDefs?.find((def: any) => def._key === span._key);
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

export const ProjectCTA = ({ slug }:{slug:string}) => (
  <div className="mb-[5em]">
    <H2>Questions?</H2>
    <P className="mb-8">
      {`
        Wanna nerd out and talk shop?
        Have a project of your own you wanna discuss?
        Just wanna say hi and introduce yourself?
        I'd love to hear from you!
      `}
    </P>
    <ExternalLink
      href={contactHref}
      cursor="contact"
      onClick={() => {
        event('cta', {
          type: 'email',
          location: `project-${slug}`,
        });
      }}
    >
      platformtribe.exe
    </ExternalLink>
  </div>
);