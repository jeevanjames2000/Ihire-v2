'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
export const dynamic = 'force-dynamic';
export default function CategoryPage({ params:paramsPromise, searchParams }) {
   const params = use(paramsPromise);
  const slug = params?.slug;      
const search =useSearchParams()
const city =search.get("city")
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!slug) {
      setError('Invalid category');
      setLoading(false);
      return;
    }
    const fetchJobs = async () => {
      try {
        const url = `http://localhost:5000/api/categories/${slug}?city=${city}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchJobs();
  }, [slug, city]);
  const SkeletonLoader = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
  const formattedSlug = slug
    ? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Category';
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {city ? `${formattedSlug} Jobs in ${city}` : `${formattedSlug} Jobs`}
          </h1>
          {city && (
            <p className="mt-2 text-gray-600">
              Explore opportunities in {formattedSlug.toLowerCase()}
            </p>
          )}
        </header>
        {}
        {loading && <SkeletonLoader />}
        {}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
            <p className="font-semibold">Error: {error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchJobs();
              }}
              className="mt-3 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              aria-label="Retry fetching jobs"
            >
              Retry
            </button>
          </div>
        )}
        {}
        {!loading && !error && (
          <section>
            {jobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-lg text-gray-600">No jobs found for {formattedSlug}</p>
                <p className="text-gray-500 mt-2">
                  {city ? `Try a different city or category.` : 'Check back later for new listings.'}
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  aria-label="Return to homepage"
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <article
                    key={job.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    role="listitem"
                  >
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">{job.title}</h2>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {job.location || 'Not specified'}
                      </p>
                      <p className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.salary_min && job.salary_max
                          ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                          : 'Salary not specified'}
                      </p>
                      <p className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {job.employment_type || 'Not specified'}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/job/${job.id}`)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      aria-label={`View details for ${job.title}`}
                    >
                      View Details
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}