import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { ThemeContext } from '../context/ThemeContext';

const DashboardNavbar = ({ role }) => {
  const navigate = useNavigate();
  const { setAToken } = useContext(AdminContext);
  const { setDtoken } = useContext(DoctorContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const logout = () => {
    if (role === 'admin') {
      localStorage.removeItem('aToken');
      setAToken('');
      navigate('/admin');
    } else {
      localStorage.removeItem('dtoken');
      setDtoken('');
      navigate('/doctor');
    }
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-colors'>
      <div className='flex items-center gap-3'>
        <h1 onClick={() => navigate('/')} className='text-3xl font-bold text-primary cursor-pointer tracking-tight'>MedSync</h1>
        <p className='border px-3 py-1 rounded-full border-gray-400 dark:border-gray-600 text-gray-600 dark:text-white text-xs font-medium bg-gray-50 dark:bg-gray-800'>{role === 'admin' ? 'Admin Panel' : 'Doctor Panel'}</p>
      </div>
      <div className='flex items-center gap-4'>
          <button onClick={toggleTheme} className='text-xl p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
              {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button onClick={logout} className='bg-primary text-white text-sm px-8 py-2 rounded-full hover:bg-blue-600 transition-colors shadow-sm'>Logout</button>
      </div>
    </div>
  )
}

export default DashboardNavbar;
