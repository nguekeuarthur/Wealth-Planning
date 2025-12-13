const express = require("express");
const multer = require("multer");
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const User = require("../models/User");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); // Register User
router.post("/login", loginUser); // Login User
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.get("/profile", protect, getUserProfile); // Get User Profile
router.put("/profile", protect, updateUserProfile); // Update Profile

router.post("/upload-image", upload.single("image"), protect, async (req, res) => {
  try {
    console.log("📤 Upload request received");

    // Check if file was uploaded
    if (!req.file) {
      console.log("⚠️ No file in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("✅ File uploaded:", req.file.filename);
    
    // Return the file URL
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    console.log("🔗 Image URL:", imageUrl);
    
    // Update user profile with new image URL
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImageUrl: imageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User profile updated with new image");
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("❌ Error in upload-image route:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      message: "Error uploading image", 
      error: error.message 
    });
  }
});

module.exports = router;
