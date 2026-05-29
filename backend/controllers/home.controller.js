const asyncHandler = require("../utils/asyncHandler")
const ApiError = require("../utils/ApiErrors")
const ApiResponse = require("../utils/ApiResponse")
const path = require('path');
const fs = require('fs');

const { pool } = require("../db/db")




// HERO SECTION 
// get Hero Section 
const getHeroSection = asyncHandler(async (req, res)=>{
    try {
        
        const [rows] = await pool.query("SELECT * FROM hero_sections")
        res.status(200).json(new ApiResponse(true, "Hero sections data fetched successfully", rows))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to fetch hero sections data", error.message))
    }
})
// Create Hero Section 
const createHeroSection = asyncHandler(async (req, res)=>{

    try {
        const resImage = req.file.path.replace(/\\/g, "/").split("/").slice(-2).join("/"); // Get last two segments for consistent path
        // console.log(resImage)
        const {tab, tab_icon, tab_class, color, eyebrow, headline, accent_line, sub, label, href, bg_class, image} = req.body;
        const [result] = await pool.query("INSERT INTO hero_sections (tab, tab_icon, tab_class, color, eyebrow, headline, accent_line, sub, label, href, bg_class, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [tab, tab_icon, tab_class, color, eyebrow, headline, accent_line, sub, label, href, bg_class, resImage])

        res.status(201).json(new ApiResponse(true, "Hero section created successfully", {id: result.insertId, tab, tab_icon, tab_class, color, eyebrow, headline, accent_line, sub, label, href, bg_class, image: resImage}))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to create hero section", error.message))
    }
})
// update hero section 
const updateHeroSection = asyncHandler(async (req, res)=>{
    try {
        const {id} = req.params;
        const {tab, tab_icon, tab_class, color, eyebrow, headline, accent_line, sub, label, href, bg_class, image} = req.body;
        let resImage;
        if(req.file){
            resImage = req.file.path.replace(/\\/g, "/").split("/").slice(-2).join("/"); // Get last two segments for consistent path
        }

        
        
        const [rows] = await pool.query("SELECT * FROM hero_sections WHERE id=?", [id])
        // console.log(rows)
        const [result] = await pool.query("UPDATE hero_sections SET tab=?, tab_icon=?, tab_class=?, color=?, eyebrow=?, headline=?, accent_line=?, sub=?, label=?, href=?, bg_class=?"+(resImage ? ", image=?" : "")+" WHERE id=?", [...[tab, tab_icon, tab_class, color, eyebrow, headline, accent_line, sub, label, href, bg_class], ...(resImage ? [resImage] : []), id])

        if(result.affectedRows === 0){
            return res.status(404).json(new ApiError(false, "Hero section not found", null))
        }
        // // delete previous image from server 
        if(resImage){
            // get path of upload folder 
            const uploadFolderPath = path.join(__dirname, '..', 'uploads'+"/");
            const previousImagePath = uploadFolderPath+rows[0]?.image; 

            // console.log(previousImagePath, "Pre")
            if(previousImagePath){
                fs.unlink(previousImagePath, (err) => {
                    if (err) {
                        console.error('Failed to delete previous image:', err);
                    } else {
                        console.log('Previous image deleted successfully');
                    }
                });
            }


        }

        res.status(200).json(new ApiResponse(true, "Hero section updated successfully", {id, tab, tab_icon, tab_class, color, eyebrow, headline, accent_line, sub, label, href, bg_class, image: resImage}))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to update hero section", error.message))
    }
})
// deletee hero sec 
const deleteHeroSection = asyncHandler(async (req, res)=>{
    try {
        const {id} = req.params;
        const [rows] = await pool.query("SELECT * FROM hero_sections WHERE id=?", [id])
        const [result] = await pool.query("DELETE FROM hero_sections WHERE id=?", [id])

        if(result.affectedRows === 0){
            return res.status(404).json(new ApiError(false, "Hero section not found", null))
        }
        // delete image from server 
        const uploadFolderPath = path.join(__dirname, '..', 'uploads'+"/");
        const imagePath = uploadFolderPath+rows[0]?.image; 

        // console.log(imagePath, "Del")
        if(imagePath){
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Failed to delete image:', err);
                } else {
                    console.log('Image deleted successfully');
                }
            });
        }

        res.status(200).json(new ApiResponse(true, "Hero section deleted successfully", null))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to delete hero section", error.message))
    }
})
// get particular hero sec 
const getParticularHeroSection = asyncHandler(async (req, res)=>{
    try {
        const {id} = req.params;
        const [rows] = await pool.query("SELECT * FROM hero_sections WHERE id=?", [id])
        if(rows.length === 0){
            return res.status(404).json(new ApiError(false, "Hero section not found", null))
        }
        res.status(200).json(new ApiResponse(true, "Hero section data fetched successfully", rows[0]))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to fetch hero section data", error.message))
    }
})
// HERO SECTION END 

