import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Searchbar from '../../components/student/Searchbar';
import { AppContext } from '../../context/AppContext';
import Coursecard from '../../components/student/Coursecard';

const CoursesList = () => {
  const navigate = useNavigate();
  const {allcourses} = useContext(AppContext)
  const [filteredCourses, setFilteredCourses] = useState([]);
  const {input} = useParams();

  useEffect(() => {
    if(allcourses && allcourses.length > 0) {
      console.log("hello");
      
      const filtered = allcourses.slice();
      input ? 
       setFilteredCourses(filtered.filter(course => 
        course.courseTitle.toLowerCase().includes(input.toString().toLowerCase())
      )):setFilteredCourses(filtered);
    }

  },[allcourses, input]);


  return (
    <div className='relative md:px-36 px-8 pt-20 text-left'>
      <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
        <div>
        <h1 className='font-semibold text-2xl md:text-4xl text-gray-800'>Course List</h1>
        <p className='text-gray-500'>
          <span className='text-blue-300 cursor-pointer' onClick={()=>navigate('/')}>Home</span>/<span className='text-blue-300 cursor-pointer' onClick={()=>navigate('/course-list')}>Course List</span>
        </p>
        </div>
        <Searchbar data={input}/>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-4 md:px-0 gap-4 md:my-16 my-10'>
        {
          filteredCourses.map((course, index) => <Coursecard key={index} course={course}/>)
        }
      </div>
    </div>
  )
}

export default CoursesList