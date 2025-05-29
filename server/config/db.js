// server/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Ensure dotenv is used if MONGO_URI is not directly in process.env by server.js

// Load .env variables if not already loaded by server.js (though it should be)
// This is a bit redundant if server.js already calls dotenv.config()
// but doesn't hurt for standalone script execution or testing.
if (!process.env.MONGO_URI) {
    dotenv.config({ path: '../.env' }); // Adjust path if .env is in server root relative to config
}


const connectDB = async () => {
  try {
    // Mongoose connection options (optional but recommended for newer versions)
    const mongooseOptions = {
      // useNewUrlParser: true, // No longer needed in Mongoose 6+
      // useUnifiedTopology: true, // No longer needed in Mongoose 6+
      // useCreateIndex: true, // Not supported in Mongoose 6+ (indexes are built automatically)
      // useFindAndModify: false, // Not supported in Mongoose 6+ (use findOneAndUpdate() instead)
      
      // For Mongoose 6+, these are generally handled by default or not needed.
      // However, you might see them in older tutorials.
      // If you encounter specific warnings, you might adjust options.
      // For now, we can often connect without explicit options if using Mongoose 6+.
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, mongooseOptions);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
