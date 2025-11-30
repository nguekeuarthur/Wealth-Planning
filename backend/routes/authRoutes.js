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

router.post("/upload-image", (req, res) => {
  console.log("📤 Upload request received");
  
  upload.single("image")(req, res, (err) => {
    try {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        console.error("❌ Multer error:", err);
        return res.status(400).json({ 
          message: "File upload error", 
          error: err.message 
        });
      } else if (err) {
        console.error("❌ Upload error:", err);
        return res.status(400).json({ 
          message: err.message || "Error uploading file",
          error: err.message 
        });
      }

      // Check if file was uploaded
      if (!req.file) {
        console.log("⚠️ No file in request");
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("✅ File uploaded:", req.file.filename);
      
      // Return the file URL
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      console.log("🔗 Image URL:", imageUrl);
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
});

module.exports = router;
