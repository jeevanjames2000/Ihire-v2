'use client';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    const cached = localStorage.getItem(cacheKey);
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
      localStorage.setItem(cacheKey, JSON.stringify(companies));
      setLoading(false);
    }
  }, []);
  const companies = useMemo(() => cachedCompanies || [], [cachedCompanies]);
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading companies...</div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
        >
          Browse by Companies
        </motion.h2>
        <motion.div
          className="grid md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {companies.slice(0, 8).map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => router.push(`/companies/${company.id}`)}
              className="cursor-pointer"
            >
              <Card className="h-full border-none shadow-lg overflow-hidden group">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      width={40}
                      height={40}
                      className="rounded-lg object-contain"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/40?text=${company.name.charAt(0)}`;
                      }}
                    />
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-800 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {company.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> {company.jobs} Openings
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-[#48adb9] mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/companies/${company.id}`);
                    }}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}