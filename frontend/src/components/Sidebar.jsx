import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const Sidebar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('aToken');
    setAToken('');
    navigate('/admin');
  }

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-colors'>
      {aToken && (
        <ul className='text-gray-600 dark:text-gray-300 mt-5 transition-colors'>
          <NavLink to='/admin' end className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-blue-900/20 border-r-4 border-primary text-primary dark:text-blue-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
          <NavLink to='/admin/all-appointments' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-blue-900/20 border-r-4 border-primary text-primary dark:text-blue-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <p className='hidden md:block'>Appointments</p>
          </NavLink>
          <NavLink to='/admin/add-doctor' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-blue-900/20 border-r-4 border-primary text-primary dark:text-blue-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <p className='hidden md:block'>Add Doctor</p>
          </NavLink>
          <NavLink to='/admin/doctor-list' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-blue-900/20 border-r-4 border-primary text-primary dark:text-blue-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <p className='hidden md:block'>Doctors List</p>
          </NavLink>
          <NavLink to='/admin/complaints' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#F2F3FF] dark:bg-blue-900/20 border-r-4 border-primary text-primary dark:text-blue-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <p className='hidden md:block'>Complaints</p>
          </NavLink>
          
          <div className='mt-10 px-3 md:px-9'>
             <button onClick={logout} className='w-full py-2 bg-red-50 text-red-500 rounded-full border border-red-200 hover:bg-red-500 hover:text-white transition-all text-sm font-medium'>Logout</button>
          </div>
        </ul>
      )}
    </div>
  )
}

export default Sidebar;
