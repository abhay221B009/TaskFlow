import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Users, Search, MoreVertical, UserPlus, Trash2 } from 'lucide-react';

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [memberStats, setMemberStats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTeams();
    if (user?.role === 'admin') {
      fetchUsers();
      fetchMemberStats();
    }
  }, [user]);

  const fetchMemberStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/member-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMemberStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/teams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/teams`, { 
        name, description, members: selectedMembers 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setName('');
      setDescription('');
      setSelectedMembers([]);
      fetchTeams();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTeams();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="flex h-[80vh] items-center justify-center text-slate-500 animate-pulse">Loading teams...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teams</h1>
          <p className="text-sm text-slate-500 mt-1">Organize users into teams for group assignments.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm transition-all hover:shadow focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus size={18} /> New Team
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div key={team._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                <Users size={22} />
              </div>
              {user?.role === 'admin' && (
                <button 
                  onClick={() => handleDeleteTeam(team._id)}
                  className="text-slate-400 hover:text-danger p-1 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors">{team.name}</h2>
            <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">{team.description}</p>
            
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Team Members</p>
              <div className="space-y-2">
                {team.members && team.members.length > 0 ? (
                  team.members.map((member) => (
                    <div key={member._id} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{member.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No members in this team</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400">Created {new Date(team.createdAt).toLocaleDateString()}</span>
              <span className="text-xs font-medium px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full border border-slate-100">
                {team.members?.length || 0} Members
              </span>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <Users size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No teams found</h3>
          <p className="text-slate-500 mt-2 max-w-sm">Create teams to easily assign tasks to groups of people.</p>
          {user?.role === 'admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="mt-6 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Create First Team
            </button>
          )}
        </div>
      )}

      {user?.role === 'admin' && memberStats.length > 0 && (
        <div className="mt-12 animate-in slide-in-from-bottom-4 duration-700">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Member Performance</h2>
            <p className="text-sm text-slate-500 mt-1">Track task completion status for each individual.</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="p-4 pl-6">Member</th>
                    <th className="p-4">Total Tasks</th>
                    <th className="p-4">Completed</th>
                    <th className="p-4">Pending</th>
                    <th className="p-4 pr-6">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {memberStats.map(stat => (
                    <tr key={stat._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-bold text-primary-600 border border-primary-100">
                            {stat.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{stat.name}</p>
                            <p className="text-xs text-slate-500">{stat.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{stat.totalTasks}</td>
                      <td className="p-4">
                        <span className="text-success font-medium">{stat.completedTasks}</span>
                      </td>
                      <td className="p-4 text-slate-500">{stat.pendingTasks}</td>
                      <td className="p-4 pr-6 min-w-[160px]">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-primary-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${stat.completionRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 w-9">{stat.completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create New Team</h2>
            <p className="text-sm text-slate-500 mb-6">Group your members together for easier task assignment.</p>
            
            <form onSubmit={handleCreateTeam} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Team Name</label>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Design Team"
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea 
                  required value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this team do?"
                  rows={3}
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Members</label>
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
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
