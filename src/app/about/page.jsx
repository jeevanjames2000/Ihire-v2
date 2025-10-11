"use client";

import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen px-6 py-16 bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">About Us – iHire</h1>
          <p className="text-lg sm:text-xl text-gray-700">
            iHire is a professional job portal committed to transforming the way employers and job seekers connect. 
            Established with the vision of creating a transparent, efficient, and reliable recruitment platform, 
            iHire serves as a bridge between organizations seeking talent and individuals aspiring for career growth.
          </p>
        </section>

        {/* Mission */}
        <section className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold border-l-4 border-[#48adb9] pl-3">Our Mission</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            To empower professionals with opportunities that align with their skills and ambitions, 
            while enabling employers to identify and recruit the best talent with ease and efficiency.
          </p>
        </section>

        {/* What We Offer */}
        <section className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold border-l-4 border-[#48adb9] pl-3">What We Offer</h2>
          <ul className="list-disc list-inside text-gray-700 text-base sm:text-lg space-y-1">
            <li>Comprehensive Job Listings across multiple industries including IT, Non-IT, Management, Marketing, Sales, Design, and more.</li>
            <li>Advanced Search & Filter Tools to match candidates with the right opportunities.</li>
            <li>Employer Solutions that simplify recruitment through job postings, resume management, and candidate shortlisting.</li>
            <li>Seamless User Experience with an intuitive interface and regularly updated job opportunities.</li>
          </ul>
        </section>

        {/* Vision */}
        <section className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold border-l-4 border-[#48adb9] pl-3">Our Vision</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            To be recognized as a trusted recruitment partner by delivering value-driven solutions that foster growth for both professionals and businesses.
          </p>
          <p className="text-gray-700 text-base sm:text-lg">
            At iHire, we are committed to setting new benchmarks in recruitment by ensuring authenticity, accessibility, and excellence in every interaction.
          </p>
          <p className="font-semibold text-gray-900 text-base sm:text-lg">
            iHire – Connecting Talent with Opportunity.
          </p>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
