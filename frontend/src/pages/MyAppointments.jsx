import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MyAppointments = () => {
  const { backendUrl, token, messages, getUserMessages, userSendMessage } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [paymentModal, setPaymentModal] = useState({ show: false, appointmentId: null });
  const [activeChat, setActiveChat] = useState({ appId: null, docId: null });
  const [chatText, setChatText] = useState('');
  const [chatFile, setChatFile] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSendMessage = async (e) => {
      e.preventDefault();
      if ((!chatText.trim() && !chatFile) || !activeChat.docId) return;
      const success = await userSendMessage(activeChat.docId, chatText, chatFile);
      if (success) {
          setChatText('');
          setChatFile(null);
      }
  };

  useEffect(() => {
      let interval;
      if (activeChat.docId && token) {
          getUserMessages(activeChat.docId);
          interval = setInterval(() => {
              getUserMessages(activeChat.docId);
          }, 5000);
      }
      return () => clearInterval(interval);
  }, [activeChat.docId, token]);

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const appointmentStripe = async (appointmentId) => {
    // For demo purposes, we will open the mock payment modal instead of calling Stripe
    setPaymentModal({ show: true, appointmentId });
  }

  const handleBypassPayment = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-stripe`, { success: "true", appointmentId: paymentModal.appointmentId }, { headers: { token } });
      if (data.success) {
        toast.success("Demo Payment Successful!");
        setPaymentModal({ show: false, appointmentId: null });
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const verifyStripePayment = async () => {
    const success = searchParams.get('success');
    const appointmentId = searchParams.get('appointmentId');
    
    if (success && appointmentId) {
      try {
        const { data } = await axios.post(`${backendUrl}/api/user/verify-stripe`, { success, appointmentId }, { headers: { token } });
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
        // Remove params from URL and refetch
        navigate('/my-appointments');
        getUserAppointments();
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      verifyStripePayment();
    }
  }, [token, searchParams]);

  return (
    <div className='py-6 text-[#202833] dark:text-[#EAE0C8] transition-colors'>
      <p className='pb-3 font-bold uppercase tracking-wider text-sm border-b border-[#202833]/15 dark:border-[#EAE0C8]/20'>My Appointments</p>
      
      <div className='flex flex-col gap-4 mt-6'>
        {appointments.length === 0 && <p className='text-[#202833]/70 dark:text-[#EAE0C8]/70 text-sm'>No appointments found. Book one today!</p>}
        {appointments.map((item, index) => (
          <div key={index} className='bg-white/95 dark:bg-[#181E26] border border-[#202833]/15 dark:border-[#EAE0C8]/20 p-5 shadow-sm'>
            <div className='grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-5 items-center'>
              <div className='w-28 h-28 bg-[#EAE0C8]/30 dark:bg-[#202833] border border-[#202833]/15 dark:border-[#EAE0C8]/20 overflow-hidden'>
                <img className='w-full h-full object-cover object-top' src={item.docData.image} alt="" />
              </div>
              
              <div className='text-sm text-[#202833]/80 dark:text-[#EAE0C8]/80'>
                <p className='text-[#202833] dark:text-[#EAE0C8] font-bold text-lg'>{item.docData.name}</p>
                <p className='text-xs font-semibold uppercase tracking-wider text-[#202833]/60 dark:text-[#EAE0C8]/60 mt-0.5'>{item.docData.speciality}</p>
                <div className='mt-3 text-xs leading-relaxed'>
                  <p className='font-semibold text-[#202833] dark:text-[#EAE0C8]'>Address:</p>
                  <p>{item.docData.address?.line1}</p>
                  <p>{item.docData.address?.line2}</p>
                </div>
                <p className='text-xs mt-3 font-semibold'>
                  <span className='text-[#202833] dark:text-[#EAE0C8]'>Date & Time: </span> 
                  {item.slotDate} | {item.slotTime}
                </p>
              </div>
              
              <div className='flex flex-col gap-2 justify-center w-full sm:w-auto'>
                {!item.cancelled && !item.isCompleted && !item.payment && <button onClick={() => appointmentStripe(item._id)} className='text-xs uppercase tracking-wider font-semibold text-center sm:min-w-44 py-3 bg-[#202833] hover:bg-[#161C24] dark:bg-[#EAE0C8] dark:hover:bg-white text-[#EAE0C8] dark:text-[#202833] transition-all shadow-sm'>Pay Online</button>}
                {!item.cancelled && !item.isCompleted && item.payment && <button className='sm:min-w-44 py-2.5 border border-green-600 dark:border-green-400 text-green-700 dark:text-green-400 bg-green-500/10 text-xs font-bold uppercase tracking-wider cursor-default'>Paid</button>}
                {!item.cancelled && item.isCompleted && <button className='sm:min-w-44 py-2.5 border border-green-600 dark:border-green-400 text-green-700 dark:text-green-400 bg-green-500/10 text-xs font-bold uppercase tracking-wider cursor-default'>Completed</button>}
                {!item.cancelled && !item.isCompleted && item.payment && <button onClick={() => setActiveChat(activeChat.appId === item._id ? { appId: null, docId: null } : { appId: item._id, docId: item.docData._id })} className='text-xs uppercase tracking-wider font-semibold text-center sm:min-w-44 py-2.5 border border-[#202833] dark:border-[#EAE0C8] hover:bg-[#202833] hover:text-[#EAE0C8] dark:hover:bg-[#EAE0C8] dark:hover:text-[#202833] transition-all'>{activeChat.appId === item._id ? 'Close Chat' : 'Message Doctor'}</button>}
                
                {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-xs uppercase tracking-wider font-semibold text-center sm:min-w-44 py-2.5 border border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all'>Cancel Appointment</button>}
                {item.cancelled && <button className='sm:min-w-44 py-2.5 border border-red-500/40 text-red-500 text-xs font-semibold uppercase tracking-wider cursor-not-allowed bg-red-500/5'>Cancelled</button>}
              </div>
            </div>

            {/* Chat UI per appointment */}
            {activeChat.appId === item._id && (
                <div className='mt-4 border border-[#202833]/15 dark:border-[#EAE0C8]/20 bg-white dark:bg-[#181E26] shadow-sm'>
                    <div className='p-4 bg-[#EAE0C8]/20 dark:bg-[#202833]/40 border-b border-[#202833]/10 dark:border-[#EAE0C8]/10 flex justify-between items-center'>
                        <div>
                            <h3 className='text-sm font-bold text-[#202833] dark:text-[#EAE0C8] uppercase tracking-wider'>Message {item.docData.name}</h3>
                        </div>
                        <button onClick={() => setActiveChat({ appId: null, docId: null })} className='text-[#202833]/70 hover:text-[#202833] dark:text-[#EAE0C8]/70 dark:hover:text-[#EAE0C8] font-bold'>
                            ✕
                        </button>
                    </div>
                    <div className='flex flex-col h-[350px]'>
                        <div className='flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#EAE0C8]/10 dark:bg-[#202833]/20'>
                            {(!messages || messages.length === 0) ? (
                                <div className='m-auto text-xs text-[#202833]/50 dark:text-[#EAE0C8]/50'>No messages yet. Say hello!</div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = msg.senderId !== item.docData._id;
                                    return (
                                        <div key={idx} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                            <div className={`px-4 py-2 text-sm ${isMe ? 'bg-[#202833] text-[#EAE0C8] dark:bg-[#EAE0C8] dark:text-[#202833]' : 'bg-white border border-[#202833]/15 dark:border-[#EAE0C8]/20 dark:bg-[#202833] dark:text-[#EAE0C8] shadow-sm'}`}>
                                                {msg.attachment && (
                                                  <div className="mb-1">
                                                    {msg.attachment.match(/\.(jpeg|jpg|gif|png|webp)/i) ? (
                                                      <a href={msg.attachment} target="_blank" rel="noopener noreferrer"><img src={msg.attachment} alt="attachment" className="max-w-[150px] sm:max-w-xs border border-[#202833]/20" /></a>
                                                    ) : (
                                                      <a href={msg.attachment} target="_blank" rel="noopener noreferrer" className="underline text-xs flex items-center gap-1">View File</a>
                                                    )}
                                                  </div>
                                                )}
                                                {msg.text && <div>{msg.text}</div>}
                                            </div>
                                            <span className='text-[10px] text-[#202833]/50 dark:text-[#EAE0C8]/50 mt-1 mx-1'>
                                                {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                        {chatFile && (
                            <div className="px-4 py-3 bg-[#EAE0C8]/20 dark:bg-[#202833]/40 border-t border-[#202833]/10 dark:border-[#EAE0C8]/10 flex items-center gap-2">
                                <div className="relative inline-block">
                                    {chatFile.type.startsWith('image/') ? (
                                        <img src={URL.createObjectURL(chatFile)} alt="preview" className="w-16 h-16 object-cover border border-[#202833]/20" />
                                    ) : (
                                        <div className="w-16 h-16 bg-white dark:bg-[#202833] flex items-center justify-center text-[10px] text-center p-1 break-all border border-[#202833]/20 text-[#202833] dark:text-[#EAE0C8]">
                                            {chatFile.name.substring(0, 15)}...
                                        </div>
                                    )}
                                    <button 
                                        type="button" 
                                        onClick={() => setChatFile(null)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className='p-3 border-t border-[#202833]/10 dark:border-[#EAE0C8]/10 flex gap-2 bg-white dark:bg-[#181E26] items-center'>
                            <label className={`cursor-pointer transition-colors text-lg ${chatFile ? 'text-[#202833] dark:text-[#EAE0C8]' : 'text-[#202833]/60 hover:text-[#202833] dark:text-[#EAE0C8]/60 dark:hover:text-[#EAE0C8]'}`}>
                                📎
                                <input type="file" className="hidden" onChange={(e) => { if(e.target.files[0]) setChatFile(e.target.files[0]) }} />
                            </label>
                            <input 
                                type="text" 
                                value={chatText}
                                onChange={(e) => setChatText(e.target.value)}
                                placeholder="Type your message..."
                                className='flex-1 bg-[#EAE0C8]/20 dark:bg-[#202833]/50 text-[#202833] dark:text-[#EAE0C8] border border-[#202833]/15 dark:border-[#EAE0C8]/20 px-3 py-2 text-xs outline-none'
                            />
                            <button type="submit" className='bg-[#202833] text-[#EAE0C8] dark:bg-[#EAE0C8] dark:text-[#202833] px-4 py-2 text-xs font-bold uppercase tracking-wider'>
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>

      {/* Mock Payment Modal */}
      {paymentModal.show && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
          <div className='bg-white dark:bg-[#181E26] border border-[#202833]/20 dark:border-[#EAE0C8]/30 p-8 shadow-2xl max-w-sm w-full flex flex-col items-center gap-6 relative transition-colors'>
            
            <button 
              onClick={() => setPaymentModal({ show: false, appointmentId: null })}
              className='absolute top-4 right-4 text-[#202833]/60 hover:text-[#202833] dark:text-[#EAE0C8]/60 dark:hover:text-[#EAE0C8] text-lg font-bold'
            >
              ✕
            </button>

            <div className='text-center'>
              <h3 className='text-xl font-bold text-[#202833] dark:text-[#EAE0C8] mb-1'>Scan to Pay</h3>
              <p className='text-xs text-[#202833]/70 dark:text-[#EAE0C8]/70 uppercase tracking-wider'>Demo Payment Interface</p>
            </div>

            <div className='p-4 bg-[#EAE0C8]/20 dark:bg-[#202833] border border-[#202833]/15 dark:border-[#EAE0C8]/20'>
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DemoPaymentMedSync" 
                alt="Payment QR Code" 
                className='w-48 h-48'
              />
            </div>

            <div className='w-full border-t border-[#202833]/10 dark:border-[#EAE0C8]/10 pt-4'>
              <button 
                onClick={handleBypassPayment}
                className='w-full py-3 bg-[#202833] hover:bg-[#161C24] dark:bg-[#EAE0C8] dark:hover:bg-white text-[#EAE0C8] dark:text-[#202833] text-xs font-bold uppercase tracking-wider shadow-sm transition-all'
              >
                Bypass Payment (Demo) ➔
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default MyAppointments;
