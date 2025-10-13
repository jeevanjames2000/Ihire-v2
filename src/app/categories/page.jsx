'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function CategoryPage({ params, searchParams }) {
  const { slug } = params; // category slug
  const city = searchParams.city || '';
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      console.log("Fetching jobs for slug:", slug, "and city:", city);

      try {
        const url = `http://localhost:5000/api/categories/${slug}?city=${city}`;
        console.log("Request URL:", url);

        const res = await fetch(url);

        console.log("Response status:", res.status);

        if (!res.ok) throw new Error('Failed to fetch jobs');

        const data = await res.json();
        console.log("Fetched jobs data:", data);

        setJobs(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [slug, city]);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Jobs in {slug.replace(/-/g, ' ')}</h2>
      {jobs.length === 0 && <p>No jobs found.</p>}
      <ul>
        {jobs.map((job) => (
          <li key={job.id} className="border p-4 mb-4 rounded shadow">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p>Location: {job.location}</p>
            <p>Salary: ${job.salary_min} - ${job.salary_max}</p>
            <p>Employment Type: {job.employment_type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
