import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const handleAuth = async (submitEmail = email, submitPassword = password, submitName = name, mode = state) => {
    setLoading(true);
    try {
      if (mode === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { 
          name: submitName || 'Demo Patient', 
          email: submitEmail, 
          password: submitPassword 
        });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Account created & logged in!");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { 
          email: submitEmail, 
          password: submitPassword 
        });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Logged in successfully!");
        } else {
          // If demo login fails because user doesn't exist yet, auto-register
          if (submitEmail === 'demo.patient@medsync.com') {
            const regRes = await axios.post(`${backendUrl}/api/user/register`, {
              name: 'Demo Patient',
              email: submitEmail,
              password: submitPassword
            });
            if (regRes.data.success) {
              localStorage.setItem('token', regRes.data.token);
              setToken(regRes.data.token);
              toast.success("Demo account created & logged in!");
              return;
            }
          }
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    handleAuth();
  }

  const handleQuickPatientLogin = () => {
    setEmail('demo.patient@medsync.com');
    setPassword('password123');
    setName('Demo Patient');
    handleAuth('demo.patient@medsync.com', 'password123', 'Demo Patient', 'Login');
  }

  const handleQuickRegister = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const quickEmail = `patient${randomId}@medsync.com`;
    const quickPass = 'password123';
    const quickName = `Patient Test ${randomId}`;
    setState('Sign Up');
    setEmail(quickEmail);
    setPassword(quickPass);
    setName(quickName);
    handleAuth(quickEmail, quickPass, quickName, 'Sign Up');
  }

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className='min-h-[80vh] flex items-center justify-center py-10 transition-colors'>
      <div className='w-full max-w-md'>
        
        {/* Quick Demo Bypass Bar */}
        <div className='mb-4 p-4 bg-[#00311e]/10 dark:bg-[#181E26] border border-[#00311e]/20 dark:border-[#EAE0C8]/25 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-[11px] font-bold uppercase tracking-wider text-[#00311e] dark:text-[#EAE0C8] flex items-center gap-1.5'>
              ⚡ Quick Developer Bypass
            </span>
            <span className='text-[10px] bg-emerald-600 text-white px-2 py-0.5 font-bold uppercase tracking-wider'>
              1-Click
            </span>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <button
              type="button"
              onClick={handleQuickPatientLogin}
              disabled={loading}
              className='bg-[#00311e] hover:bg-[#002416] dark:bg-[#EAE0C8] dark:hover:bg-white text-[#fef7e5] dark:text-[#202833] py-2 px-3 text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50'
            >
              Demo Patient Login
            </button>
            <button
              type="button"
              onClick={handleQuickRegister}
              disabled={loading}
              className='border border-[#00311e] dark:border-[#EAE0C8] text-[#00311e] dark:text-[#EAE0C8] hover:bg-[#00311e] hover:text-[#fef7e5] dark:hover:bg-[#EAE0C8] dark:hover:text-[#202833] py-2 px-3 text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50'
            >
              New Quick Account
            </button>
          </div>
        </div>

        <form onSubmit={onSubmitHandler}>
          <div className='flex flex-col gap-5 p-8 sm:p-10 bg-white/95 dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 shadow-md transition-all duration-300'>
            
            <div className='w-full flex justify-between items-center mb-1'>
              <h2 className='text-2xl sm:text-3xl font-bold text-[#00311e] dark:text-[#EAE0C8] tracking-tight'>
                {state === 'Sign Up' ? 'Create Account' : 'Patient Login'}
              </h2>
              <select 
                className='border border-[#00311e]/20 dark:border-[#EAE0C8]/30 px-3 py-1 text-xs outline-none bg-[#fef7e5]/50 dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8] cursor-pointer font-medium'
                onChange={(e) => {
                   if (e.target.value === 'doctor') navigate('/doctor');
                   if (e.target.value === 'admin') navigate('/admin');
                }}
                defaultValue="patient"
              >
                <option value="patient" className='bg-white dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8]'>Patient</option>
                <option value="doctor" className='bg-white dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8]'>Doctor</option>
                <option value="admin" className='bg-white dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8]'>Admin</option>
              </select>
            </div>
            
            <p className='text-[#00311e]/70 dark:text-[#EAE0C8]/70 text-xs sm:text-sm font-light'>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book your appointments.</p>
            
            {state === 'Sign Up' && (
              <div className='w-full'>
                <label className='font-semibold text-[#00311e] dark:text-[#EAE0C8] mb-1.5 block text-xs uppercase tracking-wider'>Full Name</label>
                <input className='border border-[#00311e]/20 dark:border-[#EAE0C8]/30 bg-[#fef7e5]/40 dark:bg-[#202833]/50 w-full p-3 outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] text-[#00311e] dark:text-[#EAE0C8] text-sm font-medium transition-all placeholder-[#00311e]/40 dark:placeholder-[#EAE0C8]/40' type="text" onChange={(e) => setName(e.target.value)} value={name} required placeholder='e.g. John Doe' />
              </div>
            )}
            
            <div className='w-full'>
              <label className='font-semibold text-[#00311e] dark:text-[#EAE0C8] mb-1.5 block text-xs uppercase tracking-wider'>Email Address</label>
              <input className='border border-[#00311e]/20 dark:border-[#EAE0C8]/30 bg-[#fef7e5]/40 dark:bg-[#202833]/50 w-full p-3 outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] text-[#00311e] dark:text-[#EAE0C8] text-sm font-medium transition-all placeholder-[#00311e]/40 dark:placeholder-[#EAE0C8]/40' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required placeholder='e.g. name@example.com' />
            </div>
            
            <div className='w-full'>
              <label className='font-semibold text-[#00311e] dark:text-[#EAE0C8] mb-1.5 block text-xs uppercase tracking-wider'>Password</label>
              <input className='border border-[#00311e]/20 dark:border-[#EAE0C8]/30 bg-[#fef7e5]/40 dark:bg-[#202833]/50 w-full p-3 outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] text-[#00311e] dark:text-[#EAE0C8] text-sm font-medium transition-all placeholder-[#00311e]/40 dark:placeholder-[#EAE0C8]/40' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required placeholder='••••••••' />
            </div>
            
            <button type="submit" disabled={loading} className='bg-[#00311e] hover:bg-[#002416] dark:bg-[#EAE0C8] dark:hover:bg-white text-[#fef7e5] dark:text-[#202833] w-full py-3.5 text-xs font-bold uppercase tracking-wider transition-all mt-2 shadow-sm disabled:opacity-50'>
              {loading ? 'Processing...' : state === 'Sign Up' ? 'Create Account' : 'Login Securely'}
            </button>
            
            <div className='mt-2 text-center text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 font-light'>
              {state === 'Sign Up' 
                ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-[#00311e] dark:text-[#EAE0C8] font-bold cursor-pointer underline underline-offset-4 ml-1'>Log in here</span></p>
                : <p>New to MedSync? <span onClick={() => setState('Sign Up')} className='text-[#00311e] dark:text-[#EAE0C8] font-bold cursor-pointer underline underline-offset-4 ml-1'>Create an account</span></p>
              }
            </div>
            
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;
