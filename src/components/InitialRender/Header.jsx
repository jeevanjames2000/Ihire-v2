'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import theme from '../../../theme.json';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

 
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        <motion.div className="flex items-center space-x-2">
          <div
            className={`w-10 h-10 ${theme.logo.bg} rounded-xl flex items-center justify-center`}
            style={{ backgroundColor: theme.logo.bg }}
          >
            <span className={`${theme.logo.text} font-bold text-lg`}>J</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text">I Hire</h1>
        </motion.div>
       
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" className={`${theme.buttons.ghost.text} ${theme.buttons.ghost.hoverText}`}>Jobs</Button>
          <Button variant="ghost" className={`${theme.buttons.ghost.text} ${theme.buttons.ghost.hoverText}`}>Companies</Button>
          <Button variant="ghost" className={`${theme.buttons.ghost.text} ${theme.buttons.ghost.hoverText}`}>Salary</Button>
        </nav>
        
       
          <div className="flex items-center space-x-4">
          <Button
            className={`bg-gradient-to-r ${theme.buttons.primary.bg} ${theme.buttons.primary.to} 
            hover:bg-gradient-to-r ${theme.buttons.primary.bgHover} ${theme.buttons.primary.toHover} 
            ${theme.buttons.primary.text}`}
          >
            login
          </Button>
          <Button
            className={`bg-gradient-to-r ${theme.buttons.primary.bg} ${theme.buttons.primary.to} 
            hover:bg-gradient-to-r ${theme.buttons.primary.bgHover} ${theme.buttons.primary.toHover} 
            ${theme.buttons.primary.text}`}
          >
            Register
          </Button>

          <Avatar className="cursor-pointer">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>











          {/* <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5 md:hidden" />
          </Button> */}
          <Link href="/recruit/login">
<Button
            className={`bg-gradient-to-r ${theme.buttons.primary.bg} ${theme.buttons.primary.to} 
            hover:bg-gradient-to-r ${theme.buttons.primary.bgHover} ${theme.buttons.primary.toHover} 
            ${theme.buttons.primary.text}`}
          >
         Recuriter
          </Button>
          </Link>

          
        </div>
        
      
          <div className="flex items-center space-x-4">
          <Avatar className="cursor-pointer">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5 md:hidden" />
          </Button>
        </div>
      
      </div>
      
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white border-t"
        >
          <nav className="flex flex-col space-y-4 p-4">
            <Button variant="ghost" className={`${theme.buttons.ghost.text} ${theme.buttons.ghost.hoverText} justify-start`}>Jobs</Button>
            <Button variant="ghost" className={`${theme.buttons.ghost.text} ${theme.buttons.ghost.hoverText} justify-start`}>Companies</Button>
            <Button variant="ghost" className={`${theme.buttons.ghost.text} ${theme.buttons.ghost.hoverText} justify-start`}>Salary</Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
