import { create } from 'zustand';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { storage, db, auth } from '../lib/firebase';

interface Campaign {
  id: string;
  title: string;
  markerImage: string;
  videoUrl?: string;
  createdAt: Date;
  userId: string;
  type: 'image' | 'video';
  storageRefs?: {
    marker: string;
    video?: string;
  };
}

interface ARStore {
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
  setActiveCampaign: (campaign: Campaign | null) => void;
  addCampaign: (campaign: Partial<Campaign>) => Promise<void>;
  removeCampaign: (campaignId: string) => Promise<void>;
  fetchCampaigns: () => Promise<void>;
}

export const useARStore = create<ARStore>((set, get) => ({
  campaigns: [],
  activeCampaign: null,
  loading: false,
  error: null,

  setActiveCampaign: (campaign) => set({ activeCampaign: campaign }),

  addCampaign: async (campaignData) => {
    set({ loading: true, error: null });
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const timestamp = Date.now();
      const markerPath = `campaigns/${user.uid}/${timestamp}_marker`;
      const markerRef = ref(storage, markerPath);
      
      let videoPath, videoRef;
      if (campaignData.videoUrl) {
        videoPath = `campaigns/${user.uid}/${timestamp}_video`;
        videoRef = ref(storage, videoPath);
      }

      // Upload marker image
      const markerResponse = await fetch(campaignData.markerImage!);
      const markerBlob = await markerResponse.blob();
      await uploadBytes(markerRef, markerBlob);
      const markerURL = await getDownloadURL(markerRef);

      // Upload video if exists
      let videoURL;
      if (videoRef && campaignData.videoUrl) {
        const videoResponse = await fetch(campaignData.videoUrl);
        const videoBlob = await videoResponse.blob();
        await uploadBytes(videoRef, videoBlob);
        videoURL = await getDownloadURL(videoRef);
      }

      const campaign = {
        ...campaignData,
        markerImage: markerURL,
        videoUrl: videoURL || null,
        createdAt: serverTimestamp(),
        userId: user.uid,
        storageRefs: {
          marker: markerPath,
          video: videoPath
        }
      };

      const docRef = await addDoc(collection(db, 'campaigns'), campaign);
      const newCampaign = { 
        ...campaign, 
        id: docRef.id,
        createdAt: new Date() 
      } as Campaign;

      set((state) => ({
        campaigns: [...state.campaigns, newCampaign],
        loading: false
      }));
    } catch (error) {
      console.error('Error adding campaign:', error);
      set({ error: 'Failed to add campaign', loading: false });
    }
  },

  removeCampaign: async (campaignId) => {
    set({ loading: true, error: null });
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const campaign = get().campaigns.find(c => c.id === campaignId);
      if (!campaign || campaign.userId !== user.uid) {
        throw new Error('Unauthorized');
      }

      if (campaign.storageRefs) {
        const markerRef = ref(storage, campaign.storageRefs.marker);
        await deleteObject(markerRef);

        if (campaign.storageRefs.video) {
          const videoRef = ref(storage, campaign.storageRefs.video);
          await deleteObject(videoRef);
        }
      }

      await deleteDoc(doc(db, 'campaigns', campaignId));

      set((state) => ({
        campaigns: state.campaigns.filter(c => c.id !== campaignId),
        activeCampaign: state.activeCampaign?.id === campaignId ? null : state.activeCampaign,
        loading: false
      }));
    } catch (error) {
      console.error('Error removing campaign:', error);
      set({ error: 'Failed to remove campaign', loading: false });
    }
  },

  fetchCampaigns: async () => {
    set({ loading: true, error: null });
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const q = query(collection(db, 'campaigns'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const campaigns = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate() 
            : new Date(data.createdAt)
        };
      }) as Campaign[];

      set({ campaigns, loading: false });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      set({ error: 'Failed to fetch campaigns', loading: false });
    }
  }
}));