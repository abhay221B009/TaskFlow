import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'Todo' || t.status === 'In Progress').length;
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;

  const stats = [
    { name: 'Total Tasks', value: totalTasks, icon: <ListTodo size={24} className="text-primary-500" />, bg: 'bg-primary-50', border: 'border-primary-100' },
    { name: 'Completed', value: completedTasks, icon: <CheckCircle size={24} className="text-success" />, bg: 'bg-green-50', border: 'border-green-100' },
    { name: 'Pending', value: pendingTasks, icon: <Clock size={24} className="text-warning" />, bg: 'bg-amber-50', border: 'border-amber-100' },
    { name: 'Overdue', value: overdueTasks, icon: <AlertCircle size={24} className="text-danger" />, bg: 'bg-red-50', border: 'border-red-100' },
  ];

  if (loading) return <div className="flex h-[80vh] items-center justify-center text-slate-500 animate-pulse">Loading your workspace...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-slate-500 mt-1">Here is what's happening with your projects today.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white rounded-2xl shadow-sm border ${stat.border} p-6 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500 mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Tasks</h2>
          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Newest</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-slate-100">
            {tasks.slice(0, 5).map(task => (
              <div key={task._id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="min-w-0 pr-4">
                  <h3 className="font-medium text-slate-900 truncate group-hover:text-primary-600 transition-colors">{task.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">{task.project?.title}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider
                    ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <ListTodo size={32} className="text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-500">No tasks yet</p>
                <p className="text-xs text-slate-400 mt-1">Get started by creating a project.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
