import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'General Support',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Thank you! Your message has been received. Our team will contact you shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'General Support',
        message: ''
      });
    }, 800);
  };

  const faqs = [
    {
      q: 'How do I reschedule or cancel an existing appointment?',
      a: 'You can easily reschedule or cancel an appointment by visiting "My Appointments" from your user menu. Cancellations made at least 2 hours prior are processed instantly.'
    },
    {
      q: 'Are there any platform booking fees charged to patients?',
      a: 'No. MedSync does not charge patients any platform convenience fees for searching or scheduling consultations with our doctors.'
    },
    {
      q: 'How are medical specialists verified on MedSync?',
      a: 'All physicians undergo a comprehensive multi-step verification process, including state medical council registration, medical degree authentication, and clinical credential checks.'
    },
    {
      q: 'How quickly does the patient care support team respond?',
      a: 'Our central concierge team responds to online tickets and email queries within 15 minutes. For immediate emergencies, our 24/7 hotline is always live.'
    }
  ];

  return (
    <div className='py-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors duration-300'>
      
      {/* Header Banner */}
      <div className='text-center space-y-3 pt-4 mb-12'>
        <div className='inline-flex items-center gap-2 border border-[#00311e]/20 dark:border-[#EAE0C8]/20 bg-[#00311e]/5 dark:bg-[#EAE0C8]/10 px-3.5 py-1 text-xs font-bold tracking-widest uppercase'>
          <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
          24/7 Patient Concierge & Support
        </div>
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>
          We're Here For Your Care
        </h1>
        <p className='sm:w-2/3 mx-auto text-center text-[#00311e]/70 dark:text-[#EAE0C8]/75 font-light text-sm sm:text-base leading-relaxed'>
          Have questions about finding a specialist, managing your appointment, or institutional partnerships? Reach out to our dedicated healthcare team.
        </p>
      </div>

      {/* Main Split: Support Photo & Info + Interactive Contact Form */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-16'>
        
        {/* Left Column (5 cols): Photo & Contact Info Cards */}
        <div className='lg:col-span-5 flex flex-col gap-6'>
          
          {/* Realistic Healthcare Concierge Photograph */}
          <div className='relative overflow-hidden bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 p-3 shadow-sm'>
            <div className='relative h-[240px] sm:h-[280px] w-full overflow-hidden'>
              <img 
                className='w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]' 
                src={assets.contact_support_real || assets.hero_doctor_real} 
                alt="MedSync Patient Care Support Center" 
              />
              <div className='absolute inset-0 bg-gradient-to-t from-[#202833]/90 via-transparent to-transparent'></div>
              <div className='absolute bottom-3 left-3 right-3 text-white flex items-end justify-between'>
                <div>
                  <p className='font-bold text-sm sm:text-base drop-shadow-md text-white'>Central Care Desk</p>
                  <p className='text-xs text-white/90 drop-shadow-md'>Hospital network coordination</p>
                </div>
                <span className='bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider shadow-sm'>
                  Live 24/7
                </span>
              </div>
            </div>
          </div>

          {/* Quick Communication Info Blocks */}
          <div className='bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 p-6 shadow-sm space-y-5'>
            
            <div className='flex items-start gap-4'>
              <div className='w-10 h-10 bg-[#fef7e5] dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-center text-lg flex-shrink-0'>
                📍
              </div>
              <div>
                <b className='block text-xs uppercase tracking-wider font-bold text-[#00311e] dark:text-[#EAE0C8]'>Headquarters & Regional Office</b>
                <p className='text-xs text-[#00311e]/75 dark:text-[#EAE0C8]/75 mt-0.5 leading-relaxed'>
                  MedSync Health Plaza, Tower B, Sector 44, <br/>
                  Gurgaon, Delhi NCR, India — 122003
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4 pt-4 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
              <div className='w-10 h-10 bg-[#fef7e5] dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-center text-lg flex-shrink-0'>
                📞
              </div>
              <div>
                <b className='block text-xs uppercase tracking-wider font-bold text-[#00311e] dark:text-[#EAE0C8]'>Toll-Free Phone Helpline</b>
                <p className='text-xs text-[#00311e]/75 dark:text-[#EAE0C8]/75 mt-0.5'>
                  Patient Helpline: +91 (800) 123-4567 <br/>
                  Emergency Escalations: +91 (800) 765-4321
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4 pt-4 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
              <div className='w-10 h-10 bg-[#fef7e5] dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 flex items-center justify-center text-lg flex-shrink-0'>
                ✉️
              </div>
              <div>
                <b className='block text-xs uppercase tracking-wider font-bold text-[#00311e] dark:text-[#EAE0C8]'>Direct Email Desks</b>
                <p className='text-xs text-[#00311e]/75 dark:text-[#EAE0C8]/75 mt-0.5'>
                  Patient Care: support@medsync.health <br/>
                  Doctors & Clinics: partners@medsync.health
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (7 cols): Interactive Contact Form */}
        <div className='lg:col-span-7 bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col justify-between'>
          <div>
            <div className='mb-6 pb-4 border-b border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
              <h2 className='text-xl sm:text-2xl font-bold text-[#00311e] dark:text-[#EAE0C8]'>Send Us a Message</h2>
              <p className='text-xs sm:text-sm text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-1'>
                Fill out the details below and our medical support specialists will get back to you within minutes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-[11px] font-bold uppercase tracking-wider text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1.5'>
                    Your Full Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Rahul Sharma"
                    className='w-full bg-[#fef7e5]/40 dark:bg-[#202833]/60 border border-[#00311e]/20 dark:border-[#EAE0C8]/25 px-4 py-2.5 text-sm text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors'
                  />
                </div>

                <div>
                  <label className='block text-[11px] font-bold uppercase tracking-wider text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1.5'>
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@example.com"
                    className='w-full bg-[#fef7e5]/40 dark:bg-[#202833]/60 border border-[#00311e]/20 dark:border-[#EAE0C8]/25 px-4 py-2.5 text-sm text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-[11px] font-bold uppercase tracking-wider text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1.5'>
                    Phone Number (Optional)
                  </label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                    className='w-full bg-[#fef7e5]/40 dark:bg-[#202833]/60 border border-[#00311e]/20 dark:border-[#EAE0C8]/25 px-4 py-2.5 text-sm text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors'
                  />
                </div>

                <div>
                  <label className='block text-[11px] font-bold uppercase tracking-wider text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1.5'>
                    Inquiry Department
                  </label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className='w-full bg-[#fef7e5]/40 dark:bg-[#202833] border border-[#00311e]/20 dark:border-[#EAE0C8]/25 px-4 py-2.5 text-sm text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors'
                  >
                    <option value="General Support" className="bg-white dark:bg-[#202833]">General Patient Support</option>
                    <option value="Appointment Issue" className="bg-white dark:bg-[#202833]">Appointment Scheduling / Reschedule</option>
                    <option value="Doctor Registration" className="bg-white dark:bg-[#202833]">Doctor Onboarding & Verification</option>
                    <option value="Hospital Partnership" className="bg-white dark:bg-[#202833]">Hospital / Clinic Partnerships</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-[11px] font-bold uppercase tracking-wider text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1.5'>
                  Your Message or Query *
                </label>
                <textarea 
                  rows="4" 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Please describe how we can assist you..."
                  className='w-full bg-[#fef7e5]/40 dark:bg-[#202833]/60 border border-[#00311e]/20 dark:border-[#EAE0C8]/25 px-4 py-2.5 text-sm text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors resize-none'
                ></textarea>
              </div>

              <div className='pt-2'>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className='w-full sm:w-auto bg-[#00311e] hover:bg-[#002416] dark:bg-[#EAE0C8] dark:hover:bg-white text-[#fef7e5] dark:text-[#202833] px-8 py-3.5 font-bold text-xs uppercase tracking-wider transition-all shadow-sm disabled:opacity-50'
                >
                  {isSubmitting ? 'Transmitting Message...' : 'Submit Message ➔'}
                </button>
              </div>
            </form>
          </div>

          <div className='mt-6 pt-4 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 flex items-center justify-between text-[11px] text-[#00311e]/60 dark:text-[#EAE0C8]/60'>
            <span>🔒 Confidential & encrypted medical transmission</span>
            <span>Typical response: &lt; 15 mins</span>
          </div>
        </div>

      </div>

      {/* Institutional Partnerships & Doctor Onboarding Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-14'>
        
        <div className='bg-[#00311e] dark:bg-[#181E26] border border-[#00311e] dark:border-[#EAE0C8]/20 p-8 text-[#fef7e5] dark:text-[#EAE0C8] flex flex-col justify-between shadow-sm'>
          <div>
            <span className='text-[10px] font-bold uppercase tracking-widest bg-white/10 dark:bg-[#202833] px-3 py-1 border border-white/20 dark:border-[#EAE0C8]/20 inline-block mb-3'>
              Healthcare Providers
            </span>
            <h3 className='text-xl sm:text-2xl font-bold tracking-tight'>Are You a Certified Doctor?</h3>
            <p className='text-xs sm:text-sm text-[#fef7e5]/80 dark:text-[#EAE0C8]/80 mt-2 font-light leading-relaxed'>
              Expand your digital consultation presence, streamline patient queue management, and join our elite network of verified medical specialists.
            </p>
          </div>
          <div className='mt-6'>
            <button 
              onClick={() => { navigate('/doctor'); window.scrollTo(0, 0); }}
              className='bg-[#fef7e5] text-[#00311e] dark:bg-[#EAE0C8] dark:text-[#202833] hover:bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all'
            >
              Doctor Portal Login / Join ➔
            </button>
          </div>
        </div>

        <div className='bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 p-8 text-[#00311e] dark:text-[#EAE0C8] flex flex-col justify-between shadow-sm'>
          <div>
            <span className='text-[10px] font-bold uppercase tracking-widest bg-[#00311e]/5 dark:bg-[#202833] px-3 py-1 border border-[#00311e]/10 dark:border-[#EAE0C8]/20 inline-block mb-3'>
              Hospital Systems
            </span>
            <h3 className='text-xl sm:text-2xl font-bold tracking-tight'>Enterprise Clinic Partnerships</h3>
            <p className='text-xs sm:text-sm text-[#00311e]/75 dark:text-[#EAE0C8]/75 mt-2 font-light leading-relaxed'>
              Seamlessly integrate MedSync's doctor allocation, appointment syncing, and diagnostic dispatch into your clinic or hospital chain.
            </p>
          </div>
          <div className='mt-6'>
            <a 
              href="mailto:partners@medsync.health"
              className='inline-block border border-[#00311e] dark:border-[#EAE0C8] hover:bg-[#00311e] hover:text-[#fef7e5] dark:hover:bg-[#EAE0C8] dark:hover:text-[#202833] px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all'
            >
              Partner With Us ➔
            </a>
          </div>
        </div>

      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className='my-14'>
        <div className='text-center space-y-2 mb-8'>
          <div className='inline-flex items-center gap-2 border border-[#00311e]/20 dark:border-[#EAE0C8]/20 bg-[#00311e]/5 dark:bg-[#EAE0C8]/10 px-3 py-1 text-[11px] font-bold tracking-widest uppercase'>
            Quick Helpdesk
          </div>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>
            Frequently Asked Questions
          </h2>
        </div>

        <div className='max-w-3xl mx-auto space-y-3'>
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className='bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 transition-colors'
            >
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className='w-full p-5 text-left flex items-center justify-between gap-4'
              >
                <span className='font-bold text-sm text-[#00311e] dark:text-[#EAE0C8]'>{faq.q}</span>
                <span className='text-base font-bold text-[#00311e]/70 dark:text-[#EAE0C8]/70'>
                  {openFaq === idx ? '−' : '+'}
                </span>
              </button>
              {openFaq === idx && (
                <div className='px-5 pb-5 pt-1 text-xs sm:text-sm text-[#00311e]/75 dark:text-[#EAE0C8]/75 leading-relaxed border-t border-[#00311e]/5 dark:border-[#EAE0C8]/5 font-light'>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Contact;
