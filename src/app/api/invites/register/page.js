'use client';
import { Suspense } from 'react';
import Register from '../../../../components/register/Register';


export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Register />
    </Suspense>
  );
}
