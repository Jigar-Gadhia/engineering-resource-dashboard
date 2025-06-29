import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Project from '../models/Project';
import Assignment from '../models/Assignment';

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Wipe previous data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Assignment.deleteMany({});

    // Seed Users
    const password = await bcrypt.hash('123456', 10);
    const users = await User.insertMany([
      {
        name: 'Alice',
        email: 'alice@example.com',
        password,
        role: 'engineer',
        skills: ['React', 'Node.js'],
        seniority: 'mid',
        maxCapacity: 100,
        department: 'Frontend'
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        password,
        role: 'engineer',
        skills: ['Python'],
        seniority: 'senior',
        maxCapacity: 50,
        department: 'Backend'
      },
      {
        name: 'Carol',
        email: 'carol@example.com',
        password,
        role: 'engineer',
        skills: ['React', 'Python'],
        seniority: 'junior',
        maxCapacity: 100,
        department: 'Fullstack'
      },
      {
        name: 'Manager1',
        email: 'manager@example.com',
        password,
        role: 'manager',
        department: 'Management'
      }
    ]);

    const engineers = users.filter(u => u.role === 'engineer');
    const manager = users.find(u => u.role === 'manager');

    // Seed Projects
    const projects = await Project.insertMany([
      {
        name: 'React Migration',
        description: 'Migrate old Angular codebase to React.',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-09-30'),
        requiredSkills: ['React'],
        teamSize: 2,
        status: 'active',
        managerId: manager?._id
      },
      {
        name: 'AI Analytics Engine',
        description: 'Build data analysis backend with Python.',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-12-31'),
        requiredSkills: ['Python'],
        teamSize: 3,
        status: 'planning',
        managerId: manager?._id
      },
      {
        name: 'Fullstack Dashboard',
        description: 'Dashboard with React + Node.js.',
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-11-30'),
        requiredSkills: ['React', 'Node.js'],
        teamSize: 2,
        status: 'planning',
        managerId: manager?._id
      }
    ]);

    // Seed Assignments
    await Assignment.insertMany([
      {
        engineerId: engineers[0]._id,
        projectId: projects[0]._id,
        allocationPercentage: 60,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-09-30'),
        role: 'Frontend Developer'
      },
      {
        engineerId: engineers[1]._id,
        projectId: projects[1]._id,
        allocationPercentage: 50,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-12-31'),
        role: 'Data Engineer'
      },
      {
        engineerId: engineers[2]._id,
        projectId: projects[2]._id,
        allocationPercentage: 80,
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-11-30'),
        role: 'Fullstack Dev'
      },
      {
        engineerId: engineers[0]._id,
        projectId: projects[2]._id,
        allocationPercentage: 40,
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-11-30'),
        role: 'React Consultant'
      }
    ]);

    console.log('✅ Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
