import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import Stripe from 'stripe';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import complaintModel from '../models/complaintModel.js';
import messageModel from '../models/messageModel.js';

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password (min 8 chars)" });
        }

        // checking user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');
        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender });

        if (imageFile) {
            // Upload to local storage
            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`;
            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select('-password');
        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not available' });
        }

        let slots_booked = docData.slots_booked || {};
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select('-password');
        if (userData.isBlocked) {
            return res.json({ success: false, message: 'You have been blocked from booking appointments' });
        }

        delete docData.slots_booked;
        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment Booked" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to make payment of appointment using stripe
const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled || appointmentData.payment) {
            return res.json({ success: false, message: 'Appointment cancelled or already paid' });
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            return res.json({ success: false, message: 'Stripe Secret Key is missing in backend .env' });
        }

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY || 'inr';
        
        const line_items = [{
            price_data: {
                currency: currency,
                product_data: {
                    name: appointmentData.docData.name,
                    description: `Appointment with ${appointmentData.docData.speciality}`,
                },
                unit_amount: appointmentData.amount * 100, // converting to smallest currency unit
            },
            quantity: 1,
        }];

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-appointments?success=true&appointmentId=${appointmentId}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-appointments?success=false&appointmentId=${appointmentId}`,
            metadata: {
                appointmentId
            }
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Verification endpoint for stripe payment success
const verifyStripe = async (req, res) => {
    try {
        const { appointmentId, success } = req.body;
        
        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
            res.json({ success: true, message: 'Payment Successful' });
        } else {
            res.json({ success: false, message: 'Payment Failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData;
        const docData = await doctorModel.findById(docId);
        
        let slots_booked = docData.slots_booked || {};

        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        }
        
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to submit a complaint
const submitComplaint = async (req, res) => {
    try {
        const { userId, subject, description } = req.body;
        const userData = await userModel.findById(userId).select('-password');
        
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        const complaintData = {
            userId,
            userData,
            subject,
            description,
            date: Date.now()
        }

        const newComplaint = new complaintModel(complaintData);
        await newComplaint.save();

        res.json({ success: true, message: 'Complaint Submitted Successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to list user complaints
const listComplaints = async (req, res) => {
    try {
        const { userId } = req.body;
        const complaints = await complaintModel.find({ userId });
        res.json({ success: true, complaints });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for user to send message
const userSendMessage = async (req, res) => {
    try {
        const { userId, docId, text } = req.body;
        
        // Security constraint: Check for paid appointment that is NOT completed
        const hasPaidAppointment = await appointmentModel.findOne({ userId, docId, payment: true, isCompleted: false, cancelled: false });
        
        if (!hasPaidAppointment) {
            return res.json({ success: false, message: 'You can only message doctors with an active, paid appointment.' });
        }

        // Check if user is blocked
        const userData = await userModel.findById(userId);
        if (userData && userData.isBlocked) {
            return res.json({ success: false, message: 'You have been blocked from sending messages.' });
        }

        let attachmentUrl = "";
        if (req.file) {
            attachmentUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const newMessage = new messageModel({
            senderId: userId,
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

// API for user to get messages with a specific doctor
const userGetMessages = async (req, res) => {
    try {
        const { userId, docId } = req.body;
        
        const messages = await messageModel.find({
            $or: [
                { senderId: userId, receiverId: docId },
                { senderId: docId, receiverId: userId }
            ]
        }).sort({ date: 1 });

        res.json({ success: true, messages });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for user to mark messages from doctor as seen
const userMarkMessagesSeen = async (req, res) => {
    try {
        const { userId, docId } = req.body;
        await messageModel.updateMany(
            { senderId: docId, receiverId: userId, seen: false },
            { seen: true, seenAt: Date.now() }
        );
        res.json({ success: true, message: 'Messages marked as seen' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { 
    registerUser, 
    loginUser, 
    getProfile, 
    updateProfile, 
    bookAppointment, 
    listAppointment, 
    paymentStripe, 
    verifyStripe, 
    cancelAppointment, 
    submitComplaint, 
    listComplaints, 
    userSendMessage, 
    userGetMessages,
    userMarkMessagesSeen
}
