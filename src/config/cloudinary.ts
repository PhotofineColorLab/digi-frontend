// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: 'dluk6cgro',
  apiKey: '285824994547856',
  apiSecret: '8qun1Lmb0J57tETXfNZKl69RRqc',
  uploadPreset: 'ml_unsigned' // Changed to use a proper unsigned upload preset name
};

export const generateCloudinaryUrl = (publicId: string, options = {}) => {
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
  const optionsString = Object.entries(options)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');
  
  return `${baseUrl}${optionsString ? `/${optionsString}` : ''}/${publicId}`;
};

export const generateAlbumFolderName = (albumId: string, albumName: string) => {
  // Create a clean folder name from the album name
  const cleanName = albumName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
  return `albums/${albumId}_${cleanName}`;
};