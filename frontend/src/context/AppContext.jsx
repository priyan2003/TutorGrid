import { createContext, useEffect, useState } from "react";
import humanizeDuration from "humanize-duration";
import {useAuth, useUser} from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from "react-toastify";
// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const currency = import.meta.env.VITE_CURRENCY || '₹';

    const {getToken} = useAuth();
    const {user} = useUser();

    const [allcourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [userData, setUserData] = useState(null);
    const averageRating = (course) => {
        if(course.courseRatings.length == 0) return 0;
        let totalRating  = 0;
        course.courseRatings.forEach((rating) => {
            totalRating += rating.rating;
        });
        return Math.floor(totalRating / course.courseRatings.length);
    }

    const fetchAllCourses = async () => {   

        try {
          const {data} = await axios.get(backendUrl+'/api/course/all');
          if(data.success){
            setAllCourses(data.courses);
          }else{
            toast.error(data.message)
          }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // fetch user data
    const fetchUserData = async () =>{
        if(user.publicMetadata.role==='educator'){
            setIsEducator(true)
        }
        try {
            const token = await getToken();
            
            const {data} = await axios.get(backendUrl+'/api/user/data',{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }) 
            if(data.success){
                setUserData(data.user)
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // function to calculate timing of chapter
    const calculateChapterTiming = (chapter) => {
        let time  = 0;
        chapter.chapterContent.map((lecture) => 
            time += lecture.lectureDuration 
        )
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
    }
    // function to calculate total course duration
    const calculateTotalCourseTiming = (course) => {
        let time = 0;
        course.courseContent.map((chapter) => 
            chapter.chapterContent.map((lecture) => 
                time += lecture.lectureDuration
            )
        )
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
    }
    // function to calculate total no of leture in a course
    const calculateTotalLectures = (course) => {
        let totalChapters = 0;
        course.courseContent.map((chapter)=>
            totalChapters += chapter.chapterContent.length)
        return totalChapters;
    }

    // function to fetch all enrolled course of user
    const fetchUserEnrolledCourses = async () => {
        // This function will fetch the enrolled courses of the user
        try {            
            const token = await getToken();
            console.log(token);
            const {data} = await axios.get(backendUrl+'/api/user/enrolled-courses',{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            
            if(data.success){
                setEnrolledCourses(data.enrolledCourses.reverse())
            }else{
                toast.error(data.message)
            }
        } catch (error) {
                toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchAllCourses();
    }, []);
    
    useEffect(()=>{
        if(user){
            fetchUserData();
            fetchUserEnrolledCourses();
        }
    },[user]) 

    const value={
        currency,allcourses,averageRating, setAllCourses, isEducator, setIsEducator,calculateChapterTiming,calculateTotalCourseTiming, calculateTotalLectures, fetchUserEnrolledCourses,enrolledCourses,backendUrl,userData,setUserData,getToken,fetchAllCourses  
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}