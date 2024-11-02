import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface ARVideoOverlayProps {
  videoUrl: string;
  isVisible: boolean;
  onPlaybackComplete?: () => void;
}

export const ARVideoOverlay: React.FC<ARVideoOverlayProps> = ({
  videoUrl,
  isVisible,
  onPlaybackComplete
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { viewport } = useThree();

  useEffect(() => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    video.src = videoUrl;
    
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    
    videoRef.current = video;
    textureRef.current = texture;

    const handleCanPlay = () => setIsReady(true);
    const handleEnded = () => onPlaybackComplete?.();

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.pause();
      video.src = '';
      video.load();
      texture.dispose();
    };
  }, [videoUrl, onPlaybackComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    const playVideo = async () => {
      if (isVisible) {
        try {
          video.currentTime = 0;
          await video.play();
        } catch (error) {
          console.error('Video playback error:', error);
        }
      } else {
        video.pause();
      }
    };

    playVideo();
  }, [isVisible, isReady]);

  useFrame(() => {
    if (textureRef.current && videoRef.current && isReady && isVisible) {
      textureRef.current.needsUpdate = true;
    }
  });

  if (!isReady || !textureRef.current || !isVisible) return null;

  // Calculate dimensions to maintain aspect ratio
  const videoWidth = videoRef.current?.videoWidth || 16;
  const videoHeight = videoRef.current?.videoHeight || 9;
  const aspectRatio = videoWidth / videoHeight;

  // Scale to fill viewport while maintaining aspect ratio
  const scale = Math.max(viewport.width, viewport.height / aspectRatio);
  const width = scale;
  const height = scale / aspectRatio;

  return (
    <mesh position={[0, 0, -0.1]} scale={[width, height, 1]}>
      <planeGeometry />
      <meshBasicMaterial
        map={textureRef.current}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
};