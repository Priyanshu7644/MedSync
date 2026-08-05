import express from 'express';
import { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, allComplaintsAdmin, resolveComplaint, updateDoctorProfileAdmin, adminSendMessage, adminGetMessages } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import adminAuth from '../middlewares/adminAuth.js';

const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.post('/add-doctor', adminAuth, upload.single('image'), addDoctor);
adminRouter.get('/all-doctors', adminAuth, allDoctors);
adminRouter.get('/appointments', adminAuth, appointmentsAdmin);
adminRouter.post('/cancel-appointment', adminAuth, appointmentCancel);
adminRouter.get('/complaints', adminAuth, allComplaintsAdmin);
adminRouter.post('/resolve-complaint', adminAuth, resolveComplaint);
adminRouter.post('/update-doctor', adminAuth, updateDoctorProfileAdmin);
adminRouter.post('/send-message', adminAuth, adminSendMessage);
adminRouter.post('/get-messages', adminAuth, adminGetMessages);

export default adminRouter;