// FIRSTBOTTOM OF HERO SECTION 
// create card
const createFirstCard = asyncHandler(async (req, res)=>{
    const {title, timee, days, body} = req.body;

    try{
        const [result] = await pool.query("INSERT INTO cards_of_firstBottom_hero (title, timee, days, body) VALUES (?, ?, ?, ?)", [title, timee, days, body])
        res.status(201).json(new ApiResponse(true, "Card created successfully", result))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to create card", error.message))
    }
})
// update card 
const updateFirstCard = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const {title, timee, days, body} = req.body;
    try{
        const [result] = await pool.query("UPDATE cards_of_firstBottom_hero SET title=?, timee=?, days=?, body=? WHERE id=?", [title, timee, days, body, id])
        res.status(200).json(new ApiResponse(true, "Card updated successfully", result))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to update card", error.message))
    }
})
// delete card 
const deleteFirstCard = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    try{
        const [result] = await pool.query("DELETE FROM cards_of_firstBottom_hero WHERE id=?", [id])
        res.status(200).json(new ApiResponse(true, "Card deleted successfully", result))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to delete card", error.message))
    }
})
// getall first cards
const getFirstCard = asyncHandler(async (req, res)=>{
    try {
        
        const [rows] = await pool.query("SELECT * FROM cards_of_firstBottom_hero")
        res.status(200).json(new ApiResponse(true, "Cards data fetched successfully", rows))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to fetch cards data", error.message))
    }
})
// get particular card
const getParticularFirstCard = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    try {
        
        const [rows] = await pool.query("SELECT * FROM cards_of_firstBottom_hero WHERE id=?", [id])
        if(rows.length === 0){
            return res.status(404).json(new ApiError(false, "Card not found", null))
        }
        res.status(200).json(new ApiResponse(true, "Card data fetched successfully", rows[0]))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to fetch card data", error.message))
    }
})
// FIRSTBOTTOM OF HERO SECTION END

