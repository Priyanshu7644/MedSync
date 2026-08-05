import React, { useContext } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { NavLink, useNavigate } from 'react-router-dom'

const DoctorSidebar = () => {
  const { dtoken, setDtoken } = useContext(DoctorContext)
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('dtoken');
    setDtoken('');
    navigate('/doctor');
  }

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-800 transition-colors'>
      {dtoken && (
        <ul className='text-[#515151] dark:text-gray-300 mt-5 transition-colors'>
          <NavLink to={'/doctor/dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-blue-900/20 border-r-4 border-primary text-primary dark:text-blue-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <p className='font-medium'>Dashboard</p>
          </NavLink>

          <NavLink to={'/doctor/appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-blue-900/20 border-r-4 border-primary text-primary dark:text-blue-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <p className='font-medium'>Appointments</p>
          </NavLink>

          <NavLink to='/doctor/profile' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-blue-900/20 border-r-4 border-primary text-primary dark:text-blue-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <p className='hidden md:block'>Profile</p>
          </NavLink>
          <NavLink to='/doctor/messages' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-blue-900/20 border-r-4 border-primary text-primary dark:text-blue-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <p className='hidden md:block'>Messages</p>
          </NavLink>

          <div className='mt-10 px-3 md:px-9'>
             <button onClick={logout} className='w-full py-2 bg-red-50 text-red-500 rounded-full border border-red-200 hover:bg-red-500 hover:text-white transition-all text-sm font-medium'>Logout</button>
          </div>
        </ul>
      )}
    </div>
  )
}

export default DoctorSidebar
