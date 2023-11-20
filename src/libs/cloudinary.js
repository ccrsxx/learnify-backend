import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME
} from './env.js';

cloudinary.config({
  api_key: CLOUDINARY_API_KEY,
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_secret: CLOUDINARY_API_SECRET
});

export { cloudinary };
