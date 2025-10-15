'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Briefcase, Building2, DollarSign, Clock, Code, BarChart3, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import jobCategories from '@/lib/database/categories.json';
import jobsData from '@/lib/database/jobs.json';
import { Zap, Settings, Package, Database, Server } from 'lucide-react';
import { setSearchTerm } from '@/store/SearchSlice';

export default function Hero() {
  const [searchTerm, setLocalSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const containerRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const commonActions = [
    { value: '/jobs', label: 'Jobs', icon: Briefcase },
    { value: '/companies', label: 'Companies', icon: Building2 },
    { value: '/profile', label: 'Profile', icon: DollarSign },
  ];

  const dynamicPlaceholders = [
    'React developer jobs in Hyderabad',
    'UI/UX designer jobs',
    'Data scientist jobs in Kolkata',
    'Full stack engineer jobs',
    'Product manager roles in Bangalore',
    'Software engineer at Google',
    'Marketing specialist opportunities',
    'Remote DevOps positions',
    'AI/ML engineer roles',
    'Frontend developer at Amazon',
    'Backend engineer jobs in Pune',
    'Digital marketing jobs',
    'Graphic designer opportunities',
    'Sales executive positions',
    'HR manager openings',
    'Finance analyst roles',
    'Internships for software developers',
    'Customer support jobs',
    'Content writer openings',
    'Project manager roles',
    'Blockchain developer jobs',
    'Cloud architect positions',
    'Cybersecurity analyst opportunities',
    'Data engineer roles at Microsoft',
    'Mobile app developer jobs',
    'SEO specialist openings',
    'Product designer jobs',
    'Business analyst positions',
    'Quality assurance engineer roles',
    'Remote software developer opportunities',
  ];

  const allJobs = Object.values(jobsData).flat();
  const allCompanies = [...new Set(allJobs.map((job) => job.company))];
  const iconMap = {
    Code,
    BarChart3,
    Zap,
    Users,
    TrendingUp,
    DollarSign,
    Settings,
    Package,
    Database,
    Server,
  };

  const addToHistory = (term) => {
    if (term && !searchHistory.includes(term)) {
      const newHist = [term, ...searchHistory].slice(0, 10);
      setSearchHistory(newHist);
      // window.localStorage.setItem('searchHistory', JSON.stringify(newHist));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(searchTerm));
    addToHistory(searchTerm);
    setOpen(false);
    router.push(`/jobs?search=${searchTerm}`);
  };

  const handleCommandSelect = (value) => {
    setOpen(false);
    if (value === '/jobs') {
      dispatch(setSearchTerm(''));
      router.push('/jobs');
    } else if (value === '/companies') {
      dispatch(setSearchTerm(''));
      router.push('/companies/all');
    } else if (value === '/profile') {
      dispatch(setSearchTerm(''));
      router.push('/profile');
    }
  };

  const handleSelect = (item) => {
    setLocalSearchTerm(item.value);
    dispatch(setSearchTerm(item.value));
    setOpen(false);
    router.push(`/jobs?search=${item.value}`);
  };

  const handleHistorySelect = (term) => {
    setLocalSearchTerm(term);
    dispatch(setSearchTerm(term));
    setOpen(false);
    router.push(`/jobs?search=${term}`);
  };

  const handleMarqueeClick = (item) => {
    setLocalSearchTerm(item);
    dispatch(setSearchTerm(item));
    setOpen(false);
    router.push(`/jobs?search=${item}`);
  };

const handleCategoryClick = (slug) => {
  // Ensure slug is clean (optional safety)
  const categoryKey = slug.toLowerCase().replace(/\s+/g, '-');

  setLocalSearchTerm(slug);
  dispatch(setSearchTerm(slug));
  setOpen(false);
  router.push(`/${categoryKey}-jobs?city=hyderabad`);
};


  useEffect(() => {
    const hist = window.localStorage.getItem('searchHistory');
    if (hist) {
      setSearchHistory(JSON.parse(hist));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % dynamicPlaceholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const filteredResults = (() => {
    if (!searchTerm) return [];
    const lowerSearch = searchTerm.toLowerCase();
    const filteredJobs = allJobs
      .filter(
        (job) =>
          job.title.toLowerCase().includes(lowerSearch) ||
          job.company.toLowerCase().includes(lowerSearch)
      )
      .slice(0, 5)
      .map((job) => ({
        value: job.title.toLowerCase(),
        label: `${job.title} at ${job.company}`,
        icon: Briefcase,
        type: 'job',
        key: `job-${job.id}`,
      }));
    const filteredCompanies = allCompanies
      .filter((company) => company.toLowerCase().includes(lowerSearch))
      .slice(0, 5)
      .map((company) => ({
        value: company.toLowerCase(),
        label: company,
        icon: Building2,
        type: 'company',
        key: `company-${company.toLowerCase()}`,
      }));
    return [...filteredJobs, ...filteredCompanies].slice(0, 10);
  })();

  const currentPlaceholder = dynamicPlaceholders[placeholderIndex];

  const variants = {
    open: { height: 'auto', opacity: 1 },
    closed: { height: 0, opacity: 0 },
  };

  return (
    <section className="relative pt-20 pb-25 bg-cover bg-center md:bg-[url('/BANNER3.png')] bg-[url('/MobileBanner.png')]">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 text-white"
        >
          Find Your Dream Job
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl text-slate-100 mb-12 max-w-2xl mx-auto"
        >
          Discover thousands of remote and hybrid opportunities with top companies. Start your search today.
        </motion.p>
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 p-1 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl"
        >
          <div ref={containerRef} className="relative flex-1">
            <div className="flex items-center w-full gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder={currentPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                    setLocalSearchTerm(e.target.value);
                    dispatch(setSearchTerm(e.target.value));
                  }}
                  onFocus={() => setOpen(true)}
                  className="pl-12 pr-4 py-6 text-lg border-none bg-transparent focus-visible:ring-0 rounded-2xl w-full"
                />
              </div>
              <Button
                type="submit"
                className="px-8 py-6 text-lg text-[#3a929d] hover:bg-[#3a929d] hover:text-white rounded-2xl flex items-center justify-center"
              >
                <Search className="mr-2 h-6 w-6" />
                Search Jobs
              </Button>
            </div>
            <motion.div
              layout
              variants={variants}
              initial={false}
              animate={open ? 'open' : 'closed'}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden relative left-0 right-0 z-10 bg-transparent"
            >
              <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar">
                {searchTerm.length === 0 ? (
                  <>
                    {searchHistory.length > 0 && (
                      <div className="mb-3">
                        <h3 className="px-3 py-1 text-xs font-semibold text-slate-900 uppercase tracking-wider">
                          Recent Searches
                        </h3>
                        <div className="space-y-1">
                          {searchHistory.slice(0, 3).map((term) => (
                            <button
                              key={term}
                              onClick={() => handleHistorySelect(term)}
                              className="w-full flex items-center px-3 py-3 text-sm text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                              <Clock className="mr-3 h-4 w-4 text-slate-500 flex-shrink-0" />
                              <div className="flex-1 text-left">
                                <span className="block">{term}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="px-3 py-1 text-xs font-semibold text-slate-900 uppercase tracking-wider">
                        Common actions
                      </h3>
                      <div className="space-y-1">
                        {commonActions.map((action) => (
                          <button
                            key={action.value}
                            onClick={() => handleCommandSelect(action.value)}
                            className="w-full flex items-center px-3 py-3 text-sm text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                          >
                            <action.icon className="mr-3 h-4 w-4 text-slate-500 flex-shrink-0" />
                            <div className="flex-1 text-left">
                              <span className="block">{action.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <h3 className="px-3 py-1 text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Search Results
                    </h3>
                    <div className="space-y-1">
                      {filteredResults.length > 0 ? (
                        filteredResults.map((item) => (
                          <button
                            key={item.key}
                            onClick={() => handleSelect(item)}
                            className="w-full flex items-center px-3 py-3 text-sm text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                          >
                            <item.icon className="mr-3 h-4 w-4 text-slate-500 flex-shrink-0" />
                            <div className="flex-1 text-left">
                              <span className="block">{item.label}</span>
                              <span className="text-xs text-slate-500 block">{item.type}</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-slate-500">
                          No results found for "{searchTerm}".
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 overflow-hidden relative w-full bg-transparent py-2"
        >
          <div className="marquee flex gap-8">
            {[
              'Google is hiring 50+ engineers',
              'Apple is hiring product managers',
              'Meta is hiring data scientists',
              'Microsoft is hiring UX designers',
              'Amazon is hiring full stack developers',
              'Tesla is hiring AI specialists',
              'Netflix is hiring frontend developers',
            ]
              .concat([
                'Google is hiring 50+ engineers',
                'Apple is hiring product managers',
                'Meta is hiring data scientists',
                'Microsoft is hiring UX designers',
                'Amazon is hiring full stack developers',
                'Tesla is hiring AI specialists',
                'Netflix is hiring frontend developers',
              ])
              .map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMarqueeClick(item)}
                  className="text-white text-sm font-medium px-4 py-1 bg-[#48adb9]/20 rounded-full whitespace-nowrap hover:bg-[#48adb9]/30 transition-colors"
                >
                  {item}
                </button>
              ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-2"
        >
          {jobCategories.map((category) => {
            const Icon = iconMap[category.icon];
            if (!Icon) return null;
            return (
              <button
                key={category.title}
                onClick={() => handleCategoryClick(category.slug)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
              >
                <Icon className="h-4 w-4" />
                <span>{category.title}</span>
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}