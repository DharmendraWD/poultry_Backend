
const multiUpload = require("../middleware/multiupload");
const serviceController = require('../controllers/service.controller');

const {Router} = require('express');
const router = Router();
const createUploader = require('../middleware/upload');
const { authenticateAccessToken } = require("../middleware/auth");

// SERVICE | FIXED CONTENT ROUTES 
router.get('/fixed-content', serviceController.getServiceSingle);
router.put(
  '/fixed-content',
  authenticateAccessToken,
  multiUpload,
  serviceController.updateServiceSingle
);
// SERVICE | FIXED CONTENT ROUTES END 

// SERVICE | FEATURE ROUTES
router.get("/features", serviceController.getServiceItems);
router.post("/features",
  authenticateAccessToken,
    createUploader({
    folder: 'service',
    fileType: 'image',
    fieldName: 'image'
  }),
   serviceController.createServiceItem);
router.put("/features/:id", 
  authenticateAccessToken,
  createUploader({
    folder: 'service',
    fileType: 'image',
    fieldName: 'image'
  })
  , serviceController.updateServiceItem);
router.delete("/features/:id", authenticateAccessToken, serviceController.deleteServiceItem);

// ICONS
router.post("/features/icon", authenticateAccessToken, serviceController.addIcon);
router.delete("/features/icon/:id", authenticateAccessToken, serviceController.deleteIcon);
// SERVICE | FEATURE ROUTES END

// service | SERVICE DETAIL BOX ROUTES
router.get("/detail-box", serviceController.getServiceDetailBox);
router.post("/detail-box", authenticateAccessToken, serviceController.createServiceDetailBox);
router.put("/detail-box/:id", authenticateAccessToken, serviceController.updateServiceDetailBox);
router.delete("/detail-box/:id", authenticateAccessToken, serviceController.deleteServiceDetailBox);
// service | SERVICE DETAIL BOX ROUTES END

module.exports = router;