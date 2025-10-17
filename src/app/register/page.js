"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/authSlice";

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ text: "", type: "" });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      return "Invalid email format";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e) => {
        setIsLoading(true)
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setMessage({ text: validationError, type: "error" });
      return;
    }


    setMessage({ text: "", type: "" });
    try {
      const result = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(result)) {
        setMessage({
          text: "Registration successful! Redirecting ...",
          type: "success",
        })
        router.push("/")
        setIsLoading(false)``
      } else if (registerUser.rejected.match(result)) {
        setMessage({ text: result.payload || "Registration failed", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Registration failed", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-gray-100 via-white to-gray-50 overflow-hidden">
      {/* Subtle floating shapes for depth */}
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

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl p-8 z-10"
      >
        {/* Accent line */}
        <motion.div
          layoutId="accent-bar"
          className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gray-800 via-gray-600 to-black rounded-t-2xl"
        />

        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"
          >
            Create Your Account
          </motion.h1>
          <p className="text-gray-600 text-sm mt-2">
            Register to access your employer dashboard
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
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                <Input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </label>
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

            {/* Message */}
            {message.text && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm text-center p-2 rounded ${
                  message.type === "success"
                    ? "text-green-600 bg-green-50 border border-green-100"
                    : "text-red-600 bg-red-50 border border-red-100"
                }`}
              >
                {message.text}
              </motion.p>
            )}

            {/* Submit Button */}
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

            {/* Login Link */}
            <div className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
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