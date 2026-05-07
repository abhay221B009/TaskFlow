import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Users, CheckCircle, Calendar, Clock } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const [projectRes, tasksRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/tasks?project=${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setProject(projectRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndTasks();
  }, [id]);

  if (loading) return <div className="flex h-[80vh] items-center justify-center text-slate-500 animate-pulse">Loading project details...</div>;
  if (!project) return <div className="p-8 text-center text-slate-500">Project not found</div>;

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{project.title}</h1>
        <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">{project.description}</p>
        
        <div className="flex items-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar size={16} className="text-slate-400" />
            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users size={16} className="text-slate-400" />
            <span>{project.members?.length || 0} Members</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Project Progress</h2>
              <span className="text-sm font-bold text-primary-600">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-primary-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-success" /> {completedTasks} Completed</span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-warning" /> {tasks.length - completedTasks} Pending</span>
            </div>
          </div>

          {/* Tasks List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle className="text-primary-500" size={20} /> Tasks
              </h2>
              <span className="text-xs font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-full text-slate-600 shadow-sm">{tasks.length} total</span>
            </div>
            <div className="divide-y divide-slate-100">
              {tasks.map(task => (
                <div key={task._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-semibold text-slate-900 truncate group-hover:text-primary-600 transition-colors">{task.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider
                      ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      {task.status}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <CheckCircle size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-900 font-medium">No tasks found</p>
                  <p className="text-sm text-slate-500 mt-1">This project has no active tasks yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          {/* Team Members */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="text-primary-500" size={20} /> Team
              </h2>
            </div>
            <div className="divide-y divide-slate-100 p-2">
              {project.members && project.members.length > 0 ? project.members.map(member => (
                <div key={member._id} className="p-3 flex items-center gap-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">{member.name}</p>
                    <p className="text-xs text-slate-500 truncate">{member.email}</p>
                  </div>
                </div>
              )) : (
                 <div className="p-8 text-sm text-slate-500 text-center flex flex-col items-center">
                    <Users size={24} className="text-slate-300 mb-2" />
                    No members assigned
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
