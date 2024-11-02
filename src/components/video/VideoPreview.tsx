import React, { useEffect, useRef, useState } from 'react';

interface VideoPreviewProps {
  stream: MediaStream | null;
  onVideoReady?: () => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ stream, onVideoReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !stream) return;

    let mounted = true;

    const setupVideo = async () => {
      try {
        videoElement.srcObject = stream;
        
        // Wait for metadata to load before attempting playback
        await new Promise((resolve) => {
          videoElement.addEventListener('loadedmetadata', resolve, { once: true });
        });

        if (!mounted) return;

        await videoElement.play();
        setIsPlaying(true);
        onVideoReady?.();
      } catch (error) {
        if (!mounted) return;
        console.error('Video setup error:', error);
      }
    };

    setupVideo();

    return () => {
      mounted = false;
      if (videoElement) {
        videoElement.srcObject = null;
        if (isPlaying) {
          videoElement.pause();
          setIsPlaying(false);
        }
      }
    };
  }, [stream, onVideoReady]);

  return (
    <video
      ref={videoRef}
      playsInline
      muted
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
};