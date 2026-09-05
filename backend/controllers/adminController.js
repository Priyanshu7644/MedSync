import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import complaintModel from '../models/complaintModel.js';
import messageModel from '../models/messageModel.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // Checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to local storage or use default
        let imageUrl = '';
        if (imageFile) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`;
        } else {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/default_doctor.jpg`;
        }

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address), // Parse address from form-data
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Doctor Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for getting all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all appointments list for admin panel
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for admin to cancel appointment (Atomic Slot Release)
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        
        if (!appointmentData) {
             return res.json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment already cancelled' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
        
        // Atomic release of doctor slot
        const { docId, slotDate, slotTime } = appointmentData;
        const slotField = `slots_booked.${slotDate}`;
        await doctorModel.findByIdAndUpdate(docId, {
            $pull: { [slotField]: slotTime }
        });
        
        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all complaints for admin
const allComplaintsAdmin = async (req, res) => {
    try {
        const complaints = await complaintModel.find({});
        res.json({ success: true, complaints });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to resolve a complaint
const resolveComplaint = async (req, res) => {
    try {
        const { complaintId } = req.body;
        await complaintModel.findByIdAndUpdate(complaintId, { status: 'Resolved' });
        res.json({ success: true, message: 'Complaint Resolved' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for admin to update doctor profile
const updateDoctorProfileAdmin = async (req, res) => {
    try {
        const { docId, name, fees, address, about, speciality, available, degree, experience } = req.body;
        await doctorModel.findByIdAndUpdate(docId, { name, fees, address, about, speciality, available, degree, experience });
        res.json({ success: true, message: 'Doctor Profile Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for admin to send message to a doctor
const adminSendMessage = async (req, res) => {
    try {
        const { docId, text } = req.body;

        let attachmentUrl = "";
        if (req.file) {
            attachmentUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const newMessage = new messageModel({
            senderId: 'admin',
            receiverId: docId,
            text: text || "",
            attachment: attachmentUrl,
            date: Date.now(),
            seen: false,
            seenAt: 0
        });
        await newMessage.save();
        res.json({ success: true, message: 'Message sent', messageData: newMessage });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for admin to get messages with a doctor
const adminGetMessages = async (req, res) => {
    try {
        const { docId } = req.body;
        const messages = await messageModel.find({
            $or: [
                { senderId: 'admin', receiverId: docId },
                { senderId: docId, receiverId: 'admin' }
            ]
        }).sort({ date: 1 });
        res.json({ success: true, messages });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for admin to get ALL messages
const adminGetAllMessages = async (req, res) => {
    try {
        const messages = await messageModel.find({
            $or: [
                { senderId: 'admin' },
                { receiverId: 'admin' }
            ]
        }).sort({ date: 1 });
        res.json({ success: true, messages });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for admin to mark messages from a contact as seen
const adminMarkMessagesSeen = async (req, res) => {
    try {
        const { contactId } = req.body;
        await messageModel.updateMany(
            { senderId: String(contactId), receiverId: 'admin' },
            { $set: { seen: true, seenAt: Date.now() } }
        );
        res.json({ success: true, message: 'Messages marked as seen' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to block/unblock patient
const blockPatient = async (req, res) => {
    try {
        const { userId, isBlocked } = req.body;
        await userModel.findByIdAndUpdate(userId, { isBlocked });
        res.json({ success: true, message: isBlocked ? 'Patient blocked' : 'Patient unblocked' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { 
    addDoctor, 
    loginAdmin, 
    allDoctors, 
    appointmentsAdmin, 
    appointmentCancel, 
    allComplaintsAdmin, 
    resolveComplaint, 
    updateDoctorProfileAdmin, 
    adminSendMessage, 
    adminGetMessages, 
    adminGetAllMessages,
    adminMarkMessagesSeen,
    blockPatient 
}
