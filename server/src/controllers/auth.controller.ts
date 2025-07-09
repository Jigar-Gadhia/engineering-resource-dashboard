import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const signup = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      role,
      skills,
      seniority,
      maxCapacity,
      department,
    } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required" });
    }

    if (role === "engineer") {
      if (!name || !skills || !seniority || !maxCapacity || !department) {
        return res.status(400).json({
          message:
            "Missing required fields for engineer: name, skills, seniority, maxCapacity, department",
        });
      }
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name: name || "",
      email,
      password: hashed,
      role,
      skills: skills || [],
      seniority: seniority || undefined,
      maxCapacity: maxCapacity || undefined,
      department: department || undefined,
    });

    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (error: any) {
    console.error("❌ Signup Error:", error);
    res.status(400).json({
      message: "User creation failed",
      error: error.message,
      details: error.errors || null,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "",
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (error: any) {
    console.error("❌ Login Error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};
