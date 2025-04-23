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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h2 className="text-xl font-medium text-[var(--text-primary)] flex items-center">
          <Book className="mr-2 text-[var(--primary)] h-5 w-5" />
          My Albums
        </h2>
        <button
          onClick={onCreateNew}
          className="btn btn-primary w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Album
        </button>
      </div>
      
      {isLoading ? (
        <div className="card p-8 text-center">
          <Loader className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading your albums...</p>
        </div>
      ) : albums.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="w-7 h-7 text-[var(--primary)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No Albums Yet</h3>
          <p className="text-[var(--text-secondary)] mb-6 max-w-xs mx-auto">
            Create your first digital album to showcase your photos with beautiful animations.
          </p>
          <button
            onClick={onCreateNew}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Album
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {albums.map(album => (
            <div
              key={album.id}
              onClick={() => onAlbumSelect(album.id)}
              className="bg-white rounded-lg shadow-sm border border-[var(--border)] overflow-hidden hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              tabIndex={0}
              role="button"
              aria-label={`View ${album.name} album`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onAlbumSelect(album.id);
                }
              }}
            >
              <div className="aspect-video overflow-hidden bg-gray-100 relative">
                <img
                  src={album.coverUrl}
                  alt={album.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md flex items-center">
                  {album.imageCount} {album.imageCount === 1 ? 'photo' : 'photos'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-medium text-[var(--text-primary)] mb-1 line-clamp-1 text-left">
                  {album.name}
                </h3>
                <div className="flex items-center text-sm text-[var(--text-secondary)] mb-2 text-left">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                  <span className="block truncate">{formatDate(album.createdAt)}</span>
                </div>
                {album.description && (
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 text-left">
                    {album.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {/* Empty space to maintain layout */}
                  </span>
                  <span className="text-xs text-[var(--primary)] font-medium">
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