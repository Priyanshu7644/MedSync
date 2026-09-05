import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className='flex flex-col items-center gap-6 my-16 text-[#00311e] dark:text-[#EAE0C8] w-full max-w-6xl mx-auto px-4'>
        <div className='text-center space-y-2 mb-6'>
            <h2 className='text-2xl sm:text-3xl font-bold text-[#00311e] dark:text-[#EAE0C8] tracking-tight transition-colors'>Top Doctors to Book</h2>
            <p className='sm:w-2/3 mx-auto text-center text-[#00311e]/70 dark:text-[#EAE0C8]/70 font-light transition-colors text-sm sm:text-base'>
                Simply browse through our extensive list of trusted doctors.
            </p>
        </div>

        {/* Compact Grid */}
        <div className='w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {doctors.slice(0, 10).map((item, index) => (
                <div onClick={() => navigate(`/appointment/${item._id}`)} className='group bg-white/90 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-none overflow-hidden cursor-pointer shadow-sm hover:border-[#00311e] dark:hover:border-[#EAE0C8]/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col' key={index}>
                    <div className='bg-[#fef7e5]/50 dark:bg-[#202833] relative overflow-hidden h-40 flex justify-center items-end border-b border-[#00311e]/10 dark:border-[#EAE0C8]/15 transition-colors'>
                        <img className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500' src={item.image} alt={item.name} />
                    </div>
                    <div className='p-4 flex-1 flex flex-col'>
                        <div className='flex items-center gap-1.5 mb-2'>
                            <span className='relative flex h-2 w-2'>
                              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                              <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500'></span>
                            </span>
                            <p className='text-emerald-700 dark:text-[#EAE0C8] font-bold text-[10px] tracking-wider uppercase'>Available</p>
                        </div>
                        <p className='text-[#00311e] dark:text-[#EAE0C8] text-sm sm:text-base font-bold truncate transition-colors'>{item.name}</p>
                        <p className='text-[#00311e]/70 dark:text-[#EAE0C8]/70 text-xs mt-0.5 truncate font-medium transition-colors'>{item.speciality}</p>
                    </div>
                </div>
            ))}
        </div>
        <button onClick={() => { navigate('/doctors'); scrollTo(0,0) }} className='border border-[#00311e] dark:border-[#EAE0C8] text-[#00311e] dark:text-[#EAE0C8] hover:bg-[#00311e] hover:text-[#fef7e5] dark:hover:bg-[#EAE0C8] dark:hover:text-[#202833] font-semibold text-xs uppercase tracking-wider px-8 py-3 rounded-none mt-8 transition-all duration-300 shadow-sm'>View More Doctors ➔</button>
    </div>
  )
}

export default TopDoctors;
