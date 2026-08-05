import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    const defaultSpecialities = ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'];
    if (speciality === 'Other') {
      setFilterDoc(doctors.filter(doc => !defaultSpecialities.includes(doc.speciality)));
    } else if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className='transition-colors'>
      <p className='text-gray-600 dark:text-gray-300'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button 
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} 
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>
        <div className={`flex-col gap-4 text-sm text-gray-600 dark:text-gray-300 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-600 rounded transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${speciality === 'General physician' ? 'bg-blue-50 dark:bg-gray-700 text-black dark:text-white' : ''}`}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-600 rounded transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${speciality === 'Gynecologist' ? 'bg-blue-50 dark:bg-gray-700 text-black dark:text-white' : ''}`}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-600 rounded transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${speciality === 'Dermatologist' ? 'bg-blue-50 dark:bg-gray-700 text-black dark:text-white' : ''}`}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-600 rounded transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${speciality === 'Pediatricians' ? 'bg-blue-50 dark:bg-gray-700 text-black dark:text-white' : ''}`}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-600 rounded transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${speciality === 'Neurologist' ? 'bg-blue-50 dark:bg-gray-700 text-black dark:text-white' : ''}`}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-600 rounded transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${speciality === 'Gastroenterologist' ? 'bg-blue-50 dark:bg-gray-700 text-black dark:text-white' : ''}`}>Gastroenterologist</p>
          <p onClick={() => speciality === 'Other' ? navigate('/doctors') : navigate('/doctors/Other')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-600 rounded transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${speciality === 'Other' ? 'bg-blue-50 dark:bg-gray-700 text-black dark:text-white' : ''}`}>Other</p>
        </div>
        <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
              <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0,0) }} className='border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 shadow-sm' key={index}>
                  <img className='bg-blue-50 dark:bg-gray-700 w-full h-48 object-cover object-top transition-colors' src={item.image} alt={item.name} />
                  <div className='p-4'>
                      <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                          <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                      </div>
                      <p className='text-gray-900 dark:text-white text-lg font-medium transition-colors'>{item.name}</p>
                      <p className='text-gray-600 dark:text-gray-300 text-sm transition-colors'>{item.speciality}</p>
                  </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors;
