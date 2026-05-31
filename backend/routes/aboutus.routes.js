const multiUpload = require("../middleware/multiupload");
const aboutusController = require('../controllers/aboutus.controller');

const {Router} = require('express');
const router = Router();

// ABOUT US | FIXED CONTENT ROUTES 
router.get('/fixed-content', aboutusController.getAboutusFixedContent);
router.put(
  '/fixed-content',
  multiUpload,
  aboutusController.updateAboutusFixedContent
);
// ABOUT US | FIXED CONTENT ROUTES END 

// ABOUT US | FEATURE ROUTES
router.get('/features', aboutusController.getAllFeatures);
router.post('/features', aboutusController.createFeature);
router.put('/features/:id', aboutusController.updateFeature);
router.delete('/features/:id', aboutusController.deleteFeature);
// ABOUT US | FEATURE ROUTES END

module.exports = router;