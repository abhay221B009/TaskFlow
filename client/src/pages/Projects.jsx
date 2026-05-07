import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Folder, Users, Calendar, MoreVertical } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsersList(res.data);
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/projects`, { title, description, members: selectedMembers }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setSelectedMembers([]);
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your team's initiatives.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm transition-all hover:shadow focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link to={`/projects/${project._id}`} key={project._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 block group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                <Folder size={22} />
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-1">
                <MoreVertical size={18} />
              </button>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors">{project.title}</h2>
            <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">{project.description}</p>
            
            <div className="flex justify-between items-end border-t border-slate-100 pt-5">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Team</p>
                <div className="flex -space-x-2 overflow-hidden">
                  {project.members && project.members.length > 0 ? (
                    project.members.slice(0, 4).map((member, i) => (
                      <div key={member._id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 py-1">No members</span>
                  )}
                  {project.members && project.members.length > 4 && (
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-50 flex items-center justify-center text-xs font-medium text-slate-500">
                      +{project.members.length - 4}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Created</p>
                <div className="flex items-center text-sm text-slate-600 gap-1.5">
                  <Calendar size={14} />
                  {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <Folder size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No projects found</h3>
          <p className="text-slate-500 mt-2 max-w-sm">Get started by creating a new project and inviting your team members to collaborate.</p>
          {user?.role === 'admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="mt-6 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Create First Project
            </button>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create New Project</h2>
            <p className="text-sm text-slate-500 mb-6">Setup the basic details and invite team members.</p>
            
            <form onSubmit={handleCreateProject} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title</label>
                <input 
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Website Redesign"
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea 
                  required value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this project about?"
                  rows={3}
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Assign Members</label>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1 bg-slate-50 custom-scrollbar">
                  {usersList.map(u => (
                    <label key={u._id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-100 rounded-md transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedMembers.includes(u._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers([...selectedMembers, u._id]);
                          } else {
                            setSelectedMembers(selectedMembers.filter(id => id !== u._id));
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-colors"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{u.name}</span>
                        <span className="text-xs text-slate-500 capitalize">{u.role}</span>
                      </div>
                    </label>
                  ))}
                  {usersList.length === 0 && <div className="p-2 text-sm text-slate-500">No users found.</div>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 shadow-sm transition-colors">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
