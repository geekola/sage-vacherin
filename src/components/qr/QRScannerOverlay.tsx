import React from 'react';
import { Camera } from 'lucide-react';

interface QRScannerOverlayProps {
  onClose: () => void;
}

export const QRScannerOverlay: React.FC<QRScannerOverlayProps> = ({ onClose }) => {
  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-white rounded-lg">
          <div className="w-full h-full relative animate-pulse">
            <div className="absolute top-0 left-0 w-8 h-2 bg-white rounded-full" />
            <div className="absolute top-0 right-0 w-2 h-8 bg-white rounded-full" />
            <div className="absolute bottom-0 left-0 w-2 h-8 bg-white rounded-full" />
            <div className="absolute bottom-0 right-0 w-8 h-2 bg-white rounded-full" />
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        aria-label="Close Scanner"
      >
        <Camera className="w-6 h-6 text-gray-800" />
      </button>
    </>
  );
};