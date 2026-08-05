import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import doctorModel from './models/doctorModel.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const doctors = [
            {
                name: 'Dr. Emily Larson',
                email: 'emily@medsync.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                speciality: 'Gynecologist',
                degree: 'MBBS',
                experience: '3 Years',
                about: 'Dr. Emily has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
                fees: 60,
                address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' },
                date: Date.now()
            },
            {
                name: 'Dr. Sarah Patel',
                email: 'sarah@medsync.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/women/46.jpg',
                speciality: 'Dermatologist',
                degree: 'MBBS',
                experience: '1 Years',
                about: 'Dr. Sarah has a strong commitment to delivering comprehensive medical care.',
                fees: 30,
                address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
                date: Date.now()
            },
            {
                name: 'Dr. Christopher Lee',
                email: 'chris@medsync.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/men/47.jpg',
                speciality: 'Pediatricians',
                degree: 'MBBS',
                experience: '2 Years',
                about: 'Dr. Christopher has a strong commitment to delivering comprehensive medical care.',
                fees: 40,
                address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' },
                date: Date.now()
            },
            {
                name: 'Dr. Michael Chen',
                email: 'michael@medsync.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/men/48.jpg',
                speciality: 'Neurologist',
                degree: 'MBBS',
                experience: '5 Years',
                about: 'Dr. Michael focuses on comprehensive care for the nervous system.',
                fees: 80,
                address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
                date: Date.now()
            },
            {
                name: 'Dr. Amanda Smith',
                email: 'amanda@medsync.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/women/50.jpg',
                speciality: 'Gastroenterologist',
                degree: 'MBBS',
                experience: '4 Years',
                about: 'Dr. Amanda treats issues in the gastrointestinal tract and liver.',
                fees: 70,
                address: { line1: '67th Cross, Richmond', line2: 'Circle, Ring Road, London' },
                date: Date.now()
            }
        ];

        for (const doc of doctors) {
            const exists = await doctorModel.findOne({ email: doc.email });
            if (!exists) {
                const newDoctor = new doctorModel(doc);
                await newDoctor.save();
                console.log(`Created ${doc.name}`);
            }
        }
        
        console.log("Doctors seeded successfully!");
        process.exit();
    } catch (error) {
        console.log("Error:", error);
        process.exit(1);
    }
}

seedDoctors();
