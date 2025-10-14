'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function AcceptInvite() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('Processing invite...');

  useEffect(() => {
    console.log('Token from URL:', token); // Debug: Log the token

    const processInvite = async () => {
      if (!token) {
        console.log('No token provided, redirecting to /register');
        setStatus('No token provided');
        toast.error('No token provided. Please use a valid invitation link.');
        router.push('/register');
        return;
      }

      console.log('Redirecting to /register with token:', token);
      setStatus('Please register to accept the invite');
      toast.info('Please register to accept the invite');
      router.push(`/register?token=${encodeURIComponent(token)}`);
    };

    processInvite();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Accept Invite</h2>
        <p className="text-center text-gray-600">{status}</p>
      </div>
    </div>
  );
}