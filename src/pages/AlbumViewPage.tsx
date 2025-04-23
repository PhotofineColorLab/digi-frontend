import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import DigitalAlbum from '../components/DigitalAlbum';
import { fetchAlbumFromMongoDB } from '../services/cloudinaryService';
import type { Album } from '../types';

const AlbumViewPage: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadAlbum() {
      if (!albumId) {
        setError('Album ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        // Fetch album from MongoDB
        const album = await fetchAlbumFromMongoDB(albumId);
        
        if (album) {
          setAlbum(album);
        } else {
          setError('Album not found');
        }
      } catch (err) {
        console.error('Error loading album:', err);
        setError('Error loading album');
      } finally {
        setLoading(false);
      }
    }
    
    loadAlbum();
  }, [albumId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading album...</p>
        </div>
      </div>
    );
  }
  
  if (error || !album) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-sm">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Album Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested album could not be found.'}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }
  
  return <DigitalAlbum album={album} />;
};

export default AlbumViewPage;