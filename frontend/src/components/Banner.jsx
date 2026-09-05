import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Banner = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);
    
    // Dynamically grab the first doctor, or fallback if not loaded yet
    const bannerDoc = doctors && doctors.length > 0 
        ? doctors[0] 
        : { name: 'Dr. Richard James', speciality: 'General Physician', image: assets.doc1 };

    return (
        <div className='flex flex-col md:flex-row flex-wrap bg-[#fef7e5] dark:bg-[#181E26] rounded-none px-6 md:px-10 lg:px-16 my-20 border border-[#00311e]/20 dark:border-[#EAE0C8]/20 shadow-md overflow-hidden relative transition-colors duration-300'>
            
            {/* Left Side */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 md:py-[6vw] z-10'>
                <div className='border border-[#00311e]/30 dark:border-[#EAE0C8]/30 bg-[#00311e]/5 dark:bg-[#EAE0C8]/10 text-[#00311e] dark:text-[#EAE0C8] px-3.5 py-1 text-xs font-bold tracking-widest uppercase'>
                    Join MedSync Today
                </div>
                <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-[#00311e] dark:text-[#EAE0C8] leading-tight'>
                    Book Appointment <br /> With 100+ Trusted Doctors
                </h2>
                <p className='text-[#00311e]/80 dark:text-[#EAE0C8]/80 text-base font-light'>
                    Create your account today and experience a new era of seamless healthcare.
                </p>
                <button 
                    onClick={() => { navigate('/login'); scrollTo(0,0) }} 
                    className='mt-2 flex items-center gap-2 bg-[#00311e] hover:bg-[#002416] dark:bg-[#EAE0C8] dark:hover:bg-white text-[#fef7e5] dark:text-[#202833] px-8 py-3.5 rounded-none font-bold text-xs uppercase tracking-wider transition-all shadow-sm'
                >
                    Create Account ➔
                </button>
            </div>

            {/* Right Side - Custom UI Illustration */}
            <div className='md:w-1/2 relative hidden md:flex justify-center items-center py-10 z-10'>
                {/* Main Card */}
                <div className='relative w-[320px] bg-white dark:bg-[#202833] border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-none p-6 shadow-xl transform hover:scale-105 transition-transform duration-500'>
                    <div className='flex items-center gap-4 mb-6'>
                        <div className='w-16 h-16 rounded-full bg-[#00311e] dark:bg-[#EAE0C8] p-0.5 shadow-md'>
                            <div className='w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white/80'>
                                <img src={bannerDoc.image} className='w-full h-full object-cover' alt='Doctor' />
                            </div>
                        </div>
                        <div>
                            <p className='text-[#00311e] dark:text-[#EAE0C8] font-bold text-lg'>{bannerDoc.name}</p>
                            <p className='text-[#00311e]/70 dark:text-[#EAE0C8]/80 text-sm font-medium'>{bannerDoc.speciality}</p>
                        </div>
                    </div>
                    
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between text-sm bg-[#fef7e5]/40 dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] rounded-none p-3 border border-[#00311e]/10 dark:border-[#EAE0C8]/20 shadow-sm'>
                            <div className='flex items-center gap-2'>
                                <span className='text-lg'>📅</span>
                                <span className='font-medium text-[#00311e]/80 dark:text-[#EAE0C8]/80'>Tomorrow</span>
                            </div>
                            <span className='font-bold text-[#00311e] dark:text-[#EAE0C8]'>10:00 AM</span>
                        </div>
                        <div className='flex items-center justify-between text-sm bg-[#fef7e5]/40 dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] rounded-none p-3 border border-[#00311e]/10 dark:border-[#EAE0C8]/20 shadow-sm'>
                            <div className='flex items-center gap-2'>
                                <span className='text-lg'>💳</span>
                                <span className='font-medium text-[#00311e]/80 dark:text-[#EAE0C8]/80'>Consultation</span>
                            </div>
                            <span className='font-bold text-[#00311e] dark:text-[#EAE0C8]'>$50</span>
                        </div>
                    </div>

                    <div className='w-full mt-6 bg-[#00311e] dark:bg-[#EAE0C8] text-[#fef7e5] dark:text-[#202833] py-3 rounded-none font-bold text-xs uppercase tracking-wider text-center cursor-default shadow-sm'>
                        Ready to Book
                    </div>
                    
                    {/* Floating Badge */}
                    <div className='absolute -bottom-6 -left-8 bg-white dark:bg-[#202833] p-4 rounded-none shadow-2xl border border-[#00311e]/20 dark:border-[#EAE0C8]/30 flex items-center gap-3 animate-bounce' style={{ animationDuration: '3s' }}>
                        <div className='w-10 h-10 rounded-full bg-emerald-100 dark:bg-[#181E26] border dark:border-[#EAE0C8]/30 flex items-center justify-center text-emerald-600 dark:text-[#EAE0C8] text-xl font-bold'>
                            ✓
                        </div>
                        <div>
                            <p className='text-[#00311e] dark:text-[#EAE0C8] font-bold text-sm'>100+ Doctors</p>
                            <p className='text-[#00311e]/60 dark:text-[#EAE0C8]/60 text-xs'>Available online</p>
                        </div>
                    </div>
                    
                    {/* Floating Badge 2 */}
                    <div className='absolute -top-6 -right-6 bg-white dark:bg-[#202833] p-3 rounded-none shadow-2xl border border-[#00311e]/20 dark:border-[#EAE0C8]/30 flex items-center gap-3 animate-pulse' style={{ animationDuration: '4s' }}>
                        <div className='w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/80 border dark:border-amber-500/30 flex items-center justify-center text-amber-500 text-base'>
                            ⭐
                        </div>
                        <div>
                            <p className='text-[#00311e] dark:text-[#EAE0C8] font-bold text-xs'>Top Rated</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner;
