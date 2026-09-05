import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-6 py-16 text-[#00311e] dark:text-[#EAE0C8] transition-colors' id='speciality'>
        <div className='text-center space-y-2 mb-4'>
            <div className='inline-flex items-center gap-2 border border-[#00311e]/20 dark:border-[#EAE0C8]/20 bg-[#00311e]/5 dark:bg-[#EAE0C8]/10 text-[#00311e] dark:text-[#EAE0C8] px-3 py-1 text-[11px] font-bold tracking-widest uppercase'>
                Clinical Disciplines
            </div>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#00311e] dark:text-[#EAE0C8] tracking-tight transition-colors'>
                Find The Right Medical Specialist
            </h2>
            <p className='sm:w-2/3 mx-auto text-center text-[#00311e]/70 dark:text-[#EAE0C8]/75 font-light transition-colors text-sm sm:text-base'>
                Learn what each specialist treats and connect with verified doctors for your specific health needs.
            </p>
        </div>
        
        {/* Detailed Responsive Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 mt-4'>
            {specialityData.map((item, index) => (
                <Link 
                    onClick={() => scrollTo(0, 0)} 
                    key={index} 
                    to={`/doctors/${item.speciality}`}
                    className='group relative flex flex-col justify-between bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 p-6 rounded-none shadow-sm hover:border-[#00311e] dark:hover:border-[#EAE0C8]/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden'
                >
                    {/* Top Row: Icon + Title */}
                    <div>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='w-12 h-12 bg-[#fef7e5] dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-none flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300'>
                                {item.image}
                            </div>
                            <span className='text-[10px] font-bold uppercase tracking-wider text-[#00311e]/60 dark:text-[#EAE0C8]/90 bg-[#00311e]/5 dark:bg-[#202833] px-2.5 py-1 border border-[#00311e]/10 dark:border-[#EAE0C8]/20'>
                                Verified Care
                            </span>
                        </div>
                        
                        <h3 className='font-bold text-lg text-[#00311e] dark:text-[#EAE0C8] group-hover:text-emerald-800 dark:group-hover:text-white transition-colors'>
                            {item.speciality}
                        </h3>
                        
                        {/* Clinical Description */}
                        <p className='text-xs sm:text-[13px] text-[#00311e]/75 dark:text-[#EAE0C8]/80 mt-2 leading-relaxed font-light'>
                            {item.description}
                        </p>

                        {/* Treated Conditions Badges */}
                        {item.conditions && (
                            <div className='flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
                                {item.conditions.map((cond, cIdx) => (
                                    <span 
                                        key={cIdx} 
                                        className='text-[10px] font-medium bg-[#fef7e5]/80 dark:bg-[#202833] text-[#00311e]/80 dark:text-[#EAE0C8]/75 px-2 py-0.5 border border-[#00311e]/10 dark:border-[#EAE0C8]/15'
                                    >
                                        {cond}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Bottom CTA */}
                    <div className='mt-5 pt-3 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 flex items-center justify-between text-xs font-semibold text-[#00311e] dark:text-[#EAE0C8]'>
                        <span className='group-hover:translate-x-1 transition-transform'>Consult Specialist</span>
                        <span className='text-sm group-hover:translate-x-1.5 transition-transform text-emerald-700 dark:text-[#EAE0C8]'>➔</span>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default SpecialityMenu;
