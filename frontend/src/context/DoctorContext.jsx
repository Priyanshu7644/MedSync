import { createContext, useState } from "react";
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

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, { headers: { dtoken } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
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
      const { data } = await axios.get(`${backendUrl}/api/doctor/get-messages`, { headers: { dtoken } });
      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
      // Find docId from profileData
      const { data } = await axios.post(`${backendUrl}/api/doctor/block-patient`, { userId, isBlocked, docId: profileData._id }, { headers: { dtoken } });
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
    doctorSendMessage,
    blockPatient
  }

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider;
