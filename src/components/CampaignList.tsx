import React, { useEffect, useState } from 'react';
import { Share2, Trash2, Image as ImageIcon, QrCode, Play, Check } from 'lucide-react';
import { QRCodeDialog } from './QRCodeDialog';
import { SimulationDialog } from './SimulationDialog';
import { useARStore } from '../store/arStore';
import { useAuth } from '../hooks/useAuth';

export const CampaignList = () => {
  const { user } = useAuth();
  const campaigns = useARStore((state) => state.campaigns);
  const activeCampaign = useARStore((state) => state.activeCampaign);
  const setActiveCampaign = useARStore((state) => state.setActiveCampaign);
  const removeCampaign = useARStore((state) => state.removeCampaign);
  const fetchCampaigns = useARStore((state) => state.fetchCampaigns);
  const loading = useARStore((state) => state.loading);
  const [qrDialogOpen, setQrDialogOpen] = React.useState(false);
  const [simulationOpen, setSimulationOpen] = React.useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCampaigns(user.uid);
    }
  }, [user, fetchCampaigns]);

  const handleShare = async (campaign: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const campaignUrl = `${window.location.origin}/view/${campaign.id}`;
    
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setShareSuccess(campaign.id);
      setTimeout(() => setShareSuccess(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Campaigns</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Campaigns</h2>
        <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">No campaigns yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Upload media to create your first AR campaign
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Your Campaigns</h2>
      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className={`p-4 rounded-lg border transition-colors cursor-pointer
              ${
                activeCampaign?.id === campaign.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            onClick={() => setActiveCampaign(campaign)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  {campaign.markerImage ? (
                    <img
                      src={campaign.markerImage}
                      alt={campaign.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{campaign.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {campaign.videoUrl && (
                  <>
                    <button
                      className="p-2 hover:bg-blue-100 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQrDialogOpen(true);
                      }}
                    >
                      <QrCode className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-green-100 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSimulationOpen(true);
                      }}
                    >
                      <Play className="w-5 h-5 text-green-600" />
                    </button>
                  </>
                )}
                <button
                  className="p-2 hover:bg-gray-100 rounded-full relative group"
                  onClick={(e) => handleShare(campaign, e)}
                >
                  {shareSuccess === campaign.id ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Share2 className="w-5 h-5 text-gray-600" />
                  )}
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {shareSuccess === campaign.id ? 'Link copied!' : 'Copy share link'}
                  </span>
                </button>
                <button
                  className="p-2 hover:bg-red-100 rounded-full group relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCampaign(campaign.id);
                  }}
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Delete campaign
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeCampaign && (
        <>
          <QRCodeDialog
            isOpen={qrDialogOpen}
            onClose={() => setQrDialogOpen(false)}
            campaign={activeCampaign}
          />
          <SimulationDialog
            isOpen={simulationOpen}
            onClose={() => setSimulationOpen(false)}
            campaign={activeCampaign}
          />
        </>
      )}
    </div>
  );
};