// HOME FEATURE CARDS 
// create 
const createHomeFeatureCard = asyncHandler(async (req, res)=>{
    const {	icon,icon_color,title,body, active	} = req.body;

    try{
        const [result] = await pool.query("INSERT INTO feature_cards (icon, icon_color, title, body, active) VALUES (?, ?, ?, ?, ?)", [icon, icon_color, title, body, active])
        res.status(201).json(new ApiResponse(true, "Home feature card created successfully", result))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to create home feature card", error.message))

    }
})
// get 
const getHomeFeatureCard = asyncHandler(async (req, res)=>{
    try {
        
        const [rows] = await pool.query("SELECT * FROM feature_cards")
        res.status(200).json(new ApiResponse(true, "Home feature cards data fetched successfully", rows))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to fetch home feature cards data", error.message))
    }
})
// update 
const updateHomeFeatureCard = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const {	icon,icon_color,title,body, active	} = req.body;
    try{
        const [result] = await pool.query("UPDATE feature_cards SET icon=?, icon_color=?, title=?, body=?, active=? WHERE id=?", [icon, icon_color, title, body, active, id])
        res.status(200).json(new ApiResponse(true, "Home feature card updated successfully", result))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to update home feature card", error.message))

    }
})
// delete 
const deleteHomeFeatureCard = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    try{
        const [result] = await pool.query("DELETE FROM feature_cards WHERE id=?", [id])
        res.status(200).json(new ApiResponse(true, "Home feature card deleted successfully", result))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to delete home feature card", error.message))

    }
})
// get particular card 
const getParticularHomeFeatureCard = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    try {
        
        const [rows] = await pool.query("SELECT * FROM feature_cards WHERE id=?", [id])
        if(rows.length === 0){
            return res.status(404).json(new ApiError(false, "Home feature card not found", null))
        }
        res.status(200).json(new ApiResponse(true, "Home feature card data fetched successfully", rows[0]))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to fetch home feature card data", error.message))
    }
})
// HOME FEATURE CARDS ENDS

// WH CHOOSE US SECTION
// create
const createWhyChooseUs = asyncHandler(async (req, res)=>{
    const {text, body} = req.body;
    try{
        const [result] = await pool.query("INSERT INTO why_chooseus (text, body) VALUES (?, ?)", [text, body])
        res.status(201).json(new ApiResponse(true, "Why choose us section created successfully", result))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to create why choose us section", error.message))

    }
})
// update 
const updateWhyChooseUs = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const {text, body} = req.body;
    try{
        const [result] = await pool.query("UPDATE why_chooseus SET text=?, body=? WHERE id=?", [text, body, id])
        res.status(200).json(new ApiResponse(true, "Why choose us section updated successfully", result))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to update why choose us section", error.message))

    }
})
// delete 
const deleteWhyChooseUs = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    try{
        const [result] = await pool.query("DELETE FROM why_chooseus WHERE id=?", [id])
        res.status(200).json(new ApiResponse(true, "Why choose us section deleted successfully", result))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to delete why choose us section", error.message))

    }
})
// get particular 
const getParticularWhyChooseUs = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    try {
        
        const [rows] = await pool.query("SELECT * FROM why_chooseus WHERE id=?", [id])
        if(rows.length === 0){
            return res.status(404).json(new ApiError(false, "Why choose us section not found", null))
        }
        res.status(200).json(new ApiResponse(true, "Why choose us section data fetched successfully", rows[0]))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to fetch why choose us section data", error.message))
    }
})
// get all 
const getWhyChooseUs = asyncHandler(async (req, res)=>{
    try {
        const [rows] = await pool.query("SELECT * FROM why_chooseus")
        res.status(200).json(new ApiResponse(true, "Why choose us section data fetched successfully", rows))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to fetch why choose us section data", error.message))
    }
})
// WH CHOOSE US SECTION END 

