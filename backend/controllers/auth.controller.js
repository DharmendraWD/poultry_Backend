const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/db');
const path = require('path');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';

const createAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '15m' }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '7d' }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await pool.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token missing' });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);

    if (!rows.length || rows[0].refresh_token !== token) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const user = rows[0];
    const accessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    await pool.query('UPDATE users SET refresh_token = ? WHERE id = ?', [newRefreshToken, user.id]);

    res.cookie('refreshToken', newRefreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'Strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000
  //     httpOnly: true,
  // secure: true,
  // sameSite: 'none',
  // maxAge: 7 * 24 * 60 * 60 * 1000

  // localhost 
    httpOnly: true,
   secure: process.env.NODE_ENV === 'production',
      sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true, accessToken });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: 'Refresh failed', error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      await pool.query('UPDATE users SET refresh_token = NULL WHERE id = ?', [decoded.id]);
    }

    res.clearCookie('refreshToken', {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'none'

        httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
      sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Logout failed', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, fullname, password, isAdmin, isSuperAdmin } = req.body;
    const profilePicture = req.file ? req.file.filename : null;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (username, email, fullname, password, isAdmin, isSuperAdmin, profileImag) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, email, fullname, hashedPassword, isAdmin ? 1 : 0, isSuperAdmin ? 1 : 0, profilePicture]
    );

    return res.status(201).json({ success: true, message: 'User created', userId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Create user failed', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query('SELECT id, email, fullname, isAdmin, isSuperAdmin FROM users WHERE id = ?', [userId]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user data', error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // delete user
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    // also delete its image from server 
    const uploadFolderPath = path.join(__dirname, '..', 'uploads'+"/");
    const imagePath = uploadFolderPath+rows[0]?.profileImag; 
    if(imagePath){
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        } else {
          console.log('Image deleted successfully');
        }
      });
    }

    return res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Delete user failed', error: error.message });
  }
};

// change password 
exports.changePassword = async (req, res) => {
  try {
    const userId = req?.user?.id;
    // console.log(userId)
    const { currentPassword, newPassword } = req?.body;

    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Change password failed', error: error.message });
  }
};
