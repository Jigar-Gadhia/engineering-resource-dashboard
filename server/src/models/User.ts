import mongoose from "mongoose";

const PerformanceSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    rating: Number,
    completedOnTime: Boolean,
    bugsReported: Number,
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: false, default: "user" },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["engineer", "manager"],
    default: "engineer",
    required: true,
  },

  // Optional fields
  skills: [String],
  seniority: { type: String, enum: ["junior", "mid", "senior"] },
  maxCapacity: Number,
  department: String,
  availability: Number, // in percentage
  joiningDate: Date,
  performanceHistory: [PerformanceSchema],
});

export default mongoose.model("User", UserSchema);