// TESTIMONIALS SECTION
// create testimonial 
const createTestimonial = asyncHandler(async (req, res)=>{

     try {
        const resImage = req.file.path.replace(/\\/g, "/").split("/").slice(-2).join("/"); // Get last two segments for consistent path
        // console.log(resImage)
        const {body, stars, avatar, name} = req.body;
        const [result] = await pool.query("INSERT INTO testimonials (body, stars, avatar, name) VALUES (?, ?, ?, ?)", [body, stars, resImage, name])

        res.status(201).json(new ApiResponse(true, "Testimonial created successfully", {result}))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to create testimonial", error.message))
    }
})
// get testimonials 
const getTestimonials = asyncHandler(async (req, res)=>{
    try {
        const [rows] = await pool.query("SELECT * FROM testimonials")
        res.status(200).json(new ApiResponse(true, "Testimonials data fetched successfully", rows))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to fetch testimonials data", error.message))
    }
})
// update testimonial 
const updateTestimonial = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        const { body, stars, name } = req.body;

        let resImage;

        if (req.file) {

            resImage = req.file.path
                .replace(/\\/g, "/")
                .split("/")
                .slice(-2)
                .join("/");
        }

        const [rows] = await pool.query(
            "SELECT * FROM testimonials WHERE id=?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json(
                new ApiError(false, "Testimonial not found")
            );
        }

        let sql = `
            UPDATE testimonials
            SET body=?, stars=?, name=?
        `;

        const values = [body, stars, name];

        if (resImage) {
            sql += `, avatar=?`;
            values.push(resImage);
        }

        sql += ` WHERE id=?`;

        values.push(id);

        const [result] = await pool.query(sql, values);

        // delete old image
        if (resImage && rows[0]?.avatar) {

            const previousImagePath = path.join(
                __dirname,
                "..",
                "uploads",
                rows[0].avatar
            );

            console.log(previousImagePath)

            fs.unlink(previousImagePath, (err) => {

                if (err) {
                    console.error(
                        "Failed to delete previous image:",
                        err
                    );
                }

                else {
                    console.log(
                        "Previous image deleted successfully"
                    );
                }
            });
        }

        res.status(200).json(
            new ApiResponse(
                true,
                "Testimonial updated successfully",
                {
                    id,
                    body,
                    stars,
                    name,
                    avatar: resImage || rows[0].avatar
                }
            )
        );

    } catch (error) {

        console.log(error);

        res.status(500).json(
            new ApiError(
                false,
                "Failed to update testimonial section",
                error.message
            )
        );
    }
});
// delete testimonial 
const deleteTestimonial = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    try{
        const [result] = await pool.query("DELETE FROM testimonials WHERE id=?", [id])
        res.status(200).json(new ApiResponse(true, "Testimonial deleted successfully", result))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to delete testimonial", error.message))

    }
})
// get particular testimonial 
const getParticularTestimonial = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    try {
        
        const [rows] = await pool.query("SELECT * FROM testimonials WHERE id=?", [id])
        if(rows.length === 0){
            return res.status(404).json(new ApiError(false, "Testimonial not found", null))
        }
        res.status(200).json(new ApiResponse(true, "Testimonial data fetched successfully", rows[0]))
    } catch (error) {
        res.status(500).json(new ApiError(false, "Failed to fetch testimonial data", error.message))
    }
})
// TESTIMONIALS SECTION END

