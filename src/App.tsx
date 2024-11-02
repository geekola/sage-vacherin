import React, { useState } from 'react';
import { Layers, Plus, Eye } from 'lucide-react';
import { AuthWrapper } from './components/AuthWrapper';
import { UserMenu } from './components/auth/UserMenu';
import { CreateARExperience } from './components/create/CreateARExperience';
import { ViewARExperiences } from './components/view/ViewARExperiences';
import { TabButton } from './components/ui/TabButton';

function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'view'>('create');

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 bg-blue-50 p-2 rounded-lg">
                  <Layers className="w-8 h-8 text-blue-600" />
                  <h1 className="text-xl font-semibold text-gray-900">AR Campaign Builder</h1>
                </div>
              </div>
              <UserMenu />
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex space-x-4 mb-6">
            <TabButton
              active={activeTab === 'create'}
              onClick={() => setActiveTab('create')}
              icon={<Plus className="w-4 h-4" />}
            >
              Create Experience
            </TabButton>
            <TabButton
              active={activeTab === 'view'}
              onClick={() => setActiveTab('view')}
              icon={<Eye className="w-4 h-4" />}
            >
              View Experiences
            </TabButton>
          </div>

          <div className="transition-all duration-200 ease-in-out">
            {activeTab === 'create' ? (
              <CreateARExperience />
            ) : (
              <ViewARExperiences />
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}

export default App;