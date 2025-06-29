import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  engineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  allocationPercentage: Number,
  startDate: Date,
  endDate: Date,
  role: String // Developer, Tech Lead, etc.
});

export default mongoose.model('Assignment', AssignmentSchema);
