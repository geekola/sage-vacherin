import React, { useEffect, useState } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { USDZLoader } from 'three/examples/jsm/loaders/USDZLoader';
import { Box3, Vector3 } from 'three';

interface ModelViewerProps {
  url: string;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({ url }) => {
  const [error, setError] = useState<string | null>(null);
  const { camera } = useThree();
  
  const fileExtension = url.split('.').pop()?.toLowerCase();
  const loader = fileExtension === 'usdz' ? USDZLoader : GLTFLoader;
  
  const model = useLoader(loader, url, undefined, (error) => {
    console.error('Error loading 3D model:', error);
    setError('Failed to load 3D model');
  });

  useEffect(() => {
    if (!model) return;

    // Center and scale model to fit view
    const box = new Box3().setFromObject(model.scene || model);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / Math.sin(fov / 2)) * 1.5;

    camera.position.set(0, 0, cameraZ);
    camera.lookAt(center);
    
    if (model.scene) {
      model.scene.position.x += model.scene.position.x - center.x;
      model.scene.position.y += model.scene.position.y - center.y;
      model.scene.position.z += model.scene.position.z - center.z;
    }
  }, [model, camera]);

  if (error) {
    return null;
  }

  return model.scene ? <primitive object={model.scene} /> : null;
};