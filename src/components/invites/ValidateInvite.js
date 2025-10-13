'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Typography } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link';

export default function ValidateInvite() {
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        toast.error('No token provided');
        return;
      }
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invites/validate?token=${token}`);
        setData({ ...response.data, token });
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to validate invite');
      }
    };
    validateToken();
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-lg border border-gray-200 bg-white">
      <Typography className="text-xl font-semibold text-gray-800 mb-4">Validate Invite</Typography>
      {data ? (
        <>
          <p className="text-gray-900">Email: {data.email}</p>
          <p className="text-gray-900">Company: {data.company_name}</p>
          <Link href={`/login?token=${data.token}`} className="text-teal-600 hover:text-teal-800 font-semibold mt-4 inline-block">
            Proceed to Login/Register
          </Link>
        </>
      ) : (
        <p className="text-gray-900">Validating invite...</p>
      )}
    </div>
  );
}