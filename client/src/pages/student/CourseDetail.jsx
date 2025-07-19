import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';

const CourseDetail = () => {
  const {id} = useParams();
  const [courseData, setCourseData] = useState(null);
  const {allcourses,averageRating ,calculateChapterTiming, calculateTotalCourseTiming, calculateTotalLectures} = useContext(AppContext);
  
  const fetchCourseDetails = async () => {
    const findCourse = allcourses.find(course => course._id === id);
    setCourseData(findCourse);
  }
  useEffect(() => {
    fetchCourseDetails();
  }, []);
  
  return courseData ? (
    <>
    <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>
      <div className='absolute top-0 left-0 w-full h-500px -z-1 bg-gradient-to-b from-cyan-100/70'>

      </div>
        {/* left column */}
        <div className='max-w-xl z-10 text-gray-500'>
          <h2 className='md:text-4xl text-2xl font-semibold text-gray-900'>{courseData.courseTitle}</h2>
          <p className='pt-4 md:text-base text-sm' dangerouslySetInnerHTML={{__html:courseData.courseDescription.slice(0,200)}}></p>
          <div className='flex items-center space-x-2 pt-3 pb-1'>
            <p>{averageRating(courseData)}</p>
            <div className='flex'>
              {
                [...Array(5)].map((_, index) => (<img key={index} className='w-4 h-4' src={index<Math.floor(averageRating(courseData)) ? assets.star : assets.star_blank} alt="star" />))
              }
            </div>
            <p className='text-gray-500'>{courseData.courseRatings.length}</p>
            <p>{courseData.enrolledStudents.length}{courseData.enrolledStudents.length > 1 ? 'Students':'Student'}</p>
          </div>
          <p className='text-gray-900'>Course By <span className='text-blue-500'>Parikh Jain</span></p>
          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>
            <div className='pt-5'>
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                  <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'>
                    <div className='flex items-center space-x-2'>
                      <img src={assets.down_arrow_icon} alt="" />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-sm md:text-default'>{chapter.chapterContent.length} Lectures - {calculateChapterTiming(chapter)}</p>
                  </div>
                  <div className='overflow-hidden transition-all duration-300 max-h-96'>
                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                      {chapter.chapterContent.map((lecture, lectureIndex) => (
                        <li key={lectureIndex} className='flex items-start gap-2 py-1 hover:bg-gray-100 cursor-pointer'>
                          <img src={assets.play_icon} alt="" className='w-4 h-4 mt-1'/>
                          <div className='flex items-center justify-betweenw-full text-gray-800 text-xs md: text-default'>
                            <p>{lecture.lectureTitle}</p>
                            <div>
                              {lecture.isPreviewFree  && <p>Preview</p>}
                              <p className='text-gray-500'>{humanizeDuration(lecture.lectureDuration * 60 * 1000,{units:['h','m']})}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right column */}
        <div></div>
    </div>
    </>
  ) : <Loading/>
}

export default CourseDetail