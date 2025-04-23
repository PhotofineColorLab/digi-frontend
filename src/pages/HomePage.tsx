import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AlbumList from '../components/AlbumList';
import AlbumCreationForm from '../components/AlbumCreationForm';
import DigitalAlbum from '../components/DigitalAlbum';
import { getAlbums, getAlbumById } from '../services/cloudinaryService';
import type { Album, AlbumMetadata } from '../types';

const HomePage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [albums, setAlbums] = useState<AlbumMetadata[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load albums from MongoDB
    const loadAlbums = async () => {
      setIsLoading(true);
      try {
        const loadedAlbums = await getAlbums();
        setAlbums(loadedAlbums);
      } catch (error) {
        console.error('Error loading albums:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAlbums();
  }, []);
  
  const handleAlbumCreated = async (albumId: string) => {
    // Refresh the albums list
    try {
      const loadedAlbums = await getAlbums();
      setAlbums(loadedAlbums);
      
      // Exit creation mode
      setIsCreating(false);
      
      // Automatically open the newly created album
      handleAlbumSelect(albumId);
    } catch (error) {
      console.error('Error refreshing albums after creation:', error);
    }
  };
  
  const handleAlbumSelect = async (albumId: string) => {
    try {
      // Get the album data from MongoDB
      const album = await getAlbumById(albumId);
      
      if (album) {
        setSelectedAlbum(album as Album);
        setSelectedAlbumId(albumId);
      }
    } catch (error) {
      console.error('Error selecting album:', error);
    }
  };
  
  const handleCloseAlbum = () => {
    setSelectedAlbum(null);
    setSelectedAlbumId(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isCreating ? (
          <div>
            <button
              onClick={() => setIsCreating(false)}
              className="text-blue-600 font-medium mb-4"
            >
              ← Back to albums
            </button>
            <AlbumCreationForm onAlbumCreated={handleAlbumCreated} />
          </div>
        ) : (
          <AlbumList 
            albums={albums} 
            onAlbumSelect={handleAlbumSelect} 
            onCreateNew={() => setIsCreating(true)}
            isLoading={isLoading}
          />
        )}
      </main>
      
      {selectedAlbum && (
        <DigitalAlbum 
          album={selectedAlbum} 
          onClose={handleCloseAlbum}
        />
      )}
    </div>
  );
};

export default HomePage;