import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import Stripe from 'stripe'
// Get user data
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await User.findById(userId);

        if(!user){
            return res.json({success: false, message: 'User Not Found'});
        }
        return res.json({success: true, user});
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// user enrolled course with lectures links
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const userData = await User.findById(userId)
      .populate({
        path: "enrolledCourses",
      });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Purchase course
export const purchaseCourse = async (req, res)=>{
  try {
    const {courseId} = req.body;
    const {origin} = req.headers;
    const userId = req.auth.userId;
    const userData = await User.findById(userId)
    const courseData = await Course.findById(courseId);
    if(!userData || !courseData){
      return res.json({success:false , message:'Data Not Found!!'});
    }
    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: ((courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2)),
    };
    const newPurchase = await Purchase.create(purchaseData);
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

    const currency = process.env.CURRENCY.toLowerCase();
    const line_items = [
      {
        price_data: {
          currency, // or "usd", depending on your use case
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount * 100), // Stripe expects amount in the smallest currency unit
        },
        quantity: 1,
      },
    ]

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: 'payment',
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({success: true, session_url: session.url})
  } catch (error) {
    return res.json({success:false, message: error.message})
  }
}

// update User progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;

    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      // If lecture already marked as completed, return early
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: 'Lecture already marked as completed',
        });
      }

      // Add new lecture to the list
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      // Create new progress document
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: 'Progress updated successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    const { courseId } = req.body;
    
    const progressData = await CourseProgress.findOne({ userId, courseId });
    console.log(progressData);
    

    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Add user data to courses
export const addUserRating = async (req, res) => {
    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    // Input validation
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'Invalid details' });
    }

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.json({ success: false, message: 'Course not found.' });
        }

        const user = await User.findById(userId);
        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User has not purchased this course.' });
        }

        // Check if the user has already rated the course
        const existingRatingIndex = course.courseRatings.findIndex(
            (r) => r.userId.toString() === userId
        );

        if (existingRatingIndex > -1) {
            // Update existing rating
            course.courseRatings[existingRatingIndex].rating = rating;
        } else {
            // Add new rating
            course.courseRatings.push({ userId, rating });
        }

        await course.save();

        return res.json({ success: true, message: 'Rating added!' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};