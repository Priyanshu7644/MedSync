import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';

const DoctorSidebar = () => {
  const { dtoken, setDtoken, profileData } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('dtoken');
    setDtoken('');
    navigate('/doctor');
  }

  const navItems = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: '📊' },
    { name: 'Appointments', path: '/doctor/appointments', icon: '📅' },
    { name: 'Profile & Clinic', path: '/doctor/profile', icon: '🩺' },
    { name: 'Messages', path: '/doctor/messages', icon: '💬' },
  ];

  return (
    <aside className='w-64 min-w-[16rem] min-h-[calc(100vh-65px)] self-stretch bg-[#fef7e5] dark:bg-[#181E26] border-r border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex flex-col justify-between p-4 z-20 shrink-0 transition-colors select-none'>
      {dtoken && (
        <>
          {/* Nav Items List */}
          <div className='flex flex-col gap-1'>
            <div className='px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#00311e]/50 dark:text-[#EAE0C8]/50'>
              Clinical Menu
            </div>
            
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] font-semibold shadow-sm'
                    : 'text-[#00311e]/70 dark:text-[#EAE0C8]/70 hover:text-[#00311e] dark:hover:text-[#EAE0C8] hover:bg-[#00311e]/5 dark:hover:bg-[#EAE0C8]/5 font-medium'
                }`}
              >
                <span className='text-sm'>{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Bottom Doctor Profile Card & Quick Actions */}
          <div className='pt-4 border-t border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex flex-col gap-3'>
            {profileData && (
              <div 
                onClick={() => navigate('/doctor/profile')}
                className='p-3 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center gap-3 cursor-pointer hover:border-[#00311e]/40 dark:hover:border-[#EAE0C8]/40 transition-colors'
              >
                <img 
                  src={profileData.image} 
                  alt={profileData.name} 
                  className='w-9 h-9 rounded-full object-cover shrink-0'
                />
                <div className='flex-1 min-w-0'>
                  <p className='text-xs font-bold text-[#00311e] dark:text-[#EAE0C8] truncate'>{profileData.name}</p>
                  <div className='flex items-center gap-1.5 mt-0.5'>
                    <span className={`w-1.5 h-1.5 rounded-full ${profileData.available ? 'bg-emerald-500' : 'bg-neutral-400'}`}></span>
                    <span className='text-[10px] text-[#00311e]/70 dark:text-[#EAE0C8]/70 truncate'>
                      {profileData.available ? 'Accepting Patients' : 'Off-duty'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={logout} 
              className='w-full py-2 rounded-lg text-xs font-semibold text-[#00311e] dark:text-[#EAE0C8] hover:bg-[#00311e] hover:text-[#fef7e5] dark:hover:bg-[#EAE0C8] dark:hover:text-[#202833] border border-[#00311e]/20 dark:border-[#EAE0C8]/20 transition-all flex items-center justify-center gap-1.5'
            >
              <span>⎋</span>
              <span>Sign Out</span>
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

export default DoctorSidebar;
