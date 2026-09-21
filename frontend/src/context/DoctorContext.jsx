import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const [dtoken, setDtoken] = useState(localStorage.getItem('dtoken') ? localStorage.getItem('dtoken') : '');
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const [messages, setMessages] = useState([]);
  const currencySymbol = '$';

  const handleAuthError = (msg) => {
    if (msg && (msg.toLowerCase().includes('session') || msg.toLowerCase().includes('signature') || msg.toLowerCase().includes('authorized') || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('invalid'))) {
      localStorage.removeItem('dtoken');
      setDtoken('');
      setProfileData(false);
      setDashData(false);
      return true;
    }
    return false;
  }

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, { headers: { dtoken } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        if (!handleAuthError(data.message)) {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      if (!handleAuthError(error.response?.data?.message || error.message)) {
        toast.error(error.message);
      }
    }
  }

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, { appointmentId }, { headers: { dtoken } });
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, { appointmentId }, { headers: { dtoken } });
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, { headers: { dtoken } });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, { headers: { dtoken } });
      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const doctorGetMessages = async () => {
    try {
      if (!dtoken) return;
      const { data } = await axios.get(`${backendUrl}/api/doctor/get-messages`, { headers: { dtoken } });
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const doctorMarkMessagesSeen = async (contactId) => {
    try {
      if (!dtoken || !contactId) return;
      const cIdStr = String(contactId);

      // Optimistically mark seen in local state
      setMessages(prev => prev.map(msg => 
        String(msg.senderId) === cIdStr 
          ? { ...msg, seen: true, seenAt: Date.now() } 
          : msg
      ));

      await axios.post(`${backendUrl}/api/doctor/mark-seen`, { contactId: cIdStr }, { headers: { dtoken } });
    } catch (error) {
      console.log(error);
    }
  }

  const doctorSendMessage = async (receiverId, text, file = null) => {
    try {
      let payload = { receiverId, text };
      let headers = { dtoken };
      
      if (file) {
        payload = new FormData();
        payload.append('receiverId', receiverId);
        payload.append('text', text);
        payload.append('attachment', file);
      }

      // Optimistic message creation
      const tempMsg = {
        _id: 'temp_' + Date.now(),
        senderId: profileData ? profileData._id : 'doctor',
        receiverId,
        text: text || '',
        attachment: file ? URL.createObjectURL(file) : '',
        date: Date.now(),
        seen: false
      };
      setMessages(prev => [...prev, tempMsg]);

      const { data } = await axios.post(`${backendUrl}/api/doctor/send-message`, payload, { headers });
      if (data.success) {
        doctorGetMessages();
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
      const { data } = await axios.post(`${backendUrl}/api/doctor/block-patient`, { userId, isBlocked, docId: profileData?._id }, { headers: { dtoken } });
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

  // Polling for real-time messages and automatic profile load
  useEffect(() => {
    if (dtoken) {
      getProfileData();
      getAppointments();
      doctorGetMessages();
      const interval = setInterval(() => {
        doctorGetMessages();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [dtoken]);

  // Calculate unread count for provider topbar and sidebar badge
  const unreadCount = messages.filter(msg => {
    const isSentByMe = profileData ? String(msg.senderId) === String(profileData._id) : msg.senderId === 'doctor';
    return !isSentByMe && !msg.seen;
  }).length;

  const value = {
    dtoken,
    setDtoken,
    backendUrl,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    currencySymbol,
    messages,
    setMessages,
    doctorGetMessages,
    doctorMarkMessagesSeen,
    doctorSendMessage,
    unreadCount,
    blockPatient
  }

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider;
