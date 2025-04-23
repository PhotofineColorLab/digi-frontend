import React from 'react';
import { Book, Plus, Calendar, Loader } from 'lucide-react';
import { AlbumMetadata } from '../types';

interface AlbumListProps {
  albums: AlbumMetadata[];
  onAlbumSelect: (albumId: string) => void;
  onCreateNew: () => void;
  isLoading?: boolean;
}

const AlbumList: React.FC<AlbumListProps> = ({ 
  albums, 
  onAlbumSelect, 
  onCreateNew,
  isLoading = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Book className="mr-2 text-blue-500" />
          My Digital Albums
        </h2>
        <button
          onClick={onCreateNew}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4 mr-1" />
          New Album
        </button>
      </div>
      
      {isLoading ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Loader className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading albums...</p>
        </div>
      ) : albums.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Albums Yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first digital album to get started.
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Album
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {albums.map(album => (
            <div
              key={album.id}
              onClick={() => onAlbumSelect(album.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
              role="button"
              aria-label={`View ${album.name} album`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onAlbumSelect(album.id);
                }
              }}
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={album.coverUrl}
                  alt={album.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                  {album.name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                  {formatDate(album.createdAt)}
                </div>
                {album.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {album.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {album.imageCount} {album.imageCount === 1 ? 'image' : 'images'}
                  </span>
                  <span className="text-xs text-blue-600 font-medium">
                    View Album
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumList;