'use client';

import React, { useEffect, useRef, useState } from 'react';

function TagsInput({ value = [], onChange, placeholder = 'Add tag' }) {
  const [text, setText] = useState('');
  function add() {
    const v = text.trim();
    if (!v) return;
    if (!value.includes(v)) onChange([...value, v]);
    setText('');
  }
  function remove(tag) {
    onChange(value.filter(x => x !== tag));
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
            <span>{t}</span>
            <button type="button" onClick={() => remove(t)} className="text-gray-500 hover:text-gray-700">×</button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          className="flex-1 rounded border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-indigo-100"
        />
        <button type="button" onClick={add} className="px-3 py-2 bg-indigo-600 text-white rounded">Add</button>
      </div>
    </div>
  );
}

export default function CreateJobPage() {
  const containerRef = useRef(null);   
  const quillRef = useRef(null);      
  const quillLoadedRef = useRef(false); 

  const [description, setDescription] = useState('');
  const [form, setForm] = useState({
    company_id: '',
    title: '',
    role: '',
    function_area: '',
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
    skills: [],
    labels: [],
    questions: [],
    walkin_details: null,
    receive_matching_email: false,
    share_with_subusers: false
  });

  const [storedCompany, setStoredCompany] = useState(null);
  const [useStoredCompany, setUseStoredCompany] = useState(true);

  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('text');
  const [msg, setMsg] = useState('');
  const [previewHtml, setPreviewHtml] = useState(null);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {

    if (typeof window === 'undefined') return;
    if (!containerRef.current) return;
    if (quillLoadedRef.current) return;

    let qInstance;
    let QuillModule;

    async function initQuill() {
      try {

        QuillModule = (await import('quill')).default;

        await import('quill/dist/quill.snow.css');

        const quillModulesBase = {
          toolbar: {
            container: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          },
        };

        const modules = {
          ...quillModulesBase,
          toolbar: {
            ...quillModulesBase.toolbar,
            handlers: {
              image: function () {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();
                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (!file) return;

                  const base = process.env.NEXT_PUBLIC_API_URL || '';
                  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

                  try {
                    const fd = new FormData();
                    fd.append('file', file);
                    const res = await fetch(`${base}/api/upload`, {
                      method: 'POST',
                      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                      body: fd,
                    });
                    if (!res.ok) throw new Error('upload failed');
                    const d = await res.json();
                    const url = d.url;
                    const range = this.quill.getSelection(true);
                    this.quill.insertEmbed(range.index, 'image', url);
                    this.quill.setSelection(range.index + 1);
                    return;
                  } catch (err) {
            
                    const reader = new FileReader();
                    reader.onload = () => {
                      const url = reader.result;
                      const range = this.quill.getSelection(true);
                      this.quill.insertEmbed(range.index, 'image', url);
                      this.quill.setSelection(range.index + 1);
                    };
                    reader.readAsDataURL(file);
                  }
                };
              }
            }
          }
        };

       
        qInstance = new QuillModule(containerRef.current, {
          theme: 'snow',
          modules,
        });

       
        quillRef.current = qInstance;
        quillLoadedRef.current = true;

        const onChange = () => setDescription(qInstance.root.innerHTML || '');
        qInstance.on('text-change', onChange);

     
        if (description) qInstance.root.innerHTML = description;

      } catch (err) {
        console.error('Quill load/init error:', err);
      }
    }

    initQuill();

    
    return () => {
      try {
        if (quillRef.current) {
          try { quillRef.current.off && quillRef.current.off('text-change'); } catch {}
          quillRef.current = null;
        }
        if (containerRef.current) containerRef.current.innerHTML = '';
      } catch (e) {
   
      }
    };
  }, []); 

  useEffect(() => {
    (async () => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('company') : null;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.id) {
            setStoredCompany(parsed);
            setForm(f => ({ ...f, company_id: parsed.id }));
            setUseStoredCompany(true);
            return;
          }
        }
      } catch (e) {
   
      }

     
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) { setUseStoredCompany(false); return; }
        const base = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${base}/api/company/my`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) { setUseStoredCompany(false); return; }
        const d = await res.json();
        if (d?.company_id) {
          setForm(f => ({ ...f, company_id: d.company_id }));
        }
      } catch (e) {
        setUseStoredCompany(false);
      }
    })();
  }, []);

  function addQuestion() {
    const q = questionText.trim();
    if (!q) return;
    setForm(f => ({ ...f, questions: [...f.questions, { question: q, type: questionType, options: [] }] }));
    setQuestionText('');
    setQuestionType('text');
  }

  function removeQuestion(idx) {
    setForm(s => ({ ...s, questions: s.questions.filter((_, i) => i !== idx) }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('');

    if (!form.company_id) { setMsg('Company required'); return; }
    if (!form.title || !form.title.trim()) { setMsg('Job title required'); return; }

    setSubmitting(true);

    const payload = {
      ...form,
      description: { html: description || '' },
      experience_min: form.experience_min ? Number(form.experience_min) : null,
      experience_max: form.experience_max ? Number(form.experience_max) : null,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      vacancies: form.vacancies ? Number(form.vacancies) : 1
    };

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // if (!token) { setMsg('Not authenticated'); setSubmitting(false); return; }

      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`http://localhost:5000/api/jobs/createJob`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = text; }

      if (!res.ok) {
        setMsg(data?.message || 'Server error creating job');
        setSubmitting(false);
        return;
      }

      alert('Job created: ' + (data?.jobId ?? 'OK'));
      window.location.href = '/recruiterDashboard';
    } catch (err) {
      console.error(err);
      setMsg('Network error');
    } finally {
      setSubmitting(false);
    }
  }

  function preview() {
    setPreviewHtml(description || '<p><i>No description</i></p>');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Company selector UI
  const CompanySelector = () => {
    if (storedCompany && useStoredCompany) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex-1">
              <select className="w-full rounded border border-gray-200 p-2 bg-gray-50" value={storedCompany.id} disabled>
                <option value={storedCompany.id}>{storedCompany.name}</option>
              </select>
            </div>
            <button
              type="button"
              className="px-3 py-2 border rounded text-sm"
              onClick={() => {
                setUseStoredCompany(false);
                setForm(f => ({ ...f, company_id: '' }));
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
        <label className="block text-sm font-medium text-gray-700">Company ID</label>
        <input
          value={form.company_id || ''}
          onChange={e => setForm(s => ({ ...s, company_id: e.target.value }))}
          placeholder="Enter company ID or register a company"
          required
          className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100"
        />
        <div className="mt-2 text-sm text-gray-500">
          Don't have a company? <a href="/register-company" className="text-indigo-600 underline">Register your company</a>.
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">Post a Job</h1>
        <p className="text-sm text-gray-600 mb-6">Create a job listing. Use the editor to add a formatted job description and images.</p>

        <form className="bg-white shadow rounded p-6" onSubmit={onSubmit}>
          <CompanySelector />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} placeholder="Senior Frontend Engineer"
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Vacancies</label>
              <input type="number" min="1" value={form.vacancies} onChange={e => setForm(s => ({ ...s, vacancies: Number(e.target.value) }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            {/* ...rest of the inputs (same as earlier) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input value={form.role} onChange={e => setForm(s => ({ ...s, role: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Function / Area</label>
              <input value={form.function_area} onChange={e => setForm(s => ({ ...s, function_area: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input value={form.location} onChange={e => setForm(s => ({ ...s, location: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Employment Type</label>
              <select value={form.employment_type} onChange={e => setForm(s => ({ ...s, employment_type: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Work From Home</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Experience Min (years)</label>
              <input type="number" min="0" value={form.experience_min || ''} onChange={e => setForm(s => ({ ...s, experience_min: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Experience Max (years)</label>
              <input type="number" min="0" value={form.experience_max || ''} onChange={e => setForm(s => ({ ...s, experience_max: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Salary Min (INR)</label>
              <input type="number" value={form.salary_min || ''} onChange={e => setForm(s => ({ ...s, salary_min: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Salary Max (INR)</label>
              <input type="number" value={form.salary_max || ''} onChange={e => setForm(s => ({ ...s, salary_max: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div className="md:col-span-3 flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 mt-2">
                <input type="checkbox" checked={form.hide_salary} onChange={e => setForm(s => ({ ...s, hide_salary: e.target.checked }))} className="rounded" />
                <span className="text-sm text-gray-700">Hide salary</span>
              </label>

              <label className="inline-flex items-center gap-2 mt-2">
                <input type="checkbox" checked={form.receive_matching_email} onChange={e => setForm(s => ({ ...s, receive_matching_email: e.target.checked }))} className="rounded" />
                <span className="text-sm text-gray-700">Receive matching applicants</span>
              </label>

              <label className="inline-flex items-center gap-2 mt-2">
                <input type="checkbox" checked={form.share_with_subusers} onChange={e => setForm(s => ({ ...s, share_with_subusers: e.target.checked }))} className="rounded" />
                <span className="text-sm text-gray-700">Share with sub-users</span>
              </label>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Education</label>
              <input value={form.education} onChange={e => setForm(s => ({ ...s, education: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <input value={form.industry} onChange={e => setForm(s => ({ ...s, industry: e.target.value }))}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Key Skills</label>
              <div className="mt-2">
                <TagsInput value={form.skills} onChange={v => setForm(s => ({ ...s, skills: v }))} placeholder="Add skill and press Add" />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Labels / Tags</label>
              <div className="mt-2">
                <TagsInput value={form.labels} onChange={v => setForm(s => ({ ...s, labels: v }))} placeholder="Remote, Urgent, etc." />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Job Description</label>
              <div className="mt-2 border border-gray-200 rounded bg-white p-2">
                <div ref={containerRef} style={{ minHeight: 200 }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Tip: editor content is synced automatically.</p>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
              <textarea value={form.responsibilities} onChange={e => setForm(s => ({ ...s, responsibilities: e.target.value }))} rows={4}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Qualifications</label>
              <textarea value={form.qualifications} onChange={e => setForm(s => ({ ...s, qualifications: e.target.value }))} rows={4}
                className="mt-1 w-full rounded border border-gray-200 p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div className="md:col-span-3">
              <h3 className="text-sm font-medium text-gray-800 mt-4">Walk-in Details (optional)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                <div>
                  <label className="text-sm text-gray-600">Start Date</label>
                  <input type="date" onChange={e => setForm(s => ({ ...s, walkin_details: { ...(s.walkin_details || {}), start_date: e.target.value } }))}
                    className="mt-1 w-full rounded border border-gray-200 p-2" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Duration (days)</label>
                  <input type="number" onChange={e => setForm(s => ({ ...s, walkin_details: { ...(s.walkin_details || {}), duration_days: Number(e.target.value) } }))}
                    className="mt-1 w-full rounded border border-gray-200 p-2" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Timing</label>
                  <input onChange={e => setForm(s => ({ ...s, walkin_details: { ...(s.walkin_details || {}), timing: e.target.value } }))}
                    className="mt-1 w-full rounded border border-gray-200 p-2" />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Contact Person</label>
                  <input onChange={e => setForm(s => ({ ...s, walkin_details: { ...(s.walkin_details || {}), contact_person: e.target.value } }))}
                    className="mt-1 w-full rounded border border-gray-200 p-2" />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Contact Number</label>
                  <input onChange={e => setForm(s => ({ ...s, walkin_details: { ...(s.walkin_details || {}), contact_number: e.target.value } }))}
                    className="mt-1 w-full rounded border border-gray-200 p-2" />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Venue</label>
                  <input onChange={e => setForm(s => ({ ...s, walkin_details: { ...(s.walkin_details || {}), venue: e.target.value } }))}
                    className="mt-1 w-full rounded border border-gray-200 p-2" />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-sm text-gray-600">Google Map URL</label>
                  <input onChange={e => setForm(s => ({ ...s, walkin_details: { ...(s.walkin_details || {}), google_map_url: e.target.value } }))}
                    className="mt-1 w-full rounded border border-gray-200 p-2" />
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-sm font-medium text-gray-800 mt-4">Candidate Questions</h3>
              <div className="flex gap-2 mt-2">
                <input className="flex-1 rounded border border-gray-200 p-2" placeholder="Question text" value={questionText} onChange={e => setQuestionText(e.target.value)} />
                <select className="rounded border border-gray-200 p-2" value={questionType} onChange={e => setQuestionType(e.target.value)}>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="radio">Radio</option>
                </select>
                <button type="button" onClick={addQuestion} className="px-3 py-2 bg-indigo-600 text-white rounded">Add</button>
              </div>

              <ul className="mt-3 space-y-2">
                {form.questions.map((q, i) => (
                  <li key={i} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded p-2">
                    <div className="text-sm text-gray-700">{q.question} <span className="text-xs text-gray-500">({q.type})</span></div>
                    <button type="button" onClick={() => removeQuestion(i)} className="text-sm text-red-600">Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {msg && <div className="mt-4 text-sm text-red-600">{msg}</div>}

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={preview} className="px-4 py-2 border rounded">Preview</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded">
              {submitting ? 'Creating…' : 'Create Job'}
            </button>
          </div>
        </form>

        {previewHtml && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setPreviewHtml(null)}>
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">Preview</h3>
                <button onClick={() => setPreviewHtml(null)} className="text-gray-500 text-xl">×</button>
              </div>
              <div className="mt-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
