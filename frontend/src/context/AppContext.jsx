import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
  const [userData, setUserData] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [messages, setMessages] = useState([]);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const handleAuthError = (msg) => {
    if (msg && (msg.toLowerCase().includes('session') || msg.toLowerCase().includes('signature') || msg.toLowerCase().includes('authorized') || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('invalid'))) {
      localStorage.removeItem('token');
      setToken(false);
      setUserData(false);
      return true;
    }
    return false;
  }

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, { headers: { token } });
      if (data.success) {
        setUserData(data.userData);
      } else {
        if (!handleAuthError(data.message)) {
          toast.error(data.message);
        }
      }
    } catch (error) {
      if (!handleAuthError(error.response?.data?.message || error.message)) {
        toast.error(error.message);
      }
    }
  }

  const getComplaints = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/complaints`, { headers: { token } });
      if (data.success) {
        setComplaints(data.complaints);
      } else {
        if (!handleAuthError(data.message)) {
          toast.error(data.message);
        }
      }
    } catch (error) {
      if (!handleAuthError(error.response?.data?.message || error.message)) {
        toast.error(error.message);
      }
    }
  }

  const submitComplaint = async (subject, description) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/submit-complaint`, { subject, description }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        getComplaints();
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

  const getUserMessages = async (docId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/get-messages`, { docId }, { headers: { token } });
      if (data.success) {
        setMessages(data.messages);
        return data.messages;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    return [];
  }

  const userSendMessage = async (docId, text, file = null) => {
    try {
      let payload = { docId, text };
      let headers = { token };
      
      if (file) {
        payload = new FormData();
        payload.append('docId', docId);
        payload.append('text', text);
        payload.append('attachment', file);
      }

      const { data } = await axios.post(`${backendUrl}/api/user/send-message`, payload, { headers });
      if (data.success) {
        getUserMessages(docId);
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

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
      getComplaints();
    } else {
      setUserData(false);
      setComplaints([]);
    }
  }, [token]);

  // Function to calculate age
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Function to format slot date from "DD_MM_YYYY" to "DD MMM YYYY"
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  }

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    calculateAge,
    slotDateFormat,
    complaints,
    getComplaints,
    submitComplaint,
    messages,
    setMessages,
    getUserMessages,
    userSendMessage
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;
