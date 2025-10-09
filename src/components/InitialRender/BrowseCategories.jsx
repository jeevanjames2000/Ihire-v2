'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Code, BarChart3, Users, Zap, DollarSign, TrendingUp, Package, Database, Server, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import React, { useMemo, useState, useEffect } from 'react';
import categoriesData from '@/lib/database/categories.json';

const iconMap = {
  Code,
  BarChart3,
  Users,
  Zap,
  DollarSign,
  TrendingUp,
  Package,
  Database,
  Server,
  Settings,
};

export default function BrowseCategories() {
  const router = useRouter();
  const [cachedCategories, setCachedCategories] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cacheKey = 'categories';
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setCachedCategories(JSON.parse(cached));
      setLoading(false);
    } else {
      setCachedCategories(categoriesData);
      localStorage.setItem(cacheKey, JSON.stringify(categoriesData));
      setLoading(false);
    }
  }, []);

  const categories = useMemo(() => {
    if (!cachedCategories) return [];
    return cachedCategories.map(cat => ({
      ...cat,
      Icon: iconMap[cat.icon] || Code,
    }));
  }, [cachedCategories]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading categories...</div>
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
          {categories.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => router.push(`/${cat.slug}-jobs?city=hyderabad`)}
              className="cursor-pointer"
            >
              <Card className="h-full border-none shadow-lg overflow-hidden group">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r ${cat.color}`}>
                    <cat.Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-800 group-hover:gradient-text transition-all duration-300">
                    {cat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500">{cat.jobs} Openings</p>
                  <Button variant="link" className={`p-0 h-auto text-[#48adb9] mt-2`}>
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