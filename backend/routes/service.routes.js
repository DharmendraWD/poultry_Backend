
const multiUpload = require("../middleware/multiupload");
const serviceController = require('../controllers/service.controller');

const {Router} = require('express');
const router = Router();
const createUploader = require('../middleware/upload');

// SERVICE | FIXED CONTENT ROUTES 
router.get('/fixed-content', serviceController.getServiceSingle);
router.put(
  '/fixed-content',
  multiUpload,
  serviceController.updateServiceSingle
);
// SERVICE | FIXED CONTENT ROUTES END 

// SERVICE | FEATURE ROUTES
router.get("/features", serviceController.getServiceItems);
router.post("/features",
    createUploader({
    folder: 'service',
    fileType: 'image',
    fieldName: 'image'
  }),
   serviceController.createServiceItem);
router.put("/features/:id", 
  createUploader({
    folder: 'service',
    fileType: 'image',
    fieldName: 'image'
  })
  , serviceController.updateServiceItem);
router.delete("/features/:id", serviceController.deleteServiceItem);

// ICONS
router.post("/features/icon", serviceController.addIcon);
router.delete("/features/icon/:id", serviceController.deleteIcon);
// SERVICE | FEATURE ROUTES END

// service | SERVICE DETAIL BOX ROUTES
router.get("/detail-box", serviceController.getServiceDetailBox);
router.post("/detail-box", serviceController.createServiceDetailBox);
router.put("/detail-box/:id", serviceController.updateServiceDetailBox);
router.delete("/detail-box/:id", serviceController.deleteServiceDetailBox);
// service | SERVICE DETAIL BOX ROUTES END

module.exports = router;