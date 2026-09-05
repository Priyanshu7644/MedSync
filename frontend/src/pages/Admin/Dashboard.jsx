import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';

const Dashboard = () => {
    const { aToken, doctors, getAllDoctors, updateDoctorProfileAdmin, messages, adminGetMessages, adminSendMessage, blockPatient } = useContext(AdminContext);
    
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [docData, setDocData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState('');
    const [chatFile, setChatFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [chatUser, setChatUser] = useState(null);

    useEffect(() => {
        if (aToken) {
            getAllDoctors();
        }
    }, [aToken]);

    useEffect(() => {
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
            getAllDoctors();
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!text.trim() && !chatFile) || !selectedDoctor) return;
        
        const success = await adminSendMessage(selectedDoctor._id, text, chatFile);
        if (success) {
            setText('');
            setChatFile(null);
        }
    }

    const handleBlockUser = async () => {
        if (!chatUser) return;
        const isCurrentlyBlocked = chatUser.userData?.isBlocked || false;
        const success = await blockPatient(chatUser.userData?._id, !isCurrentlyBlocked);
        if (success) {
            setChatUser({
                ...chatUser,
                userData: {
                    ...chatUser.userData,
                    isBlocked: !isCurrentlyBlocked
                }
            });
        }
    }

    // Detail View: Profile Editor + Direct Messaging
    if (selectedDoctor) {
        return (
            <div className='space-y-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors pb-10'>
                <button 
                    onClick={() => setSelectedDoctor(null)} 
                    className='inline-flex items-center gap-2 text-xs font-semibold text-[#00311e]/70 hover:text-[#00311e] dark:text-[#EAE0C8]/70 dark:hover:text-[#EAE0C8] transition-colors'
                >
                    <span>←</span>
                    <span>Back to Doctor Directory</span>
                </button>

                <div className='grid grid-cols-1 xl:grid-cols-12 gap-6'>
                    {/* Left: Doctor Profile Form (7 Cols) */}
                    <div className='xl:col-span-7 bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-xl p-6 shadow-sm'>
                        <div className='flex justify-between items-center pb-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20 mb-6'>
                            <div>
                                <h2 className='text-lg font-bold text-[#00311e] dark:text-[#EAE0C8]'>Doctor Profile & Credentials</h2>
                                <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70'>Update clinic fees, discipline, and schedule status.</p>
                            </div>
                            <button 
                                onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    isEditing 
                                        ? 'bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] shadow-sm' 
                                        : 'bg-[#00311e]/5 dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8] hover:bg-[#00311e]/10'
                                }`}
                            >
                                {isEditing ? 'Save Changes' : 'Edit Information'}
                            </button>
                        </div>

                        {/* Top Photo & Name */}
                        <div className='flex items-start gap-4 mb-6 pb-6 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
                            <img src={docData.image} alt="" className='w-20 h-20 rounded-xl bg-[#00311e]/5 dark:bg-[#202833] object-cover border border-[#00311e]/15 dark:border-[#EAE0C8]/20' />
                            <div className='flex-1 min-w-0'>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={docData.name} 
                                        onChange={(e) => setDocData({...docData, name: e.target.value})}
                                        className='text-base font-bold mb-1 border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3 py-1.5 w-full bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8]'
                                    />
                                ) : (
                                    <h3 className='text-base font-bold text-[#00311e] dark:text-[#EAE0C8] truncate'>{docData.name}</h3>
                                )}
                                <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>{docData.speciality} • {docData.degree}</p>

                                <div className='flex items-center gap-2 mt-3'>
                                    <input 
                                        type="checkbox" 
                                        checked={docData.available} 
                                        onChange={(e) => isEditing && setDocData({...docData, available: e.target.checked})}
                                        disabled={!isEditing}
                                        id="available"
                                        className='rounded text-[#00311e] focus:ring-0 cursor-pointer'
                                    />
                                    <label htmlFor="available" className='text-xs font-medium text-[#00311e] dark:text-[#EAE0C8] cursor-pointer'>
                                        Available for patient booking
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Editable form fields */}
                        <div className='space-y-4 text-xs'>
                            <div>
                                <label className='block font-semibold uppercase tracking-wider text-[#00311e]/70 dark:text-[#EAE0C8]/70 mb-1.5'>Professional Summary</label>
                                {isEditing ? (
                                    <textarea 
                                        rows="3"
                                        value={docData.about} 
                                        onChange={(e) => setDocData({...docData, about: e.target.value})}
                                        className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg p-3 bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8]'
                                    />
                                ) : (
                                    <p className='p-3 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8] leading-relaxed'>{docData.about}</p>
                                )}
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block font-semibold uppercase tracking-wider text-[#00311e]/70 dark:text-[#EAE0C8]/70 mb-1.5'>Consultation Fee ($)</label>
                                    {isEditing ? (
                                        <input 
                                            type="number" 
                                            value={docData.fees} 
                                            onChange={(e) => setDocData({...docData, fees: e.target.value})}
                                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3 py-2 bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none'
                                        />
                                    ) : (
                                        <p className='p-2.5 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] font-bold text-sm text-[#00311e] dark:text-[#EAE0C8]'>${docData.fees}</p>
                                    )}
                                </div>
                                <div>
                                    <label className='block font-semibold uppercase tracking-wider text-[#00311e]/70 dark:text-[#EAE0C8]/70 mb-1.5'>Experience</label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={docData.experience} 
                                            onChange={(e) => setDocData({...docData, experience: e.target.value})}
                                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3 py-2 bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none'
                                        />
                                    ) : (
                                        <p className='p-2.5 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] text-sm text-[#00311e] dark:text-[#EAE0C8]'>{docData.experience}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className='block font-semibold uppercase tracking-wider text-[#00311e]/70 dark:text-[#EAE0C8]/70 mb-1.5'>Clinic Location & Address</label>
                                {isEditing ? (
                                    <div className='space-y-2'>
                                        <input 
                                            type="text" 
                                            value={docData.address?.line1 || ''} 
                                            onChange={(e) => setDocData({...docData, address: {...docData.address, line1: e.target.value}})}
                                            placeholder="Address Line 1"
                                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3 py-2 bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none'
                                        />
                                        <input 
                                            type="text" 
                                            value={docData.address?.line2 || ''} 
                                            onChange={(e) => setDocData({...docData, address: {...docData.address, line2: e.target.value}})}
                                            placeholder="Address Line 2"
                                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3 py-2 bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none'
                                        />
                                        <div className='grid grid-cols-2 gap-2'>
                                            <input 
                                                type="text" 
                                                value={docData.address?.locality || ''} 
                                                onChange={(e) => setDocData({...docData, address: {...docData.address, locality: e.target.value}})}
                                                placeholder="Locality"
                                                className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3 py-2 bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none'
                                            />
                                            <input 
                                                type="text" 
                                                value={docData.address?.pincode || ''} 
                                                onChange={(e) => setDocData({...docData, address: {...docData.address, pincode: e.target.value}})}
                                                placeholder="Pincode"
                                                className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3 py-2 bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none'
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className='p-3 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8] leading-relaxed'>
                                        <p className='font-semibold'>{docData.address?.line1 || 'No street specified'}</p>
                                        <p>{docData.address?.line2}</p>
                                        <p className='text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-1 font-medium'>
                                            {docData.address?.locality} {docData.address?.pincode ? `• ${docData.address.pincode}` : ''}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Direct Admin Messages (5 Cols) */}
                    <div className='xl:col-span-5 bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-xl overflow-hidden shadow-sm flex flex-col h-[580px]'>
                        <div className='p-4 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-between bg-[#00311e]/5 dark:bg-[#202833]/50'>
                            <div>
                                <h3 className='font-bold text-xs text-[#00311e] dark:text-[#EAE0C8]'>Direct Admin Channel</h3>
                                <p className='text-[10px] text-[#00311e]/70 dark:text-[#EAE0C8]/70'>Secure communication with {docData.name}</p>
                            </div>
                            <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
                        </div>

                        {/* Message stream */}
                        <div className='flex-1 p-4 overflow-y-auto space-y-3 bg-[#00311e]/5 dark:bg-[#141820]'>
                            {messages.length === 0 ? (
                                <div className='h-full flex items-center justify-center text-center text-[#00311e]/50 dark:text-[#EAE0C8]/50 text-xs'>
                                    No direct messages exchanged yet.
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = msg.senderId === 'admin';
                                    return (
                                        <div key={index} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end ml-auto' : 'self-start items-start'}`}>
                                            <div className={`px-3.5 py-2.5 rounded-xl text-xs ${
                                                isMe 
                                                    ? 'bg-[#00311e] dark:bg-[#EAE0C8] text-[#fef7e5] dark:text-[#202833] rounded-br-none font-medium' 
                                                    : 'bg-white dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 text-[#00311e] dark:text-[#EAE0C8] rounded-bl-none shadow-sm'
                                            }`}>
                                                {msg.attachment && (
                                                    <div className="mb-2">
                                                        <a href={msg.attachment} target="_blank" rel="noopener noreferrer" className={`underline ${isMe ? 'text-[#fef7e5] dark:text-[#202833]' : 'text-[#00311e] dark:text-[#EAE0C8]'}`}>View Attachment</a>
                                                    </div>
                                                )}
                                                {msg.text && <div>{msg.text}</div>}
                                            </div>
                                            <span className='text-[10px] text-[#00311e]/50 dark:text-[#EAE0C8]/50 mt-1 mx-1'>
                                                {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Attachment display */}
                        {chatFile && (
                            <div className="px-4 py-2 bg-[#00311e]/5 dark:bg-[#202833] border-t border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-between text-xs">
                                <span className='truncate text-[#00311e] dark:text-[#EAE0C8]'>Attached: {chatFile.name}</span>
                                <button onClick={() => setChatFile(null)} className="text-rose-500 font-bold">✕</button>
                            </div>
                        )}

                        {/* Chat input */}
                        <form onSubmit={handleSendMessage} className='p-3 border-t border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center gap-2 bg-white dark:bg-[#181E26]'>
                            <label className='cursor-pointer text-[#00311e]/50 hover:text-[#00311e] dark:text-[#EAE0C8]/50 dark:hover:text-[#EAE0C8] p-1.5'>
                                <span>📎</span>
                                <input type="file" className="hidden" onChange={(e) => { if(e.target.files[0]) setChatFile(e.target.files[0]) }} />
                            </label>
                            <input 
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Write administrative message..."
                                className='flex-1 bg-[#00311e]/5 dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-lg px-3 py-2 text-xs text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors'
                            />
                            <button type="submit" className='px-4 py-2 rounded-lg bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] text-xs font-semibold hover:opacity-90 transition-opacity'>
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Default View: Doctors Roster Directory
    const filteredDoctors = doctors.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.speciality.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='space-y-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors pb-10'>
            
            {/* Minimal Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
                <div>
                    <h1 className='text-2xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>Doctor Management Hub</h1>
                    <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>Monitor provider credentials, real-time availability, and clinical consultations.</p>
                </div>

                <div className='relative w-full sm:w-72'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[#00311e]/50 dark:text-[#EAE0C8]/50 text-xs'>🔍</span>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search doctor or specialty..."
                        className='w-full pl-8 pr-4 py-2 border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-lg bg-white dark:bg-[#181E26] text-xs text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors'
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className='absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#00311e]/50 hover:text-[#00311e] dark:text-[#EAE0C8]/50 dark:hover:text-[#EAE0C8]'>✕</button>
                    )}
                </div>
            </div>

            {/* Doctors Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {filteredDoctors.length === 0 ? (
                    <div className='col-span-full py-16 text-center text-[#00311e]/50 dark:text-[#EAE0C8]/50 text-xs'>
                        No doctors match "{searchQuery}"
                    </div>
                ) : (
                    filteredDoctors.map((doctor, index) => (
                        <div 
                            key={index}
                            onClick={() => handleSelectDoctor(doctor)}
                            className='bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 hover:border-[#00311e]/40 dark:hover:border-[#EAE0C8]/40 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-sm'
                        >
                            <div>
                                <div className='aspect-[4/3] bg-[#00311e]/5 dark:bg-[#202833] overflow-hidden relative'>
                                    <img src={doctor.image} alt={doctor.name} className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300' />
                                    <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                        doctor.available 
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' 
                                            : 'bg-[#00311e]/10 text-[#00311e] border-[#00311e]/20 dark:bg-[#EAE0C8]/10 dark:text-[#EAE0C8] dark:border-[#EAE0C8]/20'
                                    }`}>
                                        {doctor.available ? '● Active' : 'Off-duty'}
                                    </span>
                                </div>

                                <div className='p-4'>
                                    <h3 className='font-bold text-sm text-[#00311e] dark:text-[#EAE0C8] truncate group-hover:underline'>
                                        {doctor.name}
                                    </h3>
                                    <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5 truncate'>{doctor.speciality}</p>
                                    <p className='text-[11px] text-[#00311e]/60 dark:text-[#EAE0C8]/60 mt-2 truncate'>
                                        📍 {doctor.address?.locality || doctor.address?.line1 || 'Clinic Registered'}
                                    </p>
                                </div>
                            </div>

                            <div className='px-4 py-3 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 bg-[#00311e]/5 dark:bg-[#202833]/50 flex items-center justify-between text-xs'>
                                <span className='font-bold text-[#00311e] dark:text-[#EAE0C8]'>${doctor.fees} / visit</span>
                                <span className='text-xs font-semibold text-[#00311e] dark:text-[#EAE0C8] group-hover:translate-x-0.5 transition-transform'>Manage ➔</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default Dashboard;
