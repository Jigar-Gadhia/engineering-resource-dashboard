import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import assignmentRoutes from "./routes/assignment.routes";
import analyticsRoutes from "./routes/analytics.routes";
import engineerRoutes from "./routes/engineer.routes";

dotenv.config();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/engineers", engineerRoutes);

connectDB();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
