import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Engineers from "./components/Engineers";
import Projects from "./components/Projects";
import Assignments from "./components/Assignments";
import Layout from "./components/Layout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Loader2 } from "lucide-react";

function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function AppContent() {
  const { user } = useAuth();

  console.log("user", user);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/engineers" element={<Engineers />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
