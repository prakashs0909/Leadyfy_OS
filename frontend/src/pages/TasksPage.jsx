import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { LoadingState, ErrorState } from '../components/EmptyState';
import { CheckSquare, Plus } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/tasks');
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', formData);
      if (res.data.success) {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', priority: 'Medium', status: 'To Do' });
        fetchTasks();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { status });
      if (res.data.success) fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-amber-500" />
            <span>Internal Task Management</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Team task assignees, priorities (Urgent, High, Medium, Low), deadlines, and status tracking.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase flex items-center space-x-2 shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Loading internal task board..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTasks} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['To Do', 'In Progress', 'Done'].map((statusCol) => {
            const columnTasks = tasks.filter((t) => t.status === statusCol);
            return (
              <div key={statusCol} className="p-4 bg-[#111111] border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="font-bold text-xs text-zinc-200">{statusCol}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{columnTasks.length}</span>
                </div>

                <div className="space-y-2">
                  {columnTasks.map((t) => (
                    <div key={t._id} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-zinc-100">{t.title}</span>
                        <StatusBadge status={t.priority} />
                      </div>
                      <p className="text-zinc-400 text-[11px]">{t.description}</p>
                      <div className="pt-2 flex justify-between items-center border-t border-zinc-800/60">
                        <span className="text-[10px] text-zinc-500">Assignee: {t.assignee?.name}</span>
                        <select
                          value={t.status}
                          onChange={(e) => handleStatusChange(t._id, e.target.value)}
                          className="bg-zinc-950 text-[10px] text-zinc-200 border border-zinc-700 rounded px-1.5 py-0.5 outline-none"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-amber-500 text-black font-bold rounded-lg">Create Task</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
