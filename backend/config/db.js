const mongoose = require("mongoose");

// Optional: reduce how long Mongoose waits before failing server selection

const connectDB = async () => {
  try {
    // Use MONGODB_URI (preferred) or MONGO_URI (legacy) from environment variables
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("[DB] MONGODB_URI is not defined in environment variables");
      process.exit(1);
    }

    // Log only the host part to avoid displaying secrets
    const uriHost = mongoUri.split("@")[1]?.split("/")[0];
    console.log("[DB] Connecting to MongoDB host:", uriHost || "<unknown>");

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    
    const dbName = mongoose.connection.db.databaseName;
    console.log(`[DB] MongoDB connected successfully to database: ${dbName}`);
  } catch (err) {
    console.error("[DB] Error connecting to MongoDB:", err.message);
    if (err.reason) {
      console.error("[DB] Reason:", err.reason);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
