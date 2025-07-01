import React, { useEffect, useRef } from 'react';
import { useCustomCursorStore } from './CustomCursor';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  caption?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, caption }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const setTempHidden = useCustomCursorStore(state => state.setTempHidden);

  useEffect(() => {
    // Ensure video plays when it's ready
    if (videoRef.current) {
      videoRef.current.addEventListener('canplay', () => {
        // Try to play the video
        videoRef.current?.play().catch(err => {
          // This will happen on browsers that block autoplay
          console.log('Autoplay was prevented:', err);
        });
      });
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('canplay', () => {});
        videoRef.current.pause();
      }
    };
  }, [src]);
  
  // Handle cursor display when hovering over video
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const handleMouseEnter = () => {
        setTempHidden(true);
        document.body.classList.add('video-interaction');
      };
      
      const handleMouseLeave = () => {
        setTempHidden(false);
        document.body.classList.remove('video-interaction');
      };
      
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        setTempHidden(false);
        document.body.classList.remove('video-interaction');
      };
    }
  }, [setTempHidden]);

  return (
    <div className="video-container w-full" ref={containerRef}>
      <div className="cursor-override z-50">
        <video 
          ref={videoRef}
          className="w-full rounded-md shadow-lg cursor-pointer"
          src={src}
          poster={poster}
          controls
          loop
          muted
          playsInline
        />
      </div>
      {caption && (
        <p className="text-sm text-gray-500 mt-2 italic text-center">{caption}</p>
      )}
    </div>
  );
};