# FancyStore MERN Application

FancyStore is a full MERN stack based **Inventory, Sales, Purchase & Vendor Management System** with authentication, dashboards, charts, PDF generation, and notifications.

This project includes:
- ✅ User Backend (Node + Express + MongoDB)
- ✅ User Frontend (React + Redux Toolkit + Vite)

---

# 🚀 Features

## ✅ Backend (Node.js + Express)
- JWT Authentication  
- OTP Email Verification (Nodemailer)
- Role-Based Access Control (RBAC)
- Inventory CRUD operations  
- Sales & Purchase module  
- Vendor management  
- Automatic PDF invoice generation (pdfkit)
- Supabase integration  
- Twilio SMS sending  
- Cron jobs (node-cron)
- File uploads (multer)

---

## ✅ Frontend (React + Vite)
- Login / Signup / Forget Password
- Protected Routes
- Dashboard with charts
- Inventory pages
- Vendor pages
- Sales & Purchase screens
- Redux Toolkit State Management
- Axios API Integration
- TailwindCSS UI

---

# 📁 Folder Structure
/user-backend
├── controllers
├── models
├── routes
├── middlewares
├── utils
├── index.js
/user-frontend
├── src/components
├── src/pages
├── src/redux
├── src/services
├── src/routes
├── App.jsx

---

# ⚙️ Backend Setup

## 1️⃣ Go to backend folder
```bash
cd user-backend

2️⃣ Install dependencies
Shellnpm installShow more lines
3️⃣ Create .env file
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
EMAIL_USER=youremail@example.com
EMAIL_PASS=yourpassword
SUPABASE_URL=...
SUPABASE_KEY=...

4️⃣ Start backend
Shellnpm run devShow more lines

🖥️ Frontend Setup
1️⃣ Go to frontend folder
Shellcd user-frontendShow more lines
2️⃣ Install dependencies
Shellnpm installShow more lines
3️⃣ Run development server
Shellnpm run devShow more lines

🔗 APIs & URLS


ServiceURLBackendhttp://localhost:5000Frontendhttp://localhost:5173

📦 Backend Packages Used
✅ From your package.json

express
mongoose
jsonwebtoken
bcryptjs
multer
cookie-parser
cors
dotenv
supabase-js
nodemailer
pdfkit
twilio
node-cron
mongoose-sequence


✅ Developer
Muhammad Noman Rehan
MERN Stack Intern — Systems Limited

✅ License
This project is for learning and development use.