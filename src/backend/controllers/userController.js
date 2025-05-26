// userController.js

import User from '../model/User.js'; // Ensure this is using .js extension for ES modules
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const Signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("requestbody", req.body);
  try {
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, {
      httpOnly: true,  // Makes the cookie inaccessible to JavaScript
      sameSite: 'Lax',  // Helps prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000,  // Cookie expiration (30 days)
    });
    res.status(201).json({ _id: user._id, username: user.name, email: user.email });
  } catch (err) {
    console.log('err', err);
    res.status(400).json({ message: 'User registration failed' });
  }
};
const logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: true }); // Clear the cookie
  res.json({ message: 'Logged out successfully' });
};
const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
console.log('user----------', await user.matchPassword(password))
    // Check if the user exists and the password is correct
    if (user && (await user.matchPassword(password))) {
      console.log('user', user);

      // Generate the JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      // Set the token in an HttpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,  // Makes the cookie inaccessible to JavaScript
        sameSite: 'Lax',  // Helps prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000,  // Cookie expiration (30 days)
      });

      // Respond with user data (excluding password) and success
      res.json({
        _id: user._id,
        name: user.username,
        email: user.email,
        success:true
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { oldPassword, newPassword, newUsername } = req.body;

    // You should ideally get user info from session/JWT
    const userId = req.user._id; // Make sure middleware sets this

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Verify old password
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect old password." });
    }

    // Update username if provided
    if (newUsername && newUsername !== user.username) {
      user.username = newUsername;
    }

    // Update password if provided
    if (newPassword) {
      user.password = newPassword;
    }

    await user.save();
    return res.json({ success: true, message: "Profile updated successfully." });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
const getMe = async (req, res) => {
  res.json(req.user);
};

// Use `export` instead of `module.exports`
export { Signup, Login, getMe, updateProfile, logout };
