import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadToMemory = multer({ storage }).single('image');
