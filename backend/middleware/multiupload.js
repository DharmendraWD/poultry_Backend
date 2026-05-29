const multer = require('multer');
const path = require('path');
const fs = require('fs');

// same storage logic as your original middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/site-settings');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

// allow images + videos
const fileFilter = (req, file, cb) => {
  const imageTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'image/x-png'
  ];

  const videoTypes = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-matroska'
  ];

  const allowed = [...imageTypes, ...videoTypes];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

const multiUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'SecondSecImage_Hero', maxCount: 1 },
  { name: 'ThirdSecVideo_Hero', maxCount: 1 }
]);

module.exports = multiUpload;