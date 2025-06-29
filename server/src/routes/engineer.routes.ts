import express from 'express';
import User from '../models/User';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// GET /api/engineers
router.get('/', authenticate, async (req, res) => {
  try {
    const engineers = await User.find({ role: 'engineer' }).select('-password'); // remove password

    const formatted = engineers.map((e) => ({
      id: e._id,
      user_id: e._id,
      name: e.name,
      email: e.email,
      skills: e.skills,
      capacity_hours: e.maxCapacity, // Assuming weekly hours = maxCapacity
      experience_level: e.seniority.charAt(0).toUpperCase() + e.seniority.slice(1), // e.g., mid -> Mid
      department: e.department,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching engineers:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
