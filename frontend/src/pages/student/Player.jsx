import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const Player = () => {
  const { courseId } = useParams();
  const {
    enrolledCourses,
    calculateChapterTiming,
    backendUrl,
    getToken,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  // Get course details and user's rating
  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course);

        course.courseRatings.forEach((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating);
          }
        });
      }
    });
  };

  // Fetch progress data for this course
  const getCourseProgress = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message || "Failed to fetch course progress.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong."
      );
    }
  };

  // Mark lecture as completed
  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getCourseProgress(); // refresh progress after marking complete
      } else {
        toast.error(data.message || "Unable to mark as completed.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Submit user rating
  const handleRate = async (rating) => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses(); // refresh data
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Initial load
  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses]);

  // Fetch course progress on first load and when playerData changes
  useEffect(() => {
    getCourseProgress();
  }, [playerData]);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return courseData ? (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* Left Column */}
        <div className="md:mt-10">
          {playerData ? (
            <div>
              <YouTube
                videoId={playerData.lectureUrl.split("/").pop()}
                opts={{ playerVars: { autoplay: 1 } }}
                iframeClassName="w-full aspect-video"
              />
              <div className="flex items-center justify-between mt-4">
                <p>
                  {playerData.chapter}.{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>
                <button
                  disabled={!progressData}
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className={`text-blue-500 ${
                    !progressData && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {progressData?.lectureCompleted?.includes(
                    playerData.lectureId
                  )
                    ? "Completed"
                    : "Mark Completed"}
                </button>
              </div>
            </div>
          ) : (
            <img
              src={courseData?.courseThumbnail || ""}
              alt=""
              className="w-full"
            />
          )}
        </div>

        {/* Right Column */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">
            {courseData.courseContent.map((chapter, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-white mb-2 rounded"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center space-x-2">
                    <img
                      className={`transform transition-transform ${
                        openSection[index] ? "rotate-180" : ""
                      }`}
                      src={assets.down_arrow_icon}
                      alt=""
                    />
                    <p className="font-medium md:text-base text-sm">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className="text-sm md:text-default">
                    {chapter.chapterContent.length} Lectures -{" "}
                    {calculateChapterTiming(chapter)}
                  </p>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSection[index] ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent.map((lecture, lectureIndex) => (
                      <li
                        key={lectureIndex}
                        className="flex items-start gap-2 py-1 hover:bg-gray-100 cursor-pointer"
                      >
                        <img
                          src={
                            progressData?.lectureCompleted?.includes(
                              lecture.lectureId
                            )
                              ? assets.blue_tick_icon
                              : assets.play_icon
                          }
                          alt=""
                          className="w-4 h-4 mt-1"
                        />
                        <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                          <p>{lecture.lectureTitle}</p>
                          <div className="flex gap-2">
                            {lecture.lectureUrl && (
                              <p
                                onClick={() =>
                                  setPlayerData({
                                    ...lecture,
                                    chapter: index + 1,
                                    lecture: lectureIndex + 1,
                                  })
                                }
                                className="text-blue-500 cursor-pointer"
                              >
                                Watch
                              </p>
                            )}
                            <p className="text-gray-500">
                              {humanizeDuration(
                                lecture.lectureDuration * 60 * 1000,
                                { units: ["h", "m"] }
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Player;
