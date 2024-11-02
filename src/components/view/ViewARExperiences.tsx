import React, { useEffect } from 'react';
import { useARStore } from '../../store/arStore';
import { useAuth } from '../../hooks/useAuth';
import { QRCodeDialog } from '../QRCodeDialog';
import { SimulationDialog } from '../SimulationDialog';
import { QrCode, Play, Eye, Calendar, Clock, Video, Image as ImageIcon } from 'lucide-react';

export const ViewARExperiences: React.FC = () => {
  const { user } = useAuth();
  const campaigns = useARStore((state) => state.campaigns);
  const fetchCampaigns = useARStore((state) => state.fetchCampaigns);
  const loading = useARStore((state) => state.loading);
  const [selectedCampaign, setSelectedCampaign] = React.useState<string | null>(null);
  const [dialogType, setDialogType] = React.useState<'qr' | 'simulation' | null>(null);

  useEffect(() => {
    if (user) {
      fetchCampaigns(user.uid);
    }
  }, [user, fetchCampaigns]);

  const handleCloseDialog = () => {
    setSelectedCampaign(null);
    setDialogType(null);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="aspect-video bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No AR Experiences Yet</h3>
        <p className="text-gray-500 mb-6">
          Switch to the Create tab to build your first AR experience
        </p>
        <button
          onClick={() => window.location.hash = '#create'}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Experience
        </button>
      </div>
    );
  }

  const activeCampaign = campaigns.find(c => c.id === selectedCampaign);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div 
            key={campaign.id} 
            className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          >
            <div className="aspect-video relative bg-gray-50">
              {campaign.markerImage && (
                <img
                  src={campaign.markerImage}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCampaign(campaign.id);
                      setDialogType('qr');
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QR Code</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCampaign(campaign.id);
                      setDialogType('simulation');
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                {campaign.videoUrl && (
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md flex items-center space-x-1">
                    <Video className="w-3 h-3" />
                    <span>Video</span>
                  </span>
                )}
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-md flex items-center space-x-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>Marker</span>
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">
                {campaign.title}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(campaign.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(campaign.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeCampaign && dialogType === 'qr' && (
        <QRCodeDialog
          isOpen={true}
          onClose={handleCloseDialog}
          campaign={activeCampaign}
        />
      )}

      {activeCampaign && dialogType === 'simulation' && (
        <SimulationDialog
          isOpen={true}
          onClose={handleCloseDialog}
          campaign={activeCampaign}
        />
      )}
    </div>
  );
};