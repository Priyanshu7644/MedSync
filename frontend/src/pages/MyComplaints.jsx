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
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 dark:text-white border-b border-gray-200 dark:border-gray-800'>My Support Tickets</p>
            
            <div className='flex flex-col md:flex-row gap-10 mt-8'>
                {/* Submit Form */}
                <div className='flex-1 border dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm'>
                    <h2 className='text-xl font-medium text-gray-700 dark:text-white mb-4'>Create a New Ticket</h2>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm text-gray-600 dark:text-gray-300'>Subject</label>
                            <input 
                                type="text" 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                placeholder="E.g. Issue with booking"
                                className='border dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-white outline-primary'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm text-gray-600 dark:text-gray-300'>Description</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={5}
                                placeholder="Describe your issue in detail..."
                                className='border dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-white outline-primary resize-none'
                            />
                        </div>
                        <button 
                            disabled={isSubmitting}
                            className='bg-primary text-white py-2.5 rounded-lg mt-2 font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300'
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </form>
                </div>

                {/* Complaints List */}
                <div className='flex-1 border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm'>
                    <div className='p-6 border-b dark:border-gray-700'>
                        <h2 className='text-xl font-medium text-gray-700 dark:text-white'>Past Tickets</h2>
                    </div>
                    <div className='max-h-[500px] overflow-y-auto'>
                        {complaints.length === 0 ? (
                            <p className='p-6 text-gray-500 dark:text-gray-400 text-center'>You haven't submitted any tickets yet.</p>
                        ) : (
                            complaints.reverse().map((ticket, index) => (
                                <div key={index} className='p-6 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
                                    <div className='flex justify-between items-start mb-2'>
                                        <h3 className='font-medium text-gray-800 dark:text-white'>{ticket.subject}</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className='text-sm text-gray-600 dark:text-gray-300 mb-3'>{ticket.description}</p>
                                    <p className='text-xs text-gray-400 dark:text-gray-500'>Submitted on {new Date(ticket.date).toLocaleDateString()}</p>
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
