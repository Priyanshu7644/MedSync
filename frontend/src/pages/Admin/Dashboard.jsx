import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';

const Dashboard = () => {
    const { aToken, doctors, getAllDoctors, updateDoctorProfileAdmin, messages, adminGetMessages, adminSendMessage } = useContext(AdminContext);
    
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [docData, setDocData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (aToken) {
            getAllDoctors();
        }
    }, [aToken]);

    useEffect(() => {
        // Poll for messages every 5 seconds if a doctor is selected
        let interval;
        if (selectedDoctor && aToken) {
            interval = setInterval(() => {
                adminGetMessages(selectedDoctor._id);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [selectedDoctor, aToken]);

    const handleSelectDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setDocData(doctor);
        setIsEditing(false);
        adminGetMessages(doctor._id);
    }

    const handleUpdateProfile = async () => {
        const success = await updateDoctorProfileAdmin({
            docId: docData._id,
            name: docData.name,
            fees: Number(docData.fees),
            address: docData.address,
            about: docData.about,
            speciality: docData.speciality,
            available: docData.available,
            degree: docData.degree,
            experience: docData.experience
        });
        if (success) {
            setIsEditing(false);
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        const success = await adminSendMessage(selectedDoctor._id, text);
        if (success) {
            setText('');
        }
    }

    if (selectedDoctor) {
        return (
            <div className='m-5 transition-colors pb-10'>
                <button 
                    onClick={() => setSelectedDoctor(null)} 
                    className='mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors'
                >
                    &larr; Back to Dashboard
                </button>

                <div className='flex flex-col xl:flex-row gap-6'>
                    {/* LEFT PANEL: PROFILE EDITOR */}
                    <div className='flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6'>
                        <div className='flex justify-between items-center mb-6'>
                            <h2 className='text-xl font-medium text-gray-700 dark:text-white'>Doctor Profile</h2>
                            <button 
                                onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isEditing ? 'bg-primary text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </button>
                        </div>

                        <div className='flex gap-4 items-start mb-6 border-b dark:border-gray-700 pb-6'>
                            <img src={docData.image} alt="" className='w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-700 object-cover' />
                            <div className='flex-1'>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={docData.name} 
                                        onChange={(e) => setDocData({...docData, name: e.target.value})}
                                        className='text-xl font-medium mb-1 border rounded px-2 py-1 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                    />
                                ) : (
                                    <h3 className='text-xl font-medium text-gray-800 dark:text-white mb-1'>{docData.name}</h3>
                                )}

                                <div className='flex items-center gap-2 mt-2'>
                                    <input 
                                        type="checkbox" 
                                        checked={docData.available} 
                                        onChange={(e) => isEditing && setDocData({...docData, available: e.target.checked})}
                                        disabled={!isEditing}
                                        id="available"
                                    />
                                    <label htmlFor="available" className='text-sm text-gray-600 dark:text-gray-300'>Available for Bookings</label>
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                            <div>
                                <label className='block text-sm text-gray-500 mb-1'>Speciality</label>
                                {isEditing ? (
                                    <input type="text" value={docData.speciality} onChange={(e) => setDocData({...docData, speciality: e.target.value})} className='w-full border rounded px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white' />
                                ) : (
                                    <p className='text-sm text-gray-800 dark:text-gray-200'>{docData.speciality}</p>
                                )}
                            </div>
                            <div>
                                <label className='block text-sm text-gray-500 mb-1'>Degree</label>
                                {isEditing ? (
                                    <input type="text" value={docData.degree} onChange={(e) => setDocData({...docData, degree: e.target.value})} className='w-full border rounded px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white' />
                                ) : (
                                    <p className='text-sm text-gray-800 dark:text-gray-200'>{docData.degree}</p>
                                )}
                            </div>
                            <div>
                                <label className='block text-sm text-gray-500 mb-1'>Experience</label>
                                {isEditing ? (
                                    <input type="text" value={docData.experience} onChange={(e) => setDocData({...docData, experience: e.target.value})} className='w-full border rounded px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white' />
                                ) : (
                                    <p className='text-sm text-gray-800 dark:text-gray-200'>{docData.experience}</p>
                                )}
                            </div>
                            <div>
                                <label className='block text-sm text-gray-500 mb-1'>Fees ($)</label>
                                {isEditing ? (
                                    <input type="number" value={docData.fees} onChange={(e) => setDocData({...docData, fees: e.target.value})} className='w-full border rounded px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white' />
                                ) : (
                                    <p className='text-sm text-gray-800 dark:text-gray-200'>${docData.fees}</p>
                                )}
                            </div>
                        </div>

                        <div className='mb-6'>
                            <label className='block text-sm text-gray-500 mb-1'>About</label>
                            {isEditing ? (
                                <textarea value={docData.about} onChange={(e) => setDocData({...docData, about: e.target.value})} rows={4} className='w-full border rounded px-3 py-2 text-sm resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white'></textarea>
                            ) : (
                                <p className='text-sm text-gray-800 dark:text-gray-300 leading-relaxed'>{docData.about}</p>
                            )}
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2'>Address</label>
                            <div className='grid grid-cols-1 gap-2'>
                                {isEditing ? (
                                    <>
                                        <input type="text" value={docData.address.line1} onChange={(e) => setDocData({...docData, address: {...docData.address, line1: e.target.value}})} className='w-full border rounded px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white' placeholder="Line 1" />
                                        <input type="text" value={docData.address.line2} onChange={(e) => setDocData({...docData, address: {...docData.address, line2: e.target.value}})} className='w-full border rounded px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white' placeholder="Line 2" />
                                    </>
                                ) : (
                                    <p className='text-sm text-gray-800 dark:text-gray-300'>{docData.address.line1}<br/>{docData.address.line2}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: MESSAGING */}
                    <div className='flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden min-h-[500px] xl:min-h-full'>
                        <div className='p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900'>
                            <h2 className='text-lg font-medium text-gray-700 dark:text-white'>Direct Message</h2>
                            <p className='text-xs text-gray-500'>Send a direct message to {docData.name}</p>
                        </div>
                        
                        <div className='flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50/50 dark:bg-gray-800/50'>
                            {messages.length === 0 ? (
                                <div className='m-auto text-sm text-gray-400'>No messages yet. Say hello!</div>
                            ) : (
                                messages.map((msg, index) => (
                                    <div key={index} className={`flex flex-col max-w-[75%] ${msg.senderId === 'admin' ? 'self-end items-end' : 'self-start items-start'}`}>
                                        <div className={`px-4 py-2 rounded-2xl text-sm ${msg.senderId === 'admin' ? 'bg-primary text-white rounded-br-none' : 'bg-white border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-bl-none shadow-sm'}`}>
                                            {msg.text}
                                        </div>
                                        <span className='text-[10px] text-gray-400 mt-1 mx-1'>
                                            {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleSendMessage} className='p-4 border-t dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-900'>
                            <input 
                                type="text" 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Type your message..."
                                className='flex-1 bg-gray-100 dark:bg-gray-800 dark:text-white border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors rounded-full px-4 py-2 text-sm outline-none border'
                            />
                            <button type="submit" className='bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors'>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    const filteredDoctors = doctors.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.speciality.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='m-5 transition-colors pb-10'>
            <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4'>
                <h1 className='text-xl font-medium text-gray-700 dark:text-white'>Doctor Management Hub</h1>
                <div className='relative w-full md:w-72'>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search doctors..."
                        className='w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-colors shadow-sm'
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filteredDoctors.length === 0 ? (
                    <div className='col-span-full py-10 text-center text-gray-500'>
                        No doctors found matching "{searchQuery}"
                    </div>
                ) : (
                    filteredDoctors.map((doctor, index) => (
                    <div 
                        key={index}
                        onClick={() => handleSelectDoctor(doctor)}
                        className='bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all group'
                    >
                        <div className='bg-blue-50 dark:bg-blue-900/20 aspect-square flex items-end justify-center overflow-hidden'>
                            <img src={doctor.image} alt="" className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                        </div>
                        <div className='p-4'>
                            <div className='flex items-center gap-2 text-sm mb-1'>
                                <div className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className={doctor.available ? 'text-green-500' : 'text-red-500'}>{doctor.available ? 'Available' : 'Unavailable'}</span>
                            </div>
                            <h2 className='text-lg font-medium text-gray-800 dark:text-white truncate'>{doctor.name}</h2>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>{doctor.speciality}</p>
                            
                            <div className='mt-4 flex items-center justify-between border-t dark:border-gray-700 pt-4'>
                                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Manage & Chat</span>
                                <span className='w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors'>&rarr;</span>
                            </div>
                        </div>
                    </div>
                )))}
            </div>
        </div>
    )
}

export default Dashboard;
