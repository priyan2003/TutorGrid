import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Searchbar = () => {
  const [input, setInput] = useState()
  const navigate = useNavigate();
  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate('/course-list/'+ input )
  }
  return (
    <>
        <form onSubmit={onSearchHandler} action="" className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded'>
          <img src={assets.search_icon} alt=""  className='md:w-auto w-10 px-3'/>
          <input onChange={e=>setInput(e.target.value)} value={input} type="text" placeholder='search for course'  className='w-full h-full outline-none text-gray-500/80'/>
          <button type='submit' className='bg-blue-300 rounded text-white md:px-10 px-7 md:py-3 py-1 mx-1'>Search</button>
        </form>
    </>
  )
}

export default Searchbar