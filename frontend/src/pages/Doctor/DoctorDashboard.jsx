import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { dtoken, dashData, getDashData, profileData, getProfileData, completeAppointment, cancelAppointment, currencySymbol } = useContext(DoctorContext);
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState('all');

  useEffect(() => {
    if (dtoken) {
      getDashData();
      getProfileData();
    }
  }, [dtoken]);

  if (!dashData) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  const latestAppointments = dashData.latestAppointments || [];
  
  const filteredAppointments = latestAppointments.filter(item => {
    if (filterTab === 'completed') return item.isCompleted && !item.cancelled;
    if (filterTab === 'pending') return !item.isCompleted && !item.cancelled;
    if (filterTab === 'cancelled') return item.cancelled;
    return true;
  });

  const completedCount = latestAppointments.filter(a => a.isCompleted && !a.cancelled).length;
  const pendingCount = latestAppointments.filter(a => !a.isCompleted && !a.cancelled).length;
  const cancelledCount = latestAppointments.filter(a => a.cancelled).length;

  return (
    <div className='space-y-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors pb-10'>
      
      {/* Top Header Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <span className={`w-2 h-2 rounded-full ${profileData?.available ? 'bg-emerald-500' : 'bg-neutral-400'}`}></span>
            <span className='text-[10px] font-bold uppercase tracking-wider text-[#00311e]/70 dark:text-[#EAE0C8]/70'>
              {profileData?.available ? 'Accepting Consultations' : 'Off-duty'}
            </span>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>
            Doctor Dashboard
          </h1>
          <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>
            Welcome back, <span className='font-semibold text-[#00311e] dark:text-[#EAE0C8]'>{profileData?.name || 'Doctor'}</span>. Review patient consultations and practice metrics.
          </p>
        </div>

        <button 
          onClick={() => navigate('/doctor/appointments')}
          className='px-4 py-2 rounded-lg bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] text-xs font-bold hover:opacity-90 transition-opacity shadow-sm self-start sm:self-auto'
        >
          View All Appointments ➔
        </button>
      </div>

      {/* 3 Real Metric Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
        
        {/* Metric 1: Earnings */}
        <div className='bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-xl p-5 shadow-sm'>
          <div className='flex items-center justify-between text-[#00311e]/70 dark:text-[#EAE0C8]/70 text-xs mb-2'>
            <span className='font-semibold uppercase tracking-wider text-[11px]'>Total Earnings</span>
            <span className='w-8 h-8 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] flex items-center justify-center font-bold text-[#00311e] dark:text-[#EAE0C8]'>$</span>
          </div>
          <h3 className='text-3xl font-extrabold text-[#00311e] dark:text-[#EAE0C8] tracking-tight'>
            {currencySymbol}{dashData.earnings}
          </h3>
          <p className='text-[11px] text-[#00311e]/60 dark:text-[#EAE0C8]/60 mt-2'>Earned revenue from booked sessions</p>
        </div>

        {/* Metric 2: Appointments */}
        <div className='bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-xl p-5 shadow-sm'>
          <div className='flex items-center justify-between text-[#00311e]/70 dark:text-[#EAE0C8]/70 text-xs mb-2'>
            <span className='font-semibold uppercase tracking-wider text-[11px]'>Total Appointments</span>
            <span className='w-8 h-8 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] flex items-center justify-center text-sm'>📅</span>
          </div>
          <h3 className='text-3xl font-extrabold text-[#00311e] dark:text-[#EAE0C8] tracking-tight'>
            {dashData.appointments}
          </h3>
          <div className='flex items-center gap-2 mt-2 text-[11px] text-[#00311e]/70 dark:text-[#EAE0C8]/70'>
            <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>{completedCount} Completed</span>
            <span>•</span>
            <span className='font-semibold'>{pendingCount} Pending</span>
          </div>
        </div>

        {/* Metric 3: Patients */}
        <div className='bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-xl p-5 shadow-sm'>
          <div className='flex items-center justify-between text-[#00311e]/70 dark:text-[#EAE0C8]/70 text-xs mb-2'>
            <span className='font-semibold uppercase tracking-wider text-[11px]'>Registered Patients</span>
            <span className='w-8 h-8 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] flex items-center justify-center text-sm'>👥</span>
          </div>
          <h3 className='text-3xl font-extrabold text-[#00311e] dark:text-[#EAE0C8] tracking-tight'>
            {dashData.patients}
          </h3>
          <p className='text-[11px] text-[#00311e]/60 dark:text-[#EAE0C8]/60 mt-2'>Patients registered under your care</p>
        </div>

      </div>

      {/* Recent Appointments Stream */}
      <div className='bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-xl overflow-hidden shadow-sm'>
        
        {/* Table Top Header with Status Tabs */}
        <div className='p-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#00311e]/5 dark:bg-[#202833]/50'>
          <div>
            <h3 className='text-sm font-bold text-[#00311e] dark:text-[#EAE0C8]'>Recent Clinical Appointments</h3>
            <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>Real-time patient schedule and consultation status.</p>
          </div>

          <div className='flex items-center gap-1.5 p-1 rounded-lg bg-[#00311e]/10 dark:bg-[#202833] text-xs font-semibold self-start sm:self-auto'>
            {['all', 'pending', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1 rounded-md capitalize transition-all ${
                  filterTab === tab
                    ? 'bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] font-bold shadow-sm'
                    : 'text-[#00311e]/70 dark:text-[#EAE0C8]/70 hover:text-[#00311e] dark:hover:text-[#EAE0C8]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className='p-12 text-center text-[#00311e]/60 dark:text-[#EAE0C8]/60 text-xs'>
            No appointments found in this category.
          </div>
        ) : (
          <div className='divide-y divide-[#00311e]/10 dark:divide-[#EAE0C8]/10'>
            {filteredAppointments.map((item, index) => (
              <div 
                key={index}
                className='p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#00311e]/5 dark:hover:bg-[#EAE0C8]/5 transition-colors'
              >
                {/* Patient details */}
                <div className='flex items-center gap-3'>
                  <img 
                    className='w-10 h-10 rounded-full object-cover shrink-0' 
                    src={item.userData?.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                    alt="" 
                  />
                  <div>
                    <h4 className='text-xs font-bold text-[#00311e] dark:text-[#EAE0C8]'>{item.userData?.name || 'Patient'}</h4>
                    <p className='text-[11px] text-[#00311e]/70 dark:text-[#EAE0C8]/70 flex items-center gap-2 mt-0.5'>
                      <span>📅 {item.slotDate}</span>
                      {item.slotTime && <span>• ⏰ {item.slotTime}</span>}
                      <span>•</span>
                      <span className='font-bold text-[#00311e] dark:text-[#EAE0C8]'>{currencySymbol}{item.amount}</span>
                    </p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className='flex items-center justify-between sm:justify-end gap-3'>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    item.payment 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' 
                      : 'bg-[#00311e]/10 text-[#00311e] border-[#00311e]/20 dark:bg-[#EAE0C8]/10 dark:text-[#EAE0C8] dark:border-[#EAE0C8]/20'
                  }`}>
                    {item.payment ? 'Online' : 'Cash'}
                  </span>

                  {item.cancelled ? (
                    <span className='text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400'>
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className='text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400'>
                      ✓ Completed
                    </span>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <span className='text-[10px] font-bold text-amber-600 dark:text-amber-400'>Pending</span>
                      <button 
                        onClick={() => completeAppointment(item._id)} 
                        className='px-2.5 py-1 rounded-md bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] text-xs font-semibold hover:opacity-90 transition-opacity'
                      >
                        ✓ Done
                      </button>
                      <button 
                        onClick={() => cancelAppointment(item._id)} 
                        className='px-2 py-1 rounded-md text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-300 dark:border-rose-800 transition-colors'
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default DoctorDashboard;
