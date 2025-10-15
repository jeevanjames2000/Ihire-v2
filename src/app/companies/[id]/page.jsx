'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Briefcase, Bookmark, Building2, Globe, ArrowLeft, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Link from 'next/link';
import jobData from '@/lib/database/jobs.json';
export const dynamic = 'force-dynamic';
export default function CompanyProfile({ params }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [savedCompanies, setSavedCompanies] = useState(new Set());
  const [cachedCompanies, setCachedCompanies] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const cacheKey = 'companies';
        if (typeof window === 'undefined') return;
    const cached = window.localStorage.getItem(cacheKey);
    if (cached) {
      setCachedCompanies(JSON.parse(cached));
      setLoading(false);
    } else {
      const allJobs = Object.values(jobData).flat();
      const companyMap = new Map();
      allJobs.forEach((job) => {
        const companyId = job.companyId || job.company.toLowerCase().replace(/\s+/g, '-');
        if (!companyMap.has(companyId)) {
          companyMap.set(companyId, {
            id: companyId,
            name: job.company,
            logo: job.logo,
            banner: job.companyBanner || 'https://via.placeholder.com/1200x200?text=Company+Banner',
            description: job.companyDescription || `Join ${job.company} to work on exciting projects!`,
            about: job.companyAbout || `${job.company} is a leading company in its industry, dedicated to innovation and excellence.`,
            location: job.companyLocation || job.location,
            website: job.companyWebsite || `https://${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
            jobs: 1,
          });
        } else {
          const company = companyMap.get(companyId);
          company.jobs += 1;
        }
      });
      const companies = Array.from(companyMap.values());
      setCachedCompanies(companies);
      window.localStorage.setItem(cacheKey, JSON.stringify(companies));
      setLoading(false);
    }
  }, []);
  const companies = useMemo(() => cachedCompanies || [], [cachedCompanies]);
  const company = useMemo(() => {
    if (id === 'all') return null;
    return companies.find((c) => c.id === id);
  }, [id, companies]);
  const companyJobs = useMemo(() => {
    if (id === 'all') return [];
    return Object.values(jobData)
      .flat()
      .filter((j) => (j.companyId || j.company.toLowerCase().replace(/\s+/g, '-')) === id);
  }, [id]);
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
  const toggleSaveJob = (jobId) => {
    setSavedCompanies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };
  if (loading) {
    return (
      <section className="min-h-screen bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-600">Loading...</div>
        </div>
      </section>
    );
  }
  if (id === 'all') {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-16">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            All Companies
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => router.push(`/companies/${company.id}`)}
                className="cursor-pointer"
              >
                <Card className="relative h-full bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="flex items-center space-x-4 p-6">
                    <div className="w alternatelyw-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <Image
                        src={company.logo}
                        alt={`${company.name} logo`}
                        width={48}
                        height={48}
                        className="object-contain"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/48?text=${company.name.charAt(0)}`;
                        }}
                        unoptimized
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{company.location}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{company.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 text-sm flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> {company.jobs} Openings
                      </p>
                      <Button
                        variant="outline"
                        className="text-sm text-blue-600 border-blue-600 hover:bg-blue-50 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/companies/${company.id}`);
                        }}
                      >
                        View Jobs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (!company) return notFound();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm py-4 px-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/companies/all"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Back to companies"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Companies</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-sm font-medium text-gray-800">{company.name}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">{company.name}</h1>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-lg rounded-xl overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={company.banner}
                  alt={`${company.name} banner`}
                  fill
                  className="object-cover rounded-t-xl"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/1200x200?text=Company+Banner';
                  }}
                      unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <CardContent className="relative p-6">
                <div className="flex items-start gap-5 -mt-12 mb-6">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={80}
                    height={80}
                    className="rounded-xl object-cover border-4 border-white shadow-md bg-white"
                    unoptimized
                  />
                  <div className="flex-1 pt-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:hidden">{company.name}</h1>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium">
                        <MapPin className="h-4 w-4" />
                        {company.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium">
                        <Globe className="h-4 w-4" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          Website
                        </a>
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </Button>
                      <button
                        onClick={() => toggleSaveCompany(company.id)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          savedCompanies.has(company.id)
                            ? 'bg-blue-100 border-blue-600 text-blue-600'
                            : 'border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-100'
                        }`}
                        aria-label={savedCompanies.has(company.id) ? 'Unsave company' : 'Save company'}
                      >
                        <Bookmark className={`h-5 w-5 ${savedCompanies.has(company.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-2">
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h2 className="text-lg font-bold text-gray-800 mb-3">About {company.name}</h2>
                      <p className="text-gray-700 leading-relaxed">{company.about}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h2 className="text-lg font-bold text-gray-800 mb-3">Description</h2>
                      <p className="text-gray-700 leading-relaxed">{company.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-lg rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Current Openings</h2>
              {companyJobs.length > 0 ? (
                <div className="space-y-4">
                  {companyJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-6 w-6 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-sm mb-1">
                            <Link
                              href={`/jobs/${job.id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {job.title}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
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
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
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
                <p className="text-gray-600 text-sm">No open positions at this time.</p>
              )}
            </Card>
          </div>
        </div>
        <div className="text-center mt-12">
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={() => router.push('/companies/all')}
          >
            See All Companies
          </Button>
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