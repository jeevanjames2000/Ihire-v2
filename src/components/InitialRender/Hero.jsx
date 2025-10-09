'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Briefcase, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm, 'in', location);
  };
  return (
    <section
      className="relative  pt-20 pb-32 bg-cover bg-center"
     style={{ backgroundImage: "url('/bg-imag2.jpeg')" }} 
    >
      
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
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Job title, keywords, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg border-none bg-transparent focus-visible:ring-0"
            />
          </div>
          <div className="relative flex-1 md:w-80">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Location (e.g., Remote, New York)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg border-none bg-transparent focus-visible:ring-0"
            />
          </div>
          <Button
            type="submit"
            className="w-full md:w-auto px-8 py-6 text-lg bg-[#48adb9] hover:bg-[#3a929d] text-white rounded-2xl"
          >
            <Search className="mr-1 h-8 w-8 font-bold" />
            Search Jobs
          </Button>
        </motion.form>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center space-x-12 mt-16 text-sm text-slate-100"
        >
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-[#48adb9]" />
            <span>50K+ Jobs</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>1M+</span>
            <span>Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Top Rated</span>
            <span>4.9/5</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
