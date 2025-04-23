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
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
        <div className="text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader className="w-7 h-7 text-[var(--primary)] animate-spin" />
          </div>
          <p className="text-[var(--text-secondary)]">Loading album...</p>
        </div>
      </div>
    );
  }
  
  if (error || !album) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
        <div className="card p-6 max-w-md w-full mx-auto text-center">
          <h1 className="text-xl font-medium text-[var(--text-primary)] mb-3">Album Not Found</h1>
          <p className="text-[var(--text-secondary)] mb-6">{error || 'The requested album could not be found.'}</p>
          <Link
            to="/"
            className="btn btn-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }
  
  return <DigitalAlbum album={album} />;
};

export default AlbumViewPage;