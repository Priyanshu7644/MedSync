# MedSync 🏥

A comprehensive, fully-responsive, and production-grade full-stack healthcare platform engineered to streamline the entire medical appointment lifecycle. MedSync connects patients, doctors, and administrators through a unified ecosystem, handling everything from real-time doctor discovery and automated slot booking to secure payment processing and encrypted post-consultation communication.

## ✨ Key Features

### 👨‍⚕️ For Patients (Client Interface)

* **Advanced Specialty Filtering:** Dynamic search and filter system enabling patients to find doctors effortlessly by name, department, or medical specialization.
* **Real-Time Slot Booking:** Interactive calendar and availability engine preventing double bookings and validating live schedules instantly.
* **Stripe Payment Gateway:** Fully integrated checkout flow handling secure, tokenized payments for appointment consultations.
* **Gated Direct Messaging:** Secure chat interface allowing patients to communicate directly with healthcare providers, strictly restricted to confirmed and paid appointments.
* **Helpdesk Support Ticketing:** Dedicated support portal allowing users to raise, track, and resolve grievances or system inquiries.

### 🩺 For Doctors (Doctor Panel)

* **Comprehensive Schedule Management:** Dedicated daily calendar view to review, accept, complete, or cancel patient appointments.
* **Dynamic Availability Toggles:** Real-time status switches allowing medical professionals to toggle their availability or active consulting hours on the fly.
* **Patient Communication Hub:** Centralized inbox for managing patient follow-ups, answering medical queries, and reviewing treatment logs.

### 🛡️ For Administrators (Admin Dashboard)

* **Centralized Doctor Oversight Hub:** High-density grid control panel to review, onboard, and audit all registered medical practitioners on the platform.
* **Instant Profile Editing:** Responsive flyout editing sheets allowing rapid updates to doctor credentials, consultation fees, and verification statuses.
* **Direct Broadcast Messaging:** Administrative tool to dispatch direct announcements or communications to any registered doctor on the network.
* **Ticketing Resolution Engine:** Back-office dashboard to triage, manage, and close support tickets submitted by users.

---

## 💻 Tech Stack & Architecture

* **Frontend Environment:** React.js powered by Vite, TailwindCSS for styling, React Router DOM for deep linking, and Context API for global state management.
* **Backend Infrastructure:** Node.js, Express.js implementing a modular RESTful API design pattern.
* **Database & ORM:** MongoDB utilizing Mongoose ODM for optimized, scalable document management and schema validation.
* **Authentication & Authorization:** Stateful/Stateless JSON Web Tokens (JWT) enforcing strict Role-Based Access Control (RBAC) layers separating User, Doctor, and Admin privileges.
* **Media & Cloud Storage:** Cloudinary integration for fast, secure image uploads and optimized profile picture management.
* **Payment Architecture:** Stripe API webhooks and checkout sessions for encrypted financial transactions.

---

## ⚙️ Security & Architecture Best Practices

* **Stateless Token Authentication:** Cryptographically signed JWTs stored securely to maintain authenticated sessions without traditional server-side session overhead.
* **Protected Middleware Routing:** Multi-tiered Express backend middleware validating token authenticity and roles before exposing sensitive endpoints.
* **Concurrency & Integrity Control:** Robust database-level constraints and atomic transaction logic preventing double-booking race conditions during high-traffic appointment windows.
* **Environment Safeguards:** Strict separation of environment secrets, database connection strings, and payment API keys using dotenv configuration management.
