// import mongoose from "mongoose";

// export async function connectDB() {
//   const uri = process.env.MONGO_URI;
//   const dbName = process.env.DB_NAME || "user_app";

//   if (!uri) {
//     console.warn("MONGO_URI not set in .env. Skipping DB connection.");
//     return;
//   }

//   try {
//     await mongoose.connect(uri, {
//       dbName,
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//       retryWrites: true,
//       w: "majority",
//     });

//     console.log("✅ MongoDB connected successfully");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);
//     process.exit(1);
//   }
// }

import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    // Don't process.exit() here — this file also runs inside Vercel's
    // serverless function, where exiting would kill the whole invocation
    // instead of letting the caller decide how to handle the failure.
    throw err;
  }
}
