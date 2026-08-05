import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorMessages = () => {
    const { dtoken, appointments, getAppointments, messages, doctorGetMessages, doctorSendMessage, profileData } = useContext(DoctorContext);
    
    const [selectedContact, setSelectedContact] = useState(null);
    const [text, setText] = useState('');

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

    // Build a map of user data from appointments for easy lookup
    const userMap = {
        'admin': { name: 'System Admin', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }
    };
    
    appointments.forEach(app => {
        if (app.userData && app.userData._id) {
            userMap[app.userData._id] = {
                name: app.userData.name,
                image: app.userData.image
            };
        }
    });

    // Group messages by contact
    const docId = profileData ? profileData._id : null;
    const conversations = {};

    messages.forEach(msg => {
        // Find who the other person is
        let contactId = msg.senderId === docId ? msg.receiverId : msg.senderId;
        
        // If we don't know the docId yet (profileData not loaded), try to infer it
        // A message to 'admin' implies sender is doc
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
        if (!text.trim() || !selectedContact) return;
        const success = await doctorSendMessage(selectedContact, text);
        if (success) {
            setText('');
        }
    }

    return (
        <div className='m-5 flex flex-col md:flex-row gap-6 h-[80vh] transition-colors'>
            {/* Contacts Sidebar */}
            <div className='w-full md:w-1/3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col'>
                <div className='p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900'>
                    <h2 className='text-lg font-medium text-gray-700 dark:text-white'>Conversations</h2>
                </div>
                <div className='flex-1 overflow-y-auto'>
                    {contactList.length === 0 ? (
                        <p className='p-6 text-center text-sm text-gray-500'>No active conversations.</p>
                    ) : (
                        contactList.map((contact, index) => {
                            const lastMsg = contact.messages[contact.messages.length - 1];
                            const uData = userMap[contact.id] || { name: 'Unknown User', image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' };
                            return (
                                <div 
                                    key={index} 
                                    onClick={() => setSelectedContact(contact.id)}
                                    className={`flex items-center gap-3 p-4 border-b dark:border-gray-700 cursor-pointer transition-colors ${selectedContact === contact.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                >
                                    <img src={uData.image} alt="" className='w-10 h-10 rounded-full object-cover bg-gray-100' />
                                    <div className='flex-1 overflow-hidden'>
                                        <div className='flex justify-between items-center mb-1'>
                                            <h3 className='font-medium text-gray-800 dark:text-white truncate'>{uData.name}</h3>
                                            <span className='text-[10px] text-gray-400'>{new Date(lastMsg.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>{lastMsg.text}</p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className='w-full md:w-2/3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col'>
                {selectedContact ? (
                    <>
                        <div className='p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center gap-3'>
                            <img src={(userMap[selectedContact] || {}).image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} className='w-10 h-10 rounded-full object-cover bg-gray-100' alt="" />
                            <div>
                                <h2 className='font-medium text-gray-700 dark:text-white'>{(userMap[selectedContact] || {}).name || 'Unknown User'}</h2>
                            </div>
                        </div>
                        
                        <div className='flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50/50 dark:bg-gray-800/50'>
                            {conversations[selectedContact]?.messages.map((msg, index) => {
                                const isMe = msg.senderId === docId || (docId === null && msg.receiverId === selectedContact);
                                return (
                                    <div key={index} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                        <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-bl-none shadow-sm'}`}>
                                            {msg.text}
                                        </div>
                                        <span className='text-[10px] text-gray-400 mt-1 mx-1'>
                                            {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        <form onSubmit={handleSendMessage} className='p-4 border-t dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-900'>
                            <input 
                                type="text" 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Type your reply..."
                                className='flex-1 bg-gray-100 dark:bg-gray-800 dark:text-white border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors rounded-full px-4 py-2 text-sm outline-none border'
                            />
                            <button type="submit" className='bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors'>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </form>
                    </>
                ) : (
                    <div className='m-auto text-gray-400 flex flex-col items-center gap-3'>
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DoctorMessages;
