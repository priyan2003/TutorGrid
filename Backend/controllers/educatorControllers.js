import { clerkClient} from '@clerk/express'
import Course from "../models/Course.js";   // ✅ Adjust path if needed
import {v2 as cloudinary} from "cloudinary";  // ✅ Adjust path if needed
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';


// Update role to educator
export const updateRoleToEducator = async (req,res) => {
    
    try {
        const userId = req.auth.userId;
        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
                role: 'educator',
            }
        })
        res.json({success: true, message: 'You can publish a course now'});
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// add new course

export const addCourse = async (req, res) => {
  try {
    //  FIX for Clerk deprecation warning
    const { userId } = await req.auth();  // userId comes from Clerk middleware

    const { courseData } = req.body;
    
    const imageFile = req.file; //  Assuming you’re using multer for file upload

    if (!courseData) {
      return res.status(400).json({ success: false, message: "Course data is required" });
    }

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Course thumbnail is required" });
    }

    // Parse courseData sent from frontend
    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = userId; //  Assign logged-in educator’s ID

    //  Create new course in DB
    const newCourse = await Course.create(parsedCourseData);

    //  Upload thumbnail to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course Added Successfully",
      course: newCourse
    });

  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
// get educator course
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    
    res.json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching educator courses:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// get educator dashboard data

export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;

    
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map(course => course._id);

    // Calculate total earnings from completed purchases
    const purchases = await Purchase.find({ 
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    //  Collect unique enrolled student IDs with their course titles
    const enrolledStudentsData = [];

    for (const course of courses) {
      if (course.enrolledStudents?.length) {
        const students = await User.find(
          { _id: { $in: course.enrolledStudents } },
          "name imageUrl"
        );

        students.forEach(student => {
          enrolledStudentsData.push({
            courseTitle: course.courseTitle,
            student,
          });
        });
      }
    }

    //  Send dashboard data
    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });

  } catch (error) {
    console.error("Error fetching educator dashboard:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//  
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    
    //  Find all courses by educator
    const courses = await Course.find({ educator });
    const courseIds = courses.map(course => course._id);

    //  Find all completed purchases for these courses
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed'
    })
      .populate('userId', 'name imageUrl')   // get student details
      .populate('courseId', 'courseTitle');  // get course details
 
    //Map to enrolled students data
    const enrolledStudents = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId?.courseTitle,
      purchaseDate: purchase.createdAt
    }));

    //  Send response
    res.json({ success: true, enrolledStudents });
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
