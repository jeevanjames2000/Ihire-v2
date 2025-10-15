'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Building2, Send } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export const dynamic = 'force-dynamic';

export default function ApplyJobPage({ params }) {
  const { id } =  React.use(params) || {};
  const router = useRouter();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    resume: null,
    coverLetter: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Invalid or missing job ID');
      setLoading(false);
      return;
    }

    async function fetchJob() {
      try {
        const jobUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/getJobById?id=${id}`;
        const res = await fetch(jobUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch job: ${res.statusText}`);
        }

        const jobData = await res.json();
        setJob({
          ...jobData,
          title: jobData.title || 'Untitled Job',
          company: jobData.company || 'Unknown Company',
          location: jobData.location || 'Not specified',
          salary: jobData.salary || 'Not specified',
          type: jobData.type || 'Not specified',
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Basic form validation
    if (!formData.fullName || !formData.email || !formData.resume) {
    
      setSubmitting(false);
      return;
    }

    try {
      // Simulate API call for job application submission
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('resume', formData.resume);
      formDataToSend.append('coverLetter', formData.coverLetter);
      formDataToSend.append('jobId', id);

      // Replace with actual API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/apply`, {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      

      // Redirect to job details page or home after submission
      router.push(`/job/${id}`);
    } catch (err) {
      console.error('Submission error:', err);
      
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
          <p className="text-red-600">{error || 'Job not found'}</p>
          <Button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sticky Navigation */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm py-4 px-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={`/job/${id}`}
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                aria-label="Back to job details"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Job</span>
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-sm font-medium text-slate-900">{job.title}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">Apply for {job.title}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-2xl border border-slate-200 shadow-xl">
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
                    </div>
                  </div>
                </div>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-2">
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Apply for this Position</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="fullName" className="text-slate-700 font-medium">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="mt-1 border-slate-300 focus:border-blue-600 focus:ring-blue-600 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-slate-700 font-medium">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="mt-1 border-slate-300 focus:border-blue-600 focus:ring-blue-600 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="resume" className="text-slate-700 font-medium">
                          Resume <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="resume"
                          name="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleInputChange}
                          className="mt-1 border-slate-300 focus:border-blue-600 focus:ring-blue-600 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="coverLetter" className="text-slate-700 font-medium">
                          Cover Letter (Optional)
                        </Label>
                        <Textarea
                          id="coverLetter"
                          name="coverLetter"
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          placeholder="Write your cover letter here..."
                          className="mt-1 border-slate-300 focus:border-blue-600 focus:ring-blue-600 rounded-xl"
                          rows={5}
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300"
                      >
                        {submitting ? 'Submitting...' : 'Submit Application'}
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Job Details</h2>
              <div className="space-y-4 text-slate-600">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span>{job.salary}</span>
                </div>
              </div>
              <Button
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl"
                onClick={() => router.push(`/job/${id}`)}
              >
                View Full Job Description
              </Button>
            </Card>
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