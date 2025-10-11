"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { User, Building2, ArrowLeft, ArrowRight } from "lucide-react";

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
  const router = useRouter();

  useEffect(() => {
    if (step === 1 && userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/employer/${userId}`);
          setUserData((prev) => ({
            ...prev,
            name: response.data.name,
            email: response.data.email,
            designation: response.data.designation,
          }));
          setIsUpdating(true);
        } catch (err) {
          console.error('Fetch user data error:', err);
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
    if (name === "logo") {
      setLogoFile(files[0]);
    } else if (name === "banner") {
      setBannerFile(files[0]);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let response;
      if (isUpdating && userId) {
        response = await axios.patch("http://localhost:5000/api/employer/update-user", {
          userId,
        ...userData
        });
      } else {
        response = await axios.post("http://localhost:5000/api/employer/register", userData);
        console.log('Register response:', response.data); // Debug: Log response
        setUserId(response.data.user.id);
      }
      setStep(2);
      setIsUpdating(true);
    } catch (err) {
      console.error('User submit error:', err);
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      console.log('Submitting company form with userId:', userId); // Debug: Log userId
      if (!userId) {
        throw new Error('User ID is missing');
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

      const response = await axios.post("http://localhost:5000/api/employer/company", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/success");
    } catch (err) {
      console.error('Company submit error:', err);
      setError(err.response?.data?.error || err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-lg shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-indigo-600 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            {step === 1 ? <User className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
            Employer Registration
          </CardTitle>
          <Progress value={step === 1 ? 50 : 100} className="mt-4 h-2" />
          <p className="text-sm text-center mt-2">Step {step} of 2</p>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <Input
                    name="name"
                    value={userData.name}
                    onChange={handleUserChange}
                    required
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <Input
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleUserChange}
                    required
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Input
                    name="password"
                    type="password"
                    value={userData.password}
                    onChange={handleUserChange}
                    required
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Designation</label>
                  <Input
                    name="designation"
                    value={userData.designation}
                    onChange={handleUserChange}
                    required
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter your designation (e.g., HR Manager)"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <Input
                    name="name"
                    value={companyData.name}
                    onChange={handleCompanyChange}
                    required
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <Input
                    name="description"
                    value={companyData.description}
                    onChange={handleCompanyChange}
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Describe your company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <Input
                    name="website"
                    value={companyData.website}
                    onChange={handleCompanyChange}
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Logo</label>
                  <Input
                    name="logo"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Banner Image</label>
                  <Input
                    name="banner"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <Input
                    name="location"
                    value={companyData.location}
                    onChange={handleCompanyChange}
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter company location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pincode</label>
                  <Input
                    name="pincode"
                    value={companyData.pincode}
                    onChange={handleCompanyChange}
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter pincode"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <Input
                    name="state"
                    value={companyData.state}
                    onChange={handleCompanyChange}
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <Input
                    name="industry"
                    value={companyData.industry}
                    onChange={handleCompanyChange}
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter industry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Established Year</label>
                  <Input
                    name="established_year"
                    type="number"
                    value={companyData.established_year}
                    onChange={handleCompanyChange}
                    className="mt-1 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter year (e.g., 2020)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Size</label>
                  <Select
                    value={companyData.size}
                    onValueChange={(value) =>
                      handleCompanyChange({ target: { name: "size", value } })
                    }
                  >
                    <SelectTrigger className="mt-1 focus:ring-primary focus:border-primary bg-white">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-200">51-200</SelectItem>
                      <SelectItem value="200+">200+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-1/2 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    className="w-1/2 bg-primary hover:bg-indigo-700 flex items-center justify-center gap-2"
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