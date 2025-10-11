"use client";

import { useState } from "react";

export default function CreateJobPage() {
  const [formData, setFormData] = useState({
    employer_id: 1,
    company_id: 1,
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
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert(" Job posted successfully!");
      setFormData({
        employer_id: 1,
        company_id: 1,
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
      });
    } else {
      alert("❌ Failed to post job");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4">🧾 Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" className="w-full border p-2 rounded" required />

        <textarea name="about_position" value={formData.about_position} onChange={handleChange} placeholder="About this position" className="w-full border p-2 rounded" />

        <textarea name="key_responsibilities" value={formData.key_responsibilities} onChange={handleChange} placeholder="Key Responsibilities" className="w-full border p-2 rounded" />

        <textarea name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Requirements / Qualifications" className="w-full border p-2 rounded" />

        <div className="grid grid-cols-2 gap-4">
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="border p-2 rounded" />
          <select name="work_mode" value={formData.work_mode} onChange={handleChange} className="border p-2 rounded">
            <option>On-site</option>
            <option>Hybrid</option>
            <option>Remote</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="min_salary" value={formData.min_salary} onChange={handleChange} placeholder="Min Salary" className="border p-2 rounded" />
          <input type="number" name="max_salary" value={formData.max_salary} onChange={handleChange} placeholder="Max Salary" className="border p-2 rounded" />
        </div>

        <input name="skills_required" value={formData.skills_required} onChange={handleChange} placeholder="Skills (comma separated)" className="w-full border p-2 rounded" />

        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">Post Job</button>
      </form>
    </div>
  );
}
