import express from 'express';
import { doctorList, loginDoctor, doctorAppointments, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile, doctorSendMessage, doctorGetMessages, doctorMarkMessagesSeen, blockPatient } from '../controllers/doctorController.js';
import upload from '../middlewares/multer.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/appointments', authDoctor, doctorAppointments);
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);
doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);
doctorRouter.post('/send-message', upload.single('attachment'), authDoctor, doctorSendMessage);
doctorRouter.get('/get-messages', authDoctor, doctorGetMessages);
doctorRouter.post('/mark-seen', authDoctor, doctorMarkMessagesSeen);
doctorRouter.post('/block-patient', authDoctor, blockPatient);

export default doctorRouter;
