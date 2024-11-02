import React from 'react';
import { MediaUpload } from '../MediaUpload';
import { CampaignList } from '../CampaignList';
import { Upload, List } from 'lucide-react';

export const CreateARExperience: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 p-4 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Upload Media
            </h2>
          </div>
        </div>
        <div className="p-4">
          <MediaUpload />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 p-4 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center space-x-2">
            <List className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Your Campaigns
            </h2>
          </div>
        </div>
        <div className="p-4">
          <CampaignList />
        </div>
      </section>
    </div>
  );
};