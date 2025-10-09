'use client';
import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, DollarSign, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import theme from '../../../../theme.json';
import Jobs from '@/lib/database/jobs.json';
export default function JobDetailPage({ params }) {
  const { id } = React.use(params);
  const allJobs = Object.values(Jobs).flat();
  const job = allJobs.find(j => j.id === Number(id));
  if (!job) return notFound();
  return (
    <section className="py-20 container mx-auto px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-3xl overflow-hidden border border-slate-100 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <Image
            src={job.logo}
            alt={`${job.company} logo`}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
            <p className="text-slate-600">{job.company}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-slate-600 mb-6">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-[#48adb9]" /> {job.location}
          </div>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-[#48adb9]" /> {job.salary}
          </div>
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-[#48adb9]" /> {job.type}
          </div>
        </div>
        <p className="text-slate-700 leading-relaxed mb-8">{job.description}</p>
        <Button
          className={`w-full bg-gradient-to-r ${theme.buttons.primary.bg} ${theme.buttons.primary.to} hover:${theme.buttons.primary.bgHover} hover:${theme.buttons.primary.toHover} ${theme.buttons.primary.text}`}
        >
          Apply Now
        </Button>
      </div>
    </section>
  );
}
