const { pool } = require("../db/db");
const ApiError = require("../utils/ApiErrors");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const path = require("path");

// get single service content
const getServiceSingle = asyncHandler(async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM service_single LIMIT 1"
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Service content fetched successfully",
        rows[0] || null
      )
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Failed to fetch service content", error.message)
    );
  }
});
    
// update service single
const updateServiceSingle = asyncHandler(async (req, res) => {
  try {
    const {
      Hservice_heading,
      Hservice_para,
      shortHeading,
      shortpara,
      longpara,
      yrsOfExp,
      satisfiedCustomer,
      projectCompleted,
      other,
      yrsOfExpText,
      satisfiedCustomerText,
      projectCompletedText,
      otherText,
      aboutusHeroPara,
    } = req.body;

    let logo = null;
    let SecondSecImage_Hero = null;

    // handle logo upload
if (req.files?.logo?.[0]) {
  logo = `site-settings/${req.files.logo[0].filename}`;
}

if (req.files?.SecondSecImage_Hero?.[0]) {
  SecondSecImage_Hero = `site-settings/${req.files.SecondSecImage_Hero[0].filename}`;
}

    const fields = [];
    const values = [];

    if (Hservice_heading !== undefined) {
      fields.push("Hservice_heading=?");
      values.push(Hservice_heading);
    }

    if (Hservice_para !== undefined) {
      fields.push("Hservice_para=?");
      values.push(Hservice_para);
    }

    if (shortHeading !== undefined) {
      fields.push("shortHeading=?");
      values.push(shortHeading);
    }

    if (shortpara !== undefined) {
      fields.push("shortpara=?");
      values.push(shortpara);
    }

    if (longpara !== undefined) {
      fields.push("longpara=?");
      values.push(longpara);
    }

    if (yrsOfExp !== undefined) {
      fields.push("yrsOfExp=?");
      values.push(yrsOfExp);
    }

    if (satisfiedCustomer !== undefined) {
      fields.push("satisfiedCustomer=?");
      values.push(satisfiedCustomer);
    }

    if (projectCompleted !== undefined) {
      fields.push("projectCompleted=?");
      values.push(projectCompleted);
    }

    if (other !== undefined) {
      fields.push("other=?");
      values.push(other);
    }

    if (yrsOfExpText !== undefined) {
      fields.push("yrsOfExpText=?");
      values.push(yrsOfExpText);
    }

    if (satisfiedCustomerText !== undefined) {
      fields.push("satisfiedCustomerText=?");
      values.push(satisfiedCustomerText);
    }

    if (projectCompletedText !== undefined) {
      fields.push("projectCompletedText=?");
      values.push(projectCompletedText);
    }

    if (otherText !== undefined) {
      fields.push("otherText=?");
      values.push(otherText);
    }

    if (aboutusHeroPara !== undefined) {
      fields.push("aboutusHeroPara=?");
      values.push(aboutusHeroPara);
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

    // get first row id (single row table)
    const [rows] = await pool.query(
      "SELECT id FROM service_single LIMIT 1"
    );

    if (!rows.length) {
      return res.status(404).json(
        new ApiError(false, "Service record not found")
      );
    }

    const id = rows[0].id;
    values.push(id);

    const [result] = await pool.query(
      `UPDATE service_single 
       SET ${fields.join(", ")} 
       WHERE id = ?`,
      values
    );

    const [updated] = await pool.query(
      "SELECT * FROM service_single WHERE id = ?",
      [id]
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Service content updated successfully",
        updated[0]
      )
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Failed to update service content", error.message)
    );
  }
});






// GET ALL ITEMS WITH ICONS (FULL PAGE)

const getServiceItems = asyncHandler(async (req, res) => {
  try {
    const [items] = await pool.query(
      "SELECT * FROM service_items ORDER BY id DESC"
    );

    const [icons] = await pool.query(
      "SELECT * FROM service_item_icons"
    );

    const formatted = items.map(item => {
      return {
        ...item,
        icons: icons.filter(i => i.service_item_id === item.id)
      };
    });

    res.status(200).json(
      new ApiResponse(true, "Fetched successfully", formatted)
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Fetch failed", error.message)
    );
  }
});



// CREATE ITEM (WITH ICON ARRAY)

