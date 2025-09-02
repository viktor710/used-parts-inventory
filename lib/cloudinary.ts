import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'] || '',
  api_key: process.env['CLOUDINARY_API_KEY'] || '',
  api_secret: process.env['CLOUDINARY_API_SECRET'] || '',
});

export default cloudinary;

// Типы для Cloudinary
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export interface UploadOptions {
  folder?: string;
  transformation?: Record<string, unknown>;
  public_id?: string;
}