// PRODUCT SECTION 
// get products
const getProducts = asyncHandler(async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM products ORDER BY sort_order ASC");

        res.status(200).json(
            new ApiResponse(true, "Products fetched successfully", rows)
        );

    } catch (error) {
        res.status(500).json(
            new ApiError(false, "Failed to fetch products", error.message)
        );
    }
});
// create product 
const createProduct = asyncHandler(async (req, res) => {
    try {
        const resImage = req.file
            ? req.file.path.replace(/\\/g, "/").split("/").slice(-2).join("/")
            : null;

        const {
            title,
            subtitle,
            description,
            button_text,
            button_link,
            sort_order,
            is_active
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO products 
            (title, subtitle, description, image, button_text, button_link, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                subtitle,
                description,
                resImage,
                button_text || "See More",
                button_link,
                sort_order || 0,
                is_active ?? 1
            ]
        );

        res.status(201).json(
            new ApiResponse(true, "Product created successfully", {
                id: result.insertId,
                title,
                subtitle,
                description,
                image: resImage,
                button_text,
                button_link,
                sort_order,
                is_active
            })
        );

    } catch (error) {
        res.status(500).json(
            new ApiError(false, "Failed to create product", error.message)
        );
    }
});
// update uproduct 
const updateProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        let resImage;
        if (req.file) {
            resImage = req.file.path
                .replace(/\\/g, "/")
                .split("/")
                .slice(-2)
                .join("/");
        }

        const {
            title,
            subtitle,
            description,
            button_text,
            button_link,
            sort_order,
            is_active
        } = req.body;

        const [rows] = await pool.query(
            "SELECT * FROM products WHERE id=?",
            [id]
        );

        if (!rows.length) {
            return res.status(404).json(
                new ApiError(false, "Product not found", null)
            );
        }

        const [result] = await pool.query(
            `UPDATE products SET
                title=?,
                subtitle=?,
                description=?,
                button_text=?,
                button_link=?,
                sort_order=?,
                is_active=?
                ${resImage ? ", image=?" : ""}
             WHERE id=?`,
            [
                title,
                subtitle,
                description,
                button_text,
                button_link,
                sort_order,
                is_active,
                ...(resImage ? [resImage] : []),
                id
            ]
        );

        // delete old image if new uploaded
        if (resImage && rows[0]?.image) {
            const uploadPath = path.join(__dirname, "..", "uploads");
            const oldPath = path.join(uploadPath, rows[0].image);

            fs.unlink(oldPath, (err) => {
                if (err) console.log("Old image delete failed:", err.message);
            });
        }

        res.status(200).json(
            new ApiResponse(true, "Product updated successfully", {
                id,
                title,
                subtitle,
                description,
                image: resImage || rows[0].image,
                button_text,
                button_link,
                sort_order,
                is_active
            })
        );

    } catch (error) {
        res.status(500).json(
            new ApiError(false, "Failed to update product", error.message)
        );
    }
});
// delete procut 
const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            "SELECT * FROM products WHERE id=?",
            [id]
        );

        const [result] = await pool.query(
            "DELETE FROM products WHERE id=?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json(
                new ApiError(false, "Product not found", null)
            );
        }

        // delete image
        const uploadPath = path.join(__dirname, "..", "uploads");
        const imagePath = path.join(uploadPath, rows[0]?.image || "");

        if (rows[0]?.image) {
            fs.unlink(imagePath, (err) => {
                if (err) console.log("Image delete failed:", err.message);
            });
        }

        res.status(200).json(
            new ApiResponse(true, "Product deleted successfully", null)
        );

    } catch (error) {
        res.status(500).json(
            new ApiError(false, "Failed to delete product", error.message)
        );
    }
});
// get particular product 
const getParticularProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.query(
            "SELECT * FROM products WHERE id=?",
            [id]
        );

        if (!rows.length) {
            return res.status(404).json(
                new ApiError(false, "Product not found", null)
            );
        }
        res.status(200).json(
            new ApiResponse(true, "Product data fetched successfully", rows[0])
        );

    } catch (error) {
        res.status(500).json(
            new ApiError(false, "Failed to fetch product data", error.message)
        );
    }
});
// PRODUCT SECTION END

