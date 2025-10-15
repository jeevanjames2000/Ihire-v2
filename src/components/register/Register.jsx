'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Register() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [status, setStatus] = useState('Loading...');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const validateInvite = async () => {
      if (!token) {
        setStatus('');
        setError('No token provided. Please use a valid invitation link.');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/invites/validate?token=${encodeURIComponent(token)}`
        );
        console.log('Invite validation response:', response.data);
        setEmail(response.data.email);
        setCompanyName(response.data.company_name);
        setStatus('');
      } catch (err) {
        console.error('Error validating invite:', err.response?.data || err.message);
        setStatus('');
        setError(err.response?.data?.error || 'Invalid or expired invite');
        toast.error(err.response?.data?.error || 'Invalid or expired invite');
      }
    };

    validateInvite();
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !password || !confirmPassword) {
      setError('Name, password, and confirm password are required');
      toast.error('Name, password, and confirm password are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (!token || error) {
      setError('Cannot register without a valid invitation');
      toast.error('Cannot register without a valid invitation');
      return;
    }

    try {
      console.log('Submitting registration with token:', token);
      const response = await axios.post('http://localhost:5000/api/invites/inviteRegister', {
        token,
        name,
        password,
        designation,
      });
      console.log('Registration response:', response.data);

      if (response.data.authToken) {
        if (typeof window === 'undefined') return; // extra guard (not necessary in useEffect but safe)

        // window.localStorage.setItem('authToken', response.data.authToken);
        console.log('Auth token stored in localStorage:', response.data.authToken);
      } else {
        console.warn('No authToken received in response');
      }

      toast.success(response.data.message || 'Registration successful');
      router.push('/recruiterDashboard');
    } catch (err) {
      console.error('Error during registration:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Registration failed');
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        {status && <p className="text-center text-gray-600">{status}</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!status && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {companyName && (
              <p className="text-center text-gray-600">
                You are invited to join <strong>{companyName}</strong>
              </p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-2 mt-1 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation (Optional)</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              disabled={!token || !!error}
            >
              Register
            </button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
        {error && (
          <p className="mt-2 text-center text-sm text-gray-600">
            Need a new invitation? Contact your administrator.
          </p>
        )}
      </div>
    </div>
  );
}