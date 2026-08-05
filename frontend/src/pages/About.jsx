import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500 dark:text-gray-200 transition-colors'>
        <p>ABOUT <span className='text-gray-700 dark:text-white font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px] rounded-lg shadow-sm object-cover' src={assets.hero_img} alt="About MedSync" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 dark:text-gray-300 transition-colors'>
          <p>Welcome to MedSync, your trusted partner in managing your healthcare needs conveniently and efficiently. At MedSync, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
          <p>MedSync is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, MedSync is here to support you every step of the way.</p>
          <b className='text-gray-800 dark:text-white'>Our Vision</b>
          <p>Our vision at MedSync is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
        </div>
      </div>

      <div className='text-xl my-4 text-gray-800 dark:text-gray-200 transition-colors'>
        <p>WHY <span className='text-gray-700 dark:text-white font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border border-gray-200 dark:border-gray-700 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-300 cursor-pointer rounded-l-lg'>
          <b className='dark:text-white'>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border border-gray-200 dark:border-gray-700 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-300 cursor-pointer'>
          <b className='dark:text-white'>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border border-gray-200 dark:border-gray-700 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-300 cursor-pointer rounded-r-lg'>
          <b className='dark:text-white'>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About
