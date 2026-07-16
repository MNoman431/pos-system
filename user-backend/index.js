import "dotenv/config";
// import "./cron/emailRetry.js";
import mongoose from "mongoose";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// On a warm serverless invocation, mongoose.connection is already open from a
// previous request in the same container — skip reconnecting in that case.
const ensureDB = () => {
  if (mongoose.connection.readyState === 0) {
    return connectDB();
  }
  return Promise.resolve();
};

if (process.env.VERCEL) {
  // Serverless: Vercel calls the default-exported `app` directly per request,
  // there is no long-running process to app.listen() on. Kick the connection
  // off eagerly; mongoose buffers queries until it's ready.
  ensureDB().catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
} else {
  // Local dev: connect first, then start listening like before.
  async function start() {
    try {
      await ensureDB();
      app.listen(PORT, () => {
        console.log(`Server chal rha hain http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error("server nahi chl rha hai", err);
      process.exit(1);
    }
  }

  start();
}

export default app;