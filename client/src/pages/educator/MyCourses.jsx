import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";

function MyCourses() {
  const { currency, allcourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const fetchEductorCourses = () => {
    setCourses(allcourses);
  };
  useEffect(() => {
    fetchEductorCourses();
  });
  return courses ? (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>
        <div>
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-bold truncate">All Courses</th>
                <th className="px-4 py-3 font-bold truncate">Earning</th>
                <th className="px-4 py-3 font-bold truncate">Students</th>
                <th className="px-4 py-3 font-bold truncate">Published on</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-500/20">
                  {/* Thumbnail + Course Title */}
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img
                      src={course.courseThumbnail}
                      alt="Course Image"
                      className="w-16 h-12 object-cover rounded"
                    />
                    <span className="truncate hidden md:block">
                      {course.courseTitle}
                    </span>
                  </td>

                  {/* Earnings (with discount applied) */}
                  <td className="px-4 py-3">
                    {currency}{" "}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>

                  {/* Total Enrolled Students */}
                  <td className="px-4 py-3">
                    {course.enrolledStudents.length}
                  </td>

                  {/* Created Date */}
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default MyCourses;
