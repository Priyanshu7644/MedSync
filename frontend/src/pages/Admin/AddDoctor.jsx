import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('1 Year');
    const [fees, setFees] = useState('');
    const [about, setAbout] = useState('');
    const [speciality, setSpeciality] = useState('General physician');
    const [customSpeciality, setCustomSpeciality] = useState('');
    const [degree, setDegree] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [locality, setLocality] = useState('');
    const [pincode, setPincode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { backendUrl, aToken } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            if (!name || !email || !password || !speciality || !degree || !about || !fees || !address1 || !address2) {
                setIsSubmitting(false);
                return toast.error("Please fill in all required details");
            }

            let coordinates = null;
            if (pincode || locality) {
                try {
                    const query = `${locality ? locality + ',' : ''} ${pincode}`;
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
                    const geoData = await response.json();
                    if (geoData && geoData.length > 0) {
                        coordinates = { lat: parseFloat(geoData[0].lat), lng: parseFloat(geoData[0].lon) };
                    }
                } catch (e) {
                    console.error("Geocoding failed", e);
                }
            }

            const formData = new FormData();
            if (docImg) {
                formData.append('image', docImg);
            }
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', experience);
            formData.append('fees', Number(fees));
            formData.append('about', about);
            formData.append('speciality', speciality === 'Other' ? customSpeciality : speciality);
            formData.append('degree', degree);
            formData.append('address', JSON.stringify({ line1: address1, line2: address2, locality, pincode, coordinates }));

            const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, { headers: { aToken } });
            
            if (data.success) {
                toast.success(data.message);
                setDocImg(false);
                setName('');
                setEmail('');
                setPassword('');
                setFees('');
                setDegree('');
                setAbout('');
                setSpeciality('General physician');
                setCustomSpeciality('');
                setAddress1('');
                setAddress2('');
                setLocality('');
                setPincode('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='space-y-6 text-[#00311e] dark:text-[#EAE0C8] transition-colors pb-10 max-w-4xl'>
            
            {/* Header */}
            <div className='pb-5 border-b border-[#00311e]/15 dark:border-[#EAE0C8]/20'>
                <h1 className='text-2xl font-bold tracking-tight text-[#00311e] dark:text-[#EAE0C8]'>Register New Doctor</h1>
                <p className='text-xs text-[#00311e]/70 dark:text-[#EAE0C8]/70 mt-0.5'>Add physician credentials, practice discipline, and clinic coordinates to MedSync.</p>
            </div>

            {/* Main Form Card */}
            <form onSubmit={onSubmitHandler} className='bg-white dark:bg-[#181E26] border border-[#00311e]/15 dark:border-[#EAE0C8]/20 rounded-xl p-6 sm:p-8 shadow-sm space-y-6'>
                
                {/* Photo Upload Zone */}
                <div>
                    <label className='block text-xs font-bold uppercase tracking-wider text-[#00311e]/70 dark:text-[#EAE0C8]/70 mb-2'>
                        Profile Photograph
                    </label>
                    <div className='flex items-center gap-4'>
                        <label htmlFor="doc-img" className='cursor-pointer group'>
                            <div className={`w-20 h-20 rounded-xl bg-[#00311e]/5 dark:bg-[#202833] flex items-center justify-center overflow-hidden border border-[#00311e]/20 dark:border-[#EAE0C8]/20 group-hover:border-[#00311e] dark:group-hover:border-[#EAE0C8] transition-colors`}>
                                {docImg ? (
                                    <img className='w-full h-full object-cover' src={URL.createObjectURL(docImg)} alt="" />
                                ) : (
                                    <span className='text-2xl'>📷</span>
                                )}
                            </div>
                        </label>
                        <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                        <div>
                            <label htmlFor="doc-img" className='text-xs font-bold text-[#00311e] dark:text-[#EAE0C8] hover:underline cursor-pointer'>
                                {docImg ? 'Change Selected Photo' : 'Upload Doctor Photo'}
                            </label>
                            <p className='text-[11px] text-[#00311e]/60 dark:text-[#EAE0C8]/60 mt-0.5'>PNG, JPG or WEBP up to 5MB.</p>
                        </div>
                    </div>
                </div>

                {/* Grid 1: Basic Information */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
                    <div>
                        <label className='block text-xs font-semibold text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1'>Doctor Full Name *</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="e.g. Dr. Jennifer Lawrence" 
                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3.5 py-2 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors' 
                            required 
                        />
                    </div>
                    <div>
                        <label className='block text-xs font-semibold text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1'>Doctor Login Email *</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="e.g. doctor@medsync.com" 
                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3.5 py-2 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors' 
                            required 
                        />
                    </div>
                    <div>
                        <label className='block text-xs font-semibold text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1'>Account Password *</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Minimum 8 characters" 
                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3.5 py-2 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors' 
                            required 
                        />
                    </div>
                    <div>
                        <label className='block text-xs font-semibold text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1'>Consultation Fee ($) *</label>
                        <input 
                            type="number" 
                            value={fees} 
                            onChange={(e) => setFees(e.target.value)} 
                            placeholder="e.g. 50" 
                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3.5 py-2 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none focus:border-[#00311e] dark:focus:border-[#EAE0C8] transition-colors' 
                            required 
                        />
                    </div>
                </div>

                {/* Grid 2: Credentials & Speciality */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
                    <div>
                        <label className='block text-xs font-semibold text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1'>Speciality Discipline *</label>
                        <select 
                            value={speciality} 
                            onChange={(e) => setSpeciality(e.target.value)}
                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3 py-2 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none'
                        >
                            <option value="General physician">General physician</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatricians">Pediatricians</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                            <option value="Other">Other Discipline</option>
                        </select>
                    </div>

                    {speciality === 'Other' && (
                        <div>
                            <label className='block text-xs font-semibold text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1'>Custom Speciality *</label>
                            <input 
                                type="text" 
                                value={customSpeciality} 
                                onChange={(e) => setCustomSpeciality(e.target.value)} 
                                placeholder="e.g. Cardiologist" 
                                className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3 py-2 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none' 
                                required 
                            />
                        </div>
                    )}

                    <div>
                        <label className='block text-xs font-semibold text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1'>Degree / Credentials *</label>
                        <input 
                            type="text" 
                            value={degree} 
                            onChange={(e) => setDegree(e.target.value)} 
                            placeholder="e.g. MBBS, MD (Harvard)" 
                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3.5 py-2 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none' 
                            required 
                        />
                    </div>
                    <div>
                        <label className='block text-xs font-semibold text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1'>Experience *</label>
                        <select 
                            value={experience} 
                            onChange={(e) => setExperience(e.target.value)}
                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3 py-2 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none'
                        >
                            <option value="1 Year">1 Year</option>
                            <option value="2 Years">2 Years</option>
                            <option value="3 Years">3 Years</option>
                            <option value="4 Years">4 Years</option>
                            <option value="5 Years">5 Years</option>
                            <option value="6 Years">6 Years</option>
                            <option value="8 Years">8 Years</option>
                            <option value="10+ Years">10+ Years</option>
                        </select>
                    </div>
                </div>

                {/* About Textarea */}
                <div className='pt-4 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10'>
                    <label className='block text-xs font-semibold text-[#00311e]/80 dark:text-[#EAE0C8]/80 mb-1'>Doctor Biography & Clinical Focus *</label>
                    <textarea 
                        rows={3} 
                        value={about} 
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Write a comprehensive clinical overview..." 
                        className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg p-3 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none resize-none'
                        required
                    ></textarea>
                </div>

                {/* Clinic Address */}
                <div className='pt-4 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 space-y-3'>
                    <label className='block text-xs font-bold uppercase tracking-wider text-[#00311e]/70 dark:text-[#EAE0C8]/70'>
                        Clinic Address & Locality
                    </label>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <input 
                            type="text" 
                            value={address1} 
                            onChange={(e) => setAddress1(e.target.value)} 
                            placeholder="Address Line 1 (Street, Building) *" 
                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3.5 py-2 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none' 
                            required 
                        />
                        <input 
                            type="text" 
                            value={address2} 
                            onChange={(e) => setAddress2(e.target.value)} 
                            placeholder="Address Line 2 (Area, Landmark) *" 
                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3.5 py-2 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none' 
                            required 
                        />
                        <input 
                            type="text" 
                            value={locality} 
                            onChange={(e) => setLocality(e.target.value)} 
                            placeholder="City / Locality (e.g. Phagwara, Mumbai)" 
                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3.5 py-2 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none' 
                        />
                        <input 
                            type="text" 
                            value={pincode} 
                            onChange={(e) => setPincode(e.target.value)} 
                            placeholder="Postal / Pincode (e.g. 144401)" 
                            className='w-full border border-[#00311e]/20 dark:border-[#EAE0C8]/20 rounded-lg px-3.5 py-2 text-xs bg-white dark:bg-[#181E26] text-[#00311e] dark:text-[#EAE0C8] outline-none' 
                        />
                    </div>
                </div>

                {/* Submit Action */}
                <div className='pt-4 border-t border-[#00311e]/10 dark:border-[#EAE0C8]/10 flex justify-end'>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className='px-6 py-2.5 rounded-lg bg-[#00311e] text-[#fef7e5] dark:bg-[#EAE0C8] dark:text-[#202833] text-xs font-bold hover:opacity-90 transition-opacity shadow-sm'
                    >
                        {isSubmitting ? 'Registering Doctor...' : 'Add Doctor to System'}
                    </button>
                </div>

            </form>

        </div>
    );
}

export default AddDoctor;
