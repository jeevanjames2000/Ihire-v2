"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, LogIn } from "lucide-react"; // Added LogIn to imports
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const dynamic = 'force-dynamic';
export default function CandidateRegister() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/candidates/register", formData, {
        headers: { "Content-Type": "application/json" },
      });
        if (typeof window === 'undefined') return; // extra guard (not necessary in useEffect but safe)

      const { user, token } = response.data;
      // window.localStorage.setItem("token", token);
      // window.localStorage.setItem("userInfo", JSON.stringify({ ...user, token }));
      // window.localStorage.setItem("userType", "candidate");

      toast.success("Registration successful!");
      router.push("/candidate/profile");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-gray-100 via-white to-gray-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute w-72 h-72 bg-neutral-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 top-[-5%] left-[10%]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 bottom-[-10%] right-[5%]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl p-8 z-10"
      >
        <motion.div
          layoutId="accent-bar"
          className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gray-800 via-gray-600 to-black rounded-t-2xl"
        />

        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"
          >
            Join as a Candidate
          </motion.h1>
          <p className="text-gray-600 text-sm mt-2">
            Create your account to apply for jobs
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                <Input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500 text-center bg-red-50 border border-red-100 py-2 rounded-md"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-black to-gray-700 hover:from-gray-800 hover:to-black text-white rounded-xl py-2.5 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Registering...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Register
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                href="/candidateLogin"
                className="text-gray-900 hover:text-gray-700 font-semibold transition-colors"
              >
                Log In
              </Link>
            </div>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}