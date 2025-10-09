'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Code, BarChart3, Users, Zap } from 'lucide-react';
import { Button } from '../ui/button';

const categories = [
  { title: 'Software Engineering', icon: Code, color: 'from-blue-500 to-indigo-600', jobs: '12K+' },
  { title: 'Marketing & Sales', icon: BarChart3, color: 'from-pink-500 to-rose-600', jobs: '8K+' },
  { title: 'Design & Creative', icon: Zap, color: 'from-yellow-500 to-orange-600', jobs: '5K+' },
  { title: 'HR & Operations', icon: Users, color: 'from-green-500 to-emerald-600', jobs: '3K+' },
];

export default function BrowseCategories() {
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
        <div className="grid md:grid-cols-4 gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="h-full border-none shadow-lg overflow-hidden group">
                  <CardHeader className="pb-4">
                    <div
    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r ${cat.color} transition-all duration-300`}
  >
    <Icon className="h-6 w-6 text-white" />
  </div>
                    <CardTitle className="text-xl font-semibold text-slate-800 group-hover:gradient-text transition-all duration-300">
                      {cat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500">{cat.jobs} Openings</p>
                    <Button variant="link" className="p-0 h-auto text-blue-500 hover:text-blue-600 mt-2">
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}