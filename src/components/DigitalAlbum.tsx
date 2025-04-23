import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Share, QrCode, X, Info } from 'lucide-react';
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
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get the cover image
  const coverImage = album.images.find(img => img.id === album.coverId);
  // Order the images with cover first, then the rest
  const orderedImages = coverImage 
    ? [coverImage, ...album.images.filter(img => img.id !== album.coverId)]
    : album.images;
  
  const totalPages = orderedImages.length;

  // Hide controls after a period of inactivity
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setShowControls(true);
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };
  
  useEffect(() => {
    resetControlsTimeout();
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  
  const nextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setTimeout(() => setIsFlipping(false), 500);
      }, 250);
      
      resetControlsTimeout();
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
      
      resetControlsTimeout();
    }
  };
  
  // Support swipe gestures for mobile
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    resetControlsTimeout();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Minimum distance to detect a swipe

    if (swipeDistance > minSwipeDistance) {
      // Swiped left -> next page
      nextPage();
    } else if (swipeDistance < -minSwipeDistance) {
      // Swiped right -> previous page
      prevPage();
    } else {
      // Just a tap, toggle controls
      setShowControls(prev => !prev);
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
    
    resetControlsTimeout();
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
      } else if (e.key === 'i') {
        setShowInfo(prev => !prev);
      }
      
      resetControlsTimeout();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFlipping]);
  
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* Top controls - visible only when showControls is true */}
      <div 
        className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 transition-opacity duration-300 
        ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="text-white text-base font-medium truncate max-w-[70%]">
          {album.name}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="btn-icon bg-black/20 text-white backdrop-blur-sm"
            aria-label="Album information"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowQRCode(true)}
            className="btn-icon bg-black/20 text-white backdrop-blur-sm"
            aria-label="Show QR Code"
          >
            <QrCode className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="btn-icon bg-black/20 text-white backdrop-blur-sm"
            aria-label="Share Album"
          >
            <Share className="w-5 h-5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="btn-icon bg-black/20 text-white backdrop-blur-sm"
              aria-label="Close Album"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Bottom page indicator - visible only when showControls is true */}
      <div 
        className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm z-20 transition-opacity duration-300
        ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {currentPage + 1} / {totalPages}
      </div>
      
      {/* Album container with page turning effect */}
      <div 
        ref={bookRef}
        className="w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setShowControls(prev => !prev)}
      >
        {/* Current page with transition effect */}
        <div 
          className={`absolute inset-0 transition-transform duration-500 ease-in-out 
            ${isFlipping ? (
              flipDirection === 'next' 
                ? 'animate-page-flip-out-right' 
                : 'animate-page-flip-out-left'
            ) : ''}`}
        >
          <img 
            src={orderedImages[currentPage]?.url} 
            alt={`Page ${currentPage + 1}`}
            className="w-full h-full object-contain bg-black"
            loading="eager"
          />
        </div>
        
        {/* Navigation buttons - only visible when showControls is true */}
        <div 
          className={`absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4 z-10 transition-opacity duration-300
          ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className="btn-icon bg-black/20 backdrop-blur-sm text-white disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1 || isFlipping}
            className="btn-icon bg-black/20 backdrop-blur-sm text-white disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Album info modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowInfo(false)}>
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[var(--text-primary)]">Album Details</h3>
              <button 
                onClick={() => setShowInfo(false)}
                className="text-[var(--text-secondary)]"
                aria-label="Close album info"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-[var(--text-secondary)]">Name</div>
                <div className="font-medium">{album.name}</div>
              </div>
              
              {album.description && (
                <div>
                  <div className="text-sm text-[var(--text-secondary)]">Description</div>
                  <div>{album.description}</div>
                </div>
              )}
              
              <div>
                <div className="text-sm text-[var(--text-secondary)]">Images</div>
                <div>{album.images.length} photos</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* QR Code modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowQRCode(false)}>
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[var(--text-primary)]">Share Album</h3>
              <button 
                onClick={() => setShowQRCode(false)}
                className="text-[var(--text-secondary)]"
                aria-label="Close QR Code dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <QRCodeDisplay 
              value={albumShareUrl} 
              albumName={album.name}
            />
            
            <div className="mt-4">
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                Scan to view or share the link:
              </p>
              <div className="flex">
                <input
                  type="text"
                  value={albumShareUrl}
                  readOnly
                  className="flex-1 py-2 px-3 text-sm border border-[var(--border)] rounded-l-lg"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(albumShareUrl);
                    alert('Link copied!');
                  }}
                  className="btn-primary text-sm rounded-l-none rounded-r-lg px-3"
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