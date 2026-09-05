import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import messageModel from '../models/messageModel.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for doctor login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get doctor appointments for doctor panel
const doctorAppointments = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({ success: true, message: 'Appointment Completed' });
        } else {
            return res.json({ success: false, message: 'Mark Failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            return res.json({ success: true, message: 'Appointment Cancelled' });
        } else {
            return res.json({ success: false, message: 'Cancellation Failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId });

        let earnings = 0;
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        });

        let patients = [];
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId);
            }
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body;
        const profileData = await doctorModel.findById(docId).select('-password');
        res.json({ success: true, profileData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available } = req.body;
        await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
        res.json({ success: true, message: 'Profile Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for doctor to send message
const doctorSendMessage = async (req, res) => {
    try {
        const { docId, receiverId, text } = req.body;
        
        let attachmentUrl = "";
        if (req.file) {
            attachmentUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const newMessage = new messageModel({
            senderId: docId,
            receiverId,
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

// API for doctor to get all their messages
const doctorGetMessages = async (req, res) => {
    try {
        const { docId } = req.body;
        const messages = await messageModel.find({
            $or: [
                { senderId: docId },
                { receiverId: docId }
            ]
        }).sort({ date: 1 });
        res.json({ success: true, messages });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for doctor to mark messages from a contact as seen
const doctorMarkMessagesSeen = async (req, res) => {
    try {
        const { docId, contactId } = req.body;
        await messageModel.updateMany(
            { senderId: String(contactId), receiverId: String(docId) },
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
        // Verify doctor has had an appointment with this user
        const { docId } = req.body;
        const appointment = await appointmentModel.findOne({ docId, userId });
        if (!appointment) {
            return res.json({ success: false, message: 'Not authorized to block this patient' });
        }
        await userModel.findByIdAndUpdate(userId, { isBlocked });
        res.json({ success: true, message: isBlocked ? 'Patient blocked' : 'Patient unblocked' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { 
    doctorList, 
    loginDoctor, 
    doctorAppointments, 
    appointmentComplete, 
    appointmentCancel, 
    doctorDashboard, 
    doctorProfile, 
    updateDoctorProfile, 
    doctorSendMessage, 
    doctorGetMessages, 
    doctorMarkMessagesSeen,
    blockPatient 
}
