export interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

export interface Album {
  id: string;
  name: string;
  description: string;
  coverId: string;
  images: CloudinaryImage[];
  createdAt: string;
}

export interface CloudinaryImage {
  id: string;
  publicId: string;
  url: string;
  width: number;
  height: number;
}

export interface AlbumMetadata {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  imageCount: number;
  createdAt: string;
}