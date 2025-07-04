import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  signup: (email: string,
    password: string,
    role: string,
    skills: string,
    seniority: string,
    maxCapacity: string,
    department: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('https://engineering-resource-dashboard.onrender.com/api/users/profile');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    role: string,
    skills: string,
    seniority: string,
    maxCapacity: string,
    department: string
  ) => {
    const response = await axios.post('https://engineering-resource-dashboard.onrender.com/api/auth/signup', {
      email,
      password,
      role: role?.toLowerCase(),
      skills,
      seniority: seniority?.toLowerCase(),
      maxCapacity,
      department
    }).catch((e) => console.log('error: ', e));

    const { token, user: userData } = response.data;

    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };


  const login = async (email: string, password: string) => {
    const response = await axios.request({
      method: 'post',
      url: 'https://engineering-resource-dashboard.onrender.com/api/auth/login',
      data: JSON.stringify({
        email,
        password
      }),
      headers: { 
        'Content-Type': 'application/json'
      },
    });

    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
