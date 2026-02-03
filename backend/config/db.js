const mongoose = require("mongoose");

function safeMongoHost(uri) {
  // Best-effort parsing without leaking credentials.
  // URL parsing can fail if the password contains unescaped special chars, so we fall back.
  try {
    const u = new URL(uri);
    return u.host || u.hostname;
  } catch {
    // Remove protocol, then take the last "@" segment to avoid issues with "@" inside passwords.
    const withoutProto = uri.replace(/^mongodb(\+srv)?:\/\//, "");
    const afterAt = withoutProto.split("@").pop();
    return afterAt?.split("/")[0] || "<unknown>";
  }
}

const connectDB = async () => {
  try {
    // Use MONGODB_URI (preferred) or MONGO_URI (legacy) from environment variables
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("[DB] MONGODB_URI is not defined in environment variables");
      process.exit(1);
    }

    const host = safeMongoHost(mongoUri);
    console.log("[DB] Connecting to MongoDB host:", host);

    // Common Atlas pitfall: using `mongodb://` with a single *.mongodb.net hostname.
    // Atlas SRV connection strings should start with `mongodb+srv://`.
    if (
      host.includes("mongodb.net") &&
      mongoUri.startsWith("mongodb://") &&
      !mongoUri.startsWith("mongodb+srv://")
    ) {
      console.error(
        "[DB] Your MongoDB URI looks like an Atlas host, but the scheme is `mongodb://`. " +
          "For Atlas clusters you typically need `mongodb+srv://...`. " +
          "Update MONGODB_URI and try again."
      );
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      // Fail faster with a clear error instead of hanging for a long time
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    const dbName = mongoose.connection.db.databaseName;
    console.log(`[DB] MongoDB connected successfully to database: ${dbName}`);
  } catch (err) {
    console.error("[DB] Error connecting to MongoDB:", err.message);

    // ETIMEDOUT / ENOTFOUND / ECONNREFUSED are almost always networking/URI issues.
    const code = err?.code || err?.cause?.code;
    if (code) console.error("[DB] Error code:", code);

    if (code === "ETIMEDOUT") {
      console.error(
        "[DB] Connection timed out. If this is MongoDB Atlas, check: (1) Atlas Network Access IP allowlist, " +
          "(2) your local firewall/VPN/proxy allows outbound to MongoDB ports, and (3) your URI uses `mongodb+srv://`."
      );
    }

    if (err.reason) {
      console.error("[DB] Reason:", err.reason);
    }

    process.exit(1);
  }
};

module.exports = connectDB;
