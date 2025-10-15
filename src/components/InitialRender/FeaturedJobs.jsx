'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Briefcase } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import theme from '../../../theme.json';
import { useRouter } from 'next/navigation';

export default function FeaturedJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs/getAllJobs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }
        const data = await response.json();
        setJobs(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          Featured Jobs
        </motion.h2>
        <div className="grid md:grid-cols-4 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => router.push(`/job/${job.id}`)}
              className="cursor-pointer"
            >
              <Card className="h-full border-none shadow-lg overflow-hidden group">
                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    {/* <Image
                      src={job.logo || '/default-logo.png'}
                      alt={`${job.company} logo`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    /> */}
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      {job.company}
                    </CardTitle>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:gradient-text transition-all duration-300">
                    {job.title}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {job.type}
                  </div>
                  <p className="text-slate-500 text-sm">{job.description}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/job/${job.id}`);
                    }}
                    className={`w-full bg-gradient-to-r ${theme.buttons.primary.bg} ${theme.buttons.primary.to} hover:${theme.buttons.primary.bgHover} hover:${theme.buttons.primary.toHover} ${theme.buttons.primary.text}`}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}