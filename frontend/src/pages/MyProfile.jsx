import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone || '');
      formData.append('address', JSON.stringify(userData.address || { line1: '', line2: '' }));
      formData.append('gender', userData.gender || 'Not Selected');
      formData.append('dob', userData.dob || '');

      image && formData.append('image', image);

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, { headers: { token } });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return userData && (
    <div className='max-w-lg flex flex-col gap-4 text-sm pt-5 transition-colors'>
      {
        isEdit 
        ? <label htmlFor="image">
            <div className='inline-block relative cursor-pointer'>
              <img className='w-36 h-36 rounded object-cover shadow-sm opacity-75' src={image ? URL.createObjectURL(image) : userData.image || assets.hero_img} alt="" />
              {!image && <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-semibold drop-shadow-md text-xs whitespace-nowrap bg-white/70 px-2 py-1 rounded'>Change Photo</p>}
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
          </label>
        : <img className='w-36 h-36 rounded object-cover shadow-sm' src={userData.image || assets.hero_img} alt="Profile" />
      }
      
      {
        isEdit 
        ? <input className='bg-gray-50 dark:bg-gray-800 dark:text-white text-3xl font-medium max-w-60 mt-4 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded outline-primary focus:ring-1 focus:ring-primary' type="text" value={userData.name} onChange={e => setUserData(prev => ({...prev, name: e.target.value}))}/> 
        : <p className='font-medium text-3xl text-neutral-800 dark:text-white mt-4'>{userData.name}</p>
      }

      <hr className='bg-zinc-400 h-[1px] border-none my-2' />

      <div>
        <p className='text-neutral-500 dark:text-gray-300 underline mt-3 mb-4 tracking-wider'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700 dark:text-gray-200 items-center'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          
          <p className='font-medium'>Phone:</p>
          {
            isEdit
            ? <input className='bg-gray-50 dark:bg-gray-800 dark:text-white max-w-52 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded outline-primary focus:ring-1 focus:ring-primary' type="text" value={userData.phone || ''} onChange={e => setUserData(prev => ({...prev, phone: e.target.value}))}/>
            : <p className='text-blue-400'>{userData.phone || 'N/A'}</p>
          }
          
          <p className='font-medium self-start mt-1'>Address:</p>
          {
            isEdit
            ? <div className='flex flex-col gap-2'>
              <input className='bg-gray-50 dark:bg-gray-800 dark:text-white px-2 py-1 border border-gray-300 dark:border-gray-600 rounded outline-primary focus:ring-1 focus:ring-primary w-full' type="text" value={userData.address?.line1 || ''} onChange={e => setUserData(prev => ({...prev, address: {...(prev.address || {}), line1: e.target.value}}))}/>
              <input className='bg-gray-50 dark:bg-gray-800 dark:text-white px-2 py-1 border border-gray-300 dark:border-gray-600 rounded outline-primary focus:ring-1 focus:ring-primary w-full' type="text" value={userData.address?.line2 || ''} onChange={e => setUserData(prev => ({...prev, address: {...(prev.address || {}), line2: e.target.value}}))}/>
            </div>
            : <p className='text-gray-500 dark:text-gray-300'>
              {userData.address?.line1 || 'Update your address'}
              <br />
              {userData.address?.line2 || ''}
            </p>
          }
        </div>
      </div>
      
      <div>
        <p className='text-neutral-500 dark:text-gray-300 underline mt-8 mb-4 tracking-wider'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700 dark:text-gray-200 items-center'>
          <p className='font-medium'>Gender:</p>
          {
            isEdit
            ? <select className='max-w-28 bg-gray-50 dark:bg-gray-800 dark:text-white px-2 py-1 border border-gray-300 dark:border-gray-600 rounded outline-primary focus:ring-1 focus:ring-primary' value={userData.gender || 'Not Selected'} onChange={(e) => setUserData(prev => ({...prev, gender: e.target.value}))}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Not Selected">Not Selected</option>
            </select>
            : <p className='text-gray-500 dark:text-gray-300'>{userData.gender || 'Not Selected'}</p>
          }
          
          <p className='font-medium'>Birthday:</p>
          {
            isEdit
            ? <input className='max-w-36 bg-gray-50 dark:bg-gray-800 dark:text-white px-2 py-1 border border-gray-300 dark:border-gray-600 rounded outline-primary focus:ring-1 focus:ring-primary' type="date" value={userData.dob || ''} onChange={e => setUserData(prev => ({...prev, dob: e.target.value}))}/>
            : <p className='text-gray-500 dark:text-gray-300'>{userData.dob || 'Not Selected'}</p>
          }
        </div>
      </div>

      <div className='mt-10 mb-20'>
        {
          isEdit 
          ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm' onClick={updateUserProfileData}>Save information</button>
          : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm' onClick={() => setIsEdit(true)}>Edit</button>
        }
      </div>

    </div>
  )
}

export default MyProfile;
