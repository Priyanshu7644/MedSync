import mongoose from 'mongoose';
import doctorModel from './models/doctorModel.js';
import dotenv from 'dotenv';

dotenv.config();

const fixImage = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        await doctorModel.findOneAndUpdate(
            { email: 'richard@medsync.com' },
            { image: 'https://randomuser.me/api/portraits/men/44.jpg' }
        );
        
        console.log("Image fixed!");
        process.exit();
    } catch (error) {
        console.log("Error:", error);
        process.exit(1);
    }
}

fixImage();
