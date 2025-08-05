import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    lectureCompleted: [], // assuming lecture IDs or titles
  },
  { minimize: false } // placed correctly as schema option
);

export const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);
