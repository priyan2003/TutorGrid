import React, {useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {Line} from 'rc-progress'

const MyEnrollments = () => {
  const {enrolledCourses,calculateTotalCourseTiming} = useContext(AppContext);
  const navigate = useNavigate();
  const [progressArray, setProgressArray] = React.useState([
    {lectureCompleted: 2,totalLectures: 10},
    {lectureCompleted: 3,totalLectures: 13},
    {lectureCompleted: 6,totalLectures: 14},
    {lectureCompleted: 15,totalLectures: 15},
    {lectureCompleted: 7,totalLectures: 16},
    {lectureCompleted: 8,totalLectures: 17},
    {lectureCompleted: 5,totalLectures: 18},
    {lectureCompleted: 9,totalLectures: 19},
    {lectureCompleted: 12,totalLectures: 20}
  ]);
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
                  <Line strokeWidth={2} percent={30}></Line>
                 </div>
                </td>
                <td className='px-4 py-3 max-sm:hidden'>{calculateTotalCourseTiming(course)}</td>
                <td className='px-4 py-3 max-sm:hidden'>{progressArray[index] && `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}`}<span> Lectures</span></td>
                <td className='px-4 py-3 max-sm:text-right'><button  onClick={()=>navigate(`/player/${course._id}`)} className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white'>{progressArray[index] && progressArray[index].lectureCompleted == progressArray[index].totalLectures ? 'Completed' : 'In Progress'} </button></td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
    </>
  )
}

export default MyEnrollments