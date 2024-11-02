import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { ARVideoOverlay } from './ARVideoOverlay';
import { ARMarkerDetection } from './ARMarkerDetection';
import { useARStore } from '../../store/arStore';

interface ARSceneProps {
  isReady?: boolean;
  campaign?: any;
  showOverlay?: boolean;
  onMarkerFound?: () => void;
}

export const ARScene: React.FC<ARSceneProps> = ({ 
  isReady = true,
  campaign,
  showOverlay = false,
  onMarkerFound
}) => {
  const activeCampaign = campaign || useARStore((state) => state.activeCampaign);
  const [videoVisible, setVideoVisible] = useState(showOverlay);

  if (!activeCampaign) return null;

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
        
        {activeCampaign.markerImage && (
          <ARMarkerDetection
            markerImage={activeCampaign.markerImage}
            onMarkerFound={() => {
              setVideoVisible(true);
              onMarkerFound?.();
            }}
            onMarkerLost={() => setVideoVisible(false)}
          />
        )}
        
        {activeCampaign.videoUrl && (
          <ARVideoOverlay
            videoUrl={activeCampaign.videoUrl}
            isVisible={showOverlay || videoVisible}
            onPlaybackComplete={() => setVideoVisible(false)}
          />
        )}
      </Suspense>
    </Canvas>
  );
};