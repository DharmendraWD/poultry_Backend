const {Router} = require('express');
const router = Router();
const createUploader = require('../middleware/upload');

const homeController = require('../controllers/home.controller');

const multiUpload = require('../middleware/multiupload');
const { authenticateAccessToken } = require('../middleware/auth');
    // HERO SECTION 
router.route('/hero').get(
    homeController.getHeroSection
).post(
    authenticateAccessToken,
  createUploader({
    folder: 'hero',
    fileType: 'image',
    fieldName: 'image'
  }),

  homeController.createHeroSection
)
router.route('/hero/:id').put(
    createUploader({
        folder: 'hero',
        fileType: 'image',
        fieldName: 'image'
      }),
    homeController.updateHeroSection
).delete(
    homeController.deleteHeroSection
).get(
    homeController.getParticularHeroSection
)
// HERO SECTION END

// CARDS OF FIRST BOTTOM HERO SECTION
router.route('/firstcard').post(
    homeController.createFirstCard
).get(
    homeController.getFirstCard
)
router.route('/firstcard/:id').put(
    authenticateAccessToken,
    homeController.updateFirstCard
).delete(
    authenticateAccessToken,
    homeController.deleteFirstCard
).get(
    homeController.getParticularFirstCard
)
// CARDS OF FIRST BOTTOM HERO SECTION END

// HOME FEATURE CARDS 
router.route('/homefeaturecard').post(
    authenticateAccessToken,
    homeController.createHomeFeatureCard
).get(
    homeController.getHomeFeatureCard
)
router.route('/homefeaturecard/:id').put(
    authenticateAccessToken,
    homeController.updateHomeFeatureCard
).delete(
    authenticateAccessToken,
    homeController.deleteHomeFeatureCard
).get(
    homeController.getParticularHomeFeatureCard
)
// HOME FEATURE CARDS ENDS

// WHY CHOOSE US 
router.route('/whychooseus').post(
    authenticateAccessToken,
    homeController.createWhyChooseUs
).get(
    homeController.getWhyChooseUs
)
router.route('/whychooseus/:id').put(
    authenticateAccessToken,
    homeController.updateWhyChooseUs
).delete(
    authenticateAccessToken,
    homeController.deleteWhyChooseUs
).get(
    homeController.getParticularWhyChooseUs
)
// WHY CHOOSE US ENDS

// TESTIMONIALS 
router.route('/testimonial').post(
        authenticateAccessToken,
      createUploader({
    folder: 'testimonial',
    fileType: 'image',
    fieldName: 'image'
  }),
    homeController.createTestimonial
).get(
    homeController.getTestimonials
)
router.route('/testimonial/:id').put(
    authenticateAccessToken,
    createUploader({
        folder: 'testimonial',
        fileType: 'image',
        fieldName: 'image'
      }),
    homeController.updateTestimonial
).delete(
    authenticateAccessToken,
    homeController.deleteTestimonial
).get(
    homeController.getParticularTestimonial
)
// TESTIMONIALS END


// PRODUCT ROUTE 
router.route('/product').post(
    authenticateAccessToken,
    createUploader({
        folder: 'product',
        fileType: 'image',
        fieldName: 'image'
      }),
    homeController.createProduct
).get(
    homeController.getProducts
)
router.route('/product/:id').put(
    authenticateAccessToken,
    createUploader({
        folder: 'product',
        fileType: 'image',
        fieldName: 'image'
      }),
    homeController.updateProduct
).delete(
    authenticateAccessToken,
    homeController.deleteProduct
).get(
    homeController.getParticularProduct
)   
// PRODUCT ROUTE END

// GALLERY ROUTE 
router.route('/gallery').post(
    authenticateAccessToken,
    createUploader({
        folder: 'gallery',
        fileType: 'image',
        fieldName: 'image'
      }),
    homeController.createGalleryImage
).get(
    homeController.getGalleryImages
)
router.route('/gallery/:id').put(
    authenticateAccessToken,
    createUploader({
        folder: 'gallery',
        fileType: 'image',
        fieldName: 'image'
      }),
    homeController.updateGalleryImage
).delete(
    authenticateAccessToken,    
    homeController.deleteGalleryImage
)
// GALLERY ROUTE END

// HERO PAGE STATS 
router.get("/stats", homeController.getStats);

router.post("/stats",
    authenticateAccessToken,
    homeController.createStat);

router.put("/stats/:id", authenticateAccessToken, homeController.updateStat);

router.delete("/stats/:id", authenticateAccessToken, homeController.deleteStat);
// HERO PAGE STATS END

// HERO PAGE TICKER 
router.get("/ticker", homeController.getTickerItems);

router.post("/ticker", authenticateAccessToken, homeController.createTickerItems);

router.delete("/ticker/:id", authenticateAccessToken, homeController.deleteTickerItem);

router.put("/ticker/:id", authenticateAccessToken, homeController.updateTickerItem);

// HERO PAGE TICKER END 

// MISCELLANEOUS ROUTES 
router.get('/site-settings', homeController.getSiteSettings);
router.put(
  '/site-settings',
  authenticateAccessToken,
  multiUpload,
  homeController.updateSiteSettings
);
// MISCELLANEOUS ROUTES END 

module.exports = router;