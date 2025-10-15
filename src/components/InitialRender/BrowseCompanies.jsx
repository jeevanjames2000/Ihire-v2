'use client';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import jobData from '@/lib/database/jobs.json';
export default function BrowseCompanies() {
  const router = useRouter();
  const [cachedCompanies, setCachedCompanies] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const cacheKey = 'companies';
        if (typeof window === 'undefined') return; // extra guard (not necessary in useEffect but safe)

    const cached = window.localStorage.getItem(cacheKey);
    if (cached) {
      setCachedCompanies(JSON.parse(cached));
      setLoading(false);
    } else {
      const allJobs = Object.values(jobData).flat();
      const companyMap = new Map();
      allJobs.forEach((job) => {
        if (!companyMap.has(job.company)) {
          companyMap.set(job.company, {
            id: job.companyId || job.company.toLowerCase().replace(/\s+/g, '-'),
            name: job.company,
            logo: job.logo,
            jobs: 1,
            description: job.companyDescription || `Join ${job.company} to work on exciting projects!`,
            banner: job.companyBanner || 'https://via.placeholder.com/1200x200?text=Company+Banner',
            about: job.companyAbout || `${job.company} is a leading company in its industry, dedicated to innovation and excellence.`,
            location: job.companyLocation || job.location,
            website: job.companyWebsite || `https://${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
          });
        } else {
          const company = companyMap.get(job.company);
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
  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-600">Loading companies...</div>
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
                {}
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
        {companies.length > 9 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12"
          >
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
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