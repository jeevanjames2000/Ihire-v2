"use client";

import React from "react";

const TermsPage = () => {
  return (
    <div className="min-h-screen px-6 py-16 bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">Terms of Service</h1>
          <p className="text-lg sm:text-xl text-gray-700">
            Please read these Terms of Service ( "Terms of Service") carefully before using the iHire Job Portal website.
          </p>
        </div>

        {/* Acceptance of Terms */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            By accessing and using the iHire Job Portal, you agree to be bound by these Terms. If you do not agree, please do not use our services.
          </p>
        </section>

        {/* User Responsibilities */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">User Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-700 text-base sm:text-lg space-y-1">
            <li>Provide accurate and truthful information when creating an account or posting a job.</li>
            <li>Maintain the confidentiality of your login credentials.</li>
            <li>Use the platform for lawful purposes only.</li>
            <li>Respect intellectual property and privacy rights of other users.</li>
          </ul>
        </section>

        {/* Limitation of Liability */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            iHire is not responsible for any direct, indirect, incidental, or consequential damages arising from the use of our platform. Users acknowledge that all job postings and applications are done at their own risk.
          </p>
        </section>

        {/* Modifications */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Modifications</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            iHire reserves the right to update or modify these Terms at any time. Updated Terms will be effective immediately upon posting. Users are encouraged to review Terms regularly.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            If you have any questions about these Terms, please contact us at 
            <span className="text-orange-500"> support@ihire.com</span>.
          </p>
        </section>

      </div>
    </div>
  );
};

export default TermsPage;
