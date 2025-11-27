const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    const dbName = mongoose.connection.db.databaseName;
    console.log(`MongoDB connected to database: ${dbName}`);
    console.log(`MongoDB URI: ${process.env.MONGO_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};

module.exports = connectDB;
