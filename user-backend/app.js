
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js"; 
import inventoryRouter from "./routes/inventory.route.js";
import purchaseRouter from "./routes/purchase.route.js";
import vendorRouter from "./routes/vendor.route.js";
import salesRouter from "./routes/sales.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import roleRouter from "./routes/role.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";


const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//  MAKE PDF FOLDER PUBLIC
// app.use("/invoices", express.static("uploads/invoices"));
app.use("/api/auth", userRouter);
app.use("/api/inventory", inventoryRouter); // inventory routes
app.use("/api/vendors", vendorRouter);  
app.use("/api/purchase", purchaseRouter); // purchase routes
app.use("/api/sales", salesRouter); // sales routes
app.use("/api/dashboard", dashboardRouter); // dashboard routes
app.use("/api/roles", roleRouter);

app.use(errorHandler);

export default app;

