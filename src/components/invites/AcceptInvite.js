'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getAuthToken } from '../../lib/auth';

export default function AcceptInvite() {
  const [token, setToken] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = getAuthToken();
      if (!authToken) throw new Error('Please log in');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/invites/accept`,
        { token },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success('Invite accepted successfully');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to accept invite');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-lg border border-gray-200 bg-white">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Accept Invite</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="text-sm text-gray-900">Invite Token</label>
          <input
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
            required
          />
        </div>
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
          Accept Invite
        </button>
      </form>
    </div>
  );
}