# MedSync - Doctor Appointment Booking Platform

MedSync is a complete, full-stack appointment booking system featuring a dedicated Admin Panel, Doctor Panel, and a Client Booking interface. It includes robust features like real-time doctor availability management, Stripe payment processing, user complaint ticketing, and a direct messaging system.

## 🚀 Features
- **Client App**: Browse doctors, book appointments, pay via Stripe, send support tickets, and direct-message doctors.
- **Doctor Panel**: Manage daily appointments, update profile/availability, and chat with clients who have paid for bookings.
- **Admin Dashboard**: Comprehensive management of all doctors and appointments, resolve support tickets, edit doctor profiles via a dedicated hub, and direct-message doctors.

## 💻 Tech Stack
- **Frontend**: React (Vite), TailwindCSS, React Router, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Services**: Cloudinary (Image Hosting), Stripe (Payments), JWT (Authentication)

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account (or local MongoDB)
- Cloudinary Account (for image storage)
- Stripe Account (for payments)

### 2. Install Dependencies
This is a mono-repo. You need to install dependencies for both the frontend and backend.
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables
You need to configure your `.env` files before running the apps.

**Backend**:
1. Navigate to the `backend` folder.
2. Copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in your actual API keys and secrets inside `backend/.env`.

**Frontend**:
1. Navigate to the `frontend` folder.
2. Copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```

### 4. Run the Application
Open two separate terminal windows.

**Terminal 1 (Backend)**:
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```

---

## 🚀 Deployment Guide

### Deploying the Backend (Recommended: Render)
1. Push this repository to GitHub.
2. Create a new "Web Service" on [Render.com](https://render.com).
3. Connect your GitHub repository.
4. Set the **Root Directory** to `backend`.
5. Set the **Build Command** to `npm install`.
6. Set the **Start Command** to `npm start`.
7. Add all the environment variables from your `backend/.env` file into the Render dashboard.
8. Click Deploy.

### Deploying the Frontend (Recommended: Vercel)
1. Go to [Vercel.com](https://vercel.com) and click "Add New Project".
2. Import this GitHub repository.
3. Set the **Framework Preset** to `Vite`.
4. Set the **Root Directory** to `frontend`.
5. In the Environment Variables section, add `VITE_BACKEND_URL` and set its value to your newly deployed Render backend URL (e.g., `https://medsync-api.onrender.com`).
6. Click Deploy.

*(Note: The `vercel.json` file is already included in the `frontend` folder to automatically handle React Router rewrites).*
