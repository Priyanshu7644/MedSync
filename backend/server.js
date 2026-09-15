import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import userRouter from './routes/userRoute.js';
import doctorRouter from './routes/doctorRoute.js';

// Load environment variables
dotenv.config();

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares for high-performance and cross-origin hosting
app.use(compression());
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// API Endpoints
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/doctor', doctorRouter);

// Health check & Keep-alive endpoint (for Render / uptime monitors)
const healthHandler = (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    message: 'MedSync API is running fast and active',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + 's'
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

app.get('/', (req, res) => {
  res.json({ 
    name: "MedSync Backend API",
    status: "active",
    docs: "Endpoints available at /api/user, /api/doctor, /api/admin",
    healthCheck: "/api/health"
  });
});

// Start Server
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);

  // Automated Keep-Alive Anti-Sleep Mechanism (for Render free tier)
  // Render free tier spins down after 15 minutes of inactivity.
  // This self-ping pings the server every 10 minutes to keep it permanently warm.
  const externalUrl = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL || process.env.API_URL;
  if (externalUrl) {
    console.log(`Keep-Alive enabled: Pinging ${externalUrl}/api/health every 10 minutes to prevent cold starts.`);
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes
    setInterval(async () => {
      try {
        const pingUrl = `${externalUrl.replace(/\/$/, '')}/api/health`;
        const res = await fetch(pingUrl);
        if (res.ok) {
          console.log(`[Keep-Alive] Heartbeat ping successful at ${new Date().toLocaleTimeString()}`);
        }
      } catch (err) {
        console.error(`[Keep-Alive] Ping error:`, err.message);
      }
    }, PING_INTERVAL);
  }
});

