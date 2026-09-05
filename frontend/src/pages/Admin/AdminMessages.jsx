import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { AdminContext } from '../../context/AdminContext';

const AdminMessages = () => {
  const { 
    aToken, 
    doctors, 
    getAllDoctors, 
    messages,
    allMessages, 
    adminGetMessages,
    adminGetAllMessages, 
    adminMarkMessagesSeen, 
    adminSendMessage 
  } = useContext(AdminContext);

  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [text, setText] = useState('');
  const [chatFile, setChatFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
      adminGetAllMessages();
    }
  }, [aToken]);

  // Build doctor map
  const doctorMap = {};
  doctors.forEach(doc => {
    doctorMap[doc._id] = doc;
  });

  // Group all messages by doctor contact
  const conversations = {};

  // First seed all doctors so admin can start a chat with any doctor
  doctors.forEach(doc => {
    conversations[doc._id] = {
      id: doc._id,
      name: doc.name,
      image: doc.image,
      speciality: doc.speciality,
      available: doc.available,
      messages: [],
      unreadCount: 0,
      lastDate: 0
    };
  });

  // Populate messages and calculate unread counts from allMessages
  allMessages.forEach(msg => {
    const contactId = msg.senderId === 'admin' ? msg.receiverId : msg.senderId;
    if (!conversations[contactId]) {
      const doc = doctorMap[contactId] || { name: 'Doctor (' + contactId.slice(-4) + ')', image: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png', speciality: 'Medical Specialist' };
      conversations[contactId] = {
        id: contactId,
        name: doc.name,
        image: doc.image,
        speciality: doc.speciality || 'Specialist',
        available: doc.available !== undefined ? doc.available : true,
        messages: [],
        unreadCount: 0,
        lastDate: 0
      };
    }
    conversations[contactId].messages.push(msg);
    if (msg.date > conversations[contactId].lastDate) {
      conversations[contactId].lastDate = msg.date;
    }
    if (msg.receiverId === 'admin' && !msg.seen) {
      conversations[contactId].unreadCount += 1;
    }
  });

  // Sort contacts: active conversations with unread / newest messages first
  const contactList = Object.values(conversations).sort((a, b) => {
    if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
    return b.lastDate - a.lastDate;
  });

  const filteredContacts = contactList.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.speciality && c.speciality.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // When a contact is selected or receives new unread messages while open, fetch and mark as seen
  useEffect(() => {
    if (selectedContact) {
      adminGetMessages(selectedContact);
      adminMarkMessagesSeen(selectedContact);
    }
  }, [selectedContact]);

  useEffect(() => {
    if (selectedContact) {
      const hasUnseen = allMessages.some(m => String(m.senderId) === String(selectedContact) && m.receiverId === 'admin' && !m.seen);
      if (hasUnseen) {
        adminMarkMessagesSeen(selectedContact);
      }
    }
  }, [allMessages, selectedContact]);

  // Combine and deduplicate messages for selectedContact to guarantee 100% recovery of past history
  const currentMessages = useMemo(() => {
    if (!selectedContact) return [];
    const fromAll = allMessages.filter(msg => 
      (msg.senderId === 'admin' && msg.receiverId === selectedContact) ||
      (msg.senderId === selectedContact && msg.receiverId === 'admin')
    );
    const map = new Map();
    [...fromAll, ...messages].forEach(m => {
      if (m && (m._id || m.date)) {
        const key = m._id || `${m.senderId}_${m.date}`;
        map.set(key, m);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.date - b.date);
  }, [selectedContact, allMessages, messages]);

  // Precise container-only auto scroll (NEVER scrolls whole page/window)
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

  // File selection
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

  // Quick Emoji / reactions
  const handleQuickReaction = (emoji) => {
    setText(prev => prev + emoji);
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !chatFile) || !selectedContact || isSending) return;

    const currentText = text;
    const currentFile = chatFile;
    setText('');
    setChatFile(null);
    setFilePreview(null);
    setIsSending(true);

    await adminSendMessage(selectedContact, currentText, currentFile);
    setIsSending(false);
    scrollToBottom(true);
  };

  const activeDoc = selectedContact ? (conversations[selectedContact] || doctorMap[selectedContact]) : null;

  // Helper for message timestamp format
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

  return (
    <div className='h-full max-h-full flex-1 flex flex-col text-[#00311e] dark:text-[#EAE0C8] overflow-hidden select-none min-h-0'>
      
      {/* WhatsApp-Style Container: Fixed Outer Frame */}
      <div className='flex-1 h-full flex flex-col lg:flex-row border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-2xl bg-white dark:bg-[#181E26] overflow-hidden shadow-lg min-h-0'>
        
        {/* Left Contacts Sidebar */}
        <div className='w-full lg:w-[320px] xl:w-[350px] border-b lg:border-b-0 lg:border-r border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex flex-col bg-[#00311e]/5 dark:bg-[#141820] shrink-0 h-full min-h-0 overflow-hidden'>
          
          {/* Header Bar inside left pane (Fixed) */}
          <div className='p-3 px-4 border-b border-[#00311e]/10 dark:border-[#EAE0C8]/10 bg-white dark:bg-[#181E26] flex items-center justify-between shrink-0'>
            <div className='flex items-center gap-2'>
              <div className='w-7 h-7 rounded-lg bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] flex items-center justify-center font-bold text-xs'>
                MS
              </div>
              <h2 className='text-xs font-bold uppercase tracking-wider text-[#00311e] dark:text-[#EAE0C8]'>Physician Chats</h2>
            </div>
            <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'>
              ● Live Sync
            </span>
          </div>

          {/* Search Box (Fixed) */}
          <div className='p-2.5 px-3 border-b border-[#00311e]/10 dark:border-[#EAE0C8]/10 bg-white/60 dark:bg-[#181E26]/60 backdrop-blur-md shrink-0'>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-50'>🔍</span>
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search physician..."
                className='w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#00311e]/5 dark:bg-[#202833] border border-[#00311e]/10 dark:border-[#EAE0C8]/10 focus:border-[#00311e] dark:focus:border-[#EAE0C8] text-[#00311e] dark:text-[#EAE0C8] placeholder:text-[#00311e]/40 dark:placeholder:text-[#EAE0C8]/40 outline-none transition'
              />
            </div>
          </div>

          {/* ONLY this doctor list scrolls inside the left pane */}
          <div className='flex-1 overflow-y-auto divide-y divide-[#00311e]/5 dark:divide-[#EAE0C8]/5 min-h-0'>
            {filteredContacts.length === 0 ? (
              <div className='p-8 text-center text-[#00311e]/50 dark:text-[#EAE0C8]/50 text-xs'>
                No physicians matching "{searchTerm}"
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const isSelected = selectedContact === contact.id;
                const hasUnread = contact.unreadCount > 0;
                const lastMsg = contact.messages.length > 0 ? contact.messages[contact.messages.length - 1] : null;

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
                    {/* Avatar with status indicator */}
                    <div className='relative shrink-0'>
                      <img 
                        src={contact.image || 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png'} 
                        alt={contact.name} 
                        className='w-10 h-10 rounded-full object-cover border border-[#00311e]/15 dark:border-[#EAE0C8]/15'
                      />
                      {contact.available && (
                        <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#181E26]' title="Online"></span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className='flex-1 min-w-0 overflow-hidden'>
                      <div className='flex justify-between items-center mb-0.5'>
                        <h4 className={`text-xs truncate ${hasUnread ? 'font-bold text-[#00311e] dark:text-[#EAE0C8]' : 'font-semibold text-[#00311e]/90 dark:text-[#EAE0C8]/90'}`}>
                          {contact.name}
                        </h4>
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
                              {lastMsg.senderId === 'admin' && (
                                <span className={`mr-1 ${lastMsg.seen ? 'text-emerald-500' : 'text-neutral-400'}`}>
                                  {lastMsg.seen ? '✓✓' : '✓'}
                                </span>
                              )}
                              {lastMsg.text || (lastMsg.attachment ? '📷 [Attachment]' : 'New message')}
                            </>
                          ) : (
                            <span className='italic text-[#00311e]/40 dark:text-[#EAE0C8]/40'>{contact.speciality}</span>
                          )}
                        </p>

                        {/* WhatsApp-style green unread pill */}
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
          {selectedContact && activeDoc ? (
            <>
              {/* Chat Topbar (Fixed at top) */}
              <div className='p-3 px-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-between bg-[#00311e]/5 dark:bg-[#141820] backdrop-blur-md shrink-0'>
                <div className='flex items-center gap-3'>
                  <div className='relative'>
                    <img 
                      src={activeDoc.image || 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png'} 
                      className='w-9 h-9 rounded-full object-cover border border-[#00311e]/15 dark:border-[#EAE0C8]/20' 
                      alt={activeDoc.name} 
                    />
                    {activeDoc.available && (
                      <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#141820]'></span>
                    )}
                  </div>
                  <div>
                    <h3 className='font-bold text-xs text-[#00311e] dark:text-[#EAE0C8]'>{activeDoc.name}</h3>
                    <p className='text-[10px] text-[#00311e]/60 dark:text-[#EAE0C8]/60 flex items-center gap-1.5'>
                      <span>{activeDoc.speciality}</span>
                      <span>•</span>
                      <span className='text-emerald-600 dark:text-emerald-400 font-medium'>Encrypted Admin Channel</span>
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <span className='px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 shadow-sm'>
                    {currentMessages.length} Messages
                  </span>
                </div>
              </div>

              {/* ONLY this message thread scrolls in the right pane */}
              <div ref={messagesContainerRef} className='flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-3 bg-[#fef7e5]/30 dark:bg-[#10141a] min-h-0'>
                {currentMessages.length === 0 ? (
                  <div className='m-auto text-center space-y-2 py-8'>
                    <div className='w-12 h-12 rounded-full bg-[#00311e]/10 dark:bg-[#EAE0C8]/10 text-2xl flex items-center justify-center mx-auto text-[#00311e] dark:text-[#EAE0C8]'>
                      💬
                    </div>
                    <h4 className='text-xs font-bold text-[#00311e] dark:text-[#EAE0C8]'>No messages yet</h4>
                    <p className='text-[11px] text-[#00311e]/60 dark:text-[#EAE0C8]/60 max-w-xs'>
                      Start the consultation channel with {activeDoc.name}.
                    </p>
                  </div>
                ) : (
                  currentMessages.map((msg, index) => {
                    const isMe = msg.senderId === 'admin';
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
                            isMe 
                              ? 'bg-[#00311e] dark:bg-[#EAE0C8] text-[#fef7e5] dark:text-[#202833] rounded-2xl rounded-tr-xs font-medium' 
                              : 'bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/15 text-[#00311e] dark:text-[#EAE0C8] rounded-2xl rounded-tl-xs'
                          }`}>
                            
                            {/* Attachment if present */}
                            {msg.attachment && (
                              <div className="mb-2 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
                                {msg.attachment.match(/\.(jpeg|jpg|gif|png|webp)/i) || msg.attachment.startsWith('blob:') ? (
                                  <a href={msg.attachment} target="_blank" rel="noopener noreferrer">
                                    <img src={msg.attachment} alt="attachment" className="max-w-[240px] max-h-[200px] object-cover rounded-lg hover:scale-105 transition-transform duration-200" />
                                  </a>
                                ) : (
                                  <a href={msg.attachment} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 p-1.5 underline ${isMe ? 'text-[#fef7e5] dark:text-[#202833]' : 'text-[#00311e] dark:text-[#EAE0C8]'}`}>
                                    <span>📎</span>
                                    <span>Download Attachment</span>
                                  </a>
                                )}
                              </div>
                            )}

                            {/* Text content */}
                            {msg.text && <p className='whitespace-pre-wrap break-words'>{msg.text}</p>}

                            {/* Timestamp & Double Checkmarks (WhatsApp style) */}
                            <div className={`flex items-center justify-end gap-1 mt-0.5 text-[10px] ${
                              isMe ? 'text-[#fef7e5]/70 dark:text-[#202833]/70' : 'text-[#00311e]/50 dark:text-[#EAE0C8]/50'
                            }`}>
                              <span>{formatTime(msg.date)}</span>
                              {isMe && (
                                <span className={`text-[12px] font-bold ${msg.seen ? 'text-cyan-300 dark:text-emerald-700' : 'opacity-70'}`} title={msg.seen ? 'Seen by Doctor' : 'Sent'}>
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

              {/* Quick Reaction Pill Bar (Fixed at bottom) */}
              <div className='px-4 py-1.5 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 bg-white/70 dark:bg-[#181E26]/70 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0'>
                <span className='text-[10px] font-bold uppercase tracking-wider text-[#00311e]/40 dark:text-[#EAE0C8]/40 mr-1'>Quick:</span>
                {['👍 Confirmed', '🩺 Consultation', '💊 Rx Approved', '✅ Verified', '👋 Hello Dr.', '🙏 Thank you'].map((quick, i) => (
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

              {/* Chat Input Bar (Fixed at bottom) */}
              <form onSubmit={handleSendMessage} className='p-3 border-t border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex gap-2 items-center bg-white dark:bg-[#181E26] shrink-0'>
                <label className='cursor-pointer p-1.5 rounded-xl text-[#00311e]/60 hover:text-[#00311e] hover:bg-[#00311e]/5 dark:text-[#EAE0C8]/60 dark:hover:text-[#EAE0C8] dark:hover:bg-[#EAE0C8]/5 transition' title="Attach file">
                  <span className='text-base'>📎</span>
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>

                <div className='flex items-center gap-1'>
                  {['😊', '👍', '❤️', '🩺', '✅'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleQuickReaction(emoji)}
                      className='p-1 rounded-lg hover:bg-[#00311e]/5 dark:hover:bg-[#EAE0C8]/5 text-sm transition hidden sm:inline-block'
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <input 
                  type="text" 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Message ${activeDoc.name}... (Press Enter to send)`}
                  className='flex-1 bg-[#00311e]/5 dark:bg-[#141820] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 focus:border-[#00311e] dark:focus:border-[#EAE0C8] rounded-xl px-3.5 py-2 text-xs text-[#00311e] dark:text-[#EAE0C8] placeholder:text-[#00311e]/40 dark:placeholder:text-[#EAE0C8]/40 outline-none transition shadow-inner'
                />

                <button 
                  type="submit" 
                  disabled={(!text.trim() && !chatFile) || isSending}
                  className='px-4 py-2 rounded-xl bg-[#00311e] hover:bg-[#00311e]/90 dark:bg-[#EAE0C8] dark:hover:bg-[#EAE0C8]/90 text-[#fef7e5] dark:text-[#202833] text-xs font-bold disabled:opacity-40 transition shadow-sm flex items-center gap-1.5'
                >
                  <span>Send</span>
                  <span>➤</span>
                </button>
              </form>
            </>
          ) : (
            <div className='m-auto text-center p-8 max-w-sm space-y-2'>
              <div className='w-14 h-14 rounded-full bg-[#00311e]/10 dark:bg-[#EAE0C8]/10 text-2xl flex items-center justify-center mx-auto text-[#00311e] dark:text-[#EAE0C8] animate-pulse'>
                💬
              </div>
              <h3 className='text-sm font-bold text-[#00311e] dark:text-[#EAE0C8]'>Select a Physician Channel</h3>
              <p className='text-[11px] text-[#00311e]/70 dark:text-[#EAE0C8]/70 leading-relaxed'>
                Select any doctor from the left roster to view their conversation history and respond in real-time.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default AdminMessages;
