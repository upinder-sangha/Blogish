// jshint esversion:6

import multer from 'multer';
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');
export { multerUploads };
