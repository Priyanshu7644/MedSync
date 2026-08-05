import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentStripe, verifyStripe, submitComplaint, listComplaints, userSendMessage, userGetMessages } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointment);
userRouter.post('/payment-stripe', authUser, paymentStripe);
userRouter.post('/verify-stripe', authUser, verifyStripe);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
userRouter.post('/submit-complaint', authUser, submitComplaint);
userRouter.get('/complaints', authUser, listComplaints);
userRouter.post('/send-message', authUser, userSendMessage);
userRouter.post('/get-messages', authUser, userGetMessages);

export default userRouter;
