const ApiErrors = require("../utils/ApiErrors");
const { pool } = require("../db/db")
const bcrypt = require('bcrypt');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require("../utils/asyncHandler");


// get all user data
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users")
        res.status(200).json(new ApiResponse(true, "Users data fetched successfully", rows))
    } catch (error) {
        res.status(500).json(new ApiErrors(false, "Failed to fetch users data", error.message))
    }
})
// get user by id 
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json(new ApiErrors(false, "User not found"));
    }

    const { password, refresh_token, ...safeUser } = rows[0];

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "User data fetched successfully",
          safeUser
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrors(
          false,
          "Failed to fetch user data",
          error.message
        )
      );
  }
});

module.exports = {
    getAllUsers,
    getUserById
}

