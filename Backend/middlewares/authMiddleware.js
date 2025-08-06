import { clerkClient } from "@clerk/express";

// Middleware to protect educator-only routes
export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;
    
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
    }

    const user = await clerkClient.users.getUser(userId);
    

    if (!user || user.publicMetadata?.role !== 'educator') {
      return res.status(403).json({ success: false, message: 'Forbidden: Not an educator' });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error("Error in protectEducator middleware:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
