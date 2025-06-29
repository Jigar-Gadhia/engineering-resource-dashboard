import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, Calendar, Clock, AlertTriangle, Plus, X, Loader2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

interface Project {
  id: string;
  name: string;
  description: string;
  required_skills: string[];
  estimated_hours: number;
  priority: string;
  deadline: string;
  status: string;
  manager_name: string;
}

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    required_skills: [] as string[],
    estimated_hours: 0,
    priority: 'Medium',
    deadline: '',
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !newProject.required_skills.includes(skillInput.trim())) {
      setNewProject({
        ...newProject,
        required_skills: [...newProject.required_skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setNewProject({
      ...newProject,
      required_skills: newProject.required_skills.filter((s) => s !== skill),
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/projects', newProject);
      setShowModal(false);
      fetchProjects();
      setNewProject({
        name: '',
        description: '',
        required_skills: [],
        estimated_hours: 0,
        priority: 'Medium',
        deadline: '',
      });
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  const getBadge = (value: string, type: 'priority' | 'status') => {
    const map = {
      priority: {
        Low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        High: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        Critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      },
      status: {
        Planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        Completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        'On Hold': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      },
    };
    return map[type][value] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage engineering projects and skills</p>
        </div>
        {user?.role?.toLowerCase() === 'manager' && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Create Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
                <div>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Add skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {newProject.required_skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="flex items-center">
                        {skill}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Estimated Hours"
                    value={newProject.estimated_hours}
                    onChange={(e) => setNewProject({
                      ...newProject,
                      estimated_hours: parseInt(e.target.value) || 0,
                    })}
                    required
                  />
                  <Select
                    value={newProject.priority}
                    onValueChange={(val) => setNewProject({ ...newProject, priority: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                />
                <DialogFooter>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>Manager: {project.manager_name}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${getBadge(project.priority, 'priority')}`}>{project.priority}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getBadge(project.status, 'status')}`}>{project.status}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>{project.description}</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Estimated: {project.estimated_hours} hours
              </div>
              {project.deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4" /> Required Skills:
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.required_skills.map((skill, idx) => (
                    <Badge variant="secondary" key={idx}>{skill}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Projects;
