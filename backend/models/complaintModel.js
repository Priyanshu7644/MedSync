import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userData: { type: Object, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Open' }, // Open, Resolved
  date: { type: Number, required: true }
})

const complaintModel = mongoose.models.complaint || mongoose.model('complaint', complaintSchema);
export default complaintModel;
