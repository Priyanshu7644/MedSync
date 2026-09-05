import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className='py-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors duration-300'>
      
      {/* Header Banner */}
      <div className='text-center space-y-3 pt-4 mb-12'>
        <div className='inline-flex items-center gap-2 border border-[#00311e]/20 dark:border-[#EAE0C8]/20 bg-[#00311e]/5 dark:bg-[#EAE0C8]/10 px-3.5 py-1 text-xs font-bold tracking-widest uppercase'>
          Our Mission & Legacy
        </div>
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>
          Pioneering Connected Healthcare
        </h1>
        <p className='sm:w-2/3 mx-auto text-center text-[#00311e]/70 dark:text-[#EAE0C8]/75 font-light text-sm sm:text-base leading-relaxed'>
          Bridging the gap between world-class medical specialists and patients through intelligent scheduling, clinical rigor, and compassionate care.
        </p>
      </div>

      {/* Main Story & Vision: Split Layout */}
      <div className='my-8 flex flex-col lg:flex-row gap-10 lg:gap-14 items-center bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 p-6 sm:p-10 lg:p-12 shadow-sm'>
        
        {/* Left: Realistic Doctor Team Photograph Card */}
        <div className='w-full lg:w-1/2 relative'>
          <div className='relative overflow-hidden border border-[#00311e]/20 dark:border-[#EAE0C8]/25 shadow-lg'>
            <img 
              className='w-full h-[320px] sm:h-[400px] object-cover object-center filter brightness-[0.98] contrast-[1.02] hover:scale-105 transition-transform duration-700' 
              src={assets.about_team_real || assets.hero_doctor_real} 
              alt="MedSync Medical Leadership Team" 
            />
            <div className='absolute inset-0 bg-gradient-to-t from-[#202833]/85 via-transparent to-transparent'></div>
            <div className='absolute bottom-4 left-4 right-4 text-white flex items-end justify-between'>
              <div>
                <p className='font-bold text-sm sm:text-base drop-shadow-md text-white'>Clinical Advisory Board</p>
                <p className='text-xs text-white/90 drop-shadow-md'>Hospital network & telehealth leadership</p>
              </div>
              <span className='bg-[#00311e] dark:bg-[#EAE0C8] text-[#fef7e5] dark:text-[#202833] text-[10px] font-bold px-3 py-1 uppercase tracking-wider shadow-sm'>
                Verified Team
              </span>
            </div>
          </div>
          
          {/* Floating Trust Badge */}
          <div className='absolute -bottom-5 -right-4 hidden sm:flex items-center gap-3 bg-[#fef7e5] dark:bg-[#202833] border border-[#00311e]/20 dark:border-[#EAE0C8]/30 px-4 py-2.5 shadow-xl'>
            <span className='text-xl'>🏆</span>
            <div>
              <p className='text-[11px] font-bold uppercase tracking-wider text-[#00311e] dark:text-[#EAE0C8]'>Excellence in Care</p>
              <p className='text-[10px] text-[#00311e]/60 dark:text-[#EAE0C8]/60'>99.4% Patient Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Right: Vision & Narrative */}
        <div className='w-full lg:w-1/2 flex flex-col justify-center gap-5 text-sm sm:text-[15px] text-[#00311e]/80 dark:text-[#EAE0C8]/80 leading-relaxed font-light'>
          <div>
            <h2 className='text-xl sm:text-2xl font-bold text-[#00311e] dark:text-[#EAE0C8] tracking-tight mb-2'>
              Healthcare Designed Around You
            </h2>
            <p className='text-[#00311e]/75 dark:text-[#EAE0C8]/75'>
              At MedSync, we recognized a critical dilemma in modern healthcare: booking appointments was burdensome, doctor availability was opaque, and patients experienced prolonged delays for crucial consultations.
            </p>
          </div>

          <p className='text-[#00311e]/75 dark:text-[#EAE0C8]/75'>
            We created MedSync to eliminate waiting room bottlenecks by giving patients transparent, instant access to vetted medical leaders across 20+ specialized disciplines—from general wellness to advanced neurosurgery.
          </p>

          <div className='border-l-2 border-[#00311e] dark:border-[#EAE0C8] pl-4 py-1 my-1'>
            <b className='block text-[#00311e] dark:text-[#EAE0C8] text-base font-bold mb-1'>Our Core Vision</b>
            <p className='text-xs sm:text-sm text-[#00311e]/70 dark:text-[#EAE0C8]/70 italic'>
              "To create an accessible, empathetic, and technologically superior healthcare ecosystem where quality medical counsel is only a few clicks away."
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className='grid grid-cols-3 gap-3 pt-3 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
            <div className='p-3 bg-[#00311e]/5 dark:bg-[#202833]/60 border border-[#00311e]/10 dark:border-[#EAE0C8]/15'>
              <p className='text-lg font-bold text-[#00311e] dark:text-[#EAE0C8]'>100+</p>
              <p className='text-[10px] uppercase tracking-wider text-[#00311e]/60 dark:text-[#EAE0C8]/60 font-semibold'>Doctors</p>
            </div>
            <div className='p-3 bg-[#00311e]/5 dark:bg-[#202833]/60 border border-[#00311e]/10 dark:border-[#EAE0C8]/15'>
              <p className='text-lg font-bold text-[#00311e] dark:text-[#EAE0C8]'>50k+</p>
              <p className='text-[10px] uppercase tracking-wider text-[#00311e]/60 dark:text-[#EAE0C8]/60 font-semibold'>Consultations</p>
            </div>
            <div className='p-3 bg-[#00311e]/5 dark:bg-[#202833]/60 border border-[#00311e]/10 dark:border-[#EAE0C8]/15'>
              <p className='text-lg font-bold text-[#00311e] dark:text-[#EAE0C8]'>24/7</p>
              <p className='text-[10px] uppercase tracking-wider text-[#00311e]/60 dark:text-[#EAE0C8]/60 font-semibold'>Availability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose MedSync: 4 Core Pillars */}
      <div className='mt-16 mb-8'>
        <div className='text-center space-y-2 mb-8'>
          <div className='inline-flex items-center gap-2 border border-[#00311e]/20 dark:border-[#EAE0C8]/20 bg-[#00311e]/5 dark:bg-[#EAE0C8]/10 px-3 py-1 text-[11px] font-bold tracking-widest uppercase'>
            Platform Pillars
          </div>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>
            Why Choose MedSync
          </h2>
          <p className='text-xs sm:text-sm text-[#00311e]/70 dark:text-[#EAE0C8]/70 max-w-lg mx-auto font-light'>
            Engineered from the ground up to empower both patients and medical practitioners.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          
          <div className='bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 p-6 flex flex-col justify-between shadow-sm hover:border-[#00311e] dark:hover:border-[#EAE0C8] hover:-translate-y-1 transition-all duration-300'>
            <div>
              <div className='w-12 h-12 bg-[#fef7e5] dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-center text-2xl mb-4'>
                ⚡
              </div>
              <h3 className='font-bold text-base text-[#00311e] dark:text-[#EAE0C8] mb-2'>
                Zero Wait Scheduling
              </h3>
              <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 leading-relaxed font-light'>
                Instant confirmation and real-time calendar synchronization without tedious phone holds or manual triage.
              </p>
            </div>
            <div className='mt-4 pt-3 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 text-[11px] font-bold uppercase tracking-wider text-[#00311e]/60 dark:text-[#EAE0C8]/60'>
              Instant Booking
            </div>
          </div>

          <div className='bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 p-6 flex flex-col justify-between shadow-sm hover:border-[#00311e] dark:hover:border-[#EAE0C8] hover:-translate-y-1 transition-all duration-300'>
            <div>
              <div className='w-12 h-12 bg-[#fef7e5] dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-center text-2xl mb-4'>
                🩺
              </div>
              <h3 className='font-bold text-base text-[#00311e] dark:text-[#EAE0C8] mb-2'>
                Verified Specialists
              </h3>
              <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 leading-relaxed font-light'>
                Stringently vetted clinical credentials, degrees, and hospital affiliations ensuring trustworthy diagnostic counsel.
              </p>
            </div>
            <div className='mt-4 pt-3 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 text-[11px] font-bold uppercase tracking-wider text-[#00311e]/60 dark:text-[#EAE0C8]/60'>
              Vetted Care
            </div>
          </div>

          <div className='bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 p-6 flex flex-col justify-between shadow-sm hover:border-[#00311e] dark:hover:border-[#EAE0C8] hover:-translate-y-1 transition-all duration-300'>
            <div>
              <div className='w-12 h-12 bg-[#fef7e5] dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-center text-2xl mb-4'>
                🔒
              </div>
              <h3 className='font-bold text-base text-[#00311e] dark:text-[#EAE0C8] mb-2'>
                Confidential & Secure
              </h3>
              <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 leading-relaxed font-light'>
                HIPAA-compliant architectural standards with end-to-end data encryption protecting your health records.
              </p>
            </div>
            <div className='mt-4 pt-3 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 text-[11px] font-bold uppercase tracking-wider text-[#00311e]/60 dark:text-[#EAE0C8]/60'>
              Data Protection
            </div>
          </div>

          <div className='bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 p-6 flex flex-col justify-between shadow-sm hover:border-[#00311e] dark:hover:border-[#EAE0C8] hover:-translate-y-1 transition-all duration-300'>
            <div>
              <div className='w-12 h-12 bg-[#fef7e5] dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-center text-2xl mb-4'>
                📍
              </div>
              <h3 className='font-bold text-base text-[#00311e] dark:text-[#EAE0C8] mb-2'>
                Local & Pan-India Reach
              </h3>
              <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 leading-relaxed font-light'>
                GPS-enabled discovery connecting you with premier clinics in your city, district, and neighboring localities.
              </p>
            </div>
            <div className='mt-4 pt-3 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 text-[11px] font-bold uppercase tracking-wider text-[#00311e]/60 dark:text-[#EAE0C8]/60'>
              Proximity Search
            </div>
          </div>

        </div>
      </div>

      {/* Bottom CTA Box */}
      <div className='my-14 bg-[#00311e] dark:bg-[#181E26] border border-[#00311e] dark:border-[#EAE0C8]/25 p-8 sm:p-12 text-[#fef7e5] dark:text-[#EAE0C8] flex flex-col md:flex-row items-center justify-between gap-6 shadow-md'>
        <div className='space-y-2 text-center md:text-left'>
          <h3 className='text-2xl sm:text-3xl font-bold tracking-tight'>Ready to Experience Better Healthcare?</h3>
          <p className='text-sm text-[#fef7e5]/80 dark:text-[#EAE0C8]/80 font-light max-w-xl'>
            Join thousands of patients who rely on MedSync for verified doctor appointments and simplified healthcare management.
          </p>
        </div>
        <div className='flex flex-wrap gap-3'>
          <button 
            onClick={() => { navigate('/doctors'); window.scrollTo(0, 0); }}
            className='bg-[#fef7e5] text-[#00311e] dark:bg-[#EAE0C8] dark:text-[#202833] hover:bg-white px-7 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm'
          >
            Find a Doctor ➔
          </button>
          <button 
            onClick={() => { navigate('/contact'); window.scrollTo(0, 0); }}
            className='border border-[#fef7e5]/40 dark:border-[#EAE0C8]/40 hover:bg-[#fef7e5]/10 text-[#fef7e5] dark:text-[#EAE0C8] px-7 py-3 text-xs font-bold uppercase tracking-wider transition-all'
          >
            Contact Support
          </button>
        </div>
      </div>

    </div>
  )
}

export default About;
