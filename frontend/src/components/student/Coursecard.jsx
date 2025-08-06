import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets.js';

const Coursecard = ({course}) => {

  const { currency, averageRating } = useContext(AppContext);

  return (
    <Link to={`/course/${course._id}`} className="flex flex-col items-start space-y-3 p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200" onClick={() => scrollTo(0, 0)}>
        <img className='w-full' src={course.courseThumbnail} alt="" />
        <div className='p-3 text-left'>
          <h3 className='text-base font-semibold'>{course.courseTitle}</h3>
          <p className='text-gray-500'>{course.educator.name}</p>
          <div className='flex items-center space-x-2'>
            <p>{averageRating(course)}</p>
            <div className='flex'>
              {
                [...Array(5)].map((_, index) => (<img key={index} className='w-4 h-4' src={index<Math.floor(averageRating(course)) ? assets.star : assets.star_blank} alt="star" />))
              }
            </div>
            <p className='text-gray-500'>{course.courseRatings.length}</p>
          </div>
          <p className='text-base font-semibold text-gray-800'>{course.coursePrice === 0 ? 'Free' : `${currency}${(course.coursePrice - (course.coursePrice * course.discount)/100).toFixed(0)}`}</p> 
        </div>
    </Link>
  )
}

export default Coursecard