import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets.js';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import YouTube from 'react-youtube';
import axios from 'axios';
import { toast } from 'react-toastify';

const CourseDetail = () => {
  const {id} = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(true);
  const [playerData, setPlayerData] = useState(null);
  const {averageRating ,calculateChapterTiming, calculateTotalCourseTiming, calculateTotalLectures, currency, backendUrl, userData, getToken} = useContext(AppContext);
  
  const fetchCourseDetails = async () => {
    try {
      const {data} = await axios.get(backendUrl+'/api/course/'+id);
      if(data.success){
        setCourseData(data.courseData)
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const enrollCourse = async ()=>{
    try {
      if(!userData){
        return toast.warn('Login to Enroll')
      }
      if(isAlreadyEnrolled){
        return toast.warn('Already Enrolled')
      }
      const token = await getToken();
      const {data} = await axios.post(backendUrl+'/api/user/purchase',{courseId:courseData._id},{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(data.success){
        const {session_url} = data
        window.location.replace(session_url)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    if(userData && courseData){
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  }, [userData, courseData]);
   
  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const toggleSection = (index) => {
    setOpenSection(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }
  
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
          <p className='text-gray-900'>Course By <span className='text-blue-500'>{courseData.educator.name}</span></p>
          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>
            <div className='pt-5'>
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                  <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none ' onClick={() => toggleSection(index)}>
                    <div className='flex items-center space-x-2'>
                      <img className={`transform transition-transform ${openSection[index] ? 'rotate-180':''}`} src={assets.down_arrow_icon} alt="" />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-sm md:text-default'>{chapter.chapterContent.length} Lectures - {calculateChapterTiming(chapter)}</p>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-screen' : 'max-h-0'}`}>
                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                      {chapter.chapterContent.map((lecture, lectureIndex) => (
                        <li key={lectureIndex} className='flex items-start gap-2 py-1 hover:bg-gray-100 cursor-pointer'>
                          <img src={assets.play_icon} alt="" className='w-4 h-4 mt-1'/>
                          <div className='flex items-center justify-between w-full text-gray-800 text-xs md: text-default'>
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                              {lecture.isPreviewFree  && <p 
                              onClick={() =>setPlayerData({
                                videoId: lecture.lectureUrl.split('/').pop(),
                              })}
                              className='text-blue-500 cursor-pointer'>Preview</p>}
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
          <div className='py-20 text-sm md:text-default text-gray-600'>
            <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
            <p className='pt-3 rich-text' dangerouslySetInnerHTML={{__html:courseData.courseDescription}}></p>

          </div>
        </div>

        {/* right column */}
        <div className='max-w-sm z-10 bg-white p-3 rounded-t md:rounded-none overflow-hidden min-w-[420px] sm:min-w-[420px] shadow-md'>

          {
            playerData ? 
            <YouTube videoId={playerData.videoId} opts={{playerVars: {autoplay:1}}} iframeClassName='w-full aspect-video'/>
            : <img src={courseData.courseThumbnail} alt="" />
          }

          
          <div className='p-3 '>
            <div className='flex items-center gap-2'>
              <img className='w-3.5' src={assets.time_left_clock_icon} alt="" />
              <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price!!</p>
            </div>
            <div className='flex items-center gap-3 pt-3'>
              <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency} {(courseData.coursePrice - (courseData.discount * courseData.coursePrice)/100).toFixed(0)}</p>
              <p className='md: text-lg text-gray-500 line-through'>{currency} {courseData.coursePrice}</p>
              <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
            </div>
            <div className='flex items-center text-sm md:text-default gap-5 pt-2 md:pt-4 text-gray-500'>
              <div className='flex items-center gap-1'>
                <img src={assets.star} alt="" />
                <p>{averageRating(courseData)}</p>
              </div>
              <div className='h-4 w-px bg-gray-500/40'></div>

              <div className='flex items-center gap-1'>
                <img src={assets.time_clock_icon} alt="" />
                <p>{calculateTotalCourseTiming(courseData)}</p>
              </div>

              <div className='h-4 w-px bg-gray-500/40'></div>
              
              <div className='flex items-center gap-1'>
                <img src={assets.lesson_icon} alt="" />
                <p>{calculateTotalLectures(courseData)} lessons</p>
              </div>

            </div>
            <button onClick={enrollCourse} className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium'>
              {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>
            <div className='p-6 rounded mt-4 text-gray-800'>
              <p className='md:text-xl text-lg font-medium text-gray-800'>What's you can expect?</p>
              <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
    </div>
    <Footer/>
    </>
  ) : <Loading/>
}

export default CourseDetail