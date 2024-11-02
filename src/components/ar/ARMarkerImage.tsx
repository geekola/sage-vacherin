import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

interface ARMarkerImageProps {
  imageUrl: string;
  opacity?: number;
}

export const ARMarkerImage: React.FC<ARMarkerImageProps> = ({ 
  imageUrl,
  opacity = 1 
}) => {
  const { viewport } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('Error loading marker image:', error);
      }
    );

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }
  }, [opacity]);

  if (!texture) return null;

  // Calculate dimensions to maintain aspect ratio
  const imageWidth = texture.image.width;
  const imageHeight = texture.image.height;
  const aspectRatio = imageWidth / imageHeight;

  // Scale to fill viewport while maintaining aspect ratio
  const scale = Math.max(viewport.width, viewport.height / aspectRatio);
  const width = scale;
  const height = scale / aspectRatio;

  return (
    <mesh position={[0, 0, 0]} scale={[width, height, 1]}>
      <planeGeometry />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
};