import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface ARMarkerDetectionProps {
  markerImage: string;
  onMarkerFound?: () => void;
  onMarkerLost?: () => void;
}

export const ARMarkerDetection: React.FC<ARMarkerDetectionProps> = ({
  markerImage,
  onMarkerFound,
  onMarkerLost
}) => {
  const markerRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastVisibleRef = useRef(false);
  const { viewport, camera } = useThree();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const image = new Image();
    
    image.onload = () => {
      textureLoader.load(
        markerImage,
        (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.needsUpdate = true;
          textureRef.current = texture;
          setIsLoaded(true);
        },
        undefined,
        (error) => {
          console.error('Error loading marker texture:', error);
        }
      );
    };

    image.src = markerImage;

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, [markerImage]);

  useFrame(() => {
    if (!markerRef.current || !isLoaded) return;

    const mesh = markerRef.current;
    mesh.lookAt(camera.position);

    // Improved marker detection logic
    const distance = camera.position.distanceTo(mesh.position);
    const isVisible = distance < 5 && Math.abs(camera.rotation.z) < Math.PI / 4;

    if (isVisible !== lastVisibleRef.current) {
      lastVisibleRef.current = isVisible;
      if (isVisible) {
        onMarkerFound?.();
      } else {
        onMarkerLost?.();
      }
    }
  });

  if (!isLoaded || !textureRef.current) return null;

  // Calculate dimensions to maintain aspect ratio
  const imageWidth = textureRef.current.image.width;
  const imageHeight = textureRef.current.image.height;
  const aspectRatio = imageWidth / imageHeight;

  // Scale to fill viewport while maintaining aspect ratio
  const scale = Math.max(viewport.width, viewport.height / aspectRatio);
  const width = scale;
  const height = scale / aspectRatio;

  return (
    <mesh 
      ref={markerRef} 
      position={[0, 0, 0]}
      scale={[width, height, 1]}
    >
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