

'use client';
import { Suspense } from 'react';
import AcceptInvite from '../../../../components/invites/AcceptInvite';


export const dynamic = 'force-dynamic';

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <AcceptInvite/>

    </Suspense>
  );
}
