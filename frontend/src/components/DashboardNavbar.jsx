import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const DashboardNavbar = ({ role }) => {
  const navigate = useNavigate();
  const { setAToken } = useContext(AdminContext);
  const { setDtoken, profileData } = useContext(DoctorContext);
  const { theme } = useContext(ThemeContext);

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

  const currentDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const isDoctor = role === 'doctor';
  const homeLink = isDoctor ? '/doctor/dashboard' : '/admin';
  const roleLabel = isDoctor ? 'Provider Console' : 'Admin Console';
  const logoText = isDoctor ? 'DR' : 'MS';

  return (
    <header className='flex justify-between items-center px-5 sm:px-8 py-3.5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20 bg-[#fef7e5]/90 dark:bg-[#181E26]/90 backdrop-blur-md sticky top-0 z-40 transition-colors'>
      <div className='flex items-center gap-3.5'>
        <div 
          onClick={() => navigate(homeLink)}
          className='flex items-center gap-2.5 cursor-pointer group'
        >
          <div className='w-8 h-8 rounded-lg bg-[#00311e] dark:bg-[#EAE0C8] text-[#fef7e5] dark:text-[#202833] flex items-center justify-center font-bold text-xs shadow-sm'>
            {logoText}
          </div>
          <span className='text-lg font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>
            Med<span className='font-light opacity-80'>Sync</span>
          </span>
          <span className='text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#00311e]/15 dark:border-[#EAE0C8]/20 bg-[#00311e]/5 dark:bg-[#EAE0C8]/10 text-[#00311e] dark:text-[#EAE0C8]'>
            {roleLabel}
          </span>
        </div>
      </div>
      
      <div className='flex items-center gap-3 sm:gap-4'>
        {/* Date */}
        <div className='hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00311e]/5 dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 text-xs text-[#00311e]/80 dark:text-[#EAE0C8]/80 font-medium'>
          <span>📅</span>
          <span>{currentDate}</span>
        </div>

        {/* Doctor profile preview */}
        {isDoctor && profileData && (
          <div 
            onClick={() => navigate('/doctor/profile')}
            className='hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 cursor-pointer hover:border-[#00311e]/40 dark:hover:border-[#EAE0C8]/40 transition-colors'
          >
            <img 
              src={profileData.image} 
              alt={profileData.name} 
              className='w-5 h-5 rounded-full object-cover' 
            />
            <span className='text-xs font-semibold text-[#00311e] dark:text-[#EAE0C8] truncate max-w-[120px]'>
              {profileData.name}
            </span>
          </div>
        )}
        
        <ThemeToggle />
        
        <button 
          onClick={logout} 
          className='px-4 py-1.5 rounded-lg text-xs font-semibold text-[#00311e] dark:text-[#EAE0C8] hover:bg-[#00311e] hover:text-[#fef7e5] dark:hover:bg-[#EAE0C8] dark:hover:text-[#202833] border border-[#00311e]/20 dark:border-[#EAE0C8]/20 transition-all'
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default DashboardNavbar;
