import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, required: false, default: "" },
  attachment: { type: String, required: false, default: "" },
  date: { type: Number, required: true }
})

const messageModel = mongoose.models.message || mongoose.model('message', messageSchema);
export default messageModel;
