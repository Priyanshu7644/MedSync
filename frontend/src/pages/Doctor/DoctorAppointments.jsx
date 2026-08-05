import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorAppointments = () => {
  const { dtoken, appointments, getAppointments, completeAppointment, cancelAppointment, currencySymbol } = useContext(DoctorContext);

  useEffect(() => {
    if (dtoken) {
      getAppointments();
    }
  }, [dtoken]);

  return (
    <div className='w-full max-w-6xl m-5 transition-colors'>
      <p className='mb-3 text-lg font-medium dark:text-white'>All Appointments</p>
      
      <div className='bg-white dark:bg-gray-800 border dark:border-gray-700 rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll shadow-sm'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b dark:border-gray-700 text-gray-500 dark:text-gray-300 font-medium'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center text-gray-500 dark:text-gray-300 py-3 px-6 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 object-cover' src={item.userData.image} alt="" />
              <p className='text-gray-800 dark:text-white font-medium'>{item.userData.name}</p>
            </div>
            <div>
              <p className={`text-xs inline border px-2 py-1 rounded-full ${item.payment ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-500 dark:text-gray-300 dark:border-gray-400'}`}>
                {item.payment ? 'Online' : 'CASH'}
              </p>
            </div>
            <p className='max-sm:hidden'>N/A</p>
            <p>{item.slotDate} | {item.slotTime}</p>
            <p className='font-semibold'>{currencySymbol}{item.amount}</p>
            
            <div className='flex gap-1'>
              {item.cancelled ? (
                <p className='text-red-500 text-xs font-bold'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-bold'>Completed</p>
              ) : (
                <div className='flex items-center gap-2'>
                  <button onClick={() => cancelAppointment(item._id)} className='w-8 h-8 rounded-full border border-red-500 text-red-500 flex justify-center items-center hover:bg-red-500 hover:text-white transition-all'>✗</button>
                  {item.payment && (
                    <button onClick={() => completeAppointment(item._id)} className='w-8 h-8 rounded-full border border-green-500 text-green-500 flex justify-center items-center hover:bg-green-500 hover:text-white transition-all'>✓</button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorAppointments;
