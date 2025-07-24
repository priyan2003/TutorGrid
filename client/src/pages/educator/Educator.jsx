import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'

function Educator() {
  return (
    <div className='text-defalut min-h-screen bg-white'>
      <Navbar/>
      <div>
        {<Outlet/>}
      </div>
    </div>
  )
}

export default Educator