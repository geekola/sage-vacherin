import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { ARVideoOverlay } from './ARVideoOverlay';
import { ARMarkerImage } from './ARMarkerImage';
import { useARStore } from '../../store/arStore';

interface ARSceneProps {
  isReady?: boolean;
  campaign?: any;
  showOverlay?: boolean;
}

export const ARScene: React.FC<ARSceneProps> = ({ 
  isReady = true,
  campaign,
  showOverlay = false
}) => {
  const activeCampaign = campaign || useARStore((state) => state.activeCampaign);
  const [videoVisible, setVideoVisible] = useState(showOverlay);

  if (!activeCampaign?.markerImage) return null;

  return (
    <Canvas 
      className="absolute inset-0 w-full h-full" 
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ alpha: true, antialias: true }}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Base marker image */}
        <ARMarkerImage 
          imageUrl={activeCampaign.markerImage}
          opacity={videoVisible ? 0.3 : 1}
        />

        {/* Video overlay */}
        {activeCampaign.videoUrl && (
          <ARVideoOverlay
            videoUrl={activeCampaign.videoUrl}
            isVisible={videoVisible || showOverlay}
          />
        )}
      </Suspense>
    </Canvas>
  );
};