'use client';
import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getAuthToken } from '../../lib/auth';

export default function SendInviteForm() {
  const [formData, setFormData] = useState({ email: '', role: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Please log in');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/invites/send-invite`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Invite sent successfully');
      setFormData({ email: '', role: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send invite');
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <Share2 className="text-teal-600 w-6 h-6 mb-3" />
      <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Team Collaboration</h4>
      <p className="text-gray-900 mb-4 text-sm">Invite team members to collaborate</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm text-gray-900">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="text-sm text-gray-900">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-md"
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="recruiter">Recruiter</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
          Send Invite
        </button>
      </form>
    </div>
  );
} 