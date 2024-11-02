export interface QRData {
  id: string;
  markerImage: string;
  videoUrl: string;
}

export const validateQRData = (data: string): QRData => {
  const parsed = JSON.parse(data);
  
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid QR code format');
  }

  if (!parsed.id || typeof parsed.id !== 'string') {
    throw new Error('Missing or invalid campaign ID');
  }

  if (!parsed.markerImage || typeof parsed.markerImage !== 'string') {
    throw new Error('Missing or invalid marker image URL');
  }

  if (!parsed.videoUrl || typeof parsed.videoUrl !== 'string') {
    throw new Error('Missing or invalid video URL');
  }

  return parsed as QRData;
};

export const setupVideoStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
    return stream;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Camera access error: ${error.message}`);
    }
    throw new Error('Failed to access camera');
  }
};