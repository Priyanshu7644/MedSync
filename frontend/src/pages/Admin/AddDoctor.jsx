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

    const { backendUrl, aToken } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            if (!docImg) {
                return toast.error("Image Not Selected");
            }

            const formData = new FormData();
            formData.append('image', docImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', experience);
            formData.append('fees', Number(fees));
            formData.append('about', about);
            formData.append('speciality', speciality === 'Other' ? customSpeciality : speciality);
            formData.append('degree', degree);
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

            // Make API request
            const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, { headers: { aToken } });
            
            if (data.success) {
                toast.success(data.message);
                // Clear Form
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
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full transition-colors'>
            <p className='mb-3 text-lg font-medium dark:text-white'>Add Doctor</p>
            <div className='bg-white dark:bg-gray-800 px-8 py-8 border dark:border-gray-700 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll shadow-sm'>
                <div className='flex items-center gap-4 mb-8 text-gray-500 dark:text-gray-300'>
                    <label htmlFor="doc-img">
                        <div className={`w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex justify-center items-center cursor-pointer overflow-hidden ${!docImg && 'border-2 border-dashed border-gray-300 dark:border-gray-600'}`}>
                            {docImg ? <img className='w-full h-full object-cover' src={URL.createObjectURL(docImg)} alt="" /> : <p className='text-xs text-center p-2'>Upload Profile<br/>Image</p>}
                        </div>
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                    <p>Upload doctor <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600 dark:text-gray-300'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <p>Doctor Name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-3 py-2 outline-primary focus:ring-1 focus:ring-primary' type="text" placeholder='Name' required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-3 py-2 outline-primary focus:ring-1 focus:ring-primary' type="email" placeholder='Email' required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p>Doctor Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-3 py-2 outline-primary focus:ring-1 focus:ring-primary' type="password" placeholder='Password' required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-3 py-2 outline-primary focus:ring-1 focus:ring-primary'>
                                {Array.from({length: 10}, (_, i) => i + 1).map(year => (
                                    <option key={year} value={`${year} Year${year > 1 ? 's' : ''}`}>{year} Year{year > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={(e) => setFees(e.target.value)} value={fees} className='border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-3 py-2 outline-primary focus:ring-1 focus:ring-primary' type="number" placeholder='fees' required />
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-3 py-2 outline-primary focus:ring-1 focus:ring-primary'>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                                <option value="Other">Other (Specify)</option>
                            </select>
                            {speciality === 'Other' && (
                                <input onChange={(e) => setCustomSpeciality(e.target.value)} value={customSpeciality} className='border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-3 py-2 outline-primary focus:ring-1 focus:ring-primary mt-2' type="text" placeholder='Enter custom speciality' required />
                            )}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p>Education</p>
                            <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-3 py-2 outline-primary focus:ring-1 focus:ring-primary' type="text" placeholder='Education' required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-3 py-2 outline-primary focus:ring-1 focus:ring-primary mb-2' type="text" placeholder='address 1' required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-3 py-2 outline-primary focus:ring-1 focus:ring-primary' type="text" placeholder='address 2' required />
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-1 mt-4 text-gray-600 dark:text-gray-300'>
                    <p>About Doctor</p>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-3 py-2 outline-primary focus:ring-1 focus:ring-primary' placeholder='write about doctor' rows={5} required />
                </div>

                <button type="submit" className='bg-primary px-10 py-3 mt-6 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md'>Add doctor</button>
            </div>
        </form>
    )
}

export default AddDoctor;
