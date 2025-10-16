"use client";
import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import {Input} from "../../components/ui/input"
import { useRouter } from 'next/navigation';
import theme from '../../../theme.json';
import Link from 'next/link';
import { registerUser } from "../../store/authSlice"
const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' }); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ text: '', type: '' }); 
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) return 'Invalid email format';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setMessage({ text: validationError, type: 'error' });
      return;
    }

    setMessage({ text: '', type: '' });
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      setMessage({ text: 'Registration successful! Redirecting to login...', type: 'success' });
      setTimeout(() => router.push('/login'), 2000); 
    } else if (registerUser.rejected.match(result)) {
      setMessage({ text: result.payload || 'Registration failed', type: 'error' });
    }
  };

  return (
    <div className="flex flex-col space-y-4 max-w-md mx-auto bg-white shadow-2xl p-4 rounded">
      <div className="flex flex-col justify-center items-center min-h-[90vh] bg-gray-100">
        <h2 className="text-lg font-semibold text-center">Register</h2>
        {message.text && (
          <div className={`text-sm text-center p-2 rounded ${message.type === 'success' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
        
          <div className="flex justify-center items-center">
            <Button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${theme.buttons?.primary?.bg || 'from-blue-500'} ${theme.buttons?.primary?.to || 'to-blue-700'} 
                 ${theme.buttons?.primary?.text || 'text-white'}`}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </div>
          <div className="text-center text-sm">
            <Link href="/login" className="text-blue-600 hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;