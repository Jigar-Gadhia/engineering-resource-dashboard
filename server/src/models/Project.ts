import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  requiredSkills: [String],
  teamSize: Number,
  status: { type: String, enum: ['planning', 'active', 'completed'] },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Project', ProjectSchema);
