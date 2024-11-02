import React from 'react';
import { VideoPreview } from './video/VideoPreview';
import { ARScene } from './ar/ARScene';
import { useARStore } from '../store/arStore';

export const ARPreview: React.FC = () => {
  const { activeCampaign } = useARStore();

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <VideoPreview />
      <ARScene />
      {!activeCampaign && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          <p>Scan a campaign QR code to view the AR experience</p>
        </div>
      )}
    </div>
  );
};