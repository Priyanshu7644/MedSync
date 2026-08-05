import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const Complaints = () => {
    const { aToken, complaints, getAllComplaints, resolveComplaint } = useContext(AdminContext);

    useEffect(() => {
        if (aToken) {
            getAllComplaints();
        }
    }, [aToken]);

    return (
        <div className='m-5 transition-colors'>
            <h1 className='text-lg font-medium text-gray-700 dark:text-white mb-4'>User Complaints & Support Tickets</h1>
            
            <div className='bg-white dark:bg-gray-800 border dark:border-gray-700 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-sm'>
                <div className='hidden sm:grid grid-cols-[0.5fr_2fr_3fr_4fr_1fr_1fr] grid-flow-col py-3 px-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300'>
                    <p>#</p>
                    <p>User</p>
                    <p>Subject</p>
                    <p>Description</p>
                    <p>Status</p>
                    <p>Action</p>
                </div>

                {complaints.length === 0 ? (
                    <div className='p-6 text-center text-gray-500 dark:text-gray-400'>No complaints found.</div>
                ) : (
                    complaints.reverse().map((item, index) => (
                        <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_3fr_4fr_1fr_1fr] items-center text-gray-500 dark:text-gray-300 py-4 px-6 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors' key={index}>
                            <p className='max-sm:hidden'>{index + 1}</p>
                            <div className='flex items-center gap-2'>
                                <img className='w-8 h-8 rounded-full object-cover' src={item.userData.image} alt="" /> 
                                <p className='font-medium'>{item.userData.name}</p>
                            </div>
                            <p className='font-medium text-gray-700 dark:text-white truncate pr-2'>{item.subject}</p>
                            <p className='text-xs sm:text-sm truncate pr-4' title={item.description}>{item.description}</p>
                            <p>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                    {item.status}
                                </span>
                            </p>
                            
                            <div className='flex justify-end sm:justify-start gap-2'>
                                {item.status === 'Resolved' ? (
                                    <p className='text-green-500 text-xs font-medium'>Done</p>
                                ) : (
                                    <button 
                                        onClick={() => resolveComplaint(item._id)} 
                                        className='px-3 py-1 bg-green-50 text-green-600 border border-green-200 dark:border-green-800 dark:bg-green-900/20 rounded-full text-xs font-medium hover:bg-green-600 hover:text-white transition-colors'
                                    >
                                        Resolve
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Complaints;
