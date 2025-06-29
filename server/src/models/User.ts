import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['engineer', 'manager'], default: 'engineer' },
  skills: [String],
  seniority: { type: String, enum: ['junior', 'mid', 'senior'] },
  maxCapacity: Number,
  department: String,
});

export default mongoose.model('User', UserSchema);