// GALLERY SECTION 
// get all gallery images
const getGalleryImages = asyncHandler(async (req, res) => {
    try {

        const [rows] = await pool.query(
            "SELECT * FROM gallery_images ORDER BY sort_order ASC"
        );

        res.status(200).json(
            new ApiResponse(
                true,
                "Gallery images fetched successfully",
                rows
            )
        );

    } catch (error) {

        res.status(500).json(
            new ApiError(
                false,
                "Failed to fetch gallery images",
                error.message
            )
        );
    }
});
// create gallery image
const createGalleryImage = asyncHandler(async (req, res) => {

    try {

        const resImage = req.file
            ? req.file.path
                  .replace(/\\/g, "/")
                  .split("/")
                  .slice(-2)
                  .join("/")
            : null;

        const {
            title,
            sort_order,
            is_active
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO gallery_images
            (title, image, sort_order, is_active)
            VALUES (?, ?, ?, ?)`,
            [
                title || null,
                resImage,
                sort_order || 0,
                is_active ?? 1
            ]
        );

        res.status(201).json(
            new ApiResponse(
                true,
                "Gallery image created successfully",
                {
                    id: result.insertId,
                    title,
                    image: resImage,
                    sort_order,
                    is_active
                }
            )
        );

    } catch (error) {

        res.status(500).json(
            new ApiError(
                false,
                "Failed to create gallery image",
                error.message
            )
        );
    }
});
// update gallery 
const updateGalleryImage = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        let resImage;

        if (req.file) {
            resImage = req.file.path
                .replace(/\\/g, "/")
                .split("/")
                .slice(-2)
                .join("/");
        }

        const {
            title,
            sort_order,
            is_active
        } = req.body;

        const [rows] = await pool.query(
            "SELECT * FROM gallery_images WHERE id=?",
            [id]
        );

        if (!rows.length) {
            return res.status(404).json(
                new ApiError(
                    false,
                    "Gallery image not found",
                    null
                )
            );
        }

        const [result] = await pool.query(
            `UPDATE gallery_images SET
                title=?,
                sort_order=?,
                is_active=?
                ${resImage ? ", image=?" : ""}
            WHERE id=?`,
            [
                title || null,
                sort_order || 0,
                is_active ?? 1,
                ...(resImage ? [resImage] : []),
                id
            ]
        );

        // delete previous image
        if (resImage && rows[0]?.image) {

            const uploadFolderPath = path.join(
                __dirname,
                "..",
                "uploads"
            );

            const previousImagePath = path.join(
                uploadFolderPath,
                rows[0].image
            );

            fs.unlink(previousImagePath, (err) => {
                if (err) {
                    console.log(
                        "Failed to delete previous image:",
                        err.message
                    );
                }
            });
        }

        res.status(200).json(
            new ApiResponse(
                true,
                "Gallery image updated successfully",
                {
                    id,
                    title,
                    image: resImage || rows[0].image,
                    sort_order,
                    is_active
                }
            )
        );

    } catch (error) {

        res.status(500).json(
            new ApiError(
                false,
                "Failed to update gallery image",
                error.message
            )
        );
    }
});
// delete gallery 
const deleteGalleryImage = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await pool.query(
            "SELECT * FROM gallery_images WHERE id=?",
            [id]
        );

        const [result] = await pool.query(
            "DELETE FROM gallery_images WHERE id=?",
            [id]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json(
                new ApiError(
                    false,
                    "Gallery image not found",
                    null
                )
            );
        }

        // delete image from uploads
        if (rows[0]?.image) {

            const uploadFolderPath = path.join(
                __dirname,
                "..",
                "uploads"
            );

            const imagePath = path.join(
                uploadFolderPath,
                rows[0].image
            );

            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.log(
                        "Failed to delete image:",
                        err.message
                    );
                }
            });
        }

        res.status(200).json(
            new ApiResponse(
                true,
                "Gallery image deleted successfully",
                null
            )
        );

    } catch (error) {

        res.status(500).json(
            new ApiError(
                false,
                "Failed to delete gallery image",
                error.message
            )
        );
    }
});
// GALLERY SECTION END

// HERO PAGE STATS
const getStats = asyncHandler(async (req, res) => {

    try {

        const [rows] = await pool.query(
            "SELECT * FROM stats ORDER BY sort_order ASC"
        );

        res.status(200).json(
            new ApiResponse(
                true,
                "Stats fetched successfully",
                rows
            )
        );

    } catch (error) {

        res.status(500).json(
            new ApiError(
                false,
                "Failed to fetch stats",
                error.message
            )
        );
    }
});
const createStat = asyncHandler(async (req, res) => {

    try {

        const {
            icon,
            number_text,
            label,
            sort_order,
            is_active
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO stats
            (icon, number_text, label, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?)`,
            [
                icon,
                number_text,
                label,
                sort_order || 0,
                is_active ?? 1
            ]
        );

        res.status(201).json(
            new ApiResponse(
                true,
                "Stat created successfully",
                {
                    id: result.insertId,
                    icon,
                    number_text,
                    label,
                    sort_order,
                    is_active
                }
            )
        );

    } catch (error) {

        res.status(500).json(
            new ApiError(
                false,
                "Failed to create stat",
                error.message
            )
        );
    }
});
const updateStat = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        const {
            icon,
            number_text,
            label,
            sort_order,
            is_active
        } = req.body;

        const [rows] = await pool.query(
            "SELECT * FROM stats WHERE id=?",
            [id]
        );

        if (!rows.length) {

            return res.status(404).json(
                new ApiError(
                    false,
                    "Stat not found",
                    null
                )
            );
        }

        const [result] = await pool.query(
            `UPDATE stats SET
                icon=?,
                number_text=?,
                label=?,
                sort_order=?,
                is_active=?
            WHERE id=?`,
            [
                icon,
                number_text,
                label,
                sort_order || 0,
                is_active ?? 1,
                id
            ]
        );

        res.status(200).json(
            new ApiResponse(
                true,
                "Stat updated successfully",
                {
                    id,
                    icon,
                    number_text,
                    label,
                    sort_order,
                    is_active
                }
            )
        );

    } catch (error) {

        res.status(500).json(
            new ApiError(
                false,
                "Failed to update stat",
                error.message
            )
        );
    }
});
const deleteStat = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM stats WHERE id=?",
            [id]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json(
                new ApiError(
                    false,
                    "Stat not found",
                    null
                )
            );
        }

        res.status(200).json(
            new ApiResponse(
                true,
                "Stat deleted successfully",
                null
            )
        );

    } catch (error) {

        res.status(500).json(
            new ApiError(
                false,
                "Failed to delete stat",
                error.message
            )
        );
    }
});
// HERO PAGE STATS END

