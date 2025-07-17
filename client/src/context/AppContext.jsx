import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY || '₹';

    const [allcourses, setAllCourses] = useState([]);
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
    useEffect(() => {
        fetchAllCourses();
    }, []);

    const value={
        currency,allcourses,averageRating
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}