import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAToken, backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
      
      if (data.success) {
        localStorage.setItem('aToken', data.token);
        setAToken(data.token);
        toast.success("Login Successful");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center mt-5'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-md'>
        <div className='flex flex-col gap-4 m-auto p-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300'>
          
          <div className='w-full flex justify-between items-center mb-2'>
            <h2 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-blue-400 dark:to-blue-200'>
              Admin Login
            </h2>
            <select 
              className='border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs outline-none bg-white dark:bg-gray-700 text-gray-600 dark:text-white shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-primary/20 transition-all font-medium'
              onChange={(e) => {
                 if (e.target.value === 'patient') navigate('/login');
                 if (e.target.value === 'doctor') navigate('/doctor');
              }}
              defaultValue="admin"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <p className='text-gray-500 dark:text-gray-200 text-sm mb-2'>Please log in to manage the platform.</p>

          <div className='w-full'>
            <label className='font-medium text-gray-600 dark:text-white mb-1 block text-sm'>Email Address</label>
            <input className='border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg w-full p-3 outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white dark:focus:bg-gray-700 text-gray-800 dark:text-white transition-all shadow-sm' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required placeholder='e.g. admin@example.com' />
          </div>
          
          <div className='w-full'>
            <label className='font-medium text-gray-600 dark:text-white mb-1 block text-sm'>Password</label>
            <input className='border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg w-full p-3 outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white dark:focus:bg-gray-700 text-gray-800 dark:text-white transition-all shadow-sm' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required placeholder='••••••••' />
          </div>
          
          <button type="submit" className='bg-gradient-to-r from-primary to-blue-500 text-white w-full py-3.5 rounded-lg text-base font-semibold hover:shadow-lg hover:from-blue-600 hover:to-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all mt-4'>
            Login Securely
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login;
