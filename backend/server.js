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

// Health check endpoint
const healthHandler = (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString()
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

app.get('/', (req, res) => {
  res.json({ 
    name: "MedSync Backend API",
    status: "active"
  });
});

// Start Server
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

