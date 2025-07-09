import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { apiUrl, signupUrl } from "../lib/utils";
import api from "../lib/api";
import { profileUrl } from "../lib/utils";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (
    email: string,
    password: string,
    role: string,
    skills: string,
    seniority: string,
    maxCapacity: string,
    department: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userInfo = localStorage.getItem("user");
  const jsonUser = userInfo ? JSON.parse(userInfo) : null;
  const [user, setUser] = useState<User | null>({
    id: jsonUser?.id,
    email: jsonUser?.email,
    name: jsonUser?.name,
    role: jsonUser?.role,
  });

  const signup = async (
    email: string,
    password: string,
    role: string,
    skills: string,
    seniority: string,
    maxCapacity: string,
    department: string
  ) => {
    const response = await api
      .post(signupUrl, {
        email,
        password,
        role: role?.toLowerCase(),
        skills,
        seniority: seniority?.toLowerCase(),
        maxCapacity,
        department,
      })
      .catch((e) => console.log("error: ", e));

    const { token, user: userData } = response?.data;

    localStorage.setItem("token", token);
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const response = await axios.request({
      method: "post",
      url: `${apiUrl}/auth/login`,
      data: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { token, user: userData } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
