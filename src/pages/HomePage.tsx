import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AlbumList from '../components/AlbumList';
import AlbumCreationForm from '../components/AlbumCreationForm';
import DigitalAlbum from '../components/DigitalAlbum';
import { getAlbums, fetchAlbumFromMongoDB } from '../services/cloudinaryService';
import type { Album, AlbumMetadata } from '../types';
import { ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        {isCreating ? (
          <div className="animate-fade-in">
            <button
              onClick={() => setIsCreating(false)}
              className="btn btn-secondary mb-5 text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
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