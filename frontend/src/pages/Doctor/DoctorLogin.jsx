import React, { useContext, useState } from 'react';
import axios from 'axios';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { backendUrl, setDtoken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const handleDoctorLogin = async (submitEmail = email, submitPassword = password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email: submitEmail, password: submitPassword });
      if (data.success) {
        localStorage.setItem('dtoken', data.token);
        setDtoken(data.token);
        navigate('/doctor/dashboard');
        toast.success('Doctor Login Successful!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    handleDoctorLogin();
  }

  const handleQuickDoctorLogin = () => {
    setEmail('richard@medsync.com');
    setPassword('password123');
    handleDoctorLogin('richard@medsync.com', 'password123');
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center py-10 transition-colors'>
      <div className='w-full max-w-md'>
        
        {/* Quick Doctor Demo Bypass Bar */}
        <div className='mb-4 p-4 bg-[#00311e]/10 dark:bg-[#181E26] border border-[#00311e]/20 dark:border-[#EAE0C8]/25 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-[11px] font-bold uppercase tracking-wider text-[#00311e] dark:text-[#EAE0C8] flex items-center gap-1.5'>
              ⚡ Quick Doctor Bypass
            </span>
            <span className='text-[10px] bg-emerald-600 text-white px-2 py-0.5 font-bold uppercase tracking-wider'>
              1-Click
            </span>
          </div>
          <button
            type="button"
            onClick={handleQuickDoctorLogin}
            disabled={loading}
            className='w-full bg-[#00311e] hover:bg-[#002416] dark:bg-[#EAE0C8] dark:hover:bg-white text-[#fef7e5] dark:text-[#202833] py-2.5 px-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50'
          >
            ⚡ Quick 1-Click Login (Dr. Richard James)
          </button>
        </div>

        <form onSubmit={onSubmitHandler}>
          <div className='flex flex-col gap-5 p-8 sm:p-10 bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 shadow-md transition-all duration-300'>
            
            <div className='w-full flex justify-between items-center mb-1'>
              <h2 className='text-2xl sm:text-3xl font-bold text-[#00311e] dark:text-[#EAE0C8] tracking-tight'>
                Doctor Portal
              </h2>
              <select 
                className='border border-[#00311e]/20 dark:border-[#EAE0C8]/30 px-3 py-1 text-xs outline-none bg-[#fef7e5]/50 dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8] cursor-pointer font-medium'
                onChange={(e) => {
                   if (e.target.value === 'patient') navigate('/login');
                   if (e.target.value === 'admin') navigate('/admin');
                }}
                defaultValue="doctor"
              >
                <option value="patient" className='bg-white dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8]'>Patient</option>
                <option value="doctor" className='bg-white dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8]'>Doctor</option>
                <option value="admin" className='bg-white dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8]'>Admin</option>
              </select>
            </div>

            <p className='text-[#00311e]/70 dark:text-[#EAE0C8]/70 text-xs sm:text-sm font-light'>Please log in to manage your appointments and patient records.</p>

            <div className='w-full'>
              <label className='font-semibold text-[#00311e] dark:text-[#EAE0C8] mb-1.5 block text-xs uppercase tracking-wider'>Email Address</label>
              <input className='border border-[#00311e]/20 dark:border-[#EAE0C8]/30 bg-[#fef7e5]/40 dark:bg-[#202833]/50 w-full p-3 outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] text-[#00311e] dark:text-[#EAE0C8] text-sm font-medium transition-all placeholder-[#00311e]/40 dark:placeholder-[#EAE0C8]/40' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required placeholder='richard@medsync.com' />
            </div>
            
            <div className='w-full'>
              <label className='font-semibold text-[#00311e] dark:text-[#EAE0C8] mb-1.5 block text-xs uppercase tracking-wider'>Password</label>
              <input className='border border-[#00311e]/20 dark:border-[#EAE0C8]/30 bg-[#fef7e5]/40 dark:bg-[#202833]/50 w-full p-3 outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] text-[#00311e] dark:text-[#EAE0C8] text-sm font-medium transition-all placeholder-[#00311e]/40 dark:placeholder-[#EAE0C8]/40' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required placeholder='••••••••' />
            </div>
            
            <button type="submit" disabled={loading} className='bg-[#00311e] hover:bg-[#002416] dark:bg-[#EAE0C8] dark:hover:bg-white text-[#fef7e5] dark:text-[#202833] w-full py-3.5 text-xs font-bold uppercase tracking-wider transition-all mt-2 shadow-sm disabled:opacity-50'>
              {loading ? 'Signing in...' : 'Login To Doctor Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DoctorLogin;