const createServiceItem = asyncHandler(async (req, res) => {
  try {
    const {
      slogan,
      title,
      paragraph,
      imageTitle,
      imagePara,
      icons
    } = req.body;

    let image = null;

    if (req.file) {
  image = `service/${req.file.filename}`;
}

    const [result] = await pool.query(
      `INSERT INTO service_items 
      (slogan, title, paragraph, imageTitle, imagePara, image)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [slogan, title, paragraph, imageTitle, imagePara, image]
    );

    const itemId = result.insertId;

    // insert icons (bulk)
    if (icons && Array.isArray(JSON.parse(icons))) {
      const parsedIcons = JSON.parse(icons);

      for (let icon of parsedIcons) {
        await pool.query(
          `INSERT INTO service_item_icons 
          (service_item_id, icon, text)
          VALUES (?, ?, ?)`,
          [itemId, icon.icon, icon.text]
        );
      }
    }

    res.status(201).json(
      new ApiResponse(true, "Created successfully", { id: itemId })
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Create failed", error.message)
    );
  }
});



// UPDATE ITEM (REPLACE FULL ITEM)
const updateServiceItem = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const {
      slogan,
      title,
      paragraph,
      imageTitle,
      imagePara,
      icons
    } = req.body;

    let image;

   if (req.file) {
  image = `uploads/service/${req.file.filename}`;
}
    const fields = [];
    const values = [];

    if (slogan !== undefined) {
      fields.push("slogan=?");
      values.push(slogan);
    }

    if (title !== undefined) {
      fields.push("title=?");
      values.push(title);
    }

    if (paragraph !== undefined) {
      fields.push("paragraph=?");
      values.push(paragraph);
    }

    if (imageTitle !== undefined) {
      fields.push("imageTitle=?");
      values.push(imageTitle);
    }

    if (imagePara !== undefined) {
      fields.push("imagePara=?");
      values.push(imagePara);
    }

    if (image) {
      fields.push("image=?");
      values.push(image);
    }

    if (fields.length) {
      values.push(id);
      await pool.query(
        `UPDATE service_items SET ${fields.join(", ")} WHERE id=?`,
        values
      );
    }

    // replace icons completely
    if (icons) {
      await pool.query(
        "DELETE FROM service_item_icons WHERE service_item_id=?",
        [id]
      );

      const parsedIcons = JSON.parse(icons);

      for (let icon of parsedIcons) {
        await pool.query(
          `INSERT INTO service_item_icons 
          (service_item_id, icon, text)
          VALUES (?, ?, ?)`,
          [id, icon.icon, icon.text]
        );
      }
    }

    res.status(200).json(
      new ApiResponse(true, "Updated successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Update failed", error.message)
    );
  }
});



// DELETE ITEM (CASCADE ICONS)
const deleteServiceItem = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM service_items WHERE id=?",
      [id]
    );

    // icons auto deleted if FK ON DELETE CASCADE

    res.status(200).json(
      new ApiResponse(true, "Deleted successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Delete failed", error.message)
    );
  }
});



// ADD SINGLE ICON (optional)
const addIcon = asyncHandler(async (req, res) => {
  try {
    const { service_item_id, icon, text } = req.body;

    await pool.query(
      `INSERT INTO service_item_icons 
      (service_item_id, icon, text)
      VALUES (?, ?, ?)`,
      [service_item_id, icon, text]
    );

    res.status(201).json(
      new ApiResponse(true, "Icon added")
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Icon add failed", error.message)
    );
  }
});



// DELETE ICON
const deleteIcon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM service_item_icons WHERE id=?",
      [id]
    );

    res.status(200).json(
      new ApiResponse(true, "Icon deleted")
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Delete icon failed", error.message)
    );
  }
});

// ==========================
// GET ALL BOXES
// ==========================
const getServiceDetailBox = asyncHandler(async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM service_detail_box ORDER BY shortOrder ASC"
    );

    res.status(200).json(
      new ApiResponse(true, "Fetched successfully", rows)
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Failed to fetch data", error.message)
    );
  }
});


// ==========================
// CREATE BOX
// ==========================
const createServiceDetailBox = asyncHandler(async (req, res) => {
  try {
    const { icon, paragraph, shortOrder } = req.body;

    if (!icon || !paragraph) {
      return res.status(400).json(
        new ApiError(false, "icon and paragraph are required")
      );
    }

    const [result] = await pool.query(
      `INSERT INTO service_detail_box (icon, paragraph, shortOrder)
       VALUES (?, ?, ?)`,
      [icon, paragraph, shortOrder || 0]
    );

    res.status(201).json(
      new ApiResponse(true, "Created successfully", {
        id: result.insertId
      })
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Create failed", error.message)
    );
  }
});


// ==========================
// UPDATE PARTICULAR BOX
// ==========================
const updateServiceDetailBox = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, paragraph, shortOrder } = req.body;

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

    if (shortOrder !== undefined) {
      fields.push("shortOrder=?");
      values.push(shortOrder);
    }

    if (!fields.length) {
      return res.status(400).json(
        new ApiError(false, "No data to update")
      );
    }

    values.push(id);

    await pool.query(
      `UPDATE service_detail_box SET ${fields.join(", ")} WHERE id=?`,
      values
    );

    res.status(200).json(
      new ApiResponse(true, "Updated successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Update failed", error.message)
    );
  }
});


// ==========================
// DELETE PARTICULAR BOX
// ==========================
const deleteServiceDetailBox = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM service_detail_box WHERE id=?",
      [id]
    );

    res.status(200).json(
      new ApiResponse(true, "Deleted successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiError(false, "Delete failed", error.message)
    );
  }
});





module.exports = {
  getServiceSingle,
  updateServiceSingle,

    getServiceItems,
  createServiceItem,
  updateServiceItem,
  deleteServiceItem,

  addIcon,
  deleteIcon,

  getServiceDetailBox,
  createServiceDetailBox,
  updateServiceDetailBox,
  deleteServiceDetailBox
};