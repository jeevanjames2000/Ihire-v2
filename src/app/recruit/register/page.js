"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Building2, ArrowLeft, ArrowRight, Eye, EyeOff, X } from "lucide-react";
export const dynamic = 'force-dynamic';
export default function EmployerRegister() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "", password: "", designation: "" });
  const [companyData, setCompanyData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    pincode: "",
    state: "",
    industry: "",
    established_year: "",
    size: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Cleanup for URL.createObjectURL
  useEffect(() => {
    return () => {
      if (logoFile) URL.revokeObjectURL(URL.createObjectURL(logoFile));
      if (bannerFile) URL.revokeObjectURL(URL.createObjectURL(bannerFile));
    };
  }, [logoFile, bannerFile]);

  useEffect(() => {
    if (step === 1 && userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/recruiter/${userId}`);
          setUserData((prev) => ({
            ...prev,
            name: response.data.name || "",
            email: response.data.email || "",
            designation: response.data.designation || "",
          }));
          setIsUpdating(true);
        } catch (err) {
          console.error("Fetch user data error:", err);
          setError("Failed to fetch user data. Please try again.");
        }
      };
      fetchUserData();
    }
  }, [step, userId]);

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleCompanyChange = (e) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(files[0].type)) {
        setError("Please upload a valid image (JPEG, PNG, or GIF).");
        return;
      }
      if (name === "logo") {
        setLogoFile(files[0]);
      } else if (name === "banner") {
        setBannerFile(files[0]);
      }
    }
  };

  const handleCancelFile = (type) => {
    if (type === "logo") {
      setLogoFile(null);
      document.querySelector('input[name="logo"]').value = "";
    } else if (type === "banner") {
      setBannerFile(null);
      document.querySelector('input[name="banner"]').value = "";
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let response;
      if (isUpdating && userId) {
        response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/recruiter/update-user`, {
          userId,
          ...userData,
        });
      } else {
        response = await axios.post(`${ process.env.NEXT_PUBLIC_API_URL}/api/recruiter/register`, userData);
        setUserId(response.data.user?.id);
      }
      setStep(2);
      setIsUpdating(true);
     
    } catch (err) {
      console.error("User submit error:", err);
      setError(err.response?.data?.error || "Failed to submit user data. Please try again.");
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (!userId) {
        throw new Error("User ID is missing");
      }
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("name", companyData.name);
      formData.append("description", companyData.description);
      formData.append("website", companyData.website);
      formData.append("location", companyData.location);
      formData.append("pincode", companyData.pincode);
      formData.append("state", companyData.state);
      formData.append("industry", companyData.industry);
      formData.append("established_year", companyData.established_year);
      formData.append("size", companyData.size);
      if (logoFile) formData.append("logo", logoFile);
      if (bannerFile) formData.append("banner", bannerFile);

     const res= await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/recruiter/company`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { companyId, company,token } = res.data || {};
    if (token) {
        if (typeof window === 'undefined') return; // extra guard (not necessary in useEffect but safe)

      // window.localStorage.setItem("token", token);
    }
    
router.push("/recruiterDashboard");
    } catch (err) {
      console.error("Company submit error:", err);
      setError(err.response?.data?.error || err.message || "Failed to submit company data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-[#44a6b1] shadow-2xl py-0 gap-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#44a6b1] text-white p-6">
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <span className="bg-white text-[#44a6b1] rounded-full p-2">
              {step === 1 ? <User className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
            </span>
            Employer Registration
          </CardTitle>
          <div>
            <div className="flex justify-between bg-gray-200 p-1 rounded-full items-center">
              <button
                className={`w-1/2 py-1 text-md font-medium rounded-full ${
                  step === 1 ? "bg-blue-200 text-blue-900 border border-blue-300" : "bg-gray-200 text-gray-700"
                } transition-colors duration-200`}
                onClick={() => setStep(1)}
              >
                Employee Info
              </button>
              <button
                className={`w-1/2 py-1 text-md font-medium rounded-full ${
                  step === 2 ? "bg-blue-200 text-blue-900 border border-blue-300" : "bg-gray-200 text-gray-700"
                } transition-colors duration-200`}
                onClick={() => setStep(2)}
              >
                Company Profile
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleUserSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                      name="name"
                      value={userData.name}
                      onChange={handleUserChange}
                      required
                      className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 placeholder-gray-600 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                    <Input
                      name="designation"
                      value={userData.designation}
                      onChange={handleUserChange}
                      required
                      className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 placeholder-gray-600 transition-colors"
                      placeholder="HR Manager"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <Input
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleUserChange}
                    required
                    className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 placeholder-gray-600 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={userData.password}
                    onChange={handleUserChange}
                    required
                    className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 placeholder-gray-600 transition-colors pr-10"
                    placeholder="Enter a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-9 text-gray-500 hover:text-blue-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-[#44a6b1] hover:bg-[#44a6b1]/20 text-white transition-colors flex items-center justify-center gap-2"
                >
                  {isUpdating ? "Update" : "Next"} <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.form>
            )}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleCompanySubmit}
                className="space-y-6"
                encType="multipart/form-data"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <Input
                      name="name"
                      value={companyData.name}
                      onChange={handleCompanyChange}
                      required
                      className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 placeholder-gray-600 transition-colors"
                      placeholder="TechCorp Inc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Established Year</label>
                    <Input
                      name="established_year"
                      type="number"
                      value={companyData.established_year}
                      onChange={handleCompanyChange}
                      className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 placeholder-gray-600 transition-colors"
                      placeholder="2020"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <Input
                    name="description"
                    value={companyData.description}
                    onChange={handleCompanyChange}
                    className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 placeholder-gray-600 transition-colors"
                    placeholder="A leading tech company..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <Input
                    name="website"
                    value={companyData.website}
                    onChange={handleCompanyChange}
                    className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 placeholder-gray-600 transition-colors"
                    placeholder="https://techcorp.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Logo</label>
                  <Input
                    name="logo"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                    className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 text-gray-600 transition-colors"
                  />
                  {logoFile && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={URL.createObjectURL(logoFile)}
                        alt="Logo Preview"
                        className="w-[100px] h-[100px] object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleCancelFile("logo")}
                        className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Banner Image</label>
                  <Input
                    name="banner"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                    className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 text-gray-600 transition-colors"
                  />
                  {bannerFile && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={URL.createObjectURL(bannerFile)}
                        alt="Banner Preview"
                        className="w-[100px] h-[100px] object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleCancelFile("banner")}
                        className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <Input
                      name="location"
                      value={companyData.location}
                      onChange={handleCompanyChange}
                      className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 placeholder-gray-600 transition-colors"
                      placeholder="123 Business Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pincode</label>
                    <Input
                      name="pincode"
                      value={companyData.pincode}
                      onChange={handleCompanyChange}
                      className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 placeholder-gray-600 transition-colors"
                      placeholder="123456"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <Input
                      name="state"
                      value={companyData.state}
                      onChange={handleCompanyChange}
                      className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 placeholder-gray-600 transition-colors"
                      placeholder="California"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <Input
                      name="industry"
                      value={companyData.industry}
                      onChange={handleCompanyChange}
                      className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 placeholder-gray-600 transition-colors"
                      placeholder="Technology"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Size</label>
                  <Select
                    value={companyData.size}
                    onValueChange={(value) =>
                      handleCompanyChange({ target: { name: "size", value } })
                    }
                  >
                    <SelectTrigger className="mt-1 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 text-gray-600 transition-colors">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-50 text-gray-900 shadow-md">
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-200">51-200</SelectItem>
                      <SelectItem value="200+">200+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full sm:w-1/2 bg-gray-100 text-[#44a6b1] hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-1/2 bg-[#44a6b1] hover:bg-[#44a6b1]/20 text-white transition-colors flex items-center justify-center gap-2"
                  >
                    Submit <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>          
        </CardContent>
      </Card>
    </div>
  );
}