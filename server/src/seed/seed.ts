import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Project from "../models/Project";
import Assignment from "../models/Assignment";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to DB");

    // Wipe previous data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Assignment.deleteMany({});

    // Seed Users
    const password = await bcrypt.hash("123456", 10);
    const users = await User.insertMany([
      {
        name: "Alice",
        email: "alice@example.com",
        password,
        role: "engineer",
        skills: ["React", "Node.js"],
        seniority: "mid",
        maxCapacity: 100,
        availability: 30,
        department: "Frontend",
        joiningDate: new Date("2023-01-15"),
        performanceHistory: [
          { rating: 4.5, completedOnTime: true, bugsReported: 3 },
          { rating: 3.8, completedOnTime: false, bugsReported: 5 },
        ],
      },
      {
        name: "Bob",
        email: "bob@example.com",
        password,
        role: "engineer",
        skills: ["Python"],
        seniority: "senior",
        maxCapacity: 50,
        availability: 50,
        department: "Backend",
        joiningDate: new Date("2022-09-10"),
        performanceHistory: [
          { rating: 4.8, completedOnTime: true, bugsReported: 1 },
        ],
      },
      {
        name: "Carol",
        email: "carol@example.com",
        password,
        role: "engineer",
        skills: ["React", "Python"],
        seniority: "junior",
        maxCapacity: 100,
        availability: 20,
        department: "Fullstack",
        joiningDate: new Date("2023-05-01"),
        performanceHistory: [
          { rating: 3.5, completedOnTime: true, bugsReported: 2 },
        ],
      },
      {
        name: "Manager1",
        email: "manager@example.com",
        password,
        role: "manager",
        department: "Management",
      },
    ]);

    const engineers = users.filter((u) => u.role === "engineer");
    const manager = users.find((u) => u.role === "manager");

    // Seed Projects
    const projects = await Project.insertMany([
      {
        name: "React Migration",
        description: "Migrate old Angular codebase to React.",
        startDate: new Date("2024-07-01"),
        endDate: new Date("2024-09-30"),
        requiredSkills: ["React"],
        teamSize: 2,
        priority: "high",
        complexity: "medium",
        status: "active",
        projectType: "Web",
        budget: 100000,
        milestones: [
          { name: "Setup", dueDate: new Date("2024-07-15"), completed: true },
          {
            name: "Component Migration",
            dueDate: new Date("2024-08-15"),
            completed: false,
          },
        ],
        managerId: manager?._id,
      },
      {
        name: "AI Analytics Engine",
        description: "Build data analysis backend with Python.",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-12-31"),
        requiredSkills: ["Python"],
        teamSize: 3,
        priority: "medium",
        complexity: "high",
        status: "planning",
        projectType: "AI",
        budget: 150000,
        milestones: [
          {
            name: "Data Ingestion",
            dueDate: new Date("2024-07-01"),
            completed: false,
          },
        ],
        managerId: manager?._id,
      },
      {
        name: "Fullstack Dashboard",
        description: "Dashboard with React + Node.js.",
        startDate: new Date("2024-08-01"),
        endDate: new Date("2024-11-30"),
        requiredSkills: ["React", "Node.js"],
        teamSize: 2,
        priority: "low",
        complexity: "medium",
        status: "planning",
        projectType: "Fullstack",
        budget: 80000,
        milestones: [],
        managerId: manager?._id,
      },
    ]);

    // Seed Assignments
    await Assignment.insertMany([
      {
        engineerId: engineers[0]?._id,
        projectId: projects[0]?._id,
        allocationPercentage: 60,
        startDate: new Date("2024-07-01"),
        endDate: new Date("2024-09-30"),
        actualEndDate: null,
        status: "in_progress",
        role: "Frontend Developer",
        feedback: {
          fromEngineer: "Looking forward to migrating components.",
          fromManager: "Strong understanding of React internals.",
          rating: 4.2,
        },
      },
      {
        engineerId: engineers[1]?._id,
        projectId: projects[1]?._id,
        allocationPercentage: 50,
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-12-31"),
        actualEndDate: null,
        status: "assigned",
        role: "Data Engineer",
        feedback: {
          fromEngineer: "Excited to implement ML pipelines.",
          fromManager: "",
          rating: null,
        },
      },
      {
        engineerId: engineers[2]?._id,
        projectId: projects[2]?._id,
        allocationPercentage: 80,
        startDate: new Date("2024-08-01"),
        endDate: new Date("2024-11-30"),
        actualEndDate: null,
        status: "assigned",
        role: "Fullstack Dev",
        feedback: {},
      },
      {
        engineerId: engineers[0]?._id,
        projectId: projects[2]?._id,
        allocationPercentage: 40,
        startDate: new Date("2024-08-01"),
        endDate: new Date("2024-11-30"),
        actualEndDate: null,
        status: "assigned",
        role: "React Consultant",
        feedback: {
          fromEngineer: "May have capacity issues.",
          fromManager: "Re-evaluate allocation.",
          rating: 3.5,
        },
      },
    ]);

    console.log("✅ Seed complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
