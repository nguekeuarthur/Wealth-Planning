const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        console.log(`[AUTH] ${req.method} ${req.originalUrl} - Token present: ${!!token}`);

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1]; // Extract token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                console.log(`[AUTH] User ${decoded.id} not found`);
                return res.status(401).json({ message: "Utilisateur introuvable" });
            }

            console.log(`[AUTH] User authenticated: ${user._id} (${user.role})`);
            req.user = user;
            next();
        } else {
            console.log(`[AUTH] No token provided`);
            res.status(401).json({ message: "Not authorized, no token" });
        }
    } catch (error) {
        console.log(`[AUTH] Token verification failed:`, error.message);
        res.status(401).json({ message: "Token failed", error: error.message });
    }
};

// Middleware for Admin-only access
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied, admin only" });
    }
};

module.exports = { protect, adminOnly };
