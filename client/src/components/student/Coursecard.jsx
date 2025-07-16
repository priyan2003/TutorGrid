import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const Coursecard = ({course}) => {

  const { currency } = useContext(AppContext);

  return (
    <Link to={`/course/${course.courseId}`} className="flex flex-col items-start space-y-3 p-4 border rounded-lg hover:shadow-lg transition-shadow duration-200" onClick={() => scrollTo(0, 0)}>
        <img className='w-full' src={course.courseThumbnail} alt="" />
        <div className='p-3 text-left'>
          <h3 className='text-base font-semibold'>{course.courseTitle}</h3>
          <p className='text-gray-500'>{course.educator.name}</p>
          <div className='flex items-center space-x-2'>
            <p>4.3</p>
            <div className='flex'>
              {
                Array.from({ length: 5 }, (_, index) => (
                  <span key={index} className={`text-yellow-500 ${index < 4 ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                ))
              }
            </div>
            <p className='text-gray-500'>20</p>
          </div>
          <p className='text-base font-semibold text-gray-800'>{course.coursePrice === 0 ? 'Free' : `${currency}${(course.coursePrice - (course.coursePrice * course.discount)/100).toFixed(0)}`}</p> 
        </div>
    </Link>
  )
}

export default Coursecard