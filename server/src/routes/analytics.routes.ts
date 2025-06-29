import express from 'express';
import User from '../models/User';
import Project from '../models/Project';
import Assignment from '../models/Assignment';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const [totalEngineers, totalProjects, activeProjects, totalAssignments] = await Promise.all([
      User.countDocuments({ role: 'engineer' }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'active' }),
      Assignment.countDocuments(),
    ]);

    res.json({
      totalEngineers,
      totalProjects,
      activeProjects,
      totalAssignments,
    });
  } catch (err) {
    console.error('Dashboard API error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
