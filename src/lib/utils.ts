import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const apiUrl = "http://localhost:3001/api";
export const apiUrl = "https://engineering-resource-dashboard.onrender.com/api";
export const profileUrl = "/users/profile";
export const assignmentUrl = "/assignments";
export const projectUrl = "/projects";
export const engineerUrl = "/engineers";
export const loginUrl = "/login";
export const signupUrl = "/signup";
export const dashboardUrl = "/analytics/dashboard";
