import React, { useState } from 'react';
import { VideoPreview } from './video/VideoPreview';
import { ARScene } from './ar/ARScene';
import { useARStore } from '../store/arStore';
import { QRScanner } from './qr/QRScanner';

export const ARPreview: React.FC = () => {
  const { activeCampaign } = useARStore();
  const [isQRScanned, setIsQRScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleQRScan = (data: string) => {
    try {
      const qrData = JSON.parse(data);
      if (qrData.id === activeCampaign?.id) {
        setIsQRScanned(true);
        setShowScanner(false);
      }
    } catch (error) {
      console.error('QR scanning error:', error);
    }
  };

  const handleScanError = (error: Error) => {
    console.error('QR scanning error:', error);
    setShowScanner(false);
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {showScanner ? (
        <QRScanner
          onScan={handleQRScan}
          onError={handleScanError}
          onClose={() => setShowScanner(false)}
        />
      ) : (
        <>
          <VideoPreview />
          <ARScene isQRScanned={isQRScanned} />
          {!activeCampaign && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
              <p>Scan a campaign QR code to view the AR experience</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};