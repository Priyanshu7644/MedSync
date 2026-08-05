import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorProfile = () => {
  const { dtoken, profileData, setProfileData, getProfileData, backendUrl, currencySymbol } = useContext(DoctorContext);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (dtoken) {
      getProfileData();
    }
  }, [dtoken]);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available
      };
      
      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, { headers: { dtoken } });
      
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return profileData && (
    <div className='m-5 flex flex-col gap-4 transition-colors'>
      <div>
        <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
      </div>

      <div className='flex-1 border border-gray-300 dark:border-gray-700 rounded-lg p-8 py-7 bg-white dark:bg-gray-800 shadow-sm transition-colors'>
        {/* Name, Degree, Experience */}
        <p className='flex items-center gap-2 text-3xl font-medium text-gray-900 dark:text-white'>
          {profileData.name}
        </p>
        
        <div className='flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1'>
          <p>{profileData.degree} - {profileData.speciality}</p>
          <button className='py-0.5 px-2 border dark:border-gray-600 text-xs rounded-full'>{profileData.experience}</button>
        </div>

        {/* About */}
        <div>
          <p className='flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white mt-3'>About:</p>
          <p className='text-sm text-gray-500 dark:text-gray-300 max-w-[700px] mt-1'>
            {profileData.about}
          </p>
        </div>

        <p className='text-gray-600 dark:text-gray-300 font-medium mt-4'>
          Appointment fee: <span className='text-gray-800 dark:text-white'>{currencySymbol} {isEdit ? <input className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-2 w-20 outline-none' type="number" onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} /> : profileData.fees}</span>
        </p>

        <div className='flex gap-2 py-2 mt-4 text-gray-800 dark:text-gray-200'>
          <p>Address:</p>
          <p className='text-sm text-gray-500 dark:text-gray-300'>
            {isEdit ? <input className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-2 w-full outline-none mt-1' type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData?.address?.line1 || ''} /> : profileData?.address?.line1 || ''}
            <br />
            {isEdit ? <input className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-2 w-full outline-none mt-1' type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData?.address?.line2 || ''} /> : profileData?.address?.line2 || ''}
          </p>
        </div>

        <div className='flex gap-1 pt-2 text-gray-800 dark:text-gray-200'>
          <input type="checkbox" onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} id="available" />
          <label htmlFor="available">Available</label>
        </div>

        <div className='mt-5'>
          {isEdit ? 
            <button onClick={updateProfile} className='px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all rounded-full'>Save Information</button>
            : 
            <button onClick={() => setIsEdit(true)} className='px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all rounded-full'>Edit Profile</button>
          }
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile;
