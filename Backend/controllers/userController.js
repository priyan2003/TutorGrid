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
        populate: {
          path: "lectures", // assumes each course has lectures array with ObjectId refs
        },
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