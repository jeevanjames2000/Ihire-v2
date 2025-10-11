"use client";

import React from "react";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen px-6 py-16 bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">Privacy Policy</h1>
          <p className="text-lg sm:text-xl text-gray-700">
            Your privacy is important to us. This Privacy Policy explains how iHire collects, uses, and protects your personal information.
          </p>
        </div>

        {/* Information Collection */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            We may collect personal information such as your name, email address, resume, and employment history when you create an account or apply for jobs. We also collect non-personal information for analytics and performance optimization.
          </p>
        </section>

        {/* Use of Information */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            Your information is used to provide job matching services, communicate updates, improve our platform, and for legal compliance. We do not sell your personal information to third parties.
          </p>
        </section>

        {/* Data Protection */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Data Protection</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            We implement appropriate security measures to protect your data from unauthorized access, alteration, or disclosure. Your data is stored securely and only accessible by authorized personnel.
          </p>
        </section>

        {/* User Rights */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Your Rights</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            You have the right to access, update, or request deletion of your personal information. You can also opt out of promotional communications at any time.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            If you have any questions or concerns about this Privacy Policy, please contact us at 
            <span className="text-orange-500"> support@ihire.com</span>.
          </p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPage;
