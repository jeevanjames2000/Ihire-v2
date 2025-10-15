"use client"
import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Briefcase,
  Search,
  X,
  Building2,
  ChevronRight,
  DollarSign,
  Filter,
  SlidersHorizontal,
  Bookmark,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import jobData from '@/lib/database/jobs.json';
export const dynamic = 'force-dynamic';
export default function JobListings({ params }) {
  const { slug } =  React.use(params);
  const cleanSlug = slug ? slug.replace('-jobs', '') : '';
  const [cachedJobs, setCachedJobs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  useEffect(() => {
  const cacheKey = `jobs_${cleanSlug}`;
        if (typeof window === 'undefined') return;
  const cached = window.localStorage.getItem(cacheKey);
    let jobsToLoad = [];
    if (cleanSlug === 'jobs') {
      jobsToLoad = Object.values(jobData).flat();
    } else {
      jobsToLoad = jobData[cleanSlug] || [];
    }
    setCachedJobs(jobsToLoad);
    if (jobsToLoad.length > 0) setSelectedJobId(jobsToLoad[0].id);
    window.localStorage.setItem(cacheKey, JSON.stringify(jobsToLoad));
    setLoading(false);
}, [cleanSlug]);
  const jobs = useMemo(() => cachedJobs || [], [cachedJobs]);
  const uniqueTypes = useMemo(() => [...new Set(jobs.map(job => job.type))], [jobs]);
  const uniqueLocations = useMemo(() => [...new Set(jobs.map(job => job.location))], [jobs]);
  const uniqueCompanies = useMemo(() => [...new Set(jobs.map(job => job.company))], [jobs]);
  const parseSalary = (salary) => {
    const match = salary.match(/\$(\d+)k/);
    return match ? parseInt(match[1]) : 0;
  };
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || job.type === filterType;
      const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase());
      let matchesSalary = true;
      if (salaryRange !== 'all') {
        const minSalary = parseSalary(job.salary);
        if (salaryRange === '0-100') matchesSalary = minSalary < 100;
        else if (salaryRange === '100-150') matchesSalary = minSalary >= 100 && minSalary < 150;
        else if (salaryRange === '150+') matchesSalary = minSalary >= 150;
      }
      return matchesSearch && matchesType && matchesLocation && matchesSalary;
    });
  }, [jobs, searchQuery, filterType, filterLocation, salaryRange]);
  const selectedJob = useMemo(() =>
    filteredJobs.find(job => job.id === selectedJobId) || jobs.find(job => job.id === selectedJobId),
    [selectedJobId, filteredJobs, jobs]
  );
  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterLocation('');
    setSalaryRange('all');
  };
  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };
  const hasActiveFilters = searchQuery || filterType !== 'all' || filterLocation || salaryRange !== 'all';
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }
  if (!jobs.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">No jobs found for this category.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
       <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 capitalize">
        {cleanSlug === 'jobs'
      ? "" : cleanSlug.replace(/-/g, ' ')} Jobs
      </h1>
      <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        {filteredJobs.length} opportunities available
      </p>
    </div>
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors text-sm"
    >
      <SlidersHorizontal className="h-4 w-4" />
      Filters
    </button>
  </div>
  <div className="flex flex-wrap items-center gap-2">
    {}
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search jobs, companies, or keywords..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm"
      />
    </div>
    {}
    <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-wrap gap-2`}>
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="all">All Job Types</option>
        {uniqueTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      <select
        value={salaryRange}
        onChange={(e) => setSalaryRange(e.target.value)}
        className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="all">All Salaries</option>
        <option value="0-100">Under $100k</option>
        <option value="100-150">$100k - $150k</option>
        <option value="150+">$150k+</option>
      </select>
      <input
        type="text"
        placeholder="Location"
        value={filterLocation}
        onChange={(e) => setFilterLocation(e.target.value)}
        list="locations"
        className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[150px]"
      />
      <datalist id="locations">
        {uniqueLocations.map(loc => (
          <option key={loc} value={loc} />
        ))}
      </datalist>
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-colors text-sm border border-slate-200"
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  </div>
</div>
      </div>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-3 lg:max-h-[150vh] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
            {filteredJobs.map((job, index) => (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`group bg-white rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 animate-fade-in ${
                  selectedJobId === job.id
                    ? 'border-blue-600 shadow-lg ring-2 ring-blue-100 bg-gradient-to-br from-blue-50 to-white'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="relative">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-slate-200"
                          onError={(e) => {
                            const target = e.target ;
                            target.src = 'https://via.placeholder.com/56?text=' + job.company.charAt(0);
                          }}
                        />
                        {index < 3 && (
                          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-base mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-slate-600 text-sm font-medium mb-2">{job.company}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveJob(job.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        savedJobs.has(job.id)
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        2d ago
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                        <DollarSign className="h-3 w-3 mr-0.5" />
                        {job.salary}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                        {job.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-3">
            {selectedJob ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl sticky top-0 overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                </div>
                <div className="relative px-8 pb-6">
                  <div className="flex items-start gap-5 -mt-12 mb-6">
                    <img  
                      src={selectedJob.logo}
                      alt={selectedJob.company}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                      onError={(e) => {
                        const target = e.target ;
                        target.src = 'https://via.placeholder.com/96?text=' + selectedJob.company.charAt(0);
                      }}
                    />
                    <div className="flex-1 pt-14">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {selectedJob.title}
                      </h2>
                      <div className="flex items-center gap-2 text-slate-600 mb-4">
                        <Building2 className="h-5 w-5" />
                        <span className="text-lg font-medium">{selectedJob.company}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium">
                          <MapPin className="h-4 w-4" />
                          {selectedJob.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium">
                          <Briefcase className="h-4 w-4" />
                          {selectedJob.type}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
                          <DollarSign className="h-4 w-4" />
                          {selectedJob.salary}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl text-sm font-medium">
                          <Users className="h-4 w-4" />
                          15 applicants
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300">
                          Apply Now
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => toggleSaveJob(selectedJob.id)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            savedJobs.has(selectedJob.id)
                              ? 'bg-blue-50 border-blue-600 text-blue-600'
                              : 'border-slate-300 text-slate-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <Bookmark className={`h-5 w-5 ${savedJobs.has(selectedJob.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-[calc(100vh)] overflow-y-auto custom-scrollbar pr-2">
                    <div className="prose max-w-none">
                      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 mb-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <Filter className="h-5 w-5 text-blue-600" />
                          About this position
                        </h3>
                        <div className="text-slate-700 leading-relaxed space-y-3">
                          <p>{selectedJob.description}</p>
                          <p>We are looking for a talented professional to join our team and help drive innovation. This role offers the opportunity to work with cutting-edge technologies and make a real impact.</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 mb-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">Key Responsibilities</h3>
                        <ul className="space-y-2 text-slate-700">
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>Collaborate with cross-functional teams to deliver high-quality solutions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>Take ownership of projects from conception to deployment</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>Mentor junior team members and promote best practices</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>Stay updated with the latest industry trends and technologies</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements</h3>
                        <ul className="space-y-2 text-slate-700">
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>3+ years of relevant experience</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Strong problem-solving and analytical skills</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Excellent communication and teamwork abilities</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Bachelor's degree in related field or equivalent experience</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Select a job to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
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