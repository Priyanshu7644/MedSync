import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorMessages = () => {
    const { dtoken, appointments, getAppointments, messages, doctorGetMessages, doctorSendMessage, profileData, blockPatient } = useContext(DoctorContext);
    
    const [selectedContact, setSelectedContact] = useState(null);
    const [text, setText] = useState('');
    const [chatFile, setChatFile] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        if (dtoken) {
            getAppointments();
            doctorGetMessages();
        }
    }, [dtoken]);

    useEffect(() => {
        let interval;
        if (dtoken) {
            interval = setInterval(() => {
                doctorGetMessages();
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [dtoken]);

    useEffect(() => {
        if (selectedContact) {
            const app = appointments.find(a => a.userData?._id === selectedContact);
            setIsBlocked(app?.userData?.isBlocked || false);
        }
    }, [selectedContact, appointments]);

    // Build a map of user data from appointments for easy lookup
    const userMap = {
        'admin': { name: 'System Admin', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }
    };
    
    appointments.forEach(app => {
        if (app.userData && app.userData._id) {
            userMap[app.userData._id] = {
                name: app.userData.name,
                image: app.userData.image,
                isBlocked: app.userData.isBlocked
            };
        }
    });

    // Group messages by contact
    const docId = profileData ? profileData._id : null;
    const conversations = {};

    messages.forEach(msg => {
        let contactId = msg.senderId === docId ? msg.receiverId : msg.senderId;
        
        if (!docId) {
            contactId = msg.senderId === 'admin' ? msg.senderId : 
                       (msg.receiverId === 'admin' ? msg.receiverId : 
                       (userMap[msg.senderId] ? msg.senderId : msg.receiverId));
        }

        if (!conversations[contactId]) {
            conversations[contactId] = {
                id: contactId,
                messages: []
            };
        }
        conversations[contactId].messages.push(msg);
    });

    const contactList = Object.values(conversations);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!text.trim() && !chatFile) || !selectedContact || isBlocked) return;
        const success = await doctorSendMessage(selectedContact, text, chatFile);
        if (success) {
            setText('');
            setChatFile(null);
        }
    }

    const handleBlockUser = async () => {
        if (!selectedContact) return;
        const success = await blockPatient(selectedContact, !isBlocked);
        if (success) {
            setIsBlocked(!isBlocked);
            getAppointments();
        }
    }

    return (
        <div className='space-y-6 text-[#00311e] dark:text-[#EAE0C8]'>
            {/* Header Bar */}
            <div className='pb-4 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
                <h1 className='text-2xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>
                    Consultation Messages
                </h1>
                <p className='text-sm text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>
                    Direct clinical messaging with booked patients and clinic administration.
                </p>
            </div>

            {/* Chat Frame */}
            <div className='flex flex-col md:flex-row border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-xl bg-white dark:bg-[#181E26] overflow-hidden h-[680px] shadow-sm'>
                {/* Contacts Sidebar */}
                <div className='w-full md:w-80 border-b md:border-b-0 md:border-r border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex flex-col bg-[#00311e]/5 dark:bg-[#202833]/50'>
                    <div className='p-3.5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-between'>
                        <span className='text-xs font-semibold uppercase tracking-wider text-[#00311e]/70 dark:text-[#EAE0C8]/70'>Conversations</span>
                        <span className='text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#00311e]/10 dark:bg-[#EAE0C8]/10 text-[#00311e] dark:text-[#EAE0C8]'>
                            {contactList.length}
                        </span>
                    </div>
                    <div className='flex-1 overflow-y-auto divide-y divide-[#00311e]/10 dark:divide-[#EAE0C8]/10'>
                        {contactList.length === 0 ? (
                            <div className='p-8 text-center text-[#00311e]/50 dark:text-[#EAE0C8]/50 space-y-1'>
                                <p className='text-xs font-medium'>No active conversations</p>
                                <p className='text-[11px]'>New messages will appear here.</p>
                            </div>
                        ) : (
                            contactList.map((contact, index) => {
                                const lastMsg = contact.messages[contact.messages.length - 1];
                                const uData = userMap[contact.id] || { name: 'Unknown User', image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' };
                                const isSelected = selectedContact === contact.id;
                                return (
                                    <div 
                                        key={index} 
                                        onClick={() => setSelectedContact(contact.id)}
                                        className={`flex items-center gap-3 p-3.5 cursor-pointer transition ${
                                            isSelected 
                                                ? 'bg-[#00311e]/15 dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8]' 
                                                : 'hover:bg-[#00311e]/5 dark:hover:bg-[#EAE0C8]/5'
                                        }`}
                                    >
                                        <img src={uData.image} alt="" className='w-9 h-9 rounded-full object-cover shrink-0' />
                                        <div className='flex-1 overflow-hidden min-w-0'>
                                            <div className='flex justify-between items-center mb-0.5'>
                                                <h3 className={`font-semibold text-xs truncate ${isSelected ? 'text-[#00311e] dark:text-[#EAE0C8]' : 'text-[#00311e]/80 dark:text-[#EAE0C8]/80'}`}>{uData.name}</h3>
                                                <span className='text-[10px] text-[#00311e]/50 dark:text-[#EAE0C8]/50'>{new Date(lastMsg.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className='text-[11px] text-[#00311e]/70 dark:text-[#EAE0C8]/70 truncate'>{lastMsg.text}</p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Chat Main Area */}
                <div className='flex-1 flex flex-col bg-white dark:bg-[#181E26]'>
                    {selectedContact ? (
                        <>
                            {/* Contact Header */}
                            <div className='p-3.5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-between bg-[#00311e]/5 dark:bg-[#202833]/50'>
                                <div className='flex items-center gap-3'>
                                    <img src={(userMap[selectedContact] || {}).image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} className='w-8 h-8 rounded-full object-cover shrink-0' alt="" />
                                    <div>
                                        <h2 className='font-semibold text-xs text-[#00311e] dark:text-[#EAE0C8]'>{(userMap[selectedContact] || {}).name || 'Unknown User'}</h2>
                                        <span className='text-[10px] text-[#00311e]/70 dark:text-[#EAE0C8]/70'>Encrypted Patient Session</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleBlockUser}
                                    className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition ${
                                        isBlocked 
                                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' 
                                            : 'bg-[#00311e]/5 text-rose-600 dark:bg-[#202833] dark:text-rose-400 border-[#00311e]/15 dark:border-[#EAE0C8]/20 hover:border-rose-300'
                                    }`}
                                >
                                    {isBlocked ? 'Unblock' : 'Block Patient'}
                                </button>
                            </div>
                            
                            {/* Messages Viewport */}
                            <div className='flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#00311e]/5 dark:bg-[#141820]'>
                                {conversations[selectedContact]?.messages.map((msg, index) => {
                                    const isMe = msg.senderId === docId || (docId === null && msg.receiverId === selectedContact);
                                    return (
                                        <div key={index} className={`flex flex-col max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                            <div className={`px-3.5 py-2.5 rounded-xl text-xs leading-relaxed ${
                                                msg.senderId === 'admin' 
                                                    ? 'bg-[#00311e]/10 dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8] rounded-bl-none border border-[#00311e]/15 dark:border-[#EAE0C8]/20' 
                                                    : isMe 
                                                    ? 'bg-[#00311e] dark:bg-[#EAE0C8] text-[#fef7e5] dark:text-[#202833] rounded-br-none font-medium' 
                                                    : 'bg-white dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 text-[#00311e] dark:text-[#EAE0C8] rounded-bl-none shadow-sm'
                                            }`}>
                                                {msg.attachment && (
                                                    <div className="mb-2">
                                                        {msg.attachment.match(/\.(jpeg|jpg|gif|png|webp)/i) ? (
                                                            <a href={msg.attachment} target="_blank" rel="noopener noreferrer">
                                                                <img src={msg.attachment} alt="attachment" className="max-w-[200px] rounded-md border border-[#00311e]/20 dark:border-[#EAE0C8]/20" />
                                                            </a>
                                                        ) : (
                                                            <a href={msg.attachment} target="_blank" rel="noopener noreferrer" className={`underline ${isMe ? 'text-[#fef7e5] dark:text-[#202833]' : 'text-[#00311e] dark:text-[#EAE0C8]'}`}>View File</a>
                                                        )}
                                                    </div>
                                                )}
                                                {msg.text && <div>{msg.text}</div>}
                                            </div>
                                            <span className='text-[10px] text-[#00311e]/50 dark:text-[#EAE0C8]/50 mt-1 mx-1'>
                                                {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>

                            {chatFile && (
                                <div className="px-4 py-2 bg-[#00311e]/5 dark:bg-[#202833] border-t border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-between text-xs">
                                    <span className='text-[#00311e] dark:text-[#EAE0C8] font-medium truncate'>Attached: {chatFile.name}</span>
                                    <button onClick={() => setChatFile(null)} className="text-[#00311e]/70 hover:text-[#00311e] dark:text-[#EAE0C8]/70 dark:hover:text-[#EAE0C8] font-bold ml-2">✕</button>
                                </div>
                            )}

                            {/* Input form */}
                            <form onSubmit={handleSendMessage} className='p-3 border-t border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex gap-2 items-center bg-white dark:bg-[#181E26]'>
                                <label className='cursor-pointer text-[#00311e]/50 hover:text-[#00311e] dark:text-[#EAE0C8]/50 dark:hover:text-[#EAE0C8] p-1.5 transition'>
                                    <span className='text-sm'>📎</span>
                                    <input type="file" className="hidden" onChange={(e) => { if(e.target.files[0]) setChatFile(e.target.files[0]) }} />
                                </label>
                                <input 
                                    type="text" 
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder={isBlocked ? "Patient is blocked..." : "Write a clinical message..."}
                                    disabled={isBlocked}
                                    className='flex-1 bg-[#00311e]/5 dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 focus:border-[#00311e] dark:focus:border-[#EAE0C8] rounded-lg px-3.5 py-2 text-xs text-[#00311e] dark:text-[#EAE0C8] placeholder-[#00311e]/40 dark:placeholder-[#EAE0C8]/40 outline-none transition'
                                />
                                <button 
                                    type="submit" 
                                    disabled={isBlocked}
                                    className='px-4 py-2 rounded-lg bg-[#00311e] hover:bg-[#00311e]/90 dark:bg-[#EAE0C8] dark:hover:bg-[#EAE0C8]/90 text-[#fef7e5] dark:text-[#202833] text-xs font-semibold transition'
                                >
                                    Send
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className='m-auto text-[#00311e]/50 dark:text-[#EAE0C8]/50 flex flex-col items-center gap-2 p-8 text-center'>
                            <p className='text-sm font-semibold text-[#00311e] dark:text-[#EAE0C8]'>Select a conversation</p>
                            <p className='text-xs text-[#00311e]/60 dark:text-[#EAE0C8]/60'>Choose a patient or system admin to view message history.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DoctorMessages;
