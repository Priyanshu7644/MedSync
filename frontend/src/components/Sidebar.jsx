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

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊', end: true },
    { name: 'All Appointments', path: '/admin/all-appointments', icon: '📅' },
    { name: 'Add Doctor', path: '/admin/add-doctor', icon: '➕' },
    { name: 'Doctors Roster', path: '/admin/doctor-list', icon: '🩺' },
    { name: 'Support & Tickets', path: '/admin/complaints', icon: '🛡️' },
  ];

  return (
    <aside className='w-64 min-w-[16rem] min-h-[calc(100vh-65px)] self-stretch bg-[#fef7e5] dark:bg-[#181E26] border-r border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex flex-col justify-between p-4 z-20 shrink-0 transition-colors select-none'>
      {aToken && (
        <>
          {/* Nav items */}
          <div className='flex flex-col gap-1'>
            <div className='px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#00311e]/50 dark:text-[#EAE0C8]/50'>
              Management
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
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

          {/* Bottom Card */}
          <div className='pt-4 border-t border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex flex-col gap-3'>
            <div className='px-3 py-2.5 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
                <span className='text-xs font-semibold text-[#00311e] dark:text-[#EAE0C8]'>Admin Active</span>
              </div>
              <span className='text-[10px] font-bold text-[#00311e]/50 dark:text-[#EAE0C8]/50 uppercase tracking-wider'>Root</span>
            </div>

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

export default Sidebar;
