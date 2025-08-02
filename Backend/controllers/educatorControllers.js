import { clerkClient} from '@clerk/express'
import Course from "../models/Course.js";   // ✅ Adjust path if needed
import {v2 as cloudinary} from "cloudinary";  // ✅ Adjust path if needed


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
    // ✅ FIX for Clerk deprecation warning
    const { userId } = await req.auth();  // userId comes from Clerk middleware

    const { courseData } = req.body;
    const imageFile = req.file; // ✅ Assuming you’re using multer for file upload

    if (!courseData) {
      return res.status(400).json({ success: false, message: "Course data is required" });
    }

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Course thumbnail is required" });
    }

    // ✅ Parse courseData sent from frontend
    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = userId; // ✅ Assign logged-in educator’s ID

    // ✅ Create new course in DB
    const newCourse = await Course.create(parsedCourseData);

    // ✅ Upload thumbnail to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course Added Successfully",
      course: newCourse
    });

  } catch (error) {
    console.error("❌ Error adding course:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
