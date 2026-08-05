import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorDashboard = () => {
  const { dtoken, dashData, getDashData, currencySymbol } = useContext(DoctorContext);

  useEffect(() => {
    if (dtoken) {
      getDashData();
    }
  }, [dtoken]);

  return dashData && (
    <div className='m-5 transition-colors'>
      <div className='flex flex-wrap gap-4'>
        <div className='flex items-center gap-4 bg-white dark:bg-gray-800 p-6 min-w-52 rounded border-2 border-gray-100 dark:border-gray-700 cursor-pointer hover:scale-105 transition-all shadow-sm'>
          <div className='bg-primary/10 dark:bg-primary/20 w-14 h-14 flex items-center justify-center rounded-full text-primary dark:text-blue-400 font-bold text-2xl'>$</div>
          <div>
            <p className='text-xl font-bold text-gray-700 dark:text-white'>{currencySymbol}{dashData.earnings}</p>
            <p className='text-gray-400 dark:text-gray-300 text-sm'>Earnings</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white dark:bg-gray-800 p-6 min-w-52 rounded border-2 border-gray-100 dark:border-gray-700 cursor-pointer hover:scale-105 transition-all shadow-sm'>
          <div className='bg-blue-100 dark:bg-blue-900/30 w-14 h-14 flex items-center justify-center rounded-full text-blue-500 font-bold text-2xl'>📅</div>
          <div>
            <p className='text-xl font-bold text-gray-700 dark:text-white'>{dashData.appointments}</p>
            <p className='text-gray-400 dark:text-gray-300 text-sm'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white dark:bg-gray-800 p-6 min-w-52 rounded border-2 border-gray-100 dark:border-gray-700 cursor-pointer hover:scale-105 transition-all shadow-sm'>
          <div className='bg-green-100 dark:bg-green-900/30 w-14 h-14 flex items-center justify-center rounded-full text-green-500 font-bold text-2xl'>👥</div>
          <div>
            <p className='text-xl font-bold text-gray-700 dark:text-white'>{dashData.patients}</p>
            <p className='text-gray-400 dark:text-gray-300 text-sm'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 mt-10 rounded border dark:border-gray-700 max-w-4xl shadow-sm'>
        <div className='flex items-center gap-2.5 px-6 py-4 border-b dark:border-gray-700 font-semibold text-gray-700 dark:text-white'>
          <p>Recent Appointments</p>
        </div>

        <div className='pt-4 pb-4 px-6'>
          {dashData.latestAppointments.map((item, index) => (
            <div className='flex items-center justify-between gap-3 py-2 border-b dark:border-gray-700 last:border-none' key={index}>
              <div className='flex gap-3'>
                <img className='rounded-full w-10 h-10 object-cover bg-gray-100 dark:bg-gray-700' src={item.userData.image} alt="" />
                <div>
                  <p className='text-gray-800 dark:text-white font-semibold'>{item.userData.name}</p>
                  <p className='text-gray-500 dark:text-gray-300 text-xs'>{item.slotDate}</p>
                </div>
              </div>
              {item.cancelled ? (
                <p className='text-red-500 text-xs font-bold'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-bold'>Completed</p>
              ) : (
                <p className='text-blue-500 text-xs font-bold'>Pending</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard;
