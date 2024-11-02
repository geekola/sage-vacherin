import React from 'react';
import { AlertCircle } from 'lucide-react';

interface QRScannerErrorProps {
  error: string;
  onClose: () => void;
}

export const QRScannerError: React.FC<QRScannerErrorProps> = ({ error, onClose }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
      <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
      <p className="text-center mb-4">{error}</p>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
      >
        Close Scanner
      </button>
    </div>
  );
};