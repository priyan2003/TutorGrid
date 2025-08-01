import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CoursesList from './pages/student/CoursesList'
import CourseDetail from './pages/student/CourseDetail'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Dashboard from './pages/educator/Dashboard'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentEnrolled from './pages/educator/StudentEnrolled'
import Navbar from './components/student/Navbar'
import "quill/dist/quill.snow.css";

function App() {
    const isEductorRoute = useMatch('/educator/*');
  return (
    <div className='text-default min-h-screen bg-white'>
      {!isEductorRoute && <Navbar/>}

      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/course-list' element={<CoursesList/>} />
        <Route path='/course-list/:input' element={<CoursesList/>} />
        <Route path='/course/:id' element={<CourseDetail/>} />
        <Route path='/my-enrollments' element={<MyEnrollments/>} />
        <Route path='/player/:courseId' element={<Player/>} />
        <Route path='/loading/:path' element={<Loading/>} />
        <Route path='/educator' element={<Educator/>}>
          <Route path='/educator' element={<Dashboard/>}/>
          <Route path='add-course' element={<AddCourse/>}/>
          <Route path='my-courses' element={<MyCourses/>}/>
          <Route path='student-enrolled' element={<StudentEnrolled/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App