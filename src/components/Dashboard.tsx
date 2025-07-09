import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  FolderKanban,
  ClipboardList,
  Activity,
  Briefcase,
  Clock,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../lib/utils";

interface DashboardStats {
  totalEngineers: number;
  totalProjects: number;
  activeProjects: number;
  totalAssignments: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalEngineers: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalAssignments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/analytics/dashboard`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {user?.name}! Here's your dashboard overview.
        </p>
      </div>

      {user?.role?.toLowerCase() === "manager" ? (
        <>
          {/* Manager Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Total Engineers",
                value: stats.totalEngineers,
                icon: Users,
              },
              {
                title: "Total Projects",
                value: stats.totalProjects,
                icon: FolderKanban,
              },
              {
                title: "Active Projects",
                value: stats.activeProjects,
                icon: Activity,
              },
              {
                title: "Total Assignments",
                value: stats.totalAssignments,
                icon: ClipboardList,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 shadow-sm border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className="bg-accent p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Engineer View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    My Projects
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {stats.totalProjects}
                  </p>
                </div>
                <div className="bg-accent p-3 rounded-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Upcoming Assignments
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {stats.totalAssignments}
                  </p>
                </div>
                <div className="bg-accent p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
