import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// A clean neutral medical avatar placeholder (SVG data URL / Cloudinary hosted)
const filePath = 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/a1a556a3-7ba8-40ec-9f73-1d8151aebfd9/default_doctor_avatar_1787586480879.jpg';

async function uploadAndSet() {
  try {
    console.log("Uploading generic faceless doctor avatar to Cloudinary...");
    const res = await cloudinary.uploader.upload(filePath, {
      folder: 'medsync_doctors',
      public_id: 'default_faceless_doctor',
      overwrite: true
    });
    console.log("Uploaded successfully:", res.secure_url);

    const defaultImg = res.secure_url;

    for (const uri of [process.env.MONGODB_URI, 'mongodb://127.0.0.1:27017/medsync']) {
      try {
        console.log(`Updating in ${uri.substring(0, 30)}...`);
        const conn = await mongoose.createConnection(uri).asPromise();
        const coll = conn.db.collection('doctors');
        
        const updateRes = await coll.updateMany(
          { email: { $in: ['arun@medsync.com', 'priya@medsync.com', 'amit@medsync.com', 'jaspreet@medsync.com'] } },
          { $set: { image: defaultImg } }
        );
        console.log(`  Updated ${updateRes.modifiedCount} doctors to default placeholder.`);
        await conn.close();
      } catch (err) {
        console.log(`  Failed for ${uri}:`, err.message);
      }
    }
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Upload failed:", err);
    process.exit(1);
  }
}

uploadAndSet();
