import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorProfile = () => {
  const { dtoken, profileData, setProfileData, getProfileData, backendUrl, currencySymbol } = useContext(DoctorContext);
  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (dtoken) {
      getProfileData();
    }
  }, [dtoken]);

  const updateProfile = async () => {
    setIsSaving(true);
    try {
      let coordinates = profileData.address?.coordinates || null;
      if (profileData.address?.pincode || profileData.address?.locality) {
        try {
          const query = `${profileData.address.locality ? profileData.address.locality + ',' : ''} ${profileData.address.pincode}`;
          const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
          const geoData = await response.json();
          if (geoData && geoData.length > 0) {
            coordinates = { lat: parseFloat(geoData[0].lat), lng: parseFloat(geoData[0].lon) };
          }
        } catch (e) {
          console.error("Geocoding failed", e);
        }
      }

      const updateData = {
        address: { ...profileData.address, coordinates },
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
    } finally {
      setIsSaving(false);
    }
  }

  if (!profileData) {
    return (
      <div className='flex items-center justify-center min-h-[50vh]'>
        <div className='w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6 text-[#00311e] dark:text-[#EAE0C8]'>
      
      {/* Header Bar */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>
            Profile & Clinic Settings
          </h1>
          <p className='text-sm text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>
            Manage your credentials, consultation fee, clinic location, and live appointment availability.
          </p>
        </div>

        <div>
          {isEdit ? (
            <div className='flex items-center gap-2'>
              <button 
                onClick={() => setIsEdit(false)}
                className='px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#00311e] dark:text-[#EAE0C8] bg-[#00311e]/5 hover:bg-[#00311e]/10 dark:bg-[#202833] dark:hover:bg-[#202833]/80 border border-[#00311e]/15 dark:border-[#EAE0C8]/20 transition'
              >
                Cancel
              </button>
              <button 
                onClick={updateProfile}
                disabled={isSaving}
                className='px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#00311e] hover:bg-[#00311e]/90 dark:bg-[#EAE0C8] dark:hover:bg-[#EAE0C8]/90 text-[#fef7e5] dark:text-[#202833] transition'
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEdit(true)}
              className='px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#00311e] hover:bg-[#00311e]/90 dark:bg-[#EAE0C8] dark:hover:bg-[#EAE0C8]/90 text-[#fef7e5] dark:text-[#202833] transition flex items-center gap-1.5'
            >
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Photo & Availability + Detailed Fields */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
        
        {/* Left Column: Doctor Identity & Status (4 Cols) */}
        <div className='lg:col-span-4 bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-xl p-5 space-y-5 text-center'>
          
          <div className='relative inline-block mx-auto'>
            <div className='w-40 h-48 rounded-xl overflow-hidden border border-[#00311e]/15 dark:border-[#EAE0C8]/20 bg-[#00311e]/5 dark:bg-[#202833] mx-auto'>
              <img 
                className='w-full h-full object-cover object-top' 
                src={profileData.image} 
                alt={profileData.name} 
              />
            </div>
            <span className='absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#fef7e5]/95 dark:bg-[#202833]/95 text-[#00311e] dark:text-[#EAE0C8] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 shadow-sm'>
              Verified MD
            </span>
          </div>

          <div>
            <h2 className='text-lg font-bold text-[#00311e] dark:text-[#EAE0C8]'>{profileData.name}</h2>
            <p className='text-xs font-medium text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>
              {profileData.speciality} &bull; {profileData.degree}
            </p>
            <div className='inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md bg-[#00311e]/5 dark:bg-[#202833] text-[11px] font-medium text-[#00311e] dark:text-[#EAE0C8]'>
              <span>{profileData.experience} Experience</span>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <div className='p-3.5 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 text-left'>
            <div className='flex items-center justify-between'>
              <div>
                <span className='text-xs font-semibold text-[#00311e] dark:text-[#EAE0C8] block'>
                  Accepting Patients
                </span>
                <span className='text-[11px] text-[#00311e]/70 dark:text-[#EAE0C8]/70'>
                  {profileData.available ? 'Listed in patient directory' : 'Hidden from bookings'}
                </span>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input 
                  type="checkbox" 
                  checked={profileData.available} 
                  onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                  disabled={!isEdit}
                  className='sr-only peer' 
                />
                <div className="w-9 h-5 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Bio, Fees, and Clinic Address (8 Cols) */}
        <div className='lg:col-span-8 bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-xl p-5 space-y-5'>
          
          {/* About Section */}
          <div>
            <label className='text-xs font-semibold text-[#00311e]/70 dark:text-[#EAE0C8]/70 block mb-1.5 uppercase tracking-wider'>
              Clinical Bio & Summary
            </label>
            <p className='text-sm text-[#00311e] dark:text-[#EAE0C8] leading-relaxed p-3.5 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
              {profileData.about || "Dedicated medical specialist committed to evidence-based healthcare, preventive screening, and patient recovery."}
            </p>
          </div>

          {/* Fee modifier */}
          <div>
            <label className='text-xs font-semibold text-[#00311e]/70 dark:text-[#EAE0C8]/70 block mb-1.5 uppercase tracking-wider'>
              Consultation Fee
            </label>
            <div className='flex items-center gap-3 p-3.5 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
              <span className='text-lg font-bold text-[#00311e] dark:text-[#EAE0C8]'>{currencySymbol}</span>
              {isEdit ? (
                <input 
                  type="number" 
                  value={profileData.fees} 
                  onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                  className='px-2.5 py-1 rounded-md bg-white dark:bg-[#181E26] border border-[#00311e]/20 dark:border-[#EAE0C8]/20 text-sm font-semibold text-[#00311e] dark:text-[#EAE0C8] outline-none w-28'
                />
              ) : (
                <span className='text-lg font-bold text-[#00311e] dark:text-[#EAE0C8]'>{profileData.fees}</span>
              )}
              <span className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70'>per scheduled visit</span>
            </div>
          </div>

          {/* Clinic Address & Coordinates */}
          <div>
            <div className='flex items-center justify-between mb-1.5'>
              <label className='text-xs font-semibold text-[#00311e]/70 dark:text-[#EAE0C8]/70 uppercase tracking-wider'>
                Clinic Location & GPS
              </label>
              {profileData.address?.coordinates && (
                <span className='text-[10px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 px-2 py-0.5 rounded'>
                  Geocoded ({profileData.address.coordinates.lat?.toFixed(2)}, {profileData.address.coordinates.lng?.toFixed(2)})
                </span>
              )}
            </div>

            <div className='p-3.5 rounded-lg bg-[#00311e]/5 dark:bg-[#202833] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 space-y-3'>
              {isEdit ? (
                <>
                  <div>
                    <span className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 block mb-1'>Clinic Address Line 1</span>
                    <input 
                      type="text" 
                      value={profileData?.address?.line1 || ''} 
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                      className='w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#181E26] border border-[#00311e]/20 dark:border-[#EAE0C8]/20 text-xs text-[#00311e] dark:text-[#EAE0C8] outline-none'
                      placeholder="e.g. 17th Cross, Richmond Road"
                    />
                  </div>
                  <div>
                    <span className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 block mb-1'>Clinic Address Line 2</span>
                    <input 
                      type="text" 
                      value={profileData?.address?.line2 || ''} 
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                      className='w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#181E26] border border-[#00311e]/20 dark:border-[#EAE0C8]/20 text-xs text-[#00311e] dark:text-[#EAE0C8] outline-none'
                      placeholder="e.g. Suite 402, Medical Complex"
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <span className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 block mb-1'>City / Locality</span>
                      <input 
                        type="text" 
                        value={profileData?.address?.locality || ''} 
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, locality: e.target.value } }))}
                        className='w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#181E26] border border-[#00311e]/20 dark:border-[#EAE0C8]/20 text-xs text-[#00311e] dark:text-[#EAE0C8] outline-none'
                        placeholder="e.g. Phagwara, Punjab"
                      />
                    </div>
                    <div>
                      <span className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 block mb-1'>Pincode / Postal Code</span>
                      <input 
                        type="text" 
                        value={profileData?.address?.pincode || ''} 
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, pincode: e.target.value } }))}
                        className='w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#181E26] border border-[#00311e]/20 dark:border-[#EAE0C8]/20 text-xs text-[#00311e] dark:text-[#EAE0C8] outline-none'
                        placeholder="e.g. 144401"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className='space-y-1 text-sm'>
                  <p className='text-[#00311e] dark:text-[#EAE0C8] font-semibold'>{profileData?.address?.line1 || 'Address Line 1'}</p>
                  {profileData?.address?.line2 && <p className='text-[#00311e]/80 dark:text-[#EAE0C8]/80'>{profileData.address.line2}</p>}
                  <p className='text-[#00311e]/70 dark:text-[#EAE0C8]/70 text-xs'>
                    {profileData?.address?.locality || 'Locality'} {profileData?.address?.pincode ? `• ${profileData.address.pincode}` : ''}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default DoctorProfile;
