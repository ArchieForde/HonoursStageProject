import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/register
export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password are required." });

  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters." });

  try {
    const existing = await User.findOne({ username });
    if (existing)
      return res.status(409).json({ message: "Username already taken." });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, password: hashedPassword });

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, wishlist: user.wishlist },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password are required." });

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, wishlist: user.wishlist },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// PUT /api/auth/wishlist  (protected)
export const updateWishlist = async (req, res) => {
  const { wishlist } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { wishlist },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};
