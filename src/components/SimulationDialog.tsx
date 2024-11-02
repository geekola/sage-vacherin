import React, { useState } from 'react';
import { X, QrCode } from 'lucide-react';
import { ARCampaign } from '../types/ar';
import { ARScene } from './ar/ARScene';
import { QRCodeSVG } from 'qrcode.react';

interface SimulationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: ARCampaign;
}

export const SimulationDialog: React.FC<SimulationDialogProps> = ({
  isOpen,
  onClose,
  campaign,
}) => {
  const [showVideo, setShowVideo] = useState(false);

  if (!isOpen) return null;

  const qrData = JSON.stringify({
    id: campaign.id,
    markerImage: campaign.markerImage,
    videoUrl: campaign.videoUrl
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AR Experience Preview</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <QrCode className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Campaign QR Code</h4>
            </div>
            <div className="flex justify-center bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={qrData}
                size={200}
                level="H"
                includeMargin
              />
            </div>
          </div>

          {/* AR Preview */}
          <div className="md:col-span-2">
            <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
              <div className="absolute inset-0">
                {campaign.markerImage && (
                  <img
                    src={campaign.markerImage}
                    alt="AR Marker"
                    className="w-full h-full object-contain"
                  />
                )}
                {showVideo && campaign.videoUrl && (
                  <video
                    src={campaign.videoUrl}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-contain"
                    onEnded={() => setShowVideo(false)}
                  />
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowVideo(!showVideo)}
                className={`
                  px-4 py-2 rounded-md transition-colors
                  ${showVideo 
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                `}
              >
                {showVideo ? 'Hide Video Overlay' : 'Show Video Overlay'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600">
            This is a simulation of how your AR experience will appear when viewed through a mobile device. 
            The actual AR experience will overlay the video on top of the marker image when scanned in real-world conditions.
          </p>
        </div>
      </div>
    </div>
  );
};