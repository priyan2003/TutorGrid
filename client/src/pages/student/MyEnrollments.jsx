import React, {useContext } from 'react'
import { AppContext } from '../../context/AppContext';

const MyEnrollments = () => {
  const {enrolledCourses,calculateTotalCourseTiming} = useContext(AppContext);
  return (
    <>
    <div className='md:px-36 px-8 md:pt-30 pt-20 text-left'>
        <h1 className='text-2xl font-bold'>My Enrollments</h1>
        <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>Course Title</th>
              <th className='px-4 py-3 font-semibold truncate'>Duration</th>
              <th className='px-4 py-3 font-semibold truncate'>Completed</th>
              <th className='px-4 py-3 font-semibold truncate'>Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-800'>
            {enrolledCourses.map((course, index) => (
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'><img src={course.courseThumbnail} alt="" className='w-14 md:w-28 sm:24'/>
                 <div className='flex-1'>
                  <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                 </div>
                </td>
                <td className='px-4 py-3 max-sm:hidden'>{calculateTotalCourseTiming(course)}</td>
                <td className='px-4 py-3 max-sm:hidden'>3/10 <span>Lectures</span></td>
                <td className='px-4 py-3 max-sm:text-right'><button className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white'>{course.isCompleted ? 'Completed' : 'In Progress'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
    </>
  )
}

export default MyEnrollments