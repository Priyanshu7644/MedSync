import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const MyComplaints = () => {
    const { complaints, submitComplaint } = useContext(AppContext);
    
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await submitComplaint(subject, description);
        if (success) {
            setSubject('');
            setDescription('');
        }
        setIsSubmitting(false);
    }

    return (
        <div className='py-6 text-[#202833] dark:text-[#EAE0C8] transition-colors'>
            <p className='pb-3 font-bold uppercase tracking-wider text-sm border-b border-[#202833]/15 dark:border-[#EAE0C8]/20'>My Support Tickets</p>
            
            <div className='flex flex-col md:flex-row gap-8 mt-6'>
                {/* Submit Form */}
                <div className='flex-1 border border-[#202833]/15 dark:border-[#EAE0C8]/20 p-6 bg-white/95 dark:bg-[#181E26] shadow-sm'>
                    <h2 className='text-base font-bold text-[#202833] dark:text-[#EAE0C8] mb-4 uppercase tracking-wider'>Create a New Ticket</h2>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-semibold uppercase tracking-wider text-[#202833]/70 dark:text-[#EAE0C8]/70'>Subject</label>
                            <input 
                                type="text" 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                placeholder="E.g. Issue with booking"
                                className='border border-[#202833]/20 dark:border-[#EAE0C8]/30 px-3.5 py-2.5 bg-[#EAE0C8]/20 dark:bg-[#202833]/50 text-[#202833] dark:text-[#EAE0C8] text-sm outline-none focus:border-[#202833] dark:focus:border-[#EAE0C8]'
                            />
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-semibold uppercase tracking-wider text-[#202833]/70 dark:text-[#EAE0C8]/70'>Description</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={5}
                                placeholder="Describe your issue in detail..."
                                className='border border-[#202833]/20 dark:border-[#EAE0C8]/30 px-3.5 py-2.5 bg-[#EAE0C8]/20 dark:bg-[#202833]/50 text-[#202833] dark:text-[#EAE0C8] text-sm outline-none focus:border-[#202833] dark:focus:border-[#EAE0C8] resize-none'
                            />
                        </div>
                        <button 
                            disabled={isSubmitting}
                            className='bg-[#202833] hover:bg-[#161C24] dark:bg-[#EAE0C8] dark:hover:bg-white text-[#EAE0C8] dark:text-[#202833] py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 mt-2'
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Ticket ➔'}
                        </button>
                    </form>
                </div>

                {/* Complaints List */}
                <div className='flex-1 border border-[#202833]/15 dark:border-[#EAE0C8]/20 bg-white/95 dark:bg-[#181E26] shadow-sm flex flex-col'>
                    <div className='p-6 border-b border-[#202833]/10 dark:border-[#EAE0C8]/10'>
                        <h2 className='text-base font-bold text-[#202833] dark:text-[#EAE0C8] uppercase tracking-wider'>Past Tickets</h2>
                    </div>
                    <div className='max-h-[500px] overflow-y-auto flex-1'>
                        {complaints.length === 0 ? (
                            <p className='p-6 text-[#202833]/60 dark:text-[#EAE0C8]/60 text-center text-sm'>You haven't submitted any tickets yet.</p>
                        ) : (
                            complaints.reverse().map((ticket, index) => (
                                <div key={index} className='p-5 border-b border-[#202833]/10 dark:border-[#EAE0C8]/10 hover:bg-[#EAE0C8]/20 dark:hover:bg-[#202833]/40 transition-colors'>
                                    <div className='flex justify-between items-start mb-2'>
                                        <h3 className='font-bold text-sm text-[#202833] dark:text-[#EAE0C8]'>{ticket.subject}</h3>
                                        <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${ticket.status === 'Resolved' ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className='text-xs text-[#202833]/80 dark:text-[#EAE0C8]/80 mb-2 leading-relaxed'>{ticket.description}</p>
                                    <p className='text-[10px] text-[#202833]/50 dark:text-[#EAE0C8]/50'>Submitted on {new Date(ticket.date).toLocaleDateString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyComplaints;
