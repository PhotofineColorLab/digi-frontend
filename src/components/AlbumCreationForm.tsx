import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Book, Loader } from 'lucide-react';
import ImageUploader from './ImageUploader';
import CoverSelector from './CoverSelector';
import { uploadImages, saveAlbumToMongoDB } from '../services/cloudinaryService';
import type { ImageFile } from '../types';

interface AlbumCreationFormProps {
  onAlbumCreated: (albumId: string) => void;
}

const AlbumCreationForm: React.FC<AlbumCreationFormProps> = ({ onAlbumCreated }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedCoverId, setSelectedCoverId] = useState<string | null>(null);
  const [albumName, setAlbumName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleImagesSelected = (selectedImages: ImageFile[]) => {
    setImages(selectedImages);
    
    // If there's at least one image and no cover selected yet, default to the first image
    if (selectedImages.length > 0 && !selectedCoverId) {
      setSelectedCoverId(selectedImages[0].id);
    }
    
    // If the previously selected cover is removed, select the first available image
    if (selectedCoverId && !selectedImages.find(img => img.id === selectedCoverId)) {
      setSelectedCoverId(selectedImages.length > 0 ? selectedImages[0].id : null);
    }
  };
  
  const handleCoverSelected = (id: string) => {
    setSelectedCoverId(id);
  };
  
  const handleCreateAlbum = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    
    if (!selectedCoverId) {
      setError('Please select a cover image.');
      return;
    }
    
    if (!albumName.trim()) {
      setError('Please provide an album name.');
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      
      const albumId = uuidv4();
      const cloudinaryImages = await uploadImages(images, albumId, albumName);
      
      // Find the cover image from uploaded images
      const coverImage = cloudinaryImages.find(img => img.id === selectedCoverId);
      
      if (!coverImage) {
        throw new Error('Cover image not found in uploaded images.');
      }
      
      // Create the album data object
      const albumData = {
        id: albumId,
        name: albumName,
        description,
        coverId: selectedCoverId,
        coverUrl: coverImage.url,
        imageCount: cloudinaryImages.length,
        images: cloudinaryImages,
        createdAt: new Date().toISOString()
      };
      
      // Save the album data to MongoDB
      await saveAlbumToMongoDB(albumData);
      
      // Call the onAlbumCreated callback with the albumId
      onAlbumCreated(albumId);
    } catch (err) {
      console.error('Error creating album:', err);
      setError('Failed to create album. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const nextStep = () => {
    if (currentStep === 1 && images.length === 0) {
      setError('Please upload at least one image to continue.');
      return;
    }
    
    if (currentStep === 2 && !selectedCoverId) {
      setError('Please select a cover image to continue.');
      return;
    }
    
    setError(null);
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setError(null);
    setCurrentStep(prev => prev - 1);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Book className="mr-2 text-blue-500" />
        Create New Album
      </h2>
      
      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-700">
            Step {currentStep} of 3
          </h3>
          <div className="flex space-x-1">
            <div className={`h-2 w-10 rounded-full ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-10 rounded-full ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-10 rounded-full ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      </div>
      
      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Upload Images</h3>
          <ImageUploader onImagesSelected={handleImagesSelected} />
        </div>
      )}
      
      {currentStep === 2 && (
        <CoverSelector 
          images={images} 
          selectedCoverId={selectedCoverId} 
          onSelectCover={handleCoverSelected} 
        />
      )}
      
      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Album Details</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="album-name" className="block text-sm font-medium text-gray-700 mb-1">
                Album Name *
              </label>
              <input
                id="album-name"
                type="text"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter album name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter album description"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Album Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Number of images:</p>
                  <p className="font-medium">{images.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cover image:</p>
                  <div className="h-12 w-12 rounded overflow-hidden mt-1">
                    {selectedCoverId && (
                      <img 
                        src={images.find(img => img.id === selectedCoverId)?.preview} 
                        alt="Cover" 
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 flex justify-between pt-4 border-t border-gray-200">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back
          </button>
        ) : (
          <div></div> // Empty div to maintain spacing
        )}
        
        {currentStep < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCreateAlbum}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
          >
            {isUploading ? (
              <>
                <Loader className="animate-spin w-4 h-4 mr-2" />
                Creating Album...
              </>
            ) : (
              'Create Album'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AlbumCreationForm;