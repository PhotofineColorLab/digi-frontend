import React from 'react';
import { Book } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <Book className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <span className="ml-2 text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Photofine Album
            </span>
          </Link>
          <div className="hidden sm:block">
            <div className="text-sm text-gray-500">
              Create beautiful digital albums with page-turning animations
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;