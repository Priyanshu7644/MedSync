<div align="center">
  <h1 align="center">MedSync</h1>
  <p align="center">
    <strong>A Comprehensive Full-Stack Healthcare Appointment Booking Platform</strong>
  </p>
</div>

<br />

## 🏥 Overview
MedSync is a modern, responsive, and robust full-stack web application designed to bridge the gap between patients, healthcare providers, and administrative staff. It streamlines the entire medical appointment lifecycle, from discovering doctors to booking slots, processing payments, and facilitating post-appointment communication.

This project was built to demonstrate proficiency in creating complex, real-world business solutions using modern web technologies, secure authentication, and third-party API integrations.

## ✨ Key Features

### 👨‍⚕️ For Patients (Client Interface)
- **Advanced Filtering**: Browse and search for doctors by name or medical specialty.
- **Seamless Booking**: Real-time availability checking and slot booking system.
- **Secure Payments**: Integrated with **Stripe** to handle appointment payments safely.
- **Direct Messaging**: Built-in chat system allowing patients to securely message doctors (access strictly gated to patients with confirmed, paid appointments).
- **Support Ticketing**: Dedicated helpdesk system for users to submit complaints or queries.

### 🩺 For Doctors (Doctor Panel)
- **Appointment Management**: View daily schedules, complete consultations, or cancel appointments.
- **Profile & Availability**: Real-time toggles to mark themselves as available or unavailable.
- **Patient Inbox**: A dedicated messaging hub to reply to patient queries and follow up on consultations.

### 🛡️ For Administrators (Admin Dashboard)
- **Centralized Hub**: A powerful grid dashboard to oversee all registered doctors on the platform.
- **Deep Editing**: Flyout editing panels to instantly update doctor credentials, fees, and statuses.
- **Global Messaging**: Admins can directly message any doctor on the platform.
- **Ticketing Resolution**: An interface to view and resolve incoming user complaints.

---

## 💻 Tech Stack & Architecture

- **Frontend Environment**: React.js (Vite), TailwindCSS, React Router DOM, Context API for state management.
- **Backend Environment**: Node.js, Express.js RESTful API architecture.
- **Database**: MongoDB (Mongoose ORM) for scalable document storage.
- **Authentication & Sessions**: Secure JWT (JSON Web Tokens) implementation coupled with `localStorage` for persistent, stateless user sessions across Role-Based Access Control (RBAC) layers (User, Doctor, Admin).
- **Storage**: Cloudinary integration for handling profile picture uploads and storage.
- **Payments**: Stripe API integration for handling secure checkout sessions.

---

## ⚙️ Security & Best Practices
- **Stateless Authentication**: Utilizes encrypted JWTs stored securely in the browser's `localStorage` to maintain sessions without server-side overhead.
- **Protected Routing**: Robust Express middleware architecture validating JWTs before granting access to sensitive API endpoints.
- **Environment Protection**: Strict environment variable management for all API keys, database URIs, and JWT secrets.
- **Data Validation & Concurrency**: Multi-layered defense strategy with atomic check-and-set and database constraints preventing double bookings.
- **Architecture**: Adherence to REST principles and scalable folder structure (Controllers, Models, Routes, Middlewares).

---

## 🚀 Deployment & Hosting Guide

### 1. Backend Deployment (Render / Railway)
1. **Create Web Service**: Connect your GitHub repository to [Render](https://render.com).
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Random 32+ character string
   - `ADMIN_EMAIL`: `admin@medsync.com`
   - `ADMIN_PASSWORD`: Your admin password
   - `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`: Cloudinary credentials
   - `STRIPE_SECRET_KEY`: Stripe API key
   - `CURRENCY`: `usd`
   - `SERVER_URL`: (Optional) Your backend URL (e.g. `https://medsync-api.onrender.com`). Render provides `RENDER_EXTERNAL_URL` automatically.

> ⚡ **Anti-Sleep / Keep-Alive Feature**: Render free tier instances spin down after 15 minutes of inactivity. MedSync backend includes an automated self-pinging heartbeat at `/api/health` every 10 minutes to keep the server warm and response times sub-second!

---

### 2. Frontend Deployment (Vercel / Render Static / Netlify)
1. **Create Project**: Connect repository to [Vercel](https://vercel.com).
2. **Root Directory**: `frontend`
3. **Framework Preset**: `Vite`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variable**:
   - `VITE_BACKEND_URL`: Your deployed backend URL (e.g. `https://medsync-api.onrender.com`)

SPA rewrites are pre-configured in `frontend/vercel.json` and `frontend/public/_redirects` to ensure deep routes (`/admin/messages`, `/doctors/:speciality`, `/appointment/:docId`) never 404 on page refresh.
