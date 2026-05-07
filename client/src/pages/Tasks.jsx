import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, ListTodo, Search, Calendar, User as UserIcon, Users } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedTeam, setAssignedTeam] = useState('');
  const [assignmentType, setAssignmentType] = useState('individual'); // 'individual' or 'team'
  const [priority, setPriority] = useState('Medium');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'admin') {
      fetchProjects();
      fetchTeams();
    }
  }, [user]);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/teams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
      if(res.data.length > 0) {
        setProject(res.data[0]._id);
        if(res.data[0].members && res.data[0].members.length > 0) {
          setAssignedTo(res.data[0].members[0]._id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const selectedProject = projects.find(p => p._id === project);
    if (assignmentType === 'individual') {
      if (selectedProject && selectedProject.members && selectedProject.members.length > 0) {
        setAssignedTo(selectedProject.members[0]._id);
      } else {
        setAssignedTo('');
      }
      setAssignedTeam('');
    } else {
      setAssignedTo('');
    }
  }, [project, projects, assignmentType]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const taskData = { title, description, project, dueDate, priority };
      
      if (assignmentType === 'individual' && assignedTo) {
        taskData.assignedTo = assignedTo;
      } else if (assignmentType === 'team' && assignedTeam) {
        taskData.assignedTeam = assignedTeam;
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setPriority('Medium');
      fetchTasks();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create task');
      console.error(error);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and organize your work items.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => {
              setError('');
              setShowModal(true);
            }}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm transition-all hover:shadow focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shrink-0"
          >
            <Plus size={18} /> New Task
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Table Header / Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4 pl-6 font-semibold">Task</th>
                <th className="p-4 font-semibold">Project</th>
                <th className="p-4 font-semibold">Assigned To</th>
                <th className="p-4 font-semibold">Priority</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 pr-6 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTasks.map(task => (
                <tr key={task._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4 pl-6 max-w-[200px]">
                    <p className="font-medium text-slate-900 truncate group-hover:text-primary-600 transition-colors">{task.title}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{task.description}</p>
                  </td>
                  <td className="p-4 text-slate-600">
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700">
                      {task.project?.title || 'Unknown'}
                    </span>
                  </td>
                  <td className="p-4">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {task.assignedTo.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-700 text-sm">{task.assignedTo.name}</span>
                      </div>
                    ) : task.assignedTeam ? (
                      <div className="flex items-center gap-2 text-primary-600">
                        <Users size={16} />
                        <span className="text-sm font-medium">{task.assignedTeam.name}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs flex items-center gap-1"><UserIcon size={14}/> Unassigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
                      ${task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 
                        task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                      {task.priority || 'Medium'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Calendar size={14} className="text-slate-400" />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <select 
                      value={task.status}
                      onChange={(e) => updateStatus(task._id, e.target.value)}
                      className={`text-xs rounded-full px-3 py-1 font-semibold border-0 focus:ring-2 focus:ring-primary-500 cursor-pointer appearance-none text-center inline-block outline-none
                        ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center border-t border-slate-100">
              <ListTodo size={40} className="text-slate-300 mb-3" />
              <p className="text-slate-900 font-medium">No tasks found</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or create a new task.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create New Task</h2>
            <p className="text-sm text-slate-500 mb-6">Fill in the details below to assign a new task.</p>
            
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
                {error}
              </div>
            )}
            
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Task Title</label>
                <input 
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Design landing page"
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea 
                  required value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details about this task..."
                  rows={2}
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project</label>
                  <select 
                    required value={project} onChange={(e) => setProject(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                  >
                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority</label>
                  <select 
                    value={priority} onChange={(e) => setPriority(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assignment Type</label>
                  <div className="flex gap-4 p-1 bg-slate-50 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setAssignmentType('individual')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${assignmentType === 'individual' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssignmentType('team')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${assignmentType === 'team' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Team
                    </button>
                  </div>
                </div>

                {assignmentType === 'individual' ? (
                  <div>
                    {project && projects.find(p => p._id === project)?.members?.length > 0 && (
                      <>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign To</label>
                        <select 
                          value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
                          className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                        >
                          <option value="">Unassigned</option>
                          {projects.find(p => p._id === project).members.map(m => (
                            <option key={m._id} value={m._id}>{m.name}</option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign Team</label>
                    <select 
                      value={assignedTeam} onChange={(e) => setAssignedTeam(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                    >
                      <option value="">Select Team</option>
                      {teams.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date</label>
                <input 
                  type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 shadow-sm transition-colors">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
