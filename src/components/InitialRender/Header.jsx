"use client";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import theme from '../../../theme.json';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/authSlice';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const dispatch=useDispatch()
const  auth=useSelector((state)=>state.auth)
useEffect(()=>{
setId(auth?.user?.id)
},[auth])

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        setMessage({ text: 'Logout successful!', type: 'success' });
        setTimeout(() => router.push('/login'), 1000); 
      })
      .catch((error) => {
        setMessage({ text: error || 'Logout failed', type: 'error' });
      });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div className="flex items-center space-x-2">
          <div
            className={`w-10 h-10 ${theme.logo?.bg || 'bg-blue-500'} rounded-xl flex items-center justify-center`}
            style={{ backgroundColor: theme.logo?.bg }}
          >
            <span className={`${theme.logo?.text || 'text-white'} font-bold text-lg`}>J</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text">I Hire</h1>
        </motion.div>

        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" className={`${theme.buttons?.ghost?.text || 'text-gray-700'} ${theme.buttons?.ghost?.hoverText || 'hover:text-blue-600'}`}>
            Jobs
          </Button>
          <Button variant="ghost" className={`${theme.buttons?.ghost?.text || 'text-gray-700'} ${theme.buttons?.ghost?.hoverText || 'hover:text-blue-600'}`}>
            Companies
          </Button>
          <Button variant="ghost" className={`${theme.buttons?.ghost?.text || 'text-gray-700'} ${theme.buttons?.ghost?.hoverText || 'hover:text-blue-600'}`}>
            Salary
          </Button>
        </nav>

        <div className=" hidden  md:flex items-center space-x-4 ">
          {id ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer bg-[gray]">
                  <AvatarFallback className=''>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[white] mt-4">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center  space-x-2">
                    <span className='text-[20px]  cursor-pointer'>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span className='text-[20px]  cursor-pointer'>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button
                className={`bg-gradient-to-r ${theme.buttons?.primary?.bg || 'from-blue-500'} ${theme.buttons?.primary?.to || 'to-blue-700'} 
                  hover:from-blue-600 hover:to-blue-800 ${theme.buttons?.primary?.text || 'text-white'}`}
              >
                Login
              </Button>
            </Link>
          )}

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
            <Link href ="/jobs">
            <Button
              variant="ghost"
              className={`${theme.buttons?.ghost?.text || 'text-gray-700'} ${theme.buttons?.ghost?.hoverText || 'hover:text-blue-600'} justify-start`}
            >
              Jobs
            </Button>
            </Link>
            <Link href ="/companies">
            <Button
              variant="ghost"
              className={`${theme.buttons?.ghost?.text || 'text-gray-700'} ${theme.buttons?.ghost?.hoverText || 'hover:text-blue-600'} justify-start`}
            >
              Companies
            </Button>
            </Link>
            <Link>
            <Button
              variant="ghost"
              className={`${theme.buttons?.ghost?.text || 'text-gray-700'} ${theme.buttons?.ghost?.hoverText || 'hover:text-blue-600'} justify-start`}
            >
              Salary
            </Button>
            </Link>
            <Link>
             <Button
              variant="ghost"
              className={`${theme.buttons?.ghost?.text || 'text-gray-700'} ${theme.buttons?.ghost?.hoverText || 'hover:text-blue-600'} justify-start`}
            >
              Profile
            </Button>
            </Link>
<Link>
             <Button
              variant="ghost"
              className={`${theme.buttons?.ghost?.text || 'text-gray-700'} ${theme.buttons?.ghost?.hoverText || 'hover:text-blue-600'} justify-start`}
            >
              Logout
            </Button>
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}