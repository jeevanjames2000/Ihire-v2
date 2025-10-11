"use client";
import { useState, useEffect } from "react";

export default function JobCreateForm() {
  const [industries, setIndustries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    about_position: "",
    key_responsibilities: "",
    requirements: "",
    description: "",
    job_type: "Full-time",
    experience_level: "Fresher",
    min_salary: "",
    max_salary: "",
    salary_currency: "INR",
    salary_type: "Monthly",
    location: "",
    is_remote: false,
    work_mode: "On-site",
    skills_required: "",
    vacancies: 1,
    status: "active",
    expires_at: "",
    industry_id: "",
    category_id: "",
    subcategory_id: "",
  });

  // Fetch industries on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/industries")
      .then((res) => res.json())
      .then(setIndustries)
      .catch((error) => console.error("Error fetching industries:", error));
  }, []);

  // Fetch categories when industry_id changes
  useEffect(() => {
    if (formData.industry_id) {
      fetch(`http://localhost:5000/api/industries/${formData.industry_id}/categories`)
        .then((res) => res.json())
        .then(setCategories)
        .catch((error) => console.error("Error fetching categories:", error));
      setFormData((prev) => ({ ...prev, category_id: "", subcategory_id: "" }));
      setSubcategories([]);
    } else {
      setCategories([]);
      setSubcategories([]);
    }
  }, [formData.industry_id]);

  // Fetch subcategories when category_id changes
  useEffect(() => {
    if (formData.category_id) {
      fetch(`http://localhost:5000/api/industries/categories/${formData.category_id}/subcategories`)
        .then((res) => res.json())
        .then(setSubcategories)
        .catch((error) => console.error("Error fetching subcategories:", error));
      setFormData((prev) => ({ ...prev, subcategory_id: "" }));
    } else {
      setSubcategories([]);
    }
  }, [formData.category_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Job title is required";
    if (!formData.job_type) newErrors.job_type = "Job type is required";
    if (!formData.industry_id) newErrors.industry_id = "Industry is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";
    if (!formData.subcategory_id) newErrors.subcategory_id = "Subcategory is required";
    if (formData.min_salary && formData.max_salary && Number(formData.min_salary) > Number(formData.max_salary)) {
      newErrors.min_salary = "Minimum salary cannot be greater than maximum salary";
    }
    if (formData.vacancies < 1) newErrors.vacancies = "Vacancies must be at least 1";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/jobs/createJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header if using JWT
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          employer_id: 1, // Replace with dynamic value from auth context
          company_id: 2,  // Replace with dynamic value from auth context
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        // Optionally reset form
        setFormData({
          title: "",
          about_position: "",
          key_responsibilities: "",
          requirements: "",
          description: "",
          job_type: "Full-time",
          experience_level: "Fresher",
          min_salary: "",
          max_salary: "",
          salary_currency: "INR",
          salary_type: "Monthly",
          location: "",
          is_remote: false,
          work_mode: "On-site",
          skills_required: "",
          vacancies: 1,
          status: "active",
          expires_at: "",
          industry_id: "",
          category_id: "",
          subcategory_id: "",
        });
        setErrors({});
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Error submitting job");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Create Job Posting</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.title ? "border-red-500" : "border-gray-300"}`}
            required
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="about_position" className="block text-sm font-medium text-gray-700">
            About the Position
          </label>
          <textarea
            name="about_position"
            id="about_position"
            placeholder="About the Position"
            value={formData.about_position}
            onChange={handleChange}
            className="border p-2 w-full rounded border-gray-300"
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="key_responsibilities" className="block text-sm font-medium text-gray-700">
            Key Responsibilities
          </label>
          <textarea
            name="key_responsibilities"
            id="key_responsibilities"
            placeholder="Key Responsibilities"
            value={formData.key_responsibilities}
            onChange={handleChange}
            className="border p-2 w-full rounded border-gray-300"
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
            Requirements
          </label>
          <textarea
            name="requirements"
            id="requirements"
            placeholder="Requirements"
            value={formData.requirements}
            onChange={handleChange}
            className="border p-2 w-full rounded border-gray-300"
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            name="description"
            id="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full rounded border-gray-300"
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="job_type" className="block text-sm font-medium text-gray-700">
            Job Type
          </label>
          <select
            name="job_type"
            id="job_type"
            value={formData.job_type}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.job_type ? "border-red-500" : "border-gray-300"}`}
            required
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
          {errors.job_type && <p className="text-red-500 text-sm mt-1">{errors.job_type}</p>}
        </div>

        <div>
          <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">
            Experience Level
          </label>
          <select
            name="experience_level"
            id="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            className="border p-2 w-full rounded border-gray-300"
          >
            <option value="Fresher">Fresher</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="min_salary" className="block text-sm font-medium text-gray-700">
              Minimum Salary
            </label>
            <input
              type="number"
              name="min_salary"
              id="min_salary"
              placeholder="Minimum Salary"
              value={formData.min_salary}
              onChange={handleChange}
              className={`border p-2 w-full rounded ${errors.min_salary ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.min_salary && <p className="text-red-500 text-sm mt-1">{errors.min_salary}</p>}
          </div>
          <div>
            <label htmlFor="max_salary" className="block text-sm font-medium text-gray-700">
              Maximum Salary
            </label>
            <input
              type="number"
              name="max_salary"
              id="max_salary"
              placeholder="Maximum Salary"
              value={formData.max_salary}
              onChange={handleChange}
              className="border p-2 w-full rounded border-gray-300"
            />
          </div>
        </div>

        <div>
          <label htmlFor="salary_currency" className="block text-sm font-medium text-gray-700">
            Salary Currency
          </label>
          <select
            name="salary_currency"
            id="salary_currency"
            value={formData.salary_currency}
            onChange={handleChange}
            className="border p-2 w-full rounded border-gray-300"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div>
          <label htmlFor="salary_type" className="block text-sm font-medium text-gray-700">
            Salary Type
          </label>
          <select
            name="salary_type"
            id="salary_type"
            value={formData.salary_type}
            onChange={handleChange}
            className="border p-2 w-full rounded border-gray-300"
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
            <option value="Hourly">Hourly</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="border p-2 w-full rounded border-gray-300"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_remote"
              checked={formData.is_remote}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Remote Job</span>
          </label>
        </div>

        <div>
          <label htmlFor="work_mode" className="block text-sm font-medium text-gray-700">
            Work Mode
          </label>
          <select
            name="work_mode"
            id="work_mode"
            value={formData.work_mode}
            onChange={handleChange}
            className="border p-2 w-full rounded border-gray-300"
          >
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div>
          <label htmlFor="skills_required" className="block text-sm font-medium text-gray-700">
            Skills Required
          </label>
          <textarea
            name="skills_required"
            id="skills_required"
            placeholder="Skills Required (comma-separated)"
            value={formData.skills_required}
            onChange={handleChange}
            className="border p-2 w-full rounded border-gray-300"
            rows="2"
          />
        </div>

        <div>
          <label htmlFor="vacancies" className="block text-sm font-medium text-gray-700">
            Number of Vacancies
          </label>
          <input
            type="number"
            name="vacancies"
            id="vacancies"
            placeholder="Number of Vacancies"
            value={formData.vacancies}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.vacancies ? "border-red-500" : "border-gray-300"}`}
            min="1"
          />
          {errors.vacancies && <p className="text-red-500 text-sm mt-1">{errors.vacancies}</p>}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 w-full rounded border-gray-300"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700">
            Expiration Date
          </label>
          <input
            type="date"
            name="expires_at"
            id="expires_at"
            value={formData.expires_at}
            onChange={handleChange}
            className="border p-2 w-full rounded border-gray-300"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor="industry_id" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              name="industry_id"
              id="industry_id"
              value={formData.industry_id}
              onChange={handleChange}
              className={`border p-2 rounded w-full ${errors.industry_id ? "border-red-500" : "border-gray-300"}`}
              required
            >
              <option value="">Select Industry</option>
              {industries.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
            {errors.industry_id && <p className="text-red-500 text-sm mt-1">{errors.industry_id}</p>}
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category_id"
              id="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={`border p-2 rounded w-full ${errors.category_id ? "border-red-500" : "border-gray-300"}`}
              required
              disabled={!formData.industry_id}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
          </div>

          <div>
            <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <select
              name="subcategory_id"
              id="subcategory_id"
              value={formData.subcategory_id}
              onChange={handleChange}
              className={`border p-2 rounded w-full ${errors.subcategory_id ? "border-red-500" : "border-gray-300"}`}
              required
              disabled={!formData.category_id}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.subcategory_id && <p className="text-red-500 text-sm mt-1">{errors.subcategory_id}</p>}
          </div>
        </div>

        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:bg-blue-300`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Job"}
        </button>
      </form>
    </div>
  );
}