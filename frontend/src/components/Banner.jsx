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
        <div className='flex flex-col md:flex-row flex-wrap bg-gradient-to-r from-gray-900 to-indigo-950 dark:from-gray-900 dark:to-black rounded-2xl px-6 md:px-10 lg:px-20 my-20 shadow-2xl overflow-hidden relative transition-colors duration-300'>
            
            {/* Decorative circles */}
            <div className='absolute top-0 right-1/4 w-[300px] h-[300px] bg-primary opacity-20 dark:opacity-10 rounded-full blur-3xl transform translate-y-[-50%]'></div>
            <div className='absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500 opacity-20 dark:opacity-10 rounded-full blur-3xl transform translate-x-[30%] translate-y-[30%]'></div>

            {/* Left Side */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 md:py-[8vw] z-10'>
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-md'>
                    Book Appointment <br /> With 100+ Trusted Doctors
                </h1>
                <p className='text-gray-300 text-lg font-light'>
                    Create your account today and experience a new era of seamless healthcare.
                </p>
                <button 
                    onClick={() => { navigate('/login'); scrollTo(0,0) }} 
                    className='mt-4 flex items-center gap-2 bg-white text-gray-900 px-10 py-3.5 rounded-full font-medium hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-lg group'
                >
                    Create Account
                    <span className='group-hover:translate-x-1 transition-transform'>&rarr;</span>
                </button>
            </div>

            {/* Right Side - Custom UI Illustration */}
            <div className='md:w-1/2 relative hidden md:flex justify-center items-center py-10 z-10'>
                {/* Main Glass Card */}
                <div className='relative w-[320px] bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500'>
                    <div className='flex items-center gap-4 mb-6'>
                        <div className='w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-primary p-1 shadow-lg'>
                            <div className='w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white/50'>
                                <img src={bannerDoc.image} className='w-full h-full object-cover' alt='Doctor' />
                            </div>
                        </div>
                        <div>
                            <p className='text-white font-semibold text-lg drop-shadow-sm'>{bannerDoc.name}</p>
                            <p className='text-blue-300 text-sm font-medium'>{bannerDoc.speciality}</p>
                        </div>
                    </div>
                    
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between text-sm text-gray-300 bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-3 border border-white/10 shadow-inner'>
                            <div className='flex items-center gap-2'>
                                <span className='text-xl'>📅</span>
                                <span>Tomorrow</span>
                            </div>
                            <span className='font-medium text-white'>10:00 AM</span>
                        </div>
                        <div className='flex items-center justify-between text-sm text-gray-300 bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-3 border border-white/10 shadow-inner'>
                            <div className='flex items-center gap-2'>
                                <span className='text-xl'>💳</span>
                                <span>Consultation</span>
                            </div>
                            <span className='font-medium text-white'>$50</span>
                        </div>
                    </div>

                    <div className='w-full mt-6 bg-primary text-white py-3 rounded-xl font-medium shadow-[0_10px_20px_rgba(37,99,235,0.3)] text-center cursor-default'>
                        Ready to Book
                    </div>
                    
                    {/* Floating Badge */}
                    <div className='absolute -bottom-6 -left-8 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 animate-bounce' style={{ animationDuration: '3s' }}>
                        <div className='w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 text-xl'>
                            ✓
                        </div>
                        <div>
                            <p className='text-gray-800 dark:text-white font-bold text-sm'>100+ Doctors</p>
                            <p className='text-gray-500 dark:text-gray-400 text-xs'>Available online</p>
                        </div>
                    </div>
                    
                    {/* Floating Badge 2 */}
                    <div className='absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 animate-pulse' style={{ animationDuration: '4s' }}>
                        <div className='w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 text-lg'>
                            ⭐
                        </div>
                        <div>
                            <p className='text-gray-800 dark:text-white font-bold text-xs'>Top Rated</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner;
