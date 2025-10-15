'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, DollarSign, Briefcase, Bookmark, ChevronRight, Filter, Users, Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default function JobDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params || {};
  console.log('params:', params);
  if (!id) {
    console.error('Invalid or missing job ID');
    return notFound();
  }
  const [job, setJob] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('savedJobs');
        if (saved) {
          setSavedJobs(new Set(JSON.parse(saved)));
        }
      } catch (err) {
        console.error('Error loading savedJobs from localStorage:', err);
      }
    }
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('savedJobs', JSON.stringify([...savedJobs]));
      } catch (err) {
        console.error('Error saving savedJobs to localStorage:', err);
      }
    }
  }, [savedJobs]);
  useEffect(() => {
    async function fetchJobs() {
      try {
        const jobUrl = `${ process.env.NEXT_PUBLIC_API_URL}/api/jobs/getJobById/${id}`;
        const allJobsUrl = `${ process.env.NEXT_PUBLIC_API_URL}/api/jobs/getAllJobs`;
        const jobRes = await fetch(jobUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'include',
        });
        if (!jobRes.ok) {
          const errorText = await jobRes.text();
          console.error('Job fetch response:', errorText);
          throw new Error(`Failed to fetch job: ${jobRes.statusText} (Status: ${jobRes.status})`);
        }
        const jobData = await jobRes.json();
        setJob({
          ...jobData,
          description: jobData.description || '',
          responsibilities: jobData.responsibilities || [],
          qualifications: jobData.qualifications || [],
          category: jobData.category || 'General',
          applicants: jobData.applicants || 0,
        });
        const allJobsRes = await fetch(allJobsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'include',
        });
        if (!allJobsRes.ok) {
          const errorText = await allJobsRes.text();
          console.error('All jobs fetch response:', errorText);
          throw new Error(`Failed to fetch all jobs: ${allJobsRes.statusText} (Status: ${allJobsRes.status})`);
        }
        const allJobsData = await allJobsRes.json();
        if (!Array.isArray(allJobsData)) {
          throw new Error('Invalid response format: Expected an array of jobs');
        }
        const parsedAllJobs = allJobsData.map((job) => ({
          ...job,
          description: job.description ? JSON.parse(job.description).html || '' : '',
          responsibilities: job.responsibilities || [],
          qualifications: job.qualifications || [],
          category: job.category || 'General',
          applicants: job.applicants || 0,
        }));
        setAllJobs(parsedAllJobs);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [id]);
const responsibilities = Array.isArray(job?.responsibilities)
  ? job.responsibilities
  : typeof job?.responsibilities === 'string'
  ? job.responsibilities.split('\n').filter(Boolean)
  : [];
const qualifications = Array.isArray(job?.qualifications)
  ? job.qualifications
  : typeof job?.qualifications === 'string'
  ? job.qualifications.split('\n').filter(Boolean)
  : [];
const jobLogo =
  job?.logo && typeof job.logo === 'string'
    ? job.logo.startsWith('http')
      ? job.logo
      : `http://localhost:5000${job.logo}`
    : `https://via.placeholder.com/96?text=${job?.company?.charAt(0) || 'J'}`;
  const relatedJobs = useMemo(() => {
    if (!job) return [];
    return allJobs
      .filter((j) => j.id !== job.id && (j.type === job.type || j.company === job.company))
      .slice(0, 3);
  }, [job, allJobs]);
  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };
  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;
  if (!job) return notFound();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm py-4 px-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                aria-label="Back to job listings"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Jobs</span>
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-sm font-medium text-slate-900 capitalize">
                {job.category.replace(/-/g, ' ')}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">{job.title}</h1>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl">
              <div className="relative h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
              </div>
              <div className="relative px-8 pb-8">
                <div className="flex items-start gap-5 -mt-12 mb-6">
                  <div className="flex-1 pt-14">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2 sm:hidden">{job.title}</h1>
                    <div className="flex items-center gap-2 text-slate-600 mb-4">
                      <Building2 className="h-5 w-5" />
                      <span className="text-lg font-medium">{job.company}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl text-sm font-medium">
                        <Users className="h-4 w-4" />
                        {job.applicants} applicants
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300"
                        onClick={() => window.location.href = `/apply/${job.id}`}
                      >
                        Apply Now
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          savedJobs.has(job.id)
                            ? 'bg-blue-50 border-blue-600 text-blue-600'
                            : 'border-slate-300 text-slate-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        aria-label={savedJobs.has(job.id) ? 'Unsave job' : 'Save job'}
                      >
                        <Bookmark className={`h-5 w-5 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-2">
                  <div className="prose max-w-none">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 mb-6 border border-slate-200">
                      <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Filter className="h-5 w-5 text-blue-600" />
                        About this position
                      </h2>
                      <div className="text-slate-700 leading-relaxed space-y-3">
                        <div dangerouslySetInnerHTML={{ __html: job.description }} />
                        {job.description ? (
                          <p>
                            This role offers the opportunity to work with cutting-edge technologies and make a real impact in a dynamic team environment.
                          </p>
                        ) : (
                          <p>No description available.</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 mb-6 border border-slate-200">
                      <h2 className="text-lg font-bold text-slate-900 mb-3">Key Responsibilities</h2>
                  <ul className="space-y-2 text-slate-700">
  {responsibilities.length > 0 ? (
    responsibilities.map((resp, idx) => (
      <li key={idx} className="flex items-start gap-2">
        <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <span>{resp}</span>
      </li>
    ))
  ) : (
    <li className="text-slate-500">No responsibilities listed.</li>
  )}
</ul>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-xl p-6 border border-slate-200">
                      <h2 className="text-lg font-bold text-slate-900 mb-3">Requirements</h2>
<ul className="space-y-2 text-slate-700">
  {qualifications.length > 0 ? (
    qualifications.map((q, idx) => (
      <li key={idx} className="flex items-start gap-2">
        <ChevronRight className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <span>{q}</span>
      </li>
    ))
  ) : (
    <li className="text-slate-500">No requirements listed.</li>
  )}
</ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Related Jobs</h2>
              {relatedJobs.length > 0 ? (
                <div className="space-y-4">
                  {relatedJobs.map((relatedJob) => (
                    <div
                      key={relatedJob.id}
                      className="bg-slate-50 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
      {/* <Image
                          src={`http://localhost:5000/uploads/1756787652750.png`}
                          alt={`${relatedJob.company} logo`}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover border border-slate-200"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/40?text=${relatedJob.company.charAt(0)}`;
                          }}
                        /> */}
{/* <Image
  src={company.logo}
  alt={`${company.name} logo`}
  width={48}
  height={48}
  onError={(e) => {
    e.target.src = '/uploads/logos/default-logo.png';
  }}
/> */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 text-sm mb-1">
                            <Link
                              href={`/job/${relatedJob.id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {relatedJob.title}
                            </Link>
                          </h3>
                          <p className="text-slate-600 text-xs font-medium mb-2">{relatedJob.company}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {relatedJob.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />
                              {relatedJob.salary}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSaveJob(relatedJob.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            savedJobs.has(relatedJob.id)
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                          aria-label={savedJobs.has(relatedJob.id) ? 'Unsave job' : 'Save job'}
                        >
                          <Bookmark className={`h-4 w-4 ${savedJobs.has(relatedJob.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No related jobs found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
        }
      `}</style>
    </div>
  );
}