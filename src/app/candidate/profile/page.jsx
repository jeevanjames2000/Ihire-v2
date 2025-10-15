"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, FileText, Code, Briefcase, Book } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CandidateProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    skills: [""],
    experience: [{ companyName: "", jobTitle: "", duration: "", responsibilities: "" }],
    education: [{ degree: "", institution: "", year: "", city: "" }],
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

      // Prefill name and email from localStorage
      if (userInfo.name && userInfo.email) {
        setFormData((prev) => ({
          ...prev,
          name: userInfo.name,
          email: userInfo.email,
        }));
      }

      if (!token) {
        router.push("/candidateLogin");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/candidates/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: response.data.user.name || userInfo.name || "",
          email: response.data.user.email || userInfo.email || "",
          phone: response.data.profile.phone || "",
          resume: response.data.profile.resume || "",
          skills: response.data.skills.length ? response.data.skills : [""],
          experience: response.data.experience.length
            ? response.data.experience
            : [{ companyName: "", jobTitle: "", duration: "", responsibilities: "" }],
          education: response.data.education.length
            ? response.data.education
            : [{ degree: "", institution: "", year: "", city: "" }],
        });
      } catch (err) {
        if (err.response?.status === 404 && err.response?.data?.error === "Candidate not found") {
          // Keep name and email from localStorage
          setFormData((prev) => ({
            ...prev,
            phone: "",
            resume: "",
            skills: [""],
            experience: [{ companyName: "", jobTitle: "", duration: "", responsibilities: "" }],
            education: [{ degree: "", institution: "", year: "", city: "" }],
          }));
        } else {
          toast.error("Failed to fetch profile: " + (err.response?.data?.error || err.message));
        }
      }
    };
    fetchProfile();
  }, [router]);

  const handleChange = (e, index, section) => {
    if (section) {
      const updatedSection = formData[section].map((item, i) =>
        i === index ? { ...item, [e.target.name]: e.target.value } : item
      );
      setFormData({ ...formData, [section]: updatedSection });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setError(null);
  };

  const addField = (section) => {
    setFormData({
      ...formData,
      [section]:
        section === "skills"
          ? [...formData.skills, ""]
          : section === "experience"
          ? [...formData.experience, { companyName: "", jobTitle: "", duration: "", responsibilities: "" }]
          : [...formData.education, { degree: "", institution: "", year: "", city: "" }],
    });
  };

  const removeField = (section, index) => {
    if (formData[section].length > 1) {
      setFormData({
        ...formData,
        [section]: formData[section].filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/candidates/profile",
        {
          phone: formData.phone,
          resume: formData.resume,
          skills: formData.skills.filter((skill) => skill),
          experience: formData.experience.filter((exp) => exp.companyName || exp.jobTitle),
          education: formData.education.filter((edu) => edu.degree || edu.institution),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile saved successfully!");
      router.push("/candidateDashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to save profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent mb-6">
          Complete Your Profile
        </h1>

        <AnimatePresence>
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                <Input
                  name="name"
                  type="text"
                  value={formData.name}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl"
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
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                <Input
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 rounded-xl"
                  placeholder="123-456-7890"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Resume URL</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                <Input
                  name="resume"
                  type="text"
                  value={formData.resume}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 rounded-xl"
                  placeholder="https://example.com/resume.pdf"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Skills</label>
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <div className="relative flex-1">
                    <Code className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                    <Input
                      name="skill_name"
                      type="text"
                      value={skill}
                      onChange={(e) => {
                        const updatedSkills = [...formData.skills];
                        updatedSkills[index] = e.target.value;
                        setFormData({ ...formData, skills: updatedSkills });
                      }}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 rounded-xl"
                      placeholder="e.g., JavaScript"
                    />
                  </div>
                  {formData.skills.length > 1 && (
                    <Button type="button" onClick={() => removeField("skills", index)} className="bg-red-500 text-white">
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={() => addField("skills")} className="mt-2">
                Add Skill
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Experience</label>
              {formData.experience.map((exp, index) => (
                <div key={index} className="space-y-2 mb-4 p-4 border rounded-xl">
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                    <Input
                      name="companyName"
                      type="text"
                      value={exp.companyName}
                      onChange={(e) => handleChange(e, index, "experience")}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 rounded-xl"
                      placeholder="Company Name"
                    />
                  </div>
                  <Input
                    name="jobTitle"
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => handleChange(e, index, "experience")}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 rounded-xl"
                    placeholder="Job Title"
                  />
                  <Input
                    name="duration"
                    type="text"
                    value={exp.duration}
                    onChange={(e) => handleChange(e, index, "experience")}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 rounded-xl"
                    placeholder="e.g., Jan 2020 - Dec 2022"
                  />
                  <Textarea
                    name="responsibilities"
                    value={exp.responsibilities}
                    onChange={(e) => handleChange(e, index, "experience")}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 rounded-xl"
                    placeholder="Responsibilities"
                  />
                  {formData.experience.length > 1 && (
                    <Button type="button" onClick={() => removeField("experience", index)} className="bg-red-500 text-white">
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={() => addField("experience")} className="mt-2">
                Add Experience
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Education</label>
              {formData.education.map((edu, index) => (
                <div key={index} className="space-y-2 mb-4 p-4 border rounded-xl">
                  <div className="relative">
                    <Book className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                    <Input
                      name="degree"
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleChange(e, index, "education")}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 rounded-xl"
                      placeholder="Degree"
                    />
                  </div>
                  <Input
                    name="institution"
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleChange(e, index, "education")}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 rounded-xl"
                    placeholder="Institution"
                  />
                  <Input
                    name="year"
                    type="text"
                    value={edu.year}
                    onChange={(e) => handleChange(e, index, "education")}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 rounded-xl"
                    placeholder="Year"
                  />
                  <Input
                    name="city"
                    type="text"
                    value={edu.city}
                    onChange={(e) => handleChange(e, index, "education")}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 rounded-xl"
                    placeholder="City"
                  />
                  {formData.education.length > 1 && (
                    <Button type="button" onClick={() => removeField("education", index)} className="bg-red-500 text-white">
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={() => addField("education")} className="mt-2">
                Add Education
              </Button>
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
              className="w-full bg-gradient-to-r from-black to-gray-700 hover:from-gray-800 hover:to-black text-white rounded-xl py-2.5 font-medium"
            >
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}