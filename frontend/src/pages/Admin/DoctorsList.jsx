import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const filtered = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors pb-10'>
      
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/15'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>Physician Directory</h1>
          <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>{doctors.length} Verified medical specialists on the platform.</p>
        </div>

        <div className='flex items-center gap-3'>
          <div className='relative w-full sm:w-64'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[#00311e]/40 dark:text-[#EAE0C8]/40 text-xs'>🔍</span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search roster..."
              className='w-full pl-8 pr-4 py-2 border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg bg-white dark:bg-[#181E26] text-xs outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] text-[#00311e] dark:text-[#EAE0C8] transition-colors placeholder:text-[#00311e]/40 dark:placeholder:text-[#EAE0C8]/40'
            />
          </div>
          <button 
            onClick={() => navigate('/admin/add-doctor')}
            className='px-3.5 py-2 rounded-lg bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] text-xs font-bold whitespace-nowrap hover:opacity-90 transition-opacity'
          >
            + Add Doctor
          </button>
        </div>
      </div>

      {/* Roster Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {filtered.length === 0 ? (
          <div className='col-span-full py-16 text-center text-[#00311e]/50 dark:text-[#EAE0C8]/50 text-xs'>
            No doctors found in the directory.
          </div>
        ) : (
          filtered.map((item, index) => (
            <div 
              key={index}
              className='bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/15 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group'
            >
              <div>
                <div className='aspect-square bg-[#00311e]/5 dark:bg-[#202833] overflow-hidden relative'>
                  <img className='w-full h-full object-cover object-top' src={item.image} alt={item.name} />
                  <div className='absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/95 dark:bg-[#181E26]/95 border border-[#00311e]/15 dark:border-[#EAE0C8]/15 shadow-sm'>
                    <input 
                      type="checkbox" 
                      checked={item.available} 
                      onChange={() => changeAvailability(item._id)}
                      className='cursor-pointer text-[#00311e] dark:text-[#EAE0C8] rounded focus:ring-0 w-3 h-3 accent-[#00311e] dark:accent-[#EAE0C8]'
                    />
                    <span className='text-[10px] font-bold text-[#00311e] dark:text-[#EAE0C8]'>
                      {item.available ? 'Active' : 'Off'}
                    </span>
                  </div>
                </div>

                <div className='p-4'>
                  <h3 className='font-bold text-sm text-[#00311e] dark:text-[#EAE0C8] truncate'>{item.name}</h3>
                  <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5 truncate'>{item.speciality} • {item.degree}</p>
                  <p className='text-[11px] text-[#00311e]/50 dark:text-[#EAE0C8]/50 mt-1 truncate'>
                    📍 {item.address?.locality || item.address?.line1 || 'Clinic Registered'}
                  </p>
                </div>
              </div>

              <div className='px-4 py-3 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 bg-[#00311e]/5 dark:bg-[#202833]/40 flex items-center justify-between text-xs'>
                <span className='font-bold text-[#00311e] dark:text-[#EAE0C8]'>${item.fees} / visit</span>
                <span className='text-[#00311e]/60 dark:text-[#EAE0C8]/60 text-[11px]'>{item.experience} Exp</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default DoctorsList;
