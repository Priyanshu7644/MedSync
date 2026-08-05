import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AllAppointments = () => {
  const { aToken, doctors, getAllDoctors, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);

  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
      getAllAppointments();
    }
  }, [aToken]);

  // View 1: Doctor Grid
  if (!selectedDoctorId) {
    return (
      <div className='m-5 max-h-[90vh] overflow-y-scroll transition-colors'>
        <h1 className='text-lg font-medium text-gray-700 dark:text-white mb-4'>Select Doctor to View Appointments</h1>
        <div className='w-full flex flex-wrap gap-4 gap-y-6'>
          {doctors.map((item, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedDoctorId(item._id)}
              className='border border-indigo-200 dark:border-gray-700 rounded-xl max-w-56 overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800 shadow-sm'
            >
              <img className='bg-indigo-50 dark:bg-gray-700 group-hover:bg-primary transition-all duration-500' src={item.image} alt={item.name} />
              <div className='p-4'>
                <p className='text-gray-900 dark:text-white text-lg font-medium truncate'>{item.name}</p>
                <p className='text-gray-500 dark:text-gray-300 text-sm truncate'>{item.speciality}</p>
                <button className='mt-3 w-full py-2 bg-primary/10 text-primary dark:bg-blue-900/30 dark:text-blue-400 rounded-md text-sm font-medium hover:bg-primary hover:text-white transition-colors'>View Appointments</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // View 2: Appointments List for selected doctor
  const selectedDoctor = doctors.find(doc => doc._id === selectedDoctorId);
  const doctorAppointments = appointments.filter(app => app.docId === selectedDoctorId);

  return (
    <div className='m-5 transition-colors'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <button 
            onClick={() => setSelectedDoctorId(null)}
            className='bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
          >
            &larr; Back
          </button>
          <h1 className='text-lg font-medium text-gray-700 dark:text-white'>Appointments for {selectedDoctor?.name}</h1>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 border dark:border-gray-700 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-sm'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {doctorAppointments.length === 0 ? (
           <div className='p-6 text-center text-gray-500 dark:text-gray-400'>No appointments found for this doctor.</div>
        ) : (
          doctorAppointments.reverse().map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 dark:text-gray-300 py-3 px-6 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors' key={index}>
              <p className='max-sm:hidden'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.userData.image} alt="" /> <p>{item.userData.name}</p>
              </div>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full bg-gray-200 dark:bg-gray-700' src={item.docData.image} alt="" /> <p>{item.docData.name}</p>
              </div>
              <p>${item.amount}</p>
              
              <div className='flex justify-end sm:justify-start gap-2'>
                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <button 
                    onClick={() => cancelAppointment(item._id)} 
                    className='px-3 py-1 bg-red-50 text-red-500 border border-red-200 dark:border-red-800 dark:bg-red-900/20 rounded-full text-xs font-medium hover:bg-red-500 hover:text-white transition-colors'
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AllAppointments;
