import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Share, QrCode, X } from 'lucide-react';
import type { Album } from '../types';
import QRCodeDisplay from './QRCodeDisplay';

interface DigitalAlbumProps {
  album: Album;
  onClose?: () => void;
}

const DigitalAlbum: React.FC<DigitalAlbumProps> = ({ album, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [showQRCode, setShowQRCode] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  
  // Get the cover image
  const coverImage = album.images.find(img => img.id === album.coverId);
  // Order the images with cover first, then the rest
  const orderedImages = coverImage 
    ? [coverImage, ...album.images.filter(img => img.id !== album.coverId)]
    : album.images;
  
  const totalPages = orderedImages.length;
  
  const nextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setTimeout(() => setIsFlipping(false), 500);
      }, 250);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setTimeout(() => setIsFlipping(false), 500);
      }, 250);
    }
  };
  
  // Share URL for the album
  const albumShareUrl = `${window.location.origin}/album/${album.id}`;
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: album.name,
          text: album.description || `Check out my digital album: ${album.name}`,
          url: albumShareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      setShowQRCode(true);
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        prevPage();
      } else if (e.key === 'Escape') {
        onClose && onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFlipping]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setShowQRCode(true)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
          title="Show QR Code"
        >
          <QrCode className="w-5 h-5" />
        </button>
        <button
          onClick={handleShare}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
          title="Share Album"
        >
          <Share className="w-5 h-5" />
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
            title="Close Album"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 px-4 py-2 rounded-full text-white text-sm">
        {currentPage + 1} / {totalPages}
      </div>
      
      <div className="relative w-full max-w-4xl mx-auto h-[80vh]">
        {/* Album title */}
        <h2 className="text-white text-xl font-medium absolute -top-12 left-0 w-full text-center">
          {album.name}
        </h2>
        
        {/* Album container with page turning effect */}
        <div 
          ref={bookRef}
          className="w-full h-full relative rounded-lg overflow-hidden shadow-2xl"
        >
          {/* Current page with transition effect */}
          <div 
            className={`absolute inset-0 bg-black transition-transform duration-500 ease-in-out 
              ${isFlipping ? (
                flipDirection === 'next' 
                  ? 'animate-page-flip-out-right' 
                  : 'animate-page-flip-out-left'
              ) : ''}`}
          >
            <img 
              src={orderedImages[currentPage]?.url} 
              alt={`Page ${currentPage + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Navigation buttons */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1 || isFlipping}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* QR Code modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Share Album</h3>
              <button 
                onClick={() => setShowQRCode(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <QRCodeDisplay 
              value={albumShareUrl} 
              albumName={album.name}
            />
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Scan this QR code to view the album or share the link:
              </p>
              <div className="flex">
                <input
                  type="text"
                  value={albumShareUrl}
                  readOnly
                  className="flex-1 p-2 text-sm border border-gray-300 rounded-l-md"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(albumShareUrl);
                    alert('Link copied to clipboard!');
                  }}
                  className="bg-blue-500 text-white px-3 py-2 text-sm rounded-r-md"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalAlbum;