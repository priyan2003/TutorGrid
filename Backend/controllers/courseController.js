import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";

// Get All Published Courses
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(['-courseContent', '-enrolledStudents']) // exclude heavy fields
      .populate({ path: 'educator'}); // include only needed educator details

    res.json({ success: true, courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// get course by id
export const getCourseId = async (req, res) => {
  const { id } = req.params; //  Fix destructuring
  try {
    //  Find course by ID and populate educator
    const courseData = await Course.findById(id).populate({
      path: "educator",
      select: "name email imageUrl",
    });

    if (!courseData) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    //  Remove lectureUrl if isPreviewFree is false
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = ""; // hide URL if not free
        }
      });
    });

    //  Send course data
    res.json({ success: true, courseData });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



