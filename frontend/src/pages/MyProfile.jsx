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
    <div className='max-w-2xl flex flex-col gap-6 py-8 text-[#202833] dark:text-[#EAE0C8] transition-colors'>
      <div className='flex items-center gap-6'>
        {
          isEdit 
          ? <label htmlFor="image">
              <div className='inline-block relative cursor-pointer'>
                <img className='w-32 h-32 object-cover border border-[#202833]/20 dark:border-[#EAE0C8]/30 shadow-sm opacity-75' src={image ? URL.createObjectURL(image) : userData.image || assets.hero_img} alt="" />
                {!image && <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#202833] font-bold text-xs uppercase tracking-wider whitespace-nowrap bg-[#EAE0C8] px-2.5 py-1 border border-[#202833]'>Change</p>}
              </div>
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
            </label>
          : <img className='w-32 h-32 object-cover border border-[#202833]/20 dark:border-[#EAE0C8]/30 shadow-sm' src={userData.image || assets.hero_img} alt="Profile" />
        }
        
        <div>
          {
            isEdit 
            ? <input className='bg-[#EAE0C8]/30 dark:bg-[#202833] dark:text-[#EAE0C8] text-2xl font-bold max-w-sm px-3 py-1.5 border border-[#202833]/20 dark:border-[#EAE0C8]/30 outline-none focus:border-[#202833] dark:focus:border-[#EAE0C8]' type="text" value={userData.name} onChange={e => setUserData(prev => ({...prev, name: e.target.value}))}/> 
            : <p className='font-bold text-2xl sm:text-3xl text-[#202833] dark:text-[#EAE0C8]'>{userData.name}</p>
          }
        </div>
      </div>

      <div className='bg-white/95 dark:bg-[#181E26] border border-[#202833]/15 dark:border-[#EAE0C8]/20 p-6 shadow-sm space-y-6'>
        <div>
          <p className='font-bold text-xs uppercase tracking-widest text-[#202833] dark:text-[#EAE0C8] pb-2 border-b border-[#202833]/10 dark:border-[#EAE0C8]/10'>Contact Information</p>
          <div className='grid grid-cols-[1fr_2.5fr] gap-y-3 mt-4 text-sm items-center'>
            <p className='font-semibold text-[#202833]/70 dark:text-[#EAE0C8]/70'>Email:</p>
            <p className='font-medium text-[#202833] dark:text-[#EAE0C8]'>{userData.email}</p>
            
            <p className='font-semibold text-[#202833]/70 dark:text-[#EAE0C8]/70'>Phone:</p>
            {
              isEdit
              ? <input className='bg-[#EAE0C8]/30 dark:bg-[#202833] text-[#202833] dark:text-[#EAE0C8] max-w-sm px-3 py-1.5 border border-[#202833]/20 dark:border-[#EAE0C8]/30 outline-none focus:border-[#202833] dark:focus:border-[#EAE0C8] text-sm' type="text" value={userData.phone || ''} onChange={e => setUserData(prev => ({...prev, phone: e.target.value}))}/>
              : <p className='font-medium text-[#202833] dark:text-[#EAE0C8]'>{userData.phone || 'N/A'}</p>
            }
            
            <p className='font-semibold text-[#202833]/70 dark:text-[#EAE0C8]/70 self-start mt-1'>Address:</p>
            {
              isEdit
              ? <div className='flex flex-col gap-2'>
                <input className='bg-[#EAE0C8]/30 dark:bg-[#202833] text-[#202833] dark:text-[#EAE0C8] px-3 py-1.5 border border-[#202833]/20 dark:border-[#EAE0C8]/30 outline-none focus:border-[#202833] dark:focus:border-[#EAE0C8] w-full text-sm' type="text" value={userData.address?.line1 || ''} onChange={e => setUserData(prev => ({...prev, address: {...(prev.address || {}), line1: e.target.value}}))}/>
                <input className='bg-[#EAE0C8]/30 dark:bg-[#202833] text-[#202833] dark:text-[#EAE0C8] px-3 py-1.5 border border-[#202833]/20 dark:border-[#EAE0C8]/30 outline-none focus:border-[#202833] dark:focus:border-[#EAE0C8] w-full text-sm' type="text" value={userData.address?.line2 || ''} onChange={e => setUserData(prev => ({...prev, address: {...(prev.address || {}), line2: e.target.value}}))}/>
              </div>
              : <p className='text-[#202833]/80 dark:text-[#EAE0C8]/80 text-sm leading-relaxed'>
                {userData.address?.line1 || 'Update your address'}
                <br />
                {userData.address?.line2 || ''}
              </p>
            }
          </div>
        </div>
        
        <div>
          <p className='font-bold text-xs uppercase tracking-widest text-[#202833] dark:text-[#EAE0C8] pb-2 border-b border-[#202833]/10 dark:border-[#EAE0C8]/10'>Basic Information</p>
          <div className='grid grid-cols-[1fr_2.5fr] gap-y-3 mt-4 text-sm items-center'>
            <p className='font-semibold text-[#202833]/70 dark:text-[#EAE0C8]/70'>Gender:</p>
            {
              isEdit
              ? <select className='max-w-36 bg-[#EAE0C8]/30 dark:bg-[#202833] text-[#202833] dark:text-[#EAE0C8] px-3 py-1.5 border border-[#202833]/20 dark:border-[#EAE0C8]/30 outline-none text-sm' value={userData.gender || 'Not Selected'} onChange={(e) => setUserData(prev => ({...prev, gender: e.target.value}))}>
                <option value="Male" className='bg-white dark:bg-[#202833] text-[#202833] dark:text-[#EAE0C8]'>Male</option>
                <option value="Female" className='bg-white dark:bg-[#202833] text-[#202833] dark:text-[#EAE0C8]'>Female</option>
                <option value="Not Selected" className='bg-white dark:bg-[#202833] text-[#202833] dark:text-[#EAE0C8]'>Not Selected</option>
              </select>
              : <p className='font-medium text-[#202833] dark:text-[#EAE0C8]'>{userData.gender || 'Not Selected'}</p>
            }
            
            <p className='font-semibold text-[#202833]/70 dark:text-[#EAE0C8]/70'>Birthday:</p>
            {
              isEdit
              ? <input className='max-w-44 bg-[#EAE0C8]/30 dark:bg-[#202833] text-[#202833] dark:text-[#EAE0C8] px-3 py-1.5 border border-[#202833]/20 dark:border-[#EAE0C8]/30 outline-none text-sm' type="date" value={userData.dob || ''} onChange={e => setUserData(prev => ({...prev, dob: e.target.value}))}/>
              : <p className='font-medium text-[#202833] dark:text-[#EAE0C8]'>{userData.dob || 'Not Selected'}</p>
            }
          </div>
        </div>

        <div className='pt-2'>
          {
            isEdit 
            ? <button className='bg-[#202833] text-[#EAE0C8] hover:bg-[#161C24] dark:bg-[#EAE0C8] dark:text-[#202833] dark:hover:bg-white text-xs font-bold uppercase tracking-wider px-8 py-3 transition-all shadow-sm' onClick={updateUserProfileData}>Save information</button>
            : <button className='border border-[#202833] dark:border-[#EAE0C8] text-[#202833] dark:text-[#EAE0C8] hover:bg-[#202833] hover:text-[#EAE0C8] dark:hover:bg-[#EAE0C8] dark:hover:text-[#202833] text-xs font-bold uppercase tracking-wider px-8 py-3 transition-all shadow-sm' onClick={() => setIsEdit(true)}>Edit Profile</button>
          }
        </div>
      </div>

    </div>
  )
}

export default MyProfile;
