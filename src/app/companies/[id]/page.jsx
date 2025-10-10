'use client';
import React, { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Briefcase, Bookmark, Building2, Globe, ArrowLeft, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import jobData from '@/lib/database/jobs.json';
export default function CompanyProfile({ params }) {
   const { id } = React.use(params);
  const allJobs = Object.values(jobData).flat();
  const company = useMemo(() => {
    const job = allJobs.find((j) => (j.companyId || j.company.toLowerCase().replace(/\s+/g, '-')) === id);
    if (!job) return null;
    return {
      id: job.companyId || id,
      name: job.company,
      logo: job.logo,
      banner: job.companyBanner || 'https://via.placeholder.com/1200x200?text=Company+Banner',
      description: job.companyDescription || `Join ${job.company} to work on exciting projects!`,
      about: job.companyAbout || `${job.company} is a leading company in its industry, dedicated to innovation and excellence.`,
      location: job.companyLocation || job.location,
      website: job.companyWebsite || `https://${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
    };
  }, [id, allJobs]);
  const [savedCompanies, setSavedCompanies] = useState(new Set());
  const companyJobs = useMemo(() => {
    return allJobs.filter((j) => (j.companyId || j.company.toLowerCase().replace(/\s+/g, '-')) === id);
  }, [id, allJobs]);
  const toggleSaveCompany = (companyId) => {
    setSavedCompanies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  };
  if (!company) return notFound();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm py-4 px-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                aria-label="Back to companies"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Companies</span>
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-sm font-medium text-slate-900">{company.name}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">{company.name}</h1>
          </div>
        </div>
        {}
        <div className="grid lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl">
              {}
              <div className="relative h-48">
                <Image
                  src={'https://placehold.co/600x400?text=Company+Banner'}
                  alt={`${company.name} banner`}
                  layout="fill"
                  objectFit="cover"
                  unoptimized
                  className="rounded-t-2xl"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x400?text=Company+Banner';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="relative px-8 pb-8">
                {}
                <div className="flex items-start gap-5 -mt-12 mb-6">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={96}
                    height={96}
                    className="rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/600x400?text=${company.name.charAt(0)}`;
                    }}
                  />
                  <div className="flex-1 pt-14">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2 sm:hidden">{company.name}</h1>
                    <div className="flex items-center gap-2 text-slate-600 mb-4">
                      <Building2 className="h-5 w-5" />
                      <span className="text-lg font-medium">{company.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium">
                        <MapPin className="h-4 w-4" />
                        {company.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium">
                        <Globe className="h-4 w-4" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          Website
                        </a>
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300"
                        asChild
                      >
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </Button>
                      <button
                        onClick={() => toggleSaveCompany(company.id)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          savedCompanies.has(company.id)
                            ? 'bg-blue-50 border-blue-600 text-blue-600'
                            : 'border-slate-300 text-slate-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        aria-label={savedCompanies.has(company.id) ? 'Unsave company' : 'Save company'}
                      >
                        <Bookmark className={`h-5 w-5 ${savedCompanies.has(company.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
                {}
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-2">
                  <div className="prose max-w-none">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 mb-6 border border-slate-200">
                      <h2 className="text-lg font-bold text-slate-900 mb-3">About {company.name}</h2>
                      <p className="text-slate-700 leading-relaxed">{company.about}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 mb-6 border border-slate-200">
                      <h2 className="text-lg font-bold text-slate-900 mb-3">Description</h2>
                      <p className="text-slate-700 leading-relaxed">{company.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Current Openings</h2>
              {companyJobs.length > 0 ? (
                <div className="space-y-4">
                  {companyJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-slate-50 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-6 w-6 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 text-sm mb-1">
                            <Link
                              href={`/jobs/${job.id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {job.title}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />
                              {job.salary}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            savedCompanies.has(job.id)
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                          aria-label={savedCompanies.has(job.id) ? 'Unsave job' : 'Save job'}
                        >
                          <Bookmark className={`h-4 w-4 ${savedCompanies.has(job.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No open positions at this time.</p>
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
function toggleSaveJob(jobId) {
  console.log(`Toggling save for job ${jobId}`);
}