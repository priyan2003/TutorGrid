import React, {useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {Line} from 'rc-progress'
import Footer from '../../components/student/Footer';
import axios from 'axios';

const MyEnrollments = () => {
  const {enrolledCourses,calculateTotalCourseTiming,userData, fetchUserEnrolledCourses, backendUrl, getToken, calculateTotalLectures} = useContext(AppContext);
  const navigate = useNavigate();
  const [progressArray, setProgressArray] = React.useState([]);
  const getCourseProgress = async () => {
  try {
    const token = await getToken();

    const tempProgressArray = await Promise.all(
      enrolledCourses.map(async (course) => {
        const { data } = await axios.post(
          `${backendUrl}/api/user/get-course-progress`,
          { courseId: course._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        let totalLectures = calculateTotalLectures(course);
        const lectureCompleted = data.progressData
          ? data.progressData.lectureCompleted.length
          : 0;

        return { totalLectures, lectureCompleted };
      })
    );

    setProgressArray(tempProgressArray);
  } catch (error) {
    console.error("Error fetching course progress:", error);
  }
};
  useEffect(()=>{
    if(userData){
      fetchUserEnrolledCourses();
    }
  },[userData])
  useEffect(()=>{
    if(enrolledCourses.length>0){
      getCourseProgress();
    }
  },[enrolledCourses])
  return (
    <>
    <div className='md:px-36 px-8 md:pt-30 pt-20 text-left pb-20'>
        <h1 className='text-2xl font-bold'>My Enrollments</h1>
        <table className='md:table-auto table-fixed w-full overflow-hidden border border-gray-300 mt-10 pb-10'>
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
                  <Line strokeWidth={2} percent={progressArray[index] ? ((progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures) : 0} className='bg-gray-300 rounded-full' />
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
    <Footer/>
    </>
  )
}

export default MyEnrollments