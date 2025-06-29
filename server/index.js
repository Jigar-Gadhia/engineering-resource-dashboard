import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
});

// Define Mongoose schemas
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['Manager', 'Engineer'], required: true },
  created_at: { type: Date, default: Date.now },
}, { collection: 'user' }); // 👈 forces collection name

const engineerSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  user_id: { type: String, required: true },
  skills: { type: [String], required: true }, // Array of skills
  capacity_hours: { type: Number, default: 40 },
  experience_level: { type: String, enum: ['Junior', 'Mid', 'Senior', 'Lead'], required: true },
  department: { type: String },
});

const projectSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  description: { type: String },
  required_skills: { type: [String], required: true }, // Array of required skills
  estimated_hours: { type: Number, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  deadline: { type: Date },
  status: { type: String, default: 'Planning', enum: ['Planning', 'Active', 'Completed', 'On Hold'] },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const assignmentSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  project_id: { type: String, required: true },
  engineer_id: { type: String, required: true },
  allocated_hours: { type: Number, required: true },
  start_date: { type: Date },
  end_date: { type: Date },
  status: { type: String, default: 'Assigned', enum: ['Assigned', 'In Progress', 'Completed'] },
  created_at: { type: Date, default: Date.now },
});

// Create Mongoose models
const User = mongoose.model('users', userSchema);
const Engineer = mongoose.model('engineer', engineerSchema);
const Project = mongoose.model('project', projectSchema);
const Assignment = mongoose.model('assignment', assignmentSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: `Email and password are required` });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found with provided email' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('id email name role');
    res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Engineers routes
app.get('/api/engineers', authenticateToken, async (req, res) => {
  try {
    const engineers = await Engineer.find().populate('user_id', 'name email');
    res.json(engineers);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/engineers/:id', authenticateToken, async (req, res) => {
  try {
    const engineer = await Engineer.findById(req.params.id).populate('user_id', 'name email');
    if (!engineer) {
      return res.status(404).json({ error: 'Engineer not found' });
    }
    res.json(engineer);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Projects routes
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find().populate('created_by', 'name');
    res.json(projects);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  const { name, description, required_skills, estimated_hours, priority, deadline } = req.body;

  try {
    const project = new Project({
      name,
      description,
      required_skills,
      estimated_hours,
      priority,
      deadline,
      created_by: req.user.id,
    });
    await project.save();
    res.json({ id: project.id, message: 'Project created successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Assignments routes
app.get('/api/assignments', authenticateToken, async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('project_id', 'name')
      .populate('engineer_id', 'name');
    res.json(assignments);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/assignments', authenticateToken, async (req, res) => {
  const { project_id, engineer_id, allocated_hours, start_date, end_date } = req.body;

  try {
    const assignment = new Assignment({
      project_id,
      engineer_id,
      allocated_hours,
      start_date,
      end_date,
    });
    await assignment.save();
    res.json({ id: assignment.id, message: 'Assignment created successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Analytics routes
app.get('/api/analytics/dashboard', authenticateToken, async (req, res) => {
  try {
    const totalEngineers = await Engineer.countDocuments();
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'Active' });
    const totalAssignments = await Assignment.countDocuments();

    res.json({
      totalEngineers,
      totalProjects,
      activeProjects,
      totalAssignments,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});
