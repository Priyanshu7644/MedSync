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
      if (!chatText.trim()) return;
      const success = await userSendMessage(docId, chatText);
      if (success) {
          setChatText('');
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

  if (!docInfo) return <div className='py-20 text-center text-gray-500 dark:text-gray-200'>Loading Doctor Data...</div>

  return (
    <div className='transition-colors'>
      {/* Doctor Details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={docInfo.name} />
        </div>
        <div className='flex-1 border border-gray-300 dark:border-gray-700 rounded-lg p-8 py-7 bg-white dark:bg-gray-800 mx-2 sm:mx-0 mt-[-80px] sm:mt-0 shadow-sm transition-colors'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900 dark:text-white'>
            {docInfo.name} 
            <span className='text-blue-500 text-sm'>✔</span>
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600 dark:text-gray-300'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border dark:border-gray-600 text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white mt-3'>About</p>
            <p className='text-sm text-gray-500 dark:text-gray-300 max-w-[700px] mt-1 leading-relaxed'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 dark:text-gray-400 font-medium mt-4'>
            Appointment fee: <span className='text-gray-900 dark:text-white'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>
      
      {/* Booking Slots */}
      <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700 dark:text-gray-200 transition-colors'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-auto mt-4 pb-4 no-scrollbar'>
          {docSlots.length > 0 && docSlots.map((item, index) => (
            <div 
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all duration-300 ${slotIndex === index ? 'bg-primary text-white shadow-md' : 'border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:border-primary'}`} 
              key={index}
            >
              <p className='text-xs font-light'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p className='text-lg font-medium'>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>
        
        <div className='flex items-center gap-3 w-full overflow-x-auto mt-4 pb-4 no-scrollbar'>
          {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
            <p 
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 ${item.time === slotTime ? 'bg-primary text-white shadow-md' : 'text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-primary'}`} 
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        
        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 hover:bg-blue-600 transition-colors shadow-md'>
          Book an appointment
        </button>
      </div>

      {/* Chat with Doctor Section */}
      {token && (
          <div className='mt-16 sm:mt-24 border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm'>
              <div 
                  onClick={() => setShowChat(!showChat)}
                  className='p-4 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 cursor-pointer flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              >
                  <div>
                      <h3 className='text-lg font-medium text-gray-800 dark:text-white'>Message Dr. {docInfo.name}</h3>
                      <p className='text-xs text-gray-500'>You can chat with the doctor after booking a paid appointment.</p>
                  </div>
                  <span className='text-gray-500'>{showChat ? '▲' : '▼'}</span>
              </div>
              
              {showChat && (
                  <div className='flex flex-col h-[400px]'>
                      <div className='flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50/50 dark:bg-gray-800/50'>
                          {(!messages || messages.length === 0) ? (
                              <div className='m-auto text-sm text-gray-400'>No messages yet. Say hello!</div>
                          ) : (
                              messages.map((msg, index) => {
                                  const isMe = msg.senderId !== docId;
                                  return (
                                      <div key={index} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                          <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-bl-none shadow-sm'}`}>
                                              {msg.text}
                                          </div>
                                          <span className='text-[10px] text-gray-400 mt-1 mx-1'>
                                              {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                          </span>
                                      </div>
                                  )
                              })
                          )}
                      </div>
                      <form onSubmit={handleSendMessage} className='p-4 border-t dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-900'>
                          <input 
                              type="text" 
                              value={chatText}
                              onChange={(e) => setChatText(e.target.value)}
                              placeholder="Type your message..."
                              className='flex-1 bg-gray-100 dark:bg-gray-800 dark:text-white border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors rounded-full px-4 py-2 text-sm outline-none border'
                          />
                          <button type="submit" className='bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors'>
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                          </button>
                      </form>
                  </div>
              )}
          </div>
      )}
    </div>
  )
}

export default Appointment;
