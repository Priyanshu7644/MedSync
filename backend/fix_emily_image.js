import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const emilyFilePath = 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/a1a556a3-7ba8-40ec-9f73-1d8151aebfd9/dr_emily_1787586038307.jpg';

async function fixEmily() {
  console.log("Uploading Dr. Emily Larson image to Cloudinary...");
  const res = await cloudinary.uploader.upload(emilyFilePath, {
    folder: 'medsync_doctors',
    public_id: 'dr_emily_larson',
    overwrite: true
  });
  console.log("Uploaded successfully:", res.secure_url);

  for (const uri of [process.env.MONGODB_URI, 'mongodb://127.0.0.1:27017/medsync']) {
    try {
      console.log(`Updating in ${uri.substring(0, 30)}...`);
      const conn = await mongoose.createConnection(uri).asPromise();
      const coll = conn.db.collection('doctors');
      
      const updateRes = await coll.updateOne(
        { email: 'emily@medsync.com' },
        { $set: { image: res.secure_url } }
      );
      console.log(`  Updated Dr. Emily Larson in ${uri.substring(0, 30)} (Matched: ${updateRes.matchedCount})`);
      await conn.close();
    } catch (err) {
      console.log(`  Error for ${uri}:`, err.message);
    }
  }
  console.log("Fixed Dr. Emily Larson's image!");
  process.exit(0);
}

fixEmily().catch(err => {
  console.error("Error fixing Emily image:", err);
  process.exit(1);
});
