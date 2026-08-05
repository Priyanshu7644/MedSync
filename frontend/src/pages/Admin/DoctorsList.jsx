import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll transition-colors'>
      <h1 className='text-lg font-medium text-gray-700 dark:text-white'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-[#C9D8FF] dark:border-gray-700 rounded-xl max-w-56 overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 shadow-sm' key={index}>
            <img className='bg-[#EAEFFF] dark:bg-gray-800 w-full h-56 object-cover' src={item.image} alt={item.name} />
            <div className='p-4 bg-white dark:bg-gray-800'>
              <div className='flex items-center gap-2 text-sm text-center text-green-500 mb-1'>
                <p className='w-2 h-2 rounded-full bg-green-500'></p><p className='font-medium'>Available</p>
              </div>
              <p className='text-[#262626] dark:text-white text-lg font-bold truncate'>{item.name}</p>
              <p className='text-[#5C5C5C] dark:text-gray-300 text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
        
        {doctors.length === 0 && (
          <p className='text-gray-500 dark:text-gray-300 mt-10'>No doctors added yet. Go to 'Add Doctor' to get started!</p>
        )}
      </div>
    </div>
  )
}

export default DoctorsList
