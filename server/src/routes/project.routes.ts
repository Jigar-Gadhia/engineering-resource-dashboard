import express from 'express';
import Project from '../models/Project';
import User from '../models/User';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// GET /api/projects
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await Project.find().populate('managerId', 'name');

    const formatted = projects.map(p => ({
      id: p._id,
      name: p.name,
      description: p.description,
      required_skills: p.requiredSkills,
      estimated_hours: p.teamSize * 40 || 0, // or p.estimatedHours if you store it
      priority: p.priority || 'Medium',
      deadline: p.endDate,
      status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
      manager_name: p.managerId?.name || 'N/A'
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/projects
router.post('/', authenticate, authorizeRoles('manager'), async (req, res) => {
  try {
    const { name, description, required_skills, estimated_hours, priority, deadline } = req.body;

    const project = await Project.create({
      name,
      description,
      requiredSkills: required_skills,
      teamSize: Math.ceil(estimated_hours / 40),
      priority,
      startDate: new Date(),
      endDate: new Date(deadline),
      status: 'planning',
      managerId: req.user.id
    });

    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
