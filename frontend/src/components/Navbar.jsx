import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken } = useContext(AppContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-200 dark:border-gray-800 transition-colors'>
      <h1 onClick={() => navigate('/')} className='text-2xl font-bold text-primary cursor-pointer tracking-tight'>MedSync</h1>
      
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/' className={({ isActive }) => `py-1 ${isActive ? "text-primary border-b-2 border-primary" : "text-gray-700 dark:text-white hover:text-primary dark:hover:text-primary transition-colors"}`}>
          <li>HOME</li>
        </NavLink>
        <NavLink to='/doctors' className={({ isActive }) => `py-1 ${isActive ? "text-primary border-b-2 border-primary" : "text-gray-700 dark:text-white hover:text-primary dark:hover:text-primary transition-colors"}`}>
          <li>ALL DOCTORS</li>
        </NavLink>
        <NavLink to='/about' className={({ isActive }) => `py-1 ${isActive ? "text-primary border-b-2 border-primary" : "text-gray-700 dark:text-white hover:text-primary dark:hover:text-primary transition-colors"}`}>
          <li>ABOUT</li>
        </NavLink>
        <NavLink to='/contact' className={({ isActive }) => `py-1 ${isActive ? "text-primary border-b-2 border-primary" : "text-gray-700 dark:text-white hover:text-primary dark:hover:text-primary transition-colors"}`}>
          <li>CONTACT</li>
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        <button onClick={toggleTheme} className='text-xl p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {
          token
          ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <div className='w-10 h-10 bg-primary text-white flex items-center justify-center rounded-full font-bold shadow-md'>
                U
              </div>
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 dark:text-white z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-white dark:bg-gray-900 shadow-xl rounded-lg flex flex-col gap-4 p-4 border border-gray-100 dark:border-gray-800'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-primary transition-colors'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-primary transition-colors'>My Appointments</p>
                  <p onClick={() => navigate('/my-complaints')} className='hover:text-primary transition-colors'>Support / Complaints</p>
                  <p onClick={logout} className='hover:text-red-500 transition-colors border-t border-gray-200 dark:border-gray-700 pt-3'>Logout</p>
                </div>
              </div>
            </div>
          : <button onClick={() => navigate('/login')} className='bg-primary text-white px-6 py-2.5 rounded-full font-light hover:bg-blue-600 transition-all shadow-md hidden md:block'>Create account</button>
        }
      </div>
    </div>
  )
}

export default Navbar;
