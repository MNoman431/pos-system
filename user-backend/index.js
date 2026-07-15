import "dotenv/config";
// import "./cron/emailRetry.js";
import app from "./app.js";


import {connectDB} from "./config/db.js"
const PORT = process.env.PORT || 5000;
async function start() {
  try {
    await connectDB(); 
    app.listen(PORT, () => {
      console.log(`Server chal rha hain http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("server nahi chl rha hai", err);
    process.exit(1);
  }
}

start();

// import "dotenv/config";
// import app from "./app.js";
// import { connectDB } from "./config/db.js";

// await connectDB();

// export default app;