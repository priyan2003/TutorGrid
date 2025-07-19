import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY || '₹';

    const [allcourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const averageRating = (course) => {
        if(course.courseRatings.length == 0) return 0;
        let totalRating  = 0;
        course.courseRatings.forEach((rating) => {
            totalRating += rating.rating;
        });
        return (totalRating / course.courseRatings.length);
    }

    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses)
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
        course.courseChapters.map((chapter) => 
            time += calculateChapterTiming(chapter)
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
    useEffect(() => {
        fetchAllCourses();
    }, []);

    const value={
        currency,allcourses,averageRating, setAllCourses, isEducator, setIsEducator,calculateChapterTiming,calculateTotalCourseTiming, calculateTotalLectures
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}