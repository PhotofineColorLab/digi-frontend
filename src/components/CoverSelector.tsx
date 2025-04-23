import React from 'react';
import { Check } from 'lucide-react';
import type { ImageFile } from '../types';

interface CoverSelectorProps {
  images: ImageFile[];
  selectedCoverId: string | null;
  onSelectCover: (id: string) => void;
}

const CoverSelector: React.FC<CoverSelectorProps> = ({ 
  images, 
  selectedCoverId, 
  onSelectCover 
}) => {
  if (images.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">
        Select a Cover Image
      </h3>
      <p className="text-sm text-gray-600">
        Choose one image to be the cover of your digital album:
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map(image => (
          <div 
            key={image.id}
            onClick={() => onSelectCover(image.id)}
            className={`
              relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all
              ${selectedCoverId === image.id 
                ? 'border-blue-500 shadow-md scale-[1.02]' 
                : 'border-transparent hover:border-gray-300'}
            `}
          >
            <div className="aspect-square">
              <img 
                src={image.preview}
                alt="Cover candidate"
                className="w-full h-full object-cover"
              />
            </div>
            
            {selectedCoverId === image.id && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <div className="bg-white rounded-full p-1">
                  <Check className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoverSelector;