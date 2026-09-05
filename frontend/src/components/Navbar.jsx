import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';

import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20 transition-colors'>
      <h1 onClick={() => navigate('/')} className='text-2xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8] cursor-pointer'>
        Med<span className='font-light opacity-80'>Sync</span>
      </h1>
      
      <ul className='hidden md:flex items-start gap-6 font-semibold text-xs uppercase tracking-wider'>
        <NavLink to='/' className={({ isActive }) => `py-1 transition-colors ${isActive ? "text-[#00311e] dark:text-[#EAE0C8] border-b-2 border-[#00311e] dark:border-[#EAE0C8] font-bold" : "text-[#00311e]/70 dark:text-[#EAE0C8]/70 hover:text-[#00311e] dark:hover:text-[#EAE0C8]"}`}>
          <li>HOME</li>
        </NavLink>
        <NavLink to='/doctors' className={({ isActive }) => `py-1 transition-colors ${isActive ? "text-[#00311e] dark:text-[#EAE0C8] border-b-2 border-[#00311e] dark:border-[#EAE0C8] font-bold" : "text-[#00311e]/70 dark:text-[#EAE0C8]/70 hover:text-[#00311e] dark:hover:text-[#EAE0C8]"}`}>
          <li>ALL DOCTORS</li>
        </NavLink>
        <NavLink to='/about' className={({ isActive }) => `py-1 transition-colors ${isActive ? "text-[#00311e] dark:text-[#EAE0C8] border-b-2 border-[#00311e] dark:border-[#EAE0C8] font-bold" : "text-[#00311e]/70 dark:text-[#EAE0C8]/70 hover:text-[#00311e] dark:hover:text-[#EAE0C8]"}`}>
          <li>ABOUT</li>
        </NavLink>
        <NavLink to='/contact' className={({ isActive }) => `py-1 transition-colors ${isActive ? "text-[#00311e] dark:text-[#EAE0C8] border-b-2 border-[#00311e] dark:border-[#EAE0C8] font-bold" : "text-[#00311e]/70 dark:text-[#EAE0C8]/70 hover:text-[#00311e] dark:hover:text-[#EAE0C8]"}`}>
          <li>CONTACT</li>
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        <ThemeToggle />
        {
          token
          ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <div className='w-9 h-9 bg-[#00311e] text-[#fef7e5] dark:bg-[#181E26] dark:text-[#EAE0C8] flex items-center justify-center font-bold text-sm border border-[#00311e] dark:border-[#EAE0C8]/30'>
                U
              </div>
              <div className='absolute top-0 right-0 pt-12 text-base font-medium text-[#00311e] dark:text-[#EAE0C8] z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-white dark:bg-[#181E26] shadow-xl rounded-none flex flex-col gap-4 p-4 border border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
                  <p onClick={() => navigate('/my-profile')} className='hover:underline transition-all text-sm font-medium'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:underline transition-all text-sm font-medium'>My Appointments</p>
                  <p onClick={() => navigate('/my-complaints')} className='hover:underline transition-all text-sm font-medium'>Support / Complaints</p>
                  <p onClick={logout} className='hover:text-red-500 transition-colors border-t border-[#00311e]/10 dark:border-[#EAE0C8]/20 pt-3 text-sm font-medium'>Logout</p>
                </div>
              </div>
            </div>
          : <button onClick={() => navigate('/login')} className='border border-[#00311e] dark:border-[#EAE0C8] text-[#00311e] dark:text-[#EAE0C8] hover:bg-[#00311e] hover:text-[#fef7e5] dark:hover:bg-[#EAE0C8] dark:hover:text-[#202833] font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-none transition-all hidden md:block'>Create account</button>
        }
      </div>
    </div>
  )
}

export default Navbar;
