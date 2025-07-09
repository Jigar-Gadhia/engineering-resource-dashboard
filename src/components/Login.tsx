import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, LogIn, UserPlus, Users } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const Login: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Manager" | "Engineer">("Engineer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState("");
  const [seniority, setSeniority] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [department, setDepartment] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(
          email,
          password,
          role,
          skills,
          seniority || "",
          maxCapacity,
          department
        );
        await login(email, password);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
          `${mode === "login" ? "Login" : "Signup"} failed`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-2">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-center text-xl font-bold pb-4">
            Engineering Resource Management
          </CardTitle>
          <Tabs
            value={mode}
            onValueChange={(val: string) => setMode(val as "login" | "signup")}
            className="mt-4"
          >
            <TabsList>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Signup</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              className={`grid gap-4 ${mode === "signup" && "md:grid-cols-2"}`}
            >
              <div>
                <h1 className="mb-3">Email</h1>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="Enter yout email"
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <h1 className="mb-3">Password</h1>
                <div className="flex flex-row justify-between gap-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: {
                      target: { value: React.SetStateAction<string> };
                    }) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="bg-accent rounded-md p-2 pl-2.5 pr-2.5"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {mode === "signup" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h1 className="mb-3">Role</h1>
                  <Select
                    value={role}
                    onValueChange={(v: string) =>
                      setRole(v as "Manager" | "Engineer")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineer">Engineer</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {role === "Engineer" && (
                  <>
                    <div>
                      <h1 className="mb-3">Skills</h1>
                      <Input
                        id="skills"
                        value={skills}
                        onChange={(e: {
                          target: { value: React.SetStateAction<string> };
                        }) => setSkills(e.target.value)}
                        placeholder="e.g. React, Node.js"
                        required={role === "Engineer"}
                      />
                    </div>
                    <div>
                      <h1 className="mb-3">Seniority</h1>
                      <Input
                        id="seniority"
                        value={seniority}
                        onChange={(e: {
                          target: { value: React.SetStateAction<string> };
                        }) => setSeniority(e.target.value)}
                        placeholder="e.g. Junior, Mid, Senior"
                        required={role === "Engineer"}
                      />
                    </div>
                    <div>
                      <h1 className="mb-3">Max Capacity (hrs/week)</h1>
                      <Input
                        id="maxCapacity"
                        type="number"
                        min={1}
                        value={maxCapacity}
                        onChange={(e: {
                          target: { value: React.SetStateAction<string> };
                        }) => setMaxCapacity(e.target.value)}
                        placeholder="e.g. 40"
                        required={role === "Engineer"}
                      />
                    </div>
                    <div>
                      <h1 className="mb-3">Department</h1>
                      <Input
                        id="department"
                        value={department}
                        onChange={(e: {
                          target: { value: React.SetStateAction<string> };
                        }) => setDepartment(e.target.value)}
                        placeholder="e.g. Engineering, QA, DevOps"
                        required={role === "Engineer"}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/20 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : mode === "login" ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" /> Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" /> Sign Up
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
