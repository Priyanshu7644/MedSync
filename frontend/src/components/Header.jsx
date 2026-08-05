import React from 'react';
import { assets } from '../assets/assets';

const Header = () => {
  return (
    <div className='relative w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-[2rem] md:px-16 px-6 pt-16 pb-32 mb-20 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300'>
        
        <div className='flex flex-col md:flex-row items-center justify-between gap-12'>
            {/* Left Content */}
            <div className='md:w-1/2 flex flex-col items-start gap-6 z-10'>
                <div className='bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full border border-blue-100 dark:border-gray-700 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide uppercase shadow-sm transition-colors'>
                    #1 Healthcare Platform
                </div>
                <h1 className='text-4xl lg:text-[3.25rem] font-bold text-gray-900 dark:text-white leading-[1.15] tracking-tight transition-colors'>
                    Find & Book <br/>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500'>Top-Tier Doctors</span> <br/>
                    In Minutes.
                </h1>
                <p className='text-gray-500 dark:text-white text-base md:text-lg max-w-md font-light leading-relaxed transition-colors'>
                    Access a network of trusted healthcare professionals. Schedule your appointments effortlessly and take control of your health.
                </p>
            </div>

            {/* Right Image */}
            <div className='md:w-1/2 relative flex justify-center md:justify-end z-10'>
                <div className='relative w-full max-w-[420px]'>
                    {/* Abstract background shape behind image */}
                    <div className='absolute inset-0 bg-gradient-to-tr from-blue-300 to-primary rounded-[3rem] blur-3xl opacity-20 transform scale-90 translate-x-5 translate-y-5'></div>
                    <img className='w-full relative z-10 drop-shadow-2xl hover:-translate-y-2 transition-transform duration-700' src={assets.hero_img} alt="Doctors" />
                </div>
            </div>
        </div>

        {/* Floating Quick Search Bar */}
        <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[90%] md:w-[85%] max-w-5xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-2xl p-4 md:p-6 z-20 flex flex-col md:flex-row items-center gap-4 transition-colors'>
            <div className='flex-1 w-full flex items-center bg-gray-50/80 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all'>
                <span className='text-gray-400 mr-3 text-lg'>🔍</span>
                <input type="text" placeholder="Condition, procedure, or doctor..." className='w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 font-medium' />
            </div>
            <div className='w-px h-10 bg-gray-200 dark:bg-gray-700 hidden md:block transition-colors'></div>
            <div className='flex-1 w-full flex items-center bg-gray-50/80 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all'>
                <span className='text-gray-400 mr-3 text-lg'>📍</span>
                <input type="text" placeholder="City, state, or zip code" className='w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 font-medium' />
            </div>
            <button className='w-full md:w-auto bg-primary text-white px-10 py-3.5 rounded-xl font-medium text-sm hover:bg-blue-600 hover:shadow-lg transition-all whitespace-nowrap active:scale-95'>
                Find Care
            </button>
        </div>
    </div>
  )
}

export default Header;