// get 
const getTickerItems = asyncHandler(async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM ticker_items ORDER BY id DESC"
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "Ticker items fetched successfully",
          rows
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(
          false,
          "Failed to fetch ticker items",
          error.message
        )
      );
  }
});


// create single or multiple 
const createTickerItems = asyncHandler(async (req, res) => {
  try {
    const payload = req.body;

    // MULTIPLE INSERT
    if (Array.isArray(payload)) {

      const values = payload.map((item) => [item.text]);

      const [result] = await pool.query(
        "INSERT INTO ticker_items (text) VALUES ?",
        [values]
      );

      return res.status(201).json(
        new ApiResponse(
          true,
          "Ticker items created successfully",
          {
            inserted: result.affectedRows,
          }
        )
      );
    }

    // SINGLE INSERT
    const { text } = payload;

    const [result] = await pool.query(
      "INSERT INTO ticker_items (text) VALUES (?)",
      [text]
    );

    res.status(201).json(
      new ApiResponse(
        true,
        "Ticker item created successfully",
        {
          id: result.insertId,
          text,
        }
      )
    );

  } catch (error) {
    res.status(500).json(
      new ApiError(
        false,
        "Failed to create ticker items",
        error.message
      )
    );
  }
});

// delete
const deleteTickerItem = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM ticker_items WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json(
        new ApiError(
          false,
          "Ticker item not found",
          null
        )
      );
    }

    res.status(200).json(
      new ApiResponse(
        true,
        "Ticker item deleted successfully",
        null
      )
    );

  } catch (error) {
    res.status(500).json(
      new ApiError(
        false,
        "Failed to delete ticker item",
        error.message
      )
    );
  }
});
// update 
const updateTickerItem = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const [result] = await pool.query(
      "UPDATE ticker_items SET text=? WHERE id=?",
      [text, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json(
        new ApiError(
          false,
          "Ticker item not found",
          null
        )
      );
    }

    res.status(200).json(
        new ApiResponse(
            true,
            "Ticker item updated successfully",
            null
        )
    );    
  } catch (error) {
    res.status(500).json(
      new ApiError(
        false,
        "Failed to update ticker item",
        error.message
      )
    );
  }
}); 

// HERO PAGE TICKER SCROLLING END 

