import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorMessages = () => {
    const { 
        dtoken, 
        appointments, 
        getAppointments, 
        messages, 
        doctorGetMessages, 
        doctorMarkMessagesSeen,
        doctorSendMessage, 
        profileData, 
        blockPatient 
    } = useContext(DoctorContext);
    
    const [selectedContact, setSelectedContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [text, setText] = useState('');
    const [chatFile, setChatFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const docId = profileData ? profileData._id : null;
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (dtoken) {
            getAppointments();
            doctorGetMessages();
        }
    }, [dtoken]);

    useEffect(() => {
        if (selectedContact) {
            const app = appointments.find(a => a.userData?._id === selectedContact);
            setIsBlocked(app?.userData?.isBlocked || false);
            doctorMarkMessagesSeen(selectedContact);
        }
    }, [selectedContact, appointments]);

    useEffect(() => {
        if (selectedContact && docId) {
            const hasUnseen = messages.some(m => String(m.senderId) === String(selectedContact) && String(m.receiverId) === String(docId) && !m.seen);
            if (hasUnseen) {
                doctorMarkMessagesSeen(selectedContact);
            }
        }
    }, [messages, selectedContact, docId]);

    // Build map of user data
    const userMap = {
        'admin': { 
            name: 'Clinic Administration', 
            image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            speciality: 'Platform HQ'
        }
    };
    
    appointments.forEach(app => {
        if (app.userData && app.userData._id) {
            userMap[app.userData._id] = {
                name: app.userData.name,
                image: app.userData.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                isBlocked: app.userData.isBlocked,
                email: app.userData.email
            };
        }
    });

    const conversations = {};

    // Ensure admin is always in conversation list
    conversations['admin'] = {
        id: 'admin',
        messages: [],
        unreadCount: 0,
        lastDate: 0
    };

    // Ensure booked patients are also pre-populated
    appointments.forEach(app => {
        if (app.userData?._id && !conversations[app.userData._id]) {
            conversations[app.userData._id] = {
                id: app.userData._id,
                messages: [],
                unreadCount: 0,
                lastDate: 0
            };
        }
    });

    // Populate messages and calculate unread counts
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
                messages: [],
                unreadCount: 0,
                lastDate: 0
            };
        }
        conversations[contactId].messages.push(msg);
        if (msg.date > conversations[contactId].lastDate) {
            conversations[contactId].lastDate = msg.date;
        }
        if (msg.receiverId === docId && !msg.seen) {
            conversations[contactId].unreadCount += 1;
        }
    });

    const contactList = Object.values(conversations).sort((a, b) => {
        if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
        return b.lastDate - a.lastDate;
    });

    const filteredContacts = contactList.filter(c => {
        const u = userMap[c.id] || { name: 'Patient ' + c.id.slice(-4) };
        return u.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Deduplicate and pull all messages for selectedContact
    const currentMessages = useMemo(() => {
        if (!selectedContact) return [];
        const filtered = messages.filter(msg => 
            (msg.senderId === docId && msg.receiverId === selectedContact) ||
            (msg.senderId === selectedContact && msg.receiverId === docId) ||
            (selectedContact === 'admin' && (msg.senderId === 'admin' || msg.receiverId === 'admin'))
        );
        const map = new Map();
        filtered.forEach(m => {
            if (m && (m._id || m.date)) {
                const key = m._id || `${m.senderId}_${m.date}`;
                map.set(key, m);
            }
        });
        return Array.from(map.values()).sort((a, b) => a.date - b.date);
    }, [selectedContact, messages, docId]);

    // Precise container-only auto scroll (never touches window scroll)
    const scrollToBottom = (smooth = true) => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    };

    useEffect(() => {
        scrollToBottom(false);
    }, [selectedContact]);

    useEffect(() => {
        scrollToBottom(true);
    }, [currentMessages.length]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setChatFile(file);
            if (file.type.startsWith('image/')) {
                setFilePreview(URL.createObjectURL(file));
            } else {
                setFilePreview(null);
            }
        }
    };

    const removeAttachment = () => {
        setChatFile(null);
        setFilePreview(null);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!text.trim() && !chatFile) || !selectedContact || isBlocked || isSending) return;

        const currentText = text;
        const currentFile = chatFile;
        setText('');
        setChatFile(null);
        setFilePreview(null);
        setIsSending(true);

        await doctorSendMessage(selectedContact, currentText, currentFile);
        setIsSending(false);
        scrollToBottom(true);
    };

    const handleBlockUser = async () => {
        if (!selectedContact || selectedContact === 'admin') return;
        const success = await blockPatient(selectedContact, !isBlocked);
        if (success) {
            setIsBlocked(!isBlocked);
            getAppointments();
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateHeader = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const activeUser = selectedContact ? (userMap[selectedContact] || { name: 'Patient ' + selectedContact.slice(-4), image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }) : null;

    return (
        <div className='h-full max-h-full flex-1 flex flex-col text-[#00311e] dark:text-[#EAE0C8] overflow-hidden select-none min-h-0'>
            {/* WhatsApp-Style Container: Fixed Outer Frame */}
            <div className='flex-1 h-full flex flex-col lg:flex-row border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-2xl bg-white dark:bg-[#181E26] overflow-hidden shadow-lg min-h-0'>
                
                {/* Contacts Sidebar (Fixed Left Box) */}
                <div className='w-full lg:w-[320px] xl:w-[350px] border-b lg:border-b-0 lg:border-r border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex flex-col bg-[#00311e]/5 dark:bg-[#141820] shrink-0 h-full min-h-0 overflow-hidden'>
                    
                    {/* Header Bar inside left pane (Fixed) */}
                    <div className='p-3 px-4 border-b border-[#00311e]/10 dark:border-[#EAE0C8]/10 bg-white dark:bg-[#181E26] flex items-center justify-between shrink-0'>
                        <div className='flex items-center gap-2'>
                            <div className='w-7 h-7 rounded-lg bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] flex items-center justify-center font-bold text-xs'>
                                DR
                            </div>
                            <h2 className='text-xs font-bold uppercase tracking-wider text-[#00311e] dark:text-[#EAE0C8]'>Patient Inquiries</h2>
                        </div>
                        <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'>
                            ● Active
                        </span>
                    </div>

                    {/* Search (Fixed) */}
                    <div className='p-2.5 px-3 border-b border-[#00311e]/10 dark:border-[#EAE0C8]/10 bg-white/60 dark:bg-[#181E26]/60 backdrop-blur-md shrink-0'>
                        <div className='relative'>
                            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-50'>🔍</span>
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search patient or admin..."
                                className='w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#00311e]/5 dark:bg-[#202833] border border-[#00311e]/10 dark:border-[#EAE0C8]/10 focus:border-[#00311e] dark:focus:border-[#EAE0C8] text-[#00311e] dark:text-[#EAE0C8] placeholder:text-[#00311e]/40 dark:placeholder:text-[#EAE0C8]/40 outline-none transition'
                            />
                        </div>
                    </div>

                    {/* ONLY this contact list scrolls inside the left pane */}
                    <div className='flex-1 overflow-y-auto divide-y divide-[#00311e]/5 dark:divide-[#EAE0C8]/5 min-h-0'>
                        {filteredContacts.length === 0 ? (
                            <div className='p-8 text-center text-[#00311e]/50 dark:text-[#EAE0C8]/50 text-xs'>
                                No contacts found
                            </div>
                        ) : (
                            filteredContacts.map((contact) => {
                                const lastMsg = contact.messages.length > 0 ? contact.messages[contact.messages.length - 1] : null;
                                const uData = userMap[contact.id] || { name: 'Patient ' + contact.id.slice(-4), image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' };
                                const isSelected = selectedContact === contact.id;
                                const hasUnread = contact.unreadCount > 0;

                                return (
                                    <div 
                                        key={contact.id} 
                                        onClick={() => setSelectedContact(contact.id)}
                                        className={`flex items-center gap-3 p-3 cursor-pointer transition-all relative ${
                                            isSelected 
                                                ? 'bg-[#00311e]/15 dark:bg-[#202833] border-l-4 border-l-[#00311e] dark:border-l-[#EAE0C8]' 
                                                : hasUnread
                                                ? 'bg-emerald-500/10 dark:bg-emerald-500/15 hover:bg-emerald-500/15'
                                                : 'hover:bg-[#00311e]/5 dark:hover:bg-[#EAE0C8]/5'
                                        }`}
                                    >
                                        <div className='relative shrink-0'>
                                            <img src={uData.image} alt={uData.name} className='w-10 h-10 rounded-full object-cover border border-[#00311e]/15 dark:border-[#EAE0C8]/15' />
                                            {contact.id === 'admin' ? (
                                                <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white dark:border-[#181E26]' title="Admin"></span>
                                            ) : (
                                                <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#181E26]' title="Active"></span>
                                            )}
                                        </div>

                                        <div className='flex-1 overflow-hidden min-w-0'>
                                            <div className='flex justify-between items-center mb-0.5'>
                                                <h3 className={`text-xs truncate ${hasUnread ? 'font-bold text-[#00311e] dark:text-[#EAE0C8]' : 'font-semibold text-[#00311e]/90 dark:text-[#EAE0C8]/90'}`}>
                                                    {uData.name}
                                                </h3>
                                                {lastMsg && (
                                                    <span className={`text-[10px] ${hasUnread ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-[#00311e]/50 dark:text-[#EAE0C8]/50'}`}>
                                                        {formatTime(lastMsg.date)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className='flex justify-between items-center gap-1'>
                                                <p className={`text-[11px] truncate ${hasUnread ? 'font-bold text-[#00311e] dark:text-white' : 'text-[#00311e]/60 dark:text-[#EAE0C8]/60'}`}>
                                                    {lastMsg ? (
                                                        <>
                                                            {lastMsg.senderId === docId && (
                                                                <span className={`mr-1 ${lastMsg.seen ? 'text-emerald-500' : 'text-neutral-400'}`}>
                                                                    {lastMsg.seen ? '✓✓' : '✓'}
                                                                </span>
                                                            )}
                                                            {lastMsg.text || (lastMsg.attachment ? '📷 [Attachment]' : 'New message')}
                                                        </>
                                                    ) : (
                                                        <span className='italic text-[#00311e]/40 dark:text-[#EAE0C8]/40'>Start conversation</span>
                                                    )}
                                                </p>

                                                {/* Green WhatsApp pill */}
                                                {hasUnread && (
                                                    <span className='shrink-0 px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold min-w-[18px] text-center shadow-sm animate-bounce'>
                                                        {contact.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Chat Viewport (Entire box is pinned, only middle thread scrolls) */}
                <div className='flex-1 flex flex-col bg-white dark:bg-[#181E26] h-full min-h-0 overflow-hidden'>
                    {selectedContact && activeUser ? (
                        <>
                            {/* Contact Header (Fixed at top) */}
                            <div className='p-3 px-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-between bg-[#00311e]/5 dark:bg-[#141820] backdrop-blur-md shrink-0'>
                                <div className='flex items-center gap-3'>
                                    <div className='relative'>
                                        <img src={activeUser.image} className='w-9 h-9 rounded-full object-cover border border-[#00311e]/15 dark:border-[#EAE0C8]/20' alt={activeUser.name} />
                                        <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#141820]'></span>
                                    </div>
                                    <div>
                                        <h2 className='font-bold text-xs text-[#00311e] dark:text-[#EAE0C8]'>{activeUser.name}</h2>
                                        <span className='text-[10px] text-emerald-600 dark:text-emerald-400 font-medium'>
                                            {selectedContact === 'admin' ? 'Clinic Administration HQ' : 'Verified Patient Consultation'}
                                        </span>
                                    </div>
                                </div>

                                {selectedContact !== 'admin' && (
                                    <button 
                                        onClick={handleBlockUser}
                                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition shadow-sm ${
                                            isBlocked 
                                                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' 
                                                : 'bg-white text-rose-600 dark:bg-[#202833] dark:text-rose-400 border-rose-200 dark:border-rose-900/40 hover:bg-rose-50'
                                        }`}
                                    >
                                        {isBlocked ? '✓ Unblock' : '⊘ Block'}
                                    </button>
                                )}
                            </div>
                            
                            {/* ONLY this messages viewport scrolls inside right pane */}
                            <div ref={messagesContainerRef} className='flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-3 bg-[#fef7e5]/30 dark:bg-[#10141a] min-h-0'>
                                {currentMessages.length === 0 ? (
                                    <div className='m-auto text-center space-y-2 py-8'>
                                        <div className='w-12 h-12 rounded-full bg-[#00311e]/10 dark:bg-[#EAE0C8]/10 text-2xl flex items-center justify-center mx-auto text-[#00311e] dark:text-[#EAE0C8]'>
                                            💬
                                        </div>
                                        <h4 className='text-xs font-bold text-[#00311e] dark:text-[#EAE0C8]'>No messages yet</h4>
                                        <p className='text-[11px] text-[#00311e]/60 dark:text-[#EAE0C8]/60 max-w-xs'>
                                            Send a clinical message or consultation notes to {activeUser.name}.
                                        </p>
                                    </div>
                                ) : (
                                    currentMessages.map((msg, index) => {
                                        const isMe = msg.senderId === docId || (docId === null && msg.receiverId === selectedContact);
                                        const prevMsg = index > 0 ? currentMessages[index - 1] : null;
                                        const showDateHeader = !prevMsg || new Date(msg.date).toDateString() !== new Date(prevMsg.date).toDateString();

                                        return (
                                            <React.Fragment key={msg._id || index}>
                                                {showDateHeader && (
                                                    <div className='flex justify-center my-1.5'>
                                                        <span className='px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/80 dark:bg-[#202833]/80 border border-[#00311e]/10 dark:border-[#EAE0C8]/15 shadow-sm text-[#00311e]/70 dark:text-[#EAE0C8]/70'>
                                                            {formatDateHeader(msg.date)}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className={`flex flex-col max-w-[80%] sm:max-w-[65%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                                    <div className={`relative px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                                                        msg.senderId === 'admin' 
                                                            ? 'bg-amber-500/15 dark:bg-amber-500/20 text-[#00311e] dark:text-[#EAE0C8] border border-amber-300 dark:border-amber-700/50 rounded-2xl rounded-tl-xs'
                                                            : isMe 
                                                            ? 'bg-[#00311e] dark:bg-[#EAE0C8] text-[#fef7e5] dark:text-[#202833] rounded-2xl rounded-tr-xs font-medium' 
                                                            : 'bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/15 text-[#00311e] dark:text-[#EAE0C8] rounded-2xl rounded-tl-xs'
                                                    }`}>
                                                        
                                                        {msg.senderId === 'admin' && (
                                                            <div className='text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-0.5 flex items-center gap-1'>
                                                                <span>🛡️</span>
                                                                <span>Clinic Admin Notice</span>
                                                            </div>
                                                        )}

                                                        {msg.attachment && (
                                                            <div className="mb-2 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
                                                                {msg.attachment.match(/\.(jpeg|jpg|gif|png|webp)/i) || msg.attachment.startsWith('blob:') ? (
                                                                    <a href={msg.attachment} target="_blank" rel="noopener noreferrer">
                                                                        <img src={msg.attachment} alt="attachment" className="max-w-[240px] max-h-[200px] object-cover rounded-lg hover:scale-105 transition-transform duration-200" />
                                                                    </a>
                                                                ) : (
                                                                    <a href={msg.attachment} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 p-1.5 underline ${isMe ? 'text-[#fef7e5] dark:text-[#202833]' : 'text-[#00311e] dark:text-[#EAE0C8]'}`}>
                                                                        <span>📎</span>
                                                                        <span>Download Clinical File</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}

                                                        {msg.text && <p className='whitespace-pre-wrap break-words'>{msg.text}</p>}

                                                        <div className={`flex items-center justify-end gap-1 mt-0.5 text-[10px] ${
                                                            isMe ? 'text-[#fef7e5]/70 dark:text-[#202833]/70' : 'text-[#00311e]/50 dark:text-[#EAE0C8]/50'
                                                        }`}>
                                                            <span>{formatTime(msg.date)}</span>
                                                            {isMe && (
                                                                <span className={`text-[12px] font-bold ${msg.seen ? 'text-cyan-300 dark:text-emerald-700' : 'opacity-70'}`} title={msg.seen ? 'Seen' : 'Sent'}>
                                                                    {msg.seen ? '✓✓' : '✓'}
                                                                </span>
                                                            )}
                                                        </div>

                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </div>

                            {/* Attachment Preview Box (Fixed at bottom) */}
                            {chatFile && (
                                <div className="px-4 py-2 bg-[#00311e]/5 dark:bg-[#141820] border-t border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-between text-xs shrink-0">
                                    <div className='flex items-center gap-2'>
                                        {filePreview && (
                                            <img src={filePreview} alt="preview" className='w-7 h-7 rounded object-cover border border-[#00311e]/20' />
                                        )}
                                        <span className='font-semibold truncate max-w-xs'>Ready to send: {chatFile.name}</span>
                                    </div>
                                    <button onClick={removeAttachment} className="text-rose-500 font-bold px-2 py-0.5 hover:bg-rose-50 rounded">✕ Cancel</button>
                                </div>
                            )}

                            {/* Quick reactions (Fixed at bottom) */}
                            <div className='px-4 py-1.5 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 bg-white/70 dark:bg-[#181E26]/70 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0'>
                                <span className='text-[10px] font-bold uppercase tracking-wider text-[#00311e]/40 dark:text-[#EAE0C8]/40 mr-1'>Quick:</span>
                                {['👍 Confirmed', '🩺 Please join room', '💊 Prescription sent', '📋 Follow-up next week', '✅ Tests normal'].map((quick, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setText(prev => prev ? `${prev} ${quick}` : quick)}
                                        className='px-2.5 py-0.5 rounded-full bg-[#00311e]/5 dark:bg-[#202833] hover:bg-[#00311e]/15 dark:hover:bg-[#EAE0C8]/15 border border-[#00311e]/10 dark:border-[#EAE0C8]/10 text-[11px] whitespace-nowrap transition'
                                    >
                                        {quick}
                                    </button>
                                ))}
                            </div>

                            {/* Input form (Fixed at bottom) */}
                            <form onSubmit={handleSendMessage} className='p-3 border-t border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex gap-2 items-center bg-white dark:bg-[#181E26] shrink-0'>
                                <label className='cursor-pointer p-1.5 rounded-xl text-[#00311e]/60 hover:text-[#00311e] hover:bg-[#00311e]/5 dark:text-[#EAE0C8]/60 dark:hover:text-[#EAE0C8] dark:hover:bg-[#EAE0C8]/5 transition' title="Attach file">
                                    <span className='text-base'>📎</span>
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>

                                <input 
                                    type="text" 
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder={isBlocked ? "Patient is blocked..." : `Write clinical message to ${activeUser.name}...`}
                                    disabled={isBlocked}
                                    className='flex-1 bg-[#00311e]/5 dark:bg-[#141820] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 focus:border-[#00311e] dark:focus:border-[#EAE0C8] rounded-xl px-3.5 py-2 text-xs text-[#00311e] dark:text-[#EAE0C8] placeholder:text-[#00311e]/40 dark:placeholder:text-[#EAE0C8]/40 outline-none transition shadow-inner'
                                />

                                <button 
                                    type="submit" 
                                    disabled={isBlocked || (!text.trim() && !chatFile) || isSending}
                                    className='px-4 py-2 rounded-xl bg-[#00311e] hover:bg-[#00311e]/90 dark:bg-[#EAE0C8] dark:hover:bg-[#EAE0C8]/90 text-[#fef7e5] dark:text-[#202833] text-xs font-bold disabled:opacity-40 transition shadow-sm flex items-center gap-1.5'
                                >
                                    <span>Send</span>
                                    <span>➤</span>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className='m-auto text-center p-8 max-w-sm space-y-2'>
                            <div className='w-12 h-12 rounded-full bg-[#00311e]/10 dark:bg-[#EAE0C8]/10 text-2xl flex items-center justify-center mx-auto text-[#00311e] dark:text-[#EAE0C8] animate-pulse'>
                                💬
                            </div>
                            <h3 className='text-xs font-bold text-[#00311e] dark:text-[#EAE0C8]'>Select a Patient Channel</h3>
                            <p className='text-[11px] text-[#00311e]/70 dark:text-[#EAE0C8]/70 leading-relaxed'>
                                Select a booked patient or Clinic Administration to view message history and reply in real-time.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DoctorMessages;
