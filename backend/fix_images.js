import mongoose from 'mongoose';
import 'dotenv/config';
import doctorModel from './models/doctorModel.js';
import connectDB from './config/db.js';

const doctorImages = {
  'emily@medsync.com': 'https://images.unsplash.com/photo-1594824436998-d50d6ff71c3c?q=80&w=600&auto=format&fit=crop', // This might have been broken, let's use a new one:
  'emily2': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop', // wait, sarah uses this. Let's find distinct ones.
};

const fixedImages = {
  'emily@medsync.com': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop', // Wait, chris uses this.
  // Let's just use reliable ones
  'emily@medsync.com': 'https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?q=80&w=600&auto=format&fit=crop',
  'amanda@medsync.com': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop' // wait, this was amanda, but it's a chair.
}

const finalFix = {
  'emily@medsync.com': 'https://images.unsplash.com/photo-1527613426406-b118b678c1b5?q=80&w=600&auto=format&fit=crop',
  'amanda@medsync.com': 'https://plus.unsplash.com/premium_photo-1681996484614-6af3ad046bb1?q=80&w=600&auto=format&fit=crop'
}

const updateDoctorImages = async () => {
  await connectDB();
  for (const [email, image] of Object.entries(finalFix)) {
    const doctor = await doctorModel.findOne({ email });
    if (doctor) {
      doctor.image = image;
      await doctor.save();
      console.log(`Updated image for ${doctor.name}`);
    }
  }
  process.exit();
};

updateDoctorImages();
