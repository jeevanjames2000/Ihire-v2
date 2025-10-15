"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createJob, clearAddJobState } from "../../../../store/jobsSlice";
import { fetchCategories, fetchSubcategories, fetchSkills } from "../../../../store/categoriesSlice";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select as ShadcnSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
export const dynamic = 'force-dynamic';
const CreateJob = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    categories = [],
    categoriesStatus = "idle",
    subcategories = [],
    subcategoriesStatus = "idle",
    skills = [],
    skillsStatus = "idle",
    error: categoriesError = null,
    skillsError = null,
  } = useSelector((state) => state.categories || {});
  const {
    jobsStatus = "idle",
    jobsError = null,
    addJobError = null,
    addJobSuccess = false,
  } = useSelector((state) => state.jobs || {});
  const { userInfo = null, userType = null } = useSelector((state) => state.user || {});

  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    location: "",
    description: "",
    category_id: "",
    category_name: "",
    subcategory_id: "",
    subcategory_name: "",
    salary: 0,
    type: "",
    experience: "",
    deadline: "",
    skills: [],
    status: "Active",
    contactPerson: "",
    role: "",
    startDate: "",
    vacancies: 1,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (skillsStatus === "idle") {
      dispatch(fetchSkills());
    }
  }, [dispatch, skillsStatus]);

  useEffect(() => {
    if (categoriesStatus === "idle" && categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesStatus, categories.length]);

  useEffect(() => {
    if (formData.category_id) {
      dispatch(fetchSubcategories(formData.category_name));
    } else {
      dispatch({ type: "categories/resetSubcategories" });
    }
  }, [dispatch, formData.category_id]);

  useEffect(() => {
    if (addJobSuccess) {
      toast.success("Successfully posted a job.", { position: "top-right", autoClose: 3000 });
      setFormData({
        title: "",
        company_name: "",
        location: "",
        description: "",
        category_id: "",
        category_name: "",
        subcategory_id: "",
        subcategory_name: "",
        salary: 0,
        type: "",
        experience: "",
        deadline: "",
        skills: [],
        status: "Active",
        contactPerson: "",
        role: "",
        startDate: "",
        vacancies: 1,
      });
      setErrors({});
      dispatch(clearAddJobState());
      router.push("/joblisting");
    }
    if (addJobError) {
      const errorMessage = addJobError.message || addJobError.data?.error || "Failed to create job.";
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
      dispatch(clearAddJobState());
    }
  }, [addJobSuccess, addJobError, dispatch, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value === "default" ? "" : value };
      if (name === "category_id") {
        updated.subcategory_id = value === "default" ? "" : updated.subcategory_id;
        updated.subcategory_name = "";
        updated.category_name = value === "default" ? "" : categories.find((cat) => cat.id === value)?.name || "";
      }
      if (name === "subcategory_id") {
        updated.subcategory_name = value === "default" ? "" : subcategories.find((sub) => sub.id === value)?.name || "";
      }
      return updated;
    });
    setErrors((prev) => {
      const updatedErrors = { ...prev, [name]: "" };
      if (name === "category_id") updatedErrors.subcategory_id = "";
      return updatedErrors;
    });
  };

  const handleSkillsChange = (selectedOptions) => {
    const selectedSkills = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData((prev) => ({ ...prev, skills: selectedSkills }));
    setErrors((prev) => ({ ...prev, skills: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];
    if (!formData.title || formData.title === "default") newErrors.title = "Job Title is required";
    if (!formData.company_name || formData.company_name === "default") newErrors.company_name = "Company Name is required";
    if (!formData.location || formData.location === "default") newErrors.location = "Location is required";
    if (!formData.description || formData.description === "default") newErrors.description = "Job Description is required";
    if (!formData.category_id || formData.category_id === "default") newErrors.category_id = "Category is required";
    if ((!formData.subcategory_id || formData.subcategory_id === "default") && formData.category_id && subcategories.length > 0)
      newErrors.subcategory_id = "Subcategory is required";
    if (!formData.type || formData.type === "default") newErrors.type = "Job Type is required";
    if (!formData.deadline || formData.deadline === "default") newErrors.deadline = "Application Deadline is required";
    if (formData.deadline && formData.deadline < today)
      newErrors.deadline = "Deadline must be a future date";
    if (formData.salary < 0) newErrors.salary = "Salary cannot be negative";
    if (formData.vacancies < 1) newErrors.vacancies = "Vacancies must be at least 1";
    if (!formData.skills || formData.skills.length === 0)
      newErrors.skills = "At least one skill is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const payload = { ...formData };
      console.log("Submitting payload:", payload);
      await dispatch(createJob(payload)).unwrap();
    } catch (err) {
      const errorMessage = err.message?.includes("network")
        ? "Network error. Please check your connection."
        : err.message || "Failed to create job.";
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full  shadow-xl rounded-2xl p-8 border-2 rounded  bg-white">
        <h1 className="text-2xl font-bold text-center text-gray-900 tracking-tight mb-8">Create a New Job Posting</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="text-lg font-medium text-black mb-1">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={jobsStatus === "loading"}
                  className={ errors.title ? "border-red-500" : ""}
                  placeholder="e.g., Frontend Developer"
                />
                {errors.title && (
                  <p id="title-error" className="mt-1 text-lg text-red-500">
                    {errors.title}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="company_name" className="text-lg font-medium text-black mb-1">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company_name"
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  disabled={jobsStatus === "loading"}
                  className={errors.company_name ? "border-red-500" : ""}
                  placeholder="e.g., Tech Corp"
                />
                {errors.company_name && (
                  <p id="company_name-error" className="mt-1 text-lgtext-red-500">
                    {errors.company_name}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="location" className="text-lg font-medium text-black mb-1">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={jobsStatus === "loading"}
                  className={errors.location ? "border-red-500" : ""}
                  placeholder="e.g., Mumbai, India"
                />
                {errors.location && (
                  <p id="location-error" className="mt-1 text-lgtext-red-500">
                    {errors.location}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="category_id" className="text-lg font-medium text-black mb-1">
                  Category <span className="text-red-500">*</span>
                </Label>
                <ShadcnSelect
                  value={formData.category_id}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "category_id", value } })
                  }
                  disabled={jobsStatus === "loading" || categoriesStatus === "loading"}
                >
                  <SelectTrigger className={errors.category_id ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Select a category</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </ShadcnSelect>
                {categoriesStatus === "loading" && (
                  <p className="mt-1 text-lg text-gray-500">Loading categories...</p>
                )}
                {errors.category_id && (
                  <p id="category_id-error" className="mt-1 text-lg text-red-500">
                    {errors.category_id}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="subcategory_id" className="text-lg font-medium text-black mb-1">
                Subcategory <span className="text-red-500">*</span>
              </Label>
              <ShadcnSelect
                value={formData.subcategory_id}
                onValueChange={(value) =>
                  handleChange({ target: { name: "subcategory_id", value } })
                }
                disabled={
                  jobsStatus === "loading" ||
                  subcategoriesStatus === "loading" ||
                  !formData.category_id
                }
              >
                <SelectTrigger className={errors.subcategory_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Select a subcategory</SelectItem>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </ShadcnSelect>
              {subcategoriesStatus === "loading" && (
                <p className="mt-1 text-lg text-gray-500">Loading subcategories...</p>
              )}
              {errors.subcategory_id && (
                <p id="subcategory_id-error" className="mt-1 text-lg text-red-500">
                  {errors.subcategory_id}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description" className="text-lg font-medium text-black mb-1">
                Job Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={jobsStatus === "loading"}
                className={errors.description ? "border-red-500" : ""}
                placeholder="Describe the job responsibilities, requirements, and perks..."
              />
              {errors.description && (
                <p id="description-error" className="mt-1 text-lg text-red-500">
                  {errors.description}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="skills" className="text-lg font-medium text-black mb-1">
                Skills <span className="text-red-500">*</span>
              </Label>
              {skillsStatus === "loading" ? (
                <p className="mt-1 text-lg text-gray-500">Loading skills...</p>
              ) : Array.isArray(skills) && skills.length > 0 ? (
                <Select
                  isMulti
                  name="skills"
                  options={skills.map((skill) => ({ value: skill, label: skill }))}
                  value={formData.skills.map((skill) => ({ value: skill, label: skill }))}
                  onChange={handleSkillsChange}
                  className="basic-multi-select bg-white"
                  classNamePrefix="select"
                  placeholder="Select skills..."
                  isDisabled={skillsStatus !== "succeeded" || jobsStatus === "loading"}
                />
              ) : (
                <p className="mt-1 text-lg text-red-500">No skills available. Please contact support.</p>
              )}
              {errors.skills && (
                <p id="skills-error" className="mt-1 text-lg text-red-500">
                  {errors.skills}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="salary" className="text-lg font-medium text-black mb-1">
                  Salary (INR)
                </Label>
                <Input
                  id="salary"
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                  disabled={jobsStatus === "loading"}
                  className={errors.salary ? "border-red-500" : ""}
                  placeholder="e.g., 50000"
                />
                {errors.salary && (
                  <p id="salary-error" className="mt-1 text-lg text-red-500">
                    {errors.salary}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="type" className="text-lg font-medium text-black mb-1">
                  Job Type <span className="text-red-500">*</span>
                </Label>
                <ShadcnSelect
                  value={formData.type}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "type", value } })
                  }
                  disabled={jobsStatus === "loading"}
                >
                  <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Select type</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Onsite">Onsite</SelectItem>
                  </SelectContent>
                </ShadcnSelect>
                {errors.type && (
                  <p id="type-error" className="mt-1 text-lg text-red-500">
                    {errors.type}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="experience" className="text-lg font-medium text-black mb-1">
                  Experience
                </Label>
                <Input
                  id="experience"
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={jobsStatus === "loading"}
                  placeholder="e.g., 2-5 years"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="deadline" className="text-lg font-medium text-black mb-1">
                  Application Deadline <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  disabled={jobsStatus === "loading"}
                  className={errors.deadline ? "border-red-500" : ""}
                />
                {errors.deadline && (
                  <p id="deadline-error" className="mt-1 text-lg text-red-500">
                    {errors.deadline}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="startDate" className="text-lg font-medium text-black mb-1">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={jobsStatus === "loading"}
                />
              </div>
              <div>
                <Label htmlFor="vacancies" className="text-lg font-medium text-black mb-1">
                  Vacancies
                </Label>
                <Input
                  id="vacancies"
                  type="number"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  min="1"
                  disabled={jobsStatus === "loading"}
                  className={errors.vacancies ? "border-red-500" : ""}
                  placeholder="e.g., 3"
                />
                {errors.vacancies && (
                  <p id="vacancies-error" className="mt-1 text-lg text-red-500">
                    {errors.vacancies}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contactPerson" className="text-lg font-medium text-black mb-1">
                  Contact Person
                </Label>
                <Input
                  id="contactPerson"
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  disabled={jobsStatus === "loading"}
                  placeholder="e.g., John Doe, HR Manager"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-lg font-medium text-black mb-1">
                  Role
                </Label>
                <Input
                  id="role"
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={jobsStatus === "loading"}
                  placeholder="e.g., Frontend Developer"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status" className="text-lg font-medium text-black mb-1">
                Status
              </Label>
              <ShadcnSelect
                value={formData.status}
                onValueChange={(value) =>
                  handleChange({ target: { name: "status", value } })
                }
                disabled={jobsStatus === "loading"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Select status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                </SelectContent>
              </ShadcnSelect>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              onClick={() => router.push("/joblisting")}
              disabled={jobsStatus === "loading"}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={jobsStatus === "loading" || skillsStatus === "loading"}
            >
              {jobsStatus === "loading" ? "Submitting..." : "Post Job"}
            </Button>
          </div>
        </form>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />
      </div>
    </div>
  );
};

export default CreateJob;