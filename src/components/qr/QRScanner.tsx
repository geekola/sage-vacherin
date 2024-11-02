import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { QRScannerOverlay } from './QRScannerOverlay';
import { QRScannerError } from './QRScannerError';
import { validateQRData, setupVideoStream } from '../../utils/qrScanner';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animationFrameRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      setError('Canvas context not available');
      return;
    }

    try {
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Attempt to find QR code in frame
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        try {
          validateQRData(code.data);
          setIsScanning(false);
          onScan(code.data);
          return;
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          }
          return;
        }
      }

      // Continue scanning
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
    } catch (error) {
      setError('Failed to process video frame');
      onError(new Error('QR scanning failed'));
    }
  };

  const startScanner = async () => {
    try {
      const stream = await setupVideoStream();
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        scanQRCode();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start scanner';
      setError(message);
      onError(new Error(message));
    }
  };

  const cleanup = () => {
    setIsScanning(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    startScanner();
    return cleanup;
  }, []);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-0"
      />
      
      {error ? (
        <QRScannerError error={error} onClose={onClose} />
      ) : (
        <QRScannerOverlay onClose={onClose} />
      )}
    </div>
  );
};