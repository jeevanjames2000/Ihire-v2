"use client";

import React from "react";

const CareersPage = () => {
  const jobs = [
    {
      title: "Frontend Developer",
      department: "IT & Development",
      location: "Remote / India",
      description:
        "We are looking for a skilled Frontend Developer proficient in React and Next.js to join our dynamic team."
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote / India",
      description:
        "Looking for a creative Marketing Specialist to develop campaigns and improve brand visibility."
    },
    {
      title: "HR Manager",
      department: "Human Resources",
      location: "Bangalore, India",
      description:
        "Seeking an experienced HR Manager to manage recruitment, employee engagement, and performance."
    }
  ];

  return (
    <div className="min-h-screen px-6 py-16 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Careers at iHire</h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Join our team and help us revolutionize the way employers and job seekers connect. Explore exciting opportunities and grow your career with iHire.
          </p>
        </section>

        {/* Open Positions */}
        <section className="space-y-10">
          <h2 className="text-3xl font-semibold border-l-4 border-[#48adb9] pl-4 text-gray-900">Open Positions</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-[#2a6b73]">{job.title}</h3>
                  <p className="text-gray-500 mt-1 text-sm">{job.department} | {job.location}</p>
                  <p className="text-gray-700 mt-3 text-base">{job.description}</p>
                </div>
                <a
                  href="/apply"
                  className="mt-4 inline-block px-5 py-2 bg-[#48adb9] text-white font-semibold rounded-lg text-center hover:bg-[#2a6b73] transition-colors"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-semibold border-l-4 border-[#48adb9] pl-4 text-gray-900 mb-4">Why Work With Us</h2>
          <p className="text-gray-700 text-base sm:text-lg space-y-2">
            At iHire, we value talent, innovation, and collaboration. We provide opportunities for learning and growth, flexible working options, and a supportive work environment to help you excel in your career.  
            Join us to be part of a forward-thinking team that makes a real impact in the job market.
          </p>
        </section>

      </div>
    </div>
  );
};

export default CareersPage;
