import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500 dark:text-gray-200 transition-colors'>
        <p>CONTACT <span className='text-gray-700 dark:text-white font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[360px] rounded-lg shadow-sm object-cover' src={assets.hero_img} alt="Contact MedSync" />
        <div className='flex flex-col justify-center items-start gap-6 transition-colors'>
          <p className='font-semibold text-lg text-gray-600 dark:text-white'>OUR OFFICE</p>
          <p className='text-gray-500 dark:text-gray-300'>54709 Willms Station <br /> Suite 350, Washington, USA</p>
          <p className='text-gray-500 dark:text-gray-300'>Tel: (415) 555-0132 <br /> Email: contact@medsync.com</p>
          <p className='font-semibold text-lg text-gray-600 dark:text-white'>CAREERS AT MEDSYNC</p>
          <p className='text-gray-500 dark:text-gray-300'>Learn more about our teams and job openings.</p>
          <button className='border border-black dark:border-white px-8 py-4 text-sm hover:bg-black dark:hover:bg-white text-gray-900 dark:text-white hover:text-white dark:hover:text-black transition-all duration-500 rounded'>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact
