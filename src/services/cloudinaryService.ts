import { cloudinaryConfig, generateAlbumFolderName } from '../config/cloudinary';
import type { ImageFile, CloudinaryImage, Album, AlbumMetadata } from '../types';

// API base URL for the backend - pointing to the deployed backend
const API_URL = 'https://digi-backend-hxop.onrender.com/api';

// Upload a single image to Cloudinary
export const uploadImage = async (
  imageFile: ImageFile, 
  albumId: string, 
  albumName: string
): Promise<CloudinaryImage> => {
  const folderPath = generateAlbumFolderName(albumId, albumName);
  const formData = new FormData();
  
  formData.append('file', imageFile.file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('cloud_name', cloudinaryConfig.cloudName);
  formData.append('folder', folderPath);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return {
      id: imageFile.id,
      publicId: data.public_id,
      url: data.secure_url,
      width: data.width,
      height: data.height,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

// Upload multiple images and return array of uploaded image data
export const uploadImages = async (
  images: ImageFile[], 
  albumId: string, 
  albumName: string
): Promise<CloudinaryImage[]> => {
  try {
    const uploadPromises = images.map(image => 
      uploadImage(image, albumId, albumName)
    );
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

// Save album to MongoDB
export const saveAlbumToMongoDB = async (album: Album): Promise<Album> => {
  try {
    const response = await fetch(`${API_URL}/albums`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(album),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save album to database');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving album to MongoDB:', error);
    throw error;
  }
};

// Fetch album from MongoDB by ID
export const fetchAlbumFromMongoDB = async (albumId: string): Promise<Album | null> => {
  try {
    const response = await fetch(`${API_URL}/albums/${albumId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching album: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching album from MongoDB:', error);
    return null;
  }
};

// Get all albums from MongoDB
export const getAlbums = async (): Promise<AlbumMetadata[]> => {
  try {
    const response = await fetch(`${API_URL}/albums`);
    
    if (!response.ok) {
      throw new Error(`Error fetching albums: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching albums from MongoDB:', error);
    return [];
  }
};

// Get a specific album by ID
export const getAlbumById = async (albumId: string): Promise<AlbumMetadata | null> => {
  try {
    const response = await fetch(`${API_URL}/albums/${albumId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching album: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching album by ID from MongoDB:', error);
    return null;
  }
};

// Delete an album
export const deleteAlbum = async (albumId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/albums/${albumId}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting album from MongoDB:', error);
    return false;
  }
};