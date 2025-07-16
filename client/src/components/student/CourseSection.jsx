import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Coursecard from "./Coursecard";
import { AppContext } from "../../context/AppContext";

const CourseSection = () => {
  const {allcourses}  = useContext(AppContext);  
  return (
    <div className="py-16 md:px-40 px-8">
      <h2 className="text-3xl font-medium text-gray-800">Learn from the best</h2>
      <p className="text-sm md:text-base text-grav-500 mt-3">
        Discover our top-rated courses across various categories. From coding
        and design to business and wellness, our courses are crafted to deliver
        results.
      </p>

      <div className="grid grid-cols-4 px-4 md:px-0 gap-4 mt-8">
        {allcourses.slice(0, 4).map((course,index) => <Coursecard key={index} course={course} />)}
      </div>

      <Link to={"/course-list"} onClick={() => scrollTo(0, 0)} className="text-gray-500 border border-gray-500/20 rounded px-10 py-3 rounded ">
        Show all courses
      </Link>
    </div>
  );
};

export default CourseSection;
