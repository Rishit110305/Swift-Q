const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // hashing of the user's pass 
const jwt = require('jsonwebtoken'); // maintain n store the session 
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_swiftq_key_1234"; 

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'patient'
    });

    await newUser.save();

    res.json({ success: true, message: "Account created! Please login." });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// --- LOGIN ROUTE (Fixed to send User ID) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    // Create Token
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name }, 
      JWT_SECRET, 
      { expiresIn: '1h' } 
    );

    // ✅ SEND RESPONSE (Now includes user.id)
    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user._id, // This allows MyTickets to find your data
        name: user.name, 
        role: user.role 
      } 
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;