import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';

const Complaints = () => {
    const { aToken, complaints, getAllComplaints, resolveComplaint } = useContext(AdminContext);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (aToken) {
            getAllComplaints();
        }
    }, [aToken]);

    const filtered = complaints.filter(item => {
        if (filterStatus === 'pending') return item.status !== 'Resolved';
        if (filterStatus === 'resolved') return item.status === 'Resolved';
        return true;
    });

    return (
        <div className='space-y-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors pb-10'>
            
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/15'>
                <div>
                    <h1 className='text-2xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>Support & User Inquiries</h1>
                    <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>Review patient support tickets, service feedback, and inquiries.</p>
                </div>

                <div className='flex items-center gap-1.5 p-1 rounded-lg bg-[#00311e]/5 dark:bg-[#181E26] border border-[#00311e]/10 dark:border-[#EAE0C8]/10 text-xs font-semibold'>
                    {['all', 'pending', 'resolved'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilterStatus(tab)}
                            className={`px-3 py-1 rounded-md capitalize transition-all ${
                                filterStatus === tab
                                    ? 'bg-[#00311e] dark:bg-[#EAE0C8] text-[#fef7e5] dark:text-[#202833] font-bold shadow-sm'
                                    : 'text-[#00311e]/70 hover:text-[#00311e] dark:text-[#EAE0C8]/70 dark:hover:text-[#EAE0C8]'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Complaints Table */}
            <div className='bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/15 rounded-xl overflow-hidden shadow-sm'>
                
                <div className='hidden md:grid grid-cols-[0.5fr_2fr_2fr_3fr_1fr_1fr] gap-3 py-3.5 px-6 border-b border-[#00311e]/10 dark:border-[#EAE0C8]/10 bg-[#00311e]/5 dark:bg-[#202833]/40 text-[11px] font-bold uppercase tracking-wider text-[#00311e]/60 dark:text-[#EAE0C8]/60'>
                    <p>#</p>
                    <p>Patient / User</p>
                    <p>Subject</p>
                    <p>Inquiry Details</p>
                    <p>Status</p>
                    <p className='text-right'>Action</p>
                </div>

                {filtered.length === 0 ? (
                    <div className='p-12 text-center text-[#00311e]/50 dark:text-[#EAE0C8]/50 text-xs'>
                        No support tickets matching this status.
                    </div>
                ) : (
                    <div className='divide-y divide-[#00311e]/10 dark:divide-[#EAE0C8]/10'>
                        {filtered.map((item, index) => (
                            <div 
                                key={index}
                                className='flex flex-col md:grid md:grid-cols-[0.5fr_2fr_2fr_3fr_1fr_1fr] gap-3 items-start md:items-center py-4 px-6 hover:bg-[#00311e]/5 dark:hover:bg-[#202833]/30 transition-colors'
                            >
                                <p className='text-xs font-semibold text-[#00311e]/40 dark:text-[#EAE0C8]/40 hidden md:block'>{index + 1}</p>

                                {/* User */}
                                <div className='flex items-center gap-3'>
                                    <img 
                                        className='w-8 h-8 rounded-full object-cover shrink-0' 
                                        src={item.userData?.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                                        alt="" 
                                    />
                                    <div>
                                        <p className='text-xs font-bold text-[#00311e] dark:text-[#EAE0C8] truncate'>{item.userData?.name || 'User'}</p>
                                        <p className='text-[10px] text-[#00311e]/60 dark:text-[#EAE0C8]/60 truncate'>{item.userData?.email}</p>
                                    </div>
                                </div>

                                {/* Subject */}
                                <p className='text-xs font-semibold text-[#00311e] dark:text-[#EAE0C8] truncate'>{item.subject}</p>

                                {/* Description */}
                                <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 line-clamp-2' title={item.description}>
                                    {item.description}
                                </p>

                                {/* Status */}
                                <div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                        item.status === 'Resolved'
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                            : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>

                                {/* Action */}
                                <div className='w-full md:w-auto flex justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
                                    {item.status === 'Resolved' ? (
                                        <span className='text-[11px] font-semibold text-[#00311e]/60 dark:text-[#EAE0C8]/60'>✓ Closed</span>
                                    ) : (
                                        <button 
                                            onClick={() => resolveComplaint(item._id)} 
                                            className='px-3 py-1 rounded-md text-xs font-semibold text-[#00311e] bg-[#00311e]/10 hover:bg-[#00311e] hover:text-[#fef7e5] dark:text-[#EAE0C8] dark:bg-[#EAE0C8]/10 dark:hover:bg-[#EAE0C8] dark:hover:text-[#202833] border border-[#00311e]/20 dark:border-[#EAE0C8]/20 transition-colors'
                                        >
                                            Resolve Ticket
                                        </button>
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

export default Complaints;
