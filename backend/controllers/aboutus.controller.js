const { pool } = require("../db/db");
const ApiError = require("../utils/ApiErrors");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const path = require("path");
// FIXED CONTENT
// get 
const getAboutusFixedContent = asyncHandler(async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM aboutus_single LIMIT 1"
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "About us content fetched successfully",
        rows[0] || null
      )
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(
        false,
        "Failed to fetch about us content",
        error.message
      )
    );
  }
});

// update 
const updateAboutusFixedContent = asyncHandler(async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      aboutus_heading,
      aboutusHeroPara,
      aboutusLongPara,
      aboutusbellowHeading,
      aboutusbellowPara,
    } = req.body;

    let logo = null;
    let SecondSecImage_Hero = null;

    // Logo Upload
    if (req.files?.logo?.[0]) {
      const filePath = req.files.logo[0].path;

      logo = path
        .join(
          path.basename(path.dirname(filePath)),
          path.basename(filePath)
        )
        .replace(/\\/g, "/");
    }

    // Hero Image Upload
    if (req.files?.SecondSecImage_Hero?.[0]) {
      const filePath = req.files.SecondSecImage_Hero[0].path;

      SecondSecImage_Hero = path
        .join(
          path.basename(path.dirname(filePath)),
          path.basename(filePath)
        )
        .replace(/\\/g, "/");
    }

    const fields = [];
    const values = [];

    if (aboutus_heading !== undefined) {
      fields.push("aboutus_heading=?");
      values.push(aboutus_heading);
    }

    if (aboutusHeroPara !== undefined) {
      fields.push("aboutusHeroPara=?");
      values.push(aboutusHeroPara);
    }

    if (aboutusLongPara !== undefined) {
      fields.push("aboutusLongPara=?");
      values.push(aboutusLongPara);
    }

    if (aboutusbellowHeading !== undefined) {
      fields.push("aboutusbellowHeading=?");
      values.push(aboutusbellowHeading);
    }

    if (aboutusbellowPara !== undefined) {
      fields.push("aboutusbellowPara=?");
      values.push(aboutusbellowPara);
    }

    if (logo) {
      fields.push("logo=?");
      values.push(logo);
    }

    if (SecondSecImage_Hero) {
      fields.push("SecondSecImage_Hero=?");
      values.push(SecondSecImage_Hero);
    }

    if (fields.length === 0) {
      return res.status(400).json(
        new ApiError(false, "No data provided for update")
      );
    }

    // Assuming aboutus_single has only one row with id = 1
    values.push(1);

    const [result] = await pool.query(
      `UPDATE aboutus_single 
       SET ${fields.join(", ")} 
       WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json(
        new ApiError(false, "No record found with id = 1")
      );
    }

    const [updatedData] = await pool.query(
      "SELECT * FROM aboutus_single WHERE id = 1"
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "About us content updated successfully",
        updatedData[0]
      )
    );
  } catch (error) {
    console.error(error);

    res.status(500).json(
      new ApiError(
        false,
        "Failed to update about us content",
        error.message
      )
    );
  }
});
// FIXED CONTENT END


// get about us featreu 
const getAllFeatures = asyncHandler(async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM aboutus_features ORDER BY id DESC"
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Features fetched successfully",
        rows
      )
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Failed to fetch features", error.message)
    );
  }

});

// create abot us featuer 
const createFeature = asyncHandler(async (req, res) => {
  try {
    const { icon, paragraph } = req.body;

    if (!icon || !paragraph) {
      return res.status(400).json(
        new ApiError(false, "Icon and paragraph are required")
      );
    }

    const [result] = await pool.query(
      `INSERT INTO aboutus_features (icon, paragraph)
       VALUES (?, ?)`,
      [icon, paragraph]
    );

    const [feature] = await pool.query(
      "SELECT * FROM aboutus_features WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(
      new ApiResponse(
        true,
        "Feature created successfully",
        feature[0]
      )
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Failed to create feature", error.message)
    );
  }
});

// update about us featuer 
const updateFeature = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, paragraph } = req.body;

    const fields = [];
    const values = [];

    if (icon !== undefined) {
      fields.push("icon=?");
      values.push(icon);
    }

    if (paragraph !== undefined) {
      fields.push("paragraph=?");
      values.push(paragraph);
    }

    if (fields.length === 0) {
      return res.status(400).json(
        new ApiError(false, "No data provided for update")
      );
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE aboutus_features
       SET ${fields.join(", ")}
       WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json(
        new ApiError(false, "Feature not found")
      );
    }

    const [updatedFeature] = await pool.query(
      "SELECT * FROM aboutus_features WHERE id = ?",
      [id]
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Feature updated successfully",
        updatedFeature[0]
      )
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Failed to update feature", error.message)
    );
  }
});

// delete about us feature 
const deleteFeature = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM aboutus_features WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json(
        new ApiError(false, "Feature not found")
      );
    }

    res.status(200).json(
      new ApiResponse(
        true,
        "Feature deleted successfully",
        null
      )
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Failed to delete feature", error.message)
    );
  }
});



module.exports = {
  getAboutusFixedContent,
  updateAboutusFixedContent,

    getAllFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
};