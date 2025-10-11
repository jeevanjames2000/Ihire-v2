"use client";

import React from "react";

const ServicesPage = () => {
  return (
    <div className="min-h-screen px-6 py-16 bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">Our Services</h1>
          <p className="text-lg sm:text-xl text-gray-700">
            iHire offers a suite of services designed to connect employers with the best talent and help job seekers find the right opportunities.
          </p>
        </section>

        {/* Job Listings */}
        <section className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold border-l-4 border-[#48adb9] pl-3">Job Listings</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            We provide comprehensive job listings across multiple industries including IT, Non-IT, Management, Marketing, Sales, Design, and more. Job seekers can easily search and apply for opportunities that match their skills and experience.
          </p>
        </section>

        {/* Resume Management */}
        <section className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold border-l-4 border-[#48adb9] pl-3">Resume Management</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            Our platform allows job seekers to upload, update, and manage their resumes efficiently. Employers can access resumes, shortlist candidates, and reach out directly for suitable job openings.
          </p>
        </section>

        {/* Employer Solutions */}
        <section className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold border-l-4 border-[#48adb9] pl-3">Employer Solutions</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            We provide employers with tools to post jobs, manage applications, filter candidates, and track recruitment progress. Our dashboard simplifies the hiring process and ensures you find the right talent quickly.
          </p>
        </section>

        {/* Career Guidance */}
        <section className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold border-l-4 border-[#48adb9] pl-3">Career Guidance</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            iHire also offers career advice and guidance to help job seekers make informed career decisions. From resume tips to interview preparation, our platform supports professional growth at every stage.
          </p>
        </section>

        {/* Support Services */}
        <section className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold border-l-4 border-[#48adb9] pl-3">Support Services</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            Our dedicated support team is available to assist both employers and job seekers. Whether you have questions about using the platform or need help with job applications, we are here to help.
          </p>
        </section>

      </div>
    </div>
  );
};

export default ServicesPage;
