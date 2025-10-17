"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { User, Phone, MapPin, Calendar, Briefcase, Book, Star, Code, Settings, Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfileForm = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    phone: "",
    address: "",
    date_of_birth: "",
    gender: "",
    profile_picture: "",
    resume: "",
    resume_headline: "",
    career_profile: "",
    certifications: "",
    skills: "",
    job_preferences: "",
    notification_settings: "email",
  });
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    project_title: "",
    associated_with: "",
    client: "",
    project_status: "ongoing",
    start_year: "",
    start_month: "",
    end_year: "",
    end_month: "",
    description: "",
    project_location: "",
    project_site: "",
    employment_nature: "full-time",
    team_size: "",
    role: "",
    role_description: "",
    skills_used: "",
  });
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState({
    language: "",
    proficiency: "beginner",
  });
  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    id: null,
    qualification_category: "",
    qualification_subcategory: "",
    university: "",
    course_type: "",
    grading_system: "",
    score: "",
    start_year: "",
    end_year: "",
  });
  const [isFresher, setIsFresher] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    id: null,
    company_name: "",
    designation: "",
    location: "",
    start_date: "",
    end_date: "",
    responsibilities: "",
    is_fresher: false,
  });
  const [qualifications, setQualifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editEducationIndex, setEditEducationIndex] = useState(null);
  const [editExperienceIndex, setEditExperienceIndex] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Fetch qualifications
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/qualifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Qualifications:", data);
        const uniqueCategories = [...new Set(data.map((item) => item.category))];
        setQualifications(data);
        setFilteredSubcategories(data);
      })
      .catch((err) => {
        console.error("Error fetching qualifications:", err);
        setMessage({ text: "Failed to fetch qualifications", type: "error" });
      });
  }, [token]);

  // Filter subcategories
  useEffect(() => {
    if (selectedCategory) {
      const filtered = qualifications.filter((item) => item.category === selectedCategory);
      setFilteredSubcategories(filtered);
      setNewEducation((prev) => ({
        ...prev,
        qualification_subcategory: "",
      }));
    } else {
      setFilteredSubcategories(qualifications);
    }
  }, [selectedCategory, qualifications]);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/user/profile/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("Fetched profile data:", data);
      if (res.ok && data) {
        const formattedDOB = data.date_of_birth
          ? new Date(data.date_of_birth).toISOString().split("T")[0]
          : "";

        const validGenders = ["male", "female", "other", "prefer_not_to_say"];
        const fetchedGender = data.gender && validGenders.includes(data.gender.toLowerCase())
          ? data.gender.toLowerCase()
          : "";

        // Format experience dates to YYYY-MM
        const formattedExperiences = (data.experiences || []).map((exp) => ({
          ...exp,
          start_date: exp.start_date ? new Date(exp.start_date).toISOString().slice(0, 7) : "",
          end_date: exp.end_date ? new Date(exp.end_date).toISOString().slice(0, 7) : "",
        }));

        setProfileData({
          phone: data.phone || "",
          address: data.address || "",
          date_of_birth: formattedDOB,
          gender: fetchedGender,
          profile_picture: data.profile_picture || "",
          resume: data.resume || "",
          resume_headline: data.resume_headline || "",
          career_profile: data.career_profile || "",
          certifications: data.certifications || "",
          skills: data.skills || "",
          job_preferences: data.job_preferences || "",
          notification_settings: data.notification_settings || "email",
        });

        setProjects(data.projects || []);
        setLanguages(data.languages || []);
        setEducation(data.education || []);
        setExperiences(formattedExperiences);
        setIsFresher(data.experiences && data.experiences.some((exp) => exp.is_fresher) || false);
      } else {
        setMessage({
          text: data.message || "Failed to fetch profile data",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ text: "Failed to connect to the server", type: "error" });
    }
  };

  useEffect(() => {
    if (user?.id && token) {
      fetchProfile();
    }
  }, [user, token]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    console.log(`Profile change - ${name}: ${value}`);
    setProfileData({ ...profileData, [name]: value });
    setMessage({ text: "", type: "" });
  };

  const handleSelectChange = (name, value) => {
    console.log(`Select change - ${name}: ${value}`);
    setProfileData({ ...profileData, [name]: value });
    setMessage({ text: "", type: "" });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleLanguageChange = (e) => {
    const { name, value } = e.target;
    setNewLanguage({ ...newLanguage, [name]: value });
  };

  const handleLanguageSelectChange = (name, value) => {
    console.log(`Language select change - ${name}: ${value}`);
    setNewLanguage({ ...newLanguage, [name]: value });
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation({ ...newEducation, [name]: value });
  };

  const handleEducationSelectChange = (name, value) => {
    setNewEducation({ ...newEducation, [name]: value });
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setNewExperience({ ...newExperience, [name]: value });
  };

  const addOrUpdateExperience = () => {
    if (
      !newExperience.company_name ||
      !newExperience.designation ||
      !newExperience.start_date
    ) {
      setMessage({ text: "Company, designation, and start date are required", type: "error" });
      return;
    }
    if (editExperienceIndex !== null) {
      const updatedExperiences = [...experiences];
      updatedExperiences[editExperienceIndex] = newExperience;
      setExperiences(updatedExperiences);
      setEditExperienceIndex(null);
    } else {
      setExperiences([...experiences, newExperience]);
    }
    setNewExperience({
      id: null,
      company_name: "",
      designation: "",
      location: "",
      start_date: "",
      end_date: "",
      responsibilities: "",
      is_fresher: false,
    });
    setShowExperienceForm(false);
    setMessage({ text: "", type: "" });
  };

  const editExperience = (index) => {
    const exp = experiences[index];
    setNewExperience({
      id: exp.id || null,
      company_name: exp.company_name || "",
      designation: exp.designation || "",
      location: exp.location || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      responsibilities: exp.responsibilities || "",
      is_fresher: exp.is_fresher || false,
    });
    setEditExperienceIndex(index);
    setShowExperienceForm(true);
    setMessage({ text: "", type: "" });
  };

  const handleDeleteExperience = async (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    setMessage({ text: "", type: "" });

    // Auto-save after deletion and proceed to next step
    const success = await saveStep();
    if (success) {
      setCurrentStep(currentStep + 1);
    }
  };

  const addOrUpdateEducation = () => {
    if (
      !newEducation.qualification_category ||
      !newEducation.qualification_subcategory ||
      !newEducation.university ||
      !newEducation.course_type ||
      !newEducation.grading_system ||
      !newEducation.score ||
      !newEducation.start_year ||
      !newEducation.end_year
    ) {
      setMessage({ text: "All education fields are required", type: "error" });
      return;
    }
    if (editEducationIndex !== null) {
      const updatedEducation = [...education];
      updatedEducation[editEducationIndex] = newEducation;
      setEducation(updatedEducation);
      setEditEducationIndex(null);
    } else {
      setEducation([...education, newEducation]);
    }
    setNewEducation({
      id: null,
      qualification_category: "",
      qualification_subcategory: "",
      university: "",
      course_type: "",
      grading_system: "",
      score: "",
      start_year: "",
      end_year: "",
    });
    setSelectedCategory("");
    setShowEducationForm(false);
    setMessage({ text: "", type: "" });
  };

  const editEducation = (index) => {
    const edu = education[index];
    setNewEducation(edu);
    setSelectedCategory(edu.qualification_category);
    setEditEducationIndex(index);
    setShowEducationForm(true);
  };

  const deleteEducation = async (index) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(updatedEducation);
    setMessage({ text: "", type: "" });

    // Auto-save after deletion
    const success = await saveStep();
    if (success) {
      setCurrentStep(currentStep + 1);
    }
  };

  const addProject = () => {
    if (!newProject.project_title) {
      setMessage({ text: "Project title is required", type: "error" });
      return;
    }
    setProjects([...projects, newProject]);
    setNewProject({
      project_title: "",
      associated_with: "",
      client: "",
      project_status: "ongoing",
      start_year: "",
      start_month: "",
      end_year: "",
      end_month: "",
      description: "",
      project_location: "",
      project_site: "",
      employment_nature: "full-time",
      team_size: "",
      role: "",
      role_description: "",
      skills_used: "",
    });
  };

  const addLanguage = () => {
    if (!newLanguage.language) {
      setMessage({ text: "Language name is required", type: "error" });
      return;
    }
    setLanguages([...languages, newLanguage]);
    setNewLanguage({ language: "", proficiency: "beginner" });
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!profileData.phone) return "Phone number is required";
        if (!profileData.address) return "Address is required";
        if (!profileData.date_of_birth) return "Date of birth is required";
        if (!profileData.gender) {
          console.log("Gender validation failed:", profileData.gender);
          return "Gender is required";
        }
        return "";
      case 2:
        if (education.length === 0) return "At least one education entry is required";
        return "";
      case 3:
        if (!isFresher && experiences.length === 0) return "At least one experience entry is required for experienced users";
        if (!isFresher && experiences.some((exp) => !exp.company_name || !exp.designation || !exp.start_date)) {
          return "Company, designation, and start date are required for each experience";
        }
        return "";
      case 4:
        // if (!profileData.skills) return "Skills are required";
        // if (!profileData.resume_headline) return "Resume headline is required";
        // return "";
      case 5:
        return "";
      case 6:
        return "";
      case 7:
        if (!profileData.job_preferences) return "Job preferences are required";
        if (!profileData.notification_settings) return "Notification settings are required";
        return "";
      default:
        return "";
    }
  };

  const saveStep = async () => {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setMessage({ text: validationError, type: "error" });
      return false;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const payload = {
        ...profileData,
        projects,
        languages,
        education,
        experiences: isFresher ? [{ is_fresher: true }] : experiences,
      };
      console.log("Saving profile data:", payload);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/user/updateUserProfile/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage({ text: `Step ${currentStep} saved successfully!`, type: "success" });
        return true;
      } else {
        console.error("Save failed:", data.message);
        setMessage({ text: data.message || "Failed to save step", type: "error" });
        return false;
      }
    } catch (error) {
      console.error("Error saving step:", error);
      setMessage({ text: "Failed to connect to the server", type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const success = await saveStep();
    if (success) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = async (e) => {
    e.preventDefault();
    setCurrentStep(currentStep - 1);
    await fetchProfile();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveStep();
    if (success) {
      setMessage({ text: "Profile completed successfully!", type: "success" });
      setTimeout(() => router.push("/"), 2000);
    }
  };

  const steps = [
    { title: "Personal Details", icon: <User className="h-5 w-5" /> },
    { title: "Education", icon: <Book className="h-5 w-5" /> },
    { title: "Experience", icon: <Briefcase className="h-5 w-5" /> },
    { title: "Skills & Resume", icon: <Star className="h-5 w-5" /> },
    { title: "Projects", icon: <Code className="h-5 w-5" /> },
    { title: "Languages", icon: <Languages className="h-5 w-5" /> },
    { title: "Preferences", icon: <Settings className="h-5 w-5" /> },
  ];

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
        className="relative w-full max-w-4xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl p-8 z-10"
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
            Complete Your Profile
          </motion.h1>
          <p className="text-gray-600 text-sm mt-2">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  currentStep > index + 1
                    ? "bg-gradient-to-r from-gray-800 to-black text-white"
                    : currentStep === index + 1
                    ? "bg-gradient-to-r from-gray-600 to-gray-800 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                animate={{ scale: currentStep === index + 1 ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {step.icon}
              </motion.div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 ${
                    currentStep > index + 1 ? "bg-gray-800" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            onSubmit={currentStep === steps.length ? handleSubmit : handleNext}
            className="space-y-6"
          >
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                    <Input
                      name="phone"
                      placeholder="Enter phone number"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                    <Input
                      name="address"
                      placeholder="Enter address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                    <Input
                      name="date_of_birth"
                      type="date"
                      value={profileData.date_of_birth}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={profileData.gender || ""}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            {/* Step 2: Education */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-md font-semibold">Education</h3>
                {education.length === 0 ? (
                  <p className="text-gray-500">No education entries added yet.</p>
                ) : (
                  education.map((edu, index) => (
                    <motion.div
                      key={edu.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border p-4 rounded-xl bg-white/90"
                    >
                      <p><strong>Qualification:</strong> {edu.qualification_category} - {edu.qualification_subcategory}</p>
                      <p><strong>University:</strong> {edu.university}</p>
                      <p><strong>Course Type:</strong> {edu.course_type}</p>
                      <p><strong>Grading System:</strong> {edu.grading_system}</p>
                      <p><strong>Score:</strong> {edu.score}</p>
                      <p><strong>Duration:</strong> {edu.start_year} - {edu.end_year}</p>
                      <div className="flex gap-2 mt-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => editEducation(index)}>
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteEducation(index)}
                        >
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
                <Button
                  type="button"
                  onClick={() => {
                    setNewEducation({
                      id: null,
                      qualification_category: "",
                      qualification_subcategory: "",
                      university: "",
                      course_type: "",
                      grading_system: "",
                      score: "",
                      start_year: "",
                      end_year: "",
                    });
                    setSelectedCategory("");
                    setEditEducationIndex(null);
                    setShowEducationForm(!showEducationForm);
                  }}
                  className="bg-gradient-to-r from-black to-gray-700 hover:from-gray-800 hover:to-black text-white rounded-xl py-2.5 font-medium"
                >
                  {showEducationForm ? "Close Form" : "Add Education"}
                </Button>
                {showEducationForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-3 bg-gray-50 p-4 rounded-xl shadow"
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Qualification Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedCategory(value);
                          setNewEducation((prev) => ({
                            ...prev,
                            qualification_category: value,
                            qualification_subcategory: "",
                          }));
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      >
                        <option value="">Select Qualification</option>
                        {[...new Set(qualifications.map((q) => q.category))].map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Qualification Subcategory
                      </label>
                      <select
                        value={newEducation.qualification_subcategory}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewEducation((prev) => ({
                            ...prev,
                            qualification_subcategory: value,
                          }));
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        disabled={!selectedCategory}
                      >
                        <option value="">Select Subcategory</option>
                        {filteredSubcategories.map((sub) => (
                          <option key={sub.id} value={sub.subcategory}>
                            {sub.subcategory}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        University / Institute
                      </label>
                      <Input
                        name="university"
                        value={newEducation.university}
                        onChange={handleEducationChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Course Type
                      </label>
                      <select
                        name="course_type"
                        value={newEducation.course_type}
                        onChange={(e) => handleEducationSelectChange("course_type", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      >
                        <option value="">Select Course Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Distance Learning">Distance Learning</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Grading System
                      </label>
                      <select
                        name="grading_system"
                        value={newEducation.grading_system}
                        onChange={(e) => handleEducationSelectChange("grading_system", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      >
                        <option value="">Select Grading System</option>
                        <option value="Marks">Marks</option>
                        <option value="Percentage">Percentage</option>
                        <option value="CGPA">CGPA</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Start Year
                      </label>
                      <Input
                        type="number"
                        name="start_year"
                        value={newEducation.start_year}
                        onChange={handleEducationChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                        placeholder="Enter Start Year"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        End Year
                      </label>
                      <Input
                        type="number"
                        name="end_year"
                        value={newEducation.end_year}
                        onChange={handleEducationChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                        placeholder="Enter End Year"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        {newEducation.grading_system === "CGPA"
                          ? "CGPA"
                          : newEducation.grading_system === "Percentage"
                          ? "Percentage"
                          : "Marks"}
                      </label>
                      <Input
                        type="number"
                        name="score"
                        value={newEducation.score}
                        onChange={handleEducationChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                        step="0.01"
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addOrUpdateEducation}
                      className="w-full bg-gradient-to-r from-black to-gray-700 hover:from-gray-800 hover:to-black text-white rounded-xl py-2.5 font-medium"
                    >
                      {editEducationIndex !== null ? "Update Education" : "Save Education"}
                    </Button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 3: Experience */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-md font-semibold">Experience</h3>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="fresher"
                      checked={isFresher}
                      onChange={() => {
                        setIsFresher(true);
                        setExperiences([]);
                        setShowExperienceForm(false);
                      }}
                      className="h-4 w-4"
                    />
                    Fresher
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="experienced"
                      checked={!isFresher}
                      onChange={() => {
                        setIsFresher(false);
                      }}
                      className="h-4 w-4"
                    />
                    Experienced
                  </label>
                </div>
                {!isFresher && (
                  <>
                    {experiences.length === 0 ? (
                      <p className="text-gray-500">No experience entries added yet.</p>
                    ) : (
                      experiences.map((exp, index) => (
                        <motion.div
                          key={exp.id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border p-4 rounded-xl bg-white/90"
                        >
                          <p><strong>Company:</strong> {exp.company_name || "N/A"}</p>
                          <p><strong>Designation:</strong> {exp.designation || "N/A"}</p>
                          <p><strong>Location:</strong> {exp.location || "N/A"}</p>
                          <p><strong>Duration:</strong> {exp.start_date || "N/A"} - {exp.end_date || "Present"}</p>
                          <p><strong>Responsibilities:</strong> {exp.responsibilities || "N/A"}</p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => editExperience(index)}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteExperience(index)}
                            >
                              Delete
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                    <Button
                      type="button"
                      onClick={() => {
                        setNewExperience({
                          id: null,
                          company_name: "",
                          designation: "",
                          location: "",
                          start_date: "",
                          end_date: "",
                          responsibilities: "",
                          is_fresher: false,
                        });
                        setEditExperienceIndex(null);
                        setShowExperienceForm(!showExperienceForm);
                      }}
                      className="bg-gradient-to-r from-black to-gray-700 hover:from-gray-800 hover:to-black text-white rounded-xl py-2.5 font-medium"
                    >
                      {showExperienceForm ? "Close Form" : "Add Experience"}
                    </Button>
                    {showExperienceForm && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 space-y-3 bg-gray-50 p-4 rounded-xl shadow"
                      >
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Company
                          </label>
                          <Input
                            name="company_name"
                            placeholder="Enter company name"
                            value={newExperience.company_name}
                            onChange={handleExperienceChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Designation
                          </label>
                          <Input
                            name="designation"
                            placeholder="Enter designation"
                            value={newExperience.designation}
                            onChange={handleExperienceChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Location
                          </label>
                          <Input
                            name="location"
                            placeholder="Enter location"
                            value={newExperience.location}
                            onChange={handleExperienceChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Start Date
                          </label>
                          <Input
                            type="month"
                            name="start_date"
                            placeholder="Select start date"
                            value={newExperience.start_date}
                            onChange={handleExperienceChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            End Date
                          </label>
                          <Input
                            type="month"
                            name="end_date"
                            placeholder="Select end date"
                            value={newExperience.end_date}
                            onChange={handleExperienceChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Responsibilities
                          </label>
                          <Textarea
                            name="responsibilities"
                            placeholder="Describe your responsibilities"
                            value={newExperience.responsibilities}
                            onChange={handleExperienceChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={addOrUpdateExperience}
                          className="w-full bg-gradient-to-r from-black to-gray-700 hover:from-gray-800 hover:to-black text-white rounded-xl py-2.5 font-medium"
                        >
                          {editExperienceIndex !== null ? "Update Experience" : "Save Experience"}
                        </Button>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Step 4: Skills & Resume */}
            {currentStep === 4 && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Skills
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                    <Input
                      name="skills"
                      placeholder="Enter skills (comma-separated)"
                      value={profileData.skills}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Resume Headline
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                    <Input
                      name="resume_headline"
                      placeholder="Enter resume headline"
                      value={profileData.resume_headline}
                      onChange={handleProfileChange}
                      maxLength={255}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Resume URL
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                    <Input
                      name="resume"
                      placeholder="Enter resume URL"
                      value={profileData.resume}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Certifications
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                    <Textarea
                      name="certifications"
                      placeholder="List certifications"
                      value={profileData.certifications}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 5: Projects */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-md font-semibold">Projects</h3>
                {projects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border p-4 rounded-xl bg-white/90"
                  >
                    <p><strong>Title:</strong> {project.project_title}</p>
                    <p><strong>Status:</strong> {project.project_status}</p>
                    <p><strong>Client:</strong> {project.client}</p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setProjects(projects.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </motion.div>
                ))}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Project Title
                    </label>
                    <div className="relative">
                      <Code className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                      <Input
                        name="project_title"
                        placeholder="Project Title"
                        value={newProject.project_title}
                        onChange={handleProjectChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Associated With
                    </label>
                    <Input
                      name="associated_with"
                      placeholder="Associated With"
                      value={newProject.associated_with}
                      onChange={handleProjectChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Client
                    </label>
                    <Input
                      name="client"
                      placeholder="Client"
                      value={newProject.client}
                      onChange={handleProjectChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Project Status
                    </label>
                    {/* <Select
                      name="project_status"
                      value={newProject.project_status}
                      onValueChange={(value) => handleProjectChange({ target: { name: "project_status", value } })}
                    >
                      <SelectTrigger className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all">
                        <SelectValue placeholder="Project Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                      </SelectContent>
                    </Select> */}
                    <select>
                      <option value="" >Completed</option>
                      <option value = "">Ongoing</option>
                      <option value= "">Planned</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Start Year
                      </label>
                      <Input
                        name="start_year"
                        type="number"
                        placeholder="Start Year"
                        value={newProject.start_year}
                        onChange={handleProjectChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Start Month
                      </label>
                      <Input
                        name="start_month"
                        placeholder="Start Month"
                        value={newProject.start_month}
                        onChange={handleProjectChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        End Year
                      </label>
                      <Input
                        name="end_year"
                        type="number"
                        placeholder="End Year"
                        value={newProject.end_year}
                        onChange={handleProjectChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        End Month
                      </label>
                      <Input
                        name="end_month"
                        placeholder="End Month"
                        value={newProject.end_month}
                        onChange={handleProjectChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      placeholder="Description"
                      value={newProject.description}
                      onChange={handleProjectChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Project Location
                    </label>
                    <Input
                      name="project_location"
                      placeholder="Project Location"
                      value={newProject.project_location}
                      onChange={handleProjectChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Project Site
                    </label>
                    <Input
                      name="project_site"
                      placeholder="Project Site"
                      value={newProject.project_site}
                      onChange={handleProjectChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Employment Nature
                    </label>
                    <Select
                      name="employment_nature"
                      value={newProject.employment_nature}
                      onValueChange={(value) => handleProjectChange({ target: { name: "employment_nature", value } })}
                    >
                      <SelectTrigger className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all">
                        <SelectValue placeholder="Employment Nature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="college_project">College Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Team Size
                    </label>
                    <Input
                      name="team_size"
                      type="number"
                      placeholder="Team Size"
                      value={newProject.team_size}
                      onChange={handleProjectChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Role
                    </label>
                    <Input
                      name="role"
                      placeholder="Role"
                      value={newProject.role}
                      onChange={handleProjectChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Role Description
                    </label>
                    <Input
                      name="role_description"
                      placeholder="Role Description"
                      value={newProject.role_description}
                      onChange={handleProjectChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Skills Used
                    </label>
                    <Input
                      name="skills_used"
                      placeholder="Skills Used (comma-separated)"
                      value={newProject.skills_used}
                      onChange={handleProjectChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addProject}
                    className="w-full bg-gradient-to-r from-black to-gray-700 hover:from-gray-800 hover:to-black text-white rounded-xl py-2.5 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    Add Project
                  </Button>
                </div>
              </div>
            )}

            {/* Step 6: Languages */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="text-md font-semibold">Languages</h3>
                {languages.map((lang, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border p-4 rounded-xl bg-white/90"
                  >
                    <p><strong>Language:</strong> {lang.language}</p>
                    <p><strong>Proficiency:</strong> {lang.proficiency}</p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setLanguages(languages.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </motion.div>
                ))}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Language
                    </label>
                    <div className="relative">
                      <Languages className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                      <Input
                        name="language"
                        placeholder="Enter language (e.g., English, Spanish)"
                        value={newLanguage.language}
                        onChange={handleLanguageChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Proficiency
                    </label>
                    <Select
                      name="proficiency"
                      value={newLanguage.proficiency}
                      onValueChange={(value) => handleLanguageSelectChange("proficiency", value)}
                    >
                      <SelectTrigger className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all">
                        <SelectValue placeholder="Select proficiency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    onClick={addLanguage}
                    className="w-full bg-gradient-to-r from-black to-gray-700 hover:from-gray-800 hover:to-black text-white rounded-xl py-2.5 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    Add Language
                  </Button>
                </div>
              </div>
            )}

            {/* Step 7: Preferences */}
            {currentStep === 7 && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Job Preferences
                  </label>
                  <div className="relative">
                    <Settings className="absolute left-3 top-3.5 h-5 w-5 text-gray-700" />
                    <Input
                      name="job_preferences"
                      placeholder="Enter job preferences"
                      value={profileData.job_preferences}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Notification Settings
                  </label>
                  <Select
                    name="notification_settings"
                    value={profileData.notification_settings}
                    onValueChange={(value) => handleSelectChange("notification_settings", value)}
                  >
                    <SelectTrigger className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300 text-gray-800 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-100 transition-all">
                      <SelectValue placeholder="Select notification setting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

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

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  className="bg-gray-200 text-gray-700 rounded-xl py-2.5 font-medium hover:bg-gray-300 transition-all"
                >
                  Previous
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-black to-gray-700 hover:from-gray-800 hover:to-black text-white rounded-xl py-2.5 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
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
                    Saving...
                  </>
                ) : currentStep === steps.length ? (
                  "Complete Profile"
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </motion.form>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Link href="/">
            <Button className="bg-gradient-to-r from-black to-gray-700 hover:from-gray-800 hover:to-black text-white rounded-xl py-2.5 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all">
              Home
            </Button>
          </Link>
          {user?.id && (
            <Link href="/saved-jobs">
              <Button
                variant="outline"
                className="rounded-xl py-2.5 font-medium"
              >
                Saved Jobs
              </Button>
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileForm;