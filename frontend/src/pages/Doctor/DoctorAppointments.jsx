import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorAppointments = () => {
  const { dtoken, appointments, getAppointments, completeAppointment, cancelAppointment, currencySymbol } = useContext(DoctorContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (dtoken) {
      getAppointments();
    }
  }, [dtoken]);

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? `${age} yrs` : 'N/A';
  }

  const filtered = appointments.filter(item => {
    const matchesSearch = item.userData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.slotDate?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === 'completed') return item.isCompleted && !item.cancelled;
    if (statusFilter === 'pending') return !item.isCompleted && !item.cancelled;
    if (statusFilter === 'cancelled') return item.cancelled;
    return true;
  });

  const totalCompleted = appointments.filter(a => a.isCompleted && !a.cancelled).length;
  const totalPending = appointments.filter(a => !a.isCompleted && !a.cancelled).length;
  const totalCancelled = appointments.filter(a => a.cancelled).length;

  return (
    <div className='space-y-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors pb-10'>
      
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>Clinical Consultations</h1>
          <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>Track patient schedules, verify payments, and manage clinical outcomes.</p>
        </div>

        {/* Counters */}
        <div className='flex items-center gap-2 flex-wrap'>
          <div className='px-3 py-1 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] text-center border border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
            <span className='text-[10px] text-[#00311e]/70 dark:text-[#EAE0C8]/70 font-semibold uppercase mr-1.5'>Total</span>
            <span className='text-xs font-bold text-[#00311e] dark:text-[#EAE0C8]'>{appointments.length}</span>
          </div>
          <div className='px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-center border border-emerald-300 dark:border-emerald-800'>
            <span className='text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold uppercase mr-1.5'>Completed</span>
            <span className='text-xs font-bold text-emerald-800 dark:text-emerald-300'>{totalCompleted}</span>
          </div>
          <div className='px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-center border border-amber-300 dark:border-amber-800'>
            <span className='text-[10px] text-amber-800 dark:text-amber-300 font-semibold uppercase mr-1.5'>Pending</span>
            <span className='text-xs font-bold text-amber-800 dark:text-amber-300'>{totalPending}</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
        
        {/* Search */}
        <div className='relative w-full sm:w-72'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[#00311e]/50 dark:text-[#EAE0C8]/50 text-xs'>🔍</span>
          <input 
            type="text"
            placeholder="Search patient name or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-8 pr-4 py-2 rounded-lg bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 text-[#00311e] dark:text-[#EAE0C8] text-xs outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors'
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className='absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#00311e]/50 dark:text-[#EAE0C8]/50'>✕</button>
          )}
        </div>

        {/* Filter Pills */}
        <div className='flex items-center gap-1.5 p-1 rounded-lg bg-[#00311e]/10 dark:bg-[#202833] text-xs font-semibold w-full sm:w-auto justify-center sm:justify-start'>
          {[
            { id: 'all', label: `All (${appointments.length})` },
            { id: 'pending', label: `Pending (${totalPending})` },
            { id: 'completed', label: `Completed (${totalCompleted})` },
            { id: 'cancelled', label: `Cancelled (${totalCancelled})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] font-bold shadow-sm'
                  : 'text-[#00311e]/70 dark:text-[#EAE0C8]/70 hover:text-[#00311e] dark:hover:text-[#EAE0C8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Table Card */}
      <div className='bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-xl overflow-hidden shadow-sm'>
        
        {/* Table Header */}
        <div className='hidden md:grid grid-cols-[0.5fr_2.5fr_1fr_1fr_2.5fr_1fr_1.5fr] gap-3 py-3.5 px-6 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20 bg-[#00311e]/5 dark:bg-[#202833]/50 text-[11px] font-bold uppercase tracking-wider text-[#00311e]/70 dark:text-[#EAE0C8]/70'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Consultation Fee</p>
          <p className='text-right'>Action</p>
        </div>

        {/* Table Body */}
        {filtered.length === 0 ? (
          <div className='p-12 text-center text-[#00311e]/60 dark:text-[#EAE0C8]/60 text-xs'>
            No appointments matching this criteria.
          </div>
        ) : (
          <div className='divide-y divide-[#00311e]/10 dark:divide-[#EAE0C8]/10'>
            {filtered.map((item, index) => (
              <div 
                key={index}
                className='flex flex-col md:grid md:grid-cols-[0.5fr_2.5fr_1fr_1fr_2.5fr_1fr_1.5fr] gap-3 items-start md:items-center py-4 px-6 hover:bg-[#00311e]/5 dark:hover:bg-[#EAE0C8]/5 transition-colors'
              >
                <p className='text-xs font-semibold text-[#00311e]/50 dark:text-[#EAE0C8]/50 hidden md:block'>{index + 1}</p>

                {/* Patient Info */}
                <div className='flex items-center gap-3 w-full md:w-auto justify-between md:justify-start'>
                  <div className='flex items-center gap-3'>
                    <img 
                      className='w-9 h-9 rounded-full object-cover shrink-0' 
                      src={item.userData?.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                      alt="" 
                    />
                    <div>
                      <p className='text-xs font-bold text-[#00311e] dark:text-[#EAE0C8]'>{item.userData?.name || 'Patient'}</p>
                      <p className='text-[10px] text-[#00311e]/70 dark:text-[#EAE0C8]/70 md:hidden'>{item.slotDate} • {item.slotTime}</p>
                    </div>
                  </div>

                  <span className='md:hidden text-xs font-bold text-[#00311e] dark:text-[#EAE0C8]'>
                    {currencySymbol}{item.amount}
                  </span>
                </div>

                {/* Payment Badge */}
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.payment 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' 
                      : 'bg-[#00311e]/10 text-[#00311e] border-[#00311e]/20 dark:bg-[#EAE0C8]/10 dark:text-[#EAE0C8] dark:border-[#EAE0C8]/20'
                  }`}>
                    {item.payment ? 'Online' : 'Cash'}
                  </span>
                </div>

                {/* Age */}
                <p className='text-xs text-[#00311e]/80 dark:text-[#EAE0C8]/80 hidden md:block'>
                  {calculateAge(item.userData?.dob)}
                </p>

                {/* Date & Time */}
                <div className='hidden md:block text-xs'>
                  <p className='font-semibold text-[#00311e] dark:text-[#EAE0C8]'>{item.slotDate}</p>
                  <p className='text-[11px] text-[#00311e]/60 dark:text-[#EAE0C8]/60'>{item.slotTime || 'Standard Slot'}</p>
                </div>

                {/* Fees */}
                <p className='text-xs font-bold text-[#00311e] dark:text-[#EAE0C8] hidden md:block'>
                  {currencySymbol}{item.amount}
                </p>

                {/* Action */}
                <div className='w-full md:w-auto flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
                  {item.cancelled ? (
                    <span className='text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/30 dark:text-rose-400'>
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

export default DoctorAppointments;
