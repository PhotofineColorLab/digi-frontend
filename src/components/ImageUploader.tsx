import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import type { ImageFile } from '../types';

interface ImageUploaderProps {
  onImagesSelected: (images: ImageFile[]) => void;
  maxFiles?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImagesSelected, 
  maxFiles = 20 
}) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (images.length + acceptedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images.`);
      return;
    }
    
    const newImages = acceptedFiles
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: uuidv4(),
        file,
        preview: URL.createObjectURL(file)
      }));
    
    setImages(prev => {
      const updatedImages = [...prev, ...newImages];
      onImagesSelected(updatedImages);
      return updatedImages;
    });
  }, [images, maxFiles, onImagesSelected]);
  
  const removeImage = (id: string) => {
    setImages(prev => {
      const updatedImages = prev.filter(image => image.id !== id);
      onImagesSelected(updatedImages);
      return updatedImages;
    });
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles
  });
  
  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:bg-gray-50'}`
        }
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Upload className="w-10 h-10 text-gray-400" />
          <p className="text-base text-gray-600">
            {isDragActive
              ? "Drop the images here..."
              : "Drag and drop images here, or click to select files"}
          </p>
          <p className="text-xs text-gray-400">
            Supported formats: JPG, PNG, GIF, WebP (Max {maxFiles} files)
          </p>
        </div>
      </div>
      
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      
      {images.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Uploaded Images ({images.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {images.map(image => (
              <div 
                key={image.id} 
                className="relative group rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="aspect-square">
                  <img 
                    src={image.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      URL.revokeObjectURL(image.preview);
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 
                    text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="truncate px-2 py-1 text-xs text-gray-600">
                  {image.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <ImageIcon className="w-12 h-12 mb-2" />
          <p>No images selected yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;