"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchCompanyProfile,
  saveCompanyProfile,
  clearCompanyError,
  clearCompanySuccess,
} from "../../../../store/companySlice.js";
import { fetchUserInfo, logoutUser } from "../../../../store/userSlice.js";
import { useRouter } from "next/navigation.js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select ,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const selectAuth = createSelector(
  [(state) => state.user],
  (user) => ({
    userInfo: user.userInfo || null,
    userType: user.userType || null,
    error: user.error || null,
  })
);

// CompanyMetaCard Component
const CompanyMetaCard = ({ formData, handleInputChange, industries, companySizes }) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h4 className="text-lg font-semibold text-foreground mb-4">Basic Information</h4>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-lg font-medium">
            Company Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Tech Corp"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="about" className="text-lg font-medium">
            About
          </Label>
          <Textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            placeholder="Brief overview of your company (max 500 characters)"
            className="mt-1"
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="description" className="text-lg font-medium">
            Detailed Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Detailed description of your company (max 1000 characters)"
            className="mt-1"
            rows={6}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="industry" className="text-lg font-medium">
              Industry <span className="text-destructive">*</span>
            </Label>
            <Select name="industry" value={formData.industry} onValueChange={(value) => handleInputChange({ target: { name: "industry", value } })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem className="bg-white p-2" key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="employeeSize" className="text-lg font-medium">
              Company Size
            </Label>
            <Select name="employeeSize" value={formData.employeeSize} onValueChange={(value) => handleInputChange({ target: { name: "employeeSize", value } })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent className="bg-white p-2">
                {companySizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="established" className="text-lg font-medium">
              Founded Year
            </Label>
            <Input
              type="number"
              id="established"
              name="established"
              value={formData.established}
              onChange={handleInputChange}
              placeholder="e.g., 2000"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-lg font-medium">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Mumbai, Maharashtra"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="headquarters" className="text-lg font-medium">
              Headquarters
            </Label>
            <Input
              id="headquarters"
              name="headquarters"
              value={formData.headquarters}
              onChange={handleInputChange}
              placeholder="e.g., Bangalore, Karnataka"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// CompanyInfoCard Component
const CompanyInfoCard = ({ formData, handleInputChange, handleSocialLinkChange }) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h4 className="text-lg font-semibold text-foreground mb-4">Contact Information</h4>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="website" className="text-lg font-medium">
              Website
            </Label>
            <Input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="e.g., https://yourcompany.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-lg font-medium">
              Contact Email <span className="text-destructive">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="e.g., hr@yourcompany.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-lg font-medium">
              Contact Phone
            </Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="e.g., +91 9876543210"
              className="mt-1"
            />
          </div>
        </div>
        <h5 className="text-md font-semibold text-foreground mt-4">Social Media</h5>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="linkedin" className="text-lg font-medium">
              LinkedIn
            </Label>
            <Input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.socialLinks.linkedin}
              onChange={handleSocialLinkChange}
              placeholder="e.g., https://linkedin.com/company/yourcompany"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="twitter" className="text-lg font-medium">
              Twitter
            </Label>
            <Input
              type="url"
              id="twitter"
              name="twitter"
              value={formData.socialLinks.twitter}
              onChange={handleSocialLinkChange}
              placeholder="e.g., https://twitter.com/yourcompany"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="facebook" className="text-lg font-medium">
              Facebook
            </Label>
            <Input
              type="url"
              id="facebook"
              name="facebook"
              value={formData.socialLinks.facebook}
              onChange={handleSocialLinkChange}
              placeholder="e.g., https://facebook.com/yourcompany"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// CompanyContactCard Component
const CompanyContactCard = ({
  formData,
  logoPreview,
  documentPreviews,
  documentTypes,
  handleFileChange,
  handleDocumentChange,
  handleDocumentTypeChange,
  addDocumentField,
  removeDocumentField,
  documentTypesOptions,
}) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h4 className="text-lg font-semibold text-foreground mb-4">Logo & Verification Documents</h4>
      <div className="space-y-4">
        <div>
          <Label htmlFor="logo" className="text-lg font-medium">
            Company Logo (PNG/JPG, max 5MB)
          </Label>
          <div className="mt-1 flex items-center">
            <Button variant="outline" asChild className="cursor-pointer">
              <label htmlFor="logo">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V8m0 0L3 12m4-4l4 4m6 4v6m-6-6h12"
                  />
                </svg>
                Upload Logo
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg"
                  className="hidden"
                />
              </label>
            </Button>
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="ml-4 h-16 w-16 rounded-full object-cover border border-border"
              />
            )}
          </div>
        </div>
        <div>
          <h5 className="text-md font-semibold text-foreground">Verification Documents</h5>
          <p className="text-lg text-muted-foreground">
            Upload documents to verify your company (PDF, JPG, PNG, max 10MB each, up to 5 documents).
          </p>
          {formData.documents.map((doc, index) => (
            <div key={index} className="flex items-center space-x-4 mt-4">
              <div className="flex-1">
                <Label htmlFor={`documentType-${index}`} className="text-lg font-medium">
                  Document Type
                </Label>
                <Select
                  value={documentTypes[index] || ""}
                  onValueChange={(value) => handleDocumentTypeChange({ target: { value } }, index)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypesOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor={`document-${index}`} className="text-lg font-medium">
                  Upload Document
                </Label>
                <div className="mt-1 flex items-center">
                  <Button variant="outline" asChild className="cursor-pointer">
                    <label htmlFor={`document-${index}`}>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16V8m0 0L3 12m4-4l4 4m6 4v6m-6-6h12"
                        />
                      </svg>
                      Choose File
                      <input
                        type="file"
                        id={`document-${index}`}
                        onChange={(e) => handleDocumentChange(e, index)}
                        accept="application/pdf,image/png,image/jpeg"
                        className="hidden"
                      />
                    </label>
                  </Button>
                  {documentPreviews[index]?.url && (
                    <span className="ml-4 text-lg text-muted-foreground">
                      {documentPreviews[index].url.split("/").pop()}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeDocumentField(index)}
                className="text-destructive hover:text-destructive"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
          ))}
          {documentPreviews.length > 0 && (
            <div className="mt-4">
              <h5 className="text-lg font-medium text-foreground">Uploaded Documents</h5>
              <ul className="mt-2 space-y-2">
                {documentPreviews.map(
                  (preview, index) =>
                    preview && (
                      <li key={index} className="flex items-center justify-between">
                        <div>
                          <span className="text-lg text-muted-foreground">
                            {preview.type
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                          <span className="ml-2 text-lg text-muted-foreground">
                            (Status: {preview.status})
                          </span>
                        </div>
                        <a
                          href={preview.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View
                        </a>
                      </li>
                    )
                )}
              </ul>
            </div>
          )}
          <Button variant="outline" onClick={addDocumentField}>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Document
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main CmpProfile Component
const CmpProfile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userInfo, userType, error: userError } = useSelector(selectAuth);
  const { profile, loading, error: companyError, success } = useSelector((state) => state.company);

  const [formData, setFormData] = useState({
    name: "",
    about: "",
    description: "",
    location: "",
    headquarters: "",
    industry: "",
    website: "",
    email: "",
    phone: "",
    employeeSize: "",
    established: "",
    socialLinks: { linkedin: "", twitter: "", facebook: "" },
    documents: [],
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    if (!userInfo && localStorage.getItem("token")) {
      dispatch(fetchUserInfo());
    }
    if (userInfo && userType === "employer") {
      dispatch(fetchCompanyProfile());
    }
  }, [dispatch, userInfo, userType]);

  useEffect(() => {
    if (userError) {
      toast.error(userError, { theme: "colored" });
      if (userError === "Invalid or expired token" || userError === "No token found") {
        dispatch(logoutUser());
        router.push("/login");
      }
    }
  }, [userError, dispatch, router]);

  useEffect(() => {
    const initialFormData = {
      name: userInfo?.company_name || userInfo?.name || "",
      about: "",
      description: "",
      location: "",
      headquarters: "",
      industry: "",
      website: "",
      email: userInfo?.email || "",
      phone: userInfo?.mobile || "",
      employeeSize: "",
      established: "",
      socialLinks: { linkedin: "", twitter: "", facebook: "" },
      documents: [],
    };

    if (profile) {
      setFormData({
        name: profile.name || initialFormData.name,
        about: profile.about || "",
        description: profile.description || "",
        location: profile.location || "",
        headquarters: profile.headquarters || "",
        industry: profile.industry || "",
        website: profile.website || "",
        email: profile.email || initialFormData.email,
        phone: profile.phone || initialFormData.phone,
        employeeSize: profile.employeeSize || "",
        established: profile.established || "",
        socialLinks: profile.socialLinks || initialFormData.socialLinks,
        documents: [],
      });
      setLogoPreview(profile.logo ? `http://localhost:5000/${profile.logo}` : null);
      setDocumentPreviews(
        profile.documents?.map((doc) => ({
          url: `http://localhost:5000/${doc.filePath}`,
          type: doc.type,
          status: doc.status,
        })) || []
      );
    } else {
      setFormData(initialFormData);
    }
  }, [profile, userInfo]);

  useEffect(() => {
    if (companyError) {
      toast.error(companyError, { theme: "colored" });
      dispatch(clearCompanyError());
    }
    if (success) {
      toast.success("Company profile saved successfully!", { theme: "colored" });
      dispatch(clearCompanySuccess());
    }
  }, [companyError, success, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target || e; // Handle both native events and shadcn Select
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Please upload a PNG or JPG file for the logo.", { theme: "colored" });
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Logo file size must be under 5MB.", { theme: "colored" });
      return;
    }
    setFormData((prev) => ({ ...prev, logo: file }));
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleDocumentChange = (e, index) => {
    const file = e.target.files[0];
    if (file && !["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Please upload a PDF, JPG, or PNG file for the document.", {
        theme: "colored",
      });
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("Document file size must be under 10MB.", { theme: "colored" });
      return;
    }
    const newDocuments = [...formData.documents];
    newDocuments[index] = file;
    setFormData((prev) => ({ ...prev, documents: newDocuments }));
    const newPreviews = [...documentPreviews];
    newPreviews[index] = { url: URL.createObjectURL(file), type: documentTypes[index] };
    setDocumentPreviews(newPreviews);
  };

  const handleDocumentTypeChange = (e, index) => {
    const newTypes = [...documentTypes];
    newTypes[index] = e.target?.value || e; // Handle both native events and shadcn Select
    setDocumentTypes(newTypes);
  };

  const addDocumentField = () => {
    if (formData.documents.length >= 5) {
      toast.error("Maximum 5 documents allowed.", { theme: "colored" });
      return;
    }
    setFormData((prev) => ({ ...prev, documents: [...prev.documents, null] }));
    setDocumentTypes([...documentTypes, ""]);
    setDocumentPreviews([...documentPreviews, null]);
  };

  const removeDocumentField = (index) => {
    const newDocuments = formData.documents.filter((_, i) => i !== index);
    const newTypes = documentTypes.filter((_, i) => i !== index);
    const newPreviews = documentPreviews.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, documents: newDocuments }));
    setDocumentTypes(newTypes);
    setDocumentPreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ["name", "industry", "email"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill out required fields: ${missingFields.join(", ")}`, {
        theme: "colored",
      });
      return;
    }

    if (formData.name.length < 3 || formData.name.length > 100) {
      toast.error("Company name must be 3-100 characters.", { theme: "colored" });
      return;
    }
    if (formData.about && formData.about.length > 500) {
      toast.error("About section must be under 500 characters.", { theme: "colored" });
      return;
    }
    if (formData.description && formData.description.length > 1000) {
      toast.error("Description must be under 1000 characters.", { theme: "colored" });
      return;
    }
    if (formData.website && !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(\/.*)?$/.test(formData.website)) {
      toast.error("Please enter a valid website URL (e.g., https://example.com).", {
        theme: "colored",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid contact email.", { theme: "colored" });
      return;
    }
    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      toast.error("Please enter a valid contact phone number.", { theme: "colored" });
      return;
    }
    if (
      formData.established &&
      (isNaN(formData.established) ||
        formData.established < 1800 ||
        formData.established > new Date().getFullYear())
    ) {
      toast.error(`Founded year must be between 1800 and ${new Date().getFullYear()}.`, {
        theme: "colored",
      });
      return;
    }
    for (const platform in formData.socialLinks) {
      if (
        formData.socialLinks[platform] &&
        !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(\/.*)?$/.test(formData.socialLinks[platform])
      ) {
        toast.error(`Please enter a valid ${platform} URL.`, { theme: "colored" });
        return;
      }
    }
    if (formData.documents.length > 0 && formData.documents.some((doc, i) => !documentTypes[i])) {
      toast.error("Please specify a type for each uploaded document.", { theme: "colored" });
      return;
    }

    dispatch(saveCompanyProfile({ formData, documentTypes }));
  };

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Construction",
    "Hospitality",
    "BPO",
    "Logistics",
    "Other",
  ];
  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1001+ employees",
  ];
  const documentTypesOptions = [
    "business_registration",
    "gst_certificate",
    "pan_card",
    "proof_of_address",
    "ein",
  ];

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-5 lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-foreground lg:mb-7 text-center">Company Profile</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-6">
            <CompanyMetaCard
              formData={formData}
              handleInputChange={handleInputChange}
              industries={industries}
              companySizes={companySizes}
            />
            <CompanyInfoCard
              formData={formData}
              handleInputChange={handleInputChange}
              handleSocialLinkChange={handleSocialLinkChange}
            />
            <CompanyContactCard
              formData={formData}
              logoPreview={logoPreview}
              documentPreviews={documentPreviews}
              documentTypes={documentTypes}
              handleFileChange={handleFileChange}
              handleDocumentChange={handleDocumentChange}
              handleDocumentTypeChange={handleDocumentTypeChange}
              addDocumentField={addDocumentField}
              removeDocumentField={removeDocumentField}
              documentTypesOptions={documentTypesOptions}
            />
          </div>
          <div className="flex justify-center mt-8">
            <Button type="submit" disabled={loading} className={loading ? "opacity-50" : ""}>
              {loading ? (
                <>
                  <BarLoader width={24} height={4} color="#fff" className="mr-2" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CmpProfile;