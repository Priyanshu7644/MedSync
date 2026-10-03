import React from 'react';

const PageLoader = ({ text = "Synchronizing healthcare..." }) => {
  return (
    <div className='min-h-[70vh] w-full flex flex-col items-center justify-center p-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors duration-300 select-none'>
      <div className='relative flex flex-col items-center max-w-sm w-full'>
        
        {/* Glow Halo Backdrop */}
        <div className='absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 rounded-full blur-2xl opacity-70 animate-pulse pointer-events-none'></div>

        {/* Outer Circular Medical Pulse Container */}
        <div className='relative w-28 h-28 flex items-center justify-center mb-6'>
          
          {/* Animated Outer Orbit Rings */}
          <div className='absolute inset-0 rounded-full border border-emerald-600/30 dark:border-emerald-400/30 animate-[spin_8s_linear_infinite]'></div>
          <div className='absolute inset-2 rounded-full border border-dashed border-emerald-500/40 dark:border-emerald-300/40 animate-[spin_12s_linear_infinite_reverse]'></div>
          <div className='absolute inset-4 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 backdrop-blur-sm shadow-inner'></div>

          {/* Central Medical Cross / Heart Pulse Icon */}
          <div className='relative z-10 flex items-center justify-center'>
            <svg 
              className='w-12 h-12 text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-[pulse_1.5s_ease-in-out_infinite]' 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M12 5v14" className="stroke-emerald-500 dark:stroke-emerald-300 stroke-[2.5]" />
              <path d="M5 12h14" className="stroke-emerald-500 dark:stroke-emerald-300 stroke-[2.5]" />
            </svg>
          </div>

          {/* Orbiting Radar Dot */}
          <div className='absolute inset-0 animate-[spin_3s_linear_infinite]'>
            <div className='w-2.5 h-2.5 bg-emerald-500 dark:bg-emerald-300 rounded-full shadow-[0_0_8px_#10b981] absolute -top-1 left-1/2 -translate-x-1/2'></div>
          </div>
        </div>

        {/* ECG Heartbeat Line Waveform */}
        <div className='w-48 h-8 relative flex items-center justify-center overflow-hidden mb-3'>
          <svg 
            className='w-full h-full text-emerald-600 dark:text-emerald-400' 
            viewBox="0 0 200 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background static faint path */}
            <path 
              d="M0 20 H50 L60 8 L70 32 L80 12 L90 28 L100 20 H200" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeOpacity="0.2" 
            />
            {/* Animated glowing ECG pulse wave */}
            <path 
              d="M0 20 H50 L60 8 L70 32 L80 12 L90 28 L100 20 H200" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-ecg"
            />
          </svg>
        </div>

        {/* Brand & Loading Status */}
        <div className='text-center space-y-1 z-10'>
          <div className='flex items-center justify-center gap-1.5'>
            <span className='font-bold text-lg tracking-wider text-[#00311e] dark:text-[#EAE0C8]'>
              Med<span className='text-emerald-600 dark:text-emerald-400'>Sync</span>
            </span>
            <span className='flex h-2 w-2 relative'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500'></span>
            </span>
          </div>
          
          <p className='text-xs font-medium text-[#00311e]/70 dark:text-[#EAE0C8]/70 tracking-wide transition-colors'>
            {text}
          </p>
        </div>

        {/* Micro Shimmer Progress Track */}
        <div className='w-36 h-1 bg-[#00311e]/10 dark:bg-[#EAE0C8]/10 rounded-full overflow-hidden mt-4'>
          <div className='h-full w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-full animate-shimmer'></div>
        </div>

      </div>
    </div>
  );
};

export default PageLoader;
