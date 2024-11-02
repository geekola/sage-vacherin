export interface ARCampaign {
  id: string;
  markerImage: string;
  videoUrl: string;
  title: string;
  createdAt: Date | string;
  type: 'image' | 'video';
  userId: string;
}

export interface ARStore {
  campaigns: ARCampaign[];
  activeCampaign: ARCampaign | null;
  loading: boolean;
  error: string | null;
  setActiveCampaign: (campaign: ARCampaign | null) => void;
  fetchCampaigns: (userId: string) => Promise<void>;
  addCampaign: (campaign: Omit<ARCampaign, 'createdAt'>, userId: string) => Promise<void>;
  removeCampaign: (id: string) => Promise<void>;
  updateCampaign: (id: string, updates: Partial<ARCampaign>) => Promise<void>;
}