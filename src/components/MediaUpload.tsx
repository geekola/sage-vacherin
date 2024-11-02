import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Video, Image as ImageIcon, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useARStore } from '../store/arStore';
import { FilePreview } from './preview/FilePreview';

export const MediaUpload: React.FC = () => {
  const { user } = useAuth();
  const addCampaign = useARStore((state) => state.addCampaign);
  const [markerFile, setMarkerFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [markerUrl, setMarkerUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const handleFileDrop = useCallback((acceptedFiles: File[], type: 'marker' | 'video') => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    const objectUrl = URL.createObjectURL(file);

    if (type === 'marker') {
      if (markerUrl) URL.revokeObjectURL(markerUrl);
      setMarkerFile(file);
      setMarkerUrl(objectUrl);
    } else {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      setVideoFile(file);
      setVideoUrl(objectUrl);
    }
    setError('');
  }, [markerUrl, videoUrl]);

  const { getRootProps: getMarkerProps, getInputProps: getMarkerInputProps } = useDropzone({
    onDrop: (files) => handleFileDrop(files, 'marker'),
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  const { getRootProps: getVideoProps, getInputProps: getVideoInputProps } = useDropzone({
    onDrop: (files) => handleFileDrop(files, 'video'),
    accept: {
      'video/*': ['.mp4', '.webm']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleUpload = async () => {
    if (!user) {
      setError('Please sign in to upload files');
      return;
    }

    if (!markerFile) {
      setError('Please upload a marker image first');
      return;
    }

    try {
      setUploading(true);
      setError('');

      await addCampaign({
        title: markerFile.name,
        markerImage: markerUrl,
        videoUrl: videoUrl,
        type: 'image',
        userId: user.uid,
      }, user.uid);

      // Clear form after successful upload
      setMarkerFile(null);
      setVideoFile(null);
      setMarkerUrl('');
      setVideoUrl('');
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 border-2 border-dashed rounded-lg text-center bg-gray-50">
        <p className="text-gray-600">Please sign in to upload media</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button 
            onClick={() => setError('')}
            className="p-1 hover:bg-red-100 rounded-full"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-gray-500" />
            <span>Marker Image</span>
          </h3>
          {markerFile ? (
            <FilePreview
              file={markerFile}
              objectUrl={markerUrl}
              onRemove={() => {
                URL.revokeObjectURL(markerUrl);
                setMarkerFile(null);
                setMarkerUrl('');
              }}
            />
          ) : (
            <div
              {...getMarkerProps()}
              className="p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 group"
            >
              <input {...getMarkerInputProps()} />
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              <p className="text-gray-600 mt-2">Drop marker image here or click to browse</p>
              <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, GIF</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <Video className="w-4 h-4 text-gray-500" />
            <span>Video Overlay</span>
          </h3>
          {videoFile ? (
            <FilePreview
              file={videoFile}
              objectUrl={videoUrl}
              onRemove={() => {
                URL.revokeObjectURL(videoUrl);
                setVideoFile(null);
                setVideoUrl('');
              }}
            />
          ) : (
            <div
              {...getVideoProps()}
              className="p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 group"
            >
              <input {...getVideoInputProps()} />
              <Video className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              <p className="text-gray-600 mt-2">Drop video here or click to browse</p>
              <p className="text-sm text-gray-500 mt-1">Supports MP4, WebM</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!markerFile || uploading}
          className={`
            px-6 py-2 rounded-lg text-white font-medium
            flex items-center space-x-2
            transition-all duration-200
            ${markerFile && !uploading
              ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg shadow-blue-200'
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Create Campaign</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};