import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AlbumList from '../components/AlbumList';
import AlbumCreationForm from '../components/AlbumCreationForm';
import DigitalAlbum from '../components/DigitalAlbum';
import { getAlbums, getAlbumById, fetchAlbumFromMongoDB } from '../services/cloudinaryService';
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
      // Get the full album data from MongoDB
      const album = await fetchAlbumFromMongoDB(albumId);
      
      if (album) {
        setSelectedAlbum(album);
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {isCreating ? (
          <div>
            <button
              onClick={() => setIsCreating(false)}
              className="inline-flex items-center text-blue-600 font-medium mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to albums
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