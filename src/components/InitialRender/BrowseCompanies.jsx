'use client';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import theme from '../../../theme.json';
export default function BrowseCompanies() {
  const router = useRouter();
  const [cachedCompanies, setCachedCompanies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const cacheKey = 'companies';
    if (typeof window === 'undefined') return;
    const cached = window.localStorage.getItem(cacheKey);
    if (cached) {
      setCachedCompanies(JSON.parse(cached));
      setLoading(false);
      return;
    }
    const fetchCompaniesAndJobs = async () => {
      try {
        const companiesRes = await fetch('http://localhost:5000/api/companies/getAllCompanies');
        if (!companiesRes.ok) throw new Error('Failed to fetch companies');
        const companiesData = await companiesRes.json();
        const jobsRes = await fetch('http://localhost:5000/api/jobs/getAllJobs');
        if (!jobsRes.ok) throw new Error('Failed to fetch jobs');
        const jobsData = await jobsRes.json();
        const companyJobCounts = new Map();
        (jobsData.jobs || []).forEach((job) => {
          if (companyJobCounts.has(job.company)) {
            companyJobCounts.set(job.company, companyJobCounts.get(job.company) + 1);
          } else {
            companyJobCounts.set(job.company, 1);
          }
        });
        const companies = companiesData.map((company) => {
          let logoUrl;
          if (company.logo_url) {
            logoUrl = company.logo_url;
          } else if (company.website) {
            const domain = company.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
            logoUrl = `https://logo.clearbit.com/${domain}`;
          } else {
            const domain = company.name.toLowerCase().replace(/\s+/g, '');
            logoUrl = `https://logo.clearbit.com/${domain}.com`;
          }
          return {
            id: company.id,
            name: company.name,
            logo: logoUrl,
            jobs: companyJobCounts.get(company.name) || 0,
            description: company.description || `Join ${company.name} to work on exciting projects!`,
            banner: company.banner_url || 'https://via.placeholder.com/1200x200?text=Company+Banner',
            about: company.description || `${company.name} is a leading company in its industry.`,
            location: company.location || 'Unknown Location',
            website: company.website || `https://${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
          };
        });
        setCachedCompanies(companies);
        window.localStorage.setItem(cacheKey, JSON.stringify(companies));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCompaniesAndJobs();
  }, []);
  const companies = useMemo(() => cachedCompanies || [], [cachedCompanies]);
  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-600">Loading companies...</div>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center text-red-600">Error: {error}</div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
        >
          Discover Top Companies
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.slice(0, 9).map((company, index) => (
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
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      width={48}
                      height={48}
                      className="object-contain"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/48x48?text=${company.name.charAt(0)}`;
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
        {companies.length > 9 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12"
          >
            <Button
              variant="default"
              className={`bg-gradient-to-r ${theme.buttons.secondary.bg} ${theme.buttons.secondary.to} hover:${theme.buttons.secondary.bgHover} hover:${theme.buttons.secondary.toHover} ${theme.buttons.secondary.text} px-8 py-3 text-lg font-semibold`}
              onClick={() => router.push('/companies/all')}
            >
              See All Companies
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}