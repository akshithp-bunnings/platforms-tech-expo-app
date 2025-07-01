import React, { useEffect, useRef, useState } from 'react';
import { useCustomCursorStore } from './CustomCursor';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  caption?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  caption,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const setTempHidden = useCustomCursorStore((state) => state.setTempHidden);
  const [isLoading, setIsLoading] = useState(true);
  const [seekError, setSeekError] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted due to browser restrictions

  // Attempt to autoplay the video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      const attemptAutoplay = async () => {
        try {
          // Set initial mid volume (browser may override this)
          video.volume = 0.5;

          // Attempt to play with sound
          await video.play();
          setIsMuted(false);
          console.log('Autoplay with sound successful');
        } catch (err) {
          console.log('Autoplay with sound failed, trying muted', err);

          // Fall back to muted autoplay
          video.muted = true;
          try {
            await video.play();
            setIsMuted(true);
            console.log('Muted autoplay successful');
          } catch (mutedErr) {
            console.error('Even muted autoplay failed', mutedErr);
          }
        }
      };

      // Wait for canplay before attempting autoplay
      const onCanPlay = () => {
        attemptAutoplay();
      };

      video.addEventListener('canplay', onCanPlay);

      return () => {
        video.removeEventListener('canplay', onCanPlay);
      };
    }
  }, [src]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      const handleCanPlay = () => {
        setIsLoading(false);
        setSeekError(false);
        console.log('Video can play now');
      };

      const handleError = (e: Event) => {
        console.error('Video error:', e);
        setIsLoading(false);
      };

      const handleSeeking = () => {
        setIsLoading(true);
      };

      const handleSeeked = () => {
        setIsLoading(false);
        setSeekError(false);
      };

      const handleSeekedError = () => {
        setSeekError(true);
        setIsLoading(false);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      video.addEventListener('seeking', handleSeeking);
      video.addEventListener('seeked', handleSeeked);
      video.addEventListener('stalled', handleSeekedError);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.removeEventListener('seeking', handleSeeking);
        video.removeEventListener('seeked', handleSeeked);
        video.removeEventListener('stalled', handleSeekedError);
        video.pause();
      };
    }
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

  // Function to toggle mute status
  const toggleMute = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.muted = !video.muted;
      setIsMuted(video.muted);
      if (!video.muted) {
        video.volume = 0.5; // Set to mid volume when unmuted
      }
    }
  };

  return (
    <div className="video-container w-full" ref={containerRef}>
      <div className="cursor-override z-50 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <p className="text-white font-bold">Loading...</p>
          </div>
        )}
        {seekError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <p className="text-white font-bold">Seeking failed. Try again.</p>
          </div>
        )}
        <video
          ref={videoRef}
          className="w-full rounded-md shadow-lg cursor-pointer"
          src={src}
          poster={poster || '/videos/poster-fallback.jpg'}
          controls
          loop
          autoPlay
          muted={isMuted}
          playsInline
          preload="auto"
          crossOrigin="anonymous"
        />

        {/* Show unmute button if video is muted */}
        {isMuted && (
          <button
            onClick={toggleMute}
            className="absolute bottom-14 right-4 bg-black/70 text-white px-3 py-1 rounded-md z-20 hover:bg-black/90 transition-colors"
            aria-label="Unmute video"
          >
            🔊 Unmute
          </button>
        )}
      </div>
      {caption && (
        <p className="text-sm text-gray-500 mt-2 italic text-center">
          {caption}
        </p>
      )}
    </div>
  );
};
