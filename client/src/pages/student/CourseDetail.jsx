import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';

const CourseDetail = () => {
  const {id} = useParams();
  const [courseData, setCourseData] = useState(null);
  const {allcourses} = useContext(AppContext);
  
  const fetchCourseDetails = async() => {
    allcourses.find(course => course._id === id);
  }

  return (
    <div>
        <h1>CourseDetail</h1>
    </div>
  )
}

export default CourseDetail