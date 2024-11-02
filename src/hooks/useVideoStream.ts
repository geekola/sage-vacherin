import { useEffect, useRef, useState } from 'react';

interface VideoStreamState {
  stream: MediaStream | null;
  error: string | null;
  isReady: boolean;
}

export const useVideoStream = () => {
  const [state, setState] = useState<VideoStreamState>({
    stream: null,
    error: null,
    isReady: false,
  });
  const streamRef = useRef<MediaStream | null>(null);

  const initializeStream = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access not supported');
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = newStream;
      setState({
        stream: newStream,
        error: null,
        isReady: true
      });
    } catch (err) {
      setState({
        stream: null,
        error: err instanceof Error ? err.message : 'Failed to access camera',
        isReady: false
      });
    }
  };

  useEffect(() => {
    initializeStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return state;
};