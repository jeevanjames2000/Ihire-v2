'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, MapPin, Briefcase, DollarSign, Send, X } from 'lucide-react';

import debounce from 'lodash/debounce';
const MultiSelect = ({ value = [], onValueChange, options, placeholder, className, required }) => {
  const [selectedValues, setSelectedValues] = useState(value);
  const handleSelect = (newValue) => {
    if (selectedValues.includes(newValue)) {
      const updated = selectedValues.filter(v => v !== newValue);
      setSelectedValues(updated);
      onValueChange(updated);
    } else {
      const updated = [...selectedValues, newValue];
      setSelectedValues(updated);
      onValueChange(updated);
    }
  };
  const removeValue = (valueToRemove) => {
    const updated = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(updated);
    onValueChange(updated);
  };
  return (
    <div className={`space-y-2  ${className}`}>
      <Select onValueChange={handleSelect} value="">
        <SelectTrigger className="border-slate-300  focus:border-blue-600 focus:ring-blue-600 rounded-xl">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className='bg-white'>
          {options.map((option) => (
            <SelectItem 
              key={option} 
              value={option}
              className={selectedValues.includes(option) ? 'bg-blue-50 bg-white text-blue-700' : ''}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedValues.map((value) => (
            <div
              key={value}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm"
            >
              {value}
              <button
                type="button"
                onClick={() => removeValue(value)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const ApplyJobModal = ({ jobId, isOpen, onClose }) => {
    console.log("jobId: ", jobId);
 
  const [job, setJob] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fetchJobData = useCallback(async () => {
    if (!jobId || !isOpen) return;
    setLoading(true);
    setError(null);
    setFormErrors({});
    try {
      const [jobRes, formRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/getJobById?id=${jobId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          mode: 'cors',
          credentials: 'include',
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/getJobDynamicForm?job_id=${jobId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          mode: 'cors',
          credentials: 'include',
        }),
      ]);
      if (!jobRes.ok) {
        const errorText = await jobRes.text();
        throw new Error(`Failed to fetch job: ${jobRes.statusText} (${errorText})`);
      }
      const jobData = await jobRes.json();
      setJob({
        ...jobData,
        title: jobData.title || 'Untitled Job',
        company: jobData.company || 'Unknown Company',
        location: jobData.location || 'Not specified',
        salary: jobData.salary || 'Not specified',
        type: jobData.type || 'Not specified',
      });
      if (!formRes.ok) {
        const errorText = await formRes.text();
        throw new Error(`Failed to fetch form fields: ${formRes.statusText} (${errorText})`);
      }
      const formDataResponse = await formRes.json();
      if (formDataResponse.message === 'Job not found') {
        throw new Error('Job not found');
      }
      const fields = formDataResponse.form_fields || [];
      setFormFields(fields);
      const initialFormData = {};
      fields.forEach((field) => {
        if (field.field_type === 'checkbox' || (field.field_type === 'select' && field.is_multi)) {
          initialFormData[field.field_id] = [];
        } else if (field.field_type === 'radio') {
          initialFormData[field.field_id] = '';
        } else {
          initialFormData[field.field_id] = '';
        }
      });
      setFormData(initialFormData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [jobId, isOpen]);
  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);
  const debouncedHandleInputChange = useMemo(
    () =>
      debounce((fieldId, value, type, isMulti) => {
        setFormData((prev) => {
          if (type === 'checkbox' || (type === 'select' && isMulti)) {
            const currentValues = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
            if (currentValues.includes(value)) {
              return { ...prev, [fieldId]: currentValues.filter((v) => v !== value) };
            } else {
              return { ...prev, [fieldId]: [...currentValues, value] };
            }
          }
          return { ...prev, [fieldId]: value };
        });
        setFormErrors((prev) => {
          const field = formFields.find((f) => f.field_id === fieldId);
          if (field?.is_required) {
            if (!value || (Array.isArray(value) && value.length === 0)) {
              return { ...prev, [fieldId]: `${field.field_label} is required` };
            }
          }
          if (field?.field_type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return { ...prev, [fieldId]: 'Invalid email format' };
          }
          if (field?.field_type === 'number' && value && isNaN(Number(value))) {
            return { ...prev, [fieldId]: 'Must be a valid number' };
          }
          const { [fieldId]: _, ...rest } = prev;
          return rest;
        });
      }, 300),
    [formFields]
  );
  const handleInputChange = (fieldId, value, type, isMulti = false) => {
  setFormData((prev) => {
    if (type === 'checkbox' || (type === 'select' && isMulti)) {
      const currentValues = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      if (currentValues.includes(value)) {
        return { ...prev, [fieldId]: currentValues.filter((v) => v !== value) };
      } else {
        return { ...prev, [fieldId]: [...currentValues, value] };
      }
    }
    return { ...prev, [fieldId]: value };
  });

  // Validate immediately (optional)
  const field = formFields.find((f) => f.field_id === fieldId);
  if (!field) return;

  setFormErrors((prev) => {
    if (field.is_required && (!value || (Array.isArray(value) && value.length === 0))) {
      return { ...prev, [fieldId]: `${field.field_label} is required` };
    }
    if (field.field_type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return { ...prev, [fieldId]: 'Invalid email format' };
    }
    if (field.field_type === 'number' && value && isNaN(Number(value))) {
      return { ...prev, [fieldId]: 'Must be a valid number' };
    }
    const { [fieldId]: _, ...rest } = prev;
    return rest;
  });
};

  const handleMultiSelectChange = (fieldId, values) => {
    setFormData((prev) => ({ ...prev, [fieldId]: values }));
    setFormErrors((prev) => {
      const field = formFields.find((f) => f.field_id === fieldId);
      if (field?.is_required && (!values || values.length === 0)) {
        return { ...prev, [fieldId]: `${field.field_label} is required` };
      }
      const { [fieldId]: _, ...rest } = prev;
      return rest;
    });
  };
  const handleFileChange = (fieldId, files) => {
    const file = files[0];
    setFormData((prev) => ({ ...prev, [fieldId]: file }));
    setFormErrors((prev) => {
      const field = formFields.find((f) => f.field_id === fieldId);
      if (field?.is_required && !file) {
        return { ...prev, [fieldId]: `${field.field_label} is required` };
      }
      if (file && !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        return { ...prev, [fieldId]: 'Only PDF, DOC, or DOCX files are allowed' };
      }
      if (file && file.size > 5 * 1024 * 1024) {
        return { ...prev, [fieldId]: 'File size must be less than 5MB' };
      }
      const { [fieldId]: _, ...rest } = prev;
      return rest;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const errors = {};
    formFields.forEach((field) => {
      const value = formData[field.field_id];
      if (field.is_required) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          errors[field.field_id] = `${field.field_label} is required`;
        }
      }
      if (field.field_type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[field.field_id] = 'Invalid email format';
      }
      if (field.field_type === 'number' && value && isNaN(Number(value))) {
        errors[field.field_id] = 'Must be a valid number';
      }
      if (field.field_type === 'file' && value) {
        if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type)) {
          errors[field.field_id] = 'Only PDF, DOC, or DOCX files are allowed';
        }
        if (value.size > 5 * 1024 * 1024) {
          errors[field.field_id] = 'File size must be less than 5MB';
        }
      }
    });
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
     
      setSubmitting(false);
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('job_id', jobId);
      formDataToSend.append('candidate_id', '1');
      const responses = [];
      formFields.forEach((field) => {
        const value = formData[field.field_id];
        if (field.field_type === 'file' && value instanceof File) {
          formDataToSend.append(`file_${field.field_id}`, value);
          responses.push({
            field_id: field.field_id,
            field_value: value.name,
            field_type: field.field_type
          });
        } else {
          let processedValue = value;
          if (Array.isArray(value)) {
            processedValue = JSON.stringify(value);
          }
          responses.push({
            field_id: field.field_id,
            field_value: processedValue,
            field_type: field.field_type
          });
        }
      });
      formDataToSend.append('responses', JSON.stringify(responses));
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/createAndSubmitApplication`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit application: ${errorText}`);
      }
      const result = await response.json();
    
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
    
    } finally {
      setSubmitting(false);
    }
  };
  const renderField = useCallback(
    (field) => {
      const { field_id, field_label, field_type, is_required, field_options, is_multi } = field;
      const error = formErrors[field_id];
      const value = formData[field_id] || '';
      const inputProps = {
        id: `field-${field_id}`,
        name: `field-${field_id}`,
        className: `border-slate-300 focus:border-blue-600 focus:ring-blue-600 rounded-xl ${error ? 'border-red-500' : ''}`,
        required: is_required,
      };
      switch (field_type) {
        case 'text':
        case 'email':
        case 'number':
        case 'date':
          return (
            <div key={field_id} className="space-y-2">
              <Label htmlFor={inputProps.id} className="text-slate-700 font-medium">
                {field_label} {is_required ? <span className="text-red-500">*</span> : null}
              </Label>
              <Input
                {...inputProps}
                type={field_type}
                value={value}
                onChange={(e) => handleInputChange(field_id, e.target.value, field_type)}
                placeholder={`Enter ${field_label.toLowerCase()}`}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          );
        case 'textarea':
          return (
            <div key={field_id} className="space-y-2">
              <Label htmlFor={inputProps.id} className="text-slate-700 font-medium">
                {field_label} {is_required ? <span className="text-red-500">*</span> : null}
              </Label>
              <Textarea
                {...inputProps}
                value={value}
                onChange={(e) => handleInputChange(field_id, e.target.value, field_type)}
                placeholder={`Enter ${field_label.toLowerCase()}`}
                rows={5}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          );
        case 'select':
          if (is_multi) {
            return (
              <div key={field_id} className="space-y-2">
                <Label htmlFor={inputProps.id} className="text-slate-700 font-medium">
                  {field_label} {is_required ? <span className="text-red-500">*</span> : null}
                </Label>
                <MultiSelect
                  value={Array.isArray(value) ? value : []}
                  onValueChange={(values) => handleMultiSelectChange(field_id, values)}
                  options={field_options || []}
                  placeholder={`Select ${field_label.toLowerCase()}(s)`}
                  required={is_required}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            );
          } else {
            return (
              <div key={field_id} className="space-y-2">
                <Label htmlFor={inputProps.id} className="text-slate-700 font-medium">
                  {field_label} {is_required ? <span className="text-red-500">*</span> : null}
                </Label>
                <Select
                  value={value}
                  onValueChange={(selectedValue) => handleInputChange(field_id, selectedValue, field_type)}
                  required={is_required}
                >
                  <SelectTrigger className={inputProps.className}>
                    <SelectValue placeholder={`Select ${field_label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {field_options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            );
          }
        case 'radio':
          return (
            <div key={field_id} className="space-y-2">
              <Label className="text-slate-700 font-medium">
                {field_label} {is_required ? <span className="text-red-500">*</span> : null}
              </Label>
              <div className="flex flex-wrap gap-4">
                {field_options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`field-${field_id}-${option}`}
                      name={inputProps.name}
                      value={option}
                      checked={value === option}
                      onChange={(e) => handleInputChange(field_id, e.target.value, field_type)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-slate-300"
                      required={is_required}
                    />
                    <Label htmlFor={`field-${field_id}-${option}`} className="text-slate-700">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          );
        case 'checkbox':
          return (
            <div key={field_id} className="space-y-2">
              <Label className="text-slate-700 font-medium">
                {field_label} {is_required ? <span className="text-red-500">*</span> : null}
              </Label>
              <div className="flex flex-wrap gap-4">
                {field_options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`field-${field_id}-${option}`}
                      checked={Array.isArray(value) ? value.includes(option) : false}
                      onCheckedChange={() => handleInputChange(field_id, option, field_type)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-slate-300"
                    />
                    <Label htmlFor={`field-${field_id}-${option}`} className="text-slate-700">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          );
        case 'file':
          return (
            <div key={field_id} className="space-y-2">
              <Label htmlFor={inputProps.id} className="text-slate-700 font-medium">
                {field_label} {is_required ? <span className="text-red-500">*</span> : null}
              </Label>
              <Input
                {...inputProps}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(field_id, e.target.files)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          );
        default:
          return (
            <div key={field_id} className="space-y-2">
              <Label htmlFor={inputProps.id} className="text-slate-700 font-medium">
                {field_label} {is_required ? <span className="text-red-500">*</span> : null}
              </Label>
              <Input
                {...inputProps}
                type="text"
                value={value}
                onChange={(e) => handleInputChange(field_id, e.target.value, 'text')}
                placeholder={`Enter ${field_label.toLowerCase()}`}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          );
      }
    },
    [formData, formErrors, handleInputChange, handleFileChange, handleMultiSelectChange]
  );
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-xl p-0">
        {loading ? (
          <div className="p-6 text-center text-slate-600">Loading...</div>
        ) : error || !job ? (
          <div className="p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Job not found'}</p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
           
            <DialogHeader className="px-6 pt-6">
              
              <DialogTitle className="text-2xl font-bold text-slate-900">
                Apply for {job.title}
              </DialogTitle>
              <div className="flex items-center gap-2 text-slate-600 mb-4">
                <Building2 className="h-5 w-5" />
                <span className="text-lg font-medium">{job.company}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium">
                  <Briefcase className="h-4 w-4" />
                  {job.type}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
                  <DollarSign className="h-4 w-4" />
                  {job.salary}
                </span>
              </div>
            </DialogHeader>
            <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">
                {formFields.length > 0 ? (
                  formFields
                    .sort((a, b) => (a.order_no || 0) - (b.order_no || 0))
                    .map((field) => renderField(field))
                ) : (
                  <p className="text-slate-500">No form fields available for this job.</p>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-300 text-slate-600 hover:bg-slate-100 rounded-xl"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || loading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                    <Send className="h-5 w-5" />
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </>
        )}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};
export default ApplyJobModal;