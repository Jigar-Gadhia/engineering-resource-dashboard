import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User,
  Mail,
  Code,
  Clock,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Progress } from "../components/ui/progress";

interface Engineer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  skills: string[];
  capacity_hours: number;
  experience_level: string;
  department: string;
}

const Engineers: React.FC = () => {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEngineers();
  }, []);

  const fetchEngineers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/engineers');
      setEngineers(response.data);
    } catch (error) {
      console.error('Error fetching engineers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEngineers = engineers.filter(engineer =>
    engineer.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    engineer.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    engineer.skills.some(skill => skill?.toLowerCase().includes(searchTerm?.toLowerCase()))
  );

  const getExperienceBadgeClass = (level: string) => {
    switch (level) {
      case 'Junior':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Mid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Senior':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Lead':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Engineers</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your engineering team and their skills
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <Input
          placeholder="Search engineers by name, email, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Engineer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEngineers.map((engineer) => (
          <Card key={engineer.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{engineer.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {engineer.email}
                    </CardDescription>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExperienceBadgeClass(engineer.experience_level)}`}>
                  {engineer.experience_level}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span>Department: {engineer.department}</span>
              </div>
              <div>
              <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Capacity</span>
              </div>
              <div className='mt-2'>
                <Progress value={engineer.capacity_hours} />
                <p className="mt-2 text-xs text-muted-foreground">
                  {`${engineer.capacity_hours}%`}
                </p>
              </div>
            </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4" />
                  <span>Skills:</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {engineer.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEngineers.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No engineers found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm
              ? 'Try adjusting your search criteria.'
              : 'Get started by adding your first engineer.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Engineers;
