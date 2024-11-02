import React, { Suspense } from 'react';
import { FileIcon, X, Loader2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { ModelViewer } from './ModelViewer';
import { formatFileSize } from '../../utils/formatters';

interface FilePreviewProps {
  file: File;
  objectUrl: string;
  onRemove: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, objectUrl, onRemove }) => {
  const is3DModel = /\.(gltf|glb|usdz)$/i.test(file.name);
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={onRemove}
          className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="aspect-square w-full bg-gray-50">
        {is3DModel ? (
          <div className="relative w-full h-full">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 45 }}>
              <Suspense fallback={null}>
                <Stage environment="city" intensity={0.5}>
                  <ModelViewer url={objectUrl} />
                </Stage>
                <OrbitControls
                  makeDefault
                  minPolarAngle={0}
                  maxPolarAngle={Math.PI / 1.75}
                />
              </Suspense>
            </Canvas>
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <RotateCw className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ) : isImage ? (
          <img
            src={objectUrl}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : isVideo ? (
          <video
            src={objectUrl}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-gray-900 truncate" title={file.name}>
              {file.name}
            </h3>
            <p className="text-sm text-gray-500">
              {formatFileSize(file.size)} • {file.type || 'Unknown type'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};