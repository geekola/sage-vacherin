import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Info } from 'lucide-react';
import { ARCampaign } from '../types/ar';

interface QRCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: ARCampaign;
}

export const QRCodeDialog: React.FC<QRCodeDialogProps> = ({
  isOpen,
  onClose,
  campaign,
}) => {
  if (!isOpen) return null;

  // Create a shareable QR code that contains the campaign data
  const qrData = JSON.stringify({
    id: campaign.id,
    markerImage: campaign.markerImage,
    videoUrl: campaign.videoUrl
  });

  const handleDownload = () => {
    const svg = document.getElementById('campaign-qr');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `ar-campaign-${campaign.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Campaign QR Code</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg flex items-center justify-center">
          <QRCodeSVG
            id="campaign-qr"
            value={qrData}
            size={200}
            level="H"
            includeMargin
          />
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">How to use:</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Download or scan this QR code</li>
              <li>Point your camera at the marker image</li>
              <li>The AR video will automatically play</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download QR Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};