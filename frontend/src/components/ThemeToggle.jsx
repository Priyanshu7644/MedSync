import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <div
      onClick={toggleTheme}
      className='flex items-center gap-2 cursor-pointer select-none py-1 group'
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
    >
      <span className={`text-xs font-bold tracking-wider transition-colors duration-200 ${!isDark ? 'text-[#00311e] font-black' : 'text-[#00311e]/40 dark:text-[#EAE0C8]/40'}`}>
        LIGHT
      </span>
      <div className='w-12 h-6 rounded-full border-2 border-[#00311e] dark:border-[#EAE0C8] p-0.5 flex items-center bg-transparent transition-colors duration-200'>
        <div
          className={`w-4 h-4 rounded-full bg-[#00311e] dark:bg-[#EAE0C8] transition-transform duration-300 ease-in-out transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </div>
      <span className={`text-xs font-bold tracking-wider transition-colors duration-200 ${isDark ? 'text-[#EAE0C8] font-black' : 'text-[#00311e]/40 dark:text-[#EAE0C8]/40'}`}>
        DARK
      </span>
    </div>
  );
};

export default ThemeToggle;
