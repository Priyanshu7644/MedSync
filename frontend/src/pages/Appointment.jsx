import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getUserMessages, userSendMessage, messages } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  // Chat state
  const [chatText, setChatText] = useState('');
  const [chatFile, setChatFile] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
  }

  const getAvailableSlots = async () => {
    setDocSlots([]);
    let today = new Date();
    
    let allSlots = [];
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      allSlots.push(timeSlots);
    }
    setDocSlots(allSlots);
  }

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
      let interval;
      if (showChat && token && docId) {
          getUserMessages(docId);
          interval = setInterval(() => {
              getUserMessages(docId);
          }, 5000);
      }
      return () => clearInterval(interval);
  }, [showChat, token, docId]);

  const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!chatText.trim() && !chatFile) return;
      const success = await userSendMessage(docId, chatText, chatFile);
      if (success) {
          setChatText('');
          setChatFile(null);
      }
  };

  useEffect(() => {
    if(docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate('/login');
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;
      
      const { data } = await axios.post(`${backendUrl}/api/user/book-appointment`, { docId, slotDate, slotTime }, { headers: { token } });
      
      if (data.success) {
        toast.success(data.message);
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  if (!docInfo) return <div className='py-20 text-center text-[#202833]/70 dark:text-[#EAE0C8]/70'>Loading Doctor Data...</div>

  return (
    <div className='py-6 text-[#202833] dark:text-[#EAE0C8] transition-colors'>
      {/* Doctor Details */}
      <div className='flex flex-col sm:flex-row gap-6 items-start'>
        <div className='w-full sm:max-w-72 bg-[#EAE0C8]/40 dark:bg-[#181E26] border border-[#202833]/15 dark:border-[#EAE0C8]/20 shadow-sm p-1'>
          <img className='w-full h-72 object-cover object-top' src={docInfo.image} alt={docInfo.name} />
        </div>
        <div className='flex-1 border border-[#202833]/15 dark:border-[#EAE0C8]/20 p-8 bg-white/95 dark:bg-[#181E26] shadow-sm transition-colors'>
          <p className='flex items-center gap-2 text-2xl md:text-3xl font-bold text-[#202833] dark:text-[#EAE0C8]'>
            {docInfo.name} 
            <span className='text-green-600 dark:text-green-400 text-sm'>✔</span>
          </p>
          <div className='flex items-center gap-3 text-sm mt-2 text-[#202833]/80 dark:text-[#EAE0C8]/80 font-medium'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <span className='py-0.5 px-2.5 border border-[#202833]/20 dark:border-[#EAE0C8]/30 text-xs font-semibold uppercase tracking-wider bg-[#EAE0C8]/20 dark:bg-[#202833]/40'>{docInfo.experience}</span>
          </div>
          <div className='mt-5 pt-4 border-t border-[#202833]/10 dark:border-[#EAE0C8]/10'>
            <p className='text-xs font-bold uppercase tracking-wider text-[#202833] dark:text-[#EAE0C8] mb-1'>About</p>
            <p className='text-sm text-[#202833]/80 dark:text-[#EAE0C8]/80 max-w-[700px] leading-relaxed font-light'>{docInfo.about}</p>
          </div>
          <p className='text-[#202833]/80 dark:text-[#EAE0C8]/80 font-medium mt-6 text-sm'>
            Appointment fee: <span className='text-[#202833] dark:text-[#EAE0C8] font-bold text-base'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>
      
      {/* Booking Slots */}
      <div className='sm:ml-80 sm:pl-2 mt-10 transition-colors'>
        <p className='text-xs font-bold uppercase tracking-wider text-[#202833] dark:text-[#EAE0C8]'>Select Booking Slot</p>
        
        <div className='flex gap-3 items-center w-full overflow-x-auto mt-4 pb-2 no-scrollbar'>
          {docSlots.length > 0 && docSlots.map((item, index) => (
            <div 
              onClick={() => setSlotIndex(index)}
              className={`text-center py-4 min-w-16 cursor-pointer transition-all duration-300 border ${slotIndex === index ? 'bg-[#202833] text-[#EAE0C8] dark:bg-[#EAE0C8] dark:text-[#202833] border-[#202833] dark:border-[#EAE0C8] font-bold shadow-sm' : 'border-[#202833]/20 dark:border-[#EAE0C8]/30 bg-white/80 dark:bg-[#181E26] text-[#202833]/80 dark:text-[#EAE0C8]/80 hover:border-[#202833] dark:hover:border-[#EAE0C8]'}`} 
              key={index}
            >
              <p className='text-[10px] font-semibold tracking-wider uppercase'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p className='text-lg font-bold mt-1'>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>
        
        <div className='flex items-center gap-3 w-full overflow-x-auto mt-4 pb-2 no-scrollbar flex-wrap'>
          {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
            <p 
              onClick={() => setSlotTime(item.time)}
              className={`text-xs uppercase tracking-wider font-semibold px-5 py-2.5 cursor-pointer transition-all duration-300 border ${item.time === slotTime ? 'bg-[#202833] text-[#EAE0C8] dark:bg-[#EAE0C8] dark:text-[#202833] border-[#202833] dark:border-[#EAE0C8] shadow-sm' : 'text-[#202833]/80 dark:text-[#EAE0C8]/80 bg-white/80 dark:bg-[#181E26] border-[#202833]/20 dark:border-[#EAE0C8]/30 hover:border-[#202833] dark:hover:border-[#EAE0C8]'}`} 
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        
        <button onClick={bookAppointment} className='bg-[#202833] hover:bg-[#161C24] dark:bg-[#EAE0C8] dark:hover:bg-white text-[#EAE0C8] dark:text-[#202833] text-xs font-bold uppercase tracking-wider px-10 py-3.5 my-8 transition-all shadow-sm'>
          Book an appointment ➔
        </button>
      </div>
    </div>
  )
}

export default Appointment;
