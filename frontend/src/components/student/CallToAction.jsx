import React from 'react'
import {assets} from '../../assets/assets.js'
function CallToAction() {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md: px-0'>
      <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>Knowledge at Your Fingertips.</h1>
      <p className='tex-gray-500 sm:text-sm'>Build knowledge, sharpen skills, and stay ahead — anytime, anywhere, with TutorGrid's dynamic learning tools</p>
      <div className='flex items-center font-medium gap-6 mt-4'>
        <button className='px-10 py-3 rounded-md text-white bg-blue-600'>Get stated</button>
        <button className='flex items-center gap-2'>Learn More <img src={assets.arrow_icon} alt="" /></button>
      </div>
    </div>
  )
}

export default CallToAction