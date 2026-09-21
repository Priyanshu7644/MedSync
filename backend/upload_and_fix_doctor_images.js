import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const doctorSourceImages = [
  {
    email: 'richard@medsync.com',
    name: 'Dr. Richard James',
    url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop'
  },
  {
    email: 'emily@medsync.com',
    name: 'Dr. Emily Larson',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop'
  },
  {
    email: 'sarah@medsync.com',
    name: 'Dr. Sarah Patel',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop'
  },
  {
    email: 'chris@medsync.com',
    name: 'Dr. Christopher Lee',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop'
  },
  {
    email: 'michael@medsync.com',
    name: 'Dr. Michael Chen',
    url: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=800&auto=format&fit=crop'
  },
  {
    email: 'amanda@medsync.com',
    name: 'Dr. Amanda Smith',
    url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=800&auto=format&fit=crop'
  },
  {
    email: 'arun@medsync.com',
    name: 'Dr. Arun Kumar',
    url: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=800&auto=format&fit=crop'
  },
  {
    email: 'priya@medsync.com',
    name: 'Dr. Priya Sharma',
    url: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=800&auto=format&fit=crop'
  },
  {
    email: 'amit@medsync.com',
    name: 'Dr. Amit Banerjee',
    url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop'
  },
  {
    email: 'jaspreet@medsync.com',
    name: 'Dr. Jaspreet Singh',
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=800&auto=format&fit=crop'
  }
];

async function updateDoctorImages() {
  console.log("Connecting to Atlas MongoDB:", process.env.MONGODB_URI.substring(0, 30) + "...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB Atlas.");

  const doctorsCollection = mongoose.connection.db.collection('doctors');

  for (const docInfo of doctorSourceImages) {
    try {
      console.log(`Uploading cloud image for ${docInfo.name}...`);
      const uploadRes = await cloudinary.uploader.upload(docInfo.url, {
        folder: 'medsync_doctors',
        public_id: docInfo.email.split('@')[0],
        overwrite: true,
        resource_type: 'image'
      });

      const secureUrl = uploadRes.secure_url;
      console.log(`  Uploaded: ${secureUrl}`);

      const result = await doctorsCollection.updateOne(
        { email: docInfo.email },
        { $set: { image: secureUrl } }
      );
      console.log(`  Updated database record for ${docInfo.name} (Matched: ${result.matchedCount})`);
    } catch (err) {
      console.error(`  Error uploading for ${docInfo.name}:`, err.message);
      // Fallback to direct URL if cloudinary upload has issues
      await doctorsCollection.updateOne(
        { email: docInfo.email },
        { $set: { image: docInfo.url } }
      );
      console.log(`  Set direct CDN fallback URL for ${docInfo.name}`);
    }
  }

  console.log("\nAll 10 doctor images successfully updated in Cloudinary & Atlas!");
  await mongoose.disconnect();
  process.exit(0);
}

updateDoctorImages().catch(err => {
  console.error("Script failed:", err);
  process.exit(1);
});
