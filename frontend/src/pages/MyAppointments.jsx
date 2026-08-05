import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [paymentModal, setPaymentModal] = useState({ show: false, appointmentId: null });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
    <div className='transition-colors'>
      <p className='pb-3 mt-12 font-medium text-zinc-700 dark:text-white border-b dark:border-gray-700'>My appointments</p>
      
      <div className='flex flex-col gap-4 mt-6'>
        {appointments.length === 0 && <p className='text-gray-500 dark:text-gray-300'>No appointments found. Book one today!</p>}
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b dark:border-gray-700' key={index}>
            <div>
              <img className='w-32 h-32 bg-[#EAEFFF] dark:bg-gray-800 object-cover rounded-xl' src={item.docData.image} alt="" />
            </div>
            
            <div className='flex-1 text-sm text-zinc-600 dark:text-gray-300'>
              <p className='text-neutral-800 dark:text-white font-semibold text-lg'>{item.docData.name}</p>
              <p className='text-sm text-gray-500 dark:text-gray-200 mt-1'>{item.docData.speciality}</p>
              <p className='text-zinc-700 dark:text-white font-medium mt-4'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-sm mt-3 font-medium'>
                <span className='text-sm text-neutral-700 dark:text-white font-semibold'>Date & Time: </span> 
                {item.slotDate} | {item.slotTime}
              </p>
            </div>
            
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && !item.payment && <button onClick={() => appointmentStripe(item._id)} className='text-sm text-stone-500 dark:text-gray-200 text-center sm:min-w-48 py-2 border border-stone-200 dark:border-gray-600 hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-300 rounded'>Pay Online</button>}
              {!item.cancelled && item.payment && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 bg-green-50 dark:bg-green-900/20 cursor-default'>Paid</button>}
              
              {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 dark:text-gray-200 text-center sm:min-w-48 py-2 border border-stone-200 dark:border-gray-600 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all duration-300 rounded'>Cancel appointment</button>}
              {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 cursor-not-allowed'>Appointment cancelled</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Mock Payment Modal */}
      {paymentModal.show && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
          <div className='bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full flex flex-col items-center gap-6 relative transition-colors'>
            
            <button 
              onClick={() => setPaymentModal({ show: false, appointmentId: null })}
              className='absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className='text-center'>
              <h3 className='text-2xl font-bold text-gray-800 dark:text-white mb-1'>Scan to Pay</h3>
              <p className='text-sm text-gray-500 dark:text-gray-300'>Demo Payment Interface</p>
            </div>

            <div className='p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 shadow-inner'>
              {/* Dummy QR Code Image */}
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DemoPaymentMedSync" 
                alt="Payment QR Code" 
                className='w-48 h-48 rounded-lg'
              />
            </div>

            <div className='w-full border-t pt-5'>
              <button 
                onClick={handleBypassPayment}
                className='w-full py-3 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-2'
              >
                <span>Bypass Payment (Demo)</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default MyAppointments;
