import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { ClipboardList, User, FolderKanban, Calendar, Clock, Plus } from 'lucide-react';

interface Assignment {
  id: string;
  project_id: string;
  engineer_id: string;
  project_name: string;
  engineer_name: string;
  allocated_hours: number;
  start_date: string;
  end_date: string;
  status: string;
}

interface Engineer {
  id: string;
  name: string;
  skills: string[];
}

interface Project {
  id: string;
  name: string;
  required_skills: string[];
}

const Assignments: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    project_id: '',
    engineer_id: '',
    allocated_hours: 0,
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, engineersRes, projectsRes] = await Promise.all([
        axios.get('http://localhost:3001/api/assignments'),
        axios.get('http://localhost:3001/api/engineers'),
        axios.get('http://localhost:3001/api/projects'),
      ]);
      setAssignments(assignmentsRes.data);
      setEngineers(engineersRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/assignments', newAssignment);
      fetchData();
      setShowDialog(false);
      setNewAssignment({ project_id: '', engineer_id: '', allocated_hours: 0, start_date: '', end_date: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const getSkillMatch = (engineerId: string, projectId: string) => {
    const eng = engineers.find(e => e.id === engineerId);
    const proj = projects.find(p => p.id === projectId);
    if (!eng || !proj) return 0;
    const matched = eng.skills.filter(skill => proj.required_skills.includes(skill));
    return Math.round((matched.length / proj.required_skills.length) * 100);
  };

  return (
    <ScrollArea className="space-y-1">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className='mb-5'>
          <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground mt-1">Manage engineer assignments to projects</p>
        </div>
        {user?.role === 'manager' && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" /> Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>Fill the form below to create assignment.</DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleCreate}>
                <Select value={newAssignment.project_id} onValueChange={(v) => setNewAssignment({ ...newAssignment, project_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={newAssignment.engineer_id} onValueChange={(v) => setNewAssignment({ ...newAssignment, engineer_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select engineer" />
                  </SelectTrigger>
                  <SelectContent>
                    {engineers.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input type="number" placeholder="Allocated Hours" value={newAssignment.allocated_hours} onChange={(e) => setNewAssignment({ ...newAssignment, allocated_hours: parseInt(e.target.value) || 0 })} />
                <Input type="date" value={newAssignment.start_date} onChange={(e) => setNewAssignment({ ...newAssignment, start_date: e.target.value })} />
                <Input type="date" value={newAssignment.end_date} onChange={(e) => setNewAssignment({ ...newAssignment, end_date: e.target.value })} />

                {newAssignment.project_id && newAssignment.engineer_id && (
                  <p className="text-sm">
                    Skill Match:{' '}
                    <span className={`${getSkillMatch(newAssignment.engineer_id, newAssignment.project_id) >= 80 ? 'text-green-500' : getSkillMatch(newAssignment.engineer_id, newAssignment.project_id) >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {getSkillMatch(newAssignment.engineer_id, newAssignment.project_id)}%
                    </span>
                  </p>
                )}

                <Button type="submit">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10">
        {assignments.map((a) => {
          const match = getSkillMatch(a.engineer_id, a.project_id);
          return (
            <Card key={a.id} className="dark:bg-muted/50 h-full flex flex-col justify-between p-4 shadow-sm border border-border">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="flex justify-between items-center text-base">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="text-green-400" /> Assignment
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{a.status}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm p-0">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FolderKanban className="h-4 w-4 text-blue-400" /> {a.project_name}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4 text-green-400" /> {a.engineer_name}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-orange-400" /> {a.allocated_hours} hrs
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-purple-400" /> Start: {moment(a.start_date).format('DD/MM/YYYY')}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-red-400" /> End: {moment(a.end_date).format('DD/MM/YYYY')}
                </div>
                <div className="text-right text-sm font-semibold">
                  Skill Match:{' '}
                  <span className={`${match >= 80 ? 'text-green-500' : match >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>{match}%</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default Assignments;
