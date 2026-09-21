import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_DOC_IMG = 'https://res.cloudinary.com/ogxk13pp/image/upload/v1790023936/medsync_doctors/default_doc.jpg';

const doctorImages = {
  'richard@medsync.com': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
  'emily@medsync.com': 'https://images.unsplash.com/photo-1594824813637-44f2b1d3d623?q=80&w=800&auto=format&fit=crop',
  'sarah@medsync.com': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
  'chris@medsync.com': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
  'michael@medsync.com': 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=800&auto=format&fit=crop',
  'amanda@medsync.com': 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=800&auto=format&fit=crop',
  
  // Indian doctors who had the default doctor avatar before
  'arun@medsync.com': DEFAULT_DOC_IMG,
  'priya@medsync.com': DEFAULT_DOC_IMG,
  'amit@medsync.com': DEFAULT_DOC_IMG,
  'jaspreet@medsync.com': DEFAULT_DOC_IMG,
};

async function setDoctorImages() {
  for (const uri of [process.env.MONGODB_URI, 'mongodb://127.0.0.1:27017/medsync']) {
    try {
      console.log(`Connecting to: ${uri.substring(0, 30)}...`);
      const conn = await mongoose.createConnection(uri).asPromise();
      const doctorsCollection = conn.db.collection('doctors');

      for (const [email, image] of Object.entries(doctorImages)) {
        await doctorsCollection.updateOne(
          { email },
          { $set: { image } }
        );
      }
      console.log(`  Updated all doctors in: ${uri.substring(0, 30)}`);
      await conn.close();
    } catch (e) {
      console.log(`  Skipping ${uri.substring(0, 30)}: ${e.message}`);
    }
  }

  console.log("\nAll doctor pictures have been updated!");
  process.exit(0);
}

setDoctorImages().catch(err => {
  console.error("Error setting images:", err);
  process.exit(1);
});
