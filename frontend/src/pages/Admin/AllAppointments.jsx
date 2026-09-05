import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AllAppointments = () => {
  const { aToken, doctors, getAllDoctors, appointments, getAllAppointments, cancelAppointment, blockPatient } = useContext(AdminContext);
  const { calculateAge } = useContext(AppContext);

  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
      getAllAppointments();
    }
  }, [aToken]);

  const handleBlockUser = async (userId, isBlocked) => {
    const success = await blockPatient(userId, isBlocked);
    if (success) {
      getAllAppointments();
    }
  }

  // View 1: Doctor Filter Grid
  if (!selectedDoctorId) {
    const filteredDocs = doctors.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.speciality.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className='space-y-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors pb-10'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>Clinical Appointments</h1>
            <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>Select a physician to view schedules, payment receipts, and patient logs.</p>
          </div>

          <div className='relative w-full sm:w-72'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[#00311e]/50 dark:text-[#EAE0C8]/50 text-xs'>🔍</span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by doctor name..."
              className='w-full pl-8 pr-4 py-2 border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-lg bg-white dark:bg-[#181E26] text-xs text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {filteredDocs.map((item, index) => {
            const docApptsCount = appointments.filter(a => a.docId === item._id).length;
            return (
              <div 
                key={index} 
                onClick={() => setSelectedDoctorId(item._id)}
                className='bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 hover:border-[#00311e]/40 dark:hover:border-[#EAE0C8]/40 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-sm'
              >
                <div>
                  <div className='aspect-square bg-[#00311e]/5 dark:bg-[#202833] overflow-hidden relative'>
                    <img className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300' src={item.image} alt={item.name} />
                    <span className='absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00311e]/90 text-[#fef7e5] dark:bg-[#EAE0C8]/90 dark:text-[#202833] backdrop-blur-sm'>
                      {docApptsCount} Bookings
                    </span>
                  </div>
                  <div className='p-4'>
                    <h3 className='font-bold text-sm text-[#00311e] dark:text-[#EAE0C8] truncate group-hover:underline'>{item.name}</h3>
                    <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5 truncate'>{item.speciality}</p>
                  </div>
                </div>

                <div className='px-4 py-2.5 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 bg-[#00311e]/5 dark:bg-[#202833]/50 flex items-center justify-between text-xs font-semibold text-[#00311e] dark:text-[#EAE0C8]'>
                  <span>View Schedule</span>
                  <span className='group-hover:translate-x-0.5 transition-transform'>➔</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // View 2: Appointments List for selected doctor
  const selectedDoctor = doctors.find(doc => doc._id === selectedDoctorId);
  const doctorAppointments = appointments.filter(app => app.docId === selectedDoctorId);

  return (
    <div className='space-y-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors pb-10'>
      
      {/* Top Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
        <div className='flex items-center gap-3.5'>
          <button 
            onClick={() => setSelectedDoctorId(null)}
            className='w-9 h-9 rounded-lg border border-[#00311e]/20 dark:border-[#EAE0C8]/20 bg-white dark:bg-[#181E26] hover:bg-[#00311e]/10 dark:hover:bg-[#202833] flex items-center justify-center text-xs font-bold transition-colors'
            title='Back to Doctors'
          >
            ←
          </button>
          <div>
            <h1 className='text-xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>
              {selectedDoctor?.name || 'Doctor'} • Appointments
            </h1>
            <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>{selectedDoctor?.speciality} • {doctorAppointments.length} Total Bookings</p>
          </div>
        </div>

        <button 
          onClick={() => setSelectedDoctorId(null)}
          className='px-3.5 py-1.5 rounded-lg border border-[#00311e]/20 dark:border-[#EAE0C8]/20 text-xs font-semibold text-[#00311e] dark:text-[#EAE0C8] bg-white dark:bg-[#181E26] hover:bg-[#00311e]/5'
        >
          Change Doctor
        </button>
      </div>

      {/* Appointments Table */}
      <div className='bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-xl overflow-hidden shadow-sm'>
        
        {/* Table Header */}
        <div className='hidden md:grid grid-cols-[0.5fr_2.5fr_1fr_1fr_2.5fr_1fr_1.5fr] gap-3 py-3.5 px-6 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20 bg-[#00311e]/5 dark:bg-[#202833]/50 text-[11px] font-bold uppercase tracking-wider text-[#00311e]/70 dark:text-[#EAE0C8]/70'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fee</p>
          <p className='text-right'>Action</p>
        </div>

        {/* Table Content */}
        {doctorAppointments.length === 0 ? (
          <div className='p-12 text-center text-[#00311e]/60 dark:text-[#EAE0C8]/60 text-xs'>
            No appointments booked for this doctor yet.
          </div>
        ) : (
          <div className='divide-y divide-[#00311e]/10 dark:divide-[#EAE0C8]/10'>
            {doctorAppointments.map((item, index) => (
              <div 
                key={index}
                className='flex flex-col md:grid md:grid-cols-[0.5fr_2.5fr_1fr_1fr_2.5fr_1fr_1.5fr] gap-3 items-start md:items-center py-4 px-6 hover:bg-[#00311e]/5 dark:hover:bg-[#EAE0C8]/5 transition-colors'
              >
                <p className='text-xs font-semibold text-[#00311e]/50 dark:text-[#EAE0C8]/50 hidden md:block'>{index + 1}</p>
                
                {/* Patient Info */}
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

                {/* Payment */}
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
                  ${item.amount}
                </p>

                {/* Actions */}
                <div className='w-full md:w-auto flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
                  {item.cancelled ? (
                    <span className='text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/30 dark:text-rose-400'>
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className='text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400'>
                      Completed
                    </span>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <span className='text-[10px] font-bold text-amber-600 dark:text-amber-400'>Scheduled</span>
                      <button 
                        onClick={() => cancelAppointment(item._id)} 
                        className='px-2.5 py-1 rounded-md text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-300 dark:border-rose-800 transition-colors'
                      >
                        Cancel
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

export default AllAppointments;