// MISCELLANEOUS 
const getSiteSettings = asyncHandler(async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM site_settings LIMIT 1");

    res.status(200).json(
      new ApiResponse(true, "Site settings fetched successfully", rows[0] || null)
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Failed to fetch site settings", error.message)
    );
  }
});


// UPDATE SITE SETTINGS
const updateSiteSettings = asyncHandler(async (req, res) => {
  try {
    const {
      facebook,
      whatsapp,
      mobilenum1,
      mobilenum2,
      tiktok,
      instagram,
      companyName,
      footerSlogan,
      address,
      location,
      email
    } = req.body;

    // file paths (optional uploads)
    let logo = null;
    let SecondSecImage_Hero = null;
    let ThirdSecVideo_Hero = null;

if (req.files?.logo?.[0]) {
  const filePath = req.files.logo[0].path;

  logo = path.join(
    path.basename(path.dirname(filePath)), // folder name
    path.basename(filePath) // file name
  ).replace(/\\/g, "/");
}

if (req.files?.SecondSecImage_Hero?.[0]) {
  const filePath = req.files.SecondSecImage_Hero[0].path;

  SecondSecImage_Hero = path.join(
    path.basename(path.dirname(filePath)),
    path.basename(filePath)
  ).replace(/\\/g, "/");
}

if (req.files?.ThirdSecVideo_Hero?.[0]) {
  const filePath = req.files.ThirdSecVideo_Hero[0].path;

  ThirdSecVideo_Hero = path.join(
    path.basename(path.dirname(filePath)),
    path.basename(filePath)
  ).replace(/\\/g, "/");
}

    // build dynamic query (only update provided fields)
    const fields = [
      "facebook",
      "whatsapp",
      "mobilenum1",
      "mobilenum2",
      "tiktok",
      "instagram",
      "companyName",
      "footerSlogan",
      "address",
      "location",
      "email"
    ];

    const values = [
      facebook,
      whatsapp,
      mobilenum1,
      mobilenum2,
      tiktok,
      instagram,
      companyName,
      footerSlogan,
      address,
      location,
      email
    ];

    // add files if exist
    if (logo) {
      fields.push("logo");
      values.push(logo);
    }

    if (SecondSecImage_Hero) {
      fields.push("SecondSecImage_Hero");
      values.push(SecondSecImage_Hero);
    }

    if (ThirdSecVideo_Hero) {
      fields.push("ThirdSecVideo_Hero");
      values.push(ThirdSecVideo_Hero);
    }

    const setQuery = fields.map(f => `${f}=?`).join(", ");

    const [result] = await pool.query(
      `UPDATE site_settings SET ${setQuery} WHERE id = 1`,
      values
    );

    res.status(200).json(
      new ApiResponse(true, "Site settings updated successfully", result)
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Failed to update site settings", error.message)
    );
  }
});
// MISCELLANEOUS END

module.exports = {
    getHeroSection,
    createHeroSection,
    updateHeroSection,
    deleteHeroSection,
    getParticularHeroSection,

    createFirstCard,
    updateFirstCard,
    deleteFirstCard,
    getFirstCard,
    getParticularFirstCard,

    createHomeFeatureCard,
    getHomeFeatureCard,
    updateHomeFeatureCard,
    deleteHomeFeatureCard,
    getParticularHomeFeatureCard,

    createWhyChooseUs,
    updateWhyChooseUs,
    deleteWhyChooseUs,
    getParticularWhyChooseUs,
    getWhyChooseUs,
    
    createTestimonial,
    getTestimonials,
    updateTestimonial,
    deleteTestimonial,
    getParticularTestimonial,

    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getParticularProduct,

        getGalleryImages,
    createGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,

       getStats,
    createStat,
    updateStat,
    deleteStat,

     getTickerItems,
  createTickerItems,
  deleteTickerItem,
  updateTickerItem,

    getSiteSettings,
  updateSiteSettings,
}
