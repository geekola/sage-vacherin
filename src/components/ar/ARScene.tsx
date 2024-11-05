import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { ARVideoOverlay } from './ARVideoOverlay';
import { ARMarkerImage } from './ARMarkerImage';
import { ARMarkerDetection } from './ARMarkerDetection';
import { useARStore } from '../../store/arStore';

interface ARSceneProps {
  isReady?: boolean;
  campaign?: any;
  showOverlay?: boolean;
  isQRScanned?: boolean;
}

export const ARScene: React.FC<ARSceneProps> = ({ 
  isReady = true,
  campaign,
  showOverlay = false,
  isQRScanned = false
}) => {
  const activeCampaign = campaign || useARStore((state) => state.activeCampaign);
  const [showVideo, setShowVideo] = useState(showOverlay || isQRScanned);
  const [markerDetected, setMarkerDetected] = useState(false);

  useEffect(() => {
    setShowVideo(showOverlay || isQRScanned || markerDetected);
  }, [showOverlay, isQRScanned, markerDetected]);

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
        
        {/* Marker detection */}
        <ARMarkerDetection
          markerImage={activeCampaign.markerImage}
          onMarkerFound={() => setMarkerDetected(true)}
          onMarkerLost={() => setMarkerDetected(false)}
        />

        {/* Only show marker image if video is not playing */}
        {!showVideo && (
          <ARMarkerImage 
            imageUrl={activeCampaign.markerImage}
            opacity={1}
          />
        )}

        {/* Show video when marker is detected or overlay is enabled */}
        {activeCampaign.videoUrl && showVideo && (
          <ARVideoOverlay
            videoUrl={activeCampaign.videoUrl}
            isVisible={true}
          />
        )}
      </Suspense>
    </Canvas>
  );
};