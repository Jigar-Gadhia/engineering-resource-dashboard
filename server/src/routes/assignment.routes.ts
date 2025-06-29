import express from 'express';
import Assignment from '../models/Assignment';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// GET /api/assignments
router.get('/', authenticate, async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('projectId', 'name requiredSkills')
      .populate('engineerId', 'name skills');

    const formatted = assignments.map((a) => ({
      id: a._id,
      project_id: a.projectId?._id,
      engineer_id: a.engineerId?._id,
      project_name: a.projectId?.name,
      engineer_name: a.engineerId?.name,
      allocated_hours: a.allocationPercentage, // assuming 1% = 1 hour
      start_date: a.startDate,
      end_date: a.endDate,
      status: 'Assigned', // Static for now; could be dynamic
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/assignments
router.post('/', authenticate, authorizeRoles('manager'), async (req, res) => {
  try {
    const { project_id, engineer_id, allocated_hours, start_date, end_date } = req.body;

    const assignment = await Assignment.create({
      projectId: project_id,
      engineerId: engineer_id,
      allocationPercentage: allocated_hours, // interpreted as % or hours based on your logic
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      role: 'Developer' // You can extend form to include this
    });

    res.status(201).json({ message: 'Assignment created', assignment });
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
