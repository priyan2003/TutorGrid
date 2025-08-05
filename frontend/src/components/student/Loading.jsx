import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Loading() {

  const {path} = useParams();
  const navigate = useNavigate();
  useEffect(()=>{
    if(path){
      const time = setTimeout(()=>{
        navigate(`/${path}`)
      },5000);
      return ()=>clearTimeout(time)
    }
  })
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-6 border-t-blue-400 rounded-full animate-spin'>

      </div>
    </div>
  )
}

export default Loading