import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className='flex flex-col items-center gap-6 my-16 text-gray-900 w-full max-w-6xl mx-auto px-4'>
        <div className='text-center space-y-2 mb-6'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors'>Top Doctors to Book</h1>
            <p className='sm:w-2/3 mx-auto text-center text-gray-500 dark:text-gray-200 font-light transition-colors'>
                Simply browse through our extensive list of trusted doctors.
            </p>
        </div>

        {/* Compact Grid */}
        <div className='w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {doctors.slice(0, 10).map((item, index) => (
                <div onClick={() => navigate(`/appointment/${item._id}`)} className='group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:shadow-[0_8px_24px_rgb(0,0,0,0.06)] hover:border-primary/20 dark:hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 flex flex-col' key={index}>
                    <div className='bg-blue-50/40 dark:bg-blue-900/20 relative overflow-hidden h-40 flex justify-center items-end transition-colors'>
                        <img className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500' src={item.image} alt={item.name} />
                    </div>
                    <div className='p-4 flex-1 flex flex-col'>
                        <div className='flex items-center gap-1.5 mb-2'>
                            <span className='relative flex h-2 w-2'>
                              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                              <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
                            </span>
                            <p className='text-green-500 font-semibold text-[10px] tracking-wider uppercase'>Available</p>
                        </div>
                        <p className='text-gray-900 dark:text-white text-base font-semibold truncate group-hover:text-primary dark:group-hover:text-blue-400 transition-colors'>{item.name}</p>
                        <p className='text-gray-500 dark:text-gray-200 text-xs mt-0.5 truncate transition-colors'>{item.speciality}</p>
                    </div>
                </div>
            ))}
        </div>
        <button onClick={() => { navigate('/doctors'); scrollTo(0,0) }} className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white text-sm font-medium px-8 py-2.5 rounded-full mt-8 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-primary dark:hover:text-white transition-all duration-300'>View More Doctors</button>
    </div>
  )
}

export default TopDoctors;
