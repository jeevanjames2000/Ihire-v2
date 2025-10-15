'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getAuthToken } from '@/lib/auth';


export default function AcceptInvite() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('Processing invite...');

  useEffect(() => {
    const processInvite = async () => {
      try {
        const authToken = getAuthToken();
        if (authToken) {
         
          const response = await axios.post(
            'http://localhost:5000/api/invites/accept',
            { token },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          setStatus('Invite accepted successfully');
          toast.success(response.data.message);
          router.push('/dashboard'); 
        } else {
          setStatus('Please register or log in to accept the invite');
          toast.info('Please register or log in to accept the invite');
          router.push(`/register?token=${encodeURIComponent(token)}`);
        }
      } catch (err) {
        console.error('Error:', err.response?.data || err.message);
        setStatus('Failed to process invite');
        toast.error(err.response?.data?.error || 'Failed to process invite');
      }
    };

    if (token) {
      processInvite();
    } else {
      setStatus('No token provided');
      toast.error('No token provided');
      router.push('/login');
    }
  }, [token, router]);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold">Accept Invite</h2>
      <p>{status}</p>
    </div>
  );
}