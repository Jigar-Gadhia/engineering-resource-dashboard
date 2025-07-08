import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema(
  {
    name: String,
    dueDate: Date,
    completed: Boolean,
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  requiredSkills: [String],
  teamSize: Number,
  status: { type: String, enum: ["planning", "active", "completed"] },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  complexity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  budget: Number,
  projectType: String,
  milestones: [MilestoneSchema],
});

export default mongoose.model("Project", ProjectSchema);
