import User from "../models/User.js";

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
