'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Code, BarChart3, Users, Zap, DollarSign, TrendingUp, Package, Database, Server, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import theme from '../../../theme.json';
const iconMap = { Code, BarChart3, Users, Zap,  TrendingUp, Package, Database, Server, Settings };
const iconsList = [Code, BarChart3, Users, Zap,  TrendingUp, Package, Database, Server];
const gradientColors = [
  'from-blue-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-yellow-500 to-orange-600',
  'from-green-500 to-emerald-600',
  'from-purple-500 to-violet-600',
  'from-red-500 to-pink-600',
  'from-teal-500 to-cyan-600',
  'from-indigo-500 to-purple-600',
  'from-orange-500 to-red-600',
  'from-gray-400 to-gray-500'
];
export default function BrowseCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        const categoriesWithIcons = data.map((cat) => {
          const slug = cat.name.toLowerCase().replace(/\s+/g, '-');
          const IconComponent = cat.icon && iconMap[cat.icon] ? iconMap[cat.icon] : iconsList[Math.floor(Math.random() * iconsList.length)];
          const color = cat.color || gradientColors[Math.floor(Math.random() * gradientColors.length)];
          return {
            ...cat,
            slug,
            title: cat.name,
            color,
            icon: IconComponent,
            jobs: cat.job_count || '0',
          };
        });
        setCategories(categoriesWithIcons);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading categories...</div>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">Error: {error}</div>
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
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          Browse by Category
        </motion.h2>
        <motion.div
          className="grid md:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {categories.slice(0,6).map((cat) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
               onClick={() => router.push(`/${cat.slug}-jobs?city=hyderabad`)}
              className="cursor-pointer"
            >
              <Card className="h-full border-none shadow-lg overflow-hidden group">
                <CardHeader className="pb-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r ${cat.color}`}>
                    <cat.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-800 group-hover:gradient-text transition-all duration-300">
                    {cat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500">{cat.jobs} Openings</p>
                  <Button variant="link" className="p-0 h-auto text-[#48adb9] mt-2">
                    Explore
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
  {categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-12"
            >
              <Button
                variant="default"
                            className={`bg-gradient-to-r ${theme.buttons.secondary.bg} ${theme.buttons.secondary.to} hover:${theme.buttons.secondary.bgHover} hover:${theme.buttons.secondary.toHover} ${theme.buttons.secondary.text} px-8 py-3 text-lg font-semibold`}
                onClick={() => router.push('/all-jobs')}
              >
                See All Categories
              </Button>
            </motion.div>
          )}
    </section>
  );
}