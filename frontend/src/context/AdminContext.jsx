import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, { headers: { aToken } });
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, { headers: { aToken } });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, { appointmentId }, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        getAllAppointments(); // Refresh the list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getAllComplaints = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/complaints`, { headers: { aToken } });
      if (data.success) {
        setComplaints(data.complaints);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const resolveComplaint = async (complaintId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/resolve-complaint`, { complaintId }, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        getAllComplaints();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const updateDoctorProfileAdmin = async (doctorData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/update-doctor`, doctorData, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  }

  const adminGetMessages = async (docId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/get-messages`, { docId }, { headers: { aToken } });
      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const adminGetAllMessages = async () => {
    try {
      if (!aToken) return;
      const { data } = await axios.get(`${backendUrl}/api/admin/get-all-messages`, { headers: { aToken } });
      if (data.success) {
        setAllMessages(data.messages || []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const adminMarkMessagesSeen = async (contactId) => {
    try {
      if (!aToken || !contactId) return;
      
      // Optimistically mark seen locally
      setAllMessages(prev => prev.map(msg => 
        msg.senderId === contactId && msg.receiverId === 'admin' 
          ? { ...msg, seen: true, seenAt: Date.now() } 
          : msg
      ));
      setMessages(prev => prev.map(msg => 
        msg.senderId === contactId && msg.receiverId === 'admin' 
          ? { ...msg, seen: true, seenAt: Date.now() } 
          : msg
      ));

      await axios.post(`${backendUrl}/api/admin/mark-seen`, { contactId }, { headers: { aToken } });
    } catch (error) {
      console.log(error);
    }
  }

  const adminSendMessage = async (docId, text, file = null) => {
    try {
      let payload = { docId, text };
      let headers = { aToken };
      
      if (file) {
        payload = new FormData();
        payload.append('docId', docId);
        payload.append('text', text);
        payload.append('attachment', file);
      }

      // Optimistic message creation
      const tempMsg = {
        _id: 'temp_' + Date.now(),
        senderId: 'admin',
        receiverId: docId,
        text: text || '',
        attachment: file ? URL.createObjectURL(file) : '',
        date: Date.now(),
        seen: false
      };
      setMessages(prev => [...prev, tempMsg]);
      setAllMessages(prev => [...prev, tempMsg]);

      const { data } = await axios.post(`${backendUrl}/api/admin/send-message`, payload, { headers });
      if (data.success) {
        adminGetAllMessages();
        adminGetMessages(docId);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  }

  const blockPatient = async (userId, isBlocked) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/block-patient`, { userId, isBlocked }, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  }

  // Polling for real-time messages & badges
  useEffect(() => {
    if (aToken) {
      adminGetAllMessages();
      const interval = setInterval(() => {
        adminGetAllMessages();
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [aToken]);

  // Calculate unread count
  const unreadCount = allMessages.filter(msg => msg.receiverId === 'admin' && !msg.seen).length;

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    complaints,
    getAllComplaints,
    resolveComplaint,
    updateDoctorProfileAdmin,
    messages,
    setMessages,
    allMessages,
    setAllMessages,
    adminGetMessages,
    adminGetAllMessages,
    adminMarkMessagesSeen,
    adminSendMessage,
    unreadCount,
    blockPatient
  }

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider;
