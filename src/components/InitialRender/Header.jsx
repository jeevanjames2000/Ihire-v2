'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Menu, User } from 'lucide-react'; // Install lucide-react: npm i lucide-react
import { motion } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-[#48adb9] rounded-xl flex items-center justify-center">
  <span className="text-white font-bold text-lg">J</span>
</div>

          <h1 className="text-2xl font-bold gradient-text">I Hire</h1>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900">Jobs</Button>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900">Companies</Button>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900">Salary</Button>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
         
         <Button className="bg-[#48adb9]  hover:from-emerald-500 hover:to-sage-600 text-white">
  Post Job
</Button>
          <Avatar className="cursor-pointer">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5 md:hidden" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white border-t"
        >
          <nav className="flex flex-col space-y-4 p-4">
            <Button variant="ghost" className="justify-start">Jobs</Button>
            <Button variant="ghost" className="justify-start">Companies</Button>
            <Button variant="ghost" className="justify-start">Salary</Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}