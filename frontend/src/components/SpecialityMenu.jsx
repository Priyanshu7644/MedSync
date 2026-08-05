import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-6 py-16 text-gray-800 dark:text-gray-200 transition-colors' id='speciality'>
        <div className='text-center space-y-2 mb-6'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors'>Medical Specialities</h1>
            <p className='sm:w-2/3 mx-auto text-center text-gray-500 dark:text-gray-200 font-light transition-colors'>
                Find the right expert for your health needs from our extensive network.
            </p>
        </div>
        
        {/* Bento Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-5 w-full max-w-4xl px-4'>
            {specialityData.map((item, index) => (
                <Link 
                    onClick={() => scrollTo(0, 0)} 
                    key={index} 
                    to={`/doctors/${item.speciality}`}
                    className='group relative flex flex-col items-start justify-between bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-primary/20 dark:hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(95,111,255,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden min-h-[150px]'
                >
                    {/* Background accent */}
                    <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 dark:from-blue-900/20 to-transparent rounded-bl-full -z-10 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500'></div>
                    
                    <div className='w-12 h-12 bg-white dark:bg-gray-700 shadow-sm border border-gray-50 dark:border-gray-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-all duration-300 z-10'>
                        {item.image}
                    </div>
                    
                    <div className='z-10'>
                        <p className='font-semibold text-gray-800 dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors'>{item.speciality}</p>
                        <p className='text-xs text-gray-400 dark:text-gray-200 mt-1 flex items-center gap-1 group-hover:text-primary/70 dark:group-hover:text-blue-400/80 transition-colors'>
                            Explore specialists <span className='opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all'>&rarr;</span>
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default SpecialityMenu;
