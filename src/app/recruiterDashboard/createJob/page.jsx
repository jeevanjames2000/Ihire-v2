"use client";
import React, { useEffect, useState } from 'react';
export const dynamic = 'force-dynamic';
function TagsInput({ value = [], onChange, placeholder = 'Add tag' }) {
  const [text, setText] = useState('');
  function add() {
    const v = text.trim();
    if (!v) return;
    if (!value.includes(v)) onChange([...value, v]);
    setText('');
  }
  function remove(tag) {
    onChange(value.filter((x) => x !== tag));
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700"
          >
            <span>{t}</span>
            <button
              type="button"
              onClick={() => remove(t)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          className="flex-1 rounded border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 bg-indigo-600 text-white rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function CreateJobPage() {
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [industries, setIndustries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [qualificationCategories, setQualificationCategories] = useState([]);
  const [qualificationSubcategories, setQualificationSubcategories] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [errors, setErrors] = useState({
    industry_id: '',
    category_id: '',
    subcategory_id: '',
    qualification_category_id: '',
    qualification_subcategory_id: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    company_id: '',
    title: '',
    role: '',
    location: '',
    employment_type: 'Full-time',
    experience_min: '',
    experience_max: '',
    salary_min: '',
    salary_max: '',
    hide_salary: false,
    vacancies: 1,
    education: '',
    industry: '',
    responsibilities: '',
    qualifications: '',
    description: '',
    skills: [],
    labels: [],
    questions: [],
    walkin_details: null,
    industry_id: '',
    category_id: '',
    subcategory_id: '',
    qualification_category_id: '',
    qualification_subcategory_id: '',
  });
  const [storedCompany, setStoredCompany] = useState(null);
  const [useStoredCompany, setUseStoredCompany] = useState(true);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('text');
  const [msg, setMsg] = useState('');
  const [previewHtml, setPreviewHtml] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setId] = useState(null);
  console.log("userID",userId)


  useEffect(() => {
    try {
      if (typeof window === 'undefined') return; 
      const token = window.localStorage.getItem('token');
      if (!token) return;
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) return;
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const tokenDecode = JSON.parse(jsonPayload);
      if (tokenDecode?.userId) {
        setId(tokenDecode.userId);
      } else if (tokenDecode?.userId) {
        setId(tokenDecode.userId); 
      }
    } catch (err) {
      console.warn('Failed to decode token from localStorage', err);
    }
  }, []);

  
  useEffect(() => {
    if (userId) {
      fetch(`${NEXT_PUBLIC_API_URL}/api/recruiter/${userId}/companies`, {
        headers: {
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setCompanies(data || 
          1
        ))
        .catch((error) => console.error('Error fetching companies:', error));
    }
  }, [userId]);

  
  useEffect(() => {
    fetch('http://localhost:5000/api/industries')
      .then((res) => res.json())
      .then(setIndustries)
      .catch((error) => console.error('Error fetching industries:', error));
  }, []);


  useEffect(() => {
    if (form.industry_id) {
      fetch(`http://localhost:5000/api/industries/${form.industry_id}/categories`)
        .then((res) => res.json())
        .then(setCategories)
        .catch((error) => console.error('Error fetching categories:', error));
      setForm((prev) => ({ ...prev, category_id: '', subcategory_id: '' }));
      setSubcategories([]);
    } else {
      setCategories([]);
      setSubcategories([]);
    }
  }, [form.industry_id]);

 
  useEffect(() => {
    if (form.category_id) {
      fetch(
        `http://localhost:5000/api/industries/categories/${form.category_id}/subcategories`
      )
        .then((res) => res.json())
        .then(setSubcategories)
        .catch((error) => console.error('Error fetching subcategories:', error));
      setForm((prev) => ({ ...prev, subcategory_id: '' }));
    } else {
      setSubcategories([]);
    }
  }, [form.category_id]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/qualifications`)
      .then((res) => res.json())
      .then((data) => {
        const uniqueCategories = [...new Set(data.map((item) => item.category))].map((category) => ({
          id: data.find((item) => item.category === category).id,
          category,
        }));
        setQualificationCategories(uniqueCategories);
      })
      .catch((error) => console.error('Error fetching qualification categories:', error));
  }, []);


  useEffect(() => {
    if (form.qualification_category_id) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/qualifications/${form.qualification_category_id}/subcategories`
      )
        .then((res) => res.json())
        .then(setQualificationSubcategories)
        .catch((error) =>
          console.error('Error fetching qualification subcategories:', error)
        );
      setForm((prev) => ({ ...prev, qualification_subcategory_id: '' }));
    } else {
      setQualificationSubcategories([]);
    }
  }, [form.qualification_category_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  function addQuestion() {
    const q = questionText.trim();
    if (!q) return;
    setForm((f) => ({
      ...f,
      questions: [...f.questions, { question: q, type: questionType, options: [] }],
    }));
    setQuestionText('');
    setQuestionType('text');
  }

  function removeQuestion(idx) {
    setForm((s) => ({
      ...s,
      questions: s.questions.filter((_, i) => i !== idx),
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('');

    if (!form.company_id) {
      setMsg('Company required');
      return;
    }
    if (!form.title || !form.title.trim()) {
      setMsg('Job title required');
      return;
    }
    if (!form.responsibilities || !form.responsibilities.trim()) {
      setMsg('Responsibilities required');
      return;
    }
    if (!form.description || !form.description.trim()) {
      setMsg('Job description required');
      return;
    }
    if (!form.qualification_category_id) {
      setMsg('Qualification category required');
      setErrors((prev) => ({
        ...prev,
        qualification_category_id: 'Qualification category is required',
      }));
      return;
    }
    if (!form.qualification_subcategory_id) {
      setMsg('Qualification subcategory required');
      setErrors((prev) => ({
        ...prev,
        qualification_subcategory_id: 'Qualification subcategory is required',
      }));
      return;
    }

    setSubmitting(true);

    const payload = {
      ...form,
      description: form.description || '',
      responsibilities: form.responsibilities || '',
      experience_min: form.experience_min ? Number(form.experience_min) : null,
      experience_max: form.experience_max ? Number(form.experience_max) : null,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      vacancies: form.vacancies ? Number(form.vacancies) : 1,
      qualification_category_id: form.qualification_category_id || null,
      qualification_subcategory_id: form.qualification_subcategory_id || null,
    };

    try {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/jobs/createJob`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!res.ok) {
        setMsg(data?.message || `Server error: ${res.status} ${res.statusText}`);
        setSubmitting(false);
        return;
      }

      alert('Job created: ' + (data?.jobId ?? 'OK'));
      window.location.href = '/recruiterDashboard';
    } catch (err) {
      console.error('Submit error:', err);
      setMsg('Network error');
    } finally {
      setSubmitting(false);
    }
  }

  function preview() {
    const combinedHtml = `
      <div>
        <h3>Job Description</h3>
        <p>${description || '<i>No description</i>'}</p>
        <h3>Responsibilities</h3>
        <p>${responsibilities || '<i>No responsibilities</i>'}</p>
      </div>
    `;
    setPreviewHtml(combinedHtml);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const CompanySelector = () => {
    if (storedCompany && useStoredCompany) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex-1">
              <select
                name="company_id"
                value={storedCompany.id}
                onChange={handleChange}
                className="w-full rounded border border-gray-200 p-2 bg-gray-50"
                disabled
              >
                <option value={storedCompany.id}>{storedCompany.name}</option>
              </select>
            </div>
            <button
              type="button"
              className="px-3 py-2 border rounded text-sm"
              onClick={() => {
                setUseStoredCompany(false);
                setForm((f) => ({ ...f, company_id: '' }));
              }}
            >
              Use different company
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Company</label>
        <select
          name="company_id"
          value={form.company_id}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
          required
        >
          <option value="">Select Company</option>
          {companies?.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        <div className="mt-2 text-sm text-gray-500">
          Don't have a company?{' '}
          <a href="/register-company" className="text-indigo-600 underline">
            Register your company
          </a>
          .
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">Post a Job</h1>
        <p className="text-sm text-gray-600 mb-6">
          Create a job listing. Enter the job description below.
        </p>

        <form className="bg-white shadow rounded p-6" onSubmit={onSubmit}>
          <CompanySelector />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                placeholder="Senior Frontend Engineer"
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vacancies</label>
              <input
                type="number"
                min="1"
                value={form.vacancies}
                onChange={(e) =>
                  setForm((s) => ({ ...s, vacancies: Number(e.target.value) }))
                }
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                value={form.role}
                onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employment Type
              </label>
              <select
                value={form.employment_type}
                onChange={(e) =>
                  setForm((s) => ({ ...s, employment_type: e.target.value }))
                }
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Work From Home</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Experience Min (years)
              </label>
              <input
                type="number"
                min="0"
                value={form.experience_min || ''}
                onChange={(e) =>
                  setForm((s) => ({ ...s, experience_min: e.target.value }))
                }
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Experience Max (years)
              </label>
              <input
                type="number"
                min="0"
                value={form.experience_max || ''}
                onChange={(e) =>
                  setForm((s) => ({ ...s, experience_max: e.target.value }))
                }
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Salary Min (INR)
              </label>
              <input
                type="number"
                value={form.salary_min || ''}
                onChange={(e) =>
                  setForm((s) => ({ ...s, salary_min: e.target.value }))
                }
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Salary Max (INR)
              </label>
              <input
                type="number"
                value={form.salary_max || ''}
                onChange={(e) =>
                  setForm((s) => ({ ...s, salary_max: e.target.value }))
                }
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="md:col-span-3">
              <label className="inline-flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={form.hide_salary}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, hide_salary: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Hide salary</span>
              </label>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Education</label>
              <input
                value={form.education}
                onChange={(e) => setForm((s) => ({ ...s, education: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="md:col-span-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label
                    htmlFor="industry_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Industry
                  </label>
                  <select
                    name="industry_id"
                    id="industry_id"
                    value={form.industry_id}
                    onChange={handleChange}
                    className={`border p-2 rounded w-full ${
                      errors.industry_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Industry</option>
                    {industries.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                  {errors.industry_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.industry_id}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="category_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    name="category_id"
                    id="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    className={`border p-2 rounded w-full ${
                      errors.category_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    disabled={!form.industry_id}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="subcategory_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Subcategory
                  </label>
                  <select
                    name="subcategory_id"
                    id="subcategory_id"
                    value={form.subcategory_id}
                    onChange={handleChange}
                    className={`border p-2 rounded w-full ${
                      errors.subcategory_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    disabled={!form.category_id}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.subcategory_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.subcategory_id}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="qualification_category_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Qualification Category
                  </label>
                  <select
                    name="qualification_category_id"
                    id="qualification_category_id"
                    value={form.qualification_category_id}
                    onChange={handleChange}
                    className={`border p-2 rounded w-full ${
                      errors.qualification_category_id
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Qualification Category</option>
                    {qualificationCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.category}
                      </option>
                    ))}
                  </select>
                  {errors.qualification_category_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.qualification_category_id}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="qualification_subcategory_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Qualification Subcategory
                  </label>
                  <select
                    name="qualification_subcategory_id"
                    id="qualification_subcategory_id"
                    value={form.qualification_subcategory_id}
                    onChange={handleChange}
                    className={`border p-2 rounded w-full ${
                      errors.qualification_subcategory_id
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                    disabled={!form.qualification_category_id}
                  >
                    <option value="">Select Qualification Subcategory</option>
                    {qualificationSubcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.subcategory}
                      </option>
                    ))}
                  </select>
                  {errors.qualification_subcategory_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.qualification_subcategory_id}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Key Skills</label>
              <div className="mt-2">
                <TagsInput
                  value={form.skills}
                  onChange={(v) => setForm((s) => ({ ...s, skills: v }))}
                  placeholder="Add skill and press Add"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Labels / Tags
              </label>
              <div className="mt-2">
                <TagsInput
                  value={form.labels}
                  onChange={(v) => setForm((s) => ({ ...s, labels: v }))}
                  placeholder="Remote, Urgent, etc."
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter job description here..."
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
                rows={6}
                required
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Responsibilities
              </label>
              <textarea
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="Enter responsibilities here..."
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
                rows={4}
                required
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Qualifications
              </label>
              <textarea
                value={form.qualifications}
                onChange={(e) =>
                  setForm((s) => ({ ...s, qualifications: e.target.value }))
                }
                rows={4}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="md:col-span-3">
              <h3 className="text-sm font-medium text-gray-800 mt-4">
                Walk-in Details (optional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                <div>
                  <label className="text-sm text-gray-600">Start Date</label>
                  <input
                    type="date"
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        walkin_details: {
                          ...(s.walkin_details || {}),
                          start_date: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 w-full rounded border border-gray-200 p-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Duration (days)</label>
                  <input
                    type="number"
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        walkin_details: {
                          ...(s.walkin_details || {}),
                          duration_days: Number(e.target.value),
                        },
                      }))
                    }
                    className="mt-1 w-full rounded border border-gray-200 p-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Timing</label>
                  <input
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        walkin_details: {
                          ...(s.walkin_details || {}),
                          timing: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 w-full rounded border border-gray-200 p-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Contact Person</label>
                  <input
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        walkin_details: {
                          ...(s.walkin_details || {}),
                          contact_person: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 w-full rounded border border-gray-200 p-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Contact Number</label>
                  <input
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        walkin_details: {
                          ...(s.walkin_details || {}),
                          contact_number: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 w-full rounded border border-gray-200 p-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Venue</label>
                  <input
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        walkin_details: {
                          ...(s.walkin_details || {}),
                          venue: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 w-full rounded border border-gray-200 p-2"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-sm text-gray-600">Google Map URL</label>
                  <input
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        walkin_details: {
                          ...(s.walkin_details || {}),
                          google_map_url: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 w-full rounded border border-gray-200 p-2"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <h3 className="text-sm font-medium text-gray-800 mt-4">
                Candidate Questions
              </h3>
              <div className="flex gap-2 mt-2">
                <input
                  className="flex-1 rounded border border-gray-200 p-2"
                  placeholder="Question text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
                <select
                  className="rounded border border-gray-200 p-2"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="radio">Radio</option>
                </select>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-3 py-2 bg-indigo-600 text-white rounded"
                >
                  Add
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {form.questions.map((q, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded p-2"
                  >
                    <div className="text-sm text-gray-700">
                      {q.question}{' '}
                      <span className="text-xs text-gray-500">({q.type})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(i)}
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {msg && <div className="mt-4 text-sm text-red-600">{msg}</div>}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={preview}
              className="px-4 py-2 border rounded"
            >
              Preview
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {submitting ? 'Creating…' : 'Create Job'}
            </button>
          </div>
        </form>
        {previewHtml && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setPreviewHtml(null)}
          >
            <div
              className="bg-white rounded-lg max-w-4xl w-full mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">Preview</h3>
                <button
                  onClick={() => setPreviewHtml(null)}
                  className="text-gray-500 text-xl"
                >
                  ×
                </button>
              </div>
              <div
                className="mt-4 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}