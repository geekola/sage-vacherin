import React from 'react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        flex items-center space-x-2
        ${active
          ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }
      `}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};