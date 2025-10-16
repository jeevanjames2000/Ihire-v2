'use client';
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
  Users,
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import ApplyJobModal from '@/components/ui/ApplyJobModal';
export const dynamic = 'force-dynamic';
const CompanyLogo = ({ company, className, height = 100, width = 100 }) => {
  const [error, setError] = useState(false);
  const logoUrl = `https://logo.clearbit.com/${company?.replace(/\s+/g, '').toLowerCase()}.com`;
  const placeholderUrl = `https://placehold.co/96x96?text=${company?.charAt(0).toUpperCase() || 'C'}`;
  return (
    <Image
      src={error ? placeholderUrl : logoUrl}
      alt={company || 'Company'}
      height={height}
      width={width}
      className={className}
      onError={() => setError(true)}
      unoptimized
      loading="lazy"
    />
  );
};
export default function JobListings({ params }) {
  const { slug } = React.use(params) || {};
  const searchParams = useSearchParams();
  const router = useRouter();
  const subcategory = searchParams.get('subcategory');
  const search = searchParams.get('search') || '';
  console.log("search: ", search);
  const cleanSlug = slug ? slug.replace('-jobs', '') : 'all';
  console.log("cleanSlug: ", cleanSlug);
  const [jobs, setJobs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(search);
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const stripHtmlTags = (text) => {
    if (!text) return '';
    return text.replace(/<\/?(p|b|i|strong|em|ul|li|br)\b[^>]*>/gi, '').trim();
  };
  const parseSalary = (job) => {
    if (job.salary_min && job.salary_max) {
      return job.salary_min / 100000;
    } else if (job.salary) {
      const cleanSalary = job.salary.replace(/[^\d-]/g, '');
      const rangeMatch = cleanSalary.match(/(\d+)-(\d+)/);
      const singleMatch = cleanSalary.match(/(\d+)/);
      if (rangeMatch) {
        return parseInt(rangeMatch[1]) / 100000;
      } else if (singleMatch) {
        return parseInt(singleMatch[1]) / 100000;
      }
    }
    return 0;
  };
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const now = new Date();
      const date = new Date(timestamp);
      const diffMs = now - date;
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      if (diffSeconds < 60) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch (error) {
      console.error('Invalid timestamp:', timestamp);
      return 'Just now';
    }
  };
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5000/api/jobs/getJobsBySearch';
        let queryParams = [];
        if (cleanSlug !== 'all' && cleanSlug !== 'jobs' && !search) {
          const category = cleanSlug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          queryParams.push(`query=${encodeURIComponent(category)}`);
        } else if (search) {
          queryParams.push(`query=${encodeURIComponent(search)}`);
        }
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }
        const data = await response.json();
        setJobs(data.jobs || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setLoading(false);
      }
    };
    fetchJobs();
  }, [cleanSlug, search]);
  useEffect(() => {
    setSearchQuery(search);
  }, [search]);
  const filteredJobs = useMemo(() => {
    return jobs
      .map((job) => {
        let description = job.description || 'No description available';
        if (job.description && job.description.startsWith('{')) {
          try {
            const parsed = JSON.parse(job.description);
            description = parsed.summary ? stripHtmlTags(parsed.summary) : 'No description available';
          } catch (e) {
            console.error('Failed to parse description:', job.description, e);
          }
        } else {
          description = stripHtmlTags(job.description);
        }
        return {
          ...job,
          description,
          slug: job.title.toLowerCase().replace(/\s+/g, '-'),
        };
      })
      .filter((job) => {
        const keywords = searchQuery.toLowerCase().split(/\s+/).filter(k => k);
        const matchesSearch = !searchQuery || keywords.some(keyword =>
          job.title.toLowerCase().includes(keyword) ||
          job.company.toLowerCase().includes(keyword) ||
          job.description.toLowerCase().includes(keyword)
        );
        const matchesType = filterType === 'all' || job.type === filterType;
        const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase());
        const matchesSubcategory = !subcategory || job.subcategory?.toLowerCase().replace(/\s+/g, '-') === subcategory.toLowerCase().replace(/\s+/g, '-');
        let matchesSalary = true;
        if (salaryRange !== 'all') {
          const minSalary = parseSalary(job);
          if (salaryRange === '0-10') matchesSalary = minSalary >= 0 && minSalary <= 10;
          else if (salaryRange === '10-20') matchesSalary = minSalary > 10 && minSalary <= 20;
          else if (salaryRange === '20-50') matchesSalary = minSalary > 20 && minSalary <= 50;
          else if (salaryRange === '50-100') matchesSalary = minSalary > 50 && minSalary <= 100;
          else if (salaryRange === '50+') matchesSalary = minSalary > 50;
          else if (salaryRange === '0-20') matchesSalary = minSalary <= 20;
          else if (salaryRange === '100+') matchesSalary = minSalary > 100;
        }
        return matchesSearch && matchesType && matchesLocation && matchesSalary && matchesSubcategory;
      });
  }, [jobs, searchQuery, filterType, filterLocation, salaryRange, subcategory]);
  useEffect(() => {
    if (filteredJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(filteredJobs[0].id);
    } else if (filteredJobs.length === 0) {
      setSelectedJobId(null);
    }
  }, [filteredJobs, selectedJobId]);
  const uniqueTypes = useMemo(() => [...new Set(jobs.map(job => job.type))], [jobs]);
  const uniqueLocations = useMemo(() => [...new Set(jobs.map(job => job.location))], [jobs]);
  const uniqueSubcategories = useMemo(() => [...new Set(jobs.map(job => job.subcategory))], [jobs]);
  const selectedJob = useMemo(
    () => filteredJobs.find(job => job.id === selectedJobId) || jobs.find(job => job.id === selectedJobId),
    [selectedJobId, filteredJobs, jobs]
  );
  console.log("selectedJob: ", selectedJob);
  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterLocation('');
    setSalaryRange('all');
    const url = new URL(window.location);
    url.searchParams.delete('search');
    url.searchParams.delete('subcategory');
    window.history.pushState({}, '', url);
  };
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    const url = new URL(window.location);
    if (value) {
      url.searchParams.set('search', value);
    } else {
      url.searchParams.delete('search');
    }
    window.history.pushState({}, '', url);
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
  const hasActiveFilters = searchQuery || filterType !== 'all' || filterLocation || salaryRange !== 'all' || subcategory;
  const pageTitle = search
    ? `Search: ${search}`
    : cleanSlug === 'all' || cleanSlug === 'jobs'
      ? 'All Jobs'
      : `${cleanSlug.replace(/-/g, ' ')} Jobs${subcategory ? ` - ${subcategory.replace(/-/g, ' ')}` : ''}`;
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
          <p className="text-slate-600">
            No jobs found for this category{subcategory ? ` or subcategory` : ''}.
          </p>
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
  {cleanSlug === 'all'
    ? 'All Jobs'
    : cleanSlug === 'jobs'
    ? 'Jobs'
    : `${cleanSlug.replace(/-/g, ' ')} Jobs`}
  {subcategory ? ` - ${subcategory.replace(/-/g, ' ')}` : ''}
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
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm"
              />
            </div>
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
                <option value="0-10">₹0L - ₹10L</option>
                <option value="10-20">₹10L - ₹20L</option>
                <option value="20-50">₹20L - ₹50L</option>
                <option value="50-100">₹50L - ₹1Cr</option>
                <option value="50+">₹50L+</option>
                <option value="0-20">Under ₹20L</option>
                <option value="100+">₹1Cr+</option>
              </select>
              <select
                value={subcategory || 'all'}
                onChange={(e) => {
                  const value = e.target.value === 'all' ? '' : e.target.value;
                  const url = new URL(window.location);
                  if (value) url.searchParams.set('subcategory', value);
                  else url.searchParams.delete('subcategory');
                  window.history.pushState({}, '', url);
                }}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Subcategories</option>
                {uniqueSubcategories.map(sub => (
                  <option key={sub} value={sub.toLowerCase().replace(/\s+/g, '-')}>{sub}</option>
                ))}
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
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[400px]">
                <p className="text-slate-600 text-lg font-medium mb-4">No jobs found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors text-sm font-medium flex items-center gap-2"
                  aria-label="Reset all filters"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job, index) => (
                <div
                  key={job.id || index}
                  onClick={() => setSelectedJobId(job.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedJobId(job.id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`group bg-white rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 animate-fade-in focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    selectedJobId === job.id
                      ? 'border-blue-600 shadow-lg ring-2 ring-blue-100 bg-gradient-to-br from-blue-50 to-white'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="relative flex-shrink-0">
                          <CompanyLogo
                            company={job.company}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                          />
                          {index < 3 && (
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {job.title || 'Untitled Job'}
                          </h3>
                          <p className="text-slate-500 text-sm font-medium">{job.company || 'Unknown Company'}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job.id);
                        }}
                        className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          savedJobs.has(job.id)
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                        aria-label={savedJobs.has(job.id) ? 'Unsave job' : 'Save job'}
                      >
                        <svg
                          className={`h-5 w-5 ${savedJobs.has(job.id) ? 'fill-current' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                          {job.location || 'Remote'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formatTimeAgo(job.updated_at) || 'Just now'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {job.description || 'No description available.'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                          {job?.salary || 'Salary not disclosed'}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                          {job?.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="lg:col-span-3">
            {selectedJob ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl sticky top-0 overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                </div>
                <div className="relative px-8 pb-6">
                  <div className="flex items-start gap-5 -mt-12 mb-6">
                    <CompanyLogo
                      company={selectedJob.company}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200"
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
                        <button
                        onClick={() => setIsModalOpen(true)}
                         className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300">
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
                            <span>{selectedJob.responsibilities || 'Collaborate with cross-functional teams to deliver high-quality solutions'}</span>
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
        {selectedJob && (
  <ApplyJobModal
    jobId={selectedJob.id}
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
  />
)}

    </div>
  );
}