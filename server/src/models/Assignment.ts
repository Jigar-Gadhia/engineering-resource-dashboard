import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    fromEngineer: String,
    fromManager: String,
    rating: Number,
  },
  { _id: false }
);

const AssignmentSchema = new mongoose.Schema({
  engineerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  allocationPercentage: Number,
  startDate: Date,
  endDate: Date,
  actualEndDate: Date,
  status: {
    type: String,
    enum: ["assigned", "in_progress", "completed", "delayed"],
    default: "assigned",
  },
  role: String, // Developer, Tech Lead, etc.
  feedback: FeedbackSchema,
});

export default mongoose.model("Assignment", AssignmentSchema);
