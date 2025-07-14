import React from 'react'
import * as assets from '../../assets/assets.js'
import {Link} from 'react-router-dom'
import { useClerk, useUser, UserButton } from '@clerk/clerk-react';
function Navbar() {
  const isCourseListPage = location.pathname.includes('/course-list');
  const {openSignIn} = useClerk();
  const {user} = useUser();

  return (
    <div className={`flex item-center justify-between px-4 sm:px-10 md:px-14 lg:px-14 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white': 'bg-cyan-100/70'}`}>
        <img src={assets.assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer'/>
        <div className='hidden md:flex items-center gap-5 text-gray-500'>
           <div className='flex items-center gap-6'>
              {user && <>
                <button>Become Educator</button>
              <Link to='/my-enrollments'>My Enrollments</Link></>
              }
           </div>
           { user? <UserButton/> : <button onClick={()=>openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full'>Create Account</button>}
        </div>
         {/* For Phone Screen */}
        <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
           <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
              {user && <>
                <button>Become Educator</button>
              <Link to='/my-enrollments'>My Enrollments</Link></>
              }
           </div>
              { user ? <UserButton /> :
                <button onClick={()=>openSignIn()}><img src={assets.assets.user_icon} alt="" /></button>}
        </div>
    </div>
  )
}

export default Navbar