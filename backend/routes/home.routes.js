const {Router} = require('express');
const router = Router();
const createUploader = require('../middleware/upload');

const homeController = require('../controllers/home.controller');

const multiUpload = require('../middleware/multiupload');
    // HERO SECTION 
router.route('/hero').get(
    homeController.getHeroSection
).post(
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
    homeController.updateFirstCard
).delete(
    homeController.deleteFirstCard
).get(
    homeController.getParticularFirstCard
)
// CARDS OF FIRST BOTTOM HERO SECTION END

// HOME FEATURE CARDS 
router.route('/homefeaturecard').post(
    homeController.createHomeFeatureCard
).get(
    homeController.getHomeFeatureCard
)
router.route('/homefeaturecard/:id').put(
    homeController.updateHomeFeatureCard
).delete(
    homeController.deleteHomeFeatureCard
).get(
    homeController.getParticularHomeFeatureCard
)
// HOME FEATURE CARDS ENDS

// WHY CHOOSE US 
router.route('/whychooseus').post(
    homeController.createWhyChooseUs
).get(
    homeController.getWhyChooseUs
)
router.route('/whychooseus/:id').put(
    homeController.updateWhyChooseUs
).delete(
    homeController.deleteWhyChooseUs
).get(
    homeController.getParticularWhyChooseUs
)
// WHY CHOOSE US ENDS

// TESTIMONIALS 
router.route('/testimonial').post(
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
    createUploader({
        folder: 'testimonial',
        fileType: 'image',
        fieldName: 'image'
      }),
    homeController.updateTestimonial
).delete(
    homeController.deleteTestimonial
).get(
    homeController.getParticularTestimonial
)
// TESTIMONIALS END


// PRODUCT ROUTE 
router.route('/product').post(
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
    createUploader({
        folder: 'product',
        fileType: 'image',
        fieldName: 'image'
      }),
    homeController.updateProduct
).delete(
    homeController.deleteProduct
).get(
    homeController.getParticularProduct
)   
// PRODUCT ROUTE END

// GALLERY ROUTE 
router.route('/gallery').post(
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
    createUploader({
        folder: 'gallery',
        fileType: 'image',
        fieldName: 'image'
      }),
    homeController.updateGalleryImage
).delete(
    homeController.deleteGalleryImage
)
// GALLERY ROUTE END

// HERO PAGE STATS 
router.get("/stats", homeController.getStats);

router.post("/stats", homeController.createStat);

router.put("/stats/:id", homeController.updateStat);

router.delete("/stats/:id", homeController.deleteStat);
// HERO PAGE STATS END

// HERO PAGE TICKER 
router.get("/ticker", homeController.getTickerItems);

router.post("/ticker", homeController.createTickerItems);

router.delete("/ticker/:id", homeController.deleteTickerItem);

router.put("/ticker/:id", homeController.updateTickerItem);

// HERO PAGE TICKER END 

// MISCELLANEOUS ROUTES 
router.get('/site-settings', homeController.getSiteSettings);
router.put(
  '/site-settings',
  multiUpload,
  homeController.updateSiteSettings
);
// MISCELLANEOUS ROUTES END 

module.exports = router;