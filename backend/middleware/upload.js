// middleware/upload.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploader = ({
  folder = 'general',
  multiple = false,
  fieldName = 'file',
  fileType = 'all'
}) => {

  const storage = multer.diskStorage({

    destination: (req, file, cb) => {

      const uploadPath = path.join(
        __dirname,
        `../uploads/${folder}`
      );

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

const fileFilter = (req, file, cb) => {
    
    let allowed = [];
    
    if (fileType === 'image') {
        allowed = imageTypes;
    }
    
    else if (fileType === 'video') {
        allowed = videoTypes;
    }
    
    else {
        allowed = [...imageTypes, ...videoTypes];
    }
//   console.log(file.mimetype);
// console.log(allowed.includes(file.mimetype));
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
};


  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 50 * 1024 * 1024 // 50MB
    }
  });

  return multiple
    ? upload.array(fieldName, 10)
    : upload.single(fieldName);
};

module.exports = createUploader;



// HOW TO USE :
// Image upload:

// router.post(
//   '/',
//   createUploader({
//     folder: 'hero',
//     fileType: 'image',
//     fieldName: 'image'
//   }),
//   controller
// );

// Video upload:
// router.post(
//   '/',
//   createUploader({
//     folder: 'videos',
//     fileType: 'video',
//     fieldName: 'video'
//   }),
//   controller
// );

// Mixed media upload:

// router.post(
//   '/',
//   createUploader({
//     folder: 'gallery',
//     fileType: 'all',
//     fieldName: 'files',
//     multiple: true
//   }),
//   controller
// );

// -------------------------------
// ###For multiple images, set:

// multiple: true

// and use:

// fieldName: 'images'

// Example route:

// router.post(
//   '/gallery',

//   createUploader({
//     folder: 'gallery',
//     multiple: true,
//     fieldName: 'images',
//     fileType: 'image'
//   }),

//   async (req, res) => {

//     const uploadedImages = req.files.map(file => ({
//       filename: file.filename,
//       path: `/uploads/gallery/${file.filename}`
//     }));

//     res.json({
//       success: true,
//       images: uploadedImages
//     });
//   }
// );