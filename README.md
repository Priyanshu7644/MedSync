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
- **Data Validation**: Custom logic to prevent unauthorized actions (e.g., verifying Stripe payment status before opening direct messaging channels).
- **Architecture**: Adherence to REST principles and scalable folder structure (Controllers, Models, Routes, Middlewares).
