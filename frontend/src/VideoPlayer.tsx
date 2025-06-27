import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  caption?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, caption }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <div className="video-container w-full">
      <video 
        ref={videoRef}
        className="w-full rounded-md shadow-lg"
        src={src}
        poster={poster}
        controls
        loop
        muted
        playsInline
      />
      {caption && (
        <p className="text-sm text-gray-500 mt-2 italic text-center">{caption}</p>
      )}
    </div>
  );
};